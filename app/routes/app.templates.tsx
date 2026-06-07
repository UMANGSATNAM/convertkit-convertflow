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
  Banner,
  Select
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useState } from "react";
import fs from "fs";
import path from "path";

export const loader = async ({ request }: any) => {
  await authenticate.admin(request);
  
  const templatesDir = path.join(process.cwd(), "app/data/templates");
  const templates = [];
  
  if (fs.existsSync(templatesDir)) {
    const templateFolders = fs.readdirSync(templatesDir);
    for (const folder of templateFolders) {
      const manifestPath = path.join(templatesDir, folder, "manifest.json");
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
          templates.push(manifest);
        } catch (e) {
          console.error(`Error parsing manifest for ${folder}:`, e);
        }
      }
    }
  }

  return json({ templates });
};

export default function Templates() {
  const { templates } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedNiche, setSelectedNiche] = useState("All");

  const fetcherData = fetcher.data as any;
  const successMsg = fetcherData?.success ? fetcherData.message : null;
  const errorMsg = fetcherData?.error ? fetcherData.error : null;

  // Extract unique niches for the filter
  const niches = ["All", ...Array.from(new Set(templates.map((t: any) => t.niche).filter(Boolean)))];
  const nicheOptions = niches.map(niche => ({ label: niche, value: niche }));

  const filteredTemplates = selectedNiche === "All" 
    ? templates 
    : templates.filter((t: any) => t.niche === selectedNiche);

  return (
    <Page 
      title="Inject Store Themes" 
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
          <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
            <Select
              label="Filter by Niche"
              options={nicheOptions}
              onChange={setSelectedNiche}
              value={selectedNiche}
            />
          </div>
          <Grid>
            {filteredTemplates.map((template: any) => {
              const isInjectingThis = fetcher.state !== "idle" && fetcher.formData?.get("templateId") === template.id;
              
              return (
                <Grid.Cell key={template.id} columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
                  <Card padding="0">
                    <div style={{ position: 'relative', height: '250px', backgroundColor: '#f4f6f8', overflow: 'hidden' }}>
                      <img 
                        src={template.previewImage || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png"} 
                        alt={template.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <Badge tone="success">Auto-Syncs Products</Badge>
                      </div>
                      {template.niche && (
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                          <Badge tone="info">{template.niche}</Badge>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <BlockStack gap="300">
                        <div>
                          <Text as="h3" variant="headingLg">{template.name}</Text>
                          {template.tags && template.tags.length > 0 && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <InlineStack gap="100">
                                {template.tags.map((tag: string) => (
                                  <Badge key={tag} tone="new">{tag}</Badge>
                                ))}
                              </InlineStack>
                            </div>
                          )}
                        </div>
                        <Text as="p" variant="bodyMd" tone="subdued">
                          {template.description}
                        </Text>
                        {template.style && (
                          <Text as="p" variant="bodySm" tone="subdued">
                            <strong>Style:</strong> {template.style}
                          </Text>
                        )}
                        <div style={{ marginTop: '1rem' }}>
                          <fetcher.Form method="post" action="/api/theme/inject">
                            <input type="hidden" name="templateId" value={template.id} />
                            <Button 
                              variant="primary" 
                              size="large"
                              fullWidth 
                              submit
                              loading={isInjectingThis}
                            >
                              {isInjectingThis ? "Injecting..." : "Inject"}
                            </Button>
                          </fetcher.Form>
                        </div>
                      </BlockStack>
                    </div>
                  </Card>
                </Grid.Cell>
              );
            })}
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
