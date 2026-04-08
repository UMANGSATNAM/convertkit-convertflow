// block-to-html.server.js — Converts JSON block schema to optimized static HTML
// Used by the publish pipeline to generate body_html for Shopify pages

/**
 * Convert an array of section blocks + global styles into a complete HTML string
 */
export function blockToHtml(sections, globalStyles = {}) {
  const fonts = globalStyles.fonts || {};
  const colors = globalStyles.colors || {};

  const fontLink = buildFontLink(fonts);
  const cssVars = buildCssVars(colors);

  const sectionHtml = (sections || [])
    .filter((s) => s.visible !== false)
    .map((s) => renderSection(s, colors, fonts))
    .join("\n");

  return `${fontLink}
<style>
  :root { ${cssVars} }
  .pb-page { font-family: var(--pb-font-body, 'Inter', sans-serif); color: var(--pb-text, #1E1E1E); line-height: 1.6; margin: 0; }
  .pb-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .pb-page img { max-width: 100%; height: auto; }
  .pb-page a { text-decoration: none; color: inherit; }
  .pb-heading { font-family: var(--pb-font-heading, 'Inter', serif); }
  .pb-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  @keyframes pb-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
</style>
<div class="pb-page">
${sectionHtml}
</div>`;
}

function buildFontLink(fonts) {
  const families = [];
  if (fonts.heading) families.push(fonts.heading.replace(/ /g, "+") + ":wght@400;500;600;700;800");
  if (fonts.body && fonts.body !== fonts.heading) families.push(fonts.body.replace(/ /g, "+") + ":wght@300;400;500;600;700");
  if (fonts.accent && fonts.accent !== fonts.heading && fonts.accent !== fonts.body) {
    families.push(fonts.accent.replace(/ /g, "+") + ":wght@400;600;700");
  }
  if (families.length === 0) return "";
  return `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=${families.join("&family=")}&display=swap" rel="stylesheet">`;
}

function buildCssVars(colors) {
  const vars = [];
  if (colors.primary) vars.push(`--pb-primary: ${colors.primary}`);
  if (colors.secondary) vars.push(`--pb-secondary: ${colors.secondary}`);
  if (colors.background) vars.push(`--pb-bg: ${colors.background}`);
  if (colors.surface) vars.push(`--pb-surface: ${colors.surface}`);
  if (colors.text) vars.push(`--pb-text: ${colors.text}`);
  if (colors.muted) vars.push(`--pb-muted: ${colors.muted}`);
  if (colors.border) vars.push(`--pb-border: ${colors.border}`);
  if (colors.accent) vars.push(`--pb-accent: ${colors.accent}`);
  return vars.join("; ");
}

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderSection(section, colors, fonts) {
  const s = { ...section, ...(section.settings || {}) };
  const bg = s.background_color || colors.background || "#FFFFFF";
  const textCol = s.text_color || colors.text || "#1E1E1E";

  switch (s.type) {
    case "announcement_bar":
      return renderAnnouncementBar(s);
    case "hero":
      return renderHero(s, fonts);
    case "trust_badges":
      return renderTrustBadges(s);
    case "product_showcase":
      return renderProductShowcase(s, fonts);
    case "image_with_text":
      return renderImageWithText(s, fonts);
    case "social_proof":
      return renderSocialProof(s, fonts);
    case "faq":
      return renderFaq(s, fonts);
    case "cta_banner":
      return renderCtaBanner(s, fonts);
    case "newsletter":
      return renderNewsletter(s);
    case "countdown_timer":
      return renderCountdown(s);
    case "urgency_bar":
      return renderUrgencyBar(s);
    case "footer":
      return renderFooter(s, fonts);
    default:
      return `<!-- Unknown section: ${esc(s.type)} -->`;
  }
}

// ── Announcement Bar ──
function renderAnnouncementBar(s) {
  const msgs = s.messages || [s.message || ""];
  const bg = s.background_color || "#1E1E1E";
  const color = s.text_color || "#FFFFFF";
  const items = [...msgs, ...msgs].map((m) => `<span style="padding:0 48px;white-space:nowrap;font-size:13px;font-weight:500;letter-spacing:.06em;">${esc(m)}</span>`).join("");
  return `<div style="background:${bg};color:${color};overflow:hidden;padding:10px 0;">
  <div style="display:flex;animation:pb-slide 18s linear infinite;">${items}</div>
</div>`;
}

// ── Hero ──
function renderHero(s, fonts) {
  const bg = s.background_color || "#FFFFFF";
  const textCol = s.text_color || "#1E1E1E";
  const ctaColor = s.cta_color || "#1E1E1E";
  const headlineFont = fonts.heading || "Inter";

  let headline = esc(s.headline || "Welcome").replace(/\n/g, "<br>");
  if (s.headline_italic) {
    headline = headline.replace(esc(s.headline_italic), `<em style="color:var(--pb-primary);font-style:italic">${esc(s.headline_italic)}</em>`);
  }

  const features = (s.features || []).map((f) => {
    const text = typeof f === "string" ? f : f.text || "";
    return `<div style="display:flex;align-items:center;gap:12px;font-size:14px;"><span style="width:20px;height:20px;background:var(--pb-accent,#F5D5C8);color:var(--pb-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">✓</span>${esc(text)}</div>`;
  }).join("");

  const priceHtml = s.price_current ? `<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:32px;">
    <span style="font-size:36px;font-weight:600;">${esc(s.price_current)}</span>
    ${s.price_original ? `<span style="font-size:18px;text-decoration:line-through;color:var(--pb-muted);">${esc(s.price_original)}</span>` : ""}
    ${s.price_badge ? `<span style="background:var(--pb-secondary,#8FA68B);color:#fff;padding:4px 12px;font-size:12px;font-weight:600;">${esc(s.price_badge)}</span>` : ""}
  </div>` : "";

  return `<section style="display:grid;grid-template-columns:1fr 1fr;min-height:88vh;background:${bg};color:${textCol};">
  <div style="display:flex;flex-direction:column;justify-content:center;padding:80px 60px;">
    ${s.badge_text ? `<div style="display:inline-flex;align-items:center;gap:8px;background:var(--pb-accent,#F5D5C8);color:var(--pb-primary);padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:28px;width:fit-content;">${esc(s.badge_text)}</div>` : ""}
    <h1 class="pb-heading" style="font-family:'${headlineFont}',serif;font-size:clamp(44px,5vw,68px);line-height:1.05;font-weight:700;margin-bottom:20px;">${headline}</h1>
    ${s.subtext ? `<p style="font-size:15px;color:var(--pb-muted);line-height:1.8;max-width:420px;margin-bottom:32px;">${esc(s.subtext)}</p>` : ""}
    ${features ? `<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:36px;">${features}</div>` : ""}
    ${priceHtml}
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      ${s.cta_text ? `<a href="#shop" style="display:inline-block;background:${ctaColor};color:${ctaColor === "#1E1E1E" || ctaColor === "#111111" || ctaColor === "#080808" ? "#fff" : "#000"};padding:16px 44px;font-size:14px;font-weight:500;border:2px solid ${ctaColor};">${esc(s.cta_text)}</a>` : ""}
      ${s.cta_secondary_text ? `<a href="#info" style="display:inline-block;background:transparent;color:${textCol};padding:16px 44px;font-size:14px;font-weight:500;border:2px solid var(--pb-border,#E0E0E0);">${esc(s.cta_secondary_text)}</a>` : ""}
    </div>
  </div>
  <div style="background:${s.image_bg_gradient || s.image_bg_color || 'var(--pb-surface)'};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
    <div style="text-align:center;padding:40px;">
      ${s.image_label ? `<div class="pb-heading" style="font-size:24px;color:var(--pb-primary);">${esc(s.image_label)}</div>` : ""}
      ${s.image_sublabel ? `<div style="font-size:12px;letter-spacing:.12em;color:var(--pb-muted);text-transform:uppercase;margin-top:6px;">${esc(s.image_sublabel)}</div>` : ""}
    </div>
  </div>
</section>`;
}

// ── Trust Badges ──
function renderTrustBadges(s) {
  const bg = s.background_color || "#1E1E1E";
  const textCol = s.text_color || "#FFFFFF";
  const badges = s.badges || [];
  const items = badges.map((b) => `<div style="padding:0 40px;display:flex;align-items:center;gap:10px;border-right:1px solid rgba(255,255,255,.1);">
    <span style="font-size:18px;">${esc(b.icon)}</span>
    <span style="font-size:13px;color:rgba(255,255,255,.75);"><strong style="color:#fff;">${esc(b.number || "")}</strong> ${esc(b.label)}</span>
  </div>`).join("");
  return `<div style="background:${bg};color:${textCol};padding:20px 60px;display:flex;justify-content:center;">${items}</div>`;
}

// ── Product Showcase ──
function renderProductShowcase(s, fonts) {
  const products = s.products || [];
  const cols = s.columns || 3;
  const headingFont = fonts.heading || "Inter";
  const cards = products.map((p) => `<div style="cursor:pointer;">
    <div style="aspect-ratio:.75;background:${p.gradient || "var(--pb-surface)"};border-radius:4px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;position:relative;">
      <div style="text-align:center;padding:20px;">
        <div class="pb-heading" style="font-size:20px;color:var(--pb-primary);">${esc(p.name)}</div>
        <div style="font-size:11px;letter-spacing:.1em;color:var(--pb-muted);text-transform:uppercase;margin-top:4px;">${esc(p.variant || "")}</div>
      </div>
      ${p.tag ? `<div style="position:absolute;top:12px;left:12px;background:var(--pb-primary);color:#fff;font-size:10px;font-weight:600;padding:4px 10px;letter-spacing:.08em;text-transform:uppercase;">${esc(p.tag)}</div>` : ""}
    </div>
    <div style="font-size:15px;font-weight:500;margin-bottom:4px;">${esc(p.name)}</div>
    ${p.variant ? `<div style="font-size:12px;color:var(--pb-muted);margin-bottom:10px;">${esc(p.variant)}</div>` : ""}
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:18px;font-weight:600;">${esc(p.price)}</span>
      ${p.original_price ? `<span style="font-size:13px;text-decoration:line-through;color:var(--pb-muted);">${esc(p.original_price)}</span>` : ""}
      ${p.discount ? `<span style="font-size:11px;color:var(--pb-secondary);font-weight:600;">${esc(p.discount)}</span>` : ""}
    </div>
  </div>`).join("");

  return `<section style="padding:${s.padding_y || 80}px 60px;background:${s.background_color || "#FFFFFF"};">
  ${s.kicker ? `<div style="font-size:12px;letter-spacing:.14em;color:var(--pb-primary);text-transform:uppercase;font-weight:600;margin-bottom:12px;">${esc(s.kicker)}</div>` : ""}
  <h2 class="pb-heading" style="font-family:'${headingFont}',serif;font-size:clamp(36px,3.5vw,52px);line-height:1.1;font-weight:700;margin-bottom:14px;">${esc(s.headline || "")}</h2>
  ${s.subtext ? `<p style="font-size:15px;color:var(--pb-muted);max-width:460px;line-height:1.8;margin-bottom:52px;">${esc(s.subtext)}</p>` : ""}
  <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:24px;">${cards}</div>
</section>`;
}

// ── Image With Text ──
function renderImageWithText(s, fonts) {
  const headingFont = fonts.heading || "Inter";
  let headline = esc(s.headline || "");
  if (s.headline_italic) {
    headline = headline.replace(esc(s.headline_italic), `<em style="color:var(--pb-primary);font-style:italic;">${esc(s.headline_italic)}</em>`);
  }
  const features = (s.features_grid || []).map((f) => `<div style="padding:20px;background:#fff;border:1px solid var(--pb-border,#E0E0E0);">
    <div style="font-size:22px;margin-bottom:8px;">${esc(f.icon)}</div>
    <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${esc(f.title)}</div>
    <div style="font-size:12px;color:var(--pb-muted);">${esc(f.text)}</div>
  </div>`).join("");

  return `<section style="padding:${s.padding_y || 80}px 60px;background:${s.background_color || "var(--pb-surface)"};">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;">
    <div>
      ${s.kicker ? `<div style="font-size:12px;letter-spacing:.14em;color:var(--pb-primary);text-transform:uppercase;font-weight:600;margin-bottom:12px;">${esc(s.kicker)}</div>` : ""}
      <h2 class="pb-heading" style="font-family:'${headingFont}',serif;font-size:clamp(36px,3.5vw,52px);line-height:1.1;font-weight:700;margin-bottom:14px;">${headline}</h2>
      ${s.text ? `<p style="font-size:15px;color:var(--pb-muted);max-width:460px;line-height:1.8;margin-bottom:52px;">${esc(s.text)}</p>` : ""}
      ${features ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">${features}</div>` : ""}
    </div>
    <div style="background:${s.image_bg_gradient || "var(--pb-surface)"};aspect-ratio:1;border-radius:4px;display:flex;align-items:center;justify-content:center;">
      ${s.image_label ? `<div class="pb-heading" style="font-size:36px;color:var(--pb-primary);">${esc(s.image_label)}</div>` : ""}
    </div>
  </div>
</section>`;
}

// ── Social Proof ──
function renderSocialProof(s, fonts) {
  const headingFont = fonts.heading || "Inter";
  const reviews = s.reviews || [];
  const cards = reviews.map((r) => `<div style="background:${s.background_color === "#FAF3EC" || s.background_color === "#FAF8F4" ? "#fff" : "#F8FAFC"};padding:28px;border-radius:4px;border:1px solid var(--pb-border,#E0E0E0);">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="width:40px;height:40px;background:var(--pb-accent,#F5D5C8);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${esc(r.avatar || r.name?.charAt(0) || "★")}</div>
      <div><div style="font-size:14px;font-weight:600;">${esc(r.name)}</div><div style="font-size:12px;color:var(--pb-muted);">${esc(r.location || "")}</div></div>
    </div>
    <div style="color:var(--pb-primary);font-size:13px;letter-spacing:1px;margin-bottom:10px;">${"★".repeat(r.rating || 5)}</div>
    <p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:12px;">${esc(r.text)}</p>
    ${r.tag ? `<span style="display:inline-block;background:var(--pb-accent,#F5D5C8);color:var(--pb-primary);font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;">${esc(r.tag)}</span>` : ""}
  </div>`).join("");

  return `<section style="padding:${s.padding_y || 80}px 60px;background:${s.background_color || "#FFFFFF"};">
  ${s.kicker ? `<div style="font-size:12px;letter-spacing:.14em;color:var(--pb-primary);text-transform:uppercase;font-weight:600;margin-bottom:12px;">${esc(s.kicker)}</div>` : ""}
  <h2 class="pb-heading" style="font-family:'${headingFont}',serif;font-size:clamp(36px,3.5vw,52px);line-height:1.1;font-weight:700;margin-bottom:14px;">${esc(s.headline || "")}</h2>
  ${s.overall_rating ? `<div style="display:flex;align-items:center;gap:16px;margin-bottom:40px;">
    <div class="pb-heading" style="font-size:56px;font-weight:700;line-height:1;">${esc(s.overall_rating)}</div>
    <div><div style="color:var(--pb-primary);font-size:20px;letter-spacing:2px;">★★★★★</div><div style="font-size:13px;color:var(--pb-muted);margin-top:4px;">Based on ${esc(s.total_reviews || "")} reviews</div></div>
  </div>` : ""}
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">${cards}</div>
</section>`;
}

// ── FAQ ──
function renderFaq(s, fonts) {
  const headingFont = fonts.heading || "Inter";
  const items = s.items || [];
  const align = s.alignment === "center" ? "text-align:center;" : "";
  const faqItems = items.map((item, i) => `<div class="pb-faq-item" style="border-bottom:1px solid var(--pb-border,#E0E0E0);">
    <div class="pb-faq-q" onclick="this.parentElement.classList.toggle('pb-faq-open')" style="padding:20px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:15px;font-weight:500;">
      ${esc(item.question)}
      <span class="pb-faq-icon" style="width:28px;height:28px;background:var(--pb-accent,#F5D5C8);color:var(--pb-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform .3s;">+</span>
    </div>
    <div class="pb-faq-a" style="max-height:0;overflow:hidden;transition:max-height .4s ease;">
      <p style="font-size:14px;color:var(--pb-muted);line-height:1.8;padding-bottom:20px;">${esc(item.answer)}</p>
    </div>
  </div>`).join("");

  return `<section style="padding:${s.padding_y || 80}px 60px;background:${s.background_color || "#FFFFFF"};${align}">
  ${s.kicker ? `<div style="font-size:12px;letter-spacing:.14em;color:var(--pb-primary);text-transform:uppercase;font-weight:600;margin-bottom:12px;">${esc(s.kicker)}</div>` : ""}
  <h2 class="pb-heading" style="font-family:'${headingFont}',serif;font-size:clamp(36px,3.5vw,52px);line-height:1.1;font-weight:700;margin-bottom:48px;max-width:${align ? "100%" : "560px"};">${esc(s.headline || "")}</h2>
  <div style="max-width:800px;${align ? "margin:0 auto;" : ""}">${faqItems}</div>
</section>
<style>.pb-faq-open .pb-faq-icon{transform:rotate(45deg)!important;}.pb-faq-open .pb-faq-a{max-height:200px!important;}</style>`;
}

// ── CTA Banner ──
function renderCtaBanner(s, fonts) {
  const headingFont = fonts.heading || "Inter";
  return `<section style="padding:${s.padding_y || 80}px 60px;background:${s.background_color || "var(--pb-primary)"};color:${s.text_color || "#FFFFFF"};text-align:center;">
  <h2 class="pb-heading" style="font-family:'${headingFont}',serif;font-size:clamp(36px,3.5vw,52px);line-height:1.1;font-weight:700;margin-bottom:16px;">${esc(s.headline || "")}</h2>
  ${s.subtext ? `<p style="font-size:15px;opacity:.7;max-width:480px;margin:0 auto 40px;">${esc(s.subtext)}</p>` : ""}
  ${s.cta_text ? `<a href="#shop" style="display:inline-block;background:${s.cta_color || "#FFFFFF"};color:${s.cta_text_color || "#1E1E1E"};padding:16px 44px;font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;">${esc(s.cta_text)}</a>` : ""}
</section>`;
}

// ── Newsletter ──
function renderNewsletter(s) {
  return `<section style="padding:${s.padding_y || 48}px 60px;background:${s.background_color || "#0F172A"};color:${s.text_color || "#FFFFFF"};text-align:center;">
  <div style="font-size:24px;font-weight:700;margin-bottom:8px;">${esc(s.headline || "Stay in the Loop")}</div>
  <div style="color:rgba(255,255,255,.6);font-size:14px;margin-bottom:24px;">${esc(s.subtext || "")}</div>
  <div style="display:flex;gap:8px;max-width:400px;margin:0 auto;">
    <input placeholder="${esc(s.placeholder || "Email")}" style="flex:1;padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff;font-size:14px;">
    <button style="background:${s.button_color || "#10B981"};color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">${esc(s.button_text || "Subscribe")}</button>
  </div>
</section>`;
}

// ── Countdown ──
function renderCountdown(s) {
  return `<section style="padding:${s.padding_y || 48}px 60px;background:${s.background_color || "#0F172A"};color:${s.text_color || "#FFFFFF"};text-align:center;">
  <div style="font-size:20px;font-weight:700;margin-bottom:16px;">${esc(s.headline || "Sale Ends In")}</div>
  <div style="display:flex;gap:16px;justify-content:center;">
    ${["23", "14", "52", "08"].map((v, i) => `<div style="background:rgba(255,255,255,.1);border-radius:8px;padding:12px 16px;min-width:60px;">
      <div style="font-size:28px;font-weight:800;color:${s.accent_color || "#EF4444"};">${v}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.1em;">${["HRS", "MIN", "SEC", "MS"][i]}</div>
    </div>`).join("")}
  </div>
</section>`;
}

// ── Urgency Bar ──
function renderUrgencyBar(s) {
  return `<div style="background:${s.background_color || "#DC2626"};color:${s.text_color || "#FFFFFF"};padding:${s.padding_y || 12}px 60px;text-align:center;font-size:14px;font-weight:500;">${esc(s.message || "")}</div>`;
}

// ── Footer ──
function renderFooter(s, fonts) {
  const headingFont = fonts.heading || "Inter";
  const columns = s.columns || [];
  const colsHtml = columns.map((col) => `<div>
    <h4 style="font-size:11px;letter-spacing:.12em;color:rgba(255,255,255,.5);text-transform:uppercase;font-weight:600;margin-bottom:18px;">${esc(col.title)}</h4>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
      ${col.links.map((link) => `<li><a href="#" style="color:rgba(255,255,255,.5);text-decoration:none;font-size:14px;">${esc(link)}</a></li>`).join("")}
    </ul>
  </div>`).join("");

  return `<footer style="background:${s.background_color || "#1E1E1E"};color:rgba(255,255,255,.6);padding:${s.padding_y || 60}px 60px 28px;">
  <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:52px;margin-bottom:48px;">
    <div>
      <a href="#" class="pb-heading" style="font-family:'${headingFont}',serif;font-size:24px;font-weight:700;color:#fff;text-decoration:none;display:block;margin-bottom:14px;">${esc(s.logo_text || "Store")}</a>
      <p style="font-size:14px;line-height:1.75;max-width:280px;color:rgba(255,255,255,.5);">${esc(s.tagline || "")}</p>
    </div>
    ${colsHtml}
  </div>
  <div style="border-top:1px solid rgba(255,255,255,.08);padding-top:22px;display:flex;justify-content:space-between;font-size:12px;">
    <span>${esc(s.copyright || "")}</span>
    <span>${esc(s.footer_note || "")}</span>
  </div>
</footer>`;
}
