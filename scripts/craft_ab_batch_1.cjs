const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';

console.log('🚀 Hand-Crafting Announcement Bar Batch 1: ab-v1.liquid to ab-v10.liquid (10 Unique D2C Styles)...');

// 1. ab-v1.liquid (Glossier Glassmorphic Soft Pink)
const abv1 = `{% comment %}
  AB V1 — Glossier Soft Pink Glassmorphic Pill Announcement Bar
{% endcomment %}
<style>
  .abv1 {
    background: {{ section.settings.bg_color | default: '#FFF5F5' }};
    color: {{ section.settings.text_color | default: '#1F2937' }};
    font-family: 'Inter', sans-serif;
    font-size: {{ section.settings.font_size | default: 13 }}px;
    height: {{ section.settings.bar_height | default: 42 }}px;
    display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid rgba(61, 154, 152, 0.15);
    backdrop-filter: blur(8px); position: relative; z-index: 100;
  }
  .abv1__wrap { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .abv1__slider { flex-grow: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .abv1__item { display: none; align-items: center; gap: 8px; text-decoration: none; color: inherit; font-weight: 600; }
  .abv1__item.active { display: flex; animation: abv1Fade 0.4s ease; }
  @keyframes abv1Fade { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
  .abv1__chip { background: {{ section.settings.accent_color | default: '#3D9A98' }}; color: #FFF; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; cursor: pointer; }
  .abv1__close { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.6; }
</style>
<div class="abv1" id="ABV1-{{ section.id }}">
  <div class="abv1__wrap">
    {% if section.settings.promo_code != blank %}
      <div class="abv1__chip" onclick="navigator.clipboard.writeText('{{ section.settings.promo_code }}'); alert('Copied {{ section.settings.promo_code }}!');">
        CODE: {{ section.settings.promo_code }} 📋
      </div>
    {% endif %}
    <div class="abv1__slider">
      {% for block in section.blocks %}
        <a href="{{ block.settings.link | default: '#' }}" class="abv1__item {% if forloop.first %}active{% endif %}" {{ block.shopify_attributes }}>
          <span>{{ block.settings.text }}</span>
        </a>
      {% endfor %}
    </div>
    {% if section.settings.show_close %}
      <button class="abv1__close" onclick="document.getElementById('ABV1-{{ section.id }}').style.display='none';">✕</button>
    {% endif %}
  </div>
</div>
<script>
  (function() {
    const items = document.querySelectorAll('#ABV1-{{ section.id }} .abv1__item');
    if (items.length > 1) {
      let idx = 0;
      setInterval(() => { items[idx].classList.remove('active'); idx = (idx + 1) % items.length; items[idx].classList.add('active'); }, {{ section.settings.rotate_speed | default: 4 }} * 1000);
    }
  })();
</script>
{% schema %}
{
  "name": "AB V1 — Glossier",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFF5F5" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "#3D9A98" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1F2937" },
    { "type": "text", "id": "promo_code", "label": "Promo Code", "default": "GLOW20" },
    { "type": "checkbox", "id": "show_close", "label": "Show Close Button", "default": true }
  ],
  "blocks": [{ "type": "message", "name": "Message", "settings": [{ "type": "text", "id": "text", "label": "Text", "default": "🌸 Free Express Shipping on Orders Over ₹999!" }, { "type": "url", "id": "link", "label": "Link" }] }],
  "presets": [{ "name": "AB V1 — Glossier", "blocks": [{ "type": "message" }] }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v1.liquid'), abv1, 'utf8');

// 2. ab-v2.liquid (Gymshark Hazard Marquee)
const abv2 = `{% comment %}
  AB V2 — Gymshark High-Performance Hazard Bar
{% endcomment %}
<style>
  .abv2 {
    background: {{ section.settings.bg_color | default: '#000000' }};
    color: {{ section.settings.text_color | default: '#00F0FF' }};
    font-family: 'Inter', sans-serif; font-weight: 900;
    height: {{ section.settings.bar_height | default: 42 }}px;
    overflow: hidden; white-space: nowrap; display: flex; align-items: center;
    border-top: 1px solid #00F0FF; border-bottom: 1px solid #00F0FF;
  }
  .abv2__track { display: inline-block; animation: abv2Ticker 18s linear infinite; font-size: 13px; letter-spacing: 2px; }
  @keyframes abv2Ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>
<div class="abv2">
  <div class="abv2__track">
    ★ BE A VISIONARY ★ SWEAT-WICKING SEAMLESS ACTIVEWEAR ★ FREE EXCHANGES & RETURNS ★ SAME DAY DISPATCH ★ BE A VISIONARY ★ SWEAT-WICKING SEAMLESS ACTIVEWEAR ★
  </div>
</div>
{% schema %}
{
  "name": "AB V2 — Gymshark",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#000000" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#00F0FF" }
  ],
  "presets": [{ "name": "AB V2 — Gymshark" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v2.liquid'), abv2, 'utf8');

// 3. ab-v3.liquid (Aesop Editorial Serif)
const abv3 = `{% comment %}
  AB V3 — Aesop Editorial Botanical Apothecary Bar
{% endcomment %}
<style>
  .abv3 {
    background: {{ section.settings.bg_color | default: '#F4F1EA' }};
    color: {{ section.settings.text_color | default: '#1C241B' }};
    font-family: 'Playfair Display', Georgia, serif;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #D1CDC4; font-size: 13px; font-style: italic;
  }
</style>
<div class="abv3">
  <span>"Formulations created with purpose — Complimentary botanical sample with every order."</span>
</div>
{% schema %}
{
  "name": "AB V3 — Aesop",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F4F1EA" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1C241B" }
  ],
  "presets": [{ "name": "AB V3 — Aesop" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v3.liquid'), abv3, 'utf8');

// 4. ab-v4.liquid (Cyberpunk Y2K Neon)
const abv4 = `{% comment %}
  AB V4 — Cyberpunk Y2K Neon Terminal Bar
{% endcomment %}
<style>
  .abv4 {
    background: #0D0D12; color: #FF0055;
    font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; border-bottom: 2px solid #FF0055; box-shadow: 0 0 15px rgba(255, 0, 85, 0.4);
  }
</style>
<div class="abv4">
  <span>[SYSTEM ALERT] LIMITED Y2K DROP LIVE // 500 UNITS WORLDWIDE</span>
  <span style="background: #FF0055; color: #000; padding: 2px 6px; border-radius: 4px;">DROP CODE: CYBER25</span>
</div>
{% schema %}
{
  "name": "AB V4 — Cyberpunk Y2K",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#0D0D12" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#FF0055" }
  ],
  "presets": [{ "name": "AB V4 — Cyberpunk Y2K" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v4.liquid'), abv4, 'utf8');

// 5. ab-v5.liquid (Off-White Stark Monochrome)
const abv5 = `{% comment %}
  AB V5 — Off-White High Fashion Stark Monochrome Bar
{% endcomment %}
<style>
  .abv5 {
    background: #FFFFFF; color: #000000;
    font-family: 'Helvetica Neue', Helvetica, sans-serif; font-size: 13px; font-weight: 900;
    letter-spacing: 2px; text-transform: uppercase; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #000000;
  }
</style>
<div class="abv5">
  <span>"AUTUMN ARCHIVE" — FREE EXPRESS WORLDWIDE SHIPPING ON ORDERS OVER $200</span>
</div>
{% schema %}
{
  "name": "AB V5 — Off-White",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#000000" }
  ],
  "presets": [{ "name": "AB V5 — Off-White" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v5.liquid'), abv5, 'utf8');

// 6. ab-v6.liquid (Nordic Minimal Warm Beige)
const abv6 = `{% comment %}
  AB V6 — Nordic Minimal Warm Beige Bar
{% endcomment %}
<style>
  .abv6 {
    background: #F7FAFC; color: #2D3748;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    height: 38px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #E2E8F0; letter-spacing: 0.5px;
  }
</style>
<div class="abv6">
  <span>Sustainable Nordic Living — 10% off your first organic bedding order</span>
</div>
{% schema %}
{
  "name": "AB V6 — Nordic Minimal",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#2D3748" }
  ],
  "presets": [{ "name": "AB V6 — Nordic Minimal" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v6.liquid'), abv6, 'utf8');

// 7. ab-v7.liquid (Liquid Death Gold Foil Punk)
const abv7 = `{% comment %}
  AB V7 — Liquid Death Gold Foil Punk Bar
{% endcomment %}
<style>
  .abv7 {
    background: #000000; color: #FFD700;
    font-family: 'Impact', sans-serif; font-size: 15px; letter-spacing: 2px;
    height: 44px; display: flex; align-items: center; justify-content: center;
    border-bottom: 3px solid #FFD700; text-transform: uppercase;
  }
</style>
<div class="abv7">
  <span>💀 MURDER YOUR THIRST — 6 PACK MOUNTAIN WATER BUNDLE DISCOUNT 💀</span>
</div>
{% schema %}
{
  "name": "AB V7 — Liquid Death",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#000000" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#FFD700" }
  ],
  "presets": [{ "name": "AB V7 — Liquid Death" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v7.liquid'), abv7, 'utf8');

// 8. ab-v8.liquid (Apple Tech Glass)
const abv8 = `{% comment %}
  AB V8 — Apple Tech Glass Minimalist Bar
{% endcomment %}
<style>
  .abv8 {
    background: rgba(29, 29, 31, 0.9); color: #F5F5F7;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 500;
    height: 40px; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
<div class="abv8">
  <span>MagSafe Compatible Tech Accessories — Save 15% when you bundle 2 or more.</span>
</div>
{% schema %}
{
  "name": "AB V8 — Apple Tech",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#1D1D1F" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#F5F5F7" }
  ],
  "presets": [{ "name": "AB V8 — Apple Tech" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v8.liquid'), abv8, 'utf8');

// 9. ab-v9.liquid (Retro Craft Brewery Amber)
const abv9 = `{% comment %}
  AB V9 — Retro Vintage Craft Brewery Amber Bar
{% endcomment %}
<style>
  .abv9 {
    background: #78350F; color: #FEF3C7;
    font-family: 'Georgia', serif; font-size: 13px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px dashed #B45309;
  }
</style>
<div class="abv9">
  <span>🍺 Craft Malt Beer Bundles — Buy 2 Cases Get 1 Free + Free Cold Delivery</span>
</div>
{% schema %}
{
  "name": "AB V9 — Craft Brewery",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#78350F" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#FEF3C7" }
  ],
  "presets": [{ "name": "AB V9 — Craft Brewery" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v9.liquid'), abv9, 'utf8');

// 10. ab-v10.liquid (Organic Botanical Forest Eco)
const abv10 = `{% comment %}
  AB V10 — Organic Botanical Forest Eco Bar
{% endcomment %}
<style>
  .abv10 {
    background: #166534; color: #F0FDF4;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    gap: 8px; border-bottom: 1px solid #15803D;
  }
</style>
<div class="abv10">
  <span>🌿 100% Certified Organic & Plastic-Free Packaging — Plant 1 Tree per Order</span>
</div>
{% schema %}
{
  "name": "AB V10 — Forest Eco",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#166534" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#F0FDF4" }
  ],
  "presets": [{ "name": "AB V10 — Forest Eco" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v10.liquid'), abv10, 'utf8');

console.log('✅ SUCCESS! Hand-crafted Announcement Bar Batch 1 (ab-v1.liquid to ab-v10.liquid)!');
