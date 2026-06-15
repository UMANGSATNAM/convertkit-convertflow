import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page, Layout, Card, Text, BlockStack, Button, Badge, InlineStack, Banner,
  TextField, Select, FormLayout, Divider, ProgressBar, DataTable, EmptyState,
  InlineGrid, Modal, List, Box
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useState, useCallback } from "react";

// ─── Scoring (Publish 50% / Pricing 30% / Feel 20%) ─────────────────────────

function calculateScore(d: { publishIntent: string; pricingIntent: string; customFeel: string }): number {
  const p  = d.publishIntent === "yes" ? 100 : d.publishIntent === "maybe" ? 50 : 0;
  const pr = d.pricingIntent === "4999" ? 100 : d.pricingIntent === "2999" ? 67 : d.pricingIntent === "999" ? 33 : 0;
  const c  = d.customFeel === "custom" ? 100 : d.customFeel === "maybe" ? 50 : 0;
  return Math.round(p * 0.5 + pr * 0.3 + c * 0.2);
}

// ─── Server ───────────────────────────────────────────────────────────────────

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const url    = new URL(request.url);
  const format = url.searchParams.get("export"); // "csv" | "json" | null

  const rows = await (prisma as any).validationInterview.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // ── Export handlers ─────────────────────────────────────────────────────
  if (format === "json") {
    return new Response(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="validation-interviews-${Date.now()}.json"`,
      },
    });
  }

  if (format === "csv") {
    const headers = [
      "id","name","segment","screenshotStyle","perceivedStyle","publishIntent",
      "pricingIntent","customFeel","weaknessArea","dealBreaker",
      "agencyWouldSell","agencyPricing","score","notes","createdAt",
    ];
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csvRows = [
      headers.join(","),
      ...rows.map((r: any) => headers.map(h => escape(r[h])).join(",")),
    ];
    return new Response(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="validation-interviews-${Date.now()}.csv"`,
      },
    });
  }

  return json({ interviews: rows });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const intent   = formData.get("intent") as string;

  if (intent === "add_interview") {
    const publishIntent = formData.get("publishIntent") as string;
    const pricingIntent = formData.get("pricingIntent") as string;
    const customFeel    = formData.get("customFeel") as string;
    const score = calculateScore({ publishIntent, pricingIntent, customFeel });

    await (prisma as any).validationInterview.create({
      data: {
        name:            (formData.get("name") as string) || "",
        segment:         formData.get("segment") as string,
        screenshotStyle: formData.get("screenshotStyle") as string,
        perceivedStyle:  (formData.get("perceivedStyle") as string) || "",
        publishIntent,
        pricingIntent,
        customFeel,
        weaknessArea:    (formData.get("weaknessArea") as string) || "none",
        dealBreaker:     (formData.get("dealBreaker") as string) || "no",
        agencyWouldSell: (formData.get("agencyWouldSell") as string) || "na",
        agencyPricing:   (formData.get("agencyPricing") as string) || "",
        notes:           (formData.get("notes") as string) || null,
        score,
      },
    });
    return json({ success: true });
  }

  if (intent === "delete_interview") {
    await (prisma as any).validationInterview.delete({ where: { id: formData.get("id") as string } });
    return json({ success: true });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

// ─── Labels ───────────────────────────────────────────────────────────────────

const SEG_LABEL: Record<string, string> = {
  fashion: "Fashion Brand", beauty: "Beauty Brand", d2c: "D2C Founder",
  freelancer: "Shopify Freelancer", agency: "Shopify Agency",
};
const WEAK_LABEL: Record<string, string> = {
  hero: "Hero Section", grid: "Product Grid", typography: "Typography",
  trust: "Trust Section", overall: "Overall Layout", none: "No Issue",
};
const PRICE_LABEL: Record<string, string> = {
  "999": "₹999/mo", "2999": "₹2999/mo", "4999": "₹4999/mo", "never": "Won't take",
};

const STYLES  = ["luxury", "minimal", "modern", "bold"] as const;
const TARGET  = 20;
const THRESHOLD = Math.ceil(TARGET * 0.3); // 6 = 30%

// ─── Component ────────────────────────────────────────────────────────────────

export default function ValidationTracker() {
  const { interviews } = useLoaderData<typeof loader>() as any;
  const submit       = useSubmit();
  const nav          = useNavigation();
  const isBusy       = nav.state === "submitting";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", segment: "fashion", screenshotStyle: "luxury", perceivedStyle: "",
    publishIntent: "yes", pricingIntent: "2999", customFeel: "custom",
    weaknessArea: "none", dealBreaker: "no",
    agencyWouldSell: "na", agencyPricing: "", notes: "",
  });
  const set = useCallback((k: string, v: string) => setForm(p => ({ ...p, [k]: v })), []);
  const isAgency = form.segment === "agency";

  const resetForm = () => setForm({
    name: "", segment: "fashion", screenshotStyle: "luxury", perceivedStyle: "",
    publishIntent: "yes", pricingIntent: "2999", customFeel: "custom",
    weaknessArea: "none", dealBreaker: "no",
    agencyWouldSell: "na", agencyPricing: "", notes: "",
  });

  const handleSave = useCallback(() => {
    submit({ intent: "add_interview", ...form }, { method: "post" });
    setOpen(false);
    resetForm();
  }, [form, submit]);

  // ── Split merchants vs agencies ──────────────────────────────────────────
  const allInterviews  = interviews as any[];
  const merchants      = allInterviews.filter((i: any) => i.segment !== "agency");
  const agencies       = allInterviews.filter((i: any) => i.segment === "agency");
  const total          = allInterviews.length;

  const avg = (arr: any[]) =>
    arr.length > 0 ? Math.round(arr.reduce((s: number, i: any) => s + (i.score ?? 0), 0) / arr.length) : 0;

  const merchantAvg = avg(merchants);
  const agencyAvg   = avg(agencies);
  const overallAvg  = avg(allInterviews);
  const progress    = Math.min(Math.round((total / TARGET) * 100), 100);

  // ── Deal Breaker Frequency (deal breaker = yes) ───────────────────────
  const dbFreq: Record<string, number> = {};
  allInterviews.forEach((i: any) => {
    if (i.dealBreaker === "yes" && i.weaknessArea !== "none")
      dbFreq[i.weaknessArea] = (dbFreq[i.weaknessArea] || 0) + 1;
  });
  const sortedDB   = Object.entries(dbFreq).sort(([, a], [, b]) => b - a);
  const sprintItems = sortedDB.filter(([, c]) => c >= THRESHOLD);

  // ── Per-style blind test accuracy ─────────────────────────────────────
  const styleStats: Record<string, { shown: number; correct: number }> = {};
  STYLES.forEach(s => { styleStats[s] = { shown: 0, correct: 0 }; });
  allInterviews.forEach((i: any) => {
    if (!styleStats[i.screenshotStyle]) return;
    styleStats[i.screenshotStyle].shown++;
    if ((i.perceivedStyle ?? "").toLowerCase().trim() === i.screenshotStyle.toLowerCase())
      styleStats[i.screenshotStyle].correct++;
  });

  // ── Agency: "Would sell to client?" ──────────────────────────────────
  const agencySellYes   = agencies.filter((i: any) => i.agencyWouldSell === "yes").length;
  const agencySellMaybe = agencies.filter((i: any) => i.agencyWouldSell === "maybe").length;
  const agencySellNo    = agencies.filter((i: any) => i.agencyWouldSell === "no").length;

  // ── Publish split ────────────────────────────────────────────────────
  const pubYes   = allInterviews.filter((i: any) => i.publishIntent === "yes").length;
  const pubMaybe = allInterviews.filter((i: any) => i.publishIntent === "maybe").length;
  const pubNo    = allInterviews.filter((i: any) => i.publishIntent === "no").length;

  const scoreTone = (s: number) => s >= 70 ? "success" : s >= 45 ? "attention" : "critical";
  const pbTone    = (s: number) => s >= 70 ? "success"  : s >= 45 ? "highlight" : "critical";
  const liveScore = calculateScore(form);

  // ── Segment breakdown ────────────────────────────────────────────────
  const segMap: Record<string, { t: number; n: number }> = {};
  allInterviews.forEach((i: any) => {
    if (!segMap[i.segment]) segMap[i.segment] = { t: 0, n: 0 };
    segMap[i.segment].t += i.score ?? 0;
    segMap[i.segment].n++;
  });

  // ── Table ────────────────────────────────────────────────────────────
  const tableRows = allInterviews.map((i: any) => [
    i.name || "—",
    SEG_LABEL[i.segment] ?? i.segment,
    i.screenshotStyle,
    i.perceivedStyle || "—",
    <Badge key={`pub-${i.id}`} tone={i.publishIntent === "yes" ? "success" : i.publishIntent === "maybe" ? "warning" : "critical" as any}>
      {i.publishIntent === "yes" ? "Yes" : i.publishIntent === "maybe" ? "Maybe" : "No"}
    </Badge>,
    PRICE_LABEL[i.pricingIntent] ?? i.pricingIntent,
    WEAK_LABEL[i.weaknessArea]  ?? i.weaknessArea,
    <Badge key={`db-${i.id}`} tone={i.dealBreaker === "yes" ? "critical" : i.dealBreaker === "depends" ? "warning" : "success" as any}>
      {i.dealBreaker === "yes" ? "Deal Breaker" : i.dealBreaker === "depends" ? "Depends" : "Fine"}
    </Badge>,
    <Badge key={`sc-${i.id}`} tone={scoreTone(i.score) as any}>{`${i.score}/100`}</Badge>,
    <Button key={`rm-${i.id}`} variant="plain" tone="critical"
      onClick={() => submit({ intent: "delete_interview", id: i.id }, { method: "post" })}>
      Remove
    </Button>,
  ]);

  return (
    <Page
      title="Validation Lab"
      subtitle={`Merchant Reality Test Protocol · ${total}/${TARGET} interviews · 30% threshold = ${THRESHOLD} mentions`}
      primaryAction={{ content: "Add Interview", onAction: () => setOpen(true) }}
      secondaryActions={[
        {
          content: "Export CSV",
          onAction: () => window.open("/app/validation?export=csv", "_blank"),
        },
        {
          content: "Export JSON",
          onAction: () => window.open("/app/validation?export=json", "_blank"),
        },
      ]}
    >
      <Layout>

        {/* ── Banner ──────────────────────────────────────────────────────── */}
        <Layout.Section>
          {total < TARGET ? (
            <Banner title={`${TARGET - total} more interviews needed — statistical threshold is ${TARGET} total`} tone="info">
              <p>Decisions before {TARGET} interviews carry Vocal Minority Bias risk. Threshold for sprint: {THRESHOLD}+ mentions (30%).</p>
            </Banner>
          ) : (
            <Banner title={`✅ ${TARGET} interviews complete — sprints are now data-driven`} tone="success">
              <p>Auto-generated sprint priorities appear below. No guessing. No founder opinions. Pure merchant data.</p>
            </Banner>
          )}
        </Layout.Section>

        {/* ── Top KPIs ────────────────────────────────────────────────────── */}
        <Layout.Section>
          <InlineGrid columns={4} gap="400">
            <Card>
              <BlockStack gap="200">
                <Text variant="bodySm" tone="subdued" as="p">Interview Progress</Text>
                <Text variant="headingXl" as="p">{`${total}/${TARGET}`}</Text>
                <ProgressBar progress={progress} tone={pbTone(overallAvg) as any} />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text variant="bodySm" tone="subdued" as="p">Overall Avg Score</Text>
                <Text variant="headingXl" as="p" tone={scoreTone(overallAvg) as any}>{`${overallAvg}/100`}</Text>
                <Text variant="bodySm" tone="subdued" as="p">Publish 50 · Pricing 30 · Feel 20</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text variant="bodySm" tone="subdued" as="p">Publish Intent</Text>
                <InlineStack gap="200" wrap={false}>
                  <Badge tone="success">{`${pubYes} Yes`}</Badge>
                  <Badge tone="warning">{`${pubMaybe} Maybe`}</Badge>
                  <Badge tone="critical">{`${pubNo} No`}</Badge>
                </InlineStack>
                <Text variant="bodySm" tone="subdued" as="p">"Yes" = only signal that matters</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text variant="bodySm" tone="subdued" as="p">Sprint Threshold</Text>
                <Text variant="headingXl" as="p">{`${THRESHOLD}+`}</Text>
                <Text variant="bodySm" tone="subdued" as="p">mentions needed (30% of {TARGET})</Text>
                {sprintItems.length > 0 && (
                  <Badge tone="critical">{`${sprintItems.length} issue(s) ready`}</Badge>
                )}
              </BlockStack>
            </Card>
          </InlineGrid>
        </Layout.Section>

        {/* ── Merchant vs Agency Split ─────────────────────────────────────── */}
        <Layout.Section>
          <InlineGrid columns={2} gap="400">
            {/* Merchant Card */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">🏪 Merchant Validation</Text>
                  <Badge>{`${merchants.length} interviews`}</Badge>
                </InlineStack>
                <Divider />
                <InlineStack gap="300">
                  <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued" as="p">Avg Score</Text>
                    <Text variant="headingLg" as="p" tone={scoreTone(merchantAvg) as any}>{`${merchantAvg}/100`}</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued" as="p">Would Publish</Text>
                    <Text variant="headingLg" as="p">{`${merchants.filter((i:any) => i.publishIntent === "yes").length}/${merchants.length}`}</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued" as="p">Deal Breakers</Text>
                    <Text variant="headingLg" as="p" tone="critical">{`${merchants.filter((i:any) => i.dealBreaker === "yes").length}`}</Text>
                  </BlockStack>
                </InlineStack>
                {merchants.length === 0 && (
                  <Text tone="subdued" as="p">No merchant interviews yet.</Text>
                )}
              </BlockStack>
            </Card>

            {/* Agency Card */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <InlineStack gap="200">
                    <Text variant="headingMd" as="h2">🏢 Agency Validation</Text>
                    <Badge tone="warning">High Value</Badge>
                  </InlineStack>
                  <Badge>{`${agencies.length} interviews`}</Badge>
                </InlineStack>
                <Divider />
                {agencies.length === 0 ? (
                  <Banner tone="warning">
                    <p><strong>No agency interviews yet.</strong> 1 agency = 50+ stores. Prioritize these.</p>
                  </Banner>
                ) : (
                  <BlockStack gap="300">
                    <InlineStack gap="300">
                      <BlockStack gap="100">
                        <Text variant="bodySm" tone="subdued" as="p">Avg Score</Text>
                        <Text variant="headingLg" as="p" tone={scoreTone(agencyAvg) as any}>{`${agencyAvg}/100`}</Text>
                      </BlockStack>
                      <BlockStack gap="100">
                        <Text variant="bodySm" tone="subdued" as="p">Would Sell to Client</Text>
                        <InlineStack gap="100">
                          <Badge tone="success">{`${agencySellYes} Yes`}</Badge>
                          <Badge tone="warning">{`${agencySellMaybe} Maybe`}</Badge>
                          <Badge tone="critical">{`${agencySellNo} No`}</Badge>
                        </InlineStack>
                      </BlockStack>
                    </InlineStack>
                    {agencies.filter((i: any) => i.agencyPricing).map((i: any) => (
                      <Text key={i.id} variant="bodySm" as="p">
                        📌 {i.name || "Agency"}: would charge ₹{i.agencyPricing}/client
                      </Text>
                    ))}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </InlineGrid>
        </Layout.Section>

        {/* ── Deal Breaker Frequency + Per-Style Accuracy ──────────────────── */}
        <Layout.Section>
          <InlineGrid columns={2} gap="400">

            {/* Deal Breaker Frequency */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">🔴 Deal Breaker Frequency</Text>
                  <Badge tone="critical">{`≥${THRESHOLD} = Sprint candidate`}</Badge>
                </InlineStack>
                <Divider />
                {sortedDB.length === 0 ? (
                  <Text tone="subdued" as="p">No deal breakers recorded yet.</Text>
                ) : (
                  <BlockStack gap="300">
                    {sortedDB.map(([area, count]) => {
                      const pct      = total > 0 ? Math.round((count / total) * 100) : 0;
                      const isSprint = count >= THRESHOLD;
                      return (
                        <BlockStack key={area} gap="100">
                          <InlineStack align="space-between">
                            <InlineStack gap="200">
                              <Text as="span" variant="bodyMd">{WEAK_LABEL[area] ?? area}</Text>
                              {isSprint && <Badge tone="critical">Sprint Priority</Badge>}
                            </InlineStack>
                            <Text as="span" variant="bodyMd" fontWeight="bold">{`${count} (${pct}%)`}</Text>
                          </InlineStack>
                          <ProgressBar progress={pct} tone={isSprint ? "critical" : "highlight"} />
                        </BlockStack>
                      );
                    })}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>

            {/* Per-Style Blind Test Accuracy */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">🎨 Blind Test Accuracy (Per Style)</Text>
                <Divider />
                <Text tone="subdued" as="p">Merchant is shown screenshot without being told the style. Do they guess correctly?</Text>
                <BlockStack gap="300">
                  {STYLES.map(style => {
                    const { shown, correct } = styleStats[style];
                    const acc    = shown > 0 ? Math.round((correct / shown) * 100) : 0;
                    const tone   = acc >= 70 ? "success" : acc >= 40 ? "highlight" : "critical";
                    const failed = acc < 40 && shown >= 3; // Enough data to flag
                    return (
                      <BlockStack key={style} gap="100">
                        <InlineStack align="space-between">
                          <InlineStack gap="200">
                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </Text>
                            <Badge>{`${shown} shown`}</Badge>
                            {failed && <Badge tone="critical">Redesign Candidate</Badge>}
                          </InlineStack>
                          <Text as="span" variant="bodyMd" fontWeight="bold">{shown > 0 ? `${acc}%` : "—"}</Text>
                        </InlineStack>
                        {shown > 0 && <ProgressBar progress={acc} tone={tone as any} />}
                        {shown === 0 && (
                          <Text variant="bodySm" tone="subdued" as="p">Not tested yet</Text>
                        )}
                      </BlockStack>
                    );
                  })}
                </BlockStack>
                <Banner tone="info">
                  <p>If accuracy &lt; 40% with ≥3 samples → style fails to communicate. Mark as Redesign Candidate.</p>
                </Banner>
              </BlockStack>
            </Card>
          </InlineGrid>
        </Layout.Section>

        {/* ── Segment Score Breakdown ───────────────────────────────────────── */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">📊 Score by Segment</Text>
              <Divider />
              {Object.keys(segMap).length === 0 ? (
                <Text tone="subdued" as="p">No interviews recorded yet.</Text>
              ) : (
                <InlineGrid columns={Object.keys(segMap).length > 3 ? 3 : (Object.keys(segMap).length as any)} gap="400">
                  {Object.entries(segMap).map(([seg, { t, n }]) => {
                    const a = Math.round(t / n);
                    return (
                      <Box key={seg} borderWidth="025" borderColor="border" borderRadius="200" padding="300">
                        <BlockStack gap="200">
                          <InlineStack align="space-between">
                            <Text variant="bodyMd" fontWeight="semibold" as="span">{SEG_LABEL[seg] ?? seg}</Text>
                            {seg === "agency" && <Badge tone="warning">High Value</Badge>}
                          </InlineStack>
                          <Text variant="headingLg" as="p" tone={scoreTone(a) as any}>{`${a}/100`}</Text>
                          <Text variant="bodySm" tone="subdued" as="p">{`${n} interview${n > 1 ? "s" : ""}`}</Text>
                          <ProgressBar progress={a} tone={pbTone(a) as any} />
                        </BlockStack>
                      </Box>
                    );
                  })}
                </InlineGrid>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* ── Auto Sprint Priorities ────────────────────────────────────────── */}
        {total >= TARGET && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">🚀 Auto-Generated Sprint Priorities</Text>
                <Text tone="subdued" as="p">
                  {`Only weaknesses flagged as deal breakers by ≥${THRESHOLD} merchants (30% of ${TARGET}). Logic: count ≥ ${THRESHOLD} → sprint. No manual selection.`}
                </Text>
                <Divider />
                {sprintItems.length === 0 ? (
                  <Banner tone="success">
                    <p>
                      No deal breakers crossed the 30% threshold. Core product passes validation.
                      Next step: pricing and positioning experiments.
                    </p>
                  </Banner>
                ) : (
                  <List type="bullet">
                    {sprintItems.slice(0, 3).map(([area, count], idx) => (
                      <List.Item key={area}>
                        <strong>Sprint {idx + 1}:</strong> Fix <strong>{WEAK_LABEL[area]}</strong> — {count}/{total} merchants ({Math.round(count/total*100)}%) flagged as deal breaker
                      </List.Item>
                    ))}
                  </List>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {/* ── Interview Table ───────────────────────────────────────────────── */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">{`All Interviews (${total})`}</Text>
                <InlineStack gap="200">
                  <Button variant="plain" onClick={() => window.open("/app/validation?export=csv", "_blank")}>
                    Export CSV
                  </Button>
                  <Button variant="plain" onClick={() => window.open("/app/validation?export=json", "_blank")}>
                    Export JSON
                  </Button>
                </InlineStack>
              </InlineStack>
              {total === 0 ? (
                <EmptyState
                  heading="No interviews recorded yet"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  action={{ content: "Add First Interview", onAction: () => setOpen(true) }}
                >
                  <p>Record your first merchant validation session to start generating insights.</p>
                </EmptyState>
              ) : (
                <DataTable
                  columnContentTypes={["text","text","text","text","text","text","text","text","text","text"]}
                  headings={["Name","Segment","Style Shown","Perceived As","Publish","Pricing","Weakness","Deal Breaker","Score","Action"]}
                  rows={tableRows as any}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* ── Add Interview Modal ───────────────────────────────────────────── */}
        <Modal
          open={open}
          onClose={() => { setOpen(false); resetForm(); }}
          title="Record Merchant Interview"
          primaryAction={{ content: isBusy ? "Saving..." : "Save Interview", onAction: handleSave, loading: isBusy }}
          secondaryActions={[{ content: "Cancel", onAction: () => { setOpen(false); resetForm(); } }]}
          size="large"
        >
          <Modal.Section>
            <FormLayout>

              <FormLayout.Group>
                <TextField label="Merchant Name / Handle"
                  value={form.name} onChange={v => set("name", v)}
                  autoComplete="off" placeholder="@fashionbypriya" />
                <Select label="Segment" value={form.segment} onChange={v => set("segment", v)}
                  options={[
                    { label: "Fashion Brand Owner", value: "fashion"    },
                    { label: "Beauty Brand Owner",  value: "beauty"     },
                    { label: "D2C Founder",          value: "d2c"        },
                    { label: "Shopify Freelancer",   value: "freelancer" },
                    { label: "Shopify Agency",       value: "agency"     },
                  ]}
                />
              </FormLayout.Group>

              <Divider />
              <Text variant="headingSm" as="h3">🎨 Blind Style Test</Text>
              <FormLayout.Group>
                <Select label="Screenshot Style You Showed (DO NOT tell merchant)"
                  value={form.screenshotStyle} onChange={v => set("screenshotStyle", v)}
                  options={[
                    { label: "Luxury",  value: "luxury"  },
                    { label: "Minimal", value: "minimal" },
                    { label: "Modern",  value: "modern"  },
                    { label: "Bold",    value: "bold"    },
                  ]}
                />
                <TextField label={`Q: "Is brand kaunse category ka lagta hai?" (merchant ke exact words)`}
                  value={form.perceivedStyle} onChange={v => set("perceivedStyle", v)}
                  autoComplete="off" placeholder="luxury jewelry, generic clothing..."
                  helpText="Match = design language communicates. Mismatch = fundamental redesign needed."
                />
              </FormLayout.Group>

              <Divider />
              <Text variant="headingSm" as="h3">📊 Scoring Questions</Text>
              <FormLayout.Group>
                <Select
                  label={isAgency ? "Q1: Would you publish this for a client? (50% weight)" : "Q1: Would you publish this to your store? (50% weight)"}
                  value={form.publishIntent} onChange={v => set("publishIntent", v)}
                  options={[
                    { label: "✅ Yes",   value: "yes"   },
                    { label: "🟡 Maybe", value: "maybe" },
                    { label: "❌ No",    value: "no"    },
                  ]}
                />
                <Select label="Q2: 1-click install price? (30% weight)"
                  value={form.pricingIntent} onChange={v => set("pricingIntent", v)}
                  options={[
                    { label: "₹999/month",   value: "999"   },
                    { label: "₹2999/month",  value: "2999"  },
                    { label: "₹4999/month",  value: "4999"  },
                    { label: "Won't take it", value: "never" },
                  ]}
                />
                <Select label="Q3: Custom or template feel? (20% weight)"
                  value={form.customFeel} onChange={v => set("customFeel", v)}
                  options={[
                    { label: "🏆 Custom — built for this brand", value: "custom"   },
                    { label: "🟡 In between",                   value: "maybe"    },
                    { label: "📋 Generic template",             value: "template" },
                  ]}
                />
              </FormLayout.Group>

              {/* Agency-specific section */}
              {isAgency && (
                <>
                  <Divider />
                  <Text variant="headingSm" as="h3">🏢 Agency-Specific Questions</Text>
                  <FormLayout.Group>
                    <Select label="Q-A: Would you sell this to a client?"
                      value={form.agencyWouldSell} onChange={v => set("agencyWouldSell", v)}
                      options={[
                        { label: "✅ Yes — I'd sell this",          value: "yes"   },
                        { label: "🟡 Maybe — with modifications",   value: "maybe" },
                        { label: "❌ No — wouldn't sell this",      value: "no"    },
                      ]}
                    />
                    <TextField label="Q-B: What would you charge your client? (₹ amount)"
                      value={form.agencyPricing} onChange={v => set("agencyPricing", v)}
                      autoComplete="off" placeholder="15000"
                      helpText="If agency charges ₹15,000 and you charge ₹2,999 → that's your B2B2C margin signal"
                      prefix="₹"
                    />
                  </FormLayout.Group>
                </>
              )}

              <Divider />
              <Text variant="headingSm" as="h3">🔴 Deal Breaker Analysis</Text>
              <FormLayout.Group>
                <Select label="Q4: Sabse weak part kya laga?"
                  value={form.weaknessArea} onChange={v => set("weaknessArea", v)}
                  options={[
                    { label: "No issue",       value: "none"       },
                    { label: "Hero section",   value: "hero"       },
                    { label: "Product grid",   value: "grid"       },
                    { label: "Typography",     value: "typography" },
                    { label: "Trust section",  value: "trust"      },
                    { label: "Overall layout", value: "overall"    },
                  ]}
                />
                <Select label="Q5: Is weakness ke bawajood bhi use karoge?"
                  value={form.dealBreaker} onChange={v => set("dealBreaker", v)}
                  options={[
                    { label: "✅ Haan — minor issue, still using",  value: "no"      },
                    { label: "🟡 Depends on price",                value: "depends" },
                    { label: "❌ Nahi — deal breaker",             value: "yes"     },
                  ]}
                />
              </FormLayout.Group>

              <TextField label="Interview Notes / Exact Quotes"
                value={form.notes} onChange={v => set("notes", v)}
                multiline={3} autoComplete="off"
                placeholder="Exact merchant quotes, body language, hesitations..." />

              <Banner tone={liveScore >= 70 ? "success" : liveScore >= 45 ? "warning" : "critical"}>
                <p>
                  <strong>Live Score: {liveScore}/100</strong> ·{" "}
                  Publish {form.publishIntent === "yes" ? "50pts ✅" : form.publishIntent === "maybe" ? "25pts 🟡" : "0pts ❌"} ·{" "}
                  Pricing {form.pricingIntent === "4999" ? "30pts ✅" : form.pricingIntent === "2999" ? "20pts 🟡" : form.pricingIntent === "999" ? "10pts 🟡" : "0pts ❌"} ·{" "}
                  Feel {form.customFeel === "custom" ? "20pts ✅" : form.customFeel === "maybe" ? "10pts 🟡" : "0pts ❌"}
                </p>
              </Banner>

            </FormLayout>
          </Modal.Section>
        </Modal>

      </Layout>
    </Page>
  );
}
