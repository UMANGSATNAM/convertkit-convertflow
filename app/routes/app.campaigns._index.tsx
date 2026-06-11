import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, Select, TextField, DataTable, Badge } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { writeTemplate } from "../services/theme-engine/index";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const campaigns = await prisma.campaignPage.findMany({
    where: { shopId: "mock_shop_id" },
    orderBy: { createdAt: "desc" }
  });
  return json({ campaigns });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const templateKey = formData.get("templateKey") as string;
  const title = formData.get("title") as string;
  const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Generate Theme Template JSON
  const templateJson = {
    sections: {
      hero: { type: "hero-festive", settings: { headline: title } },
      products: { type: "featured-collection" }
    },
    order: ["hero", "products"]
  };

  const themeTemplatePath = `templates/page.campaign-${handle}.json`;
  
  // Write to theme via Theme Engine
  // await writeTemplate(mockShop, "mock_theme_id", themeTemplatePath, templateJson, "CAMPAIGN");

  await prisma.campaignPage.create({
    data: {
      shopId: "mock_shop_id",
      templateKey,
      title,
      handle,
      themeTemplate: themeTemplatePath,
      productIds: [],
      offer: { headline: title },
      status: "PUBLISHED"
    }
  });

  return json({ success: true });
};

export default function CampaignBuilder() {
  const { campaigns } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("diwali");

  const templates = [
    { label: "Diwali Mega Sale", value: "diwali" },
    { label: "End of Season Sale", value: "eoss" },
    { label: "New Collection Launch", value: "new-launch" },
    { label: "Wedding Season", value: "wedding" },
    { label: "Rakhi Special", value: "rakhi" },
    { label: "Valentine's Day", value: "valentines" },
    { label: "Republic/Independence Day", value: "national-sale" }
  ];

  const handleCreate = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("templateKey", template);
    submit(formData, { method: "post" });
    setTitle("");
  };

  const rows = campaigns.map((c) => [
    c.title,
    c.templateKey,
    <Badge tone={c.status === "PUBLISHED" ? "success" : "info"}>{c.status}</Badge>,
    new Date(c.createdAt).toLocaleDateString()
  ]);

  return (
    <Page title="Campaign Page Builder">
      <Layout>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Create New Campaign</Text>
              <Select label="Template" options={templates} value={template} onChange={setTemplate} />
              <TextField label="Campaign Title" value={title} onChange={setTitle} autoComplete="off" />
              <Button primary onClick={handleCreate}>Generate Page</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Active Campaigns</Text>
              {campaigns.length === 0 ? (
                <Text as="p">No campaigns generated yet.</Text>
              ) : (
                <DataTable
                  columnContentTypes={["text", "text", "text", "text"]}
                  headings={["Title", "Template", "Status", "Date Created"]}
                  rows={rows}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
