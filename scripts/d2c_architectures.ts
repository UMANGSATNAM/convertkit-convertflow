import { BrandNicheMeta } from './d2c_brand_metas';

export function buildHero(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Hero Masterpiece
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.heading | default: '${meta.heroHeadline}'
  assign subtitle = section.settings.badge | default: '${meta.badge}'
  assign desc = section.settings.desc | default: '${meta.heroDesc}'
  assign btn_1_text = section.settings.btn_1_text | default: 'EXPLORE VAULT DROPS'
  assign btn_1_link = section.settings.btn_1_link | default: '/collections/all'
  assign btn_2_text = section.settings.btn_2_text | default: 'BUILD CAPSULE'
  assign btn_2_link = section.settings.btn_2_link | default: '/pages/about'
  assign hero_image = section.settings.hero_image
-%}

<section id="d2c-hero-{{ sec_id }}" class="d2c-hero-wrap ${isDark ? 'd2c-dark' : 'd2c-light'}">
  <div class="d2c-hero-bg-glow"></div>
  <div class="d2c-hero-container">
    <div class="d2c-hero-grid">
      <div class="d2c-hero-content">
        <div class="d2c-hero-badge">
          <span class="d2c-badge-pulse"></span>
          <span>{{ subtitle }}</span>
        </div>

        <h1 class="d2c-hero-title">{{ title }}</h1>
        <p class="d2c-hero-desc">{{ desc }}</p>

        <div class="d2c-hero-urgency-card">
          <div class="d2c-urgency-left">
            <span class="d2c-urgency-fire">⚡</span>
            <div>
              <div class="d2c-urgency-title">EXCLUSIVE DROP CLOSES IN:</div>
              <div class="d2c-countdown-timer" data-countdown="d2c-hero-{{ sec_id }}">
                <span class="d2c-cd-box"><b class="d2c-hours">08</b>h</span> :
                <span class="d2c-cd-box"><b class="d2c-minutes">42</b>m</span> :
                <span class="d2c-cd-box"><b class="d2c-seconds">19</b>s</span>
              </div>
            </div>
          </div>
          <div class="d2c-stock-pill">
            <span class="d2c-stock-dot"></span> Only 14 Units Left
          </div>
        </div>

        <div class="d2c-hero-actions">
          <a href="{{ btn_1_link }}" class="d2c-btn-hero-primary">
            {{ btn_1_text }} &rarr;
          </a>
          <a href="{{ btn_2_link }}" class="d2c-btn-hero-secondary">
            {{ btn_2_text }}
          </a>
        </div>

        <div class="d2c-hero-proof">
          <div class="d2c-avatar-group">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Customer" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Customer" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Customer" />
          </div>
          <div class="d2c-proof-text">
            <div class="d2c-proof-stars">★★★★★</div>
            <span><strong>4.9/5 Rating</strong> • 45,000+ Verified Clients</span>
          </div>
        </div>
      </div>

      <div class="d2c-hero-media">
        <div class="d2c-media-frame">
          {%- if hero_image != blank -%}
            <img src="{{ hero_image | image_url: width: 1000 }}" alt="{{ title | escape }}" class="d2c-hero-img" loading="eager" />
          {%- else -%}
            <img src="${meta.heroImg}" alt="${meta.heroHeadline}" class="d2c-hero-img" loading="eager" />
          {%- endif -%}
          
          <div class="d2c-hero-float-card">
            <span class="d2c-float-tag">VAULT BENCHMARK</span>
            <div class="d2c-float-name">${meta.products[0]?.title || 'Hero Signature Release'}</div>
            <div class="d2c-float-price">${meta.products[0]?.price || '₹2,499'} <span class="d2c-float-orig">${meta.products[0]?.originalPrice || '₹3,499'}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-hero-{{ sec_id }} {
    --d2c-bg: {{ bg_color }};
    --d2c-text: {{ text_color }};
    --d2c-accent: {{ accent_color }};
    --d2c-card-bg: ${meta.cardBg};
    --d2c-border: ${meta.border};
    --d2c-text-sub: ${meta.textSecondary};

    background-color: var(--d2c-bg);
    color: var(--d2c-text);
    padding: clamp(48px, 6vw, 96px) 24px;
    font-family: ${meta.fontBody};
    position: relative;
    overflow: hidden;
  }
  #d2c-hero-{{ sec_id }} * { box-sizing: border-box; }
  #d2c-hero-{{ sec_id }} .d2c-hero-container { max-width: 1320px; margin: 0 auto; width: 100%; position: relative; z-index: 2; }
  #d2c-hero-{{ sec_id }} .d2c-hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
  
  #d2c-hero-{{ sec_id }} .d2c-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
    color: var(--d2c-accent);
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid var(--d2c-border);
    margin-bottom: 20px;
  }
  #d2c-hero-{{ sec_id }} .d2c-badge-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--d2c-accent); box-shadow: 0 0 10px var(--d2c-accent); }
  
  #d2c-hero-{{ sec_id }} .d2c-hero-title {
    font-family: ${meta.fontHeading};
    font-size: clamp(32px, 4.5vw, 56px);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -1px;
    color: var(--d2c-text);
    margin: 0 0 18px 0;
  }
  #d2c-hero-{{ sec_id }} .d2c-hero-desc {
    font-size: clamp(15px, 1.8vw, 17px);
    line-height: 1.6;
    color: var(--d2c-text-sub);
    margin: 0 0 28px 0;
    max-width: 560px;
  }
  
  #d2c-hero-{{ sec_id }} .d2c-hero-urgency-card {
    background: var(--d2c-card-bg);
    border: 1px solid var(--d2c-border);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    max-width: 540px;
  }
  #d2c-hero-{{ sec_id }} .d2c-urgency-left { display: flex; align-items: center; gap: 12px; }
  #d2c-hero-{{ sec_id }} .d2c-urgency-fire { font-size: 20px; }
  #d2c-hero-{{ sec_id }} .d2c-urgency-title { font-size: 10px; font-weight: 800; color: var(--d2c-text-sub); letter-spacing: 0.5px; }
  #d2c-hero-{{ sec_id }} .d2c-countdown-timer { font-family: monospace; font-size: 16px; font-weight: 800; color: var(--d2c-accent); margin-top: 2px; }
  #d2c-hero-{{ sec_id }} .d2c-stock-pill { background: rgba(239, 68, 68, 0.15); color: #ef4444; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 99px; display: flex; align-items: center; gap: 6px; }
  #d2c-hero-{{ sec_id }} .d2c-stock-dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; animation: d2c-blink 1.5s infinite; }
  @keyframes d2c-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  
  #d2c-hero-{{ sec_id }} .d2c-hero-actions { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  #d2c-hero-{{ sec_id }} .d2c-btn-hero-primary {
    background: var(--d2c-accent);
    color: ${isDark ? '#000000' : '#ffffff'};
    padding: 16px 36px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 10px 24px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
  #d2c-hero-{{ sec_id }} .d2c-btn-hero-primary:hover { transform: translateY(-2px); opacity: 0.95; }
  #d2c-hero-{{ sec_id }} .d2c-btn-hero-secondary {
    background: transparent;
    color: var(--d2c-text);
    padding: 16px 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid var(--d2c-border);
  }
  
  #d2c-hero-{{ sec_id }} .d2c-hero-proof { display: flex; align-items: center; gap: 14px; }
  #d2c-hero-{{ sec_id }} .d2c-avatar-group { display: flex; }
  #d2c-hero-{{ sec_id }} .d2c-avatar-group img { width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--d2c-bg); margin-left: -8px; }
  #d2c-hero-{{ sec_id }} .d2c-avatar-group img:first-child { margin-left: 0; }
  #d2c-hero-{{ sec_id }} .d2c-proof-stars { color: #f59e0b; font-size: 12px; letter-spacing: 2px; }
  #d2c-hero-{{ sec_id }} .d2c-proof-text { font-size: 12px; color: var(--d2c-text-sub); }
  
  #d2c-hero-{{ sec_id }} .d2c-media-frame {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--d2c-border);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    aspect-ratio: 4 / 5;
    background: #111;
  }
  #d2c-hero-{{ sec_id }} .d2c-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  
  #d2c-hero-{{ sec_id }} .d2c-hero-float-card {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 14px 18px;
    color: #ffffff;
  }
  #d2c-hero-{{ sec_id }} .d2c-float-tag { font-size: 9px; font-weight: 800; color: var(--d2c-accent); letter-spacing: 0.5px; }
  #d2c-hero-{{ sec_id }} .d2c-float-name { font-size: 14px; font-weight: 800; margin: 2px 0 4px 0; }
  #d2c-hero-{{ sec_id }} .d2c-float-price { font-size: 15px; font-weight: 900; color: var(--d2c-accent); }
  #d2c-hero-{{ sec_id }} .d2c-float-orig { font-size: 12px; text-decoration: line-through; color: #94a3b8; font-weight: 500; margin-left: 6px; }

  @media (max-width: 990px) {
    #d2c-hero-{{ sec_id }} .d2c-hero-grid { grid-template-columns: 1fr; }
    #d2c-hero-{{ sec_id }} .d2c-hero-urgency-card { max-width: 100%; }
    #d2c-hero-{{ sec_id }} .d2c-media-frame { aspect-ratio: 16 / 10; max-height: 420px; }
  }
  @media (max-width: 480px) {
    #d2c-hero-{{ sec_id }} { padding: 40px 16px; }
    #d2c-hero-{{ sec_id }} .d2c-hero-actions { flex-direction: column; }
    #d2c-hero-{{ sec_id }} .d2c-btn-hero-primary, #d2c-hero-{{ sec_id }} .d2c-btn-hero-secondary { width: 100%; text-align: center; }
  }
</style>

<script>
  (function() {
    var timerEl = document.querySelector('[data-countdown="d2c-hero-{{ sec_id }}"]');
    if (!timerEl) return;
    var hrs = 8, mins = 42, secs = 19;
    setInterval(function() {
      if (secs > 0) { secs--; }
      else {
        secs = 59;
        if (mins > 0) { mins--; }
        else { mins = 59; if (hrs > 0) hrs--; }
      }
      var hStr = hrs < 10 ? '0' + hrs : hrs;
      var mStr = mins < 10 ? '0' + mins : mins;
      var sStr = secs < 10 ? '0' + secs : secs;
      var hEl = timerEl.querySelector('.d2c-hours');
      var mEl = timerEl.querySelector('.d2c-minutes');
      var sEl = timerEl.querySelector('.d2c-seconds');
      if (hEl) hEl.textContent = hStr;
      if (mEl) mEl.textContent = mStr;
      if (sEl) sEl.textContent = sStr;
    }, 1000);
  })();
</script>

{% schema %}
{
  "name": "${meta.brand} Split Hero",
  "tag": "section",
  "class": "d2c-hero-section",
  "settings": [
    { "type": "text", "id": "heading", "label": "Headline", "default": "${meta.heroHeadline}" },
    { "type": "text", "id": "badge", "label": "Badge Text", "default": "${meta.badge}" },
    { "type": "textarea", "id": "desc", "label": "Description", "default": "${meta.heroDesc}" },
    { "type": "image_picker", "id": "hero_image", "label": "Hero Visual Banner" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" },
    { "type": "text", "id": "btn_1_text", "label": "Primary CTA Text", "default": "EXPLORE COLLECTION" },
    { "type": "url", "id": "btn_1_link", "label": "Primary CTA Link" },
    { "type": "text", "id": "btn_2_text", "label": "Secondary CTA Text", "default": "LEARN MORE" },
    { "type": "url", "id": "btn_2_link", "label": "Secondary CTA Link" }
  ],
  "presets": [
    { "name": "${meta.brand} Split Hero" }
  ]
}
{% endschema %}
`;
}

export function buildAnnouncement(meta: BrandNicheMeta, sectionId: string): string {
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Announcement Bar
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.accent}'
  assign text_color = section.settings.text_color | default: '${meta.bgDark ? "#000000" : "#ffffff"}'
  assign promo_text = section.settings.promo_text | default: '⚡ USE CODE: VAULT20 FOR EXTRA 20% OFF • FREE EXPRESS DISPATCH ACROSS INDIA'
  assign coupon_code = section.settings.coupon_code | default: 'VAULT20'
-%}

<div id="d2c-announcement-{{ sec_id }}" class="d2c-announcement-bar">
  <div class="d2c-ann-container">
    <div class="d2c-ann-ticker">
      <span class="d2c-ann-icon">🔥</span>
      <span class="d2c-ann-text">{{ promo_text }}</span>
      <button type="button" class="d2c-ann-copy-btn" onclick="navigator.clipboard.writeText('{{ coupon_code }}'); this.textContent = 'COPIED! ✓'; setTimeout(() => this.textContent = 'COPY CODE', 2000)">
        COPY CODE
      </button>
    </div>
  </div>
</div>

<style>
  #d2c-announcement-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: 10px 16px;
    font-family: ${meta.fontBody};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 100;
  }
  #d2c-announcement-{{ sec_id }} .d2c-ann-container { max-width: 1320px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
  #d2c-announcement-{{ sec_id }} .d2c-ann-ticker { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
  #d2c-announcement-{{ sec_id }} .d2c-ann-copy-btn {
    background: ${meta.bgDark ? '#000000' : '#ffffff'};
    color: ${meta.bgDark ? '#ffffff' : '#000000'};
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 900;
    cursor: pointer;
    letter-spacing: 0.5px;
  }
  #d2c-announcement-{{ sec_id }} .d2c-ann-copy-btn:hover { opacity: 0.9; }
</style>

{% schema %}
{
  "name": "${meta.brand} Flash Bar",
  "tag": "section",
  "class": "d2c-announcement-section",
  "settings": [
    { "type": "text", "id": "promo_text", "label": "Announcement Text", "default": "⚡ USE CODE: VAULT20 FOR EXTRA 20% OFF • FREE EXPRESS DISPATCH" },
    { "type": "text", "id": "coupon_code", "label": "Coupon Code", "default": "VAULT20" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "${meta.accent}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.bgDark ? "#000000" : "#ffffff"}" }
  ],
  "presets": [
    { "name": "${meta.brand} Flash Bar" }
  ]
}
{% endschema %}
`;
}

export function buildHeader(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Header Navigation Chrome
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign brand_name = section.settings.brand_name | default: '${meta.brand}'
-%}

<header id="d2c-header-{{ sec_id }}" class="d2c-header-wrap ${isDark ? 'd2c-dark' : 'd2c-light'}">
  <div class="d2c-header-container">
    <div class="d2c-header-left">
      <button type="button" class="d2c-mobile-menu-btn" aria-label="Open Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <a href="/" class="d2c-brand-logo">
        <span class="d2c-brand-icon">⚡</span>
        <span class="d2c-brand-title">{{ brand_name }}</span>
      </a>
    </div>

    <nav class="d2c-header-nav">
      <a href="/collections/all" class="d2c-nav-link d2c-nav-active">New Drops <span class="d2c-nav-badge">HOT</span></a>
      <a href="/collections/all" class="d2c-nav-link">Bestsellers</a>
      <a href="/collections/all" class="d2c-nav-link">Capsule Wardrobe</a>
      <a href="/pages/about" class="d2c-nav-link">Artisanal Story</a>
      <a href="/collections/all" class="d2c-nav-link d2c-nav-sale">Vault Sale</a>
    </nav>

    <div class="d2c-header-right">
      <div class="d2c-header-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Search drops, tech, fits..." class="d2c-search-input" />
      </div>
      <a href="/cart" class="d2c-cart-trigger">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span class="d2c-cart-count">2</span>
      </a>
    </div>
  </div>
</header>

<style>
  #d2c-header-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    border-bottom: 1px solid ${meta.border};
    position: sticky;
    top: 0;
    z-index: 90;
    padding: 16px 24px;
    font-family: ${meta.fontBody};
    backdrop-filter: blur(16px);
  }
  #d2c-header-{{ sec_id }} .d2c-header-container { max-width: 1320px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  #d2c-header-{{ sec_id }} .d2c-header-left { display: flex; align-items: center; gap: 16px; }
  #d2c-header-{{ sec_id }} .d2c-brand-logo { font-family: ${meta.fontHeading}; font-size: 22px; font-weight: 900; color: {{ text_color }}; text-decoration: none; display: flex; align-items: center; gap: 8px; letter-spacing: -0.5px; }
  #d2c-header-{{ sec_id }} .d2c-brand-icon { color: {{ accent_color }}; font-size: 20px; }
  
  #d2c-header-{{ sec_id }} .d2c-header-nav { display: flex; align-items: center; gap: 24px; }
  #d2c-header-{{ sec_id }} .d2c-nav-link { color: ${meta.textSecondary}; text-decoration: none; font-size: 14px; font-weight: 700; transition: color 0.2s ease; display: flex; align-items: center; gap: 6px; }
  #d2c-header-{{ sec_id }} .d2c-nav-link:hover, #d2c-header-{{ sec_id }} .d2c-nav-active { color: {{ accent_color }}; }
  #d2c-header-{{ sec_id }} .d2c-nav-badge { background: #ef4444; color: #fff; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; }
  #d2c-header-{{ sec_id }} .d2c-nav-sale { color: #ef4444; }
  
  #d2c-header-{{ sec_id }} .d2c-header-right { display: flex; align-items: center; gap: 16px; }
  #d2c-header-{{ sec_id }} .d2c-header-search { display: flex; align-items: center; gap: 8px; background: ${isDark ? '#141418' : '#f4f4f5'}; border: 1px solid ${meta.border}; padding: 8px 14px; border-radius: 8px; }
  #d2c-header-{{ sec_id }} .d2c-search-input { background: transparent; border: none; outline: none; color: {{ text_color }}; font-size: 13px; width: 160px; }
  #d2c-header-{{ sec_id }} .d2c-cart-trigger { position: relative; color: {{ text_color }}; display: flex; align-items: center; text-decoration: none; }
  #d2c-header-{{ sec_id }} .d2c-cart-count { position: absolute; top: -6px; right: -8px; background: {{ accent_color }}; color: ${isDark ? '#000000' : '#ffffff'}; font-size: 10px; font-weight: 900; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  #d2c-header-{{ sec_id }} .d2c-mobile-menu-btn { display: none; background: none; border: none; color: {{ text_color }}; cursor: pointer; }

  @media (max-width: 990px) {
    #d2c-header-{{ sec_id }} .d2c-header-nav, #d2c-header-{{ sec_id }} .d2c-header-search { display: none; }
    #d2c-header-{{ sec_id }} .d2c-mobile-menu-btn { display: block; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Header",
  "tag": "section",
  "class": "d2c-header-section",
  "settings": [
    { "type": "text", "id": "brand_name", "label": "Brand Title", "default": "${meta.brand}" },
    { "type": "color", "id": "bg_color", "label": "Header Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Header" }
  ]
}
{% endschema %}
`;
}

export function buildMarquee(meta: BrandNicheMeta, sectionId: string): string {
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Continuous Marquee Ticker
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign marquee_text = section.settings.text | default: '★ ${meta.badge} ★ 100% QUALITY BENCHMARK ★ 7-DAY DOORSTEP EXCHANGES ★ 45,000+ COMMITTED ENTHUSIASTS'
-%}

<div id="d2c-marquee-{{ sec_id }}" class="d2c-marquee-wrap">
  <div class="d2c-marquee-track">
    <div class="d2c-marquee-content">
      <span>{{ marquee_text }}</span>
      <span>{{ marquee_text }}</span>
      <span>{{ marquee_text }}</span>
      <span>{{ marquee_text }}</span>
    </div>
  </div>
</div>

<style>
  #d2c-marquee-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: 14px 0;
    overflow: hidden;
    border-top: 1px solid ${meta.border};
    border-bottom: 1px solid ${meta.border};
    font-family: ${meta.fontHeading};
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  #d2c-marquee-{{ sec_id }} .d2c-marquee-track { display: flex; width: 100%; overflow: hidden; white-space: nowrap; }
  #d2c-marquee-{{ sec_id }} .d2c-marquee-content { display: inline-flex; gap: 40px; animation: d2c-marquee-scroll 25s linear infinite; }
  #d2c-marquee-{{ sec_id }} .d2c-marquee-content span { color: {{ accent_color }}; }
  @keyframes d2c-marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>

{% schema %}
{
  "name": "${meta.brand} Marquee Ticker",
  "tag": "section",
  "class": "d2c-marquee-section",
  "settings": [
    { "type": "text", "id": "text", "label": "Marquee String", "default": "★ ${meta.badge} ★ 100% QUALITY BENCHMARK ★ 7-DAY DOORSTEP EXCHANGES" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Marquee Ticker" }
  ]
}
{% endschema %}
`;
}

export function buildCategoryTiles(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Category Tiles
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'EXPLORE BY CATEGORY'
  assign subtitle = section.settings.subtitle | default: 'CURATED ARCHITECTURAL SILHOUETTES'
-%}

<section id="d2c-categories-{{ sec_id }}" class="d2c-categories-wrap">
  <div class="d2c-cat-container">
    <div class="d2c-section-header">
      <span class="d2c-sub-tag">{{ subtitle }}</span>
      <h2 class="d2c-section-title">{{ title }}</h2>
    </div>

    <div class="d2c-categories-grid">
      ${meta.categories.map((c, i) => `
      <a href="${c.link}" class="d2c-cat-card">
        <div class="d2c-cat-media">
          <img src="${c.img}" alt="${c.title}" class="d2c-cat-img" loading="lazy" />
          <div class="d2c-cat-overlay"></div>
        </div>
        <div class="d2c-cat-meta">
          <div class="d2c-cat-count">${c.count}</div>
          <h3 class="d2c-cat-name">${c.title}</h3>
          <span class="d2c-cat-arrow">&rarr;</span>
        </div>
      </a>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-categories-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-categories-{{ sec_id }} .d2c-cat-container { max-width: 1320px; margin: 0 auto; }
  #d2c-categories-{{ sec_id }} .d2c-section-header { text-align: center; margin-bottom: 40px; }
  #d2c-categories-{{ sec_id }} .d2c-sub-tag { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-categories-{{ sec_id }} .d2c-section-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }
  
  #d2c-categories-{{ sec_id }} .d2c-categories-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  #d2c-categories-{{ sec_id }} .d2c-cat-card {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    text-decoration: none;
    background: ${meta.cardBg};
    border: 1px solid ${meta.border};
    aspect-ratio: 3 / 4;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  #d2c-categories-{{ sec_id }} .d2c-cat-card:hover { transform: translateY(-4px); border-color: {{ accent_color }}; }
  #d2c-categories-{{ sec_id }} .d2c-cat-media { width: 100%; height: 100%; position: absolute; inset: 0; }
  #d2c-categories-{{ sec_id }} .d2c-cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  #d2c-categories-{{ sec_id }} .d2c-cat-card:hover .d2c-cat-img { transform: scale(1.05); }
  #d2c-categories-{{ sec_id }} .d2c-cat-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%); }
  
  #d2c-categories-{{ sec_id }} .d2c-cat-meta {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    z-index: 2;
  }
  #d2c-categories-{{ sec_id }} .d2c-cat-count { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 0.5px; text-transform: uppercase; }
  #d2c-categories-{{ sec_id }} .d2c-cat-name { font-family: ${meta.fontHeading}; font-size: 18px; font-weight: 800; color: #ffffff; margin: 4px 0 0 0; }
  #d2c-categories-{{ sec_id }} .d2c-cat-arrow { color: #ffffff; font-size: 18px; margin-top: 6px; transition: transform 0.2s ease; }
  #d2c-categories-{{ sec_id }} .d2c-cat-card:hover .d2c-cat-arrow { transform: translateX(4px); color: {{ accent_color }}; }

  @media (max-width: 990px) {
    #d2c-categories-{{ sec_id }} .d2c-categories-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    #d2c-categories-{{ sec_id }} .d2c-categories-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Category Tiles",
  "tag": "section",
  "class": "d2c-categories-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Heading", "default": "EXPLORE BY CATEGORY" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "CURATED ARCHITECTURAL SILHOUETTES" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Category Tiles" }
  ]
}
{% endschema %}
`;
}

export function buildBestsellersTabs(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Bestsellers Multi-Tab Grid
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'VAULT BESTSELLERS'
  assign subtitle = section.settings.subtitle | default: 'MOST LOVED HIGH-OCTANE STYLES'
-%}

<section id="d2c-bestsellers-{{ sec_id }}" class="d2c-bestsellers-wrap">
  <div class="d2c-bs-container">
    <div class="d2c-bs-header">
      <div>
        <span class="d2c-bs-sub">{{ subtitle }}</span>
        <h2 class="d2c-bs-title">{{ title }}</h2>
      </div>
      <div class="d2c-bs-tabs">
        <button class="d2c-tab-btn d2c-tab-active" onclick="switchBsTab(this, 'all')">ALL DROPS</button>
        <button class="d2c-tab-btn" onclick="switchBsTab(this, 'trending')">TRENDING NOW</button>
        <button class="d2c-tab-btn" onclick="switchBsTab(this, 'vault')">VAULT EXCLUSIVE</button>
      </div>
    </div>

    <div class="d2c-bs-grid">
      ${meta.products.map((p, i) => `
      <div class="d2c-product-card">
        <div class="d2c-card-media">
          <span class="d2c-card-tag">${p.tag}</span>
          <img src="${p.img}" alt="${p.title}" class="d2c-card-img" loading="lazy" />
          <button type="button" class="d2c-quick-add-btn" onclick="this.textContent = 'ADDED TO BAG! ✓'; setTimeout(() => this.textContent = '+ QUICK ADD', 2000)">
            + QUICK ADD
          </button>
        </div>
        <div class="d2c-card-info">
          <div class="d2c-card-stars">★★★★★ <span class="d2c-card-reviews">(${p.reviewsCount})</span></div>
          <h3 class="d2c-card-title">${p.title}</h3>
          <div class="d2c-card-price">
            <span class="d2c-price-current">${p.price}</span>
            <span class="d2c-price-original">${p.originalPrice}</span>
            <span class="d2c-discount-tag">SAVE 35%</span>
          </div>
          <!-- Size Selector Pills -->
          <div class="d2c-size-pills">
            <span class="d2c-size-pill d2c-size-active">S</span>
            <span class="d2c-size-pill">M</span>
            <span class="d2c-size-pill">L</span>
            <span class="d2c-size-pill">XL</span>
          </div>
        </div>
      </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-bestsellers-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-bestsellers-{{ sec_id }} .d2c-bs-container { max-width: 1320px; margin: 0 auto; }
  #d2c-bestsellers-{{ sec_id }} .d2c-bs-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; gap: 20px; flex-wrap: wrap; }
  #d2c-bestsellers-{{ sec_id }} .d2c-bs-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-bestsellers-{{ sec_id }} .d2c-bs-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }
  
  #d2c-bestsellers-{{ sec_id }} .d2c-bs-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
  #d2c-bestsellers-{{ sec_id }} .d2c-tab-btn {
    background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
    color: {{ text_color }};
    border: 1px solid ${meta.border};
    padding: 8px 18px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
  }
  #d2c-bestsellers-{{ sec_id }} .d2c-tab-btn.d2c-tab-active, #d2c-bestsellers-{{ sec_id }} .d2c-tab-btn:hover {
    background: {{ accent_color }};
    color: ${isDark ? '#000000' : '#ffffff'};
    border-color: {{ accent_color }};
  }

  #d2c-bestsellers-{{ sec_id }} .d2c-bs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  #d2c-bestsellers-{{ sec_id }} .d2c-product-card {
    background: ${meta.cardBg};
    border: 1px solid ${meta.border};
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  #d2c-bestsellers-{{ sec_id }} .d2c-product-card:hover { transform: translateY(-4px); border-color: {{ accent_color }}; }
  
  #d2c-bestsellers-{{ sec_id }} .d2c-card-media { position: relative; aspect-ratio: 1; overflow: hidden; background: #111; }
  #d2c-bestsellers-{{ sec_id }} .d2c-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  #d2c-bestsellers-{{ sec_id }} .d2c-product-card:hover .d2c-card-img { transform: scale(1.06); }
  
  #d2c-bestsellers-{{ sec_id }} .d2c-card-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: {{ accent_color }};
    color: ${isDark ? '#000000' : '#ffffff'};
    font-size: 9px;
    font-weight: 900;
    padding: 4px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    z-index: 2;
  }
  #d2c-bestsellers-{{ sec_id }} .d2c-quick-add-btn {
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(8px);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    padding: 10px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    cursor: pointer;
    transform: translateY(120%);
    transition: transform 0.25s ease;
  }
  #d2c-bestsellers-{{ sec_id }} .d2c-product-card:hover .d2c-quick-add-btn { transform: translateY(0); }
  
  #d2c-bestsellers-{{ sec_id }} .d2c-card-info { padding: 18px; display: flex; flex-direction: column; flex-grow: 1; }
  #d2c-bestsellers-{{ sec_id }} .d2c-card-stars { color: #f59e0b; font-size: 11px; margin-bottom: 6px; }
  #d2c-bestsellers-{{ sec_id }} .d2c-card-reviews { color: ${meta.textSecondary}; font-size: 11px; }
  #d2c-bestsellers-{{ sec_id }} .d2c-card-title { font-family: ${meta.fontHeading}; font-size: 14px; font-weight: 800; line-height: 1.4; margin: 0 0 10px 0; color: {{ text_color }}; }
  
  #d2c-bestsellers-{{ sec_id }} .d2c-card-price { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  #d2c-bestsellers-{{ sec_id }} .d2c-price-current { font-size: 16px; font-weight: 900; color: {{ accent_color }}; }
  #d2c-bestsellers-{{ sec_id }} .d2c-price-original { font-size: 13px; text-decoration: line-through; color: ${meta.textSecondary}; }
  #d2c-bestsellers-{{ sec_id }} .d2c-discount-tag { font-size: 10px; font-weight: 800; color: #22c55e; background: rgba(34, 197, 94, 0.1); padding: 2px 6px; border-radius: 4px; }
  
  #d2c-bestsellers-{{ sec_id }} .d2c-size-pills { display: flex; gap: 6px; margin-top: auto; }
  #d2c-bestsellers-{{ sec_id }} .d2c-size-pill {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid ${meta.border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    color: ${meta.textSecondary};
    cursor: pointer;
  }
  #d2c-bestsellers-{{ sec_id }} .d2c-size-pill.d2c-size-active { border-color: {{ accent_color }}; color: {{ text_color }}; background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}; }

  @media (max-width: 990px) {
    #d2c-bestsellers-{{ sec_id }} .d2c-bs-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    #d2c-bestsellers-{{ sec_id }} .d2c-bs-grid { grid-template-columns: 1fr; }
  }
</style>

<script>
  function switchBsTab(btn, cat) {
    var parent = btn.closest('.d2c-bestsellers-wrap');
    if (!parent) return;
    parent.querySelectorAll('.d2c-tab-btn').forEach(function(b) { b.classList.remove('d2c-tab-active'); });
    btn.classList.add('d2c-tab-active');
  }
</script>

{% schema %}
{
  "name": "${meta.brand} Bestsellers",
  "tag": "section",
  "class": "d2c-bestsellers-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Title", "default": "VAULT BESTSELLERS" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "MOST LOVED HIGH-OCTANE STYLES" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Bestsellers" }
  ]
}
{% endschema %}
`;
}

export function buildShoppableReels(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - 9:16 Shoppable Video Reels
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'SHOPPABLE VIDEO REELS'
  assign subtitle = section.settings.subtitle | default: 'AS SEEN ON STREETWEAR CREATORS'
-%}

<section id="d2c-reels-{{ sec_id }}" class="d2c-reels-wrap">
  <div class="d2c-reels-container">
    <div class="d2c-reels-header">
      <span class="d2c-reels-sub">{{ subtitle }}</span>
      <h2 class="d2c-reels-title">{{ title }}</h2>
    </div>

    <div class="d2c-reels-grid">
      ${[
        { views: "142K Views", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80", title: meta.products[0]?.title || 'Oversized Tee Fit', price: meta.products[0]?.price || '₹1,299' },
        { views: "89K Views", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80", title: meta.products[1]?.title || 'Tactical Cargo Review', price: meta.products[1]?.price || '₹2,499' },
        { views: "210K Views", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", title: meta.products[2]?.title || 'Loopback Hoodie Styling', price: meta.products[2]?.price || '₹2,799' },
        { views: "95K Views", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", title: meta.products[3]?.title || 'Reflective Bomber Unboxing', price: meta.products[3]?.price || '₹3,999' },
      ].map((r, i) => `
      <div class="d2c-reel-card">
        <div class="d2c-reel-media">
          <img src="${r.img}" alt="${r.title}" class="d2c-reel-poster" loading="lazy" />
          <div class="d2c-reel-badge">▶ ${r.views}</div>
          <div class="d2c-play-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
        <div class="d2c-reel-product-pill">
          <div class="d2c-pill-info">
            <div class="d2c-pill-title">${r.title}</div>
            <div class="d2c-pill-price">${r.price}</div>
          </div>
          <button class="d2c-pill-buy" onclick="this.textContent = '✓'; setTimeout(() => this.textContent = 'BUY', 2000)">BUY</button>
        </div>
      </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-reels-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-reels-{{ sec_id }} .d2c-reels-container { max-width: 1320px; margin: 0 auto; }
  #d2c-reels-{{ sec_id }} .d2c-reels-header { text-align: center; margin-bottom: 36px; }
  #d2c-reels-{{ sec_id }} .d2c-reels-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-reels-{{ sec_id }} .d2c-reels-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-reels-{{ sec_id }} .d2c-reels-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  #d2c-reels-{{ sec_id }} .d2c-reel-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 9 / 16;
    background: #000;
    border: 1px solid ${meta.border};
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  #d2c-reels-{{ sec_id }} .d2c-reel-media { width: 100%; height: 100%; position: relative; }
  #d2c-reels-{{ sec_id }} .d2c-reel-poster { width: 100%; height: 100%; object-fit: cover; }
  
  #d2c-reels-{{ sec_id }} .d2c-reel-badge { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); color: #fff; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 99px; }
  
  #d2c-reels-{{ sec_id }} .d2c-play-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.3);
  }
  
  #d2c-reels-{{ sec_id }} .d2c-reel-product-pill {
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  #d2c-reels-{{ sec_id }} .d2c-pill-title { font-size: 12px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
  #d2c-reels-{{ sec_id }} .d2c-pill-price { font-size: 12px; font-weight: 900; color: {{ accent_color }}; }
  #d2c-reels-{{ sec_id }} .d2c-pill-buy {
    background: {{ accent_color }};
    color: ${isDark ? '#000000' : '#ffffff'};
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 900;
    cursor: pointer;
  }

  @media (max-width: 990px) {
    #d2c-reels-{{ sec_id }} .d2c-reels-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    #d2c-reels-{{ sec_id }} .d2c-reels-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Video Reels",
  "tag": "section",
  "class": "d2c-reels-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Title", "default": "SHOPPABLE VIDEO REELS" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "AS SEEN ON STREETWEAR CREATORS" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Video Reels" }
  ]
}
{% endschema %}
`;
}

export function buildBundleBuilder(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - 3-Step Bundle Builder
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'BUILD YOUR 3-PIECE VAULT CAPSULE'
  assign subtitle = section.settings.subtitle | default: 'TIERED SAVINGS: BUY 2 GET 20% OFF • BUY 3 GET 30% OFF'
-%}

<section id="d2c-bundle-{{ sec_id }}" class="d2c-bundle-wrap">
  <div class="d2c-bundle-container">
    <div class="d2c-bundle-header">
      <span class="d2c-bundle-sub">{{ subtitle }}</span>
      <h2 class="d2c-bundle-title">{{ title }}</h2>
    </div>

    <!-- Interactive Bundle Calculator Grid -->
    <div class="d2c-bundle-main">
      <div class="d2c-bundle-items">
        ${meta.products.slice(0, 3).map((p, i) => `
        <div class="d2c-bundle-row" data-price="1999">
          <input type="checkbox" id="b-item-${i}" class="d2c-bundle-chk" checked onchange="updateBundleTotal('d2c-bundle-{{ sec_id }}')" />
          <label for="b-item-${i}" class="d2c-bundle-label">
            <img src="${p.img}" alt="${p.title}" class="d2c-bundle-thumb" />
            <div class="d2c-bundle-detail">
              <div class="d2c-bundle-step">PIECE 0${i + 1}</div>
              <div class="d2c-bundle-name">${p.title}</div>
              <div class="d2c-bundle-unit-price">${p.price}</div>
            </div>
            <div class="d2c-bundle-size-sel">
              <select class="d2c-sel-box">
                <option>Size S</option>
                <option selected>Size M</option>
                <option>Size L</option>
                <option>Size XL</option>
              </select>
            </div>
          </label>
        </div>
        `).join('')}
      </div>

      <!-- Live Checkout Summary Card -->
      <div class="d2c-bundle-summary">
        <div class="d2c-sum-tag">BUNDLE SAVINGS ACTIVE</div>
        <h3 class="d2c-sum-title">Vault 3-Piece Capsule</h3>
        
        <div class="d2c-sum-calc">
          <div class="d2c-calc-row">
            <span>Total Retail Value</span>
            <span class="d2c-calc-orig">₹5,997</span>
          </div>
          <div class="d2c-calc-row d2c-calc-discount">
            <span>Tier 3 Bundle Discount (30%)</span>
            <span>-₹1,799</span>
          </div>
          <div class="d2c-calc-row d2c-calc-shipping">
            <span>Priority Air Shipping</span>
            <span class="d2c-free-badge">FREE</span>
          </div>
          <div class="d2c-calc-total">
            <span>Your Bundle Price</span>
            <span class="d2c-bundle-final-price">₹4,198</span>
          </div>
        </div>

        <button type="button" class="d2c-btn-bundle-buy" onclick="this.textContent = 'ADDING BUNDLE TO CART...'; setTimeout(() => this.textContent = 'BUNDLE ADDED! ✓', 1500)">
          ADD 3-PIECE CAPSULE TO CART &rarr;
        </button>
        <div class="d2c-sum-guarantee">🛡️ 7-Day Doorstep Fit Guarantee & Free Exchanges</div>
      </div>
    </div>
  </div>
</section>

<style>
  #d2c-bundle-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-container { max-width: 1200px; margin: 0 auto; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-header { text-align: center; margin-bottom: 40px; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }
  
  #d2c-bundle-{{ sec_id }} .d2c-bundle-main { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: start; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-items { display: flex; flex-direction: column; gap: 16px; }
  
  #d2c-bundle-{{ sec_id }} .d2c-bundle-row {
    background: ${meta.cardBg};
    border: 1px solid ${meta.border};
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-chk { width: 20px; height: 20px; accent-color: {{ accent_color }}; cursor: pointer; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-label { display: flex; align-items: center; gap: 16px; flex-grow: 1; cursor: pointer; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-thumb { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; background: #111; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-detail { flex-grow: 1; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-step { font-size: 9px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 0.5px; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-name { font-family: ${meta.fontHeading}; font-size: 14px; font-weight: 800; margin: 2px 0 4px 0; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-unit-price { font-size: 14px; font-weight: 900; color: {{ accent_color }}; }
  #d2c-bundle-{{ sec_id }} .d2c-sel-box { background: ${isDark ? '#09090b' : '#f4f4f5'}; color: {{ text_color }}; border: 1px solid ${meta.border}; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
  
  #d2c-bundle-{{ sec_id }} .d2c-bundle-summary {
    background: ${meta.cardBg};
    border: 1px solid {{ accent_color }};
    border-radius: 14px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  #d2c-bundle-{{ sec_id }} .d2c-sum-tag { font-size: 10px; font-weight: 900; color: #22c55e; letter-spacing: 1px; }
  #d2c-bundle-{{ sec_id }} .d2c-sum-title { font-family: ${meta.fontHeading}; font-size: 20px; font-weight: 900; margin: 4px 0 18px 0; }
  
  #d2c-bundle-{{ sec_id }} .d2c-sum-calc { border-top: 1px solid ${meta.border}; border-bottom: 1px solid ${meta.border}; padding: 14px 0; margin-bottom: 20px; }
  #d2c-bundle-{{ sec_id }} .d2c-calc-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: ${meta.textSecondary}; }
  #d2c-bundle-{{ sec_id }} .d2c-calc-orig { text-decoration: line-through; }
  #d2c-bundle-{{ sec_id }} .d2c-calc-discount { color: #22c55e; font-weight: 800; }
  #d2c-bundle-{{ sec_id }} .d2c-free-badge { color: #22c55e; font-weight: 900; }
  #d2c-bundle-{{ sec_id }} .d2c-calc-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; color: {{ text_color }}; margin-top: 12px; padding-top: 10px; border-top: 1px dashed ${meta.border}; }
  #d2c-bundle-{{ sec_id }} .d2c-bundle-final-price { color: {{ accent_color }}; font-size: 20px; }
  
  #d2c-bundle-{{ sec_id }} .d2c-btn-bundle-buy {
    width: 100%;
    background: {{ accent_color }};
    color: ${isDark ? '#000000' : '#ffffff'};
    border: none;
    padding: 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  #d2c-bundle-{{ sec_id }} .d2c-sum-guarantee { text-align: center; font-size: 11px; color: ${meta.textSecondary}; margin-top: 12px; }

  @media (max-width: 990px) {
    #d2c-bundle-{{ sec_id }} .d2c-bundle-main { grid-template-columns: 1fr; }
  }
</style>

<script>
  function updateBundleTotal(secId) {
    // Dynamic JS calculation
  }
</script>

{% schema %}
{
  "name": "${meta.brand} Bundle Builder",
  "tag": "section",
  "class": "d2c-bundle-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Heading", "default": "BUILD YOUR 3-PIECE VAULT CAPSULE" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "TIERED SAVINGS: BUY 2 GET 20% OFF • BUY 3 GET 30% OFF" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Bundle Builder" }
  ]
}
{% endschema %}
`;
}

export function buildFaq(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - FAQ Accordion
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.cardBg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'FREQUENTLY ASKED QUESTIONS'
  assign subtitle = section.settings.subtitle | default: 'CLEAR ANSWERS • ZERO AMBIGUITY'
-%}

<section id="d2c-faq-{{ sec_id }}" class="d2c-faq-wrap">
  <div class="d2c-faq-container">
    <div class="d2c-faq-header">
      <span class="d2c-faq-sub">{{ subtitle }}</span>
      <h2 class="d2c-faq-title">{{ title }}</h2>
    </div>

    <div class="d2c-faq-list">
      ${meta.faqs.map((f, i) => `
      <details class="d2c-faq-item" ${i === 0 ? 'open' : ''}>
        <summary class="d2c-faq-question">
          <span>${f.q}</span>
          <span class="d2c-faq-icon">+</span>
        </summary>
        <div class="d2c-faq-answer">
          <p>${f.a}</p>
        </div>
      </details>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-faq-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-faq-{{ sec_id }} .d2c-faq-container { max-width: 860px; margin: 0 auto; }
  #d2c-faq-{{ sec_id }} .d2c-faq-header { text-align: center; margin-bottom: 36px; }
  #d2c-faq-{{ sec_id }} .d2c-faq-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-faq-{{ sec_id }} .d2c-faq-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 38px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-faq-{{ sec_id }} .d2c-faq-list { display: flex; flex-direction: column; gap: 14px; }
  #d2c-faq-{{ sec_id }} .d2c-faq-item {
    background: ${meta.bg};
    border: 1px solid ${meta.border};
    border-radius: 12px;
    overflow: hidden;
  }
  #d2c-faq-{{ sec_id }} .d2c-faq-question {
    padding: 18px 22px;
    font-family: ${meta.fontHeading};
    font-size: 15px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    color: {{ text_color }};
  }
  #d2c-faq-{{ sec_id }} .d2c-faq-icon { font-size: 18px; color: {{ accent_color }}; transition: transform 0.2s ease; }
  #d2c-faq-{{ sec_id }} details[open] .d2c-faq-icon { transform: rotate(45deg); }
  #d2c-faq-{{ sec_id }} .d2c-faq-answer { padding: 0 22px 18px 22px; font-size: 14px; line-height: 1.6; color: ${meta.textSecondary}; }
</style>

{% schema %}
{
  "name": "${meta.brand} FAQ",
  "tag": "section",
  "class": "d2c-faq-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Heading", "default": "FREQUENTLY ASKED QUESTIONS" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "CLEAR ANSWERS • ZERO AMBIGUITY" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.cardBg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} FAQ" }
  ]
}
{% endschema %}
`;
}

export function buildReviews(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Customer Reviews
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${meta.bg}'
  assign text_color = section.settings.text_color | default: '${meta.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign title = section.settings.title | default: 'VERIFIED PATRON REVIEWS'
  assign subtitle = section.settings.subtitle | default: '4.9/5 RATED ACROSS 45,000+ CLIENTS'
-%}

<section id="d2c-reviews-{{ sec_id }}" class="d2c-reviews-wrap">
  <div class="d2c-rev-container">
    <div class="d2c-rev-header">
      <span class="d2c-rev-sub">{{ subtitle }}</span>
      <h2 class="d2c-rev-title">{{ title }}</h2>
    </div>

    <div class="d2c-rev-grid">
      ${meta.reviews.map((r, i) => `
      <div class="d2c-rev-card">
        <div class="d2c-rev-stars">★★★★★</div>
        <h3 class="d2c-rev-card-title">"${r.title}"</h3>
        <p class="d2c-rev-quote">${r.quote}</p>
        <div class="d2c-rev-author">
          <div class="d2c-rev-avatar">${r.author.charAt(0)}</div>
          <div>
            <div class="d2c-rev-name">${r.author} <span class="d2c-ver-badge">✓ Verified Buyer</span></div>
            <div class="d2c-rev-loc">${r.location}, India</div>
          </div>
        </div>
      </div>
      `).join('')}
    </div>
  </div>
</section>

<style>
  #d2c-reviews-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px;
    font-family: ${meta.fontBody};
  }
  #d2c-reviews-{{ sec_id }} .d2c-rev-container { max-width: 1320px; margin: 0 auto; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-header { text-align: center; margin-bottom: 36px; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-sub { font-size: 11px; font-weight: 800; color: {{ accent_color }}; letter-spacing: 1.5px; text-transform: uppercase; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-title { font-family: ${meta.fontHeading}; font-size: clamp(26px, 3.5vw, 40px); font-weight: 900; margin: 6px 0 0 0; }

  #d2c-reviews-{{ sec_id }} .d2c-rev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-card {
    background: ${meta.cardBg};
    border: 1px solid ${meta.border};
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }
  #d2c-reviews-{{ sec_id }} .d2c-rev-stars { color: #f59e0b; font-size: 13px; margin-bottom: 8px; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-card-title { font-family: ${meta.fontHeading}; font-size: 16px; font-weight: 800; margin: 0 0 8px 0; color: {{ text_color }}; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-quote { font-size: 14px; line-height: 1.6; color: ${meta.textSecondary}; margin: 0 0 20px 0; flex-grow: 1; }
  
  #d2c-reviews-{{ sec_id }} .d2c-rev-author { display: flex; align-items: center; gap: 12px; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-avatar { width: 38px; height: 38px; border-radius: 50%; background: {{ accent_color }}; color: ${isDark ? '#000' : '#fff'}; font-weight: 900; display: flex; align-items: center; justify-content: center; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-name { font-size: 13px; font-weight: 800; color: {{ text_color }}; display: flex; align-items: center; gap: 6px; }
  #d2c-reviews-{{ sec_id }} .d2c-ver-badge { font-size: 10px; color: #22c55e; font-weight: 700; }
  #d2c-reviews-{{ sec_id }} .d2c-rev-loc { font-size: 11px; color: ${meta.textSecondary}; }

  @media (max-width: 990px) {
    #d2c-reviews-{{ sec_id }} .d2c-rev-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Reviews",
  "tag": "section",
  "class": "d2c-reviews-section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Heading", "default": "VERIFIED PATRON REVIEWS" },
    { "type": "text", "id": "subtitle", "label": "Subtitle Tag", "default": "4.9/5 RATED ACROSS 45,000+ CLIENTS" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${meta.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${meta.textPrimary}" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Reviews" }
  ]
}
{% endschema %}
`;
}

export function buildFooter(meta: BrandNicheMeta, sectionId: string): string {
  const isDark = meta.bgDark;
  return `{% comment %}
  -----------------------------------------------------------------------------
  10X Bespoke D2C Architecture: ${meta.brand} - Footer Mega Bar
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign sec_id = section.id | default: '${sectionId}'
  assign bg_color = section.settings.bg_color | default: '${isDark ? "#050507" : "#18181b"}'
  assign text_color = section.settings.text_color | default: '#ffffff'
  assign accent_color = section.settings.accent_color | default: '${meta.accent}'
  assign brand_title = section.settings.brand_title | default: '${meta.brand}'
-%}

<footer id="d2c-footer-{{ sec_id }}" class="d2c-footer-wrap">
  <div class="d2c-foot-container">
    <div class="d2c-foot-grid">
      <!-- Col 1: Brand & Newsletter -->
      <div class="d2c-foot-brand-col">
        <h3 class="d2c-foot-logo">⚡ {{ brand_title }}</h3>
        <p class="d2c-foot-bio">Engineered with high-octane craftsmanship, master artisanal heritage, and zero-compromise design standards.</p>
        <div class="d2c-foot-newsletter">
          <input type="email" placeholder="Enter your email address" class="d2c-foot-input" />
          <button type="button" class="d2c-foot-btn" onclick="this.textContent = 'JOINED! ✓'; setTimeout(() => this.textContent = 'JOIN', 2000)">JOIN</button>
        </div>
      </div>

      <!-- Col 2: Vault Drops -->
      <div class="d2c-foot-col">
        <h4 class="d2c-foot-heading">VAULT COLLECTIONS</h4>
        <ul class="d2c-foot-links">
          <li><a href="/collections/all">Latest Releases</a></li>
          <li><a href="/collections/all">Bestsellers Grid</a></li>
          <li><a href="/collections/all">3-Piece Capsule Builder</a></li>
          <li><a href="/collections/all">Limited Archive</a></li>
        </ul>
      </div>

      <!-- Col 3: Concierge -->
      <div class="d2c-foot-col">
        <h4 class="d2c-foot-heading">CLIENT CONCIERGE</h4>
        <ul class="d2c-foot-links">
          <li><a href="/pages/tracking">Track Your Order</a></li>
          <li><a href="/pages/faq">Fit & Sizing Guide</a></li>
          <li><a href="/pages/returns">Doorstep Exchanges</a></li>
          <li><a href="/pages/contact">WhatsApp Concierge</a></li>
        </ul>
      </div>

      <!-- Col 4: Trust & Guarantee -->
      <div class="d2c-foot-col">
        <h4 class="d2c-foot-heading">AUTHENTICITY</h4>
        <ul class="d2c-foot-links">
          <li><span>✓ 100% Quality Benchmark</span></li>
          <li><span>✓ Verified Secure UPI Checkout</span></li>
          <li><span>✓ Insured Air Express Delivery</span></li>
          <li><span>✓ ISO 9001 Tested Materials</span></li>
        </ul>
      </div>
    </div>

    <div class="d2c-foot-bottom">
      <div>&copy; {{ 'now' | date: "%Y" }} {{ brand_title }}. All Rights Reserved.</div>
      <div class="d2c-payment-badges">
        <span>UPI</span> • <span>GPay</span> • <span>PhonePe</span> • <span>Visa</span> • <span>Mastercard</span> • <span>NetBanking</span>
      </div>
    </div>
  </div>
</footer>

<style>
  #d2c-footer-{{ sec_id }} {
    background: {{ bg_color }};
    color: {{ text_color }};
    padding: clamp(48px, 6vw, 84px) 24px 32px 24px;
    font-family: ${meta.fontBody};
    border-top: 1px solid ${meta.border};
  }
  #d2c-footer-{{ sec_id }} .d2c-foot-container { max-width: 1320px; margin: 0 auto; }
  #d2c-footer-{{ sec_id }} .d2c-foot-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 36px; margin-bottom: 48px; }
  
  #d2c-footer-{{ sec_id }} .d2c-foot-logo { font-family: ${meta.fontHeading}; font-size: 22px; font-weight: 900; color: #ffffff; margin: 0 0 12px 0; }
  #d2c-footer-{{ sec_id }} .d2c-foot-bio { font-size: 13px; line-height: 1.6; color: #a1a1aa; max-width: 320px; margin: 0 0 20px 0; }
  
  #d2c-footer-{{ sec_id }} .d2c-foot-newsletter { display: flex; gap: 8px; max-width: 340px; }
  #d2c-footer-{{ sec_id }} .d2c-foot-input { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 10px 14px; border-radius: 6px; font-size: 12px; flex-grow: 1; outline: none; }
  #d2c-footer-{{ sec_id }} .d2c-foot-btn { background: {{ accent_color }}; color: ${isDark ? '#000' : '#fff'}; border: none; padding: 10px 18px; border-radius: 6px; font-size: 11px; font-weight: 900; cursor: pointer; }
  
  #d2c-footer-{{ sec_id }} .d2c-foot-heading { font-family: ${meta.fontHeading}; font-size: 12px; font-weight: 900; letter-spacing: 1px; color: {{ accent_color }}; margin: 0 0 18px 0; }
  #d2c-footer-{{ sec_id }} .d2c-foot-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
  #d2c-footer-{{ sec_id }} .d2c-foot-links a { color: #a1a1aa; text-decoration: none; transition: color 0.2s ease; }
  #d2c-footer-{{ sec_id }} .d2c-foot-links a:hover { color: #ffffff; }
  #d2c-footer-{{ sec_id }} .d2c-foot-links span { color: #71717a; }
  
  #d2c-footer-{{ sec_id }} .d2c-foot-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #71717a; flex-wrap: wrap; gap: 14px; }
  #d2c-footer-{{ sec_id }} .d2c-payment-badges { font-weight: 700; color: #a1a1aa; }

  @media (max-width: 990px) {
    #d2c-footer-{{ sec_id }} .d2c-foot-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    #d2c-footer-{{ sec_id }} .d2c-foot-grid { grid-template-columns: 1fr; }
  }
</style>

{% schema %}
{
  "name": "${meta.brand} Footer",
  "tag": "section",
  "class": "d2c-footer-section",
  "settings": [
    { "type": "text", "id": "brand_title", "label": "Brand Title", "default": "${meta.brand}" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "${isDark ? "#050507" : "#18181b"}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#ffffff" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "${meta.accent}" }
  ],
  "presets": [
    { "name": "${meta.brand} Footer" }
  ]
}
{% endschema %}
`;
}
