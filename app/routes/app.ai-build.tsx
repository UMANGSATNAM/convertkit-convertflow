import { ActionFunctionArgs, json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, Text, Button, InlineStack, Banner } from "@shopify/polaris";
import { analyzeStoreScreenshot } from "../services/ai/vision.server";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { Queue } from "bullmq";
import { redis } from "../services/redis.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 5_000_000,
  });
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  const image = formData.get("screenshot") as File;
  if (!image || typeof image === "string" || image.size === 0) {
    return json({ error: "Please upload a screenshot" }, { status: 400 });
  }

  try {
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mediaType = image.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

    // 1. Analyze with AI
    const extractedData = await analyzeStoreScreenshot(base64Image, mediaType);

    // 2. Lookup shop
    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) return json({ error: "Shop not found" }, { status: 404 });

    // 3. Create Generation Job
    const generation = await prisma.storeGeneration.create({
      data: {
        shopId: shop.id,
        nicheId: "ai-custom",
        catalogMode: "EMPTY",
        status: "QUEUED",
        aiPayload: extractedData as any
      }
    });

    const generatorQueue = new Queue("generator", { connection: redis as any });
    await generatorQueue.add("generateStore", { generationId: generation.id });

    return json({ success: true, generationId: generation.id, data: extractedData });
  } catch (err: any) {
    console.error("AI Generation Error:", err);
    return json({ error: err.message }, { status: 500 });
  }
};

export default function AIBuilderPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Page title="Magic AI Store Builder" subtitle="Turn a screenshot into a fully functional Shopify store">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {actionData?.error && (
              <Banner title="Error" tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}

            {actionData?.success && (
              <Banner title="AI Analysis Complete!" tone="success">
                <p>Your store generation is now queued and processing in the background.</p>
                <p><strong>Extracted Colors:</strong></p>
                <ul>
                  <li>Primary: {actionData.data.colors.primary}</li>
                  <li>Background: {actionData.data.colors.background}</li>
                </ul>
              </Banner>
            )}

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Upload Target Screenshot</Text>
                <Text as="p">Upload a screenshot of the store you want to clone. Our AI will extract the layout, color palette, and typography to build an identical Shopify theme.</Text>
                
                <Form method="post" encType="multipart/form-data">
                  <BlockStack gap="400">
                    <div>
                      <input type="file" name="screenshot" accept="image/jpeg, image/png, image/webp" />
                    </div>
                    <InlineStack align="end">
                      <Button submit variant="primary" loading={isSubmitting}>
                        Generate Magic Store
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Form>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
