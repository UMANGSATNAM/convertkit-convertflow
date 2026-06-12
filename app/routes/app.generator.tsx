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

  const handleStart = () => {
    submit(
      { actionType: "START_GENERATION", nicheId: selectedNiche },
      { method: "POST" }
    );
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
              <p>Your store has been successfully generated using the {activeGen.nicheId} niche!</p>
            </Banner>
          )}

          {activeGen?.status === "FAILED" && (
            <Banner tone="critical" title="Generation Failed">
              <p>An error occurred while generating the store. Please try again. ({activeGen.error?.message || "Unknown error"})</p>
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
