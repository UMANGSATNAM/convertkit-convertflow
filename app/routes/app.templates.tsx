import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Grid,
  Badge,
  InlineStack
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  await authenticate.admin(request);
  
  // Hardcoded for V1 Phase 1, later can be moved to DB or fs scanning
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
  const navigate = useNavigate();

  return (
    <Page title="Template Library" subtitle="Full-store themes designed for maximum conversions.">
      <Layout>
        <Layout.Section>
          <Grid>
            {templates.map(template => (
              <Grid.Cell key={template.id} columnSpan={{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}}>
                <Card padding="0">
                  <div style={{ height: '200px', backgroundColor: '#f4f6f8', overflow: 'hidden' }}>
                    <img 
                      src={template.previewImage} 
                      alt={template.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">{template.name}</Text>
                      <InlineStack gap="100">
                        {template.tags.map(tag => (
                          <Badge key={tag} tone="info">{tag}</Badge>
                        ))}
                      </InlineStack>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {template.description}
                      </Text>
                      <div style={{ marginTop: '0.5rem' }}>
                        <Button 
                          variant="primary" 
                          fullWidth 
                          onClick={() => navigate(`/app/templates/${template.id}`)}
                        >
                          View Details & Apply
                        </Button>
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
