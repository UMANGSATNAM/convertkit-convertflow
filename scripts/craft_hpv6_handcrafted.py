import os
import json

SECTIONS_DIR = r"i:\converflow app\dev-theme-peri\sections"
TEMPLATES_DIR = r"i:\converflow app\dev-theme-peri\templates"

# 1. Announcement
announcement = """
<style>
  .hpv6-announcement { background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; text-align: center; padding: 12px 24px; font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
  .hpv6-announcement p { margin: 0; }
  .hpv6-announcement a { color: inherit; font-weight: bold; }
</style>
<div class="hpv6-announcement">
  <p>{{ section.settings.text }}</p>
</div>
{% schema %}
{
  "name": "HPV6 Announcement",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "text", "label": "Text", "default": "Free shipping on orders over $150. Shop now." },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#1A202C" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#F7FAFC" }
  ],
  "presets": [{ "name": "HPV6 Announcement" }]
}
{% endschema %}
"""

# 2. Hero
hero = """
<style>
  .hpv6-hero { display: flex; align-items: center; min-height: 85vh; background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; padding: 0 5%; font-family: 'Georgia', serif; }
  .hpv6-hero__text { flex: 1; padding-right: 5%; }
  .hpv6-hero__img { flex: 1; height: 75vh; background-color: #E2E8F0; object-fit: cover; }
  .hpv6-hero__tag { font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 24px; display: block; opacity: 0.8; }
  .hpv6-hero h1 { font-size: clamp(3rem, 5vw, 6rem); font-weight: 300; line-height: 1.1; margin: 0 0 24px; letter-spacing: -1px; }
  .hpv6-hero p { font-family: 'Inter', sans-serif; font-size: 18px; line-height: 1.6; opacity: 0.7; margin-bottom: 48px; max-width: 480px; }
  .hpv6-hero__btn { display: inline-block; padding: 18px 48px; border: 1px solid {{ section.settings.text_color }}; color: {{ section.settings.text_color }}; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; text-decoration: none; transition: background 0.3s, color 0.3s; }
  .hpv6-hero__btn:hover { background: {{ section.settings.text_color }}; color: {{ section.settings.bg_color }}; }
  @media(max-width: 768px) { .hpv6-hero { flex-direction: column; padding: 40px 24px; text-align: center; } .hpv6-hero__text { padding-right: 0; margin-bottom: 40px; } .hpv6-hero__img { width: 100%; height: 50vh; } }
</style>
<div class="hpv6-hero">
  <div class="hpv6-hero__text">
    <span class="hpv6-hero__tag">{{ section.settings.tagline }}</span>
    <h1>{{ section.settings.title }}</h1>
    <p>{{ section.settings.subtext }}</p>
    <a href="{{ section.settings.btn_link }}" class="hpv6-hero__btn">{{ section.settings.btn_text }}</a>
  </div>
  {% if section.settings.image %}
    <img class="hpv6-hero__img" src="{{ section.settings.image | img_url: 'master' }}" alt="{{ section.settings.title }}">
  {% else %}
    <div class="hpv6-hero__img"></div>
  {% endif %}
</div>
{% schema %}
{
  "name": "HPV6 Hero",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "tagline", "label": "Tagline", "default": "NORDIC EDIT 2026" },
    { "type": "text", "id": "title", "label": "Title", "default": "Embrace The Space." },
    { "type": "textarea", "id": "subtext", "label": "Subtext", "default": "Curated sustainable homeware designed to breathe life into your personal sanctuary." },
    { "type": "text", "id": "btn_text", "label": "Button Text", "default": "Shop Collection" },
    { "type": "url", "id": "btn_link", "label": "Button Link" },
    { "type": "image_picker", "id": "image", "label": "Image" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Hero" }]
}
{% endschema %}
"""

# 3. Logo List
logo_list = """
<style>
  .hpv6-logos { padding: 60px 24px; background: {{ section.settings.bg_color }}; border-bottom: 1px solid #E2E8F0; text-align: center; }
  .hpv6-logos p { font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #A0AEC0; margin-bottom: 40px; }
  .hpv6-logos__grid { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; opacity: 0.5; filter: grayscale(100%); }
  .hpv6-logos__grid div { font-family: 'Georgia', serif; font-size: 24px; font-weight: bold; }
</style>
<div class="hpv6-logos">
  <p>{{ section.settings.title }}</p>
  <div class="hpv6-logos__grid">
    <div>VOGUE</div><div>GQ</div><div>KINFOLK</div><div>CEREAL</div><div>MONOCLE</div>
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Logo List",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "title", "label": "Heading", "default": "AS SEEN IN" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" }
  ],
  "presets": [{ "name": "HPV6 Logo List" }]
}
{% endschema %}
"""

# 4. Value Props
value_props = """
<style>
  .hpv6-values { padding: 100px 5%; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-values__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
  .hpv6-values__item { text-align: center; }
  .hpv6-values__icon { font-size: 32px; margin-bottom: 24px; }
  .hpv6-values h3 { font-family: 'Georgia', serif; font-size: 20px; font-weight: 300; margin: 0 0 16px; }
  .hpv6-values p { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; opacity: 0.7; margin: 0; }
  @media(max-width: 768px) { .hpv6-values__grid { grid-template-columns: 1fr 1fr; } }
</style>
<div class="hpv6-values">
  <div class="hpv6-values__grid">
    {% for block in section.blocks %}
    <div class="hpv6-values__item">
      <div class="hpv6-values__icon">{{ block.settings.icon }}</div>
      <h3>{{ block.settings.title }}</h3>
      <p>{{ block.settings.text }}</p>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Value Props",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "blocks": [
    {
      "type": "value",
      "name": "Value",
      "settings": [
        { "type": "text", "id": "icon", "label": "Emoji Icon", "default": "🌿" },
        { "type": "text", "id": "title", "label": "Title", "default": "Sustainable" },
        { "type": "textarea", "id": "text", "label": "Text", "default": "Ethically sourced materials." }
      ]
    }
  ],
  "presets": [{ "name": "HPV6 Value Props", "blocks": [
    { "type": "value", "settings": { "icon": "🌿", "title": "Sustainable", "text": "Ethically sourced materials." } },
    { "type": "value", "settings": { "icon": "✋", "title": "Handcrafted", "text": "Made by expert artisans." } },
    { "type": "value", "settings": { "icon": "♻️", "title": "Zero Waste", "text": "Fully recyclable packaging." } },
    { "type": "value", "settings": { "icon": "✈️", "title": "Free Shipping", "text": "On all orders over $150." } }
  ] }]
}
{% endschema %}
"""

# 5. Featured Collection
feat_coll = """
<style>
  .hpv6-coll { padding: 120px 5%; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-coll__header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; }
  .hpv6-coll__header h2 { font-family: 'Georgia', serif; font-size: 40px; font-weight: 300; margin: 0; }
  .hpv6-coll__header a { font-family: 'Inter', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: inherit; text-decoration: none; border-bottom: 1px solid; padding-bottom: 4px; }
  .hpv6-coll__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .hpv6-coll__card { position: relative; display: block; text-decoration: none; color: inherit; }
  .hpv6-coll__card:nth-child(even) { margin-top: 80px; }
  .hpv6-coll__img { aspect-ratio: 4/5; background: #EDF2F7; margin-bottom: 24px; overflow: hidden; }
  .hpv6-coll__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .hpv6-coll__card:hover .hpv6-coll__img img { transform: scale(1.05); }
  .hpv6-coll__card h3 { font-family: 'Georgia', serif; font-size: 24px; font-weight: 300; margin: 0 0 8px; }
  .hpv6-coll__card p { font-family: 'Inter', sans-serif; font-size: 14px; opacity: 0.7; margin: 0; }
  @media(max-width: 768px) { .hpv6-coll__grid { grid-template-columns: 1fr; } .hpv6-coll__card:nth-child(even) { margin-top: 0; } }
</style>
<div class="hpv6-coll">
  <div class="hpv6-coll__header">
    <h2>{{ section.settings.title }}</h2>
    <a href="#">View All</a>
  </div>
  <div class="hpv6-coll__grid">
    {% assign coll = collections[section.settings.collection] %}
    {% if coll != blank and coll.products.size > 0 %}
      {% for product in coll.products limit: section.settings.limit %}
      <a href="{{ product.url }}" class="hpv6-coll__card">
        <div class="hpv6-coll__img">
          {% if product.featured_image %}
            <img src="{{ product.featured_image | img_url: '600x' }}" alt="{{ product.title }}">
          {% endif %}
        </div>
        <h3>{{ product.title }}</h3>
        <p>{{ product.price | money }}</p>
      </a>
      {% endfor %}
    {% else %}
      {% for i in (1..4) %}
      <a href="#" class="hpv6-coll__card">
        <div class="hpv6-coll__img"></div>
        <h3>Minimal Chair {{i}}</h3>
        <p>$240.00</p>
      </a>
      {% endfor %}
    {% endif %}
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Featured Collection",
  "settings": [
    { "type": "text", "id": "title", "label": "Title", "default": "Latest Arrivals" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "range", "id": "limit", "min": 2, "max": 10, "step": 2, "default": 4, "label": "Limit" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Featured Collection" }]
}
{% endschema %}
"""

# 6. Image with Text
img_txt = """
<style>
  .hpv6-iwt { display: flex; align-items: center; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; padding: 120px 5%; gap: 10%; }
  .hpv6-iwt--reverse { flex-direction: row-reverse; }
  .hpv6-iwt__img { flex: 1; aspect-ratio: 3/4; background: #E2E8F0; object-fit: cover; }
  .hpv6-iwt__content { flex: 1; max-width: 500px; }
  .hpv6-iwt__content h2 { font-family: 'Georgia', serif; font-size: 48px; font-weight: 300; margin: 0 0 32px; line-height: 1.2; }
  .hpv6-iwt__content p { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.8; opacity: 0.8; margin-bottom: 40px; }
  .hpv6-iwt__content a { display: inline-block; padding: 16px 40px; border: 1px solid; color: inherit; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-family: 'Inter', sans-serif; text-decoration: none; }
  @media(max-width: 768px) { .hpv6-iwt { flex-direction: column; gap: 40px; padding: 60px 24px; text-align: center; } }
</style>
<div class="hpv6-iwt {% if section.settings.layout == 'right' %}hpv6-iwt--reverse{% endif %}">
  <div class="hpv6-iwt__img"></div>
  <div class="hpv6-iwt__content">
    <h2>{{ section.settings.title }}</h2>
    <p>{{ section.settings.text }}</p>
    <a href="{{ section.settings.btn_link }}">{{ section.settings.btn_text }}</a>
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Image with Text",
  "settings": [
    { "type": "select", "id": "layout", "label": "Image Alignment", "options": [{"value":"left","label":"Left"},{"value":"right","label":"Right"}], "default": "left" },
    { "type": "text", "id": "title", "label": "Title", "default": "Form Meets Function" },
    { "type": "textarea", "id": "text", "label": "Text", "default": "Every piece is designed with extreme intention." },
    { "type": "text", "id": "btn_text", "label": "Button Text", "default": "Our Story" },
    { "type": "url", "id": "btn_link", "label": "Button Link" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Image with Text" }]
}
{% endschema %}
"""

# 7. Marquee
marquee = """
<style>
  .hpv6-marquee { background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; padding: 32px 0; overflow: hidden; white-space: nowrap; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; }
  .hpv6-marquee span { font-family: 'Georgia', serif; font-size: 32px; font-style: italic; margin-right: 40px; display: inline-block; animation: scroll 20s linear infinite; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
</style>
<div class="hpv6-marquee">
  <div>
    <span>{{ section.settings.text }}</span>
    <span>{{ section.settings.text }}</span>
    <span>{{ section.settings.text }}</span>
    <span>{{ section.settings.text }}</span>
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Marquee",
  "settings": [
    { "type": "text", "id": "text", "label": "Text", "default": "Simplicity is the ultimate sophistication." },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Marquee" }]
}
{% endschema %}
"""

# 8. Testimonial
testimonial = """
<style>
  .hpv6-test { padding: 120px 24px; text-align: center; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-test blockquote { font-family: 'Georgia', serif; font-size: clamp(24px, 4vw, 48px); font-weight: 300; line-height: 1.4; max-width: 900px; margin: 0 auto 40px; }
  .hpv6-test cite { font-family: 'Inter', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-style: normal; opacity: 0.6; }
</style>
<div class="hpv6-test">
  <blockquote>"{{ section.settings.quote }}"</blockquote>
  <cite>&mdash; {{ section.settings.author }}</cite>
</div>
{% schema %}
{
  "name": "HPV6 Testimonial",
  "settings": [
    { "type": "textarea", "id": "quote", "label": "Quote", "default": "The quality and design are unmatched. It completely transformed my living room." },
    { "type": "text", "id": "author", "label": "Author", "default": "Architectural Digest" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Testimonial" }]
}
{% endschema %}
"""

# 9. Shoppable Image
shoppable = """
<style>
  .hpv6-shop-img { position: relative; height: 80vh; background: #E2E8F0; display: flex; align-items: center; justify-content: center; }
  .hpv6-shop-img__pin { position: absolute; width: 16px; height: 16px; background: #FFF; border-radius: 50%; box-shadow: 0 0 0 4px rgba(255,255,255,0.3); cursor: pointer; transition: transform 0.3s; }
  .hpv6-shop-img__pin:hover { transform: scale(1.5); }
  .hpv6-shop-img__tooltip { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: #FFF; color: #2D3748; padding: 16px 24px; opacity: 0; pointer-events: none; transition: opacity 0.3s; width: max-content; font-family: 'Inter', sans-serif; font-size: 14px; text-align: center; }
  .hpv6-shop-img__pin:hover + .hpv6-shop-img__tooltip { opacity: 1; }
</style>
<div class="hpv6-shop-img">
  <div class="hpv6-shop-img__pin" style="top: 40%; left: 30%;"></div>
  <div class="hpv6-shop-img__tooltip" style="top: 35%; left: 30%;">Minimal Table Lamp - $120</div>
  
  <div class="hpv6-shop-img__pin" style="top: 60%; left: 60%;"></div>
  <div class="hpv6-shop-img__tooltip" style="top: 55%; left: 60%;">Oak Lounge Chair - $450</div>
</div>
{% schema %}
{
  "name": "HPV6 Shoppable Image",
  "settings": [],
  "presets": [{ "name": "HPV6 Shoppable Image" }]
}
{% endschema %}
"""

# 10. Video Banner
video = """
<style>
  .hpv6-video { position: relative; height: 100vh; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; color: #FFF; }
  .hpv6-video__bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
  .hpv6-video__content { position: relative; z-index: 1; max-width: 800px; padding: 24px; }
  .hpv6-video h2 { font-family: 'Georgia', serif; font-size: 72px; font-weight: 300; margin: 0 0 24px; }
  .hpv6-video a { display: inline-block; padding: 16px 40px; border: 1px solid #FFF; color: #FFF; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 2px; text-decoration: none; font-size: 13px; }
</style>
<div class="hpv6-video">
  <div class="hpv6-video__bg" style="background:#2D3748;"></div>
  <div class="hpv6-video__content">
    <h2>{{ section.settings.title }}</h2>
    <a href="{{ section.settings.btn_link }}">{{ section.settings.btn_text }}</a>
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Video Banner",
  "settings": [
    { "type": "text", "id": "title", "label": "Title", "default": "Crafted for longevity." },
    { "type": "text", "id": "btn_text", "label": "Button", "default": "Watch Film" },
    { "type": "url", "id": "btn_link", "label": "Link" }
  ],
  "presets": [{ "name": "HPV6 Video Banner" }]
}
{% endschema %}
"""

# 11. Collection List
coll_list = """
<style>
  .hpv6-cl { padding: 120px 5%; background: {{ section.settings.bg_color }}; text-align: center; }
  .hpv6-cl__grid { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-top: 60px; }
  .hpv6-cl__item { width: 200px; text-decoration: none; color: {{ section.settings.text_color }}; }
  .hpv6-cl__img { width: 200px; height: 300px; border-radius: 100px; background: #E2E8F0; margin-bottom: 24px; transition: transform 0.4s; }
  .hpv6-cl__item:hover .hpv6-cl__img { transform: translateY(-10px); }
  .hpv6-cl h3 { font-family: 'Inter', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 400; margin: 0; }
</style>
<div class="hpv6-cl">
  <h2 style="font-family: 'Georgia', serif; font-size: 40px; font-weight: 300; color: {{ section.settings.text_color }}; margin: 0;">Shop by Category</h2>
  <div class="hpv6-cl__grid">
    {% for i in (1..4) %}
    <a href="#" class="hpv6-cl__item">
      <div class="hpv6-cl__img"></div>
      <h3>Category {{i}}</h3>
    </a>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Collection List",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Collection List" }]
}
{% endschema %}
"""

# 12. Text Columns
text_cols = """
<style>
  .hpv6-tc { padding: 100px 5%; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-tc__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; }
  .hpv6-tc__col h3 { font-family: 'Georgia', serif; font-size: 24px; font-weight: 300; margin: 0 0 16px; border-bottom: 1px solid; padding-bottom: 16px; }
  .hpv6-tc__col p { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.8; opacity: 0.8; }
  @media(max-width:768px){ .hpv6-tc__grid{ grid-template-columns: 1fr; } }
</style>
<div class="hpv6-tc">
  <div class="hpv6-tc__grid">
    <div class="hpv6-tc__col">
      <h3>Design</h3>
      <p>Minimalist approach stripping away the non-essential to reveal true beauty.</p>
    </div>
    <div class="hpv6-tc__col">
      <h3>Material</h3>
      <p>Sourced from sustainable forests and ethical partners globally.</p>
    </div>
    <div class="hpv6-tc__col">
      <h3>Process</h3>
      <p>Hand-finished by artisans with decades of inherited knowledge.</p>
    </div>
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Text Columns",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Text Columns" }]
}
{% endschema %}
"""

# 13. Product Highlight
prod_high = """
<style>
  .hpv6-ph { display: flex; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-ph__img { flex: 1; min-height: 80vh; background: #CBD5E0; }
  .hpv6-ph__info { flex: 1; padding: 120px 80px; display: flex; flex-direction: column; justify-content: center; }
  .hpv6-ph__info h2 { font-family: 'Georgia', serif; font-size: 56px; font-weight: 300; margin: 0 0 24px; }
  .hpv6-ph__info p { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.8; opacity: 0.8; margin-bottom: 40px; }
  .hpv6-ph__specs { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 48px; border-top: 1px solid #E2E8F0; padding-top: 24px; }
  .hpv6-ph__spec span { display: block; font-family: 'Inter', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #A0AEC0; margin-bottom: 4px; }
  .hpv6-ph__spec str { font-family: 'Georgia', serif; font-size: 18px; }
</style>
<div class="hpv6-ph">
  <div class="hpv6-ph__info">
    <h2>The Signature Chair</h2>
    <p>A masterpiece of ergonomic design wrapped in premium textured fabric.</p>
    <div class="hpv6-ph__specs">
      <div class="hpv6-ph__spec"><span>Material</span><str>Solid Oak & Wool</str></div>
      <div class="hpv6-ph__spec"><span>Weight</span><str>14 kg</str></div>
    </div>
    <a href="#" style="display:inline-block; padding:16px 40px; background:{{ section.settings.text_color }}; color:{{ section.settings.bg_color }}; text-decoration:none; text-transform:uppercase; font-family:'Inter',sans-serif; font-size:13px; letter-spacing:2px; text-align:center; width:max-content;">Shop Now - $450</a>
  </div>
  <div class="hpv6-ph__img"></div>
</div>
{% schema %}
{
  "name": "HPV6 Product Highlight",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Product Highlight" }]
}
{% endschema %}
"""

# 14. FAQ
faq = """
<style>
  .hpv6-faq { padding: 120px 5%; max-width: 800px; margin: 0 auto; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-faq h2 { font-family: 'Georgia', serif; font-size: 40px; font-weight: 300; text-align: center; margin-bottom: 60px; }
  .hpv6-faq__item { border-bottom: 1px solid #E2E8F0; padding: 24px 0; }
  .hpv6-faq__q { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; }
  .hpv6-faq__a { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.8; opacity: 0.8; margin-top: 16px; display: none; }
  /* Simple CSS only toggle for preview */
  .hpv6-faq__item:hover .hpv6-faq__a { display: block; }
</style>
<div class="hpv6-faq">
  <h2>Frequently Asked Questions</h2>
  {% for i in (1..4) %}
  <div class="hpv6-faq__item">
    <div class="hpv6-faq__q">What is your return policy? <span>+</span></div>
    <div class="hpv6-faq__a">We offer a 30-day return policy on all unused items in their original packaging.</div>
  </div>
  {% endfor %}
</div>
{% schema %}
{
  "name": "HPV6 FAQ",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 FAQ" }]
}
{% endschema %}
"""

# 15. Blog Posts
blog = """
<style>
  .hpv6-blog { padding: 120px 5%; background: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; }
  .hpv6-blog__header { text-align: center; margin-bottom: 60px; }
  .hpv6-blog h2 { font-family: 'Georgia', serif; font-size: 40px; font-weight: 300; margin: 0 0 16px; }
  .hpv6-blog__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .hpv6-blog__card img { width: 100%; aspect-ratio: 16/9; background: #E2E8F0; object-fit: cover; margin-bottom: 24px; }
  .hpv6-blog__card span { font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #718096; }
  .hpv6-blog__card h3 { font-family: 'Georgia', serif; font-size: 24px; font-weight: 300; margin: 12px 0; }
</style>
<div class="hpv6-blog">
  <div class="hpv6-blog__header">
    <h2>The Journal</h2>
    <a href="#" style="font-family:'Inter', sans-serif; font-size:13px; text-transform:uppercase; letter-spacing:2px; color:inherit;">Read All Stories</a>
  </div>
  <div class="hpv6-blog__grid">
    {% for i in (1..2) %}
    <div class="hpv6-blog__card">
      <div style="width:100%; aspect-ratio:16/9; background:#E2E8F0; margin-bottom:24px;"></div>
      <span>Design &bull; Oct 12</span>
      <h3>The Art of Minimalist Living in 2026</h3>
      <p style="font-family:'Inter', sans-serif; font-size:14px; opacity:0.8; line-height:1.6;">Explore how stripping away the excess can lead to a more fulfilling lifestyle...</p>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Blog",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Blog" }]
}
{% endschema %}
"""

# 16. Instagram Feed
insta = """
<style>
  .hpv6-insta { padding: 80px 0; background: {{ section.settings.bg_color }}; text-align: center; overflow: hidden; }
  .hpv6-insta h2 { font-family: 'Georgia', serif; font-size: 32px; font-weight: 300; color: {{ section.settings.text_color }}; margin-bottom: 40px; }
  .hpv6-insta__grid { display: flex; gap: 16px; padding: 0 16px; }
  .hpv6-insta__grid div { flex: 1; aspect-ratio: 1; background: #CBD5E0; transition: opacity 0.3s; }
  .hpv6-insta__grid div:hover { opacity: 0.8; }
</style>
<div class="hpv6-insta">
  <h2>@peribeauty</h2>
  <div class="hpv6-insta__grid">
    {% for i in (1..5) %}<div></div>{% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Instagram",
  "settings": [
    { "type": "color", "id": "bg_color", "label": "Background", "default": "#F7FAFC" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#2D3748" }
  ],
  "presets": [{ "name": "HPV6 Instagram" }]
}
{% endschema %}
"""

# 17. Newsletter
newsletter = """
<style>
  .hpv6-nl { padding: 120px 5%; background: #2D3748; color: #F7FAFC; text-align: center; }
  .hpv6-nl h2 { font-family: 'Georgia', serif; font-size: 48px; font-weight: 300; margin: 0 0 16px; }
  .hpv6-nl p { font-family: 'Inter', sans-serif; font-size: 16px; opacity: 0.8; margin-bottom: 40px; }
  .hpv6-nl__form { display: flex; max-width: 500px; margin: 0 auto; border-bottom: 1px solid #F7FAFC; padding-bottom: 8px; }
  .hpv6-nl__form input { flex: 1; background: transparent; border: none; color: #FFF; font-family: 'Inter', sans-serif; font-size: 16px; outline: none; }
  .hpv6-nl__form button { background: transparent; border: none; color: #FFF; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; cursor: pointer; }
</style>
<div class="hpv6-nl">
  <h2>Join the inner circle.</h2>
  <p>Receive early access to new collections and exclusive editorial content.</p>
  <form class="hpv6-nl__form" onsubmit="event.preventDefault()">
    <input type="email" placeholder="Email Address">
    <button type="submit">Subscribe</button>
  </form>
</div>
{% schema %}
{
  "name": "HPV6 Newsletter",
  "settings": [],
  "presets": [{ "name": "HPV6 Newsletter" }]
}
{% endschema %}
"""

# 18. Footer
footer = """
<style>
  .hpv6-footer { padding: 80px 5% 40px; background: #1A202C; color: #A0AEC0; font-family: 'Inter', sans-serif; }
  .hpv6-footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 80px; }
  .hpv6-footer h4 { color: #FFF; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 24px; }
  .hpv6-footer ul { list-style: none; padding: 0; margin: 0; }
  .hpv6-footer li { margin-bottom: 12px; font-size: 14px; }
  .hpv6-footer a { color: inherit; text-decoration: none; transition: color 0.3s; }
  .hpv6-footer a:hover { color: #FFF; }
  .hpv6-footer__bottom { border-top: 1px solid #2D3748; padding-top: 24px; display: flex; justify-content: space-between; font-size: 12px; }
  @media(max-width: 768px) { .hpv6-footer__grid { grid-template-columns: 1fr; gap: 40px; } }
</style>
<div class="hpv6-footer">
  <div class="hpv6-footer__grid">
    <div>
      <h3 style="font-family:'Georgia', serif; font-size:32px; color:#FFF; font-weight:300; margin:0 0 24px;">Peri Beauty</h3>
      <p style="font-size:14px; line-height:1.6; max-width:300px;">Elevating everyday rituals through considered design.</p>
    </div>
    <div>
      <h4>Shop</h4>
      <ul><li><a href="#">All Products</a></li><li><a href="#">Furniture</a></li><li><a href="#">Lighting</a></li><li><a href="#">Objects</a></li></ul>
    </div>
    <div>
      <h4>About</h4>
      <ul><li><a href="#">Our Story</a></li><li><a href="#">Journal</a></li><li><a href="#">Sustainability</a></li><li><a href="#">Careers</a></li></ul>
    </div>
    <div>
      <h4>Support</h4>
      <ul><li><a href="#">FAQ</a></li><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">Contact</a></li></ul>
    </div>
  </div>
  <div class="hpv6-footer__bottom">
    <span>&copy; 2026 Peri Beauty. All rights reserved.</span>
    <span>Terms &middot; Privacy</span>
  </div>
</div>
{% schema %}
{
  "name": "HPV6 Footer",
  "settings": [],
  "presets": [{ "name": "HPV6 Footer" }]
}
{% endschema %}
"""

sections = [
    ("hpv6-01-announcement", announcement),
    ("hpv6-02-hero", hero),
    ("hpv6-03-logo-list", logo_list),
    ("hpv6-04-value-props", value_props),
    ("hpv6-05-featured-collection", feat_coll),
    ("hpv6-06-image-with-text", img_txt),
    ("hpv6-07-marquee", marquee),
    ("hpv6-08-testimonial-slider", testimonial),
    ("hpv6-09-shoppable-image", shoppable),
    ("hpv6-10-video-banner", video),
    ("hpv6-11-collection-list", coll_list),
    ("hpv6-12-text-columns", text_cols),
    ("hpv6-13-product-highlight", prod_high),
    ("hpv6-14-accordion-faq", faq),
    ("hpv6-15-blog-posts", blog),
    ("hpv6-16-instagram-feed", insta),
    ("hpv6-17-newsletter", newsletter),
    ("hpv6-18-footer", footer),
]

os.makedirs(SECTIONS_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

for name, content in sections:
    path = os.path.join(SECTIONS_DIR, f"{name}.liquid")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[SUCCESS] Generated {name}.liquid")

# Construct index.hp-v6.json
index_json = {
  "sections": {},
  "order": []
}

for name, _ in sections:
    # Use the name as the key in the JSON
    index_json["sections"][name] = {
        "type": name,
        "settings": {}
    }
    index_json["order"].append(name)

# Write the index JSON template
tmpl_path = os.path.join(TEMPLATES_DIR, "index.hp-v6.json")
with open(tmpl_path, "w", encoding="utf-8") as f:
    json.dump(index_json, f, indent=2)
print("[SUCCESS] Generated index.hp-v6.json")

# Write the page JSON template as well to be safe
page_tmpl_path = os.path.join(TEMPLATES_DIR, "page.hp-v6.json")
with open(page_tmpl_path, "w", encoding="utf-8") as f:
    json.dump(index_json, f, indent=2)
print("[SUCCESS] Generated page.hp-v6.json")

print("\nAll 18 files and templates written successfully for HP v6!")
