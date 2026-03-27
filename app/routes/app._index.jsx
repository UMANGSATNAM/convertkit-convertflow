import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, PLAN_PRO, PLAN_ENTERPRISE } from "../shopify.server";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const billingCheck = await billing.check();
  const activeSubs = billingCheck?.appSubscriptions || [];
  const currentPlan = activeSubs.length > 0 ? activeSubs[0]?.name : "Free";
  return json({ currentPlan, PLAN_PRO, PLAN_ENTERPRISE });
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");
  if (plan === PLAN_PRO || plan === PLAN_ENTERPRISE) {
    await billing.request({ plan, isTest: true });
  }
  return null;
};

const NAV_CARDS = [
  {
    label: "Sections",
    href: "/app/sections",
    desc: "30+ conversion-optimized blocks",
    count: "30+",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>`,
  },
  {
    label: "Themes",
    href: "/app/themes",
    desc: "3 premium high-CVR themes",
    count: "3",
    color: "#D97706",
    bg: "#FFFBEB",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" /></svg>`,
  },
  {
    label: "Urgency Tools",
    href: "/app/urgency",
    desc: "Real-data scarcity & countdowns",
    count: "5",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
  },
  {
    label: "Reviews",
    href: "/app/reviews",
    desc: "AI review writing engine",
    count: "AI",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>`,
  },
  {
    label: "Upsells",
    href: "/app/upsells",
    desc: "Increase AOV with popup rules",
    count: "AOV+",
    color: "#F97316",
    bg: "#FFF7ED",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>`,
  },
  {
    label: "Analytics",
    href: "/app/analytics",
    desc: "Track conversions and tool impact",
    count: "Live",
    color: "#059669",
    bg: "#ECFDF5",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>`,
  },
  {
    label: "Pages",
    href: "/app/pages",
    desc: "Publish policy & trust pages",
    count: "8",
    color: "#0891B2",
    bg: "#ECFEFF",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`,
  },
  {
    label: "ConvertFlow Editor",
    href: "/app/convertflow",
    desc: "Drag-and-drop theme builder",
    count: "Pro",
    color: "#BE185D",
    bg: "#FDF2F8",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`,
  },
];

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? "Good morning" : HOUR < 17 ? "Good afternoon" : "Good evening";

export default function Index() {
  const { currentPlan, PLAN_PRO } = useLoaderData();
  const fetcher = useFetcher();
  const isFree = currentPlan === "Free";

  const upgradeToPro = () =>
    fetcher.submit({ plan: PLAN_PRO }, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Dashboard" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="dash-wrapper">

        {/* Hero Welcome */}
        <div className="dash-hero">
          <div className="dash-hero-text">
            <div className="dash-eyebrow">ConvertFlow Dashboard</div>
            <h1 className="dash-title">{GREETING}, let's convert.</h1>
            <p className="dash-subtitle">
              Your all-in-one conversion toolkit for Shopify. Every tool below is engineered to increase revenue.
            </p>
          </div>
          <div className="dash-plan-chip" data-plan={isFree ? "free" : "pro"}>
            <div className="dash-plan-dot" />
            {currentPlan} Plan
          </div>
        </div>

        {/* Stats Row */}
        <div className="dash-stats-row">
          {[
            { label: "Active Tools", value: "0", max: "8", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>` },
            { label: "Sections Available", value: "30", max: null, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>` },
            { label: "Themes Ready", value: "3", max: null, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" /></svg>` },
            { label: "Estimated CVR Lift", value: "+50%", max: null, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>` },
          ].map(({ label, value, icon }) => (
            <div className="dash-stat-card" key={label}>
              <div className="dash-stat-icon" dangerouslySetInnerHTML={{ __html: icon }} />
              <div className="dash-stat-value">{value}</div>
              <div className="dash-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature Navigation Grid */}
        <div className="dash-section-label">Quick Access</div>
        <div className="dash-nav-grid">
          {NAV_CARDS.map((card) => (
            <Link key={card.label} to={card.href} className="dash-nav-card" style={{ "--card-color": card.color, "--card-bg": card.bg }}>
              <div className="dash-nav-icon" dangerouslySetInnerHTML={{ __html: card.icon }} />
              <div className="dash-nav-count">{card.count}</div>
              <div className="dash-nav-label">{card.label}</div>
              <div className="dash-nav-desc">{card.desc}</div>
              <div className="dash-nav-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Upgrade Banner (Free only) */}
        {isFree && (
          <div className="dash-upgrade-banner">
            <div className="dash-upgrade-glow" />
            <div className="dash-upgrade-content">
              <div className="dash-upgrade-badge">PRO</div>
              <div>
                <h3 className="dash-upgrade-title">Unlock the full ConvertFlow arsenal</h3>
                <p className="dash-upgrade-sub">
                  All 30+ sections, all themes, urgency tools, AI review writing, upsell engine, and ConvertFlow code extraction. Everything that turns a Shopify store into a revenue machine.
                </p>
              </div>
            </div>
            <button className="dash-upgrade-btn" onClick={upgradeToPro}>
              Upgrade to Pro — $19/mo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </button>
          </div>
        )}
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;600&display=swap');

  .dash-wrapper {
    font-family: 'Nunito Sans', sans-serif;
    padding: 0 0 80px;
    max-width: 1140px;
    margin: 0 auto;
  }

  /* Hero */
  .dash-hero {
    padding: 48px 4px 44px;
    border-bottom: 1px solid #E2E8F0;
    margin-bottom: 36px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }
  .dash-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #2563EB; margin-bottom: 12px; }
  .dash-title {
    font-family: 'Rubik', sans-serif;
    font-size: clamp(30px, 4vw, 46px);
    font-weight: 800;
    color: #1E293B;
    margin: 0 0 12px;
    letter-spacing: -0.025em;
    line-height: 1.1;
  }
  .dash-subtitle { font-size: 15px; font-weight: 300; color: #64748B; max-width: 520px; line-height: 1.65; margin: 0; }

  .dash-plan-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 18px;
    border-radius: 999px;
    border: 1.5px solid #E2E8F0;
    background: #fff;
    color: #475569;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .dash-plan-chip[data-plan="pro"] { border-color: #BFDBFE; background: #EFF6FF; color: #2563EB; }
  .dash-plan-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #CBD5E1;
  }
  .dash-plan-chip[data-plan="pro"] .dash-plan-dot { background: #2563EB; }

  /* Stats */
  .dash-stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }
  @media (max-width: 768px) { .dash-stats-row { grid-template-columns: repeat(2, 1fr); } }

  .dash-stat-card {
    background: #fff;
    border: 1.5px solid #E2E8F0;
    border-radius: 16px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.2s ease;
  }
  .dash-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateY(-2px); }
  .dash-stat-icon { width: 36px; height: 36px; background: #F1F5F9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #64748B; }
  .dash-stat-icon svg { width: 18px; height: 18px; }
  .dash-stat-value { font-family: 'Rubik', sans-serif; font-size: 28px; font-weight: 700; color: #1E293B; line-height: 1; }
  .dash-stat-label { font-size: 12px; color: #94A3B8; font-weight: 400; }

  /* Nav Grid */
  .dash-section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #94A3B8; margin-bottom: 16px; }

  .dash-nav-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 36px;
  }
  @media (max-width: 960px) { .dash-nav-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .dash-nav-grid { grid-template-columns: 1fr; } }

  .dash-nav-card {
    background: var(--card-bg);
    border: 1.5px solid rgba(0,0,0,0.06);
    border-radius: 16px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }
  .dash-nav-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.1);
    border-color: var(--card-color);
  }
  .dash-nav-icon { width: 36px; height: 36px; color: var(--card-color); margin-bottom: 4px; }
  .dash-nav-icon svg { width: 36px; height: 36px; }
  .dash-nav-count { font-family: 'Rubik', sans-serif; font-size: 11px; font-weight: 700; color: var(--card-color); letter-spacing: 0.06em; text-transform: uppercase; }
  .dash-nav-label { font-family: 'Rubik', sans-serif; font-size: 15px; font-weight: 600; color: #1E293B; }
  .dash-nav-desc { font-size: 12px; color: #64748B; font-weight: 300; line-height: 1.5; flex: 1; }
  .dash-nav-arrow { color: var(--card-color); opacity: 0; transition: opacity 0.2s, transform 0.2s; }
  .dash-nav-arrow svg { width: 16px; height: 16px; }
  .dash-nav-card:hover .dash-nav-arrow { opacity: 1; transform: translateX(3px); }

  /* Upgrade Banner */
  .dash-upgrade-banner {
    position: relative;
    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
    border-radius: 20px;
    padding: 36px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    overflow: hidden;
    flex-wrap: wrap;
  }
  .dash-upgrade-glow {
    position: absolute;
    top: -60px; right: -60px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%);
    pointer-events: none;
  }
  .dash-upgrade-content { display: flex; align-items: flex-start; gap: 20px; flex: 1; position: relative; }
  .dash-upgrade-badge {
    font-family: 'Rubik', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 5px 12px;
    border-radius: 8px;
    background: #F97316;
    color: #fff;
    flex-shrink: 0;
    margin-top: 3px;
  }
  .dash-upgrade-title { font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 8px; }
  .dash-upgrade-sub { font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 300; line-height: 1.6; margin: 0; max-width: 480px; }
  .dash-upgrade-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 14px 28px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #F97316, #EA580C);
    color: #fff;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    position: relative;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(249,115,22,0.5);
  }
  .dash-upgrade-btn svg { width: 16px; height: 16px; }
  .dash-upgrade-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(249,115,22,0.6); }

  @media (max-width: 640px) {
    .dash-upgrade-banner { padding: 28px 24px; flex-direction: column; }
    .dash-hero { padding: 32px 4px 32px; }
  }
`;
