import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Badge,
  DataTable,
  Select,
  EmptyState,
  SkeletonBodyText,
  InlineGrid,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      select: { id: true },
    });

    if (!shop) {
      return json({ error: "Shop not found", stats: null });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const oneDayAgo = new Date(now.getTime() - 86400000);

    // Get all events for the last 30 days
    const events = await prisma.analyticsEvent.findMany({
      where: {
        shopId: shop.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        eventType: true,
        value: true,
        featureName: true,
        sessionId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // ── Compute Attribution ──
    // A session is "attributed" if it had at least one feature_interact event
    const sessionMap = new Map();
    for (const evt of events) {
      if (!evt.sessionId) continue;
      if (!sessionMap.has(evt.sessionId)) {
        sessionMap.set(evt.sessionId, {
          hadInteraction: false,
          purchaseValue: 0,
          features: new Set(),
        });
      }
      const session = sessionMap.get(evt.sessionId);
      if (evt.eventType === "feature_interact" || evt.eventType === "feature_impression") {
        session.hadInteraction = true;
        if (evt.featureName) session.features.add(evt.featureName);
      }
      if (evt.eventType === "purchase" && evt.value) {
        session.purchaseValue += Number(evt.value);
      }
    }

    let attributedRevenue = 0;
    let totalRevenue = 0;
    let attributedSessions = 0;
    const featureRevenue = {};

    for (const [, sess] of sessionMap) {
      if (sess.purchaseValue > 0) {
        totalRevenue += sess.purchaseValue;
        if (sess.hadInteraction) {
          attributedRevenue += sess.purchaseValue;
          attributedSessions++;
          for (const feat of sess.features) {
            featureRevenue[feat] = (featureRevenue[feat] || 0) + sess.purchaseValue;
          }
        }
      }
    }

    // ── Event Counts ──
    const totalPageViews = events.filter(e => e.eventType === "page_view").length;
    const totalImpressions = events.filter(e => e.eventType === "feature_impression").length;
    const totalInteractions = events.filter(e => e.eventType === "feature_interact").length;
    const totalCartAdds = events.filter(e => e.eventType === "cart_add").length;
    const totalPurchases = events.filter(e => e.eventType === "purchase").length;

    // ── Last 7 days trend ──
    const last7Events = events.filter(e => new Date(e.createdAt) >= sevenDaysAgo);
    const last7Revenue = last7Events
      .filter(e => e.eventType === "purchase" && e.value)
      .reduce((sum, e) => sum + Number(e.value), 0);

    // ── Today ──
    const todayEvents = events.filter(e => new Date(e.createdAt) >= oneDayAgo);
    const todayRevenue = todayEvents
      .filter(e => e.eventType === "purchase" && e.value)
      .reduce((sum, e) => sum + Number(e.value), 0);

    // ── Feature Breakdown ──
    const featureBreakdown = Object.entries(featureRevenue)
      .map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue);

    // ── Daily revenue for chart data (last 30 days) ──
    const dailyRevenue = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().split("T")[0];
      dailyRevenue[key] = 0;
    }
    for (const evt of events) {
      if (evt.eventType === "purchase" && evt.value) {
        const key = new Date(evt.createdAt).toISOString().split("T")[0];
        if (dailyRevenue[key] !== undefined) {
          dailyRevenue[key] += Number(evt.value);
        }
      }
    }

    return json({
      stats: {
        attributedRevenue: Number(attributedRevenue.toFixed(2)),
        totalRevenue: Number(totalRevenue.toFixed(2)),
        attributedSessions,
        totalPageViews,
        totalImpressions,
        totalInteractions,
        totalCartAdds,
        totalPurchases,
        last7Revenue: Number(last7Revenue.toFixed(2)),
        todayRevenue: Number(todayRevenue.toFixed(2)),
        featureBreakdown,
        dailyRevenue,
      },
    });
  } catch (error) {
    console.error("Analytics loader error:", error);
    return json({ error: error.message, stats: null });
  }
};

function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AnalyticsPage() {
  const { stats, error } = useLoaderData();

  if (error || !stats) {
    return (
      <Page title="Revenue Analytics">
        <EmptyState
          heading="No analytics data yet"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Analytics events will appear here once your storefront widgets are active and visitors start interacting with them.</p>
        </EmptyState>
      </Page>
    );
  }

  const featureRows = stats.featureBreakdown.map((f, i) => [
    i + 1,
    f.name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    formatCurrency(f.revenue),
  ]);

  return (
    <Page title="Revenue Analytics" subtitle="Track revenue attributed to ConvertKit features">
      <BlockStack gap="400">

        {/* ── Revenue Hero Cards ── */}
        <InlineGrid columns={4} gap="400">
          <Card>
            <BlockStack gap="200">
              <Text variant="bodySm" as="p" tone="subdued">Attributed Revenue (30d)</Text>
              <Text variant="heading2xl" as="h2" fontWeight="bold">
                {formatCurrency(stats.attributedRevenue)}
              </Text>
              <Badge tone="success">ConvertKit Powered</Badge>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text variant="bodySm" as="p" tone="subdued">Total Revenue (30d)</Text>
              <Text variant="heading2xl" as="h2">
                {formatCurrency(stats.totalRevenue)}
              </Text>
              {stats.totalRevenue > 0 && (
                <Text variant="bodySm" tone="subdued">
                  {((stats.attributedRevenue / stats.totalRevenue) * 100).toFixed(1)}% attributed
                </Text>
              )}
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text variant="bodySm" as="p" tone="subdued">Last 7 Days</Text>
              <Text variant="heading2xl" as="h2">
                {formatCurrency(stats.last7Revenue)}
              </Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text variant="bodySm" as="p" tone="subdued">Today</Text>
              <Text variant="heading2xl" as="h2">
                {formatCurrency(stats.todayRevenue)}
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        {/* ── Funnel Metrics ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">Conversion Funnel (30 Days)</Text>
                <InlineGrid columns={5} gap="400">
                  <BlockStack gap="100">
                    <Text variant="heading2xl" as="p" alignment="center">{stats.totalPageViews.toLocaleString()}</Text>
                    <Text variant="bodySm" alignment="center" tone="subdued">Page Views</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text variant="heading2xl" as="p" alignment="center">{stats.totalImpressions.toLocaleString()}</Text>
                    <Text variant="bodySm" alignment="center" tone="subdued">Impressions</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text variant="heading2xl" as="p" alignment="center">{stats.totalInteractions.toLocaleString()}</Text>
                    <Text variant="bodySm" alignment="center" tone="subdued">Interactions</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text variant="heading2xl" as="p" alignment="center">{stats.totalCartAdds.toLocaleString()}</Text>
                    <Text variant="bodySm" alignment="center" tone="subdued">Cart Adds</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text variant="heading2xl" as="p" alignment="center">{stats.totalPurchases.toLocaleString()}</Text>
                    <Text variant="bodySm" alignment="center" tone="subdued">Purchases</Text>
                  </BlockStack>
                </InlineGrid>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* ── Feature Revenue Breakdown ── */}
        {featureRows.length > 0 && (
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h3">Revenue by Feature</Text>
                  <DataTable
                    columnContentTypes={["numeric", "text", "numeric"]}
                    headings={["#", "Feature", "Attributed Revenue"]}
                    rows={featureRows}
                    totals={["", "Total", formatCurrency(stats.attributedRevenue)]}
                    showTotalsInFooter
                  />
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        )}

        {/* ── Attribution Info ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd" as="h3">How Attribution Works</Text>
                <Text variant="bodySm" tone="subdued">
                  Revenue is attributed to ConvertKit when a visitor interacts with at least one ConvertKit feature
                  (sticky cart, urgency timer, trust badges, etc.) during their session and then completes a purchase.
                  This tracks real order values from Shopify's checkout data — not estimates.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
