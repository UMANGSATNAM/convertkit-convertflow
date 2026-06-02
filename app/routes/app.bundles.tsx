import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Grid,
  Badge,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

const BUNDLES = [
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    description: "A clean, modern layout tailored for beauty brands.",
    imageUrl: "https://via.placeholder.com/600x400?text=Beauty+Template"
  },
  {
    id: "electronics",
    name: "Tech & Electronics",
    description: "Sleek, tech-focused design with emphasis on specs.",
    imageUrl: "https://via.placeholder.com/600x400?text=Tech+Template"
  },
  {
    id: "fashion",
    name: "Streetwear Fashion",
    description: "Bold imagery and typography for modern fashion stores.",
    imageUrl: "https://via.placeholder.com/600x400?text=Fashion+Template"
  }
];

export default function NicheBundlesPage() {
  const fetcher = useFetcher();
  const [injectingId, setInjectingId] = useState(null);

  const handleApply = (bundleId) => {
    setInjectingId(bundleId);
    fetcher.submit(
      { nicheName: bundleId },
      { method: "post", action: "/api/bundles/inject", encType: "application/json" }
    );
  };

  if (fetcher.state === "idle" && fetcher.data && injectingId) {
    if (fetcher.data.success) {
      shopify.toast.show("Bundle applied successfully to your active theme!");
    } else {
      shopify.toast.show(fetcher.data.error || "Failed to apply bundle", { isError: true });
    }
    setInjectingId(null);
  }

  return (
    <Page title="Niche Template Bundles" subtitle="Instantly transform your store into a high-converting, fully editable niche design.">
      <Layout>
        <Layout.Section>
          <Grid>
            {BUNDLES.map((bundle) => (
              <Grid.Cell key={bundle.id} columnSpan={{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}}>
                <Card padding="0">
                  <img 
                    src={bundle.imageUrl} 
                    alt={bundle.name} 
                    style={{width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}} 
                  />
                  <div style={{padding: '16px'}}>
                    <BlockStack gap="200">
                      <Text variant="headingMd" as="h3">{bundle.name}</Text>
                      <Text variant="bodySm" as="p" tone="subdued">{bundle.description}</Text>
                      <Badge tone="success">Full Store Overwrite</Badge>
                      <div style={{ marginTop: '12px' }}>
                        <Button 
                          fullWidth 
                          variant="primary" 
                          onClick={() => handleApply(bundle.id)}
                          loading={fetcher.state !== "idle" && injectingId === bundle.id}
                        >
                          Apply Bundle to Theme
                        </Button>
                      </div>
                    </BlockStack>
                  </div>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">How it works</Text>
              <Text as="p">
                When you click "Apply Bundle", our engine injects all the necessary sections, templates (like index.json), and assets directly into your <strong>active theme</strong>. We automatically take a backup of your current templates (e.g. index.convertkit_backup.json) so you can safely revert if needed. You can then fully customize the injected template in the Shopify Theme Editor.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
