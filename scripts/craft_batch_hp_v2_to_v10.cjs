const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const templatesDir = 'i:\\converflow app\\dev-theme-peri\\templates';

// ----------------------------------------------------------------------
// 1. HP V2 — Gymshark Dark Mode High-Performance Activewear
// ----------------------------------------------------------------------
const hpv2Liquid = `{% comment %}
  HP V2 — Gymshark Dark Mode High-Performance Activewear D2C
  Aesthetics: Deep Charcoal (#111111), Pure Black (#000000), Electric Cyan (#00F0FF), Bold Condensed Typography, Dual Gender CTA.
{% endcomment %}

<style>
  .hpv2 {
    background-color: {{ section.settings.bg_color | default: '#111111' }};
    color: {{ section.settings.text_color | default: '#FFFFFF' }};
    font-family: 'Inter', sans-serif;
  }
  .hpv2__wrap { max-width: 1320px; margin: 0 auto; padding: 0 24px; }
  .hpv2__sec { padding: 64px 0; }

  /* 8. Hazard Marquee Ticker */
  .hpv2__marquee {
    background: #000000;
    color: #00F0FF;
    border-top: 2px solid #00F0FF;
    border-bottom: 2px solid #00F0FF;
    padding: 14px 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .hpv2__marquee-track { display: inline-block; animation: hpv2Marquee 18s linear infinite; }
  @keyframes hpv2Marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* 1. Hero Banner */
  .hpv2__hero {
    background: radial-gradient(circle at top right, #1F2937 0%, #000000 100%);
    border-radius: 24px;
    padding: 72px 48px;
    margin-bottom: 48px;
    border: 1px solid #1F2937;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hpv2__hero-badge {
    display: inline-block;
    background: #00F0FF;
    color: #000000;
    padding: 6px 18px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
    margin-bottom: 24px;
    text-transform: uppercase;
  }
  .hpv2__hero-title {
    font-size: 64px;
    font-weight: 900;
    line-height: 1.05;
    margin: 0 0 20px;
    text-transform: uppercase;
    letter-spacing: -1.5px;
  }
  @media (max-width: 768px) { .hpv2__hero-title { font-size: 36px; } }
  .hpv2__hero-sub {
    font-size: 18px;
    color: #9CA3AF;
    max-width: 720px;
    margin: 0 auto 36px;
    line-height: 1.6;
  }
  .hpv2__hero-ctas {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hpv2__btn {
    padding: 16px 40px;
    background: #00F0FF;
    color: #000000;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 900;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: transform 0.2s ease;
  }
  .hpv2__btn:hover { transform: scale(1.03); }
  .hpv2__btn--sec { background: transparent; color: #FFFFFF; border: 2px solid #FFFFFF; }

  /* 2. USP Bar */
  .hpv2__usp-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 56px;
  }
  @media (max-width: 900px) { .hpv2__usp-bar { grid-template-columns: repeat(2, 1fr); } }
  .hpv2__usp-card {
    background: #18181B;
    border: 1px solid #27272A;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
  }

  /* 3. Category Switcher (Men vs Women) */
  .hpv2__cat-tabs {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
  }
  .hpv2__tab-btn {
    padding: 12px 28px;
    background: #27272A;
    color: #FFFFFF;
    border: none;
    border-radius: 99px;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
  }
  .hpv2__tab-btn.active { background: #00F0FF; color: #000000; }

  /* 7. Comparison Table */
  .hpv2__comp-table {
    width: 100%;
    border-collapse: collapse;
    background: #18181B;
    border-radius: 16px;
    border: 1px solid #27272A;
    overflow: hidden;
    margin-top: 24px;
  }
  .hpv2__comp-table th, .hpv2__comp-table td {
    padding: 18px 24px;
    text-align: center;
    border-bottom: 1px solid #27272A;
  }
  .hpv2__comp-table th:first-child, .hpv2__comp-table td:first-child { text-align: left; }
  .hpv2__highlight { background: rgba(0, 240, 255, 0.1); color: #00F0FF; font-weight: 800; }
</style>

<div class="hpv2">
  <div class="hpv2__marquee">
    <div class="hpv2__marquee-track">
      ★ BE A VISIONARY ★ SWEAT-WICKING SEAMLESS TECH ★ 30-DAY FREE EXCHANGES ★ SAME DAY DISPATCH ★ BE A VISIONARY ★ SWEAT-WICKING SEAMLESS TECH ★
    </div>
  </div>

  <div class="hpv2__wrap">
    <!-- Hero Banner -->
    <div class="hpv2__hero">
      <span class="hpv2__hero-badge">NEW SEASON DROP LIVE</span>
      <h1 class="hpv2__hero-title">{{ section.settings.hero_title | default: 'ENGINEERED FOR UNSTOPPABLE ATHLETES' }}</h1>
      <p class="hpv2__hero-sub">{{ section.settings.hero_sub | default: '4-way stretch seamless activewear built to withstand your heaviest workouts.' }}</p>
      <div class="hpv2__hero-ctas">
        <a href="/collections/all" class="hpv2__btn">SHOP MEN &rarr;</a>
        <a href="/collections/all" class="hpv2__btn hpv2__btn--sec">SHOP WOMEN &rarr;</a>
      </div>
    </div>

    <!-- USP Bar -->
    <div class="hpv2__usp-bar">
      <div class="hpv2__usp-card">
        <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
        <h4 style="font-size: 15px; font-weight: 800; margin: 0;">Sweat-Wicking Tech</h4>
        <p style="font-size: 12px; color: #9CA3AF; margin: 4px 0 0;">Keeps you dry all workout</p>
      </div>
      <div class="hpv2__usp-card">
        <div style="font-size: 28px; margin-bottom: 8px;">🏋️</div>
        <h4 style="font-size: 15px; font-weight: 800; margin: 0;">100% Squat Proof</h4>
        <p style="font-size: 12px; color: #9CA3AF; margin: 4px 0 0;">Zero transparency fabric</p>
      </div>
      <div class="hpv2__usp-card">
        <div style="font-size: 28px; margin-bottom: 8px;">🚀</div>
        <h4 style="font-size: 15px; font-weight: 800; margin: 0;">Same Day Shipping</h4>
        <p style="font-size: 12px; color: #9CA3AF; margin: 4px 0 0;">Orders placed before 2PM</p>
      </div>
      <div class="hpv2__usp-card">
        <div style="font-size: 28px; margin-bottom: 8px;">🔄</div>
        <h4 style="font-size: 15px; font-weight: 800; margin: 0;">Hassle Free Exchanges</h4>
        <p style="font-size: 12px; color: #9CA3AF; margin: 4px 0 0;">30 days size replacement</p>
      </div>
    </div>

    <!-- Category Showcase Tabs -->
    <div class="hpv2__sec">
      <h2 style="font-size: 32px; font-weight: 900; text-align: center; margin: 0 0 16px; text-transform: uppercase;">GEAR UP BY CATEGORY</h2>
      <div class="hpv2__cat-tabs">
        <button class="hpv2__tab-btn active">MEN'S ACTIVEWEAR</button>
        <button class="hpv2__tab-btn">WOMEN'S ACTIVEWEAR</button>
        <button class="hpv2__tab-btn">GYM ACCESSORIES</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
        <div style="height: 280px; background: #18181B; border-radius: 16px; border: 1px solid #27272A; padding: 24px; display: flex; flex-direction: column; justify-content: flex-end;">
          <h3 style="font-size: 24px; font-weight: 900; margin: 0;">SEAMLESS HOODIES</h3>
          <p style="font-size: 13px; color: #00F0FF; font-weight: 700; margin: 4px 0 0;">EXPLORE NOW &rarr;</p>
        </div>
        <div style="height: 280px; background: #18181B; border-radius: 16px; border: 1px solid #27272A; padding: 24px; display: flex; flex-direction: column; justify-content: flex-end;">
          <h3 style="font-size: 24px; font-weight: 900; margin: 0;">HIGH IMPACT SHORTS</h3>
          <p style="font-size: 13px; color: #00F0FF; font-weight: 700; margin: 4px 0 0;">EXPLORE NOW &rarr;</p>
        </div>
        <div style="height: 280px; background: #18181B; border-radius: 16px; border: 1px solid #27272A; padding: 24px; display: flex; flex-direction: column; justify-content: flex-end;">
          <h3 style="font-size: 24px; font-weight: 900; margin: 0;">LIFTING BELTS & STRAPS</h3>
          <p style="font-size: 13px; color: #00F0FF; font-weight: 700; margin: 4px 0 0;">EXPLORE NOW &rarr;</p>
        </div>
      </div>
    </div>

    <!-- Featured Product Grid -->
    <div class="hpv2__sec">
      <h2 style="font-size: 32px; font-weight: 900; margin: 0 0 24px; text-transform: uppercase;">BESTSELLING PERFORMANCE DROPS</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
        {% assign target_coll = collections[section.settings.collection] %}
        {% if target_coll != blank and target_coll.products.size > 0 %}
          {% for product in target_coll.products limit: 4 %}
            {% render 'card-v2', product: product %}
          {% endfor %}
        {% else %}
          {% for i in (1..4) %}
            {% render 'card-v2', product: nil %}
          {% endfor %}
        {% endif %}
      </div>
    </div>

    <!-- Comparison Table -->
    <div class="hpv2__sec">
      <h2 style="font-size: 32px; font-weight: 900; text-align: center; margin: 0 0 24px; text-transform: uppercase;">THE ACTIVEWEAR MATRIX</h2>
      <table class="hpv2__comp-table">
        <thead>
          <tr>
            <th>FABRIC TECHNOLOGY</th>
            <th class="hpv2__highlight">GYMSHARK ACTIVEWEAR</th>
            <th>GENERIC GYM WEAR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4-Way Stretch Seamless Knit</td>
            <td class="hpv2__highlight">✓ YES (Zero Chafing)</td>
            <td>❌ Basic 2-Way Cotton</td>
          </tr>
          <tr>
            <td>Sweat-Wicking Ventilation</td>
            <td class="hpv2__highlight">✓ Engineered Mesh Zones</td>
            <td>❌ Holds Sweat & Odor</td>
          </tr>
          <tr>
            <td>Shape Retention After 50+ Washes</td>
            <td class="hpv2__highlight">✓ Guaranteed No Sagging</td>
            <td>❌ Shrinks & Fades</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</div>

{% schema %}
{
  "name": "HP V2 — Gymshark Active",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "hero_title", "label": "Hero Title", "default": "ENGINEERED FOR UNSTOPPABLE ATHLETES" },
    { "type": "text", "id": "hero_sub", "label": "Hero Subtitle", "default": "4-way stretch seamless activewear built to withstand your heaviest workouts." },
    { "type": "collection", "id": "collection", "label": "Featured Collection" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#111111" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#FFFFFF" }
  ],
  "presets": [{ "name": "HP V2 — Gymshark Active" }]
}
{% endschema %}
`;

fs.writeFileSync(path.join(sectionsDir, 'hp-v2.liquid'), hpv2Liquid, 'utf8');
fs.writeFileSync(path.join(templatesDir, 'page.hp-v2.json'), JSON.stringify({ sections: { main: { type: "hp-v2" } }, order: ["main"] }, null, 2), 'utf8');

// ----------------------------------------------------------------------
// 2. HP V3 — Aesop Editorial Botanical Apothecary
// ----------------------------------------------------------------------
const hpv3Liquid = `{% comment %}
  HP V3 — Aesop Editorial Botanical Apothecary D2C
  Aesthetics: Muted Sage (#2F3E30), Warm Sand (#F4F1EA), Dark Charcoal (#1C241B), Playfair Serif Typography.
{% endcomment %}

<style>
  .hpv3 {
    background-color: {{ section.settings.bg_color | default: '#F4F1EA' }};
    color: {{ section.settings.text_color | default: '#1C241B' }};
    font-family: 'Playfair Display', Georgia, serif;
  }
  .hpv3__wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .hpv3__sec { padding: 72px 0; }

  .hpv3__hero {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 56px;
    align-items: center;
    padding: 64px 0;
    border-bottom: 1px solid #D1CDC4;
  }
  @media (max-width: 900px) { .hpv3__hero { grid-template-columns: 1fr; text-align: center; } }

  .hpv3__hero-quote {
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #556052;
    margin-bottom: 24px;
  }
  .hpv3__hero-title {
    font-size: 52px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 24px;
    color: #1C241B;
  }
  .hpv3__hero-sub {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #4A5246;
    line-height: 1.8;
    margin: 0 0 36px;
  }
  .hpv3__cta {
    display: inline-block;
    padding: 16px 36px;
    background: #2F3E30;
    color: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  .hpv3__cta:hover { opacity: 0.9; }

  .hpv3__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 32px;
  }
  @media (max-width: 768px) { .hpv3__grid { grid-template-columns: 1fr; } }
</style>

<div class="hpv3">
  <div class="hpv3__wrap">
    <div class="hpv3__hero">
      <div>
        <div class="hpv3__hero-quote">Formulations for Skin & Senses</div>
        <h1 class="hpv3__hero-title">{{ section.settings.hero_title | default: 'Intelligent Botanical Formulations Crafted with Purpose' }}</h1>
        <p class="hpv3__hero-sub">{{ section.settings.hero_sub | default: 'Meticulously formulated plant extracts and lab-verified actives created to nurture your skin barrier.' }}</p>
        <a href="/collections/all" class="hpv3__cta">EXPLORE FORMULATION RANGE &rarr;</a>
      </div>
      <div style="aspect-ratio: 3/4; background: #E2DDD3; border-radius: 4px;"></div>
    </div>

    <!-- Featured Products -->
    <div class="hpv3__sec">
      <h2 style="font-size: 36px; font-weight: 400; text-align: center; margin: 0 0 12px;">Essential Formulations</h2>
      <p style="font-family: 'Inter', sans-serif; font-size: 15px; color: #556052; text-align: center; margin: 0 0 40px;">Selected treatments recommended for daily skin nourishment.</p>

      <div class="hpv3__grid">
        {% assign target_coll = collections[section.settings.collection] %}
        {% if target_coll != blank and target_coll.products.size > 0 %}
          {% for product in target_coll.products limit: 3 %}
            {% render 'card-v3', product: product %}
          {% endfor %}
        {% else %}
          {% for i in (1..3) %}
            {% render 'card-v3', product: nil %}
          {% endfor %}
        {% endif %}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "HP V3 — Aesop Apothecary",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "hero_title", "label": "Hero Title", "default": "Intelligent Botanical Formulations Crafted with Purpose" },
    { "type": "text", "id": "hero_sub", "label": "Hero Subtitle", "default": "Meticulously formulated plant extracts created to nurture your skin barrier." },
    { "type": "collection", "id": "collection", "label": "Featured Collection" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F4F1EA" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1C241B" }
  ],
  "presets": [{ "name": "HP V3 — Aesop Apothecary" }]
}
{% endschema %}
`;

fs.writeFileSync(path.join(sectionsDir, 'hp-v3.liquid'), hpv3Liquid, 'utf8');
fs.writeFileSync(path.join(templatesDir, 'page.hp-v3.json'), JSON.stringify({ sections: { main: { type: "hp-v3" } }, order: ["main"] }, null, 2), 'utf8');

console.log("✅ Successfully hand-crafted hp-v2.liquid and hp-v3.liquid!");

// ----------------------------------------------------------------------
// 3. HP V4 — Cyberpunk Y2K Neon Streetwear D2C
// ----------------------------------------------------------------------
const hpv4Liquid = `{% comment %}
  HP V4 — Cyberpunk Y2K Neon Streetwear D2C
  Aesthetics: Dark Matrix (#0D0D12), Neon Pink (#FF0055), Neon Cyan (#00F0FF), CRT Scanlines, Drop Countdown Timer.
{% endcomment %}

<style>
  .hpv4 {
    background-color: {{ section.settings.bg_color | default: '#0D0D12' }};
    color: {{ section.settings.text_color | default: '#FFFFFF' }};
    font-family: 'Courier New', monospace;
  }
  .hpv4__wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
  .hpv4__sec { padding: 64px 0; }

  .hpv4__marquee {
    background: #FF0055;
    color: #000000;
    padding: 12px 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2px;
  }
  .hpv4__marquee-track { display: inline-block; animation: hpv4Marquee 15s linear infinite; }
  @keyframes hpv4Marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  .hpv4__hero {
    background: #12121A;
    border: 2px solid #00F0FF;
    border-radius: 16px;
    padding: 64px 40px;
    margin-bottom: 48px;
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
    text-align: center;
  }
  .hpv4__hero-badge {
    display: inline-block;
    background: rgba(255, 0, 85, 0.2);
    color: #FF0055;
    border: 1px solid #FF0055;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 20px;
  }
  .hpv4__hero-title {
    font-size: 56px;
    font-weight: 900;
    color: #00F0FF;
    margin: 0 0 16px;
    text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  }
  @media (max-width: 768px) { .hpv4__hero-title { font-size: 32px; } }

  .hpv4__timer {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin: 24px 0 32px;
  }
  .hpv4__timer-box {
    background: #000000;
    border: 1px solid #FF0055;
    padding: 12px 20px;
    border-radius: 8px;
    text-align: center;
  }

  .hpv4__btn {
    display: inline-block;
    padding: 16px 40px;
    background: #FF0055;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
    letter-spacing: 1px;
    box-shadow: 0 0 20px rgba(255, 0, 85, 0.5);
  }
</style>

<div class="hpv4">
  <div class="hpv4__marquee">
    <div class="hpv4__marquee-track">
      [SYSTEM ALERT] LIMITED Y2K DROP LIVE ★ 500 PIECES WORLDWIDE ★ FREE EXPRESS GLOBAL SHIPPING ★ [SYSTEM ALERT]
    </div>
  </div>

  <div class="hpv4__wrap">
    <div class="hpv4__hero">
      <span class="hpv4__hero-badge">[LIMITED CYBER DROP v4.0]</span>
      <h1 class="hpv4__hero-title">{{ section.settings.hero_title | default: 'FUTURE STREETWEAR UNLOCKED' }}</h1>
      <p style="color: #A1A1AA; max-width: 600px; margin: 0 auto 24px;">Heavyweight 450GSM cyberpunk hoodies & reflective tactical cargowear.</p>

      <div class="hpv4__timer">
        <div class="hpv4__timer-box"><div style="font-size: 24px; font-weight: 900; color: #FF0055;">04</div><div style="font-size: 10px; color: #71717A;">HOURS</div></div>
        <div class="hpv4__timer-box"><div style="font-size: 24px; font-weight: 900; color: #FF0055;">42</div><div style="font-size: 10px; color: #71717A;">MINS</div></div>
        <div class="hpv4__timer-box"><div style="font-size: 24px; font-weight: 900; color: #FF0055;">18</div><div style="font-size: 10px; color: #71717A;">SECS</div></div>
      </div>

      <a href="/collections/all" class="hpv4__btn">ENTER DROP &rarr;</a>
    </div>

    <!-- Featured Product Grid -->
    <div class="hpv4__sec">
      <h2 style="font-size: 28px; font-weight: 900; color: #00F0FF; margin-bottom: 24px;">// ACTIVE CYBER DROPS</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
        {% assign target_coll = collections[section.settings.collection] %}
        {% if target_coll != blank and target_coll.products.size > 0 %}
          {% for product in target_coll.products limit: 4 %}
            {% render 'card-v4', product: product %}
          {% endfor %}
        {% else %}
          {% for i in (1..4) %}
            {% render 'card-v4', product: nil %}
          {% endfor %}
        {% endif %}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "HP V4 — Cyberpunk Y2K",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "hero_title", "label": "Hero Title", "default": "FUTURE STREETWEAR UNLOCKED" },
    { "type": "collection", "id": "collection", "label": "Featured Collection" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#0D0D12" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#FFFFFF" }
  ],
  "presets": [{ "name": "HP V4 — Cyberpunk Y2K" }]
}
{% endschema %}
`;

fs.writeFileSync(path.join(sectionsDir, 'hp-v4.liquid'), hpv4Liquid, 'utf8');
fs.writeFileSync(path.join(templatesDir, 'page.hp-v4.json'), JSON.stringify({ sections: { main: { type: "hp-v4" } }, order: ["main"] }, null, 2), 'utf8');

// ----------------------------------------------------------------------
// 4. HP V5 — Off-White High Fashion Stark Monochrome D2C
// ----------------------------------------------------------------------
const hpv5Liquid = `{% comment %}
  HP V5 — Off-White High Fashion Stark Monochrome D2C
  Aesthetics: Pure White (#FFFFFF), Deep Black (#000000), Industrial Quotation Marks, Minimalist Helvetica Grid.
{% endcomment %}

<style>
  .hpv5 {
    background-color: {{ section.settings.bg_color | default: '#FFFFFF' }};
    color: {{ section.settings.text_color | default: '#000000' }};
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .hpv5__wrap { max-width: 1360px; margin: 0 auto; padding: 0 24px; }
  .hpv5__sec { padding: 64px 0; border-top: 2px solid #000000; }

  .hpv5__hero {
    padding: 80px 0;
    text-align: left;
    border-bottom: 2px solid #000000;
  }
  .hpv5__hero-title {
    font-size: 72px;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -2px;
    text-transform: uppercase;
    margin: 0 0 24px;
  }
  @media (max-width: 768px) { .hpv5__hero-title { font-size: 40px; } }

  .hpv5__btn {
    display: inline-block;
    padding: 18px 48px;
    background: #000000;
    color: #FFFFFF;
    font-weight: 900;
    text-decoration: none;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>

<div class="hpv5">
  <div class="hpv5__wrap">
    <div class="hpv5__hero">
      <div style="font-size: 13px; font-weight: 900; letter-spacing: 3px; margin-bottom: 16px;">"AUTUMN ARCHIVE"</div>
      <h1 class="hpv5__hero-title">{{ section.settings.hero_title | default: '"HIGH FASHION UNFILTERED"' }}</h1>
      <p style="font-size: 16px; font-weight: 600; max-width: 500px; margin: 0 0 32px; color: #444444;">Tailored Italian wool coats, structured raw denim, and avant-garde leather boots.</p>
      <a href="/collections/all" class="hpv5__btn">"SHOP COLLECTION" &rarr;</a>
    </div>

    <!-- Featured Product Grid -->
    <div class="hpv5__sec">
      <div style="font-size: 13px; font-weight: 900; letter-spacing: 3px; margin-bottom: 24px;">"FEATURED APPAREL"</div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
        {% assign target_coll = collections[section.settings.collection] %}
        {% if target_coll != blank and target_coll.products.size > 0 %}
          {% for product in target_coll.products limit: 4 %}
            {% render 'card-v5', product: product %}
          {% endfor %}
        {% else %}
          {% for i in (1..4) %}
            {% render 'card-v5', product: nil %}
          {% endfor %}
        {% endif %}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "HP V5 — Off-White Fashion",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "hero_title", "label": "Hero Title", "default": "\"HIGH FASHION UNFILTERED\"" },
    { "type": "collection", "id": "collection", "label": "Featured Collection" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#000000" }
  ],
  "presets": [{ "name": "HP V5 — Off-White Fashion" }]
}
{% endschema %}
`;

fs.writeFileSync(path.join(sectionsDir, 'hp-v5.liquid'), hpv5Liquid, 'utf8');
fs.writeFileSync(path.join(templatesDir, 'page.hp-v5.json'), JSON.stringify({ sections: { main: { type: "hp-v5" } }, order: ["main"] }, null, 2), 'utf8');

console.log("✅ Successfully hand-crafted hp-v4.liquid and hp-v5.liquid!");

