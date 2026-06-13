import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, Button, Badge, InlineStack, Banner, ProgressBar, ExceptionList } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { runHealthScan } from "../services/health/scanner.server";
import { applyHealthFix } from "../services/health/fixers.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  let latestReport = await prisma.healthReport.findFirst({
    where: { shopId: shop!.id },
    orderBy: { createdAt: "desc" }
  });

  return json({ report: latestReport, shopId: shop!.id, shopDomain: session.shop });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  if (intent === "scan") {
    const report = await runHealthScan(request, shop!.id, session.shop, "MANUAL");
    return json({ success: true, report });
  }

  if (intent === "fix") {
    const issueId = formData.get("issueId") as string;
    // Mock themeId since we are simulating
    const themeId = "123456789"; 
    const result = await applyHealthFix(shop!.id, session.shop, themeId, issueId);
    
    // Automatically trigger a re-scan after a fix so the score updates
    const report = await runHealthScan(request, shop!.id, session.shop, "POST_FIX");
    return json({ success: true, message: result.message, report });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

export default function HealthMonitor() {
  const { report } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const nav = useNavigation();
  const isScanning = nav.state === "submitting" && nav.formData?.get("intent") === "scan";

  const handleScan = () => {
    submit({ intent: "scan" }, { method: "post" });
  };

  const handleFix = (issueId: string) => {
    submit({ intent: "fix", issueId }, { method: "post" });
  };

  const score = report ? report.score : 0;
  let tone: "success" | "warning" | "critical" = "success";
  if (score < 50) tone = "critical";
  else if (score < 80) tone = "warning";

  const issues = report ? JSON.parse(report.issues as string) : [];

  return (
    <Page 
      title="Health Monitor" 
      subtitle="Automated audit for Performance, SEO, Compliance, Links, and Conversion."
      primaryAction={{
        content: isScanning ? 'Scanning...' : 'Run New Scan',
        onAction: handleScan,
        loading: isScanning
      }}
    >
      <Layout>
        <Layout.Section>
          {!report ? (
            <Banner title="No health scans run yet." tone="info">
              <p>Click "Run New Scan" to analyze your store.</p>
            </Banner>
          ) : (
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400" align="center">
                  <Text as="h2" variant="headingLg">Overall Health Score</Text>
                  <div style={{ fontSize: "48px", fontWeight: "bold", color: tone === "critical" ? "red" : tone === "warning" ? "orange" : "green" }}>
                    {score}/100
                  </div>
                  <ProgressBar progress={score} tone={tone} />
                </BlockStack>
              </Card>

              {issues.length === 0 ? (
                <Banner title="Your store is in perfect health!" tone="success">
                  <p>No issues were detected during the last scan.</p>
                </Banner>
              ) : (
                <Text as="h3" variant="headingMd">Detected Issues ({issues.length})</Text>
              )}

              {issues.map((issue: any) => (
                <Card key={issue.id}>
                  <BlockStack gap="400">
                    <InlineStack align="space-between">
                      <BlockStack gap="200">
                        <InlineStack gap="200" align="start">
                          <Badge tone={issue.fixable ? "warning" : "critical"}>{issue.family}</Badge>
                          <Text as="h3" variant="headingSm">{issue.title}</Text>
                        </InlineStack>
                        <Text as="p" tone="subdued">{issue.description}</Text>
                      </BlockStack>
                      {issue.fixable && (
                        <Button 
                          variant="primary" 
                          onClick={() => handleFix(issue.id)}
                          loading={nav.state === "submitting" && nav.formData?.get("issueId") === issue.id}
                        >
                          Fix Now
                        </Button>
                      )}
                    </InlineStack>
                    {!issue.fixable && (
                      <Text as="p" tone="subdued"><em>* This issue requires manual action in the Shopify Admin.</em></Text>
                    )}
                  </BlockStack>
                </Card>
              ))}
            </BlockStack>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
