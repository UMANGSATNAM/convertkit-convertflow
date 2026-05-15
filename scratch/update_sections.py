import re

file_path = "i:/converflow app/app/routes/app.templates.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

premium_sections = """const SECTIONS_CODE = {
  "omni-countdown-timer.liquid": `
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<div class="omni-countdown" style="background-color: {{ section.settings.bg_color }}; padding: clamp(40px, 8vw, 80px) 20px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.05);">
  <h2 style="font-family: 'Cormorant Garamond', serif; font-size: clamp(24px, 4vw, 32px); color: {{ section.settings.text_color }}; margin-bottom: 30px; font-weight: 300; letter-spacing: 1px;">{{ section.settings.title }}</h2>
  <div class="omni-timer-display" style="display: flex; justify-content: center; gap: clamp(10px, 3vw, 40px); color: {{ section.settings.text_color }}; font-family: 'Montserrat', sans-serif;">
    <div style="text-align: center;"><div style="font-size: clamp(24px, 5vw, 48px); font-weight: 300; padding: 0 10px;">23</div><span style="font-size: 9px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6;">Hours</span></div>
    <div style="font-size: clamp(24px, 5vw, 48px); font-weight: 300; opacity: 0.3;">:</div>
    <div style="text-align: center;"><div style="font-size: clamp(24px, 5vw, 48px); font-weight: 300; padding: 0 10px;">59</div><span style="font-size: 9px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6;">Minutes</span></div>
    <div style="font-size: clamp(24px, 5vw, 48px); font-weight: 300; opacity: 0.3;">:</div>
    <div style="text-align: center;"><div style="font-size: clamp(24px, 5vw, 48px); font-weight: 300; padding: 0 10px;">59</div><span style="font-size: 9px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6;">Seconds</span></div>
  </div>
</div>
{% schema %}
{ "name": "Countdown Timer", "settings": [
  { "type": "text", "id": "title", "label": "Heading", "default": "A Rare Opportunity." },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#faf9f8" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" }
], "presets": [{"name": "Countdown Timer"}] }
{% endschema %}
  `,
  "omni-image-hotspot.liquid": `
<div class="omni-hotspot-section" style="background: {{ section.settings.bg_color }}; padding: clamp(80px, 15vw, 160px) 20px; text-align: center;">
  <h2 style="font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 56px); font-weight: 300; margin-bottom: 60px; color: {{ section.settings.text_color }}">{{ section.settings.title }}</h2>
  <div style="position: relative; max-width: 1000px; margin: 0 auto; background: #e0e0e0; aspect-ratio: 4/5; border-radius: 4px; overflow: hidden; background-image: url('https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2000&auto=format&fit=crop'); background-size: cover; background-position: center;">
    {% for block in section.blocks %}
      <div class="omni-hotspot" style="position: absolute; top: {{ block.settings.top }}%; left: {{ block.settings.left }}%; width: 14px; height: 14px; background: rgba(255,255,255,0.9); border-radius: 50%; box-shadow: 0 0 0 6px rgba(255,255,255,0.2); cursor: pointer; transform: translate(-50%, -50%); z-index: 2; transition: all 0.3s ease;">
        <div style="position: absolute; top: -15px; left: 30px; background: rgba(0,0,0,0.8); color: #fff; padding: 12px 20px; border-radius: 2px; white-space: nowrap; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 400; letter-spacing: 1px; opacity: 0; visibility: hidden; transition: all 0.3s ease; backdrop-filter: blur(4px);" class="omni-hotspot-tooltip">{{ block.settings.product_title }}</div>
      </div>
    {% endfor %}
    <style>
      .omni-hotspot:hover { background: #fff; box-shadow: 0 0 0 10px rgba(255,255,255,0.3); }
      .omni-hotspot:hover .omni-hotspot-tooltip { opacity: 1 !important; visibility: visible !important; transform: translateX(10px); }
      @media (min-width: 768px) { .omni-hotspot-section > div { aspect-ratio: 16/9; } }
    </style>
  </div>
</div>
{% schema %}
{ "name": "Image Hotspots", "settings": [
  { "type": "text", "id": "title", "label": "Heading", "default": "Curated Regimens." },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#ffffff" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" }
], "blocks": [
  { "type": "hotspot", "name": "Hotspot", "settings": [
    { "type": "range", "id": "top", "min": 0, "max": 100, "label": "Top Position %", "default": 50 },
    { "type": "range", "id": "left", "min": 0, "max": 100, "label": "Left Position %", "default": 50 },
    { "type": "text", "id": "product_title", "label": "Tooltip Text", "default": "Discover Product" }
  ]}
], "presets": [{"name": "Image Hotspots"}] }
{% endschema %}
  `,
  "omni-cosmetic-hero.liquid": `
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<div class="omni-premium-hero" style="background-color: {{ section.settings.background_color }};">
  <div class="omni-hero-bg" style="background: rgba(0,0,0,{{ section.settings.overlay_opacity | divided_by: 100.0 }});"></div>
  <div class="omni-hero-content omni-align-{{ section.settings.alignment }}">
    {% if section.settings.subheading != blank %}<p class="omni-hero-subheading" style="color: {{ section.settings.text_color }}">{{ section.settings.subheading }}</p>{% endif %}
    {% if section.settings.title != blank %}<h1 class="omni-hero-title" style="color: {{ section.settings.text_color }}">{{ section.settings.title }}</h1>{% endif %}
    {% if section.settings.button_text != blank %}<a href="{{ section.settings.button_link }}" class="omni-hero-button" style="color: {{ section.settings.button_text_color }}; border-color: {{ section.settings.button_color }}; background: {{ section.settings.button_color }};">{{ section.settings.button_text }}</a>{% endif %}
  </div>
</div>
<style>
  .omni-premium-hero { position: relative; width: 100%; min-height: {{ section.settings.height }}px; display: flex; align-items: center; justify-content: center; overflow: hidden; font-family: 'Cormorant Garamond', serif; }
  .omni-hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
  .omni-hero-content { position: relative; z-index: 2; padding: clamp(40px, 8vw, 80px); max-width: 1000px; width: 100%; display: flex; flex-direction: column; }
  .omni-align-center { align-items: center; text-align: center; } .omni-align-left { align-items: flex-start; text-align: left; } .omni-align-right { align-items: flex-end; text-align: right; }
  .omni-hero-subheading { font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 24px; opacity: 0.8; }
  .omni-hero-title { font-size: clamp(48px, 8vw, 96px); font-weight: 300; line-height: 1.05; margin: 0 0 40px 0; letter-spacing: -1px; }
  .omni-hero-button { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 18px 48px; border: 1px solid; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .omni-hero-button:hover { opacity: 0.7; }
</style>
{% schema %}
{ "name": "Premium Hero", "settings": [
  { "type": "color", "id": "background_color", "label": "BG Color", "default": "#faf9f8" },
  { "type": "range", "id": "height", "min": 400, "max": 1000, "step": 50, "label": "Height", "default": 800 },
  { "type": "range", "id": "overlay_opacity", "min": 0, "max": 100, "step": 5, "label": "Overlay Opacity", "default": 0 },
  { "type": "select", "id": "alignment", "label": "Alignment", "options": [{"value":"left","label":"Left"},{"value":"center","label":"Center"},{"value":"right","label":"Right"}], "default": "center" },
  { "type": "text", "id": "subheading", "label": "Subheading", "default": "NEW ARRIVALS" },
  { "type": "text", "id": "title", "label": "Title", "default": "The Glow Collection." },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" },
  { "type": "text", "id": "button_text", "label": "Button Text", "default": "Shop Now" },
  { "type": "url", "id": "button_link", "label": "Button Link" },
  { "type": "color", "id": "button_color", "label": "Button BG", "default": "transparent" },
  { "type": "color", "id": "button_text_color", "label": "Button Text", "default": "#1a1a1a" }
], "presets": [{"name": "Premium Hero"}] }
{% endschema %}
  `,
  "omni-cosmetic-marquee.liquid": `
<div class="omni-cosmetic-marquee" style="background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; padding: {{ section.settings.padding }}px 0;">
  <div class="omni-marquee-track" style="animation-duration: {{ section.settings.speed }}s;">
    {% for i in (1..10) %}<span class="omni-marquee-text">{{ section.settings.text }}</span><span class="omni-marquee-dot">•</span>{% endfor %}
  </div>
</div>
<style>
  .omni-cosmetic-marquee { width: 100%; overflow: hidden; white-space: nowrap; border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); }
  .omni-marquee-track { display: inline-block; animation: omni-marquee-scroll linear infinite; font-family: 'Montserrat', sans-serif; }
  .omni-marquee-text { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 400; opacity: 0.8; }
  .omni-marquee-dot { margin: 0 40px; font-size: 14px; opacity: 0.3; }
  @keyframes omni-marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>
{% schema %}
{ "name": "Premium Marquee", "settings": [
  { "type": "text", "id": "text", "label": "Text", "default": "CRUELTY FREE • VEGAN • DERMATOLOGIST TESTED" },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#ffffff" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" },
  { "type": "range", "id": "padding", "min": 10, "max": 60, "step": 2, "label": "Padding", "default": 24 },
  { "type": "range", "id": "speed", "min": 5, "max": 60, "step": 1, "label": "Speed", "default": 20 }
], "presets": [{"name": "Premium Marquee"}] }
{% endschema %}
  `,
  "omni-cosmetic-image-text.liquid": `
<div class="omni-cosmetic-image-text omni-layout-{{ section.settings.layout }}" style="background-color: {{ section.settings.bg_color }};">
  <div class="omni-it-image-wrapper">
    <div class="omni-it-image" style="background-image: url('https://images.unsplash.com/photo-1615397323204-c54d1d916526?q=80&w=1000');"></div>
  </div>
  <div class="omni-it-content-wrapper">
    <div class="omni-it-content" style="text-align: {{ section.settings.alignment }};">
      <h2 class="omni-it-heading" style="color: {{ section.settings.text_color }}">{{ section.settings.heading }}</h2>
      <div class="omni-it-text" style="color: {{ section.settings.text_color }};">{{ section.settings.text }}</div>
      {% if section.settings.button_text != blank %}<a href="#" class="omni-it-button" style="border-color: {{ section.settings.button_bg }}; color: {{ section.settings.button_bg }};">{{ section.settings.button_text }}</a>{% endif %}
    </div>
  </div>
</div>
<style>
  .omni-cosmetic-image-text { display: flex; flex-wrap: wrap; width: 100%; align-items: stretch; } 
  .omni-layout-image_right { flex-direction: row-reverse; }
  .omni-it-image-wrapper { flex: 1 1 50%; min-width: 300px; padding: clamp(40px, 8vw, 120px); display: flex; justify-content: center; align-items: center; }
  .omni-it-image { width: 100%; aspect-ratio: 3/4; background-size: cover; background-position: center; border-radius: 2px; }
  .omni-layout-image_left .omni-it-image { transform: translateX(20px); }
  .omni-layout-image_right .omni-it-image { transform: translateX(-20px); }
  .omni-it-content-wrapper { flex: 1 1 50%; min-width: 300px; display: flex; align-items: center; padding: clamp(40px, 8vw, 120px); }
  .omni-it-content { max-width: 480px; margin: 0 auto; }
  .omni-it-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 56px); margin-bottom: 30px; font-weight: 300; line-height: 1.1; letter-spacing: -0.5px; }
  .omni-it-text { font-family: 'Montserrat', sans-serif; font-size: 14px; line-height: 1.8; margin-bottom: 40px; font-weight: 300; opacity: 0.7; }
  .omni-it-button { font-family: 'Montserrat', sans-serif; display: inline-block; padding: 16px 0; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; text-decoration: none; border-bottom: 1px solid; transition: opacity 0.3s ease; }
  .omni-it-button:hover { opacity: 0.5; }
</style>
{% schema %}
{ "name": "Premium Image w/ Text", "settings": [
  { "type": "select", "id": "layout", "label": "Layout", "options": [{"value":"image_left","label":"Image Left"},{"value":"image_right","label":"Image Right"}], "default": "image_left" },
  { "type": "select", "id": "alignment", "label": "Text Alignment", "options": [{"value":"left","label":"Left"},{"value":"center","label":"Center"}], "default": "left" },
  { "type": "text", "id": "heading", "label": "Heading", "default": "Clean & Conscious." },
  { "type": "textarea", "id": "text", "label": "Text", "default": "Our formulas are created with sensitive skin in mind. Efficacy meets elegance in every drop." },
  { "type": "text", "id": "button_text", "label": "Button Text", "default": "Discover Our Story" },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#faf9f8" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" },
  { "type": "color", "id": "button_bg", "label": "Button Color", "default": "#1a1a1a" }
], "presets": [{"name": "Premium Image w/ Text"}] }
{% endschema %}
  `,
  "omni-cosmetic-products.liquid": `
<div class="omni-cosmetic-products" style="background-color: {{ section.settings.bg_color }}; padding: clamp(80px, 15vw, 160px) 20px;">
  <div class="omni-cp-header" style="text-align: {{ section.settings.alignment }}; margin-bottom: 60px;">
    <h2 class="omni-cp-title" style="color: {{ section.settings.text_color }}">{{ section.settings.heading }}</h2>
    {% if section.settings.subheading != blank %}<p style="color: {{ section.settings.text_color }}; opacity: 0.6; margin-top: 15px; font-family: 'Montserrat', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">{{ section.settings.subheading }}</p>{% endif %}
  </div>
  <div class="omni-cp-grid">
    {% for i in (1..section.settings.limit) %}
      <div class="omni-cp-item">
        <div class="omni-cp-image-wrapper" style="background: {{ section.settings.card_bg }};">
           <div class="omni-cp-quick-add">Quick Add +</div>
        </div>
        <div class="omni-cp-info">
          <h3 class="omni-cp-product-title" style="color: {{ section.settings.text_color }}">The Elixir Serum</h3>
          <p class="omni-cp-price" style="color: {{ section.settings.text_color }}">$85.00</p>
        </div>
      </div>
    {% endfor %}
  </div>
</div>
<style>
  .omni-cosmetic-products { width: 100%; max-width: 1400px; margin: 0 auto; }
  .omni-cp-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 56px); font-weight: 300; margin: 0; letter-spacing: -0.5px; }
  .omni-cp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px; padding: 0 20px; }
  .omni-cp-image-wrapper { width: 100%; aspect-ratio: 3/4; margin-bottom: 20px; border-radius: 2px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.5s ease; }
  .omni-cp-image-wrapper:hover { transform: scale(0.98); }
  .omni-cp-quick-add { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(255,255,255,0.9); backdrop-filter: blur(5px); padding: 15px; text-align: center; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .omni-cp-image-wrapper:hover .omni-cp-quick-add { transform: translateY(0); }
  .omni-cp-info { text-align: center; font-family: 'Montserrat', sans-serif; } 
  .omni-cp-product-title { font-size: 13px; font-weight: 400; margin: 0 0 8px 0; letter-spacing: 1px; } 
  .omni-cp-price { font-size: 13px; margin: 0; opacity: 0.6; }
</style>
{% schema %}
{ "name": "Premium Products", "settings": [
  { "type": "text", "id": "heading", "label": "Heading", "default": "The Icons." },
  { "type": "text", "id": "subheading", "label": "Subheading", "default": "CURATED ESSENTIALS" },
  { "type": "select", "id": "alignment", "label": "Alignment", "options": [{"value":"left","label":"Left"},{"value":"center","label":"Center"}], "default": "center" },
  { "type": "range", "id": "limit", "min": 2, "max": 8, "step": 1, "label": "Limit", "default": 4 },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#ffffff" },
  { "type": "color", "id": "card_bg", "label": "Card BG", "default": "#f0edea" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" }
], "presets": [{"name": "Premium Products"}] }
{% endschema %}
  `,
  "omni-cosmetic-logos.liquid": `
<div class="omni-logos" style="background-color: {{ section.settings.bg_color }}; padding: clamp(60px, 10vw, 120px) 20px;">
  <p style="text-align: center; color: {{ section.settings.text_color }}; font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.5;">{{ section.settings.title }}</p>
  <div style="display: flex; justify-content: center; align-items: center; gap: clamp(40px, 8vw, 100px); flex-wrap: wrap; margin-top: 40px; opacity: 0.7;">
    {% for block in section.blocks %}
      <div style="font-weight: 400; font-size: clamp(20px, 3vw, 28px); font-family: 'Cormorant Garamond', serif; color: {{ section.settings.text_color }}">{{ block.settings.title }}</div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "Premium Logos", "settings": [
  { "type": "text", "id": "title", "label": "Heading", "default": "RECOGNIZED BY" },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#faf9f8" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" }
], "blocks": [
  { "type": "logo", "name": "Logo Text", "settings": [ { "type": "text", "id": "title", "label": "Brand Name", "default": "VOGUE" } ] }
], "presets": [{"name": "Premium Logos"}] }
{% endschema %}
  `,
  "omni-cosmetic-testimonials.liquid": `
<div class="omni-testimonials" style="background-color: {{ section.settings.bg_color }}; padding: clamp(80px, 15vw, 160px) 20px; text-align: center;">
  <h2 style="font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 56px); font-weight: 300; color: {{ section.settings.text_color }}; margin-bottom: 60px; letter-spacing: -0.5px;">{{ section.settings.title }}</h2>
  <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; max-width: 1400px; margin: 0 auto;">
    {% for block in section.blocks %}
      <div style="background: {{ section.settings.card_bg }}; padding: 60px 40px; flex: 1 1 350px; border-radius: 2px; border: 1px solid rgba(0,0,0,0.03);">
        <div style="color: {{ section.settings.text_color }}; margin-bottom: 30px; font-size: 16px; opacity: 0.8;">★★★★★</div>
        <p style="font-family: 'Cormorant Garamond', serif; color: {{ section.settings.text_color }}; font-size: clamp(20px, 2.5vw, 28px); line-height: 1.4; font-style: italic;">"{{ block.settings.quote }}"</p>
        <strong style="font-family: 'Montserrat', sans-serif; color: {{ section.settings.text_color }}; display: block; margin-top: 40px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6;">— {{ block.settings.author }}</strong>
      </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "Premium Testimonials", "settings": [
  { "type": "text", "id": "title", "label": "Heading", "default": "Words From Our Community." },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#ffffff" },
  { "type": "color", "id": "card_bg", "label": "Card BG", "default": "#faf9f8" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" }
], "blocks": [
  { "type": "review", "name": "Review", "settings": [ 
    { "type": "textarea", "id": "quote", "label": "Quote", "default": "This completely transformed my routine." },
    { "type": "text", "id": "author", "label": "Author", "default": "Sarah J." }
  ] }
], "presets": [{"name": "Premium Testimonials"}] }
{% endschema %}
  `,
  "omni-cosmetic-faq.liquid": `
<div class="omni-faq" style="background-color: {{ section.settings.bg_color }}; padding: clamp(80px, 15vw, 160px) 20px;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 56px); font-weight: 300; color: {{ section.settings.text_color }}; margin-bottom: 60px; text-align: center; letter-spacing: -0.5px;">{{ section.settings.title }}</h2>
    {% for block in section.blocks %}
      <details style="margin-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 20px;">
        <summary style="font-family: 'Montserrat', sans-serif; font-weight: 400; font-size: 14px; letter-spacing: 1px; cursor: pointer; color: {{ section.settings.text_color }}; padding: 10px 0; outline: none;">{{ block.settings.question }}</summary>
        <p style="font-family: 'Montserrat', sans-serif; margin-top: 20px; color: {{ section.settings.text_color }}; opacity: 0.6; line-height: 1.8; font-size: 13px; font-weight: 300;">{{ block.settings.answer }}</p>
      </details>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "Premium FAQ", "settings": [
  { "type": "text", "id": "title", "label": "Heading", "default": "Inquiries." },
  { "type": "color", "id": "bg_color", "label": "Background", "default": "#faf9f8" },
  { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1a1a1a" }
], "blocks": [
  { "type": "faq", "name": "FAQ Item", "settings": [ 
    { "type": "text", "id": "question", "label": "Question", "default": "Are your products cruelty-free?" },
    { "type": "textarea", "id": "answer", "label": "Answer", "default": "Yes, all of our products are 100% cruelty-free and never tested on animals." }
  ] }
], "presets": [{"name": "Premium FAQ"}] }
{% endschema %}
  `
};"""

new_content = re.sub(r'const SECTIONS_CODE = \{.*?\n\};\n', premium_sections + '\n', content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated SECTIONS_CODE successfully.")
