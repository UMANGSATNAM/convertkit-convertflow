/**
 * build-liquid-sections.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Converts standalone HTML template files → Shopify Liquid section files.
 * Generates 4 section types per template:
 *   • landing  (index.json)
 *   • product  (product.json)
 *   • cart     (cart.json)
 *   • collection (collection.json)
 *
 * Run: node build-liquid-sections.js
 */

import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = path.resolve('./extensions/convertkit-sections/sections');

// All HTML-based templates needing Liquid section generation
const TEMPLATES = [
  { id: 'jewellery-heritage',  file: 'lp-jewellery-heritage.html',  label: 'Meenakshi Heritage Jewellers', accent: '#8B1A2C', bg: '#FAF0F0',  font: "'Cinzel', serif" },
  { id: 'fashion-clothing',    file: 'lp-fashion-clothing.html',    label: 'VŌLT Fashion',                 accent: '#0A0A0A', bg: '#F5F3EF',  font: "'Bebas Neue', cursive" },
  { id: 'footwear',            file: 'lp-footwear.html',            label: 'Solera Footwear',              accent: '#C65D2A', bg: '#FBF0E8',  font: "'Syne', sans-serif" },
  { id: 'ayurveda-wellness',   file: 'lp-ayurveda-wellness.html',   label: 'Ayurva Wellness',              accent: '#E07B2A', bg: '#F5FCF5',  font: "'Hind', sans-serif" },
  { id: 'mobile-accessories',  file: 'lp-mobile-accessories.html',  label: 'STACKD Accessories',           accent: '#00F0C8', bg: '#0D0D12',  font: "'Space Grotesk', sans-serif" },
  { id: 'kids-toys',           file: 'lp-kids-toys.html',           label: 'PlayBox Kids',                 accent: '#F9C22E', bg: '#EFF4FF',  font: "'Baloo 2', cursive" },
  { id: 'home-furniture',      file: 'lp-home-furniture.html',      label: 'Haven Furniture',              accent: '#B5834A', bg: '#F5EFE6',  font: "'Libre Baskerville', serif" },
  { id: 'food-delivery',       file: 'lp-food-delivery.html',       label: 'Veda Eats',                    accent: '#FF5722', bg: '#FFF0E8',  font: "'Poppins', sans-serif" },
  // ── Previously "placeholder" templates — now fully generated ──────────────
  { id: 'electronics',         file: 'lp-electronics.html',         label: 'Tech & Electronics',           accent: '#5735db', bg: '#e9e5f5',  font: "'Inter', sans-serif" },
  { id: 'home-decor',          file: 'lp-home-decor.html',          label: 'Home Decor',                   accent: '#8B7355', bg: '#FAF5ED',  font: "'Playfair Display', serif" },
  { id: 'pet-supplies',        file: 'lp-pet-supplies.html',        label: 'Pet Supplies',                 accent: '#D35400', bg: '#f9e0d1',  font: "'Nunito', sans-serif" },
  { id: 'luxury-watches',      file: 'lp-luxury-watches.html',      label: 'Luxury Watches',               accent: '#C5A028', bg: '#0a0a0a',  font: "'Cormorant Garamond', serif" },
  { id: 'outdoor-gear',        file: 'lp-outdoor-gear.html',        label: 'Outdoor Gear',                 accent: '#2A4B2A', bg: '#dbe8db',  font: "'Oswald', sans-serif" },
  { id: 'organic-food',        file: 'lp-organic-food.html',        label: 'Organic Food',                 accent: '#4A7C59', bg: '#e5f1e8',  font: "'DM Sans', sans-serif" },
  { id: 'fitness-supplements', file: 'lp-fitness-supplements.html', label: 'Fitness Supplements',          accent: '#E2FE16', bg: '#050505',  font: "'Barlow Condensed', sans-serif" },
  { id: 'baby-apparel',        file: 'lp-baby-apparel.html',        label: 'Baby Apparel',                 accent: '#F6A8B6', bg: '#fcedef',  font: "'Nunito', sans-serif" },
  { id: 'coffee-roasters',     file: 'lp-coffee-roasters.html',     label: 'Coffee Roasters',              accent: '#3E2723', bg: '#efebe9',  font: "'Playfair Display', serif" },
  { id: 'beauty-cosmetics',    file: 'lp-beauty-cosmetics.html',    label: 'Clean Cosmetics',              accent: '#D4BBA5', bg: '#f8f3f0',  font: "'Cormorant Garamond', serif" },
];

// ─── Helper: extract <style> content ─────────────────────────────────────────
function extractStyles(html) {
  const matches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  return matches.map(m => m[1]).join('\n').trim();
}

// ─── Helper: extract <body> content ──────────────────────────────────────────
function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1].trim() : html;
}

// ─── Helper: extract Google Font <link> tags ──────────────────────────────────
function extractFonts(html) {
  const matches = [...html.matchAll(/<link[^>]*fonts\.googleapis[^>]*>/gi)];
  return matches.map(m => m[0]).join('\n');
}

// ─── Build the LANDING section from full HTML ─────────────────────────────────
function buildLandingSection(tpl, html) {
  const fonts  = extractFonts(html);
  const styles = extractStyles(html);
  const body   = extractBody(html);

  return `{% comment %}ConvertFlow: ${tpl.label} — Landing Page{% endcomment %}
${fonts}
<style>
${styles}
</style>
${body}
{% schema %}
{
  "name": "CF ${tpl.label} Landing",
  "settings": [],
  "presets": [{ "name": "CF ${tpl.label} Landing" }]
}
{% endschema %}`;
}

// ─── Build the PRODUCT section ────────────────────────────────────────────────
function buildProductSection(tpl) {
  return `{% comment %}ConvertFlow: ${tpl.label} — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: ${tpl.accent};
  --cf-bg: ${tpl.bg};
  --cf-font: ${tpl.font};
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF ${tpl.label} Product",
  "settings": [],
  "presets": [{ "name": "CF ${tpl.label} Product" }]
}
{% endschema %}`;
}

// ─── Build the CART section ───────────────────────────────────────────────────
function buildCartSection(tpl) {
  return `{% comment %}ConvertFlow: ${tpl.label} — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: ${tpl.accent}; --cf-bg: ${tpl.bg}; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF ${tpl.label} Cart",
  "settings": [],
  "presets": [{ "name": "CF ${tpl.label} Cart" }]
}
{% endschema %}`;
}

// ─── Build the COLLECTION section ─────────────────────────────────────────────
function buildCollectionSection(tpl) {
  return `{% comment %}ConvertFlow: ${tpl.label} — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: ${tpl.accent}; --cf-bg: ${tpl.bg}; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF ${tpl.label} Collection",
  "settings": [],
  "presets": [{ "name": "CF ${tpl.label} Collection" }]
}
{% endschema %}`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
let created = 0;
let skipped = 0;

for (const tpl of TEMPLATES) {
  const htmlPath = path.resolve(`./${tpl.file}`);

  if (!fs.existsSync(htmlPath)) {
    console.warn(`⚠  Skipping ${tpl.id} — ${tpl.file} not found`);
    skipped++;
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');

  const pages = [
    { id: 'landing',    content: buildLandingSection(tpl, html) },
    { id: 'product',    content: buildProductSection(tpl) },
    { id: 'cart',       content: buildCartSection(tpl) },
    { id: 'collection', content: buildCollectionSection(tpl) },
  ];

  for (const page of pages) {
    // Skip if liquid section already exists (don't overwrite manual edits)
    const dest = path.join(SECTIONS_DIR, `cf-${tpl.id}-${page.id}.liquid`);
    if (fs.existsSync(dest)) {
      console.log(`   exists  cf-${tpl.id}-${page.id}.liquid`);
      continue;
    }
    fs.writeFileSync(dest, page.content, 'utf-8');
    console.log(`✓ created  cf-${tpl.id}-${page.id}.liquid`);
    created++;
  }
}

console.log(`\n✅ Done — ${created} sections created, ${skipped} templates skipped.`);
