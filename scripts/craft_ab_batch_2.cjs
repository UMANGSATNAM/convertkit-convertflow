const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';

console.log('🚀 Hand-Crafting Announcement Bar Batch 2: ab-v11.liquid to ab-v20.liquid...');

// 11. ab-v11.liquid (Neo-Brutalist Y2K Hazard Strip)
const abv11 = `{% comment %}
  AB V11 — Neo-Brutalist Y2K Hazard Strip
{% endcomment %}
<style>
  .abv11 {
    background: #FFE600; color: #000000;
    font-family: 'Arial Black', sans-serif; font-size: 13px; font-weight: 900;
    height: 44px; display: flex; align-items: center; justify-content: center;
    border-bottom: 3px solid #000000; text-transform: uppercase; letter-spacing: 1px;
  }
</style>
<div class="abv11">
  <span>⚡ RAW DESIGN DROPS — FLAT ₹ 500 OFF WITH CODE: BRUTAL ⚡</span>
</div>
{% schema %}
{
  "name": "AB V11 — Neo Brutal",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFE600" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#000000" }
  ],
  "presets": [{ "name": "AB V11 — Neo Brutal" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v11.liquid'), abv11, 'utf8');

// 12. ab-v12.liquid (High Jewelry Atelier Gold Bar)
const abv12 = `{% comment %}
  AB V12 — High Jewelry Atelier Gold Bar
{% endcomment %}
<style>
  .abv12 {
    background: #1E1B4B; color: #EEF2FF;
    font-family: 'Playfair Display', serif; font-size: 13px;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #4338CA; letter-spacing: 1px;
  }
</style>
<div class="abv12">
  <span>✨ Complimentary Jewelry Cleaning Kit & Velvet Pouch with Every Order ✨</span>
</div>
{% schema %}
{
  "name": "AB V12 — Atelier Gold",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#1E1B4B" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#EEF2FF" }
  ],
  "presets": [{ "name": "AB V12 — Atelier Gold" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v12.liquid'), abv12, 'utf8');

// 13. ab-v13.liquid (Eco Wool Footwear Neutral)
const abv13 = `{% comment %}
  AB V13 — Eco Wool Footwear Neutral Strip
{% endcomment %}
<style>
  .abv13 {
    background: #EDF2F7; color: #1A202C;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    height: 38px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #CBD5E0;
  }
</style>
<div class="abv13">
  <span>🌱 Zero-Carbon Footprint Wool Shoes — Save ₹ 1,000 on your first pair</span>
</div>
{% schema %}
{
  "name": "AB V13 — Eco Wool",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#EDF2F7" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1A202C" }
  ],
  "presets": [{ "name": "AB V13 — Eco Wool" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v13.liquid'), abv13, 'utf8');

// 14. ab-v14.liquid (Artisanal Coffee Espresso Dark)
const abv14 = `{% comment %}
  AB V14 — Artisanal Coffee Espresso Dark Bar
{% endcomment %}
<style>
  .abv14 {
    background: #451A03; color: #FEF3C7;
    font-family: 'Georgia', serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #78350F;
  }
</style>
<div class="abv14">
  <span>☕ Freshly Roasted Single-Origin Espresso Beans — Save 20% with Code: ROAST20</span>
</div>
{% schema %}
{
  "name": "AB V14 — Espresso Dark",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#451A03" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#FEF3C7" }
  ],
  "presets": [{ "name": "AB V14 — Espresso Dark" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v14.liquid'), abv14, 'utf8');

// 15. ab-v15.liquid (Tactical Outdoor Expedition)
const abv15 = `{% comment %}
  AB V15 — Tactical Outdoor Expedition Bar
{% endcomment %}
<style>
  .abv15 {
    background: #1C1917; color: #E7E5E4;
    font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #44403C; text-transform: uppercase;
  }
</style>
<div class="abv15">
  <span>[EXPEDITION GEAR] MILITARY-GRADE PACKS — 15% OFF WITH CODE: TACTICAL</span>
</div>
{% schema %}
{
  "name": "AB V15 — Tactical Gear",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#1C1917" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#E7E5E4" }
  ],
  "presets": [{ "name": "AB V15 — Tactical Gear" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v15.liquid'), abv15, 'utf8');

// 16. ab-v16.liquid (K-Beauty Dewy Glass Skin)
const abv16 = `{% comment %}
  AB V16 — K-Beauty Dewy Glass Skin Bar
{% endcomment %}
<style>
  .abv16 {
    background: #FDF2F8; color: #DB2777;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #F472B6;
  }
</style>
<div class="abv16">
  <span>✨ Dewy Hydration Sets — Free Essence Spray on Orders Over ₹1,499 ✨</span>
</div>
{% schema %}
{
  "name": "AB V16 — K-Beauty Dew",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FDF2F8" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#DB2777" }
  ],
  "presets": [{ "name": "AB V16 — K-Beauty Dew" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v16.liquid'), abv16, 'utf8');

// 17. ab-v17.liquid (The Farmers Dog Pet)
const abv17 = `{% comment %}
  AB V17 — The Farmer's Dog Pet Nutrition Bar
{% endcomment %}
<style>
  .abv17 {
    background: #FFF7ED; color: #9A3412;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #C86D51;
  }
</style>
<div class="abv17">
  <span>🐶 Human-Grade Vet Formulated Dog Meals — 50% Off Trial Box with Code: PUP50 🐶</span>
</div>
{% schema %}
{
  "name": "AB V17 — Farmer Dog",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFF7ED" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#9A3412" }
  ],
  "presets": [{ "name": "AB V17 — Farmer Dog" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v17.liquid'), abv17, 'utf8');

// 18. ab-v18.liquid (Smart Home IoT Tech)
const abv18 = `{% comment %}
  AB V18 — Smart Home IoT Tech Bar
{% endcomment %}
<style>
  .abv18 {
    background: #ECFEFF; color: #0891B2;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #06B6D4;
  }
</style>
<div class="abv18">
  <span>💡 Matter-Enabled Smart Ambient Light Kits — Save ₹1,500 with Code: SMARTKIT 💡</span>
</div>
{% schema %}
{
  "name": "AB V18 — Smart IoT",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#ECFEFF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#0891B2" }
  ],
  "presets": [{ "name": "AB V18 — Smart IoT" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v18.liquid'), abv18, 'utf8');

// 19. ab-v19.liquid (Artisanal Sourdough Bakery)
const abv19 = `{% comment %}
  AB V19 — Artisanal Sourdough Bakery Bar
{% endcomment %}
<style>
  .abv19 {
    background: #FFFBEB; color: #92400E;
    font-family: 'Georgia', serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px dashed #78350F;
  }
</style>
<div class="abv19">
  <span>🥖 Fresh Sourdough Bread Subscription — Get your 1st Box Free with Code: SOURDOUGH</span>
</div>
{% schema %}
{
  "name": "AB V19 — Sourdough",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFBEB" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#92400E" }
  ],
  "presets": [{ "name": "AB V19 — Sourdough" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v19.liquid'), abv19, 'utf8');

// 20. ab-v20.liquid (Retro 8-Bit Arcade)
const abv20 = `{% comment %}
  AB V20 — Retro 8-Bit Arcade Bar
{% endcomment %}
<style>
  .abv20 {
    background: #F5F3FF; color: #6D28D9;
    font-family: 'Courier New', monospace; font-size: 12px; font-weight: 900;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #8B5CF6; text-transform: uppercase;
  }
</style>
<div class="abv20">
  <span>🕹️ RETRO PIXEL CONSOLES — FREE RETRO STICKER PACK WITH CODE: PIXEL8 🕹️</span>
</div>
{% schema %}
{
  "name": "AB V20 — 8-Bit Arcade",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F5F3FF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#6D28D9" }
  ],
  "presets": [{ "name": "AB V20 — 8-Bit Arcade" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v20.liquid'), abv20, 'utf8');

console.log('✅ SUCCESS! Hand-crafted Announcement Bar Batch 2 (ab-v11.liquid to ab-v20.liquid)!');
