import json
import os

SECTIONS_DIR = r"i:\converflow app\dev-theme-peri\sections"
TEMPLATES_DIR = r"i:\converflow app\dev-theme-peri\templates"

os.makedirs(SECTIONS_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

hps = {}

# ==========================================
# HP v6: Nordic Minimal Living
# ==========================================
hps['6'] = {
    'name': 'Nordic Minimal Living',
    'bg': '#F7FAFC', 'primary': '#2D3748', 'accent': '#4A5568',
    'liquid': """
<style>
  .hpv6 { background-color: {{ section.settings.bg_color | default: '#F7FAFC' }}; color: {{ section.settings.text_color | default: '#2D3748' }}; font-family: 'Georgia', serif; }
  .hpv6__wrap { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
  .hpv6__hero { display: flex; align-items: center; min-height: 80vh; padding: 80px 0; border-bottom: 1px solid #E2E8F0; }
  .hpv6__hero-text { flex: 1; padding-right: 80px; }
  .hpv6__hero-img { flex: 1; height: 600px; background: #E2E8F0; object-fit: cover; }
  .hpv6__title { font-size: 5vw; font-weight: 300; margin: 0 0 24px; line-height: 1.1; letter-spacing: -1px; }
  .hpv6__btn { display: inline-block; padding: 16px 48px; background: transparent; color: #2D3748; border: 1px solid #2D3748; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 13px; transition: all 0.3s; }
  .hpv6__btn:hover { background: #2D3748; color: #F7FAFC; }
  .hpv6__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 80px 0; }
  .hpv6__card { border-bottom: 1px solid #E2E8F0; padding-bottom: 24px; }
</style>
<div class="hpv6">
  <div class="hpv6__wrap">
    <div class="hpv6__hero">
      <div class="hpv6__hero-text">
        <div style="font-family:'Inter', sans-serif; font-size:12px; letter-spacing:3px; margin-bottom:16px;">THE SUMMER EDIT</div>
        <h1 class="hpv6__title">{{ section.settings.hero_title | default: 'Embrace The Space.' }}</h1>
        <p style="font-family:'Inter', sans-serif; font-size: 16px; line-height:1.6; margin-bottom:40px; color:#718096; max-width:400px;">Curated sustainable homeware designed to breathe life into your personal sanctuary.</p>
        <a href="#" class="hpv6__btn">Shop the Collection</a>
      </div>
      <div class="hpv6__hero-img"></div>
    </div>
    <div class="hpv6__grid">
      {% assign target_coll = collections[section.settings.collection] %}
      {% if target_coll != blank and target_coll.products.size > 0 %}
        {% for product in target_coll.products limit: 4 %}
          <div class="hpv6__card">
             <div style="aspect-ratio:3/4; background:#E2E8F0; margin-bottom:24px;"></div>
             <h3 style="font-size:24px; font-weight:300; margin:0 0 8px;">{{ product.title }}</h3>
             <p style="font-family:'Inter', sans-serif; font-size:14px;">{{ product.price | money }}</p>
          </div>
        {% endfor %}
      {% else %}
        {% for i in (1..4) %}
          <div class="hpv6__card">
             <div style="aspect-ratio:3/4; background:#E2E8F0; margin-bottom:24px;"></div>
             <h3 style="font-size:24px; font-weight:300; margin:0 0 8px;">Minimal Product {{i}}</h3>
             <p style="font-family:'Inter', sans-serif; font-size:14px;">$120.00</p>
          </div>
        {% endfor %}
      {% endif %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v7: Liquid Death Punk
# ==========================================
hps['7'] = {
    'name': 'Liquid Death Punk',
    'bg': '#000000', 'primary': '#FFFFFF', 'accent': '#FFD700',
    'liquid': """
<style>
  .hpv7 { background-color: {{ section.settings.bg_color | default: '#000000' }}; color: {{ section.settings.text_color | default: '#FFFFFF' }}; font-family: 'Impact', 'Arial Black', sans-serif; text-transform: uppercase; }
  .hpv7__wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .hpv7__marquee { background: #FFD700; color: #000; font-size: 24px; padding: 12px 0; white-space: nowrap; overflow: hidden; border-bottom: 4px solid #FFF; }
  .hpv7__hero { text-align: center; padding: 120px 0; border-bottom: 8px solid #FFF; }
  .hpv7__title { font-size: 10vw; margin: 0 0 24px; line-height: 0.9; text-shadow: 4px 4px 0 #FFD700; }
  .hpv7__btn { display: inline-block; padding: 20px 40px; background: #FFD700; color: #000; font-size: 24px; border: 4px solid #FFF; box-shadow: 8px 8px 0 #FFF; text-decoration: none; transition: transform 0.1s; }
  .hpv7__btn:active { transform: translate(4px, 4px); box-shadow: 4px 4px 0 #FFF; }
  .hpv7__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; padding: 80px 0; }
  .hpv7__card { border: 4px solid #FFF; background: #111; padding: 24px; text-align: center; box-shadow: 12px 12px 0 #FFD700; }
</style>
<div class="hpv7">
  <div class="hpv7__marquee">
    <div>💀 MURDER YOUR THIRST 💀 BUY 2 GET 1 FREE 💀 MURDER YOUR THIRST 💀 BUY 2 GET 1 FREE 💀</div>
  </div>
  <div class="hpv7__wrap">
    <div class="hpv7__hero">
      <h1 class="hpv7__title">{{ section.settings.hero_title | default: 'SELL YOUR SOUL' }}</h1>
      <p style="font-family:'Courier New', monospace; font-size: 18px; margin-bottom: 48px; font-weight:bold;">100% MOUNTAIN WATER. 0% BS.</p>
      <a href="#" class="hpv7__btn">HELL YES</a>
    </div>
    <div class="hpv7__grid">
      {% for i in (1..3) %}
      <div class="hpv7__card">
        <div style="aspect-ratio:1; background:#000; border:4px solid #FFF; margin-bottom:24px;"></div>
        <h3 style="font-size:32px; margin:0 0 8px;">CANNED WATER {{i}}</h3>
        <p style="font-family:'Courier New'; font-size:20px; font-weight:bold; margin-bottom:24px;">$18.99</p>
        <button class="hpv7__btn" style="width:100%; font-size:20px; padding:12px;">BUY NOW</button>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v8: Apple Minimal Tech
# ==========================================
hps['8'] = {
    'name': 'Apple Minimal Tech',
    'bg': '#F5F5F7', 'primary': '#1D1D1F', 'accent': '#0066CC',
    'liquid': """
<style>
  .hpv8 { background-color: {{ section.settings.bg_color | default: '#F5F5F7' }}; color: {{ section.settings.text_color | default: '#1D1D1F' }}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .hpv8__hero { text-align: center; padding: 120px 20px 0; background: #000; color: #FFF; overflow: hidden; }
  .hpv8__title { font-size: 56px; font-weight: 600; letter-spacing: -0.005em; margin: 0 0 12px; }
  .hpv8__sub { font-size: 28px; font-weight: 400; letter-spacing: 0.004em; margin: 0 0 24px; }
  .hpv8__links { font-size: 21px; display: flex; justify-content: center; gap: 24px; margin-bottom: 60px; }
  .hpv8__links a { color: #2997ff; text-decoration: none; }
  .hpv8__links a:hover { text-decoration: underline; }
  .hpv8__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; }
  .hpv8__card { background: #FFF; border-radius: 18px; padding: 40px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
  @media(max-width:768px){ .hpv8__grid{ grid-template-columns: 1fr; } }
</style>
<div class="hpv8">
  <div class="hpv8__hero">
    <h1 class="hpv8__title">{{ section.settings.hero_title | default: 'Pro. Beyond.' }}</h1>
    <h2 class="hpv8__sub">The ultimate upgrade.</h2>
    <div class="hpv8__links">
      <a href="#">Learn more &gt;</a>
      <a href="#">Buy &gt;</a>
    </div>
    <div style="height:400px; background:linear-gradient(to top, #333, #000); border-radius: 20px 20px 0 0; max-width:800px; margin:0 auto;"></div>
  </div>
  <div class="hpv8__grid">
    {% for i in (1..4) %}
    <div class="hpv8__card">
      <h3 style="font-size:32px; font-weight:600; margin:0 0 8px;">Accessory {{i}}</h3>
      <p style="font-size:19px; margin:0 0 16px;">Supercharged for pros.</p>
      <div class="hpv8__links" style="font-size:17px; margin-bottom:32px;">
        <a href="#">Learn more &gt;</a>
        <a href="#">Buy &gt;</a>
      </div>
      <div style="aspect-ratio:1; background:#F5F5F7; border-radius:12px;"></div>
    </div>
    {% endfor %}
  </div>
</div>
"""
}

# ==========================================
# HP v9: Retro Vintage Brewery
# ==========================================
hps['9'] = {
    'name': 'Retro Vintage Brewery',
    'bg': '#FEF3C7', 'primary': '#78350F', 'accent': '#B45309',
    'liquid': """
<style>
  .hpv9 { background-color: {{ section.settings.bg_color | default: '#FEF3C7' }}; color: {{ section.settings.text_color | default: '#78350F' }}; font-family: 'Times New Roman', Times, serif; }
  .hpv9__wrap { max-width: 1000px; margin: 0 auto; padding: 40px 24px; border: 4px double #78350F; margin-top: 40px; margin-bottom: 40px; }
  .hpv9__header { text-align: center; border-bottom: 2px solid #78350F; padding-bottom: 24px; margin-bottom: 40px; }
  .hpv9__title { font-size: 64px; text-transform: uppercase; letter-spacing: 4px; margin: 0; }
  .hpv9__masonry { column-count: 2; column-gap: 24px; }
  .hpv9__card { background: #FFFBEB; border: 1px solid #78350F; padding: 16px; margin-bottom: 24px; display: inline-block; width: 100%; box-sizing: border-box; text-align:center; }
  .hpv9__btn { display: inline-block; padding: 10px 24px; border: 2px solid #78350F; color: #78350F; text-transform: uppercase; font-weight: bold; text-decoration: none; font-family: sans-serif; letter-spacing: 1px; }
  .hpv9__btn:hover { background: #78350F; color: #FEF3C7; }
</style>
<div class="hpv9">
  <div class="hpv9__wrap">
    <div class="hpv9__header">
      <p style="font-family:sans-serif; text-transform:uppercase; letter-spacing:2px; margin:0 0 16px;">Established 1924</p>
      <h1 class="hpv9__title">{{ section.settings.hero_title | default: 'The Rusty Barrel' }}</h1>
      <p style="font-style: italic; font-size: 20px; margin: 16px 0 0;">Premium Craft Malts & Stouts</p>
    </div>
    <div class="hpv9__masonry">
      {% for i in (1..6) %}
      <div class="hpv9__card" style="height: {% cycle '300px', '450px', '350px', '500px', '400px', '350px' %}; display:flex; flex-direction:column;">
        <h3 style="font-size:24px; text-transform:uppercase; margin:0 0 8px;">Old No. {{i}}</h3>
        <p style="font-style:italic; opacity:0.8; margin-bottom:16px;">Rich & Malty</p>
        <div style="flex-grow:1; border:1px dashed #78350F; margin-bottom:16px;"></div>
        <a href="#" class="hpv9__btn">Add to Cart - $24</a>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v10: Organic Botanical
# ==========================================
hps['10'] = {
    'name': 'Organic Botanical',
    'bg': '#F0FDF4', 'primary': '#166534', 'accent': '#15803D',
    'liquid': """
<style>
  .hpv10 { background-color: {{ section.settings.bg_color | default: '#F0FDF4' }}; color: {{ section.settings.text_color | default: '#166534' }}; font-family: 'Helvetica', sans-serif; }
  .hpv10__hero { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 24px; text-align: center; }
  .hpv10__img-wrap { width: 300px; height: 450px; border-radius: 150px; overflow: hidden; background: #DCFCE7; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(22,101,52,0.1); }
  .hpv10__title { font-size: 48px; font-weight: 300; margin: 0 0 16px; color: #14532D; }
  .hpv10__scroll { display: flex; gap: 24px; overflow-x: auto; padding: 40px 24px; snap-type: x mandatory; }
  .hpv10__card { flex: 0 0 300px; background: #FFF; padding: 32px; border-radius: 40px 40px 10px 10px; box-shadow: 0 10px 20px rgba(22,101,52,0.05); text-align: center; scroll-snap-align: start; }
  .hpv10__btn { background: #166534; color: #FFF; padding: 16px 32px; border-radius: 99px; text-decoration: none; font-weight: bold; }
</style>
<div class="hpv10">
  <div class="hpv10__hero">
    <div class="hpv10__img-wrap"></div>
    <h1 class="hpv10__title">{{ section.settings.hero_title | default: 'Pure from the earth.' }}</h1>
    <p style="font-size: 18px; max-width: 500px; margin: 0 auto 32px; line-height: 1.6; opacity: 0.8;">100% organic skincare crafted with wild-harvested botanicals.</p>
    <a href="#" class="hpv10__btn">Discover Rituals</a>
  </div>
  <div class="hpv10__scroll">
    {% for i in (1..5) %}
    <div class="hpv10__card">
      <div style="width:120px; height:120px; border-radius:50%; background:#DCFCE7; margin:0 auto 24px;"></div>
      <h3 style="font-size:20px; margin:0 0 8px;">Botanical Extract {{i}}</h3>
      <p style="font-size:14px; opacity:0.7; margin-bottom:24px;">Deep hydration from nature.</p>
      <a href="#" style="color:#166534; font-weight:bold; text-decoration:none;">Add to Cart &rarr;</a>
    </div>
    {% endfor %}
  </div>
</div>
"""
}

# ==========================================
# HP v11: Neo-Brutalist Y2K
# ==========================================
hps['11'] = {
    'name': 'Neo-Brutalist Y2K',
    'bg': '#FFE600', 'primary': '#000000', 'accent': '#000000',
    'liquid': """
<style>
  .hpv11 { background-color: {{ section.settings.bg_color | default: '#FFE600' }}; color: {{ section.settings.text_color | default: '#000000' }}; font-family: 'Courier New', monospace; }
  .hpv11__wrap { padding: 40px; }
  .hpv11__hero { border: 4px solid #000; background: #FFF; padding: 40px; box-shadow: 12px 12px 0 #000; position: relative; margin-bottom: 80px; }
  .hpv11__title { font-size: 72px; text-transform: uppercase; margin: 0; line-height: 1; letter-spacing: -2px; }
  .hpv11__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
  .hpv11__card { border: 4px solid #000; background: #FFF; padding: 20px; box-shadow: 8px 8px 0 #000; transition: transform 0.1s; }
  .hpv11__card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0 #000; }
  .hpv11__btn { background: #000; color: #FFE600; padding: 12px 24px; font-weight: bold; text-transform: uppercase; border: none; font-size: 16px; cursor: pointer; }
</style>
<div class="hpv11">
  <div class="hpv11__wrap">
    <div class="hpv11__hero">
      <div style="position:absolute; top:-20px; left:40px; background:#000; color:#FFE600; padding:8px 16px; font-weight:bold;">* ALERT *</div>
      <h1 class="hpv11__title">{{ section.settings.hero_title | default: 'RAW. UNFILTERED. DESIGN.' }}</h1>
      <p style="font-size: 24px; font-weight: bold; margin: 24px 0 40px;">BREAK THE GRID.</p>
      <button class="hpv11__btn">SHOP THE DROP</button>
    </div>
    <div class="hpv11__grid">
      {% for i in (1..6) %}
      <div class="hpv11__card">
        <div style="aspect-ratio:1; background:#E5E5E5; border: 4px solid #000; margin-bottom:16px;"></div>
        <h3 style="font-size:20px; font-weight:bold; margin:0 0 8px;">ITEM NO. 00{{i}}</h3>
        <p style="font-size:16px; font-weight:bold; margin:0 0 16px;">$55.00</p>
        <button class="hpv11__btn" style="width:100%; border:2px solid #000;">BUY</button>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v12: High Jewelry Atelier
# ==========================================
hps['12'] = {
    'name': 'High Jewelry Atelier',
    'bg': '#1E1B4B', 'primary': '#EEF2FF', 'accent': '#C0A080',
    'liquid': """
<style>
  .hpv12 { background-color: {{ section.settings.bg_color | default: '#1E1B4B' }}; color: {{ section.settings.text_color | default: '#EEF2FF' }}; font-family: 'Playfair Display', serif; }
  .hpv12__wrap { max-width: 1400px; margin: 0 auto; padding: 120px 40px; }
  .hpv12__hero { text-align: center; margin-bottom: 120px; }
  .hpv12__title { font-size: 64px; font-weight: 300; margin: 0 0 24px; color: #C0A080; }
  .hpv12__btn { display: inline-block; padding: 16px 40px; border: 1px solid #C0A080; color: #C0A080; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 3px; text-decoration: none; }
  .hpv12__split { display: flex; align-items: center; margin-bottom: 120px; gap: 80px; }
  .hpv12__split:nth-child(even) { flex-direction: row-reverse; }
  .hpv12__img { flex: 1; aspect-ratio: 4/5; background: #2E2B5B; border: 1px solid rgba(192,160,128,0.2); }
  .hpv12__text { flex: 1; }
</style>
<div class="hpv12">
  <div class="hpv12__wrap">
    <div class="hpv12__hero">
      <p style="font-family:'Inter', sans-serif; font-size:11px; letter-spacing:4px; margin-bottom:24px; text-transform:uppercase;">Maison de Haute Joaillerie</p>
      <h1 class="hpv12__title">{{ section.settings.hero_title | default: 'Eternity Collection' }}</h1>
      <p style="font-size: 20px; max-width: 600px; margin: 0 auto 48px; line-height: 1.8; opacity: 0.8;">Where time stands still and craftsmanship speaks volumes.</p>
      <a href="#" class="hpv12__btn">Discover</a>
    </div>
    {% for i in (1..3) %}
    <div class="hpv12__split">
      <div class="hpv12__img"></div>
      <div class="hpv12__text">
        <h2 style="font-size:40px; font-weight:300; margin:0 0 16px; color:#C0A080;">Le Diamant {{i}}</h2>
        <p style="font-size:18px; line-height:1.8; margin-bottom:32px; opacity:0.8;">Hand-selected flawless stones set in 18k solid gold. A masterpiece of modern design.</p>
        <a href="#" style="color:#C0A080; text-transform:uppercase; font-family:'Inter', sans-serif; font-size:11px; letter-spacing:2px; text-decoration:none;">View Details &mdash;</a>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
"""
}

# ==========================================
# HP v13: Eco Wool Footwear
# ==========================================
hps['13'] = {
    'name': 'Eco Wool Footwear',
    'bg': '#EDF2F7', 'primary': '#2D3748', 'accent': '#1A202C',
    'liquid': """
<style>
  .hpv13 { background-color: {{ section.settings.bg_color | default: '#EDF2F7' }}; color: {{ section.settings.text_color | default: '#2D3748' }}; font-family: 'Helvetica', sans-serif; }
  .hpv13__hero { display: grid; grid-template-columns: 1fr 1fr; height: 100vh; }
  .hpv13__hero-img { background: #CBD5E0; }
  .hpv13__hero-content { display: flex; flex-direction: column; justify-content: center; padding: 80px; }
  .hpv13__title { font-size: 64px; font-weight: bold; margin: 0 0 24px; line-height: 1; letter-spacing: -1px; }
  .hpv13__btn { display: inline-block; padding: 20px 40px; background: #2D3748; color: #FFF; font-weight: bold; font-size: 18px; text-decoration: none; border-radius: 8px; width: max-content; }
  .hpv13__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: #CBD5E0; border-top: 2px solid #CBD5E0; border-bottom: 2px solid #CBD5E0; }
  .hpv13__card { background: #EDF2F7; padding: 40px 24px; text-align: center; }
</style>
<div class="hpv13">
  <div class="hpv13__hero">
    <div class="hpv13__hero-content">
      <h1 class="hpv13__title">{{ section.settings.hero_title | default: 'Light on your feet. Light on the planet.' }}</h1>
      <p style="font-size: 20px; line-height: 1.6; color: #4A5568; margin-bottom: 48px;">Carbon-neutral footwear made from renewable materials.</p>
      <a href="#" class="hpv13__btn">Shop Men</a>
      <a href="#" class="hpv13__btn" style="background:#FFF; color:#2D3748; border:1px solid #CBD5E0; margin-top:16px;">Shop Women</a>
    </div>
    <div class="hpv13__hero-img"></div>
  </div>
  <div style="padding:80px 40px; text-align:center;">
    <h2 style="font-size:40px; font-weight:bold; margin-bottom:40px;">Earth-friendly materials.</h2>
    <div class="hpv13__grid">
      {% for i in (1..4) %}
      <div class="hpv13__card">
        <div style="font-size:40px; margin-bottom:16px;">🌿</div>
        <h3 style="font-size:20px; margin:0 0 8px;">Merino Wool</h3>
        <p style="color:#718096; font-size:14px; margin:0;">Ethically sourced, naturally breathable.</p>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v14: Artisanal Coffee
# ==========================================
hps['14'] = {
    'name': 'Artisanal Coffee',
    'bg': '#FEF3C7', 'primary': '#451A03', 'accent': '#78350F',
    'liquid': """
<style>
  .hpv14 { background-color: {{ section.settings.bg_color | default: '#FEF3C7' }}; color: {{ section.settings.text_color | default: '#451A03' }}; font-family: 'Courier New', monospace; }
  .hpv14__wrap { max-width: 1000px; margin: 0 auto; padding: 80px 24px; }
  .hpv14__header { text-align: center; border-bottom: 2px solid #451A03; padding-bottom: 40px; margin-bottom: 60px; }
  .hpv14__title { font-size: 48px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px; }
  .hpv14__menu-item { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
  .hpv14__menu-dots { flex-grow: 1; border-bottom: 2px dotted #451A03; margin: 0 16px 6px; }
  .hpv14__btn { display: block; width: 100%; padding: 20px; background: #451A03; color: #FEF3C7; text-align: center; font-size: 18px; font-weight: bold; text-transform: uppercase; text-decoration: none; margin-top: 60px; }
</style>
<div class="hpv14">
  <div class="hpv14__wrap">
    <div class="hpv14__header">
      <h1 class="hpv14__title">{{ section.settings.hero_title | default: 'ROASTERS MENU' }}</h1>
      <p style="font-size: 16px; font-weight: bold;">FRESHLY ROASTED. SHIPPED DAILY.</p>
    </div>
    
    <h2 style="font-size:24px; border-bottom: 2px solid #451A03; display:inline-block; margin-bottom: 32px;">SINGLE ORIGIN</h2>
    
    {% for i in (1..5) %}
    <div class="hpv14__menu-item">
      <div>
        <h3 style="font-size:20px; margin:0 0 4px;">ETHIOPIA YIRGACHEFFE</h3>
        <p style="font-size:14px; margin:0; opacity:0.8;">Jasmine, Blueberry, Honey</p>
      </div>
      <div class="hpv14__menu-dots"></div>
      <div style="font-size:20px; font-weight:bold;">$22</div>
    </div>
    {% endfor %}

    <a href="#" class="hpv14__btn">SHOP ALL ROASTS</a>
  </div>
</div>
"""
}

# ==========================================
# HP v15: Tactical Outdoor Gear
# ==========================================
hps['15'] = {
    'name': 'Tactical Outdoor Gear',
    'bg': '#1C1917', 'primary': '#E7E5E4', 'accent': '#44403C',
    'liquid': """
<style>
  .hpv15 { background-color: {{ section.settings.bg_color | default: '#1C1917' }}; color: {{ section.settings.text_color | default: '#E7E5E4' }}; font-family: 'Arial', sans-serif; text-transform: uppercase; }
  .hpv15__wrap { padding: 40px; }
  .hpv15__header { display: flex; justify-content: space-between; border-bottom: 2px solid #44403C; padding-bottom: 16px; margin-bottom: 40px; }
  .hpv15__hero { background: #292524; border: 1px solid #44403C; padding: 60px; display: flex; gap: 40px; margin-bottom: 40px; }
  .hpv15__title { font-size: 64px; font-weight: 900; margin: 0 0 24px; line-height: 1; }
  .hpv15__btn { display: inline-block; padding: 16px 32px; background: #E7E5E4; color: #1C1917; font-weight: 900; letter-spacing: 2px; text-decoration: none; }
  .hpv15__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .hpv15__card { background: #292524; border: 1px solid #44403C; padding: 16px; display: flex; flex-direction: column; }
  .hpv15__spec { display: flex; justify-content: space-between; border-bottom: 1px solid #44403C; padding: 8px 0; font-size: 12px; }
</style>
<div class="hpv15">
  <div class="hpv15__wrap">
    <div class="hpv15__header">
      <div style="font-weight:900; letter-spacing:4px;">SYS_COM // GEAR</div>
      <div style="font-family:'Courier New';">STATUS: ONLINE</div>
    </div>
    
    <div class="hpv15__hero">
      <div style="flex:1;">
        <h1 class="hpv15__title">{{ section.settings.hero_title | default: 'MIL-SPEC DURABILITY' }}</h1>
        <p style="font-family:'Courier New'; font-size:16px; line-height:1.6; margin-bottom:40px; color:#A8A29E;">Engineered for extreme conditions. Field tested by professionals.</p>
        <a href="#" class="hpv15__btn">DEPLOY COMMERCE_LINK</a>
      </div>
      <div style="flex:1; background:#44403C; border:1px solid #78716C;"></div>
    </div>

    <div class="hpv15__grid">
      {% for i in (1..4) %}
      <div class="hpv15__card">
        <div style="aspect-ratio:1; background:#1C1917; margin-bottom:16px; border:1px solid #44403C;"></div>
        <h3 style="font-size:18px; font-weight:900; margin:0 0 16px;">ASSAULT PACK {{i}}</h3>
        <div class="hpv15__spec"><span>MAT</span><span>1000D NYLON</span></div>
        <div class="hpv15__spec"><span>VOL</span><span>35L</span></div>
        <div class="hpv15__spec"><span>PRC</span><span>$199.00</span></div>
        <a href="#" class="hpv15__btn" style="text-align:center; margin-top:16px; padding:12px; background:transparent; color:#E7E5E4; border:1px solid #E7E5E4;">ACQUIRE</a>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v16: K-Beauty Glass Skin
# ==========================================
hps['16'] = {
    'name': 'K-Beauty Glass Skin',
    'bg': '#FDF2F8', 'primary': '#DB2777', 'accent': '#F472B6',
    'liquid': """
<style>
  .hpv16 { background-color: {{ section.settings.bg_color | default: '#FDF2F8' }}; color: {{ section.settings.text_color | default: '#DB2777' }}; font-family: 'Helvetica', sans-serif; overflow: hidden; }
  .hpv16__blob { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, #FCE7F3 0%, transparent 70%); border-radius: 50%; z-index: 0; filter: blur(40px); }
  .hpv16__hero { position: relative; z-index: 1; text-align: center; padding: 160px 20px; }
  .hpv16__title { font-size: 56px; font-weight: 300; color: #9D174D; margin: 0 0 24px; letter-spacing: -1px; }
  .hpv16__glass-card { background: rgba(255,255,255,0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8); border-radius: 32px; padding: 40px; box-shadow: 0 20px 40px rgba(219,39,119,0.05); }
  .hpv16__btn { display: inline-block; padding: 18px 48px; background: #DB2777; color: #FFF; border-radius: 99px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 20px rgba(219,39,119,0.2); }
  .hpv16__routine { display: flex; justify-content: center; gap: 24px; padding: 80px 24px; position: relative; z-index: 1; }
</style>
<div class="hpv16">
  <div class="hpv16__blob" style="top:-100px; left:-100px;"></div>
  <div class="hpv16__blob" style="bottom:-100px; right:-100px;"></div>
  
  <div class="hpv16__hero">
    <div class="hpv16__glass-card" style="display:inline-block; max-width:800px;">
      <h1 class="hpv16__title">{{ section.settings.hero_title | default: 'Dewy, radiant glass skin.' }}</h1>
      <p style="font-size: 20px; color: #BE185D; margin-bottom: 40px; line-height: 1.6;">Unlock your natural glow with our viral hydration formulas.</p>
      <a href="#" class="hpv16__btn">Shop Hydration Sets</a>
    </div>
  </div>

  <div class="hpv16__routine">
    {% for i in (1..3) %}
    <div class="hpv16__glass-card" style="flex:1; max-width:300px; text-align:center; padding:32px 24px;">
      <div style="font-size:12px; font-weight:bold; color:#F472B6; margin-bottom:16px;">STEP {{i}}</div>
      <div style="width:120px; height:120px; border-radius:50%; background:#FBCFE8; margin:0 auto 24px;"></div>
      <h3 style="font-size:20px; color:#9D174D; margin:0 0 12px;">Product {{i}}</h3>
      <p style="font-size:14px; color:#BE185D; margin:0;">Deeply hydrates and plumps.</p>
    </div>
    {% endfor %}
  </div>
</div>
"""
}

# ==========================================
# HP v17: The Farmer's Dog Pet
# ==========================================
hps['17'] = {
    'name': 'The Farmers Dog Pet',
    'bg': '#FFF7ED', 'primary': '#9A3412', 'accent': '#C86D51',
    'liquid': """
<style>
  .hpv17 { background-color: {{ section.settings.bg_color | default: '#FFF7ED' }}; color: {{ section.settings.text_color | default: '#9A3412' }}; font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; }
  .hpv17__wrap { max-width: 1200px; margin: 0 auto; padding: 60px 24px; }
  .hpv17__hero { display: flex; align-items: center; background: #FFEDD5; border-radius: 40px; padding: 60px; margin-bottom: 80px; }
  .hpv17__title { font-size: 56px; font-weight: bold; margin: 0 0 24px; color: #7C2D12; }
  .hpv17__btn { display: inline-block; padding: 20px 48px; background: #C86D51; color: #FFF; border-radius: 99px; text-decoration: none; font-size: 20px; font-weight: bold; box-shadow: 0 8px 0 #9A3412; transition: transform 0.1s, box-shadow 0.1s; }
  .hpv17__btn:active { transform: translateY(8px); box-shadow: 0 0 0 #9A3412; }
  .hpv17__bubbles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
  .hpv17__bubble { background: #FFF; padding: 40px; border-radius: 40px 40px 40px 0; border: 4px solid #FED7AA; box-shadow: 8px 8px 0 #FED7AA; font-size: 18px; color: #7C2D12; }
</style>
<div class="hpv17">
  <div class="hpv17__wrap">
    <div class="hpv17__hero">
      <div style="flex:1.2; padding-right:40px;">
        <h1 class="hpv17__title">{{ section.settings.hero_title | default: 'Real food. Real healthy dogs.' }}</h1>
        <p style="font-size: 24px; margin-bottom: 40px;">Human-grade meat and veggies, delivered to your door.</p>
        <a href="#" class="hpv17__btn">Get 50% Off First Box! 🐶</a>
      </div>
      <div style="flex:1; aspect-ratio:1; background:#FED7AA; border-radius:50%;"></div>
    </div>
    
    <h2 style="text-align:center; font-size:40px; color:#7C2D12; margin-bottom:60px;">What the pups are saying</h2>
    <div class="hpv17__bubbles">
      {% for i in (1..3) %}
      <div class="hpv17__bubble">
        "Woof woof! Best meal ever! I actually clean my bowl now."<br><br><b>- Max the Golden</b>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v18: Smart Home IoT
# ==========================================
hps['18'] = {
    'name': 'Smart Home IoT',
    'bg': '#0B0F19', 'primary': '#E2E8F0', 'accent': '#06B6D4',
    'liquid': """
<style>
  .hpv18 { background-color: {{ section.settings.bg_color | default: '#0B0F19' }}; color: {{ section.settings.text_color | default: '#E2E8F0' }}; font-family: 'Inter', sans-serif; }
  .hpv18__wrap { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
  .hpv18__hero { text-align: center; margin-bottom: 120px; }
  .hpv18__title { font-size: 64px; font-weight: 900; margin: 0 0 24px; color: #FFF; text-shadow: 0 0 20px rgba(6,182,212,0.5); }
  .hpv18__btn { display: inline-block; padding: 16px 40px; background: transparent; color: #06B6D4; border: 2px solid #06B6D4; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 0 15px rgba(6,182,212,0.3), inset 0 0 15px rgba(6,182,212,0.3); transition: all 0.3s; }
  .hpv18__btn:hover { background: #06B6D4; color: #000; }
  .hpv18__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .hpv18__card { background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 32px; text-align: center; position: relative; overflow: hidden; }
  .hpv18__card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #06B6D4, transparent); }
</style>
<div class="hpv18">
  <div class="hpv18__wrap">
    <div class="hpv18__hero">
      <h1 class="hpv18__title">{{ section.settings.hero_title | default: 'INTELLIGENT LIVING' }}</h1>
      <p style="font-size: 20px; color: #94A3B8; max-width: 600px; margin: 0 auto 48px; line-height: 1.6;">Automate your entire home ecosystem with next-generation Matter compatibility.</p>
      <a href="#" class="hpv18__btn">EXPLORE SYSTEMS</a>
    </div>
    
    <div class="hpv18__grid">
      {% for i in (1..3) %}
      <div class="hpv18__card">
        <div style="font-size:40px; margin-bottom:24px; color:#06B6D4;">⚡</div>
        <h3 style="font-size:24px; color:#FFF; margin:0 0 16px;">Smart Light Hub {{i}}</h3>
        <p style="color:#94A3B8; margin-bottom:32px;">16 million colors. Voice controlled.</p>
        <p style="font-size:20px; font-weight:bold; color:#FFF; margin-bottom:24px;">$79.99</p>
        <button style="width:100%; padding:12px; background:#1F2937; color:#FFF; border:none; border-radius:8px; font-weight:bold;">ADD TO SYSTEM</button>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
"""
}

# ==========================================
# HP v19: Artisanal Sourdough
# ==========================================
hps['19'] = {
    'name': 'Artisanal Sourdough',
    'bg': '#FFFBEB', 'primary': '#78350F', 'accent': '#92400E',
    'liquid': """
<style>
  .hpv19 { background-color: {{ section.settings.bg_color | default: '#FFFBEB' }}; color: {{ section.settings.text_color | default: '#78350F' }}; font-family: 'Baskerville', 'Georgia', serif; }
  .hpv19__hero { position: relative; height: 70vh; display: flex; align-items: center; justify-content: center; text-align: center; background: #D97706; color: #FFFBEB; }
  .hpv19__title { font-size: 72px; font-style: italic; margin: 0 0 24px; font-weight: normal; }
  .hpv19__btn { display: inline-block; padding: 16px 48px; background: #FFFBEB; color: #78350F; font-family: sans-serif; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; text-decoration: none; }
  .hpv19__polaroids { display: flex; justify-content: center; gap: 40px; padding: 80px 24px; flex-wrap: wrap; }
  .hpv19__polaroid { background: #FFF; padding: 16px 16px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 300px; text-align: center; transform: rotate(-2deg); transition: transform 0.3s; }
  .hpv19__polaroid:nth-child(even) { transform: rotate(3deg); }
  .hpv19__polaroid:hover { transform: rotate(0) scale(1.05); z-index: 10; position: relative; }
</style>
<div class="hpv19">
  <div class="hpv19__hero">
    <div style="position:relative; z-index:2;">
      <h1 class="hpv19__title">{{ section.settings.hero_title | default: 'Baked at dawn.' }}</h1>
      <p style="font-family:sans-serif; font-size: 18px; letter-spacing: 2px; text-transform:uppercase; margin-bottom:40px;">WILD YEAST &bull; ANCIENT GRAINS &bull; SLOW FERMENTED</p>
      <a href="#" class="hpv19__btn">Order Fresh Bread</a>
    </div>
  </div>
  
  <div style="text-align:center; padding-top:80px;">
    <h2 style="font-size:40px; font-style:italic; margin:0;">Our Weekly Bakes</h2>
  </div>
  
  <div class="hpv19__polaroids">
    {% for i in (1..3) %}
    <div class="hpv19__polaroid">
      <div style="aspect-ratio:1; background:#FDE68A; margin-bottom:24px;"></div>
      <h3 style="font-size:24px; margin:0; font-style:italic;">Country Loaf {{i}}</h3>
    </div>
    {% endfor %}
  </div>
</div>
"""
}

def generate_schema(b, p):
    full_name = f"HP V{b} - {hps[b]['name']}"
    short_name = full_name[:25]
    return f"""
{{% schema %}}
{{
  "name": "{short_name}",
  "tag": "section",
  "settings": [
    {{ "type": "text", "id": "hero_title", "label": "Hero Title" }},
    {{ "type": "collection", "id": "collection", "label": "Featured Collection" }},
    {{ "type": "color", "id": "bg_color", "label": "Background", "default": "{hps[b]['bg']}" }},
    {{ "type": "color", "id": "text_color", "label": "Text Color", "default": "{hps[b]['primary']}" }}
  ],
  "presets": [{{ "name": "{short_name}" }}]
}}
{{% endschema %}}
"""

print("Writing completely unique homepages v6 to v19...")

count = 0
for b in hps:
    # 1. Write section
    sec_content = hps[b]['liquid'] + generate_schema(b, f"hpv{b}")
    sec_path = os.path.join(SECTIONS_DIR, f"hp-v{b}.liquid")
    with open(sec_path, "w", encoding="utf-8") as f:
        f.write(sec_content)
        
    # 2. Write template
    tmpl_content = {
        "sections": {
            "main": {
                "type": f"hp-v{b}",
                "settings": {}
            }
        },
        "order": ["main"]
    }
    tmpl_path = os.path.join(TEMPLATES_DIR, f"index.hp-v{b}.json")
    # also overwrite page.hp-vX.json just in case shopify routing uses that
    tmpl_path2 = os.path.join(TEMPLATES_DIR, f"page.hp-v{b}.json")
    
    with open(tmpl_path, "w", encoding="utf-8") as f:
        json.dump(tmpl_content, f, indent=2)
    with open(tmpl_path2, "w", encoding="utf-8") as f:
        json.dump(tmpl_content, f, indent=2)
        
    print(f"[DONE] Created HP v{b} - {hps[b]['name']}")
    count += 1

print(f"\\nDone! Generated {count} unique architectures.")
