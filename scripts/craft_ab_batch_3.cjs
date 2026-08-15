const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';

console.log('🚀 Hand-Crafting Announcement Bar Batch 3: ab-v21.liquid to ab-v30.liquid...');

// 21. ab-v21.liquid (Clinical Derma Lab)
const abv21 = `{% comment %}
  AB V21 — Clinical Derma Lab Strip
{% endcomment %}
<style>
  .abv21 {
    background: #F0F9FF; color: #0369A1;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #0284C7;
  }
</style>
<div class="abv21">
  <span>🔬 Dermatologist Approved Clinical Serums — 20% Off with Code: DERMA20 🔬</span>
</div>
{% schema %}
{
  "name": "AB V21 — Clinical Derma",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F0F9FF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#0369A1" }
  ],
  "presets": [{ "name": "AB V21 — Clinical Derma" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v21.liquid'), abv21, 'utf8');

// 22. ab-v22.liquid (Pro Activewear Performance)
const abv22 = `{% comment %}
  AB V22 — Pro Activewear Performance Bar
{% endcomment %}
<style>
  .abv22 {
    background: #FEF2F2; color: #991B1B;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #7F1D1D; text-transform: uppercase;
  }
</style>
<div class="abv22">
  <span>🔥 Sweat-Wicking Performance Gear — Buy 2 Items Get Extra 20% Off 🔥</span>
</div>
{% schema %}
{
  "name": "AB V22 — Pro Activewear",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FEF2F2" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#991B1B" }
  ],
  "presets": [{ "name": "AB V22 — Pro Activewear" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v22.liquid'), abv22, 'utf8');

// 23. ab-v23.liquid (Herbal Tea Infusions)
const abv23 = `{% comment %}
  AB V23 — Herbal Tea Infusions Bar
{% endcomment %}
<style>
  .abv23 {
    background: #F0FDF4; color: #166534;
    font-family: 'Georgia', serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #15803D;
  }
</style>
<div class="abv23">
  <span>🍵 Organic Chamomile Tea Bundle — Free Glass Teapot with Code: HERBAL 🍵</span>
</div>
{% schema %}
{
  "name": "AB V23 — Herbal Tea",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F0FDF4" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#166534" }
  ],
  "presets": [{ "name": "AB V23 — Herbal Tea" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v23.liquid'), abv23, 'utf8');

// 24. ab-v24.liquid (Luxury Timepieces Chrono)
const abv24 = `{% comment %}
  AB V24 — Luxury Timepieces Chrono Strip
{% endcomment %}
<style>
  .abv24 {
    background: #0F172A; color: #F8FAFC;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #1E293B; letter-spacing: 1.5px; text-transform: uppercase;
  }
</style>
<div class="abv24">
  <span>⌚ Automatic Chronographs — Free Watch Winder Gift with Code: CHRONO ⌚</span>
</div>
{% schema %}
{
  "name": "AB V24 — Chrono Luxury",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#0F172A" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#F8FAFC" }
  ],
  "presets": [{ "name": "AB V24 — Chrono Luxury" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v24.liquid'), abv24, 'utf8');

// 25. ab-v25.liquid (Eco Refill Cleaning)
const abv25 = `{% comment %}
  AB V25 — Eco Refill Cleaning Tablet Bar
{% endcomment %}
<style>
  .abv25 {
    background: #CCFBF1; color: #0F766E;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #0D9488;
  }
</style>
<div class="abv25">
  <span>🌱 Zero-Plastic Refill Starter Packs — Save ₹ 300 with Code: REFILL 🌱</span>
</div>
{% schema %}
{
  "name": "AB V25 — Eco Refill",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#CCFBF1" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#0F766E" }
  ],
  "presets": [{ "name": "AB V25 — Eco Refill" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v25.liquid'), abv25, 'utf8');

// 26. ab-v26.liquid (Gourmet Hot Sauce Fiery)
const abv26 = `{% comment %}
  AB V26 — Gourmet Hot Sauce Fiery Bar
{% endcomment %}
<style>
  .abv26 {
    background: #FEF2F2; color: #B91C1C;
    font-family: 'Impact', sans-serif; font-size: 15px; letter-spacing: 1px;
    height: 44px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #991B1B; text-transform: uppercase;
  }
</style>
<div class="abv26">
  <span>🌶️ FIERY TRIPLE PACK — FREE CHILI OIL BOTTLE WITH CODE: SPICY 🌶️</span>
</div>
{% schema %}
{
  "name": "AB V26 — Gourmet Sauce",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FEF2F2" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#B91C1C" }
  ],
  "presets": [{ "name": "AB V26 — Gourmet Sauce" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v26.liquid'), abv26, 'utf8');

// 27. ab-v27.liquid (Japanese Stationery Washi)
const abv27 = `{% comment %}
  AB V27 — Japanese Stationery Washi Bar
{% endcomment %}
<style>
  .abv27 {
    background: #F8FAFC; color: #334155;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    height: 38px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #CBD5E1;
  }
</style>
<div class="abv27">
  <span>✏️ Minimalist Washi Paper Journals — Flat 15% Off with Code: WASHI15 ✏️</span>
</div>
{% schema %}
{
  "name": "AB V27 — Washi Journal",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F8FAFC" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#334155" }
  ],
  "presets": [{ "name": "AB V27 — Washi Journal" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v27.liquid'), abv27, 'utf8');

// 28. ab-v28.liquid (Functional Hydration Electrolyte)
const abv28 = `{% comment %}
  AB V28 — Functional Hydration Electrolyte Bar
{% endcomment %}
<style>
  .abv28 {
    background: #E0F2FE; color: #0369A1;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #0284C7;
  }
</style>
<div class="abv28">
  <span>💧 Electrolyte Multiplier Packs — 20% Off Your First Subscription: HYDRATE 💧</span>
</div>
{% schema %}
{
  "name": "AB V28 — Hydration",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#E0F2FE" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#0369A1" }
  ],
  "presets": [{ "name": "AB V28 — Hydration" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v28.liquid'), abv28, 'utf8');

// 29. ab-v29.liquid (Handcrafted Leather Goods)
const abv29 = `{% comment %}
  AB V29 — Handcrafted Leather Goods Bar
{% endcomment %}
<style>
  .abv29 {
    background: #FEF3C7; color: #78350F;
    font-family: 'Georgia', serif; font-size: 13px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #92400E;
  }
</style>
<div class="abv29">
  <span>💼 Full-Grain Cognac Wallets — Free Custom Monogramming with Code: LEATHER 💼</span>
</div>
{% schema %}
{
  "name": "AB V29 — Leather Goods",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FEF3C7" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#78350F" }
  ],
  "presets": [{ "name": "AB V29 — Leather Goods" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v29.liquid'), abv29, 'utf8');

// 30. ab-v30.liquid (Baby Essentials Organic)
const abv30 = `{% comment %}
  AB V30 — Baby Essentials Organic Cotton Bar
{% endcomment %}
<style>
  .abv30 {
    background: #FFF1F2; color: #E11D48;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #F472B6;
  }
</style>
<div class="abv30">
  <span>👶 Newborn Organic Cotton Sets — 25% Off with Code: BABY25 👶</span>
</div>
{% schema %}
{
  "name": "AB V30 — Organic Baby",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFF1F2" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#E11D48" }
  ],
  "presets": [{ "name": "AB V30 — Organic Baby" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v30.liquid'), abv30, 'utf8');

console.log('✅ SUCCESS! Hand-crafted Announcement Bar Batch 3 (ab-v21.liquid to ab-v30.liquid)!');
