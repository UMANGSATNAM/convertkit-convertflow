import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, Select, TextField, DataTable, Badge } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { writeTemplate } from "../services/theme-engine/index";
import { campaignsQueue } from "../services/generator/campaign-worker.server";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ campaigns: [] });

  const campaigns = await prisma.campaignPage.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" }
  });
  return json({ campaigns });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.upsert({
    where: { shopDomain: session.shop },
    update: {},
    create: { shopDomain: session.shop, accessToken: session.accessToken || "" }
  });

  const formData = await request.formData();
  const templateKey = formData.get("templateKey") as string;
  const title = formData.get("title") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const campaign = await prisma.campaignPage.create({
    data: {
      shopId: shop.id,
      templateKey,
      title,
      handle,
      productIds: [],
      offer: { headline: title },
      status: startDate ? "DRAFT" : "PUBLISHED",
      startDate,
      endDate
    }
  });

  if (startDate) {
    const delay = Math.max(0, startDate.getTime() - Date.now());
    await campaignsQueue.add("apply-campaign", { type: "apply-campaign", campaignId: campaign.id }, { delay });
  } else {
    await campaignsQueue.add("apply-campaign", { type: "apply-campaign", campaignId: campaign.id });
  }

  if (endDate) {
    const revertDelay = Math.max(0, endDate.getTime() - Date.now());
    await campaignsQueue.add("revert-campaign", { type: "revert-campaign", campaignId: campaign.id }, { delay: revertDelay });
  }

  return json({ success: true });
};

export default function CampaignBuilder() {
  const { campaigns } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("diwali");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    submit(formData, { method: "post" });
    setTitle("");
    setStartDate("");
    setEndDate("");
  };

  const rows = campaigns.map((c) => [
    c.title,
    c.templateKey,
    <Badge tone={c.status === "PUBLISHED" ? "success" : c.status === "ARCHIVED" ? "critical" : "info"}>{c.status}</Badge>,
    c.startDate ? new Date(c.startDate).toLocaleString() : "Immediate",
    c.endDate ? new Date(c.endDate).toLocaleString() : "Never"
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
              <TextField label="Start Date/Time (Leave empty for immediate)" value={startDate} onChange={setStartDate} type="datetime-local" autoComplete="off" />
              <TextField label="End Date/Time (Optional)" value={endDate} onChange={setEndDate} type="datetime-local" autoComplete="off" />
              <Button primary onClick={handleCreate}>Schedule Campaign</Button>
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
                  columnContentTypes={["text", "text", "text", "text", "text"]}
                  headings={["Title", "Template", "Status", "Starts At", "Ends At"]}
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
