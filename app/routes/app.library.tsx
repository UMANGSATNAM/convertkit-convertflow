import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Tabs, Badge, Grid, Button, Modal } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const loader = async () => {
  const blocksDir = path.join(process.cwd(), "extensions", "sf-sections", "blocks");
  const files = fs.existsSync(blocksDir) ? fs.readdirSync(blocksDir) : [];

  const sections = files
    .filter(f => f.endsWith(".liquid"))
    .map(filename => {
      const content = fs.readFileSync(path.join(blocksDir, filename), "utf8");
      // Extract schema name roughly
      const match = content.match(/"name":\s*"([^"]+)"/);
      const name = match ? match[1] : filename.replace(".liquid", "");
      
      let category = "Unknown";
      if (filename.startsWith("hero")) category = "Hero";
      else if (filename.startsWith("product")) category = "Product";
      else if (filename.startsWith("trust")) category = "Trust";
      else if (filename.startsWith("content")) category = "Content";
      else if (filename.startsWith("conversion")) category = "Conversion";
      else if (filename.startsWith("india_special")) category = "India Special";
      else if (filename.startsWith("layout")) category = "Pro Layouts";

      return {
        id: filename,
        name,
        category,
        image: `https://via.placeholder.com/400x250?text=${encodeURIComponent(name)}`
      };
    });

  return json({ sections });
};

export default function SectionLibrary() {
  const { sections } = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [activePreview, setActivePreview] = useState<any>(null);

  const tabs = [
    { id: "all", content: "All", category: null },
    { id: "hero", content: "Heroes", category: "Hero" },
    { id: "product", content: "Products", category: "Product" },
    { id: "trust", content: "Trust", category: "Trust" },
    { id: "content", content: "Content", category: "Content" },
    { id: "conversion", content: "Conversion", category: "Conversion" },
    { id: "india", content: "India Special", category: "India Special" },
    { id: "pro", content: "Pro Layouts", category: "Pro Layouts" },
  ];

  const currentCategory = tabs[selectedTab].category;
  const filteredSections = currentCategory 
    ? sections.filter(s => s.category === currentCategory)
    : sections;

  return (
    <Page title="Section Library" subtitle="Browse 120 premium Liquid sections ready to be injected into your store.">
      <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
        <div style={{ marginTop: "20px" }}>
          <Text as="p" variant="bodyMd">
            Showing {filteredSections.length} components
          </Text>
          <div style={{ marginTop: "16px" }}>
            <Grid>
              {filteredSections.map(section => (
                <Grid.Cell key={section.id} columnSpan={{xs: 6, sm: 4, md: 3, lg: 3, xl: 3}}>
                  <Card padding="0">
                    <img 
                      src={section.image} 
                      alt={section.name} 
                      style={{ width: "100%", height: "auto", display: "block", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", cursor: "pointer" }} 
                      onClick={() => setActivePreview(section)}
                    />
                    <div style={{ padding: "12px" }}>
                      <Text as="h3" variant="headingSm">{section.name}</Text>
                      <div style={{ marginTop: "8px" }}>
                        <Badge tone="info">{section.category}</Badge>
                      </div>
                    </div>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          </div>
        </div>
      </Tabs>

      <Modal
        open={!!activePreview}
        onClose={() => setActivePreview(null)}
        title={activePreview?.name}
        primaryAction={{
          content: 'Close',
          onAction: () => setActivePreview(null),
        }}
        secondaryActions={[
          {
            content: 'Copy ID',
            onAction: () => {
              if (activePreview) {
                navigator.clipboard.writeText(activePreview.id);
                // Optionally show a toast here
              }
            },
          },
        ]}
      >
        <Modal.Section>
          {activePreview && (
            <BlockStack gap="400">
              <img src={activePreview.image} alt={activePreview.name} style={{ width: "100%", borderRadius: "8px" }} />
              <Text as="p">
                This is a premium {activePreview.category} section perfectly integrated into the StoreForge ecosystem.
                You can add this directly from the Theme Editor in Shopify.
              </Text>
              <Text as="p"><strong>File:</strong> <code>{activePreview.id}</code></Text>
            </BlockStack>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
