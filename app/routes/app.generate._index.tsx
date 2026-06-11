import { useState } from "react";
import { 
  Page, Layout, Card, Text, Button, BlockStack, 
  InlineStack, ProgressBar, RadioButton, TextField, FormLayout 
} from "@shopify/polaris";
import { useSubmit, useActionData, useNavigation, useRouteError } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { generatorQueue } from "../services/queue.server";

import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  
  // Ensure Shop exists
  const shop = await prisma.shop.upsert({
    where: { shopDomain: session.shop },
    update: {},
    create: {
      shopDomain: session.shop,
      accessToken: session.accessToken || "",
    }
  });

  const formData = await request.formData();
  const nicheId = formData.get("nicheId") as string;
  const catalogMode = formData.get("catalogMode") as "DEMO" | "CSV" | "EMPTY";
  
  // 1. Create Generation Record
  const generation = await prisma.storeGeneration.create({
    data: {
      shopId: shop.id,
      nicheId,
      catalogMode,
      status: "QUEUED",
      log: []
    }
  });

  // 2. Enqueue Background Job
  await generatorQueue.add("generate-store", { generationId: generation.id });

  return json({ success: true, generationId: generation.id });
};

export default function GenerateStore() {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("fashion");
  const [catalog, setCatalog] = useState("DEMO");
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isGenerating = navigation.state === "submitting" || actionData?.success;

  const handleGenerate = () => {
    const formData = new FormData();
    formData.append("shopId", "mock_shop_id"); // Ideally fetched from loader session
    formData.append("nicheId", niche);
    formData.append("catalogMode", catalog);
    
    submit(formData, { method: "post" });
  };

  return (
    <Page title="StoreForge Generator">
      <Layout>
        <Layout.Section>
          {isGenerating ? (
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Generating Your Store...</Text>
                <ProgressBar progress={30} color="primary" />
                <Text as="p">Installing theme, importing products, and configuring settings. This will take a few minutes.</Text>
              </BlockStack>
            </Card>
          ) : (
            <Card>
              <BlockStack gap="500">
                <ProgressBar progress={(step / 4) * 100} size="small" />
                
                {step === 1 && (
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">1. Select Niche</Text>
                    <InlineStack gap="300">
                      <Button pressed={niche === "fashion"} onClick={() => setNiche("fashion")}>Fashion</Button>
                      <Button pressed={niche === "electronics"} onClick={() => setNiche("electronics")}>Electronics</Button>
                      <Button pressed={niche === "beauty"} onClick={() => setNiche("beauty")}>Beauty</Button>
                      {/* Add more niches up to 10 as per spec */}
                    </InlineStack>
                    <Button primary onClick={() => setStep(2)}>Next</Button>
                  </BlockStack>
                )}

                {step === 2 && (
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">2. Brand Configuration</Text>
                    <FormLayout>
                      <TextField label="Store Name" autoComplete="off" />
                      <TextField label="Primary Color" autoComplete="off" value="#000000" />
                      <Button primary onClick={() => setStep(3)}>Next</Button>
                    </FormLayout>
                  </BlockStack>
                )}

                {step === 3 && (
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">3. Catalog Mode</Text>
                    <BlockStack gap="200">
                      <RadioButton
                        label="Demo Catalog (20+ pre-filled products)"
                        checked={catalog === "DEMO"}
                        onChange={() => setCatalog("DEMO")}
                      />
                      <RadioButton
                        label="Empty Catalog"
                        checked={catalog === "EMPTY"}
                        onChange={() => setCatalog("EMPTY")}
                      />
                    </BlockStack>
                    <Button primary onClick={() => setStep(4)}>Next</Button>
                  </BlockStack>
                )}

                {step === 4 && (
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">4. Review & Generate</Text>
                    <Text as="p">Niche: {niche}</Text>
                    <Text as="p">Catalog: {catalog}</Text>
                    <Button primary size="large" onClick={handleGenerate}>
                      Generate Store
                    </Button>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <Page title="StoreForge Generator">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg" tone="critical">Application Error</Text>
              <Text as="p">Something went wrong while processing your request.</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {error instanceof Error ? error.message : JSON.stringify(error)}
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
