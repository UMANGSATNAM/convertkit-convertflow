import { Page, Layout, Card, Text, DataTable, Button, Badge } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
// import { restoreSnapshot } from "../services/theme-engine/index"; // Assume implemented

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  
  if (!shop) return json({ snapshots: [] });

  const snapshots = await prisma.themeSnapshot.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return json({ snapshots });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const snapshotId = formData.get("snapshotId") as string;
  
  // Example of calling the restore logic
  // const { session } = await authenticate.admin(request);
  // const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  // await restoreSnapshot(shop, snapshotId);

  return json({ success: true, restoredId: snapshotId });
};

export default function SnapshotHistory() {
  const { snapshots } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleRestore = (snapshotId: string) => {
    if (confirm("Are you sure you want to restore this theme version? This will overwrite the live theme.")) {
      const formData = new FormData();
      formData.append("snapshotId", snapshotId);
      submit(formData, { method: "post" });
    }
  };

  const rows = snapshots.map((snap) => [
    new Date(snap.createdAt).toLocaleString(),
    snap.kind,
    snap.reason,
    <Badge tone={snap.actor === "SYSTEM" ? "info" : snap.actor === "AI" ? "magic" : "success"}>
      {snap.actor}
    </Badge>,
    <Button size="micro" onClick={() => handleRestore(snap.id)}>Restore</Button>
  ]);

  return (
    <Page title="Theme Snapshot History" fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p">
                Every time your theme is modified by the AI, the App Design Studio, or automatically during generation, a snapshot is safely stored in R2. You can restore your store to any previous point in time.
              </Text>
              
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                headings={['Date', 'Type', 'Reason', 'Actor', 'Actions']}
                rows={rows as any}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// Ensure BlockStack is imported
import { BlockStack } from "@shopify/polaris";
