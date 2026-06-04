import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Grid,
  Badge,
  InlineStack,
  Banner
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";

export const loader = async ({ request }: any) => {
  await authenticate.admin(request);
  
  const templates = [
    {
      id: "minimal-fashion",
      name: "Minimal Fashion",
      tags: ["Fashion", "Minimal", "Apparel"],
      description: "Clean, editorial, white space heavy, serif headings, black/white palette.",
      previewImage: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png"
    }
  ];

  return json({ templates });
};

export default function Templates() {
  const { templates } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const isInjecting = fetcher.state !== "idle";
  const fetcherData = fetcher.data as any;
  const successMsg = fetcherData?.success ? fetcherData.message : null;
  const errorMsg = fetcherData?.error ? fetcherData.error : null;

  return (
    <Page 
      title="Store Cloner & Niche Templates" 
      subtitle="Instantly inject fully-designed niche stores. We automatically fetch and map your existing products and collections to the new design."
    >
      <Layout>
        {successMsg && (
          <Layout.Section>
            <Banner title="Template Injected Successfully" tone="success">
              <p>{successMsg}</p>
            </Banner>
          </Layout.Section>
        )}
        {errorMsg && (
          <Layout.Section>
            <Banner title="Injection Failed" tone="critical">
              <p>{errorMsg}</p>
            </Banner>
          </Layout.Section>
        )}
        <Layout.Section>
          <Grid>
            {templates.map(template => (
              <Grid.Cell key={template.id} columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
                <Card padding="0">
                  <div style={{ position: 'relative', height: '250px', backgroundColor: '#f4f6f8', overflow: 'hidden' }}>
                    <img 
                      src={template.previewImage} 
                      alt={template.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <Badge tone="success">Auto-Syncs Products</Badge>
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <BlockStack gap="300">
                      <div>
                        <Text as="h3" variant="headingLg">{template.name}</Text>
                        <div style={{ marginTop: '0.5rem' }}>
                          <InlineStack gap="100">
                            {template.tags.map(tag => (
                              <Badge key={tag} tone="info">{tag}</Badge>
                            ))}
                          </InlineStack>
                        </div>
                      </div>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        {template.description}
                      </Text>
                      <div style={{ marginTop: '1rem' }}>
                        <fetcher.Form method="post" action="/api/theme/inject">
                          <input type="hidden" name="templateId" value={template.id} />
                          <Button 
                            variant="primary" 
                            size="large"
                            fullWidth 
                            submit
                            loading={isInjecting}
                          >
                            {isInjecting ? "Cloning & Syncing..." : "1-Click Clone Store"}
                          </Button>
                        </fetcher.Form>
                      </div>
                    </BlockStack>
                  </div>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
