import fs from 'fs';
import path from 'path';

const BLOCKS_DIR = path.join(process.cwd(), 'extensions', 'sf-sections', 'blocks');

const heroLayouts = [
  { name: 'hero-1', title: 'Centered Hero Classic', css: 'text-align: center; padding: 100px 20px; background-color: {{ section.settings.bg_color }};' },
  { name: 'hero-2', title: 'Split Hero Left', css: 'display: flex; align-items: center; padding: 80px; background: linear-gradient(to right, {{ section.settings.bg_color }}, #ffffff);' },
  { name: 'hero-3', title: 'Hero Video Background', css: 'position: relative; padding: 150px 20px; color: #fff; text-align: center; overflow: hidden;' },
  { name: 'hero-4', title: 'Hero with Trust Badges', css: 'text-align: center; padding: 120px 20px; background-color: {{ section.settings.bg_color }}; border-bottom: 5px solid {{ section.settings.primary_color }};' },
  { name: 'hero-5', title: 'Minimalist Hero', css: 'padding: 60px 20px; max-width: 800px; margin: 0 auto; text-align: left;' },
  { name: 'hero-6', title: 'Hero Dual CTA', css: 'text-align: center; padding: 140px 20px; background-color: {{ section.settings.bg_color }};' },
  { name: 'hero-7', title: 'Split Hero Right', css: 'display: flex; flex-direction: row-reverse; align-items: center; padding: 80px; background-color: {{ section.settings.bg_color }};' },
  { name: 'hero-8', title: 'Hero Gradient Overlay', css: 'padding: 150px 20px; text-align: center; color: white; background: linear-gradient(135deg, {{ section.settings.primary_color }}, {{ section.settings.bg_color }});' },
  { name: 'hero-9', title: 'Hero Large Image Cover', css: 'min-height: 80vh; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; color: white;' },
  { name: 'hero-10', title: 'Hero Asymmetric Pattern', css: 'padding: 100px 50px; background-image: radial-gradient(circle at 20% 50%, {{ section.settings.primary_color }}, transparent 50%); background-color: {{ section.settings.bg_color }};' },
  { name: 'hero-11', title: 'Hero Text Heavy', css: 'max-width: 900px; margin: 0 auto; padding: 80px 20px; text-align: center;' },
  { name: 'hero-12', title: 'Hero Carousel Style', css: 'padding: 120px 20px; text-align: center; border: 1px solid #eaeaea; box-shadow: 0 10px 30px rgba(0,0,0,0.05);' },
  { name: 'hero-13', title: 'Hero Countdown', css: 'padding: 100px 20px; text-align: center; background-color: {{ section.settings.bg_color }};' },
  { name: 'hero-14', title: 'Hero Glassmorphism', css: 'margin: 40px; padding: 80px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border-radius: 20px; text-align: center;' },
  { name: 'hero-15', title: 'Hero E-commerce Conversion', css: 'padding: 100px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; background-color: {{ section.settings.bg_color }};' }
];

const productLayouts = [
  { name: 'product-1', title: 'Featured Product Classic', style: 'grid' },
  { name: 'product-2', title: 'Product Zig Zag', style: 'zigzag' },
  { name: 'product-3', title: 'Product Carousel', style: 'carousel' },
  { name: 'product-4', title: 'Product Sticky Scroll', style: 'sticky' },
  { name: 'product-5', title: 'Product Minimal Grid', style: 'grid' },
  { name: 'product-6', title: 'Product Large Imagery', style: 'large' },
  { name: 'product-7', title: 'Product Detail Highlight', style: 'highlight' },
  { name: 'product-8', title: 'Product Comparison', style: 'compare' },
  { name: 'product-9', title: 'Product Collection Grid', style: 'grid' },
  { name: 'product-10', title: 'Product Quick Add Grid', style: 'quickadd' },
  { name: 'product-11', title: 'Product Lookbook', style: 'lookbook' },
  { name: 'product-12', title: 'Product Bundle Offer', style: 'bundle' },
  { name: 'product-13', title: 'Product Subscription Hero', style: 'sub' },
  { name: 'product-14', title: 'Product Trust Focused', style: 'trust' },
  { name: 'product-15', title: 'Product Social Proof', style: 'social' }
];

function generateHeroLiquid(layout: any) {
  return `<div class="sf-hero-section" id="${layout.name}" style="${layout.css}">
  {% if section.settings.image != blank %}
    <img src="{{ section.settings.image | img_url: 'master' }}" alt="{{ section.settings.title }}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />
  {% endif %}
  <h1 style="color: {{ section.settings.heading_color }}; font-size: 3rem; margin-bottom: 10px;">{{ section.settings.title }}</h1>
  <p style="color: {{ section.settings.text_color }}; font-size: 1.2rem; margin-bottom: 30px; line-height: 1.5;">{{ section.settings.subtitle }}</p>
  {% if section.settings.show_button %}
    <a href="{{ section.settings.button_link }}" style="display: inline-block; padding: 15px 30px; background-color: {{ section.settings.primary_color }}; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; transition: opacity 0.3s;">
      {{ section.settings.button_text }}
    </a>
  {% endif %}
</div>

{% schema %}
{
  "name": "${layout.title}",
  "target": "section",
  "settings": [
    { "type": "text", "id": "title", "label": "Headline", "default": "${layout.title}" },
    { "type": "textarea", "id": "subtitle", "label": "Subheadline", "default": "Upgrade your store with premium StoreForge sections." },
    { "type": "image_picker", "id": "image", "label": "Hero Image" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "#f4f4f4" },
    { "type": "color", "id": "heading_color", "label": "Heading Color", "default": "#111111" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#555555" },
    { "type": "color", "id": "primary_color", "label": "Button Color", "default": "#000000" },
    { "type": "checkbox", "id": "show_button", "label": "Show Button", "default": true },
    { "type": "text", "id": "button_text", "label": "Button Text", "default": "Shop Now" },
    { "type": "url", "id": "button_link", "label": "Button Link" }
  ]
}
{% endschema %}
`;
}

function generateProductLiquid(layout: any) {
  return `<div class="sf-product-section ${layout.style}" id="${layout.name}" style="padding: 60px 20px; background-color: {{ section.settings.bg_color }};">
  <div style="text-align: center; margin-bottom: 40px;">
    <h2 style="font-size: 2.2rem; color: {{ section.settings.heading_color }};">{{ section.settings.title }}</h2>
  </div>
  
  {% if section.settings.product != blank %}
    {% assign product = all_products[section.settings.product] %}
    <div style="display: flex; gap: 40px; align-items: center; max-width: 1200px; margin: 0 auto; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 300px;">
        <img src="{{ product.featured_image | img_url: '800x' }}" alt="{{ product.title }}" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
      </div>
      <div style="flex: 1; min-width: 300px; padding: 20px;">
        <h3 style="font-size: 1.8rem; margin-bottom: 10px; color: {{ section.settings.heading_color }};">{{ product.title }}</h3>
        <p style="font-size: 1.4rem; font-weight: bold; margin-bottom: 20px; color: {{ section.settings.primary_color }};">{{ product.price | money }}</p>
        <div style="margin-bottom: 30px; line-height: 1.6; color: #666;">
          {{ product.description | strip_html | truncatewords: 30 }}
        </div>
        <form action="/cart/add" method="post" enctype="multipart/form-data">
          <input type="hidden" name="id" value="{{ product.variants.first.id }}" />
          <button type="submit" style="width: 100%; padding: 15px; background-color: {{ section.settings.primary_color }}; color: #fff; border: none; border-radius: 5px; font-size: 1.1rem; font-weight: bold; cursor: pointer;">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  {% else %}
    <div style="text-align: center; padding: 40px; border: 2px dashed #ccc; border-radius: 10px;">
      <p style="font-size: 1.2rem; color: #888;">Select a product in the theme editor to view.</p>
    </div>
  {% endif %}
</div>

{% schema %}
{
  "name": "${layout.title}",
  "target": "section",
  "settings": [
    { "type": "text", "id": "title", "label": "Section Title", "default": "${layout.title}" },
    { "type": "product", "id": "product", "label": "Select Product" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "#ffffff" },
    { "type": "color", "id": "heading_color", "label": "Heading Color", "default": "#000000" },
    { "type": "color", "id": "primary_color", "label": "Primary Color", "default": "#000000" }
  ]
}
{% endschema %}
`;
}

async function main() {
  console.log('Generating Batch A (30 sections: 15 Hero, 15 Product)...');
  
  if (!fs.existsSync(BLOCKS_DIR)) {
    fs.mkdirSync(BLOCKS_DIR, { recursive: true });
  }

  for (const hero of heroLayouts) {
    const content = generateHeroLiquid(hero);
    fs.writeFileSync(path.join(BLOCKS_DIR, `${hero.name}.liquid`), content, 'utf8');
    console.log(`✅ Generated ${hero.name}.liquid`);
  }

  for (const product of productLayouts) {
    const content = generateProductLiquid(product);
    fs.writeFileSync(path.join(BLOCKS_DIR, `${product.name}.liquid`), content, 'utf8');
    console.log(`✅ Generated ${product.name}.liquid`);
  }

  console.log('Batch A Generation Complete! 🎉');
}

main().catch(console.error);
