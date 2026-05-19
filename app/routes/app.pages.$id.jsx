import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Divider,
  Select,
  TextField,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getAllSections } from "../lib/sections/registry";

// Mock database interactions since Prisma schema may vary slightly
export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const sections = getAllSections();
  return json({
    pageId: params.id,
    availableSections: sections,
    initialData: [
      { id: "123", type: "hero-split-image", settings: { title: "Welcome to our store" } }
    ]
  });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const payload = JSON.parse(formData.get("payload"));
  
  // Here we would typically save to Prisma and push to Shopify via Metafields/Theme extension
  
  return json({ success: true, savedAt: new Date().toISOString() });
};

export default function PageEditor() {
  const { pageId, availableSections, initialData } = useLoaderData();
  const submit = useSubmit();
  const nav = useNavigation();
  
  const [blocks, setBlocks] = useState(initialData);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const addBlock = (sectionType) => {
    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: sectionType,
      settings: {}
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlockSetting = (blockId, key, value) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, settings: { ...b.settings, [key]: value } };
      }
      return b;
    }));
  };

  const removeBlock = (blockId) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const handleSave = () => {
    submit({ payload: JSON.stringify(blocks) }, { method: "POST" });
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const selectedSchema = selectedBlock 
    ? availableSections.find(s => s.id === selectedBlock.type)?.schema 
    : null;

  return (
    <Page
      title={`Editing Page: ${pageId}`}
      primaryAction={{
        content: 'Save Page',
        onAction: handleSave,
        loading: nav.state === 'submitting'
      }}
    >
      <Layout>
        {/* Editor Sidebar (Left) */}
        <Layout.Section variant="oneThird">
          <Card padding="0">
            <div style={{ padding: '16px', background: '#f9fafb', borderBottom: '1px solid #e1e3e5' }}>
              <Text variant="headingSm" as="h3">Add Section</Text>
            </div>
            <BlockStack gap="200">
              <div style={{ padding: '16px' }}>
                <InlineStack gap="200" wrap={true}>
                  {availableSections.map(section => (
                    <Button key={section.id} onClick={() => addBlock(section.id)} size="micro">
                      + {section.name}
                    </Button>
                  ))}
                </InlineStack>
              </div>
            </BlockStack>
            <Divider />
            <div style={{ padding: '16px', background: '#f9fafb', borderBottom: '1px solid #e1e3e5' }}>
              <Text variant="headingSm" as="h3">Page Structure</Text>
            </div>
            <BlockStack>
              {blocks.map((block, index) => (
                <div 
                  key={block.id} 
                  onClick={() => setSelectedBlockId(block.id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedBlockId === block.id ? '#f1f8f5' : '#fff',
                    borderBottom: '1px solid #e1e3e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Text variant="bodyMd" fontWeight={selectedBlockId === block.id ? "bold" : "regular"}>
                    {index + 1}. {availableSections.find(s => s.id === block.type)?.name || block.type}
                  </Text>
                  <Button variant="plain" destructive onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>Remove</Button>
                </div>
              ))}
              {blocks.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: '#6d7175' }}>
                  No sections added yet.
                </div>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Settings Sidebar (Right) */}
        <Layout.Section>
          {selectedBlock ? (
            <Card>
              <BlockStack gap="400">
                <Text variant="headingLg" as="h2">Section Settings</Text>
                <Text variant="bodyMd" tone="subdued">Editing: {availableSections.find(s => s.id === selectedBlock.type)?.name}</Text>
                <Divider />
                
                {selectedSchema && selectedSchema.properties ? (
                  Object.entries(selectedSchema.properties).map(([key, prop]) => {
                    const value = selectedBlock.settings[key] !== undefined 
                      ? selectedBlock.settings[key] 
                      : prop.default || "";

                    if (prop.type === "string" && prop.enum) {
                      return (
                        <Select
                          key={key}
                          label={prop.title || key}
                          options={prop.enum.map(e => ({ label: e, value: e }))}
                          value={value}
                          onChange={(v) => updateBlockSetting(selectedBlock.id, key, v)}
                        />
                      );
                    }

                    return (
                      <TextField
                        key={key}
                        label={prop.title || key}
                        value={String(value)}
                        type={prop.type === "number" ? "number" : "text"}
                        onChange={(v) => updateBlockSetting(selectedBlock.id, key, prop.type === "number" ? Number(v) : v)}
                        autoComplete="off"
                      />
                    );
                  })
                ) : (
                  <Text>No configurable settings for this section.</Text>
                )}
              </BlockStack>
            </Card>
          ) : (
            <Card>
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <Text variant="headingMd" tone="subdued">Select a section from the sidebar to edit its settings.</Text>
              </div>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
