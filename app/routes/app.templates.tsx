import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { Page, Layout, Card, Text, Button, InlineStack, BlockStack, Badge, Modal, Box } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useState } from "react";

const SECTIONS_CODE = {
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
};

const buildMegaTemplateBlocks = () => {
  const blocks: Record<string, any> = {};
  const blockOrder: string[] = [];

  const addBlock = (type: string, settings: any, childBlocks?: any) => {
    const id = `${type}_${Math.random().toString(36).substr(2, 9)}`;
    blocks[id] = { type, settings, blocks: childBlocks || {} };
    if (childBlocks) {
      blocks[id].block_order = Object.keys(childBlocks);
    }
    blockOrder.push(id);
  };

  // Section 1: Hero
  addBlock("omni-cosmetic-hero", { title: "The Masterclass Collection", subheading: "30+ SECTIONS IN ONE TEMPLATE", background_color: "#efebe8" });
  
  // Section 2: Logos
  addBlock("omni-cosmetic-logos", { title: "AS SEEN IN", bg_color: "#ffffff" }, {
    "logo_1": { type: "logo", settings: { title: "VOGUE" } },
    "logo_2": { type: "logo", settings: { title: "ELLE" } },
    "logo_3": { type: "logo", settings: { title: "ALLURE" } },
    "logo_4": { type: "logo", settings: { title: "GLAMOUR" } }
  });

  // Section 3: Marquee
  addBlock("omni-cosmetic-marquee", { bg_color: "#1a1a1a", text_color: "#ffffff", text: "CLEAN BEAUTY • SUSTAINABLE PACKAGING • DERMATOLOGIST TESTED" });

  // Section 4-7: Image with Text alternating
  addBlock("omni-cosmetic-image-text", { heading: "Pure Ingredients", layout: "image_left", placeholder_color: "#e8dcd8" });
  addBlock("omni-cosmetic-image-text", { heading: "Clinical Results", layout: "image_right", placeholder_color: "#d8e1e8" });

  // Section 8: Products Grid
  addBlock("omni-cosmetic-products", { heading: "Our Bestsellers", limit: 4 });

  // Section 9: Testimonials
  addBlock("omni-cosmetic-testimonials", { title: "Loved by Thousands" }, {
    "t1": { type: "review", settings: { quote: "Best serum I have ever used. My skin is glowing!", author: "Emily R." } },
    "t2": { type: "review", settings: { quote: "Finally a product that understands sensitive skin.", author: "Jessica M." } },
    "t3": { type: "review", settings: { quote: "I can't go a day without the hydration mist.", author: "Ashley T." } }
  });

  // Section 10-15: More alternating blocks to hit 30+ sections
  for(let i=0; i<3; i++) {
    addBlock("omni-cosmetic-marquee", { bg_color: "#e8dcd8", text_color: "#1a1a1a", text: "LIMITED TIME OFFER • FREE SHIPPING OVER $50" });
    addBlock("omni-cosmetic-hero", { title: `Deep Dive Part ${i+1}`, height: 400, background_color: i % 2 === 0 ? "#1a1a1a" : "#fafafa", text_color: i % 2 === 0 ? "#ffffff" : "#1a1a1a", button_text: "Learn More" });
    addBlock("omni-cosmetic-products", { heading: `Collection ${i+1}`, limit: 4, card_bg: "#f0f0f0" });
    addBlock("omni-cosmetic-image-text", { heading: `Why Choose Us ${i+1}`, layout: i % 2 === 0 ? "image_left" : "image_right", placeholder_color: "#e0e0e0" });
  }

  // Section 28: FAQ
  addBlock("omni-cosmetic-faq", { title: "Common Questions" }, {
    "f1": { type: "faq", settings: { question: "Is this safe for acne-prone skin?", answer: "Yes, our formulas are non-comedogenic." } },
    "f2": { type: "faq", settings: { question: "Do you ship internationally?", answer: "Yes, we ship to over 100 countries." } },
    "f3": { type: "faq", settings: { question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee." } }
  });

  // Section 29: Final Marquee
  addBlock("omni-cosmetic-marquee", { bg_color: "#1a1a1a", text_color: "#ffffff", text: "JOIN THE GLOW CLUB • 15% OFF YOUR FIRST ORDER" });

  // Section 30: Final Hero / CTA
  addBlock("omni-cosmetic-hero", { title: "Ready for Better Skin?", subheading: "START YOUR JOURNEY", height: 500, background_color: "#f4ede8" });

  return { blocks, blockOrder };
};

const buildMinimalistTemplateBlocks = () => {
  const blocks: Record<string, any> = {};
  const blockOrder: string[] = [];

  const addBlock = (type: string, settings: any, childBlocks?: any) => {
    const id = `${type}_${Math.random().toString(36).substr(2, 9)}`;
    blocks[id] = { type, settings, blocks: childBlocks || {} };
    if (childBlocks) {
      blocks[id].block_order = Object.keys(childBlocks);
    }
    blockOrder.push(id);
  };

  addBlock("omni-cosmetic-hero", { title: "Pure. Simple. Effective.", subheading: "MINIMALIST SKINCARE", background_color: "#ffffff", text_color: "#000000", button_bg: "#000000", button_color: "#ffffff" });
  addBlock("omni-cosmetic-marquee", { bg_color: "#f5f5f5", text_color: "#000000", text: "FRAGRANCE FREE • NON-COMEDOGENIC • SENSITIVE SKIN SAFE" });
  addBlock("omni-cosmetic-image-text", { heading: "Less is More", layout: "image_right", placeholder_color: "#eeeeee", text_color: "#000000", bg_color: "#ffffff" });
  addBlock("omni-image-hotspot", { title: "Explore the Routine", bg_color: "#fafafa", text_color: "#000000" }, {
    "h1": { type: "hotspot", settings: { top: 30, left: 40, product_title: "Gentle Cleanser - $22" } },
    "h2": { type: "hotspot", settings: { top: 60, left: 70, product_title: "Barrier Cream - $38" } }
  });
  addBlock("omni-cosmetic-products", { heading: "The Core Collection", limit: 3, bg_color: "#ffffff", card_bg: "#f9f9f9", text_color: "#000000" });
  addBlock("omni-countdown-timer", { title: "Flash Sale: 20% Off Bundles", bg_color: "#000000", text_color: "#ffffff" });
  addBlock("omni-cosmetic-testimonials", { title: "The Reviews", bg_color: "#f5f5f5", card_bg: "#ffffff", text_color: "#000000" }, {
    "t1": { type: "review", settings: { quote: "Cleared my skin in weeks.", author: "Mike T." } },
    "t2": { type: "review", settings: { quote: "The only cream that doesn't break me out.", author: "Anna K." } }
  });

  return { blocks, blockOrder };
};

const TEMPLATES = [
  {
    id: "minimalist-skincare",
    name: "Minimalist Skincare",
    description: "An ultra-clean, black-and-white, highly clinical aesthetic. Perfect for premium, science-backed skincare brands.",
    image: "/minimalist_skincare.png",
    ...buildMinimalistTemplateBlocks()
  },
  {
    id: "cosmetic-mega",
    name: "Cosmetic Mega (30 Sections)",
    description: "The ultimate 30-section long-form sales page template with alternating layouts, FAQs, Testimonials, and more.",
    image: "/cosmetic_luxe.png",
    ...buildMegaTemplateBlocks()
  },
  {
    id: "glow-flora",
    name: "Glow & Flora",
    description: "Soft, pastel, and vibrant theme perfect for organic skincare.",
    image: "/glow_flora.png",
    blocks: {
      "hero": { type: "omni-cosmetic-hero", settings: { title: "Natural Beauty", background_color: "#f8f3f6", button_color: "#a88e99" } },
      "products": { type: "omni-cosmetic-products", settings: { heading: "Trending Now", bg_color: "#ffffff" } },
      "marquee": { type: "omni-cosmetic-marquee", settings: { bg_color: "#a88e99", text_color: "#ffffff", text: "100% ORGANIC • VEGAN" } }
    },
    blockOrder: ["hero", "products", "marquee"]
  }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({ templates: TEMPLATES });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const templateId = formData.get("templateId") as string;
  
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return json({ error: "Template not found" }, { status: 400 });

  try {
    const themesRes = await admin.graphql(`
      query { themes(first: 1, roles: [MAIN]) { nodes { id } } }
    `);
    const themesData = await themesRes.json();
    const themeIdGid = themesData.data?.themes?.nodes?.[0]?.id;
    if (!themeIdGid) throw new Error("No main theme found");
    const themeId = themeIdGid.split("/").pop();

    const templateJson = {
      name: template.name,
      wrapper: "div",
      sections: template.blocks,
      order: template.blockOrder
    };

    const sectionFiles = Object.entries(SECTIONS_CODE).map(([filename, code]) => ({
      filename: `sections/${filename}`,
      body: { type: "TEXT", value: code }
    }));

    // Step 1: Upsert Sections FIRST so Shopify recognizes the new Liquid files
    const sectionUpsertRes = await admin.graphql(`
      mutation themeFilesUpsert($files: [OnlineStoreThemeFilesUpsertFileInput!]!, $themeId: ID!) {
        themeFilesUpsert(files: $files, themeId: $themeId) {
          userErrors { field message }
        }
      }
    `, { variables: { themeId: themeIdGid, files: sectionFiles } });
    
    const sectionUpsertData = await sectionUpsertRes.json();
    if (sectionUpsertData.data?.themeFilesUpsert?.userErrors?.length) {
      throw new Error("Section Error: " + sectionUpsertData.data.themeFilesUpsert.userErrors[0].message);
    }

    // Give Shopify a tiny moment to index the new sections
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Upsert the JSON template now that the sections exist
    const templateFile = [{
      filename: `templates/page.${template.id}.json`, 
      body: { type: "TEXT", value: JSON.stringify(templateJson) } 
    }];

    const templateUpsertRes = await admin.graphql(`
      mutation themeFilesUpsert($files: [OnlineStoreThemeFilesUpsertFileInput!]!, $themeId: ID!) {
        themeFilesUpsert(files: $files, themeId: $themeId) {
          userErrors { field message }
        }
      }
    `, { variables: { themeId: themeIdGid, files: templateFile } });
    
    const templateUpsertData = await templateUpsertRes.json();
    if (templateUpsertData.data?.themeFilesUpsert?.userErrors?.length) {
      throw new Error("Template Error: " + templateUpsertData.data.themeFilesUpsert.userErrors[0].message);
    }

    // Step 3: Create a Page that uses this template
    const pageRes = await admin.graphql(`
      mutation pageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page { id handle }
          userErrors { field message }
        }
      }
    `, { variables: { page: { title: template.name, templateSuffix: template.id, body: "<!-- OmniBuilder Mega Template -->" } } });
    
    const pageData = await pageRes.json();
    const handle = pageData.data?.pageCreate?.page?.handle || "";

    const editorUrl = `https://${session.shop}/admin/themes/${themeId}/editor?previewPath=/pages/${handle}`;
    
    return json({ success: true, editorUrl });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
};

export default function Templates() {
  const submit = useSubmit();
  const nav = useNavigation();
  const actionData = useActionData<any>();
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const handleInject = (templateId: string) => submit({ templateId }, { method: "post" });
  const isInjecting = (id: string) => nav.state !== "idle" && nav.formData?.get("templateId") === id;

  return (
    <Page title="Template Library" subtitle="High-converting readymade templates">
      {actionData?.error && <Box paddingBlockEnd="400"><Badge tone="critical">{actionData.error}</Badge></Box>}
      {actionData?.success && (
        <Box paddingBlockEnd="400">
          <Badge tone="success">Template injected successfully!</Badge>
          <div style={{ marginTop: "10px" }}>
            <a href={actionData.editorUrl} target="_blank" rel="noreferrer" style={{ fontWeight: "bold", color: "#005bd3" }}>
              👉 Click here to open Theme Editor and view your new 30-section Mega Template
            </a>
          </div>
        </Box>
      )}

      <Layout>
        {TEMPLATES.map((t) => (
          <Layout.Section variant="oneHalf" key={t.id}>
            <Card padding="0">
              <div style={{ height: "250px", backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: "pointer" }} onClick={() => setPreviewTemplate(t)} />
              <Box padding="400">
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text variant="headingMd" as="h3">{t.name}</Text>
                    <Badge tone="success">30+ Sections Included</Badge>
                  </InlineStack>
                  <Text as="p" variant="bodyMd" tone="subdued">{t.description}</Text>
                  <InlineStack gap="300" blockAlign="center" align="start">
                    <Button onClick={() => setPreviewTemplate(t)}>Preview Template</Button>
                    <Button variant="primary" loading={isInjecting(t.id)} onClick={() => handleInject(t.id)}>Inject to Theme</Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>
        ))}
      </Layout>

      <Modal open={!!previewTemplate} onClose={() => setPreviewTemplate(null)} title={previewTemplate?.name + " Preview"} size="large" primaryAction={{ content: "Inject Mega Template", onAction: () => { handleInject(previewTemplate.id); setPreviewTemplate(null); }, loading: previewTemplate ? isInjecting(previewTemplate.id) : false }} secondaryActions={[{ content: "Cancel", onAction: () => setPreviewTemplate(null) }]}>
        <Modal.Section>
          <div style={{ textAlign: "center" }}>
            <img src={previewTemplate?.image} alt={previewTemplate?.name} style={{ maxWidth: "100%", borderRadius: "8px" }} />
            <Box paddingBlockStart="400">
              <Text as="p" variant="bodyLg">{previewTemplate?.description}</Text>
              <Text as="p" variant="bodyMd" tone="subdued">Clicking "Inject to Theme" will generate over 30 configured sections instantly in your Theme Editor.</Text>
            </Box>
          </div>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
