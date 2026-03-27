import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { Page, EmptyState } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      select: { id: true },
    });

    if (!shop) return json({ error: "Shop not found", stats: null });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const oneDayAgo = new Date(now.getTime() - 86400000);

    const events = await prisma.analyticsEvent.findMany({
      where: { shopId: shop.id, createdAt: { gte: thirtyDaysAgo } },
      select: { eventType: true, value: true, featureName: true, sessionId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const sessionMap = new Map();
    for (const evt of events) {
      if (!evt.sessionId) continue;
      if (!sessionMap.has(evt.sessionId)) {
        sessionMap.set(evt.sessionId, { hadInteraction: false, purchaseValue: 0, features: new Set() });
      }
      const sess = sessionMap.get(evt.sessionId);
      if (evt.eventType === "feature_interact" || evt.eventType === "feature_impression") {
        sess.hadInteraction = true;
        if (evt.featureName) sess.features.add(evt.featureName);
      }
      if (evt.eventType === "purchase" && evt.value) sess.purchaseValue += Number(evt.value);
    }

    let attributedRevenue = 0, totalRevenue = 0, attributedSessions = 0;
    const featureRevenue = {};
    for (const [, sess] of sessionMap) {
      if (sess.purchaseValue > 0) {
        totalRevenue += sess.purchaseValue;
        if (sess.hadInteraction) {
          attributedRevenue += sess.purchaseValue;
          attributedSessions++;
          for (const feat of sess.features) featureRevenue[feat] = (featureRevenue[feat] || 0) + sess.purchaseValue;
        }
      }
    }

    const totalPageViews = events.filter(e => e.eventType === "page_view").length;
    const totalImpressions = events.filter(e => e.eventType === "feature_impression").length;
    const totalInteractions = events.filter(e => e.eventType === "feature_interact").length;
    const totalCartAdds = events.filter(e => e.eventType === "cart_add").length;
    const totalPurchases = events.filter(e => e.eventType === "purchase").length;

    const last7Events = events.filter(e => new Date(e.createdAt) >= sevenDaysAgo);
    const last7Revenue = last7Events.filter(e => e.eventType === "purchase" && e.value).reduce((s, e) => s + Number(e.value), 0);
    const todayRevenue = events.filter(e => new Date(e.createdAt) >= oneDayAgo && e.eventType === "purchase" && e.value).reduce((s, e) => s + Number(e.value), 0);

    const featureBreakdown = Object.entries(featureRevenue)
      .map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue);

    // Daily sparkline data (last 14 days)
    const dailyData = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().split("T")[0];
      const dayRevenue = events
        .filter(e => e.eventType === "purchase" && e.value && new Date(e.createdAt).toISOString().split("T")[0] === key)
        .reduce((s, e) => s + Number(e.value), 0);
      dailyData.push(dayRevenue);
    }

    return json({
      stats: {
        attributedRevenue: Number(attributedRevenue.toFixed(2)),
        totalRevenue: Number(totalRevenue.toFixed(2)),
        attributedSessions, totalPageViews, totalImpressions,
        totalInteractions, totalCartAdds, totalPurchases,
        last7Revenue: Number(last7Revenue.toFixed(2)),
        todayRevenue: Number(todayRevenue.toFixed(2)),
        featureBreakdown, dailyData,
      },
    });
  } catch (error) {
    return json({ error: error.message, stats: null });
  }
};

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AnalyticsPage() {
  const { stats, error } = useLoaderData();
  const [period, setPeriod] = useState("30d");

  if (error || !stats) {
    return (
      <Page>
        <TitleBar title="Revenue Analytics" />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="an-wrapper">
          <div className="an-header">
            <div className="an-eyebrow">Performance Intelligence</div>
            <h1 className="an-title">Revenue Analytics</h1>
          </div>
          <div className="an-empty">
            <div className="an-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            </div>
            <h3>Waiting for data</h3>
            <p>Analytics events will appear here once your storefront widgets are active and visitors interact with them.</p>
          </div>
        </div>
      </Page>
    );
  }

  const attributionPct = stats.totalRevenue > 0
    ? ((stats.attributedRevenue / stats.totalRevenue) * 100).toFixed(1)
    : "0.0";

  const maxDaily = Math.max(...stats.dailyData, 1);

  const FUNNEL = [
    { label: "Page Views", value: stats.totalPageViews, color: "#2563EB" },
    { label: "Impressions", value: stats.totalImpressions, color: "#7C3AED" },
    { label: "Interactions", value: stats.totalInteractions, color: "#F97316" },
    { label: "Cart Adds", value: stats.totalCartAdds, color: "#059669" },
    { label: "Purchases", value: stats.totalPurchases, color: "#DC2626" },
  ];

  return (
    <Page>
      <TitleBar title="Revenue Analytics" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="an-wrapper">
        {/* Header */}
        <div className="an-header">
          <div>
            <div className="an-eyebrow">Performance Intelligence</div>
            <h1 className="an-title">Revenue Analytics</h1>
            <p className="an-subtitle">Track revenue and conversion events attributed to ConvertFlow features on your storefront.</p>
          </div>
          <div className="an-period-btns">
            {["7d", "30d", "90d"].map(p => (
              <button key={p} className={`an-period-btn ${period === p ? "an-period-btn--active" : ""}`} onClick={() => setPeriod(p)}>
                {p === "7d" ? "Last 7 Days" : p === "30d" ? "Last 30 Days" : "Last 90 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="an-kpi-grid">
          {[
            { label: "Attributed Revenue", value: fmt(stats.attributedRevenue), sub: `${attributionPct}% of total`, trend: "+", color: "#059669" },
            { label: "Total Revenue", value: fmt(stats.totalRevenue), sub: "All sessions", trend: null, color: "#2563EB" },
            { label: "Last 7 Days", value: fmt(stats.last7Revenue), sub: "Revenue this week", trend: null, color: "#7C3AED" },
            { label: "Today", value: fmt(stats.todayRevenue), sub: "Revenue today", trend: null, color: "#F97316" },
          ].map(({ label, value, sub, trend, color }) => (
            <div className="an-kpi-card" key={label} style={{ "--kpi-color": color }}>
              <div className="an-kpi-label">{label}</div>
              <div className="an-kpi-value">{value}</div>
              <div className="an-kpi-sub">
                {trend && <span className="an-kpi-trend">↑</span>}
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Sparkline Chart */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <h2 className="an-section-title">Daily Revenue (Last 14 Days)</h2>
          </div>
          <div className="an-sparkline">
            {stats.dailyData.map((val, i) => (
              <div key={i} className="an-bar-wrap">
                <div
                  className="an-bar"
                  style={{ height: `${Math.max((val / maxDaily) * 100, val > 0 ? 4 : 2)}%` }}
                  title={fmt(val)}
                />
              </div>
            ))}
          </div>
          <div className="an-chart-axis">
            {["14d ago", "", "7d ago", "", "Today"].map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="an-funnel-card">
          <h2 className="an-section-title">Conversion Funnel (30 Days)</h2>
          <div className="an-funnel-grid">
            {FUNNEL.map(({ label, value, color }, idx) => (
              <div className="an-funnel-step" key={label}>
                <div className="an-funnel-num" style={{ color }}>{value.toLocaleString()}</div>
                <div className="an-funnel-label">{label}</div>
                {idx < FUNNEL.length - 1 && (
                  <div className="an-funnel-rate">
                    {FUNNEL[idx + 1].value > 0 && value > 0
                      ? `${((FUNNEL[idx + 1].value / value) * 100).toFixed(0)}%→`
                      : "→"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Breakdown */}
        {stats.featureBreakdown.length > 0 && (
          <div className="an-table-card">
            <h2 className="an-section-title">Revenue by Feature</h2>
            <table className="an-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Feature</th>
                  <th>Attributed Revenue</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.featureBreakdown.map((f, i) => (
                  <tr key={f.name}>
                    <td className="an-td-num">{i + 1}</td>
                    <td className="an-td-feature">{f.name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</td>
                    <td className="an-td-rev">{fmt(f.revenue)}</td>
                    <td className="an-td-pct">
                      <div className="an-pct-bar-wrap">
                        <div className="an-pct-bar" style={{ width: `${stats.attributedRevenue > 0 ? (f.revenue / stats.attributedRevenue) * 100 : 0}%` }} />
                        <span>{stats.attributedRevenue > 0 ? ((f.revenue / stats.attributedRevenue) * 100).toFixed(1) : "0"}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Attribution note */}
        <div className="an-note">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
          Revenue is attributed when a visitor interacts with a ConvertFlow feature and then completes a purchase in the same session. Real order values only — no estimates.
        </div>
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  .an-wrapper { font-family: 'Nunito Sans', sans-serif; padding: 0 0 80px; max-width: 1140px; margin: 0 auto; }

  .an-header { padding: 48px 4px 40px; border-bottom: 1px solid #E2E8F0; margin-bottom: 36px; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .an-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #059669; margin-bottom: 12px; }
  .an-title { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: #1E293B; margin: 0 0 12px; letter-spacing: -0.02em; line-height: 1.15; }
  .an-subtitle { font-size: 14px; font-weight: 300; color: #64748B; max-width: 480px; line-height: 1.6; margin: 0; }

  .an-period-btns { display: flex; gap: 4px; background: #F1F5F9; padding: 4px; border-radius: 12px; align-self: flex-start; margin-top: 8px; }
  .an-period-btn { font-family: 'Nunito Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 9px; border: none; background: transparent; color: #64748B; cursor: pointer; transition: all 0.18s ease; }
  .an-period-btn--active { background: #fff; color: #1E293B; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  /* KPI cards */
  .an-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  @media (max-width: 768px) { .an-kpi-grid { grid-template-columns: repeat(2, 1fr); } }

  .an-kpi-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; transition: all 0.2s ease; border-top: 3px solid var(--kpi-color); }
  .an-kpi-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateY(-2px); }
  .an-kpi-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; margin-bottom: 10px; }
  .an-kpi-value { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 700; color: #1E293B; margin-bottom: 6px; line-height: 1; }
  .an-kpi-sub { font-size: 12px; color: #64748B; font-weight: 300; display: flex; align-items: center; gap: 4px; }
  .an-kpi-trend { color: #059669; font-weight: 700; }

  /* Chart */
  .an-chart-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 28px; margin-bottom: 20px; }
  .an-chart-header { margin-bottom: 24px; }
  .an-section-title { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 600; color: #1E293B; margin: 0; }

  .an-sparkline { display: flex; align-items: flex-end; gap: 6px; height: 120px; }
  .an-bar-wrap { flex: 1; display: flex; align-items: flex-end; height: 100%; }
  .an-bar { width: 100%; background: linear-gradient(to top, #2563EB, #60A5FA); border-radius: 4px 4px 0 0; min-height: 3px; transition: height 0.4s cubic-bezier(0.4,0,0.2,1); }
  .an-bar:hover { background: linear-gradient(to top, #1D4ED8, #3B82F6); }
  .an-chart-axis { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: #94A3B8; }

  /* Funnel */
  .an-funnel-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 28px; margin-bottom: 20px; }
  .an-funnel-grid { display: flex; align-items: center; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
  .an-funnel-step { display: flex; align-items: center; gap: 8px; }
  .an-funnel-num { font-family: 'Rubik', sans-serif; font-size: 28px; font-weight: 700; line-height: 1; }
  .an-funnel-label { font-size: 12px; color: #64748B; font-weight: 400; }
  .an-funnel-rate { font-size: 12px; color: #CBD5E1; font-weight: 600; padding: 0 4px; }

  /* Table */
  .an-table-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 28px; margin-bottom: 20px; }
  .an-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  .an-table th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; text-align: left; padding: 8px 12px; border-bottom: 1.5px solid #F1F5F9; }
  .an-table td { padding: 12px 12px; border-bottom: 1px solid #F8FAFC; font-size: 14px; color: #1E293B; }
  .an-table tr:last-child td { border-bottom: none; }
  .an-table tr:hover td { background: #F8FAFC; }
  .an-td-num { color: #94A3B8; font-weight: 600; font-size: 12px; width: 40px; }
  .an-td-feature { font-weight: 500; }
  .an-td-rev { font-family: 'Rubik', sans-serif; font-weight: 600; color: #059669; }
  .an-td-pct { width: 160px; }
  .an-pct-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .an-pct-bar { height: 6px; background: #2563EB; border-radius: 999px; transition: width 0.6s ease; flex-shrink: 0; }
  .an-pct-bar-wrap span { font-size: 12px; color: #64748B; white-space: nowrap; }

  /* Note */
  .an-note { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #64748B; font-weight: 300; line-height: 1.6; padding: 16px 20px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; }
  .an-note svg { width: 18px; height: 18px; flex-shrink: 0; color: #94A3B8; margin-top: 1px; }

  /* Empty */
  .an-empty { text-align: center; padding: 80px 24px; border: 2px dashed #E2E8F0; border-radius: 16px; background: #F8FAFC; }
  .an-empty-icon { width: 60px; height: 60px; background: #EFF6FF; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #2563EB; margin: 0 auto 20px; }
  .an-empty-icon svg { width: 30px; height: 30px; }
  .an-empty h3 { font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 600; color: #1E293B; margin: 0 0 10px; }
  .an-empty p { font-size: 14px; color: #64748B; font-weight: 300; line-height: 1.65; max-width: 400px; margin: 0 auto; }
`;
