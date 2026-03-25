import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

const THEMES = [
  {
    id: "asian-footwears",
    name: "Asian Footwears v2",
    tagline: "Built for Footwear. Built to Convert.",
    badge: "PREMIUM",
    category: "Apparel & Footwear",
    description:
      "High-converting storefront engineered for dropshipping, apparel, and custom footwear brands. ConvertFlow UI blocks let you launch urgency widgets without writing a line of code.",
    cvr: null,
    gradient: "linear-gradient(145deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
    accentColor: "#e8c547",
    textOverlay: "AF",
    zipPath: "/themes/asian-footwears-shopify-theme-v4.zip",
    themeName: "Asian Footwears v2 - ConvertFlow",
    previewUrl: "https://uwyhex-nb.myshopify.com/?preview_theme_id=",
    highlights: ["Speed-first layout", "Sticky urgency bar", "Mobile-native"],
  },
  {
    id: "luxe-fashion",
    name: "Aura Luxe Fashion",
    tagline: "Where Luxury Meets Conversion.",
    badge: "50% CVR",
    category: "High-End Apparel",
    description:
      "Minimalist luxury theme built around Playfair Display editorial aesthetics. Off-white palettes, high-urgency layout triggers, and zero-clutter product storytelling.",
    cvr: "50%",
    gradient: "linear-gradient(145deg, #0a0804 0%, #1c1408 60%, #2a1f0a 100%)",
    accentColor: "#d4af37",
    textOverlay: "LX",
    zipPath: "/themes/luxe-fashion-theme-v2.zip",
    themeName: "Aura Luxe Fashion - ConvertFlow",
    previewUrl: null,
    highlights: ["Playfair Display", "Off-white palette", "High-urgency triggers"],
  },
  {
    id: "velocity-streetwear",
    name: "Velocity Streetwear",
    tagline: "Move Fast. Sell Faster.",
    badge: "50% CVR",
    category: "Sneakers & Hype",
    description:
      "Hypebeast-grade theme engineered for velocity. Neon accents, aggressive Oswald headlines, and max-urgency countdown timers that make customers act now — not later.",
    cvr: "50%",
    gradient: "linear-gradient(145deg, #0d0d0d 0%, #1a0a1a 50%, #0d0d0d 100%)",
    accentColor: "#39ff14",
    textOverlay: "VS",
    zipPath: "/themes/velocity-streetwear-theme-v2.zip",
    themeName: "Velocity Streetwear - ConvertFlow",
    previewUrl: null,
    highlights: ["Oswald typography", "Neon accent system", "Countdown timers"],
  },
];

export default function Themes() {
  return (
    <Page>
      <TitleBar title="Theme Store" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="cf-themes-page">
        {/* — Header — */}
        <div className="cf-themes-header">
          <div className="cf-themes-header-eyebrow">ConvertFlow Theme Store</div>
          <h1 className="cf-themes-header-title">
            Themes engineered to <em>convert</em>
          </h1>
          <p className="cf-themes-header-sub">
            Structurally customized Shopify themes with ConvertFlow urgency features natively built-in.
            Install in one click. Go live today.
          </p>
        </div>

        {/* — Theme Grid — */}
        <div className="cf-themes-grid">
          {THEMES.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} index={i} />
          ))}
        </div>
      </div>
    </Page>
  );
}

function ThemeCard({ theme, index }) {
  const fetcher = useFetcher();
  const isInstalling = fetcher.state !== "idle";
  const result = fetcher.data;

  const install = () => {
    fetcher.submit(
      { themePath: theme.zipPath, themeName: theme.themeName },
      { method: "POST", action: "/api/convertflow/install-ready-theme" }
    );
  };

  const isSuccess = result?.success;
  const isError = result?.error;

  return (
    <div className={`cf-theme-card cf-theme-card--${index % 2 === 0 ? "left" : "right"}`}>
      {/* Visual panel */}
      <div className="cf-theme-visual" style={{ background: theme.gradient }}>
        <div className="cf-theme-monogram" style={{ color: theme.accentColor }}>
          {theme.textOverlay}
        </div>
        <div className="cf-theme-badge" style={{ background: theme.accentColor, color: "#000" }}>
          {theme.badge}
        </div>
        {/* Decorative lines */}
        <div className="cf-theme-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cf-theme-line" style={{ "--delay": `${i * 0.1}s`, "--accent": theme.accentColor }} />
          ))}
        </div>
      </div>

      {/* Content panel */}
      <div className="cf-theme-content">
        <div className="cf-theme-category">{theme.category}</div>
        <h2 className="cf-theme-name">{theme.name}</h2>
        <p className="cf-theme-tagline" style={{ color: theme.accentColor }}>
          {theme.tagline}
        </p>
        <p className="cf-theme-desc">{theme.description}</p>

        <div className="cf-theme-highlights">
          {theme.highlights.map((h) => (
            <span key={h} className="cf-theme-highlight" style={{ borderColor: theme.accentColor + "44", color: theme.accentColor }}>
              ✦ {h}
            </span>
          ))}
        </div>

        {/* Feedback */}
        {isSuccess && (
          <div className="cf-theme-feedback cf-theme-feedback--success">
            ✓ Theme installed as draft — check your Shopify Themes page.
          </div>
        )}
        {isError && (
          <div className="cf-theme-feedback cf-theme-feedback--error">
            ✕ {result.error}
          </div>
        )}

        <div className="cf-theme-actions">
          {theme.previewUrl && (
            <a
              href={theme.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cf-btn cf-btn--ghost"
            >
              <span>↗</span> Preview
            </a>
          )}
          <button
            className="cf-btn cf-btn--primary"
            style={{ "--accent": theme.accentColor }}
            onClick={install}
            disabled={isInstalling || isSuccess}
          >
            {isInstalling ? (
              <span className="cf-btn-spinner" />
            ) : isSuccess ? (
              "✓ Installed"
            ) : (
              "Install to Store"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

  .cf-themes-page {
    font-family: 'DM Sans', sans-serif;
    padding: 0 0 80px;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .cf-themes-header {
    padding: 48px 8px 56px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 56px;
  }
  .cf-themes-header-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 16px;
  }
  .cf-themes-header-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    color: #111;
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }
  .cf-themes-header-title em {
    font-style: italic;
    font-weight: 400;
    font-family: 'DM Sans', sans-serif;
    color: #374151;
  }
  .cf-themes-header-sub {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.6;
    color: #4b5563;
    max-width: 560px;
    margin: 0;
  }

  /* ── Theme Grid ── */
  .cf-themes-grid {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* ── Theme Card ── */
  .cf-theme-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 420px;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    position: relative;
    margin-bottom: 24px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .cf-theme-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.12);
  }
  .cf-theme-card--right {
    direction: rtl;
  }
  .cf-theme-card--right > * {
    direction: ltr;
  }

  /* ── Visual Panel ── */
  .cf-theme-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 360px;
  }
  .cf-theme-monogram {
    font-family: 'Syne', sans-serif;
    font-size: 96px;
    font-weight: 800;
    letter-spacing: -0.05em;
    opacity: 0.15;
    user-select: none;
    position: absolute;
    z-index: 1;
  }
  .cf-theme-badge {
    position: absolute;
    top: 24px;
    left: 24px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 4px;
    z-index: 3;
  }
  .cf-theme-lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 2;
  }
  .cf-theme-line {
    position: absolute;
    height: 1px;
    width: 60%;
    background: var(--accent);
    opacity: 0.12;
    animation: slide-in 1.5s var(--delay) both;
  }
  .cf-theme-line:nth-child(1) { top: 20%; left: -10%; transform: rotate(-8deg); }
  .cf-theme-line:nth-child(2) { top: 35%; left: -5%; transform: rotate(-8deg); width: 80%; }
  .cf-theme-line:nth-child(3) { top: 50%; left: -15%; transform: rotate(-8deg); }
  .cf-theme-line:nth-child(4) { top: 60%; right: -10%; left: auto; transform: rotate(-8deg); }
  .cf-theme-line:nth-child(5) { top: 72%; left: -5%; transform: rotate(-8deg); width: 50%; }
  .cf-theme-line:nth-child(6) { top: 82%; left: 10%; transform: rotate(-8deg); width: 70%; }

  @keyframes slide-in {
    from { opacity: 0; transform: rotate(-8deg) translateX(-20px); }
    to { opacity: 0.12; transform: rotate(-8deg) translateX(0); }
  }

  /* ── Content Panel ── */
  .cf-theme-content {
    padding: 48px 48px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #fff;
  }
  .cf-theme-category {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 12px;
  }
  .cf-theme-name {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .cf-theme-tagline {
    font-size: 14px;
    font-weight: 400;
    font-style: italic;
    margin: 0 0 20px;
  }
  .cf-theme-desc {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.65;
    color: #4b5563;
    margin: 0 0 24px;
  }
  .cf-theme-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
  }
  .cf-theme-highlight {
    font-size: 11px;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid;
    background: transparent;
  }

  /* ── Feedback ── */
  .cf-theme-feedback {
    font-size: 13px;
    font-weight: 400;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  .cf-theme-feedback--success {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  .cf-theme-feedback--error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  /* ── Actions ── */
  .cf-theme-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .cf-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .cf-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .cf-btn--primary {
    background: #111;
    color: #fff;
    min-width: 160px;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .cf-btn--primary:hover:not(:disabled) {
    background: #222;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
  .cf-btn--ghost {
    background: transparent;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  .cf-btn--ghost:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  .cf-btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .cf-theme-card,
    .cf-theme-card--right {
      grid-template-columns: 1fr;
      direction: ltr;
    }
    .cf-theme-visual {
      min-height: 200px;
    }
    .cf-theme-content {
      padding: 32px 24px;
    }
    .cf-themes-header {
      padding: 32px 8px 40px;
    }
  }
`;
