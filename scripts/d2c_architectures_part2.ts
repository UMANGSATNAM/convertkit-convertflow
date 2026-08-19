import { BrandNicheMeta } from './d2c_brand_metas';

export function buildFeaturedDrop(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  const p = meta.products[0] || { title: "Hero Signature Drop", price: "₹2,499", originalPrice: "₹3,499", img: meta.heroImg };
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Featured Spotlight Drop
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'VAULT SPOTLIGHT DROP'
  assign product_title = section.settings.product_title | default: '${p.title}'
  assign price = section.settings.price | default: '${p.price}'
  assign orig_price = section.settings.orig_price | default: '${p.originalPrice}'
-%}

<section id="d2c-spotlight-{{ sec_id }}" class="d2c-spotlight-wrap">
  <div class="d2c-spot-container">
    <div class="d2c-spot-grid">
      <div class="d2c-spot-media">
        <span class="d2c-spot-badge">★ LIMITED 300 UNITS</span>
        <img src="${p.img}" alt="${p.title}" class="d2c-spot-img" loading="lazy" />
      </div>

      <div class="d2c-spot-content">
        <span class="d2c-spot-sub">${meta.badge}</span>
        <h2 class="d2c-spot-title">{{ product_title }}</h2>
        
        <div class="d2c-spot-rating">★★★★★ <span>(4.9/5 • 3,420 Verified Reviews)</span></div>
        
        <div class="d2c-spot-price-row">
          <span class="d2c-spot-price">{{ price }}</span>
          <span class="d2c-spot-orig">{{ orig_price }}</span>
          <span class="d2c-spot-save">SAVE ₹1,000</span>
        </div>

        <p class="d2c-spot-desc">Engineered with high-density loopback cotton, double-needle reinforcement stitching, and custom bio-washed vintage fade.</p>

        <!-- Live Stock Progress Bar -->
        <div class="d2c-spot-stock-box">
          <div class="d2c-stock-info">
            <span>Hurry! Almost Sold Out</span>
            <span class="d2c-stock-qty">Only 7 Units Remaining</span>
          </div>
          <div class="d2c-stock-bar">
            <div class="d2c-stock-fill"></div>
          </div>
        </div>

        <!-- Variant Selector -->
        <div class="d2c-spot-variants">
          <div class="d2c-var-label">Select Size: <strong>Size L</strong></div>
          <div class="d2c-var-pills">
            <button type="button" class="d2c-var-pill">S</button>
            <button type="button" class="d2c-var-pill">M</button>
            <button type="button" class="d2c-var-pill d2c-var-active">L</button>
            <button type="button" class="d2c-var-pill">XL</button>
          </div>
        </div>

        <button type="button" class="d2c-btn-spot-buy" onclick="this.textContent = 'ADDING TO BAG...'; setTimeout(() => this.textContent = 'ADDED TO BAG! ✓', 1500)">
          CLAIM VAULT DROP &rarr;
        </button>

        <div class="d2c-spot-perks">
          <span>⚡ Priority 24hr Dispatch</span> • <span>🛡️ 7-Day Exchange</span> • <span>💳 Secure UPI</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-spotlight-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
  }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-container { max-width: 1180px; margin: 0 auto; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
  
  #d2c-spotlight-{{ sec_id }} .d2c-spot-media { position: relative; border-radius: 16px; overflow: hidden; border: 1px solid ${meta.border}; aspect-ratio: 1; background: #111; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-img { width: 100%; height: 100%; object-fit: cover; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-badge { position: absolute; top: 16px; left: 16px; background: {{ accent_color }}; color: ${isDark ? '#000' : '#fff'}; font-size: 10px; font-weight: 900; padding: 6px 12px; border-radius: 6px; letter-spacing: 0.5px; }
  
  #d2c-spotlight-{{ sec_id }} .d2c-spot-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 38px); font-weight: 900; margin: 6px 0 10px 0; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-rating { color: #f59e0b; font-size: 12px; margin-bottom: 16px; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-rating span { color: ${meta.textSecondary}; margin-left: 6px; }
  
  #d2c-spotlight-{{ sec_id }} .d2c-spot-price-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-price { font-size: 26px; font-weight: 900; color: {{ accent_color }}; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-orig { font-size: 16px; text-decoration: line-through; color: ${meta.textSecondary}; }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-save { background: rgba(34, 197, 94, 0.15); color: #22c55e; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 4px; }
  
  #d2c-spotlight-{{ sec_id }} .d2c-spot-desc { font-size: 14px; line-height: 1.6; color: ${meta.textSecondary}; margin-bottom: 22px; }
  
  #d2c-spotlight-{{ sec_id }} .d2c-spot-stock-box { background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}; border: 1px solid ${meta.border}; padding: 12px 16px; border-radius: 8px; margin-bottom: 22px; }
  #d2c-spotlight-{{ sec_id }} .d2c-stock-info { display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; margin-bottom: 6px; }
  #d2c-spotlight-{{ sec_id }} .d2c-stock-qty { color: #ef4444; }
  #d2c-spotlight-{{ sec_id }} .d2c-stock-bar { width: 100%; height: 6px; background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; border-radius: 99px; overflow: hidden; }
  #d2c-spotlight-{{ sec_id }} .d2c-stock-fill { width: 85%; height: 100%; background: #ef4444; border-radius: 99px; }
  
  #d2c-spotlight-{{ sec_id }} .d2c-spot-variants { margin-bottom: 24px; }
  #d2c-spotlight-{{ sec_id }} .d2c-var-label { font-size: 12px; color: ${meta.textSecondary}; margin-bottom: 8px; }
  #d2c-spotlight-{{ sec_id }} .d2c-var-label strong { color: {{ text_color }}; }
  #d2c-spotlight-{{ sec_id }} .d2c-var-pills { display: flex; gap: 8px; }
  #d2c-spotlight-{{ sec_id }} .d2c-var-pill {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid ${meta.border};
    background: transparent;
    color: {{ text_color }};
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }
  #d2c-spotlight-{{ sec_id }} .d2c-var-pill.d2c-var-active { border-color: {{ accent_color }}; background: {{ accent_color }}; color: ${isDark ? '#000' : '#fff'}; }

  #d2c-spotlight-{{ sec_id }} .d2c-btn-spot-buy {
    width: 100%;
    background: {{ accent_color }};
    color: ${isDark ? '#000000' : '#ffffff'};
    border: none;
    padding: 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }
  #d2c-spotlight-{{ sec_id }} .d2c-spot-perks { text-align: center; font-size: 11px; color: ${meta.textSecondary}; margin-top: 14px; }

  @media (max-width: 990px) {
    #d2c-spotlight-{{ sec_id }} .d2c-spot-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Spotlight Drop",
  "tag": "section",
  "class": "d2c-spotlight-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Heading", "default": "VAULT SPOTLIGHT DROP" },
    { "type": "text", "id": "product_title", "label": "Product Title", "default": "${p.title}" },
    { "type": "text", "id": "price", "label": "Current Price", "default": "${p.price}" },
    { "type": "text", "id": "orig_price", "label": "Original Price", "default": "${p.originalPrice}" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Spotlight Drop" }
  ]
}
{% endschema %}
`;
}

export function buildLookbookGrid(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Editorial Lookbook Grid
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'STREET STYLE LOOKBOOK'
  assign subtitle = section.settings.subtitle | default: 'HOW THE VAULT COMMUNITY WEARS IT'
-%}

<section id="d2c-lookbook-{{ sec_id }}" class="d2c-lookbook-wrap">
  <div class="d2c-lb-container">
    <div class="d2c-lb-header">
      <span class="d2c-lb-sub">{{ subtitle }}</span>
      <h2 class="d2c-lb-title">{{ title }}</h2>
    </div>

    <div class="d2c-lb-grid">
      <div class="d2c-lb-col d2c-lb-large">
        <div class="d2c-lb-card">
          <img src="${meta.heroImg}" alt="Lookbook 1" class="d2c-lb-img" loading="lazy" />
          <div class="d2c-hotspot" style="top: 40%; left: 60%;">
            <span class="d2c-dot-pulse"></span>
            <div class="d2c-hotspot-pop">
              <strong>${meta.products[0]?.title || 'Oversized Tee'}</strong>
              <span>${meta.products[0]?.price || '₹1,299'}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="d2c-lb-col d2c-lb-small">
        <div class="d2c-lb-card">
          <img src="${meta.products[1]?.img || meta.heroImg}" alt="Lookbook 2" class="d2c-lb-img" loading="lazy" />
          <div class="d2c-hotspot" style="top: 55%; left: 45%;">
            <span class="d2c-dot-pulse"></span>
            <div class="d2c-hotspot-pop">
              <strong>${meta.products[1]?.title || 'Cargo Pants'}</strong>
              <span>${meta.products[1]?.price || '₹2,499'}</span>
            </div>
          </div>
        </div>
        <div class="d2c-lb-card">
          <img src="${meta.products[2]?.img || meta.heroImg}" alt="Lookbook 3" class="d2c-lb-img" loading="lazy" />
          <div class="d2c-hotspot" style="top: 35%; left: 50%;">
            <span class="d2c-dot-pulse"></span>
            <div class="d2c-hotspot-pop">
              <strong>${meta.products[2]?.title || 'Loopback Hoodie'}</strong>
              <span>${meta.products[2]?.price || '₹2,799'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-lookbook-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-lookbook-{{ sec_id }} .d2c-lb-container { max-width: 1320px; margin: 0 auto; }
  #d2c-lookbook-{{ sec_id }} .d2c-lb-header { text-align: center; margin-bottom: 36px; }
  #d2c-lookbook-{{ sec_id }} .d2c-lb-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-lookbook-{{ sec_id }} .d2c-lb-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-lookbook-{{ sec_id }} .d2c-lb-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
  #d2c-lookbook-{{ sec_id }} .d2c-lb-small { display: grid; grid-template-rows: 1fr 1fr; gap: 20px; }
  
  #d2c-lookbook-{{ sec_id }} .d2c-lb-card { position: relative; border-radius: 16px; overflow: hidden; border: 1px solid ${meta.border}; background: #111; height: 100%; min-height: 260px; }
  #d2c-lookbook-{{ sec_id }} .d2c-lb-img { width: 100%; height: 100%; object-fit: cover; }
  
  #d2c-lookbook-{{ sec_id }} .d2c-hotspot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
  #d2c-lookbook-{{ sec_id }} .d2c-dot-pulse { width: 16px; height: 16px; border-radius: 50%; background: {{ accent_color }}; display: block; box-shadow: 0 0 0 4px rgba(255,255,255,0.4); animation: d2c-spot-pulse 2s infinite; }
  @keyframes d2c-spot-pulse { 0% { transform: scale(0.9); } 50% { transform: scale(1.2); } 100% { transform: scale(0.9); } }
  
  #d2c-lookbook-{{ sec_id }} .d2c-hotspot-pop {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15,23,42,0.92);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 8px 12px;
    white-space: nowrap;
    color: #fff;
    font-size: 11px;
    display: none;
  }
  #d2c-lookbook-{{ sec_id }} .d2c-hotspot:hover .d2c-hotspot-pop { display: flex; flex-direction: column; gap: 2px; }
  #d2c-lookbook-{{ sec_id }} .d2c-hotspot-pop strong { font-weight: 800; }
  #d2c-lookbook-{{ sec_id }} .d2c-hotspot-pop span { color: {{ accent_color }}; font-weight: 900; }

  @media (max-width: 990px) {
    #d2c-lookbook-{{ sec_id }} .d2c-lb-grid { grid-template-columns: 1fr; }
    #d2c-lookbook-{{ sec_id }} .d2c-lb-small { grid-template-columns: 1fr 1fr; grid-template-rows: none; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Lookbook",
  "tag": "section",
  "class": "d2c-lookbook-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Title", "default": "STREET STYLE LOOKBOOK" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "HOW THE VAULT COMMUNITY WEARS IT" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Lookbook" }
  ]
}
{% endschema %}
`;
}

export function buildFabricTech(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Fabric & Technical Matrix
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'MATERIAL & FABRIC SCIENCE'
  assign subtitle = section.settings.subtitle | default: 'BUILT TO OUTLAST 100+ WASHES'
-%}

<section id="d2c-tech-{{ sec_id }}" class="d2c-tech-wrap">
  <div class="d2c-tech-container">
    <div class="d2c-tech-header">
      <span class="d2c-tech-sub">{{ subtitle }}</span>
      <h2 class="d2c-tech-title">{{ title }}</h2>
    </div>

    <div class="d2c-tech-grid">
      ${meta.features.map((f, i) => `
      <div class="d2c-tech-card">
        <div class="d2c-tech-icon">${f.icon}</div>
        <h3 class="d2c-tech-card-title">${f.title}</h3>
        <p class="d2c-tech-desc">${f.desc}</p>
        <div class="d2c-tech-badge">SPEC GRADE 0${i + 1}</div>
      </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-tech-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
  }
  #d2c-tech-{{ sec_id }} .d2c-tech-container { max-width: 1320px; margin: 0 auto; }
  #d2c-tech-{{ sec_id }} .d2c-tech-header { text-align: center; margin-bottom: 40px; }
  #d2c-tech-{{ sec_id }} .d2c-tech-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-tech-{{ sec_id }} .d2c-tech-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-tech-{{ sec_id }} .d2c-tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  #d2c-tech-{{ sec_id }} .d2c-tech-card {
    background: ${meta.bg};
    border: 1px solid ${meta.border};
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
  }
  #d2c-tech-{{ sec_id }} .d2c-tech-card:hover { transform: translateY(-4px); border-color: {{ accent_color }}; }
  #d2c-tech-{{ sec_id }} .d2c-tech-icon { font-size: 28px; margin-bottom: 14px; }
  #d2c-tech-{{ sec_id }} .d2c-tech-card-title { font-family: ${meta.fontHeading}; font-size: 16px; font-weight: 800; margin: 0 0 8px 0; color: {{ text_color }}; }
  #d2c-tech-{{ sec_id }} .d2c-tech-desc { font-size: 13px; line-height: 1.6; color: ${meta.textSecondary}; margin: 0 0 16px 0; flex-grow: 1; }
  #d2c-tech-{{ sec_id }} .d2c-tech-badge { font-size: 9px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 0.5px; }

  @media (max-width: 990px) {
    #d2c-tech-{{ sec_id }} .d2c-tech-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    #d2c-tech-{{ sec_id }} .d2c-tech-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Material Science",
  "tag": "section",
  "class": "d2c-tech-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Title", "default": "MATERIAL & FABRIC SCIENCE" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "BUILT TO OUTLAST 100+ WASHES" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Material Science" }
  ]
}
{% endschema %}
`;
}

export function buildPromoBanner(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Full-Width Promo Countdown
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.accent}'
  assign text_color = section.settings.text_color | default: '${isDark ? "#000000" : "#ffffff"}'
  assign title = section.settings.title | default: 'FLASH DROP: FLAT 30% OFF'
  assign subtitle = section.settings.subtitle | default: 'USE CODE: VAULT30 AT CHECKOUT • NEXT 4 HOURS ONLY'
-%}

<section id="d2c-promo-{{ sec_id }}" class="d2c-promo-wrap">
  <div class="d2c-promo-container">
    <span class="d2c-promo-fire">🔥 LIMITED TIME FLASH EVENT</span>
    <h2 class="d2c-promo-title">{{ title }}</h2>
    <p class="d2c-promo-sub">{{ subtitle }}</p>
    <a href="/collections/all" class="d2c-promo-btn">SHOP THE FLASH SALE &rarr;</a>
  </div>
</section>

<style>
  #d2c-promo-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 72px) 24px;
    text-align: center;
    font-family: ${meta.fontBody};
  }
  #d2c-promo-{{ sec_id }} .d2c-promo-container { max-width: 800px; margin: 0 auto; }
  #d2c-promo-{{ sec_id }} .d2c-promo-fire { font-size: 11px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; background: rgba(0,0,0,0.15); padding: 6px 14px; border-radius: 99px; display: inline-block; margin-bottom: 12px; }
  #d2c-promo-{{ sec_id }} .d2c-promo-title { font-family: ${meta.fontHeading}; font-size: clamp(28px, 4vw, 48px); font-weight: 900; margin: 0 0 10px 0; }
  #d2c-promo-{{ sec_id }} .d2c-promo-sub { font-size: 14px; font-weight: 700; opacity: 0.9; margin: 0 0 24px 0; }
  #d2c-promo-{{ sec_id }} .d2c-promo-btn {
    display: inline-block;
    background: ${isDark ? '#000000' : '#ffffff'};
    color: ${isDark ? '#ffffff' : '#000000'};
    padding: 16px 36px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 900;
    text-decoration: none;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 10px 24px rgba(0,0,0,0.25);
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Promo Banner",
  "tag": "section",
  "class": "d2c-promo-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Banner Title", "default": "FLASH DROP: FLAT 30% OFF" },
    { "type": "text", "id": "subtitle", "label": "Subtitle", "default": "USE CODE: VAULT30 AT CHECKOUT • NEXT 4 HOURS ONLY" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.accent}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${isDark ? "#000000" : "#ffffff"}" }
  ],
  "presets": [
    { "name": "${meta.brand} Promo Banner" }
  ]
}
{% endschema %}
`;
}

export function buildUgcCommunity(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - UGC Community Photo Wall
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'COMMUNITY FIT GALLERY'
  assign subtitle = section.settings.subtitle | default: 'TAG @${meta.brand.split('/')[0].trim().toLowerCase().replace(/\\s+/g, '')} TO BE FEATURED'
-%}

<section id="d2c-ugc-{{ sec_id }}" class="d2c-ugc-wrap">
  <div class="d2c-ugc-container">
    <div class="d2c-ugc-header">
      <span class="d2c-ugc-sub">{{ subtitle }}</span>
      <h2 class="d2c-ugc-title">{{ title }}</h2>
    </div>

    <div class="d2c-ugc-grid">
      ${[
        { handle: "@kabir_fits", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80" },
        { handle: "@rohan_vibe", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80" },
        { handle: "@zaid_cyber", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80" },
        { handle: "@aditya_raw", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
      ].map((u, i) => `
      <div class="d2c-ugc-card">
        <img src="${u.img}" alt="${u.handle}" class="d2c-ugc-img" loading="lazy" />
        <div class="d2c-ugc-overlay">
          <span class="d2c-ugc-handle">${u.handle}</span>
          <span class="d2c-ugc-action">SHOP LOOK &rarr;</span>
        </div>
      </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-ugc-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-container { max-width: 1320px; margin: 0 auto; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-header { text-align: center; margin-bottom: 36px; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-ugc-{{ sec_id }} .d2c-ugc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-card { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 1; border: 1px solid ${meta.border}; background: #111; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-card:hover .d2c-ugc-img { transform: scale(1.06); }
  
  #d2c-ugc-{{ sec_id }} .d2c-ugc-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-card:hover .d2c-ugc-overlay { opacity: 1; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-handle { font-size: 13px; font-weight: 800; color: #fff; }
  #d2c-ugc-{{ sec_id }} .d2c-ugc-action { font-size: 11px; font-weight: 900; color: {{ accent_color }}; margin-top: 4px; }

  @media (max-width: 990px) {
    #d2c-ugc-{{ sec_id }} .d2c-ugc-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Community Gallery",
  "tag": "section",
  "class": "d2c-ugc-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Title", "default": "COMMUNITY FIT GALLERY" },
    { "type": "text", "id": "subtitle", "label": "Subtitle", "default": "TAG TO BE FEATURED" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Community Gallery" }
  ]
}
{% endschema %}
`;
}

export function buildTrustBadges(meta: BrandNicheMeta, sectionId: string): string {
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Trust & Guarantee Badges
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
-%}

<section id="d2c-trust-{{ sec_id }}" class="d2c-trust-wrap">
  <div class="d2c-trust-container">
    <div class="d2c-trust-grid">
      <div class="d2c-trust-box">
        <span class="d2c-t-icon">⚡</span>
        <div>
          <div class="d2c-t-title">12-Hour Dispatch</div>
          <div class="d2c-t-desc">Express air delivery across 18,000+ PIN codes</div>
        </div>
      </div>
      <div class="d2c-trust-box">
        <span class="d2c-t-icon">🛡️</span>
        <div>
          <div class="d2c-t-title">7-Day Fit Exchanges</div>
          <div class="d2c-t-desc">Free doorstep pickup with instant size swap</div>
        </div>
      </div>
      <div class="d2c-trust-box">
        <span class="d2c-t-icon">💎</span>
        <div>
          <div class="d2c-t-title">100% Quality Benchmark</div>
          <div class="d2c-t-desc">Lab certified heavy-duty materials</div>
        </div>
      </div>
      <div class="d2c-trust-box">
        <span class="d2c-t-icon">💳</span>
        <div>
          <div class="d2c-t-title">Encrypted Secure UPI</div>
          <div class="d2c-t-desc">256-bit bank grade encryption protection</div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-trust-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: 32px 24px;
    font-family: ${meta.fontBody};
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
  }
  #d2c-trust-{{ sec_id }} .d2c-trust-container { max-width: 1320px; margin: 0 auto; }
  #d2c-trust-{{ sec_id }} .d2c-trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  #d2c-trust-{{ sec_id }} .d2c-trust-box { display: flex; align-items: center; gap: 14px; }
  #d2c-trust-{{ sec_id }} .d2c-t-icon { font-size: 24px; color: {{ accent_color }}; }
  #d2c-trust-{{ sec_id }} .d2c-t-title { font-family: ${meta.fontHeading}; font-size: 14px; font-weight: 800; }
  #d2c-trust-{{ sec_id }} .d2c-t-desc { font-size: 11px; color: ${meta.textSecondary}; margin-top: 2px; }

  @media (max-width: 990px) {
    #d2c-trust-{{ sec_id }} .d2c-trust-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media (max-width: 480px) {
    #d2c-trust-{{ sec_id }} .d2c-trust-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Trust Badges",
  "tag": "section",
  "class": "d2c-trust-section",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Trust Badges" }
  ]
}
{% endschema %}
`;
}

export function buildPressStrip(meta: BrandNicheMeta, sectionId: string): string {
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Editorial Press Strip
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
-%}

<section id="d2c-press-{{ sec_id }}" class="d2c-press-wrap">
  <div class="d2c-press-container">
    <div class="d2c-press-header">AS FEATURED & RECOGNIZED IN</div>
    <div class="d2c-press-grid">
      <div class="d2c-press-item">
        <div class="d2c-press-logo">GQ INDIA</div>
        <div class="d2c-press-quote">"Setting a new benchmark for Indian D2C craftsmanship and fit."</div>
      </div>
      <div class="d2c-press-item">
        <div class="d2c-press-logo">VOGUE</div>
        <div class="d2c-press-quote">"The definitive modern luxury wardrobe for the new generation."</div>
      </div>
      <div class="d2c-press-item">
        <div class="d2c-press-logo">FORBES</div>
        <div class="d2c-press-quote">"Redefining consumer trust through pure material transparency."</div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-press-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(40px, 5vw, 64px) 24px;
    font-family: ${meta.fontBody};
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
  }
  #d2c-press-{{ sec_id }} .d2c-press-container { max-width: 1200px; margin: 0 auto; text-align: center; }
  #d2c-press-{{ sec_id }} .d2c-press-header { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: {{ accent_color }}; margin-bottom: 28px; }
  #d2c-press-{{ sec_id }} .d2c-press-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
  #d2c-press-{{ sec_id }} .d2c-press-item { padding: 18px; border-radius: 12px; background: ${meta.cardBg}; border: 1px solid ${meta.border}; }
  #d2c-press-{{ sec_id }} .d2c-press-logo { font-family: ${meta.fontHeading}; font-size: 18px; font-weight: 900; letter-spacing: 1px; color: {{ text_color }}; margin-bottom: 8px; }
  #d2c-press-{{ sec_id }} .d2c-press-quote { font-size: 13px; font-style: italic; color: ${meta.textSecondary}; line-height: 1.5; }

  @media (max-width: 768px) {
    #d2c-press-{{ sec_id }} .d2c-press-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Press Recognition",
  "tag": "section",
  "class": "d2c-press-section",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Press Recognition" }
  ]
}
{% endschema %}
`;
}

export function buildBrandStory(meta: BrandNicheMeta, sectionId: string): string {
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Founder's Manifesto
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
-%}

<section id="d2c-story-{{ sec_id }}" class="d2c-story-wrap">
  <div class="d2c-story-container">
    <div class="d2c-story-grid">
      <div class="d2c-story-media">
        <img src="${meta.heroImg}" alt="Artisanal Heritage" class="d2c-story-img" loading="lazy" />
      </div>
      <div class="d2c-story-content">
        <span class="d2c-story-sub">OUR FOUNDATIONAL MANIFESTO</span>
        <h2 class="d2c-story-title">Crafting Without Compromise</h2>
        <p class="d2c-story-p">We began with a singular conviction: that modern Indian consumers deserve world-class architectural silhouettes, uncompromised raw materials, and honest benchmark pricing.</p>
        <p class="d2c-story-p">Every single creation is tested across rigorous wear-and-tear cycles, ensuring that what arrives at your doorstep remains your favorite staple for years to come.</p>
        <div class="d2c-story-sig">
          <div class="d2c-sig-text">${meta.brand.split('/')[0].trim()} Atelier Team</div>
          <div class="d2c-sig-role">Master Design & Craftsmanship Guild</div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-story-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
  }
  #d2c-story-{{ sec_id }} .d2c-story-container { max-width: 1200px; margin: 0 auto; }
  #d2c-story-{{ sec_id }} .d2c-story-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
  #d2c-story-{{ sec_id }} .d2c-story-media { border-radius: 16px; overflow: hidden; aspect-ratio: 4 / 5; border: 1px solid ${meta.border}; }
  #d2c-story-{{ sec_id }} .d2c-story-img { width: 100%; height: 100%; object-fit: cover; }
  
  #d2c-story-{{ sec_id }} .d2c-story-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-story-{{ sec_id }} .d2c-story-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 18px 0; }
  #d2c-story-{{ sec_id }} .d2c-story-p { font-size: 14px; line-height: 1.7; color: ${meta.textSecondary}; margin-bottom: 16px; }
  #d2c-story-{{ sec_id }} .d2c-story-sig { margin-top: 24px; border-top: 1px solid ${meta.border}; padding-top: 16px; }
  #d2c-story-{{ sec_id }} .d2c-sig-text { font-family: ${meta.fontHeading}; font-size: 18px; font-weight: 900; color: {{ accent_color }}; }
  #d2c-story-{{ sec_id }} .d2c-sig-role { font-size: 11px; color: ${meta.textSecondary}; margin-top: 2px; }

  @media (max-width: 990px) {
    #d2c-story-{{ sec_id }} .d2c-story-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Brand Story",
  "tag": "section",
  "class": "d2c-story-section",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Brand Story" }
  ]
}
{% endschema %}
`;
}

export function buildVipPerks(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - VIP Loyalty Perks
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
-%}

<section id="d2c-vip-{{ sec_id }}" class="d2c-vip-wrap">
  <div class="d2c-vip-container">
    <div class="d2c-vip-header">
      <span class="d2c-vip-sub">JOIN THE VAULT CLAN</span>
      <h2 class="d2c-vip-title">Exclusive Member Privileges</h2>
    </div>

    <div class="d2c-vip-grid">
      <div class="d2c-vip-card">
        <div class="d2c-vip-level">TIER 01</div>
        <h3 class="d2c-vip-name">Silver Member</h3>
        <p class="d2c-vip-desc">Unlock 5% cashback coins on every purchase + early drop access.</p>
        <div class="d2c-vip-badge">JOIN FREE</div>
      </div>
      <div class="d2c-vip-card d2c-vip-featured">
        <div class="d2c-vip-level">TIER 02 • MOST POPULAR</div>
        <h3 class="d2c-vip-name">Gold Vault Clan</h3>
        <p class="d2c-vip-desc">10% cashback + free priority air shipping on all orders + secret vault drop invites.</p>
        <div class="d2c-vip-badge">SPEND ₹5,000</div>
      </div>
      <div class="d2c-vip-card">
        <div class="d2c-vip-level">TIER 03</div>
        <h3 class="d2c-vip-name">Black Card VIP</h3>
        <p class="d2c-vip-desc">15% lifetime cashback + personal styling concierge + customized gift drops.</p>
        <div class="d2c-vip-badge">SPEND ₹15,000</div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-vip-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-vip-{{ sec_id }} .d2c-vip-container { max-width: 1200px; margin: 0 auto; }
  #d2c-vip-{{ sec_id }} .d2c-vip-header { text-align: center; margin-bottom: 36px; }
  #d2c-vip-{{ sec_id }} .d2c-vip-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-vip-{{ sec_id }} .d2c-vip-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-vip-{{ sec_id }} .d2c-vip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  #d2c-vip-{{ sec_id }} .d2c-vip-card {
    background: ${meta.cardBg};
    border: 1px solid ${meta.border};
    border-radius: 14px;
    padding: 28px;
    display: flex;
    flex-direction: column;
  }
  #d2c-vip-{{ sec_id }} .d2c-vip-featured { border-color: {{ accent_color }}; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
  #d2c-vip-{{ sec_id }} .d2c-vip-level { font-size: 10px; font-weight: 900; color: {{ accent_color }}; letter-spacing: 1px; margin-bottom: 6px; }
  #d2c-vip-{{ sec_id }} .d2c-vip-name { font-family: ${meta.fontHeading}; font-size: 20px; font-weight: 900; margin: 0 0 10px 0; }
  #d2c-vip-{{ sec_id }} .d2c-vip-desc { font-size: 13px; line-height: 1.6; color: ${meta.textSecondary}; margin: 0 0 20px 0; flex-grow: 1; }
  #d2c-vip-{{ sec_id }} .d2c-vip-badge { font-size: 11px; font-weight: 900; padding: 6px 12px; border-radius: 6px; background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}; color: {{ text_color }}; text-align: center; border: 1px solid ${meta.border}; }

  @media (max-width: 990px) {
    #d2c-vip-{{ sec_id }} .d2c-vip-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} VIP Rewards",
  "tag": "section",
  "class": "d2c-vip-section",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} VIP Rewards" }
  ]
}
{% endschema %}
`;
}

export function buildNewsletter(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - VIP Newsletter Capture
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
-%}

<section id="d2c-news-{{ sec_id }}" class="d2c-news-wrap">
  <div class="d2c-news-container">
    <span class="d2c-news-sub">UNLOCK IMMEDIATE 15% OFF</span>
    <h2 class="d2c-news-title">Join The Insider Circle</h2>
    <p class="d2c-news-desc">Get priority private drop access, secret member pricing, and limited edition releases delivered to your inbox.</p>
    
    <form class="d2c-news-form" onsubmit="event.preventDefault(); this.querySelector('.d2c-news-btn').textContent = 'WELCOME TO THE VAULT! ✓';">
      <input type="email" placeholder="Enter your best email..." required class="d2c-news-input" />
      <button type="submit" class="d2c-news-btn">CLAIM 15% OFF &rarr;</button>
    </form>
    <div class="d2c-news-spam">No spam ever. Unsubscribe at any time with one click.</div>
  </div>
</section>

<style>
  #d2c-news-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
    text-align: center;
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
  }
  #d2c-news-{{ sec_id }} .d2c-news-container { max-width: 680px; margin: 0 auto; }
  #d2c-news-{{ sec_id }} .d2c-news-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-news-{{ sec_id }} .d2c-news-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 38px); font-weight: 900; margin: 6px 0 12px 0; }
  #d2c-news-{{ sec_id }} .d2c-news-desc { font-size: 14px; line-height: 1.6; color: ${meta.textSecondary}; margin-bottom: 24px; }
  
  #d2c-news-{{ sec_id }} .d2c-news-form { display: flex; gap: 10px; max-width: 480px; margin: 0 auto 12px auto; }
  #d2c-news-{{ sec_id }} .d2c-news-input {
    flex-grow: 1;
    background: ${meta.bg};
    border: 1px solid ${meta.border};
    color: {{ text_color }};
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
  }
  #d2c-news-{{ sec_id }} .d2c-news-btn {
    background: {{ accent_color }};
    color: ${isDark ? '#000000' : '#ffffff'};
    border: none;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    white-space: nowrap;
  }
  #d2c-news-{{ sec_id }} .d2c-news-spam { font-size: 11px; color: ${meta.textSecondary}; }

  @media (max-width: 480px) {
    #d2c-news-{{ sec_id }} .d2c-news-form { flex-direction: column; }
    #d2c-news-{{ sec_id }} .d2c-news-btn { width: 100%; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Newsletter",
  "tag": "section",
  "class": "d2c-news-section",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Newsletter" }
  ]
}
{% endschema %}
`;
}

export function buildPopupSpin(meta: BrandNicheMeta, sectionId: string): string {
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Gamified Rewards Modal
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
-%}

<div id="d2c-modal-{{ sec_id }}" class="d2c-modal-wrap" style="display: none;">
  <div class="d2c-modal-backdrop" onclick="this.closest('.d2c-modal-wrap').style.display = 'none'"></div>
  <div class="d2c-modal-box">
    <button class="d2c-modal-close" onclick="this.closest('.d2c-modal-wrap').style.display = 'none'">&times;</button>
    <div class="d2c-modal-content">
      <span class="d2c-modal-tag">🎁 UNLOCK INSTANT DISCOUNT</span>
      <h3 class="d2c-modal-title">Spin For Secret Perks</h3>
      <p class="d2c-modal-desc">Enter your phone number to reveal extra 10% to 30% discount coupon code.</p>
      <input type="tel" placeholder="Enter Mobile Number (+91)" class="d2c-modal-input" />
      <button class="d2c-modal-btn" onclick="this.textContent = 'COUPON CODE: VAULT25 APPLIED! ✓'">SPIN & UNLOCK &rarr;</button>
    </div>
  </div>
</div>

<style>
  #d2c-modal-{{ sec_id }} { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center; justify-content: center; font-family: ${meta.fontBody}; }
  #d2c-modal-{{ sec_id }} .d2c-modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); }
  #d2c-modal-{{ sec_id }} .d2c-modal-box { position: relative; z-index: 2; background: ${meta.cardBg}; border: 1px solid ${meta.border}; border-radius: 16px; padding: 32px; max-width: 440px; width: 90%; text-align: center; color: ${meta.textPrimary}; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  #d2c-modal-{{ sec_id }} .d2c-modal-close { position: absolute; top: 14px; right: 14px; background: none; border: none; font-size: 24px; color: ${meta.textSecondary}; cursor: pointer; }
  #d2c-modal-{{ sec_id }} .d2c-modal-tag { font-size: 10px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1px; }
  #d2c-modal-{{ sec_id }} .d2c-modal-title { font-family: ${meta.fontHeading}; font-size: 24px; font-weight: 900; margin: 6px 0 10px 0; }
  #d2c-modal-{{ sec_id }} .d2c-modal-desc { font-size: 13px; color: ${meta.textSecondary}; margin-bottom: 20px; line-height: 1.5; }
  #d2c-modal-{{ sec_id }} .d2c-modal-input { width: 100%; background: ${meta.bg}; border: 1px solid ${meta.border}; color: ${meta.textPrimary}; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; outline: none; }
  #d2c-modal-{{ sec_id }} .d2c-modal-btn { width: 100%; background: {{ accent_color }}; color: ${meta.bgDark ? '#000' : '#fff'}; border: none; padding: 14px; border-radius: 8px; font-size: 12px; font-weight: 900; cursor: pointer; }
</style>

{% schema %}
{
  "name": "${meta.brand} Gamified Modal",
  "tag": "section",
  "class": "d2c-modal-section",
  "settings": [
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Gamified Modal" }
  ]
}
{% endschema %}
`;
}
