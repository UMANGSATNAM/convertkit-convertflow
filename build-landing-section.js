// build-landing-section.js
// Converts each template's real HTML preview into a faithful Shopify Liquid section.
// The generated section uses the EXACT same design/CSS as the preview, 
// with Liquid settings injected for every user-editable field.

export function buildLandingSection(tpl, html) {
  // ── 1. Extract font <link> tags ───────────────────────────────────────────
  const fontMatches = [...html.matchAll(/<link[^>]*fonts\.googleapis[^>]*>/gi)];
  const fonts = fontMatches.map(m => m[0]).join('\n');

  // ── 2. Extract all <style> content from the HTML ──────────────────────────
  const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  let rawCSS = styleMatches.map(m => m[1]).join('\n').trim();

  // ── 3. Extract <body> content ──────────────────────────────────────────────
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let rawBody = bodyMatch ? bodyMatch[1].trim() : html;

  // ── 4. Extract <script> content from body ─────────────────────────────────
  const scriptMatches = [...rawBody.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  const rawScripts = scriptMatches.map(m => m[0]).join('\n');
  // Remove scripts from body so we can place them at end
  rawBody = rawBody.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim();

  // ── 5. Build Liquid schema with comprehensive settings ─────────────────────
  const schemaName = `CF ${tpl.label} LP`.substring(0, 25).trimEnd();

  const schema = {
    name: schemaName,
    settings: [
      // ── Brand & Colors ──
      { type: "header", content: "Brand & Colors" },
      { type: "color", id: "accent", label: "Accent / Primary Color", default: tpl.accent },
      { type: "color", id: "bg", label: "Page Background", default: tpl.bg },
      { type: "color", id: "text_col", label: "Text Color", default: "#1a1a1a" },

      // ── Announcement Bar ──
      { type: "header", content: "Announcement Bar" },
      { type: "checkbox", id: "show_ann", label: "Show Announcement Bar", default: true },
      { type: "text", id: "ann_text", label: "Announcement Text", default: "Free shipping on orders above ₹999 🎉" },
      { type: "color", id: "ann_bg", label: "Bar Background", default: tpl.accent },
      { type: "color", id: "ann_color", label: "Bar Text Color", default: "#ffffff" },

      // ── Hero ──
      { type: "header", content: "Hero Section" },
      { type: "image_picker", id: "hero_img", label: "Hero / Banner Image" },
      { type: "text", id: "hero_tag", label: "Eyebrow / Tag Text", default: "New Arrival" },
      { type: "text", id: "hero_h1", label: "Hero Headline", default: tpl.label },
      { type: "textarea", id: "hero_sub", label: "Hero Subheading", default: "Discover our curated collection — crafted with quality you can feel." },
      { type: "text", id: "hero_cta", label: "Primary Button Text", default: "Shop Now" },
      { type: "url", id: "hero_url", label: "Primary Button URL" },
      { type: "text", id: "hero_cta2", label: "Secondary Button Text (leave blank to hide)", default: "View Collection" },
      { type: "url", id: "hero_url2", label: "Secondary Button URL" },

      // ── Stats / Trust Bar ──
      { type: "header", content: "Stats / Social Proof Bar" },
      { type: "checkbox", id: "show_stats", label: "Show Stats Bar", default: true },
      { type: "text", id: "stat1_n", label: "Stat 1 Number", default: "50,000+" },
      { type: "text", id: "stat1_l", label: "Stat 1 Label", default: "Happy Customers" },
      { type: "text", id: "stat2_n", label: "Stat 2 Number", default: "4.9 ★" },
      { type: "text", id: "stat2_l", label: "Stat 2 Label", default: "Average Rating" },
      { type: "text", id: "stat3_n", label: "Stat 3 Number", default: "100%" },
      { type: "text", id: "stat3_l", label: "Stat 3 Label", default: "Authentic Products" },
      { type: "text", id: "stat4_n", label: "Stat 4 Number", default: "30-Day" },
      { type: "text", id: "stat4_l", label: "Stat 4 Label", default: "Easy Returns" },

      // ── Featured Products ──
      { type: "header", content: "Featured Products Section" },
      { type: "checkbox", id: "show_products", label: "Show Products Section", default: true },
      { type: "text", id: "prod_heading", label: "Section Heading", default: "Featured Products" },
      { type: "text", id: "prod_sub", label: "Section Subheading", default: "Handpicked for you" },
      { type: "collection", id: "prod_col", label: "Collection to Display" },
      { type: "range", id: "prod_count", label: "Number of Products to Show", min: 3, max: 12, step: 1, default: 4 },

      // ── Features / USP Bar ──
      { type: "header", content: "Features / USP Bar" },
      { type: "checkbox", id: "show_feats", label: "Show Features Bar", default: true },
      { type: "text", id: "feat1_t", label: "Feature 1 Title", default: "Free Delivery" },
      { type: "text", id: "feat1_s", label: "Feature 1 Subtitle", default: "On orders above ₹999" },
      { type: "text", id: "feat2_t", label: "Feature 2 Title", default: "Easy Returns" },
      { type: "text", id: "feat2_s", label: "Feature 2 Subtitle", default: "30-day hassle-free" },
      { type: "text", id: "feat3_t", label: "Feature 3 Title", default: "100% Authentic" },
      { type: "text", id: "feat3_s", label: "Feature 3 Subtitle", default: "Certified genuine products" },
      { type: "text", id: "feat4_t", label: "Feature 4 Title", default: "Secure Checkout" },
      { type: "text", id: "feat4_s", label: "Feature 4 Subtitle", default: "SSL encrypted payment" },

      // ── Testimonials ──
      { type: "header", content: "Testimonials / Reviews" },
      { type: "checkbox", id: "show_testi", label: "Show Testimonials", default: true },
      { type: "text", id: "testi_h", label: "Section Heading", default: "What Our Customers Say" },
      { type: "textarea", id: "t1_text", label: "Testimonial 1", default: "Absolutely love the quality! Will definitely order again." },
      { type: "text", id: "t1_auth", label: "Author 1", default: "Priya S. ★★★★★" },
      { type: "textarea", id: "t2_text", label: "Testimonial 2", default: "Fast shipping and beautiful packaging. Exceeded expectations!" },
      { type: "text", id: "t2_auth", label: "Author 2", default: "Rahul M. ★★★★★" },
      { type: "textarea", id: "t3_text", label: "Testimonial 3", default: "Best purchase I have made this year. Highly recommended!" },
      { type: "text", id: "t3_auth", label: "Author 3", default: "Ananya K. ★★★★★" },

      // ── Newsletter ──
      { type: "header", content: "Newsletter Section" },
      { type: "checkbox", id: "show_nl", label: "Show Newsletter", default: true },
      { type: "text", id: "nl_h", label: "Heading", default: "Join Our Community" },
      { type: "text", id: "nl_sub", label: "Subtext", default: "Subscribe for exclusive offers, new arrivals & insider updates." },
      { type: "text", id: "nl_btn", label: "Button Text", default: "Subscribe" },
      { type: "text", id: "nl_placeholder", label: "Input Placeholder", default: "Enter your email" },

      // ── Footer ──
      { type: "header", content: "Footer" },
      { type: "textarea", id: "footer_about", label: "Brand About Text", default: `Premium ${tpl.label} products. Quality you can trust.` },

      // ── Custom Liquid ──
      { type: "header", content: "Custom Code" },
      { type: "liquid", id: "custom_liquid", label: "Custom Liquid Code (injected at bottom of section)" }
    ],
    presets: [{ name: schemaName }]
  };

  // ── 6. Build the Liquid CSS override block ─────────────────────────────────
  // We override CSS custom properties using the Liquid settings so users can
  // restyle from the Theme Editor without touching code.
  const liquidCssOverride = `
<style>
/* ConvertFlow Theme Editor overrides */
:root {
  --cf-accent: {{ section.settings.accent | default: '${tpl.accent}' }} !important;
  --cf-bg: {{ section.settings.bg | default: '${tpl.bg}' }} !important;
  --cf-text: {{ section.settings.text_col | default: '#1a1a1a' }} !important;
}
body { background: var(--cf-bg); color: var(--cf-text); }

/* Liquid-driven announcement bar */
.cf-liq-ann { background: {{ section.settings.ann_bg | default: '${tpl.accent}' }}; color: {{ section.settings.ann_color | default: '#fff' }}; text-align: center; padding: 10px 20px; font-size: 13px; font-weight: 600; }

/* Shopify-native product grid (for live data) */
.cf-liq-prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; max-width: 1400px; margin: 0 auto; padding: 60px; }
.cf-liq-prod-card { background: #fff; border: 1px solid rgba(0,0,0,0.08); text-decoration: none; color: #1a1a1a; display: block; transition: all 0.3s; overflow: hidden; }
.cf-liq-prod-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
.cf-liq-prod-img { aspect-ratio: 1; background: #f5f5f5; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
.cf-liq-prod-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.cf-liq-prod-card:hover .cf-liq-prod-img img { transform: scale(1.05); }
.cf-liq-prod-badge { position: absolute; top: 10px; left: 10px; background: var(--cf-accent, ${tpl.accent}); color: #fff; font-size: 9px; font-weight: 700; padding: 4px 10px; letter-spacing: 1px; text-transform: uppercase; }
.cf-liq-prod-body { padding: 16px; }
.cf-liq-prod-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent, ${tpl.accent}); margin-bottom: 4px; }
.cf-liq-prod-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cf-liq-prod-price { font-size: 18px; font-weight: 800; }
.cf-liq-prod-price del { font-size: 13px; color: #aaa; font-weight: 400; margin-left: 6px; }
.cf-liq-atc { display: block; width: 100%; margin-top: 12px; padding: 12px; background: var(--cf-accent, ${tpl.accent}); color: #fff; border: none; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; text-transform: uppercase; font-family: inherit; transition: opacity 0.2s; }
.cf-liq-atc:hover { opacity: 0.88; }

/* Liquid-driven testimonial grid */
.cf-liq-testi-wrap { padding: 80px 60px; background: #fafafa; }
.cf-liq-testi-h { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 48px; }
.cf-liq-testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1400px; margin: 0 auto; }
.cf-liq-testi-card { background: #fff; border: 1px solid #eee; padding: 32px; }
.cf-liq-testi-text { font-size: 14px; line-height: 1.8; color: #555; font-style: italic; margin-bottom: 20px; }
.cf-liq-testi-auth { font-size: 13px; font-weight: 700; color: var(--cf-accent, ${tpl.accent}); }

/* Newsletter */
.cf-liq-nl { padding: 80px 60px; background: var(--cf-accent, ${tpl.accent}); text-align: center; color: #fff; }
.cf-liq-nl h2 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
.cf-liq-nl p { font-size: 15px; opacity: 0.85; margin-bottom: 36px; }
.cf-liq-nl-form { display: flex; max-width: 480px; margin: 0 auto; }
.cf-liq-nl-input { flex: 1; padding: 16px 20px; border: none; font-size: 14px; outline: none; font-family: inherit; }
.cf-liq-nl-btn { padding: 16px 28px; background: #1a1a1a; color: #fff; border: none; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; }

/* Footer */
.cf-liq-footer { background: #1a1a1a; color: #bbb; padding: 60px; }
.cf-liq-footer-inner { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.cf-liq-footer-brand h3 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 12px; }
.cf-liq-footer-brand p { font-size: 12px; line-height: 1.8; color: #888; }
.cf-liq-footer h4 { font-size: 11px; font-weight: 700; color: var(--cf-accent, ${tpl.accent}); margin-bottom: 16px; letter-spacing: 2px; text-transform: uppercase; }
.cf-liq-footer ul { list-style: none; }
.cf-liq-footer li { margin-bottom: 8px; }
.cf-liq-footer a { color: #888; text-decoration: none; font-size: 12px; transition: color 0.2s; }
.cf-liq-footer a:hover { color: #fff; }
.cf-liq-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #555; margin-top: 40px; }

@media (max-width: 768px) {
  .cf-liq-prod-grid { grid-template-columns: 1fr 1fr; padding: 30px 16px; }
  .cf-liq-testi-grid { grid-template-columns: 1fr; }
  .cf-liq-testi-wrap { padding: 50px 20px; }
  .cf-liq-nl { padding: 50px 20px; }
  .cf-liq-nl-form { flex-direction: column; }
  .cf-liq-footer-inner { grid-template-columns: 1fr 1fr; }
  .cf-liq-footer { padding: 40px 20px; }
}
</style>`;

  // ── 7. Build Liquid-driven sections that overlay on the static HTML ─────────
  const liquidAnn = `{% if section.settings.show_ann %}<div class="cf-liq-ann">{{ section.settings.ann_text }}</div>{% endif %}`;

  const liquidProducts = `{% if section.settings.show_products and section.settings.prod_col != blank %}
<div id="cf-live-products" style="background:var(--cf-bg,${tpl.bg})">
  <div style="text-align:center;padding:60px 60px 0">
    <h2 style="font-size:36px;font-weight:800;margin-bottom:10px">{{ section.settings.prod_heading }}</h2>
    <p style="font-size:15px;color:#888;margin-bottom:40px">{{ section.settings.prod_sub }}</p>
  </div>
  <div class="cf-liq-prod-grid">
    {% for p in section.settings.prod_col.products limit: section.settings.prod_count %}
    <a href="{{ p.url }}" class="cf-liq-prod-card">
      <div class="cf-liq-prod-img">
        {% if p.featured_image %}<img src="{{ p.featured_image | image_url: width: 600 }}" alt="{{ p.title }}" loading="lazy">
        {% else %}<svg width="40%" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1" style="opacity:.2"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>{% endif %}
        {% if p.available == false %}<span class="cf-liq-prod-badge">Sold Out</span>
        {% elsif p.compare_at_price > p.price %}<span class="cf-liq-prod-badge">Sale</span>{% endif %}
      </div>
      <div class="cf-liq-prod-body">
        <div class="cf-liq-prod-vendor">{{ p.vendor }}</div>
        <div class="cf-liq-prod-title">{{ p.title | truncate: 55 }}</div>
        <div class="cf-liq-prod-price">
          {{ p.price | money }}
          {% if p.compare_at_price > p.price %}<del>{{ p.compare_at_price | money }}</del>{% endif %}
        </div>
        <button class="cf-liq-atc">Add to Cart</button>
      </div>
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}`;

  const liquidTestimonials = `{% if section.settings.show_testi %}
<div class="cf-liq-testi-wrap">
  <h2 class="cf-liq-testi-h">{{ section.settings.testi_h }}</h2>
  <div class="cf-liq-testi-grid">
    <div class="cf-liq-testi-card"><p class="cf-liq-testi-text">"{{ section.settings.t1_text }}"</p><div class="cf-liq-testi-auth">{{ section.settings.t1_auth }}</div></div>
    <div class="cf-liq-testi-card"><p class="cf-liq-testi-text">"{{ section.settings.t2_text }}"</p><div class="cf-liq-testi-auth">{{ section.settings.t2_auth }}</div></div>
    <div class="cf-liq-testi-card"><p class="cf-liq-testi-text">"{{ section.settings.t3_text }}"</p><div class="cf-liq-testi-auth">{{ section.settings.t3_auth }}</div></div>
  </div>
</div>
{% endif %}`;

  const liquidNewsletter = `{% if section.settings.show_nl %}
<div class="cf-liq-nl">
  <h2>{{ section.settings.nl_h }}</h2>
  <p>{{ section.settings.nl_sub }}</p>
  <form class="cf-liq-nl-form" action="/contact#contact_form" method="post">
    <input type="hidden" name="form_type" value="customer">
    <input type="hidden" name="utf8" value="&#x2713;">
    <input class="cf-liq-nl-input" type="email" name="contact[email]" placeholder="{{ section.settings.nl_placeholder }}" required>
    <button class="cf-liq-nl-btn" type="submit">{{ section.settings.nl_btn }}</button>
  </form>
</div>
{% endif %}`;

  const liquidFooter = `<footer class="cf-liq-footer">
  <div class="cf-liq-footer-inner">
    <div class="cf-liq-footer-brand">
      <h3>{{ shop.name }}</h3>
      <p>{{ section.settings.footer_about }}</p>
    </div>
    <div>
      <h4>Shop</h4>
      <ul>
        <li><a href="/collections/all">All Products</a></li>
        <li><a href="/collections">Collections</a></li>
        <li><a href="/pages/about">About Us</a></li>
      </ul>
    </div>
    <div>
      <h4>Help</h4>
      <ul>
        <li><a href="/policies/shipping-policy">Shipping</a></li>
        <li><a href="/policies/refund-policy">Returns</a></li>
        <li><a href="/pages/contact">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4>Legal</h4>
      <ul>
        <li><a href="/policies/privacy-policy">Privacy Policy</a></li>
        <li><a href="/policies/terms-of-service">Terms</a></li>
      </ul>
    </div>
  </div>
  <div class="cf-liq-footer-bottom">
    <span>&copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. All rights reserved.</span>
    <span>Powered by ConvertFlow</span>
  </div>
</footer>`;

  const liquidCustom = `{% if section.settings.custom_liquid != blank %}{{ section.settings.custom_liquid }}{% endif %}`;

  // ── 8. Sanitize schema: remove any setting with default: "" (Shopify rejects blank defaults) ──
  function sanitizeSchema(schemaObj) {
    schemaObj.settings = schemaObj.settings.map(s => {
      if (s.default === "") {
        const copy = { ...s };
        delete copy.default;
        return copy;
      }
      return s;
    });
    return schemaObj;
  }

  // ── 9. Assemble the final Liquid section ───────────────────────────────────
  return `{% comment %}ConvertFlow: ${tpl.label} — Landing Page (Faithful HTML Design + Liquid Settings){% endcomment %}
${fonts}
<style>
${rawCSS}
</style>
${liquidCssOverride}

${liquidAnn}

${rawBody}

${liquidProducts}
${liquidTestimonials}
${liquidNewsletter}
${liquidFooter}
${rawScripts}
${liquidCustom}

{% schema %}
${JSON.stringify(sanitizeSchema(schema), null, 2)}
{% endschema %}`;
}
