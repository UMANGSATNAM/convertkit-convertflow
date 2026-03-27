import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  Box,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const CATEGORY_FILTERS = ["All", "Trust", "Policy", "Post-Purchase", "Marketing"];

const TEMPLATES = [
  {
    id: "about_us",
    title: "About Us",
    description: "Tell your brand story, build emotional trust, and convert browsers into loyal customers.",
    category: "Trust",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>`,
    impact: "High Trust",
    tone: "success",
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "A professional contact page with support email, hours, and response time expectations.",
    category: "Trust",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>`,
    impact: "Support",
    tone: "info",
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Reduce support tickets by 40% with answers to the most common pre-purchase questions.",
    category: "Trust",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>`,
    impact: "-40% Tickets",
    tone: "success",
  },
  {
    id: "shipping",
    title: "Shipping Policy",
    description: "Clear delivery timelines, shipping zones, and carrier information to set expectations.",
    category: "Policy",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>`,
    impact: "Reduces Disputes",
    tone: "warning",
  },
  {
    id: "track_order",
    title: "Track Your Order",
    description: "Embed a live order tracking widget to reduce \"Where is my order\" support volume.",
    category: "Post-Purchase",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>`,
    impact: "-60% WISMO",
    tone: "success",
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    description: "Your 30-day money-back guarantee policy displayed to build buyer confidence.",
    category: "Policy",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.990" /></svg>`,
    impact: "+18% CVR",
    tone: "success",
  },
  {
    id: "size_guide",
    title: "Size Guide",
    description: "Interactive sizing table that reduces apparel return rates by setting fit expectations.",
    category: "Marketing",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>`,
    impact: "-25% Returns",
    tone: "info",
  },
  {
    id: "tos",
    title: "Terms of Service",
    description: "Standard ecommerce legal boilerplate pre-populated for your store.",
    category: "Policy",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" /></svg>`,
    impact: "Required",
    tone: "attention",
  },
];

export default function Pages() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [activeFilter, setActiveFilter] = useState("All");
  const [publishedIds, setPublishedIds] = useState(new Set());

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const templateId = fetcher.formData?.get("templateId");
      if (fetcher.data.success) {
        setPublishedIds((prev) => new Set([...prev, templateId]));
        shopify.toast.show(`"${fetcher.data.page?.title || "Page"}" published to store`);
      } else if (fetcher.data.error) {
        shopify.toast.show(`Error: ${fetcher.data.error}`, { isError: true });
      }
    }
  }, [fetcher.state, fetcher.data, shopify]);

  const handlePublish = (templateId) => {
    fetcher.submit(
      { templateId },
      { method: "POST", action: "/api/page-publish" }
    );
  };

  const filtered = activeFilter === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeFilter);

  const isLoading = (id) =>
    fetcher.state !== "idle" && fetcher.formData?.get("templateId") === id;

  return (
    <Page>
      <TitleBar title="Prebuilt Pages" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="cfp-wrapper">
        {/* Header */}
        <div className="cfp-header">
          <div className="cfp-eyebrow">Page Library</div>
          <h1 className="cfp-title">Publish in one click</h1>
          <p className="cfp-subtitle">
            Conversion-optimized foundational pages pre-built for Shopify. Each template follows ecommerce best practices and is live on your store in seconds.
          </p>
        </div>

        {/* Filters */}
        <div className="cfp-filters">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f}
              className={`cfp-filter-pill ${activeFilter === f ? "cfp-filter-pill--active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="cfp-grid">
          {filtered.map((template) => {
            const isPublished = publishedIds.has(template.id);
            const loading = isLoading(template.id);
            return (
              <div key={template.id} className={`cfp-card ${isPublished ? "cfp-card--published" : ""}`}>
                <div className="cfp-card-top">
                  <div className="cfp-icon-wrap">
                    <span dangerouslySetInnerHTML={{ __html: template.icon }} />
                  </div>
                  <span className={`cfp-impact-badge cfp-impact--${template.tone}`}>
                    {template.impact}
                  </span>
                </div>
                <div className="cfp-card-body">
                  <div className="cfp-card-category">{template.category}</div>
                  <h3 className="cfp-card-title">{template.title}</h3>
                  <p className="cfp-card-desc">{template.description}</p>
                </div>
                <button
                  className={`cfp-publish-btn ${isPublished ? "cfp-publish-btn--done" : ""}`}
                  onClick={() => !isPublished && handlePublish(template.id)}
                  disabled={loading || isPublished}
                >
                  {loading ? (
                    <span className="cfp-spinner" />
                  ) : isPublished ? (
                    <>
                      <svg className="cfp-check-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      Published
                    </>
                  ) : (
                    "Publish to Store"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  .cfp-wrapper {
    font-family: 'Nunito Sans', sans-serif;
    padding: 0 0 80px;
    max-width: 1140px;
    margin: 0 auto;
  }

  /* Header */
  .cfp-header {
    padding: 48px 4px 40px;
    border-bottom: 1px solid #E2E8F0;
    margin-bottom: 32px;
  }
  .cfp-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2563EB;
    margin-bottom: 12px;
  }
  .cfp-title {
    font-family: 'Rubik', sans-serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    color: #1E293B;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .cfp-subtitle {
    font-size: 15px;
    font-weight: 300;
    color: #64748B;
    max-width: 560px;
    line-height: 1.65;
    margin: 0;
  }

  /* Filters */
  .cfp-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .cfp-filter-pill {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 7px 18px;
    border-radius: 999px;
    border: 1.5px solid #E2E8F0;
    background: #fff;
    color: #64748B;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .cfp-filter-pill:hover {
    border-color: #2563EB;
    color: #2563EB;
    background: #EFF6FF;
  }
  .cfp-filter-pill--active {
    background: #2563EB;
    border-color: #2563EB;
    color: #fff;
    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  }

  /* Grid */
  .cfp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  /* Card */
  .cfp-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(12px);
    border: 1.5px solid #E2E8F0;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    cursor: default;
  }
  .cfp-card:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 32px rgba(37,99,235,0.10), 0 1px 4px rgba(0,0,0,0.05);
    transform: translateY(-2px);
  }
  .cfp-card--published {
    border-color: #86EFAC !important;
    background: rgba(240,253,244,0.9) !important;
  }

  .cfp-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .cfp-icon-wrap {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563EB;
    flex-shrink: 0;
  }
  .cfp-icon-wrap svg { width: 22px; height: 22px; }

  .cfp-impact-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .cfp-impact--success { background: #DCFCE7; color: #15803D; }
  .cfp-impact--info { background: #DBEAFE; color: #1D4ED8; }
  .cfp-impact--warning { background: #FEF9C3; color: #A16207; }
  .cfp-impact--attention { background: #FEE2E2; color: #B91C1C; }

  .cfp-card-body { flex: 1; }
  .cfp-card-category {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #94A3B8;
    margin-bottom: 6px;
  }
  .cfp-card-title {
    font-family: 'Rubik', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: #1E293B;
    margin: 0 0 8px;
  }
  .cfp-card-desc {
    font-size: 13px;
    font-weight: 300;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  /* Publish button */
  .cfp-publish-btn {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 11px 20px;
    border-radius: 10px;
    border: none;
    background: #1E293B;
    color: #fff;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .cfp-publish-btn:hover:not(:disabled) {
    background: #2563EB;
    box-shadow: 0 4px 16px rgba(37,99,235,0.35);
    transform: translateY(-1px);
  }
  .cfp-publish-btn--done {
    background: #16A34A !important;
    cursor: default !important;
  }
  .cfp-publish-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
  .cfp-check-icon { width: 16px; height: 16px; }

  .cfp-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cfp-spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes cfp-spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .cfp-grid { grid-template-columns: 1fr; }
    .cfp-header { padding: 32px 4px 28px; }
  }
`;
