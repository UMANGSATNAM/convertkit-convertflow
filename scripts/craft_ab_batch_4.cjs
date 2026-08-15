const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';

console.log('🚀 Hand-Crafting Announcement Bar Batch 4: ab-v31.liquid to ab-v40.liquid...');

// 31. ab-v31.liquid (Running Shoes Performance)
const abv31 = `{% comment %}
  AB V31 — Running Shoes Performance Slate Bar
{% endcomment %}
<style>
  .abv31 {
    background: #334155; color: #F8FAFC;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #84CC16;
  }
</style>
<div class="abv31">
  <span>🏃 Speedboard Cushioned Runners — Free Performance Socks with Code: RUNNER 🏃</span>
</div>
{% schema %}
{
  "name": "AB V31 — Runner Tech",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#334155" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#F8FAFC" }
  ],
  "presets": [{ "name": "AB V31 — Runner Tech" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v31.liquid'), abv31, 'utf8');

// 32. ab-v32.liquid (Artisanal Gelato)
const abv32 = `{% comment %}
  AB V32 — Artisanal Gelato Pastel Pink Bar
{% endcomment %}
<style>
  .abv32 {
    background: #FDF2F8; color: #BE185D;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #EC4899;
  }
</style>
<div class="abv32">
  <span>🍨 Fresh Artisanal Gelato Tubs — Buy 3 Get 1 Free Dessert with Code: GELATO 🍨</span>
</div>
{% schema %}
{
  "name": "AB V32 — Gelato Pastel",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FDF2F8" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#BE185D" }
  ],
  "presets": [{ "name": "AB V32 — Gelato Pastel" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v32.liquid'), abv32, 'utf8');

// 33. ab-v33.liquid (Cyberpunk Mechanical Keyboards)
const abv33 = `{% comment %}
  AB V33 — Cyberpunk Mechanical Keyboards Bar
{% endcomment %}
<style>
  .abv33 {
    background: #18181B; color: #06B6D4;
    font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #0891B2; text-transform: uppercase;
  }
</style>
<div class="abv33">
  <span>⌨️ RGB GASKET MOUNT BOARDS — FREE KEYCAP PULLER WITH CODE: RGBKEYS ⌨️</span>
</div>
{% schema %}
{
  "name": "AB V33 — RGB Keyboards",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#18181B" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#06B6D4" }
  ],
  "presets": [{ "name": "AB V33 — RGB Keyboards" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v33.liquid'), abv33, 'utf8');

// 34. ab-v34.liquid (Niche Perfumery Velvet Oud)
const abv34 = `{% comment %}
  AB V34 — Niche Perfumery Velvet Oud Bar
{% endcomment %}
<style>
  .abv34 {
    background: #EEF2FF; color: #3730A3;
    font-family: 'Playfair Display', serif; font-size: 13px;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #312E81;
  }
</style>
<div class="abv34">
  <span>✨ Handmade Velvet Oud — Complimentary 10ml Spray Sample: VELVET ✨</span>
</div>
{% schema %}
{
  "name": "AB V34 — Velvet Perfume",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#EEF2FF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#3730A3" }
  ],
  "presets": [{ "name": "AB V34 — Velvet Perfume" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v34.liquid'), abv34, 'utf8');

// 35. ab-v35.liquid (Tuscan Olive Oil)
const abv35 = `{% comment %}
  AB V35 — Tuscan Olive Oil Bar
{% endcomment %}
<style>
  .abv35 {
    background: #F7FEE7; color: #4D7C0F;
    font-family: 'Georgia', serif; font-size: 13px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #65A30D;
  }
</style>
<div class="abv35">
  <span>🫒 Cold-Pressed Extra Virgin Olive Oil — Free Ceramic Dipping Dish: OLIVEOIL 🫒</span>
</div>
{% schema %}
{
  "name": "AB V35 — Olive Oil",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FEE7" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#4D7C0F" }
  ],
  "presets": [{ "name": "AB V35 — Olive Oil" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v35.liquid'), abv35, 'utf8');

// 36. ab-v36.liquid (Bamboo Eyewear)
const abv36 = `{% comment %}
  AB V36 — Bamboo Eyewear Bar
{% endcomment %}
<style>
  .abv36 {
    background: #FEFCE8; color: #854D0E;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    height: 38px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #A16207;
  }
</style>
<div class="abv36">
  <span>🕶️ Polarized Eco Bamboo Frames — 20% Off with Code: BAMBOO 🕶️</span>
</div>
{% schema %}
{
  "name": "AB V36 — Bamboo Frames",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FEFCE8" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#854D0E" }
  ],
  "presets": [{ "name": "AB V36 — Bamboo Frames" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v36.liquid'), abv36, 'utf8');

// 37. ab-v37.liquid (Vitamin Nootropics)
const abv37 = `{% comment %}
  AB V37 — Vitamin Nootropics Brain Focus Bar
{% endcomment %}
<style>
  .abv37 {
    background: #F5F3FF; color: #6D28D9;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #7C3AED;
  }
</style>
<div class="abv37">
  <span>🧠 Brain Focus Nootropic Capsules — Buy 2 Get 1 Free with Code: FOCUS 🧠</span>
</div>
{% schema %}
{
  "name": "AB V37 — Nootropics",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F5F3FF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#6D28D9" }
  ],
  "presets": [{ "name": "AB V37 — Nootropics" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v37.liquid'), abv37, 'utf8');

// 38. ab-v38.liquid (Craft Keyboards Gateron)
const abv38 = `{% comment %}
  AB V38 — Craft Keyboards Gateron Bar
{% endcomment %}
<style>
  .abv38 {
    background: #F1F5F9; color: #0F172A;
    font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #94A3B8;
  }
</style>
<div class="abv38">
  <span>⌨️ Gateron Mechanical Switches & Lubed Springs — 15% Off Code: GATERON ⌨️</span>
</div>
{% schema %}
{
  "name": "AB V38 — Gateron Switch",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F1F5F9" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#0F172A" }
  ],
  "presets": [{ "name": "AB V38 — Gateron Switch" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v38.liquid'), abv38, 'utf8');

// 39. ab-v39.liquid (Japanese Selvedge Denim)
const abv39 = `{% comment %}
  AB V39 — Japanese Selvedge Denim Bar
{% endcomment %}
<style>
  .abv39 {
    background: #EFF6FF; color: #1E40AF;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
    height: 42px; display: flex; align-items: center; justify-content: center;
    border-bottom: 2px solid #1E3A8A;
  }
</style>
<div class="abv39">
  <span>👖 Raw Japanese Selvedge Denim — Free Canvas Tote Bag with Code: SELVEDGE 👖</span>
</div>
{% schema %}
{
  "name": "AB V39 — Selvedge Denim",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#EFF6FF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1E40AF" }
  ],
  "presets": [{ "name": "AB V39 — Selvedge Denim" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v39.liquid'), abv39, 'utf8');

// 40. ab-v40.liquid (Fitness Wearable Bio Rings)
const abv40 = `{% comment %}
  AB V40 — Fitness Wearable Bio Rings Bar
{% endcomment %}
<style>
  .abv40 {
    background: #F8FAFC; color: #0F172A;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    height: 40px; display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #CBD5E1;
  }
</style>
<div class="abv40">
  <span>💍 Titanium Sleep & HRV Bio Tracker Ring — Free Sizing Kit with Code: BIOFIT 💍</span>
</div>
{% schema %}
{
  "name": "AB V40 — Biofit Ring",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F8FAFC" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#0F172A" }
  ],
  "presets": [{ "name": "AB V40 — Biofit Ring" }]
}
{% endschema %}
`;
fs.writeFileSync(path.join(sectionsDir, 'ab-v40.liquid'), abv40, 'utf8');

console.log('✅ SUCCESS! Hand-crafted Announcement Bar Batch 4 (ab-v31.liquid to ab-v40.liquid)!');
