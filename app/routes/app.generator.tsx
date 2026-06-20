import { useState } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Select,
  TextField,
  InlineStack,
  ProgressBar,
  Banner,
  Modal,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

import { generatorQueue } from "../services/queue.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const niches = await prisma.niche.findMany({ where: { active: true } });
  
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  
  // Check if there is an active generation
  const activeGen = shop ? await prisma.storeGeneration.findFirst({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  }) : null;

  return json({ niches, activeGen });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const nicheId = formData.get("nicheId") as string;
  const actionType = formData.get("actionType") as string;

  if (actionType === "START_GENERATION") {
    const shop = await prisma.shop.upsert({
      where: { shopDomain: session.shop },
      update: { accessToken: session.accessToken || "" },
      create: { shopDomain: session.shop, accessToken: session.accessToken || "" }
    });

    // 1. Create generation record
    const gen = await prisma.storeGeneration.create({
      data: {
        shopId: shop.id,
        nicheId,
        catalogMode: "DEMO",
        status: "QUEUED",
      }
    });

    // 2. Enqueue the BullMQ job
    await generatorQueue.add("generate-store", { generationId: gen.id });

    return json({ success: true, generationId: gen.id });
  }

  if (actionType === "CANCEL_GENERATION") {
    const generationId = formData.get("generationId") as string;
    
    await prisma.storeGeneration.update({
      where: { id: generationId },
      data: {
        status: "FAILED",
        error: { message: "Cancelled by user." },
      }
    });

    console.error(`[Generator] User manually cancelled generation: ${generationId}`);

    return json({ success: true, cancelled: true });
  }

  if (actionType === "TRACK_PREVIEW") {
    const generationId = formData.get("generationId") as string;
    const { trackEvent } = await import("../services/posthog.server");
    trackEvent(session.shop, "preview_opened", { themeId: formData.get("themeId") });
    
    // Log to UsageCounter
    const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
    if (shop) {
      await prisma.usageCounter.upsert({
        where: { shopId_metric_period: { shopId: shop.id, metric: "PREVIEW_OPENED", period: "ALL_TIME" } },
        update: { count: { increment: 1 } },
        create: { shopId: shop.id, metric: "PREVIEW_OPENED", period: "ALL_TIME", count: 1 }
      });
    }

    return json({ success: true });
  }

  if (actionType === "PUBLISH_THEME") {
    const themeId = formData.get("themeId") as string;
    const generationId = formData.get("generationId") as string;
    const { trackEvent } = await import("../services/posthog.server");
    trackEvent(session.shop, "publish_clicked", { themeId });
    
    // Publish logic
    const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
    if (shop) {
      const { publishTheme } = await import("../services/theme-engine/index");
      try {
        await publishTheme(shop, themeId);
        trackEvent(session.shop, "theme_published", { themeId });
        
        await prisma.usageCounter.upsert({
          where: { shopId_metric_period: { shopId: shop.id, metric: "THEME_PUBLISHED", period: "ALL_TIME" } },
          update: { count: { increment: 1 } },
          create: { shopId: shop.id, metric: "THEME_PUBLISHED", period: "ALL_TIME", count: 1 }
        });

        if (generationId) {
          await prisma.storeGeneration.update({
            where: { id: generationId },
            data: { status: "DONE" } // Officially done when published
          });
        }

        return json({ success: true, published: true });
      } catch (err) {
        console.error("Publish failed:", err);
        return json({ error: "Publish failed" }, { status: 500 });
      }
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function Generator() {
  const { niches, activeGen } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const isSubmitting = navigation.state === "submitting";
  const revalidator = useRevalidator();

  const [step, setStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState(niches[0]?.id || "");
  
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [feedbackNotes, setFeedbackNotes] = useState("");

  const handleStart = () => {
    submit(
      { actionType: "START_GENERATION", nicheId: selectedNiche },
      { method: "POST" }
    );
  };
  
  const handleFeedbackSubmit = () => {
    submit(
      { 
        generationId: activeGen?.id || "",
        rating: feedbackRating,
        notes: feedbackNotes
      },
      { method: "POST", action: "/api/feedback" }
    );
    setFeedbackModalOpen(false);
  };

  const isGenerating = activeGen && !["DONE", "FAILED"].includes(activeGen.status);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        revalidator.revalidate();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, revalidator]);

  if (isGenerating) {
    return (
      <Page title="Store Generation in Progress">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Building your store...</Text>
                <ProgressBar progress={50} tone="primary" />
                <Text as="p">Current Status: {activeGen.status}</Text>
                <Text as="p" tone="subdued">This process usually takes 30-60 seconds.</Text>
                <div style={{ marginTop: "1rem" }}>
                  <Button 
                    tone="critical" 
                    disabled={isSubmitting}
                    onClick={() => {
                      submit(
                        { actionType: "CANCEL_GENERATION", generationId: activeGen.id },
                        { method: "POST" }
                      );
                    }}
                  >
                    Cancel Generation
                  </Button>
                </div>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Store Generator">
      <Layout>
        <Layout.Section>
          {activeGen?.status === "DONE" && (
            <Banner tone="success" title="Store Generation Complete!">
              <BlockStack gap="400">
                <Text as="p">Your store has been successfully generated using the {activeGen.nicheId} niche!</Text>
                <InlineStack gap="300">
                  <Button 
                    target="_blank" 
                    url={`https://${(activeGen as any).shop?.shopDomain}?preview_theme_id=${activeGen.themeId}`}
                    onClick={() => {
                       submit({ actionType: "TRACK_PREVIEW", themeId: activeGen.themeId, generationId: activeGen.id }, { method: "POST" });
                    }}
                  >
                    Preview Store
                  </Button>
                  <Button 
                    variant="primary" 
                    tone="success"
                    onClick={() => {
                       submit({ actionType: "PUBLISH_THEME", themeId: activeGen.themeId, generationId: activeGen.id }, { method: "POST" });
                       setFeedbackModalOpen(true);
                    }}
                  >
                    Publish Theme
                  </Button>
                </InlineStack>
              </BlockStack>
            </Banner>
          )}

          <Modal
            open={isFeedbackModalOpen}
            onClose={() => setFeedbackModalOpen(false)}
            title="How did we do?"
            primaryAction={{
              content: 'Submit Feedback',
              onAction: handleFeedbackSubmit,
            }}
            secondaryActions={[
              {
                content: 'Skip',
                onAction: () => setFeedbackModalOpen(false),
              },
            ]}
          >
            <Modal.Section>
              <BlockStack gap="400">
                <Text as="p">Your theme is now published! How would you rate the generated store out of 5?</Text>
                <Select
                  label="Rating"
                  options={["1", "2", "3", "4", "5"]}
                  value={feedbackRating}
                  onChange={setFeedbackRating}
                />
                <TextField
                  label="Optional Notes"
                  value={feedbackNotes}
                  onChange={setFeedbackNotes}
                  multiline={3}
                  autoComplete="off"
                />
              </BlockStack>
            </Modal.Section>
          </Modal>

          {activeGen?.status === "FAILED" && (
            <Banner tone="critical" title="Generation Failed">
              <p>An error occurred while generating the store. Please try again. ({typeof activeGen.error === "object" && activeGen.error !== null ? (activeGen.error as any).message || "Unknown error" : "Unknown error"})</p>
            </Banner>
          )}

          <Card>
            <BlockStack gap="400">
              {step === 1 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Step 1: Select Niche</Text>
                  <Select
                    label="Business Niche"
                    options={niches.map(n => ({ label: n.name, value: n.id }))}
                    value={selectedNiche}
                    onChange={setSelectedNiche}
                  />
                  <InlineStack align="end">
                    <Button variant="primary" onClick={() => setStep(2)}>Next</Button>
                  </InlineStack>
                </BlockStack>
              )}

              {step === 2 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Step 2: Brand Identity</Text>
                  <Text as="p">The theme will be initialized with the predefined color palette for {selectedNiche}.</Text>
                  <InlineStack align="space-between">
                    <Button onClick={() => setStep(1)}>Back</Button>
                    <Button variant="primary" onClick={() => setStep(3)}>Next</Button>
                  </InlineStack>
                </BlockStack>
              )}

              {step === 3 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Step 3: Catalog Options</Text>
                  <Text as="p">We will import the mock catalog for {selectedNiche} (Products, Variants, Images).</Text>
                  <InlineStack align="space-between">
                    <Button onClick={() => setStep(2)}>Back</Button>
                    <Button variant="primary" onClick={() => setStep(4)}>Next</Button>
                  </InlineStack>
                </BlockStack>
              )}

              {step === 4 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Step 4: Review & Build</Text>
                  <Text as="p">You are about to build a store for the <strong>{selectedNiche}</strong> niche.</Text>
                  <InlineStack align="space-between">
                    <Button onClick={() => setStep(3)}>Back</Button>
                    <Button 
                      variant="primary" 
                      onClick={handleStart} 
                      loading={isSubmitting}
                      tone="success"
                    >
                      Start Generation
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
