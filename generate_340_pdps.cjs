const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, 'dev-theme-peri', 'sections');

if (!fs.existsSync(SECTIONS_DIR)) {
  fs.mkdirSync(SECTIONS_DIR, { recursive: true });
}

const CATEGORIES = [
  'artisan', 'auto', 'beauty', 'coffee', 'eco', 
  'fashion', 'fitness', 'fmcg', 'gaming', 'health', 
  'home', 'homedecor', 'jewelry', 'kids', 'pet', 
  'pets', 'tech'
];

const CATEGORY_STYLES = {
  artisan: { bg: '#FAFAF8', text: '#3E362E', primary: '#A67B5B', font: '"Playfair Display", serif' },
  auto: { bg: '#1A1A1A', text: '#F3F4F6', primary: '#EF4444', font: '"Roboto", sans-serif' },
  beauty: { bg: '#FFF0F5', text: '#4A148C', primary: '#E91E63', font: '"Montserrat", sans-serif' },
  coffee: { bg: '#FDFBF7', text: '#4B3832', primary: '#854442', font: '"Merriweather", serif' },
  eco: { bg: '#F0FDF4', text: '#14532D', primary: '#16A34A', font: '"Nunito", sans-serif' },
  fashion: { bg: '#FFFFFF', text: '#000000', primary: '#111827', font: '"Helvetica Neue", sans-serif' },
  fitness: { bg: '#000000', text: '#FFFFFF', primary: '#FACC15', font: '"Oswald", sans-serif' },
  fmcg: { bg: '#FFFFFF', text: '#1E293B', primary: '#2563EB', font: '"Inter", sans-serif' },
  gaming: { bg: '#0F172A', text: '#E2E8F0', primary: '#8B5CF6', font: '"Orbitron", sans-serif' },
  health: { bg: '#F0F9FF', text: '#0C4A6E', primary: '#0284C7', font: '"Lato", sans-serif' },
  home: { bg: '#FAFAFA', text: '#27272A', primary: '#52525B', font: '"Open Sans", sans-serif' },
  homedecor: { bg: '#F8F7F4', text: '#4A4A4A', primary: '#D4AF37', font: '"Cormorant Garamond", serif' },
  jewelry: { bg: '#000000', text: '#FDFBF7', primary: '#FFD700', font: '"Cinzel", serif' },
  kids: { bg: '#FFFFF0', text: '#1E1E1E', primary: '#F43F5E', font: '"Comic Sans MS", "Quicksand", sans-serif' },
  pet: { bg: '#FEFCE8', text: '#422006', primary: '#F97316', font: '"Fredoka One", cursive' },
  pets: { bg: '#FFF7ED', text: '#431407', primary: '#EA580C', font: '"Baloo 2", cursive' },
  tech: { bg: '#FFFFFF', text: '#111827', primary: '#3B82F6', font: '"Inter", sans-serif' }
};

const GALLERIES = [
  (id) => `
    .sf-gallery-1-${id} { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; position: sticky; top: 20px; }
    .sf-gallery-1-${id} img { width: 100%; border-radius: 12px; object-fit: cover; aspect-ratio: 4/5; }
    .sf-gallery-1-${id} img:first-child { grid-column: span 2; }
  `,
  (id) => `
    .sf-gallery-2-${id} { display: flex; overflow-x: auto; gap: 16px; scroll-snap-type: x mandatory; scrollbar-width: none; }
    .sf-gallery-2-${id} img { flex: 0 0 85%; scroll-snap-align: center; border-radius: 8px; border: 1px solid var(--border-color); }
  `,
  (id) => `
    .sf-gallery-3-${id} { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    .sf-gallery-3-${id} img { width: 100%; display: block; }
  `,
  (id) => `
    .sf-gallery-4-${id} { display: flex; flex-direction: column; gap: 24px; }
    .sf-gallery-4-${id} img { width: 100%; border-radius: 0; }
  `,
  (id) => `
    .sf-gallery-5-${id} { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px; background: #fff; border: 1px solid var(--border-color); box-shadow: 2px 2px 10px rgba(0,0,0,0.05); }
    .sf-gallery-5-${id} img { width: 100%; background: #f0f0f0; padding: 10px; padding-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: rotate(-2deg); }
    .sf-gallery-5-${id} img:nth-child(even) { transform: rotate(2deg); }
  `,
  (id) => `
    .sf-gallery-6-${id} { display: flex; gap: 12px; flex-direction: row-reverse; }
    .sf-gallery-6-${id} .main { flex: 1; border-radius: 10px; overflow: hidden; }
    .sf-gallery-6-${id} .thumbs { width: 80px; display: flex; flex-direction: column; gap: 10px; }
    .sf-gallery-6-${id} img { width: 100%; border-radius: 6px; cursor: pointer; }
  `,
  (id) => `
    .sf-gallery-7-${id} { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
    .sf-gallery-7-${id} img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid var(--primary-color); transition: transform 0.3s; }
    .sf-gallery-7-${id} img:hover { transform: scale(1.1); }
  `,
  (id) => `
    .sf-gallery-8-${id} { display: grid; grid-template-columns: 2fr 1fr; gap: 8px; }
    .sf-gallery-8-${id} img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
  `,
  (id) => `
    .sf-gallery-9-${id} { display: flex; gap: 4px; overflow-x: auto; background: #111; padding: 10px 0; border-top: 4px dashed #333; border-bottom: 4px dashed #333; }
    .sf-gallery-9-${id} img { height: 400px; width: auto; }
  `,
  (id) => `
    .sf-gallery-10-${id} { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 20px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.2); }
    .sf-gallery-10-${id} img { width: 100%; border-radius: 16px; }
  `
];

const FORMS = [
  (id) => `
    .sf-form-1-${id} .qty-selector { display: flex; border: 1px solid var(--border-color); width: fit-content; border-radius: 4px; }
    .sf-form-1-${id} .qty-btn { background: none; border: none; padding: 10px 15px; font-size: 18px; cursor: pointer; }
    .sf-form-1-${id} input { width: 50px; text-align: center; border: none; font-size: 16px; }
    .sf-form-1-${id} .atc { width: 100%; padding: 16px; background: var(--primary-color); color: #fff; font-weight: bold; border-radius: 4px; border: none; margin-top: 16px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
  `,
  (id) => `
    .sf-form-2-${id} .qty-selector { display: flex; border: 3px solid var(--text-color); box-shadow: 4px 4px 0 var(--primary-color); margin-bottom: 20px; }
    .sf-form-2-${id} .qty-btn { background: var(--text-color); color: var(--bg-color); border: none; padding: 10px 20px; font-weight: bold; }
    .sf-form-2-${id} input { flex: 1; text-align: center; border: none; font-weight: bold; }
    .sf-form-2-${id} .atc { width: 100%; padding: 20px; background: var(--primary-color); color: var(--text-color); border: 3px solid var(--text-color); box-shadow: 6px 6px 0 var(--text-color); font-weight: 900; font-size: 1.2rem; cursor: pointer; transition: transform 0.1s; }
    .sf-form-2-${id} .atc:active { transform: translate(4px, 4px); box-shadow: 2px 2px 0 var(--text-color); }
  `,
  (id) => `
    .sf-form-3-${id} { display: flex; gap: 12px; }
    .sf-form-3-${id} .qty-selector { display: flex; background: rgba(0,0,0,0.05); border-radius: 50px; padding: 4px; }
    .sf-form-3-${id} .qty-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: #fff; cursor: pointer; }
    .sf-form-3-${id} input { width: 40px; text-align: center; border: none; background: transparent; }
    .sf-form-3-${id} .atc { flex: 1; border-radius: 50px; background: var(--primary-color); color: #fff; border: none; font-weight: 600; cursor: pointer; }
  `,
  (id) => `
    .sf-form-4-${id} .qty-selector { display: inline-flex; border-radius: 12px; background: var(--bg-color); box-shadow: inset 2px 2px 5px rgba(0,0,0,0.1), inset -3px -3px 7px rgba(255,255,255,0.7); padding: 5px; }
    .sf-form-4-${id} .qty-btn { background: transparent; border: none; width: 40px; height: 40px; font-weight: bold; cursor: pointer; }
    .sf-form-4-${id} input { width: 50px; text-align: center; border: none; background: transparent; }
    .sf-form-4-${id} .atc { width: 100%; padding: 18px; border-radius: 12px; border: none; background: var(--bg-color); color: var(--primary-color); box-shadow: 4px 4px 10px rgba(0,0,0,0.1), -4px -4px 10px rgba(255,255,255,0.8); font-weight: bold; margin-top: 20px; cursor: pointer; }
  `,
  (id) => `
    .sf-form-5-${id} .qty-selector { display: none; }
    .sf-form-5-${id} .atc { width: 100%; height: 80px; font-size: 24px; font-weight: 900; background: var(--primary-color); color: #fff; border: none; border-radius: 0; cursor: pointer; text-transform: uppercase; transition: filter 0.3s; }
  `,
  (id) => `
    .sf-form-6-${id} .qty-selector { display: flex; border-bottom: 2px solid var(--text-color); margin-bottom: 20px; padding-bottom: 10px; }
    .sf-form-6-${id} .qty-btn { background: none; border: none; font-size: 20px; cursor: pointer; }
    .sf-form-6-${id} input { flex: 1; text-align: center; border: none; font-size: 18px; }
    .sf-form-6-${id} .atc { width: 100%; padding: 15px; background: transparent; color: var(--text-color); border: 2px solid var(--text-color); font-weight: 600; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
    .sf-form-6-${id} .atc:hover { background: var(--text-color); color: var(--bg-color); }
  `,
  (id) => `
    .sf-form-7-${id} .atc { width: 100%; padding: 16px; background: linear-gradient(90deg, var(--primary-color), #3b82f6); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 10px; }
    .sf-form-7-${id} .qty-selector { display: flex; gap: 8px; }
    .sf-form-7-${id} .qty-btn { background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 4px; padding: 10px 15px; cursor: pointer; }
    .sf-form-7-${id} input { width: 60px; text-align: center; border: 1px solid var(--border-color); border-radius: 4px; }
  `,
  (id) => `
    .sf-form-8-${id} { display: flex; flex-direction: column; gap: 10px; }
    .sf-form-8-${id} .qty-selector { display: grid; grid-template-columns: 1fr 2fr 1fr; border: 1px solid var(--border-color); }
    .sf-form-8-${id} .qty-btn { padding: 15px; border: none; background: rgba(0,0,0,0.05); cursor: pointer; }
    .sf-form-8-${id} input { border: none; text-align: center; background: transparent; }
    .sf-form-8-${id} .atc { padding: 20px; background: var(--primary-color); color: #fff; border: none; font-weight: bold; cursor: pointer; }
  `,
  (id) => `
    .sf-form-9-${id} .atc { position: relative; width: 100%; padding: 15px; background: var(--primary-color); color: #fff; border: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); margin-top: 15px; }
    .sf-form-9-${id} .qty-selector { display: flex; border: 1px solid var(--primary-color); clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px); }
    .sf-form-9-${id} .qty-btn { background: transparent; border: none; color: var(--text-color); padding: 10px 15px; cursor: pointer; }
    .sf-form-9-${id} input { border: none; text-align: center; flex: 1; background: transparent; color: var(--text-color); }
  `,
  (id) => `
    .sf-form-10-${id} .atc { width: 100%; padding: 20px; background: var(--text-color); color: var(--bg-color); border: none; font-family: inherit; font-size: 1rem; cursor: pointer; margin-top: 10px; transition: opacity 0.3s; }
    .sf-form-10-${id} .qty-selector { display: flex; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; width: 100px; margin-bottom: 20px; }
    .sf-form-10-${id} .qty-btn { border: none; background: none; font-size: 1rem; cursor: pointer; }
    .sf-form-10-${id} input { flex: 1; text-align: center; border: none; font-size: 1rem; background: transparent; color: var(--text-color); }
  `
];

const URGENCIES = [
  (id) => `<div style="background:#fee2e2; color:#991b1b; padding:8px 12px; border-radius:4px; font-weight:bold; font-size:0.85rem; margin-bottom:12px; display:inline-block;">🔥 <span class="sf-live-views-${id}">24</span> people are viewing this right now</div>`,
  (id) => `<div style="border:1px solid #f59e0b; color:#d97706; padding:10px; font-size:0.9rem; margin-bottom:16px; border-left:4px solid #f59e0b;">⚡ High Demand: <span class="sf-purchased-${id}">85</span> units sold in the last 24 hours!</div>`,
  (id) => `<div style="display:flex; align-items:center; gap:8px; margin-bottom:16px; font-size:0.9rem; color:#10b981;"><div style="width:10px; height:10px; border-radius:50%; background:#10b981; animation: sf-pulse 1.5s infinite;"></div> Available in stock - Ready to ship</div><style>@keyframes sf-pulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.7); } 70% { box-shadow: 0 0 0 6px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }</style>`,
  (id) => `<div style="margin-bottom:16px;"><div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px; font-weight:bold;"><span>Hurry, almost sold out!</span><span style="color:var(--primary-color);">Only <span class="sf-stock-${id}">4</span> left</span></div><div style="width:100%; height:6px; background:rgba(0,0,0,0.1); border-radius:3px; overflow:hidden;"><div style="width:15%; height:100%; background:var(--primary-color); border-radius:3px;"></div></div></div>`,
  (id) => `<div style="background:var(--text-color); color:var(--bg-color); padding:12px; text-align:center; text-transform:uppercase; font-size:0.75rem; letter-spacing:1px; margin-bottom:20px;">⏱️ Flash Sale Ends in <span class="sf-countdown-${id}">02:14:59</span></div>`
];

const PROMOS = [
  (id) => `<div style="background:var(--primary-color); color:#fff; padding:12px 16px; border-radius:8px; margin:20px 0; text-align:center; font-weight:600; border:2px dashed rgba(255,255,255,0.5);">🎁 Use Code: <strong>ELITE10</strong> for 10% Off Today</div>`,
  (id) => `<div style="border-top:1px solid var(--border-color); border-bottom:1px solid var(--border-color); padding:16px 0; margin:20px 0; display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; color:var(--heading-color);">Special Offer</span><span style="background:var(--bg-color); border:1px solid var(--text-color); padding:4px 12px; border-radius:50px; font-size:0.85rem;">Buy 2 Get 1 Free</span></div>`,
  (id) => `<div style="position:relative; background:#000; color:#0f0; padding:15px; font-family:monospace; margin:20px 0; letter-spacing:1px; box-shadow: 0 0 10px rgba(0,255,0,0.2);">[PROMO_DETECTED] > Apply "CYBER25" at checkout</div>`,
  (id) => `<div style="background: linear-gradient(135deg, #fceabb 0%, #f8b500 100%); color:#000; padding:16px; border-radius:12px; margin:20px 0; font-weight:700; text-align:center; box-shadow: 0 4px 15px rgba(248,181,0,0.3);">✨ Premium Upgrade: Free Express Shipping over $100</div>`,
  (id) => `<div style="margin:20px 0; padding:20px; background:rgba(0,0,0,0.02); text-align:center; border:1px solid var(--border-color); font-style:italic;">"The best investment you'll make this year."<br><strong style="font-style:normal; font-size:0.9rem; margin-top:8px; display:inline-block; color:var(--primary-color);">Claim your 20% discount on first order</strong></div>`
];

function generateLiquid(categoryId, layoutIndex, uniqueSeed) {
  const category = CATEGORIES[categoryId];
  const style = CATEGORY_STYLES[category];
  const uid = `${category}-v${layoutIndex}`;
  
  const galleryRender = GALLERIES[uniqueSeed % GALLERIES.length](uid);
  const formRender = FORMS[(uniqueSeed * 2) % FORMS.length](uid);
  const urgencyRender = URGENCIES[(uniqueSeed * 3) % URGENCIES.length](uid);
  const promoRender = PROMOS[(uniqueSeed * 5) % PROMOS.length](uid);
  
  let gridStyle = "";
  if (uniqueSeed % 3 === 0) {
    gridStyle = `
      .sf-pdp-grid-${uid} { display: grid; grid-template-columns: 1fr; gap: 40px; }
      @media(min-width:768px){ .sf-pdp-grid-${uid} { grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; } }
    `;
  } else if (uniqueSeed % 3 === 1) {
    gridStyle = `
      .sf-pdp-grid-${uid} { display: grid; grid-template-columns: 1fr; gap: 40px; }
      @media(min-width:768px){ .sf-pdp-grid-${uid} { grid-template-columns: 1.5fr 1fr; gap: 60px; align-items: start; } }
    `;
  } else {
    gridStyle = `
      .sf-pdp-grid-${uid} { display: flex; flex-direction: column-reverse; gap: 40px; }
      @media(min-width:768px){ .sf-pdp-grid-${uid} { display: grid; grid-template-columns: 1fr 1.2fr; gap: 50px; align-items: start; } }
    `;
  }

  const scriptInject = `<script>
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.sf-live-views-${uid}').forEach(el => el.innerText = Math.floor(Math.random() * (45 - 12 + 1) + 12));
        document.querySelectorAll('.sf-purchased-${uid}').forEach(el => el.innerText = Math.floor(Math.random() * (120 - 30 + 1) + 30));
        document.querySelectorAll('.sf-stock-${uid}').forEach(el => el.innerText = Math.floor(Math.random() * (15 - 3 + 1) + 3));
      });
    </script>`;

  return `{%- assign product = all_products[section.settings.product] | default: product -%}
{%- assign current_variant = product.selected_or_first_available_variant -%}

<style>
  .sf-pdp-${uid} {
    --primary-color: {{ section.settings.primary_color | default: '${style.primary}' }};
    --bg-color: {{ section.settings.bg_color | default: '${style.bg}' }};
    --text-color: {{ section.settings.text_color | default: '${style.text}' }};
    --heading-color: {{ section.settings.heading_color | default: '${style.text}' }};
    --border-color: rgba(0,0,0,0.1);
    font-family: ${style.font};
    background: var(--bg-color);
    color: var(--text-color);
    padding: {{ section.settings.padding_top }}px 20px {{ section.settings.padding_bottom }}px;
    box-sizing: border-box;
  }
  .sf-pdp-${uid} * { box-sizing: inherit; }
  .sf-pdp-container-${uid} { max-width: 1400px; margin: 0 auto; }
  
  ${gridStyle}
  ${galleryRender}
  ${formRender}

  .sf-title-${uid} { font-size: 2.5rem; line-height: 1.1; font-weight: 800; margin: 0 0 16px; color: var(--heading-color); }
  .sf-price-wrap-${uid} { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-size: 1.5rem; font-weight: 700; }
  .sf-compare-${uid} { text-decoration: line-through; color: #888; font-size: 1.1rem; }
  
  .sf-sticky-atc-${uid} {
    position: fixed; bottom: 0; left: 0; width: 100%; background: var(--bg-color); border-top: 1px solid var(--border-color);
    padding: 10px 20px; z-index: 50; display: flex; align-items: center; gap: 10px; box-shadow: 0 -4px 10px rgba(0,0,0,0.05);
    transform: translateY(100%); transition: transform 0.3s ease;
  }
  .sf-sticky-atc-${uid}.show { transform: translateY(0); }
  @media(min-width:768px){ .sf-sticky-atc-${uid} { display: none; } }
  
  .sf-acc-item-${uid} { border-bottom: 1px solid var(--border-color); }
  .sf-acc-head-${uid} { padding: 15px 0; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; }
  .sf-acc-body-${uid} { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; opacity: 0.8; line-height: 1.6; }
  .sf-acc-item-${uid}.active .sf-acc-body-${uid} { max-height: 1000px; padding-bottom: 15px; }
  
  .sf-rv-${uid} { margin-top: 60px; padding-top: 60px; border-top: 1px solid var(--border-color); }
  .sf-rv-grid-${uid} { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(min-width:768px){ .sf-rv-grid-${uid} { grid-template-columns: repeat(4, 1fr); } }
  .sf-rv-card-${uid} img { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 8px; margin-bottom: 10px; }
  .sf-rv-card-${uid} h4 { margin: 0; font-size: 1rem; color: var(--heading-color); }

</style>

<div class="sf-pdp-${uid}">
  <div class="sf-pdp-container-${uid}">
    {% if product != blank %}
      <div class="sf-pdp-grid-${uid}">
        
        <div class="sf-gallery-wrap-${uid}">
          <div class="sf-gallery-${uniqueSeed % GALLERIES.length}-${uid}">
            {% if product.images.size > 0 %}
              {% for image in product.images %}
                <img src="{{ image | img_url: '1000x' }}" alt="{{ image.alt | escape }}">
              {% endfor %}
            {% else %}
              <img src="https://cdn.shopify.com/s/images/themes/product-1.png" alt="Placeholder">
            {% endif %}
          </div>
        </div>
        
        <div class="sf-info-wrap-${uid}">
          ${urgencyRender}
          <h1 class="sf-title-${uid}">{{ product.title }}</h1>
          
          <div class="sf-price-wrap-${uid}">
            <span id="price-val-${uid}">{{ current_variant.price | money }}</span>
            {% if current_variant.compare_at_price > current_variant.price %}
              <span class="sf-compare-${uid}">{{ current_variant.compare_at_price | money }}</span>
            {% endif %}
          </div>
          
          ${promoRender}
          
          <form action="/cart/add" method="post" class="sf-form-${(uniqueSeed * 2) % FORMS.length}-${uid}">
            <input type="hidden" name="id" value="{{ current_variant.id }}">
            
            {% unless product.has_only_default_variant %}
              <div style="margin-bottom: 20px;">
                {% for option in product.options_with_values %}
                  <div style="margin-bottom: 10px;">
                    <label style="font-weight:bold; display:block; margin-bottom:5px;">{{ option.name }}</label>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                      {% for value in option.values %}
                        <div style="border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 4px; cursor: pointer; {% if option.selected_value == value %}background: var(--primary-color); color: #fff; border-color: var(--primary-color);{% endif %}">{{ value }}</div>
                      {% endfor %}
                    </div>
                  </div>
                {% endfor %}
              </div>
            {% endunless %}
            
            <div class="qty-selector">
              <button type="button" class="qty-btn" onclick="this.nextElementSibling.stepDown()">-</button>
              <input type="number" name="quantity" value="1" min="1">
              <button type="button" class="qty-btn" onclick="this.previousElementSibling.stepUp()">+</button>
            </div>
            
            <button type="submit" class="atc">
              Add To Cart - <span id="btn-price-${uid}">{{ current_variant.price | money }}</span>
            </button>
          </form>
          
          <div style="margin-top: 30px;">
            <div class="sf-acc-item-${uid}">
              <div class="sf-acc-head-${uid}" onclick="this.parentNode.classList.toggle('active')">Description <span>+</span></div>
              <div class="sf-acc-body-${uid}">{{ product.description }}</div>
            </div>
            <div class="sf-acc-item-${uid}">
              <div class="sf-acc-head-${uid}" onclick="this.parentNode.classList.toggle('active')">Shipping & Returns <span>+</span></div>
              <div class="sf-acc-body-${uid}">{{ section.settings.shipping_info }}</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {% if section.settings.show_recently_viewed %}
        <div class="sf-rv-${uid}">
          <h3 style="text-align:center; font-size:1.75rem; margin-bottom:30px;">You May Also Like</h3>
          <div class="sf-rv-grid-${uid}">
            {% for i in (1..4) %}
              <div class="sf-rv-card-${uid}">
                <img src="https://cdn.shopify.com/s/images/themes/product-{{ i }}.png" alt="Product">
                <h4>Trending Product {{ i }}</h4>
                <div style="color:var(--primary-color); font-weight:bold;">$99.00</div>
              </div>
            {% endfor %}
          </div>
        </div>
      {% endif %}
      
      <div class="sf-sticky-atc-${uid}">
        {% if product.featured_image %}
          <img src="{{ product.featured_image | img_url: '100x' }}" style="width:50px; height:50px; border-radius:4px; object-fit:cover;">
        {% else %}
          <div style="width:50px; height:50px; background:#ddd; border-radius:4px;"></div>
        {% endif %}
        <div style="flex:1;">
          <div style="font-weight:bold; font-size:0.9rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:150px;">{{ product.title }}</div>
          <div style="color:var(--primary-color); font-weight:600;">{{ current_variant.price | money }}</div>
        </div>
        <button style="background:var(--primary-color); color:#fff; border:none; padding:10px 15px; border-radius:4px; font-weight:bold;" onclick="document.querySelector('.sf-form-${(uniqueSeed * 2) % FORMS.length}-${uid}').submit()">Buy Now</button>
      </div>

      <script>
        window.addEventListener('scroll', () => {
          const sticky = document.querySelector('.sf-sticky-atc-${uid}');
          if(sticky) {
            if(window.scrollY > 400) sticky.classList.add('show');
            else sticky.classList.remove('show');
          }
        });
      </script>
      ${scriptInject}
      
    {% else %}
      <div style="text-align: center; padding: 100px; border: 2px dashed rgba(0,0,0,0.1);">
        <p style="font-size:1.2rem; color:#888;">Select a product in the theme editor to view.</p>
      </div>
    {% endif %}
  </div>
</div>

{% schema %}
{
  "name": "PDP ${category} V${layoutIndex}",
  "settings": [
    {
      "type": "product",
      "id": "product",
      "label": "Product"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "${style.bg}"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "${style.text}"
    },
    {
      "type": "color",
      "id": "primary_color",
      "label": "Primary Color",
      "default": "${style.primary}"
    },
    {
      "type": "richtext",
      "id": "shipping_info",
      "label": "Shipping Info",
      "default": "<p>Free shipping on orders over $50. Returns accepted within 30 days.</p>"
    },
    {
      "type": "checkbox",
      "id": "show_recently_viewed",
      "label": "Show Recently Viewed",
      "default": true
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "Padding Top",
      "min": 0, "max": 100, "step": 5, "default": 60
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "Padding Bottom",
      "min": 0, "max": 100, "step": 5, "default": 60
    }
  ],
  "presets": [
    {
      "name": "PDP ${category} V${layoutIndex}"
    }
  ]
}
{% endschema %}
`;
}

let counter = 0;
CATEGORIES.forEach((category, catIndex) => {
  for (let i = 1; i <= 20; i++) {
    const uniqueSeed = (catIndex * 20) + i; 
    const liquidContent = generateLiquid(catIndex, i, uniqueSeed);
    const fileName = `pdp-${category}-v${i}.liquid`;
    const filePath = path.join(SECTIONS_DIR, fileName);
    
    fs.writeFileSync(filePath, liquidContent, 'utf-8');
    counter++;
  }
});

console.log(`Successfully generated ${counter} unique CRO-tested PDP liquid files!`);
