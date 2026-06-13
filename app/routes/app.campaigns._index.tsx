import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, Select, TextField, DataTable, Badge, Banner } from "@shopify/polaris";
import { useSubmit, useLoaderData, useActionData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { writeTemplate } from "../services/theme-engine/index";
import { campaignsQueue } from "../services/generator/campaign-worker.server";

import { authenticate, PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ campaigns: [], hasActivePayment: false });

  const planCheck = await billing.check({
    plans: [PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE],
    isTest: true,
  });
  const hasActivePayment = planCheck.hasActivePayment;

  const campaigns = await prisma.campaignPage.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" }
  });
  return json({ campaigns, hasActivePayment });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = await prisma.shop.upsert({
    where: { shopDomain: session.shop },
    update: {},
    create: { shopDomain: session.shop, accessToken: session.accessToken || "" }
  });

  const planCheck = await billing.check({
    plans: [PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE],
    isTest: true,
  });
  const hasActivePayment = planCheck.hasActivePayment;
  
  const existingCount = await prisma.campaignPage.count({ where: { shopId: shop.id } });
  if (!hasActivePayment && existingCount >= 1) {
    return json({ error: "Free plan limit reached. Upgrade to PRO to create more campaigns." }, { status: 403 });
  }

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

  return json({ success: true, error: null });
};

export default function CampaignBuilder() {
  const { campaigns, hasActivePayment } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

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

  const limitReached = !hasActivePayment && campaigns.length >= 1;

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
        {actionData?.error && (
          <Layout.Section>
            <Banner tone="critical" title="Cannot Create Campaign">
              {actionData.error}
            </Banner>
          </Layout.Section>
        )}
        
        {limitReached && (
          <Layout.Section>
            <Banner tone="warning" title="Campaign Limit Reached" action={{content: "Upgrade to PRO", onAction: () => navigate("/app/upgrade")}}>
              You have reached the 1 campaign limit on the Free plan. Upgrade to the PRO plan to create unlimited campaign pages.
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Create New Campaign</Text>
              <Select label="Template" options={templates} value={template} onChange={setTemplate} disabled={limitReached} />
              <TextField label="Campaign Title" value={title} onChange={setTitle} autoComplete="off" disabled={limitReached} />
              <TextField label="Start Date/Time (Leave empty for immediate)" value={startDate} onChange={setStartDate} type="datetime-local" autoComplete="off" disabled={limitReached} />
              <TextField label="End Date/Time (Optional)" value={endDate} onChange={setEndDate} type="datetime-local" autoComplete="off" disabled={limitReached} />
              <Button variant="primary" onClick={handleCreate} disabled={limitReached || !title.trim()}>Schedule Campaign</Button>
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
