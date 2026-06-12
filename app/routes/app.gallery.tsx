import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, Grid, BlockStack, Badge, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { injectSectionToTheme, seedSectionCatalog } from "../services/sections.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  // Seed the catalog if it's empty
  const count = await prisma.sectionCatalog.count();
  if (count === 0) {
    await seedSectionCatalog();
  }

  const sections = await prisma.sectionCatalog.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  });

  return json({ sections });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const sectionKey = formData.get("sectionKey") as string;
  const intent = formData.get("intent") as string;

  if (intent === "inject") {
    try {
      const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
      if (!shop) throw new Error("Shop not found in DB");

      // We'll inject into the active theme for now
      await injectSectionToTheme({ shopDomain: shop.shopDomain, accessToken: shop.accessToken }, "active", sectionKey);
      
      return json({ success: true, message: `Successfully added ${sectionKey} to your theme!` });
    } catch (error: any) {
      return json({ success: false, error: error.message }, { status: 500 });
    }
  }

  return json({ success: false, error: "Invalid intent" }, { status: 400 });
}

export default function Gallery() {
  const { sections } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const isInjecting = fetcher.state !== "idle";

  return (
    <Page title="Section Library" subtitle="Browse and add premium sections to your theme">
      <Layout>
        <Layout.Section>
          {fetcher.data?.success === true && (
            <Banner tone="success" title="Section Added">
              <p>{fetcher.data.message}</p>
            </Banner>
          )}
          {fetcher.data?.success === false && (
            <Banner tone="critical" title="Error Adding Section">
              <p>{fetcher.data.error}</p>
            </Banner>
          )}
          <div style={{ marginTop: '20px' }}>
            <Grid>
              {sections.map((section) => (
                <Grid.Cell key={section.key} columnSpan={{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}}>
                  <Card>
                    <BlockStack gap="400">
                      <img 
                        src={section.thumbUrl} 
                        alt={section.name} 
                        style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #e1e3e5' }} 
                      />
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingMd">{section.name}</Text>
                        <div>
                          <Badge tone="info">{section.category}</Badge>
                          {section.planMin === 'PRO' && <Badge tone="warning">PRO</Badge>}
                        </div>
                      </BlockStack>
                      <fetcher.Form method="post">
                        <input type="hidden" name="sectionKey" value={section.key} />
                        <input type="hidden" name="intent" value="inject" />
                        <Button 
                          submit 
                          variant="primary" 
                          loading={isInjecting && fetcher.formData?.get('sectionKey') === section.key}
                          fullWidth
                        >
                          Add to Theme
                        </Button>
                      </fetcher.Form>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
