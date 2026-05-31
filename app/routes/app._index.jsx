import { Page, Layout, Text, Card } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <Text variant="heading3xl" as="h1">
                Welcome to our app
              </Text>
              <p style={{ marginTop: "1rem" }}>
                This is a fresh, clean start.
              </p>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
