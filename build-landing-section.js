// build-landing-section.js
// Converts each template's HTML preview into a Shopify Liquid section.
// Hero image, text, colors — all editable from Theme Editor.

export function buildLandingSection(tpl, html) {
  // 1. Fonts
  const fonts = [...html.matchAll(/<link[^>]*fonts\.googleapis[^>]*>/gi)].map(m => m[0]).join('\n');

  // 2. CSS — exact styles from preview HTML
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');

  // 3. Body HTML
  let body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, ''])[1].trim();

  // 4. Remove emojis
  body = body.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}]/gu, '');

  // 5. Replace h1 content with Liquid setting
  body = body.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i,
    `<h1$1>{{ section.settings.hero_h1 | default: '${tpl.label}' }}</h1>`);

  // 6. Replace hero image containers with Liquid image picker using tag balancing
  const heroImgRegex = /<div[^>]*class="[^"]*(?:hero-img|hero-image|hero-visual|hero-right|hero-media|p-image|hero-photo)[^"]*"[^>]*>/i;
  const heroMatch = body.match(heroImgRegex);
  if (heroMatch) {
    const startIndex = heroMatch.index;
    const openTag = heroMatch[0];
    const innerStart = startIndex + openTag.length;
    
    // Balance tags to find the correct closing </div>
    let openCount = 1;
    let i = innerStart;
    while (i < body.length && openCount > 0) {
      if (body.startsWith('<div', i)) {
        openCount++;
        i += 4;
      } else if (body.startsWith('</div', i)) {
        openCount--;
        if (openCount === 0) {
          break;
        }
        i += 5;
      } else {
        i++;
      }
    }
    
    if (openCount === 0) {
      const innerHtml = body.substring(innerStart, i);
      const closeTag = body.substring(i, i + 6); // </div>
      
      const replacement = openTag 
        + `{% if section.settings.hero_img != blank %}\n<img src="{{ section.settings.hero_img | image_url: width: 1400 }}" alt="{{ section.settings.hero_h1 }}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">\n{% else %}` 
        + innerHtml 
        + `{% endif %}` 
        + closeTag;
        
      body = body.substring(0, startIndex) + replacement + body.substring(i + 6);
    }
  }

  // 7. Replace first two CTA button texts with Liquid
  let ctaCount = 0;
  body = body.replace(/(<(?:a|button)[^>]*(?:class="[^"]*(?:btn|cta|button|shop-now|btn-primary|btn-forest|hdr-cta)[^"]*")[^>]*>)([\s\S]*?)(<\/(?:a|button)>)/gi,
    (m, open, inner, close) => {
      ctaCount++;
      if (ctaCount === 1) return open + '{{ section.settings.hero_cta | default: "Shop Now" }}' + close;
      if (ctaCount === 2) return open + '{{ section.settings.hero_cta2 | default: "View Collection" }}' + close;
      return m;
    });

  // 8. Cut body at products/testimonials/footer/newsletter to avoid duplicates
  const cutPatterns = [
    /class="[^"]*(?:prod-grid|product-list|prod-card|shop-grid|featured-products|ing-grid|products-section)[^"]*"/i,
    /<footer[\s>]/i,
    /class="[^"]*(?:cf-testi|testimonial|review-section)[^"]*"/i,
    /class="[^"]*(?:cf-nl\b|newsletter-wrap|subscribe-section)[^"]*"/i,
  ];
  let cutIndex = body.length;
  for (const pat of cutPatterns) {
    const idx = body.search(pat);
    if (idx > 100 && idx < cutIndex) cutIndex = idx;
  }
  // Walk back to start of that tag
  const tagStart = body.lastIndexOf('<', cutIndex);
  body = body.substring(0, tagStart > 0 ? tagStart : cutIndex);

  // 9. Build schema
  const sn = s => s.substring(0, 25).trimEnd();
  const schema = {
    name: sn(`CF ${tpl.label} LP`),
    settings: [
      { type: 'header', content: 'Brand & Colors' },
      { type: 'color', id: 'accent', label: 'Accent Color', default: tpl.accent },
      { type: 'color', id: 'bg', label: 'Background', default: tpl.bg },
      { type: 'color', id: 'text_col', label: 'Text Color', default: '#1a1a1a' },
      { type: 'header', content: 'Announcement Bar' },
      { type: 'checkbox', id: 'show_ann', label: 'Show Bar', default: true },
      { type: 'text', id: 'ann_text', label: 'Announcement Text', default: 'Free shipping on orders above Rs.999' },
      { type: 'color', id: 'ann_bg', label: 'Bar Background', default: tpl.accent },
      { type: 'color', id: 'ann_color', label: 'Bar Text Color', default: '#ffffff' },
      { type: 'header', content: 'Hero Section' },
      { type: 'image_picker', id: 'hero_img', label: 'Hero Image' },
      { type: 'text', id: 'hero_tag', label: 'Eyebrow Tag', default: 'New Arrival' },
      { type: 'text', id: 'hero_h1', label: 'Headline', default: tpl.label },
      { type: 'textarea', id: 'hero_sub', label: 'Subheading', default: 'Discover our curated collection crafted with quality.' },
      { type: 'text', id: 'hero_cta', label: 'Primary CTA Text', default: 'Shop Now' },
      { type: 'url', id: 'hero_url', label: 'Primary CTA URL' },
      { type: 'text', id: 'hero_cta2', label: 'Secondary CTA Text', default: 'View Collection' },
      { type: 'url', id: 'hero_url2', label: 'Secondary CTA URL' },
      { type: 'header', content: 'Stats Bar' },
      { type: 'checkbox', id: 'show_stats', label: 'Show Stats', default: true },
      { type: 'text', id: 'stat1_n', label: 'Stat 1 Number', default: '50,000+' },
      { type: 'text', id: 'stat1_l', label: 'Stat 1 Label', default: 'Happy Customers' },
      { type: 'text', id: 'stat2_n', label: 'Stat 2 Number', default: '4.9 Stars' },
      { type: 'text', id: 'stat2_l', label: 'Stat 2 Label', default: 'Average Rating' },
      { type: 'text', id: 'stat3_n', label: 'Stat 3 Number', default: '100%' },
      { type: 'text', id: 'stat3_l', label: 'Stat 3 Label', default: 'Authentic' },
      { type: 'text', id: 'stat4_n', label: 'Stat 4 Number', default: '30-Day' },
      { type: 'text', id: 'stat4_l', label: 'Stat 4 Label', default: 'Easy Returns' },
      { type: 'header', content: 'Featured Products' },
      { type: 'checkbox', id: 'show_products', label: 'Show Products', default: true },
      { type: 'text', id: 'prod_heading', label: 'Section Heading', default: 'Featured Products' },
      { type: 'text', id: 'prod_sub', label: 'Subheading', default: 'Handpicked for you' },
      { type: 'collection', id: 'prod_col', label: 'Collection' },
      { type: 'range', id: 'prod_count', label: 'Number of Products', min: 3, max: 12, step: 1, default: 4 },
      { type: 'header', content: 'Testimonials' },
      { type: 'checkbox', id: 'show_testi', label: 'Show Testimonials', default: true },
      { type: 'text', id: 'testi_h', label: 'Heading', default: 'What Customers Say' },
      { type: 'textarea', id: 't1_text', label: 'Testimonial 1', default: 'Absolutely love the quality!' },
      { type: 'text', id: 't1_auth', label: 'Author 1', default: 'Priya S.' },
      { type: 'textarea', id: 't2_text', label: 'Testimonial 2', default: 'Fast shipping and beautiful packaging.' },
      { type: 'text', id: 't2_auth', label: 'Author 2', default: 'Rahul M.' },
      { type: 'textarea', id: 't3_text', label: 'Testimonial 3', default: 'Best purchase this year.' },
      { type: 'text', id: 't3_auth', label: 'Author 3', default: 'Ananya K.' },
      { type: 'header', content: 'Newsletter' },
      { type: 'checkbox', id: 'show_nl', label: 'Show Newsletter', default: true },
      { type: 'text', id: 'nl_h', label: 'Heading', default: 'Join Our Community' },
      { type: 'text', id: 'nl_sub', label: 'Subtext', default: 'Subscribe for exclusive offers and updates.' },
      { type: 'text', id: 'nl_btn', label: 'Button Text', default: 'Subscribe' },
      { type: 'text', id: 'nl_placeholder', label: 'Placeholder', default: 'Enter your email' },
      { type: 'header', content: 'Footer' },
      { type: 'textarea', id: 'footer_about', label: 'About Text', default: `Premium ${tpl.label} products. Quality you can trust.` },
      { type: 'header', content: 'Custom Code' },
      { type: 'liquid', id: 'custom_liquid', label: 'Custom Liquid Code' },
    ],
    presets: [{ name: sn(`CF ${tpl.label} LP`) }],
  };

  // Remove any setting with default: "" (Shopify rejects blank defaults)
  schema.settings = schema.settings.map(s => {
    if (s.default === '') { const c = { ...s }; delete c.default; return c; }
    return s;
  });

  // Liquid CSS overrides — live from Theme Editor
  const cssOverride = `<style>
:root{
  --cf-accent:{{ section.settings.accent | default: '${tpl.accent}' }};
  --cf-bg:{{ section.settings.bg | default: '${tpl.bg}' }};
  --cf-text:{{ section.settings.text_col | default: '#1a1a1a' }};
}
body{background:var(--cf-bg);color:var(--cf-text);}
</style>`;

  // Announcement bar (Liquid-driven)
  const ann = `{% if section.settings.show_ann %}
<div style="background:{{ section.settings.ann_bg | default: '${tpl.accent}' }};color:{{ section.settings.ann_color | default: '#fff' }};text-align:center;padding:10px 20px;font-size:13px;font-weight:600;letter-spacing:.3px">
  {{ section.settings.ann_text }}
</div>
{% endif %}`;

  // Products (Liquid — live Shopify data)
  const products = `{% if section.settings.show_products and section.settings.prod_col != blank %}
<div style="background:var(--cf-bg,${tpl.bg});padding:80px 60px">
  <div style="text-align:center;margin-bottom:48px">
    <h2 style="font-size:36px;font-weight:800;margin-bottom:10px">{{ section.settings.prod_heading }}</h2>
    <p style="font-size:15px;color:#888">{{ section.settings.prod_sub }}</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px;max-width:1400px;margin:0 auto">
    {% for p in section.settings.prod_col.products limit: section.settings.prod_count %}
    <a href="{{ p.url }}" style="background:#fff;border:1px solid rgba(0,0,0,.08);text-decoration:none;color:#1a1a1a;display:block;transition:all .3s;overflow:hidden">
      <div style="aspect-ratio:1;overflow:hidden;position:relative;background:#f5f5f5;display:flex;align-items:center;justify-content:center">
        {% if p.featured_image %}
          <img src="{{ p.featured_image | image_url: width: 600 }}" alt="{{ p.title }}" loading="lazy" style="width:100%;height:100%;object-fit:cover">
        {% else %}
          <svg width="40" height="40" fill="none" stroke="#ccc" viewBox="0 0 24 24"><path d="M20 7H4l1 12h14z"/></svg>
        {% endif %}
        {% if p.available == false %}
          <span style="position:absolute;top:10px;left:10px;background:var(--cf-accent,${tpl.accent});color:#fff;font-size:9px;font-weight:700;padding:4px 10px;letter-spacing:1px;text-transform:uppercase">Sold Out</span>
        {% elsif p.compare_at_price > p.price %}
          <span style="position:absolute;top:10px;left:10px;background:var(--cf-accent,${tpl.accent});color:#fff;font-size:9px;font-weight:700;padding:4px 10px;letter-spacing:1px;text-transform:uppercase">Sale</span>
        {% endif %}
      </div>
      <div style="padding:16px">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--cf-accent,${tpl.accent});margin-bottom:4px">{{ p.vendor }}</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:10px;line-height:1.4">{{ p.title | truncate: 55 }}</div>
        <div style="font-size:18px;font-weight:800">{{ p.price | money }}{% if p.compare_at_price > p.price %} <del style="font-size:13px;color:#aaa;font-weight:400">{{ p.compare_at_price | money }}</del>{% endif %}</div>
        <button style="display:block;width:100%;margin-top:12px;padding:12px;background:var(--cf-accent,${tpl.accent});color:#fff;border:none;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:.5px;font-family:inherit">Add to Cart</button>
      </div>
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}`;

  // Testimonials (Liquid)
  const testimonials = `{% if section.settings.show_testi %}
<div style="padding:80px 60px;background:#fafafa">
  <h2 style="text-align:center;font-size:36px;font-weight:800;margin-bottom:48px">{{ section.settings.testi_h }}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1400px;margin:0 auto">
    <div style="background:#fff;border:1px solid #eee;padding:32px"><p style="font-size:14px;line-height:1.8;color:#555;font-style:italic;margin-bottom:20px">&ldquo;{{ section.settings.t1_text }}&rdquo;</p><div style="font-size:13px;font-weight:700;color:var(--cf-accent,${tpl.accent})">{{ section.settings.t1_auth }}</div></div>
    <div style="background:#fff;border:1px solid #eee;padding:32px"><p style="font-size:14px;line-height:1.8;color:#555;font-style:italic;margin-bottom:20px">&ldquo;{{ section.settings.t2_text }}&rdquo;</p><div style="font-size:13px;font-weight:700;color:var(--cf-accent,${tpl.accent})">{{ section.settings.t2_auth }}</div></div>
    <div style="background:#fff;border:1px solid #eee;padding:32px"><p style="font-size:14px;line-height:1.8;color:#555;font-style:italic;margin-bottom:20px">&ldquo;{{ section.settings.t3_text }}&rdquo;</p><div style="font-size:13px;font-weight:700;color:var(--cf-accent,${tpl.accent})">{{ section.settings.t3_auth }}</div></div>
  </div>
</div>
{% endif %}`;

  // Newsletter (Liquid — Shopify contact form)
  const newsletter = `{% if section.settings.show_nl %}
<div style="padding:80px 60px;background:var(--cf-accent,${tpl.accent});text-align:center;color:#fff">
  <h2 style="font-size:36px;font-weight:800;margin-bottom:12px">{{ section.settings.nl_h }}</h2>
  <p style="font-size:15px;opacity:.85;margin-bottom:36px">{{ section.settings.nl_sub }}</p>
  <form action="/contact#contact_form" method="post" style="display:flex;max-width:480px;margin:0 auto">
    <input type="hidden" name="form_type" value="customer">
    <input type="hidden" name="utf8" value="&#x2713;">
    <input type="email" name="contact[email]" placeholder="{{ section.settings.nl_placeholder }}" required style="flex:1;padding:16px 20px;border:none;font-size:14px;outline:none;font-family:inherit">
    <button type="submit" style="padding:16px 28px;background:#1a1a1a;color:#fff;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">{{ section.settings.nl_btn }}</button>
  </form>
</div>
{% endif %}`;

  // Footer (Shopify-native)
  const footer = `<footer style="background:#1a1a1a;color:#bbb;padding:60px">
  <div style="max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.08)">
    <div>
      <h3 style="font-size:22px;font-weight:800;color:#fff;margin-bottom:12px">{{ shop.name }}</h3>
      <p style="font-size:12px;line-height:1.8;color:#888">{{ section.settings.footer_about }}</p>
    </div>
    <div>
      <h4 style="font-size:11px;font-weight:700;color:var(--cf-accent,${tpl.accent});margin-bottom:16px;letter-spacing:2px;text-transform:uppercase">Shop</h4>
      <ul style="list-style:none;padding:0">
        <li style="margin-bottom:8px"><a href="/collections/all" style="color:#888;text-decoration:none;font-size:12px">All Products</a></li>
        <li style="margin-bottom:8px"><a href="/collections" style="color:#888;text-decoration:none;font-size:12px">Collections</a></li>
        <li style="margin-bottom:8px"><a href="/pages/about" style="color:#888;text-decoration:none;font-size:12px">About</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size:11px;font-weight:700;color:var(--cf-accent,${tpl.accent});margin-bottom:16px;letter-spacing:2px;text-transform:uppercase">Help</h4>
      <ul style="list-style:none;padding:0">
        <li style="margin-bottom:8px"><a href="/policies/shipping-policy" style="color:#888;text-decoration:none;font-size:12px">Shipping</a></li>
        <li style="margin-bottom:8px"><a href="/policies/refund-policy" style="color:#888;text-decoration:none;font-size:12px">Returns</a></li>
        <li style="margin-bottom:8px"><a href="/pages/contact" style="color:#888;text-decoration:none;font-size:12px">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size:11px;font-weight:700;color:var(--cf-accent,${tpl.accent});margin-bottom:16px;letter-spacing:2px;text-transform:uppercase">Legal</h4>
      <ul style="list-style:none;padding:0">
        <li style="margin-bottom:8px"><a href="/policies/privacy-policy" style="color:#888;text-decoration:none;font-size:12px">Privacy</a></li>
        <li style="margin-bottom:8px"><a href="/policies/terms-of-service" style="color:#888;text-decoration:none;font-size:12px">Terms</a></li>
      </ul>
    </div>
  </div>
  <div style="padding-top:20px;display:flex;justify-content:space-between;font-size:11px;color:#555">
    <span>&copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. All rights reserved.</span>
    <span>Powered by ConvertFlow</span>
  </div>
</footer>`;

  const custom = `{% if section.settings.custom_liquid != blank %}{{ section.settings.custom_liquid }}{% endif %}`;

  return `{% comment %}ConvertFlow: ${tpl.label} — Landing Page{% endcomment %}
${fonts}
<style>
${css}
</style>
${cssOverride}

${ann}

${body}

${products}
${testimonials}
${newsletter}
${footer}
${custom}

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;
}
