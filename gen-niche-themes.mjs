import fs from 'fs';
import path from 'path';

const NICHES = {
  pilgrim:              { label:'Pilgrim Beauty',    accent:'#C9184A', accent_text:'#fff', bg:'#FFF9FB', text:'#1a0a0e', footer_bg:'#1a0a0e', heading:'playfair_display_n4', body:'inter_n4', radius:12 },
  tanishq:              { label:'Tanishq Jewellery', accent:'#B8860B', accent_text:'#fff', bg:'#FDFAF3', text:'#1C1208', footer_bg:'#1C1208', heading:'cormorant_garamond_n4', body:'inter_n4', radius:4 },
  caratlane:            { label:'CaratLane',         accent:'#D4AF37', accent_text:'#000', bg:'#FFFFFF', text:'#111111', footer_bg:'#111111', heading:'playfair_display_n4', body:'inter_n4', radius:8 },
  'jewellery-heritage': { label:'Jewellery Heritage',accent:'#1B4332', accent_text:'#D4AF37', bg:'#FAFAF7', text:'#0F1A0F', footer_bg:'#0F1A0F', heading:'cormorant_garamond_n4', body:'lora_n4', radius:4 },
  'fashion-clothing':   { label:'Urban Fashion',     accent:'#111111', accent_text:'#ffffff', bg:'#FAFAFA', text:'#111111', footer_bg:'#111111', heading:'oswald_n4', body:'inter_n4', radius:0 },
  footwear:             { label:'Solera Footwear',   accent:'#8B4513', accent_text:'#fff', bg:'#FFFDF9', text:'#1A0F00', footer_bg:'#1A0F00', heading:'playfair_display_n4', body:'inter_n4', radius:6 },
  'ayurveda-wellness':  { label:'AyurVeda Wellness', accent:'#386641', accent_text:'#fff', bg:'#F7FBF2', text:'#1A2E1A', footer_bg:'#1A2E1A', heading:'lora_n4', body:'inter_n4', radius:12 },
  'mobile-accessories': { label:'TechShield',        accent:'#0066FF', accent_text:'#fff', bg:'#F5F8FF', text:'#0A0F1E', footer_bg:'#0A0F1E', heading:'inter_n7', body:'inter_n4', radius:8 },
  'kids-toys':          { label:'PlayWorld',         accent:'#FF6B35', accent_text:'#fff', bg:'#FFFBF0', text:'#1A0F00', footer_bg:'#1A1A2E', heading:'nunito_n7', body:'nunito_n4', radius:20 },
  'home-furniture':     { label:'UrbanNest',         accent:'#6B4E3D', accent_text:'#fff', bg:'#FAF8F5', text:'#1A1210', footer_bg:'#1A1210', heading:'playfair_display_n4', body:'inter_n4', radius:8 },
  'food-delivery':      { label:'SpiceRoute',        accent:'#E63946', accent_text:'#fff', bg:'#FFFAF8', text:'#1A0505', footer_bg:'#1A0505', heading:'oswald_n4', body:'inter_n4', radius:10 },
  electronics:          { label:'VoltZone',          accent:'#00B4D8', accent_text:'#000', bg:'#0A0E1A', text:'#E8F0FE', footer_bg:'#060810', heading:'inter_n7', body:'inter_n4', radius:8 },
  'home-decor':         { label:'Artisano',          accent:'#C0701A', accent_text:'#fff', bg:'#FDF8F3', text:'#1E120A', footer_bg:'#1E120A', heading:'cormorant_garamond_n4', body:'inter_n4', radius:6 },
  'pet-supplies':       { label:'PawParadise',       accent:'#2DC6C6', accent_text:'#fff', bg:'#F0FFFE', text:'#0A2020', footer_bg:'#0A2020', heading:'nunito_n7', body:'nunito_n4', radius:16 },
  'luxury-watches':     { label:'Chrono Prestige',   accent:'#C5A028', accent_text:'#000', bg:'#0C0C0C', text:'#F0EDE8', footer_bg:'#050505', heading:'cormorant_garamond_n4', body:'inter_n4', radius:2 },
  'outdoor-gear':       { label:'TrailBlaze',        accent:'#2D6A4F', accent_text:'#fff', bg:'#F5F9F2', text:'#0F1F0F', footer_bg:'#0F1F0F', heading:'oswald_n4', body:'inter_n4', radius:6 },
  'organic-food':       { label:'GreenHarvest',      accent:'#3D9A0F', accent_text:'#fff', bg:'#F6FBF0', text:'#0D1F05', footer_bg:'#0D1F05', heading:'lora_n4', body:'inter_n4', radius:12 },
  'fitness-supplements':{ label:'IronFuel',          accent:'#FF3B30', accent_text:'#fff', bg:'#0D0D0D', text:'#F5F5F5', footer_bg:'#050505', heading:'oswald_n7', body:'inter_n4', radius:4 },
  'baby-apparel':       { label:'TinyTots',          accent:'#7B5EA7', accent_text:'#fff', bg:'#FDF8FF', text:'#1A0F2E', footer_bg:'#1A0F2E', heading:'nunito_n4', body:'nunito_n4', radius:16 },
  'coffee-roasters':    { label:'BlackBrew',         accent:'#6F4E37', accent_text:'#fff', bg:'#1A0F07', text:'#F5ECD7', footer_bg:'#0A0704', heading:'playfair_display_n4', body:'inter_n4', radius:6 },
  'beauty-cosmetics':   { label:'GlowLab',           accent:'#E8A0B4', accent_text:'#2D1A22', bg:'#FFF5F8', text:'#2D1A22', footer_bg:'#2D1A22', heading:'cormorant_garamond_n4', body:'inter_n4', radius:12 },
  'mens-grooming':      { label:'BladeCode',         accent:'#1B2A4A', accent_text:'#fff', bg:'#F8F9FB', text:'#0D1520', footer_bg:'#0D1520', heading:'oswald_n4', body:'inter_n4', radius:4 },
  activewear:           { label:'BloomFit',          accent:'#FF6B6B', accent_text:'#fff', bg:'#0D0D0D', text:'#F5F5F5', footer_bg:'#050505', heading:'oswald_n7', body:'inter_n4', radius:8 },
  streetwear:           { label:'URBNCO',            accent:'#F5F500', accent_text:'#000', bg:'#080808', text:'#F5F5F5', footer_bg:'#000000', heading:'oswald_n7', body:'inter_n4', radius:0 },
  'personal-care':      { label:'PureBody',          accent:'#4ECDC4', accent_text:'#fff', bg:'#F7FFFE', text:'#0A1F1E', footer_bg:'#0A1F1E', heading:'nunito_n4', body:'inter_n4', radius:10 },
};

const NICHES_DIR = 'i:/converflow app/convertkit-convertflow/theme-niches';

function mkSettings(n) {
  return {
    current: {
      color_accent: n.accent,
      color_accent_text: n.accent_text,
      color_bg: n.bg,
      color_text: n.text,
      color_subtle: blendHex(n.text, n.bg, 0.5),
      color_border: blendHex(n.text, n.bg, 0.15),
      color_header_bg: n.bg,
      color_header_text: n.text,
      color_footer_bg: n.footer_bg,
      color_footer_text: '#f5f5f5',
      font_heading: n.heading,
      font_body: n.body,
      font_size_base: 15,
      font_size_heading: 130,
      page_width: 1280,
      grid_gap: 40,
      card_style: 'shadow',
      card_border_radius: n.radius,
      sticky_header: true,
      enable_search: true,
      menu_type: 'mega',
      cart_type: 'drawer',
      enable_slide_cart: true,
      cart_notes: true,
      gift_wrapping: false,
      cart_upsell: true,
      enable_quick_view: true,
      sticky_atc: true,
      enable_image_zoom: true,
      show_stock_counter: true,
      stock_threshold: 10,
      show_sku: false,
      show_vendor: true,
      show_share_buttons: true,
      enable_filtering: true,
      enable_sorting: true,
      enable_infinite_scroll: false,
      products_per_page: 24,
      default_columns: '4',
      show_announcement_bar: true,
      enable_promo_popup: false,
      enable_age_verifier: false,
      age_minimum: 18,
      show_back_to_top: true,
      enable_animations: true,
      text_direction: 'ltr'
    },
    presets: {}
  };
}

// Simple hex color blend
function blendHex(c1, c2, t) {
  const h2r = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const r2h = ([r,g,b]) => '#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  try {
    const a = h2r(c1), b = h2r(c2);
    return r2h(a.map((v,i) => v*(1-t)+b[i]*t));
  } catch { return '#888888'; }
}

let count = 0;
for (const [key, niche] of Object.entries(NICHES)) {
  const dir = `${NICHES_DIR}/${key}/config`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/settings_data.json`, JSON.stringify(mkSettings(niche), null, 2));
  console.log(`✓ ${key} (${niche.label}) — accent: ${niche.accent}`);
  count++;
}

console.log(`\n✅ Generated ${count} niche themes`);
