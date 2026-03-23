export interface CKTemplate {
  id: string;
  name: string;
  category: "header"|"hero"|"banner"|"collection"|"social-proof"|"gallery"|"faq"|"footer"|"conversion";
  niche: string;
  liquidCode: string;
  cssCode: string;
  schemaCode: string;
}

function h(id:string,name:string,cat:CKTemplate["category"],niche:string,liquid:string,css:string,schema:string):CKTemplate{
  return{id,name,category:cat,niche,liquidCode:liquid,cssCode:css,schemaCode:schema};
}

const S = JSON.stringify;

// ── HEADER TEMPLATES (10) ──
const headers: CKTemplate[] = [
  h("hdr-jewelry","Elegant Jewelry Header","header","jewelry",
`<header class="ck-header ck-header--jewelry">
  <div class="ck-header__inner page-width">
    {%- if section.settings.logo -%}
      <a href="/" class="ck-header__logo"><img src="{{ section.settings.logo | image_url: width: 200 }}" alt="{{ shop.name }}" width="200" height="auto" loading="eager"></a>
    {%- else -%}
      <a href="/" class="ck-header__logo-text">{{ shop.name }}</a>
    {%- endif -%}
    <nav class="ck-header__nav" aria-label="Main">
      {%- for link in linklists[section.settings.menu].links -%}
        <a href="{{ link.url }}" class="ck-header__link">{{ link.title }}</a>
      {%- endfor -%}
    </nav>
    <div class="ck-header__actions">
      <a href="/search" aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></a>
      <a href="/cart" aria-label="Cart"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></a>
    </div>
  </div>
</header>`,
`.ck-header--jewelry{background:{{ section.settings.bg_color }};border-bottom:1px solid #e5e1d8;padding:12px 0}
.ck-header__inner{display:flex;align-items:center;justify-content:space-between}
.ck-header__logo img{height:48px;width:auto}
.ck-header__logo-text{font-size:22px;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:{{ section.settings.text_color }};text-decoration:none}
.ck-header__nav{display:flex;gap:28px}
.ck-header__link{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:{{ section.settings.text_color }};text-decoration:none}
.ck-header__link:hover{opacity:.7}
.ck-header__actions{display:flex;gap:16px;color:{{ section.settings.text_color }}}`,
S({name:"CK Jewelry Header",settings:[{type:"image_picker",id:"logo",label:"Logo"},{type:"link_list",id:"menu",label:"Menu",default:"main-menu"},{type:"color",id:"bg_color",label:"Background","default":"#faf8f5"},{type:"color",id:"text_color",label:"Text color","default":"#1a1a1a"}]})),

  h("hdr-fashion","Fashion Minimal Header","header","fashion",
`<header class="ck-header ck-header--fashion">
  <div class="ck-header__inner page-width">
    {%- if section.settings.logo -%}<a href="/"><img src="{{ section.settings.logo | image_url: width: 180 }}" alt="{{ shop.name }}" width="180" loading="eager"></a>
    {%- else -%}<a href="/" class="ck-header__brand">{{ shop.name }}</a>{%- endif -%}
    <nav class="ck-header__nav">{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}">{{ link.title }}</a>{%- endfor -%}</nav>
    <div class="ck-header__icons"><a href="/cart" aria-label="Cart">Bag ({{ cart.item_count }})</a></div>
  </div>
</header>`,
`.ck-header--fashion{padding:16px 0;border-bottom:1px solid #000}.ck-header__inner{display:flex;align-items:center;justify-content:space-between}.ck-header__brand{font-size:24px;font-weight:700;text-decoration:none;color:#000;text-transform:uppercase;letter-spacing:2px}.ck-header__nav{display:flex;gap:24px}.ck-header__nav a{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#000;text-decoration:none}.ck-header__icons a{font-size:12px;color:#000;text-decoration:none}`,
S({name:"CK Fashion Header",settings:[{type:"image_picker",id:"logo",label:"Logo"},{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),

  h("hdr-health","Health & Wellness Header","header","health",
`<header class="ck-header ck-header--health" style="background:{{ section.settings.bg_color }}">
  <div class="ck-header__inner page-width">
    {%- if section.settings.logo -%}<a href="/"><img src="{{ section.settings.logo | image_url: width: 160 }}" alt="{{ shop.name }}" width="160" loading="eager"></a>
    {%- else -%}<a href="/" class="ck-header__brand">{{ shop.name }}</a>{%- endif -%}
    <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" class="ck-hdr-link">{{ link.title }}</a>{%- endfor -%}</nav>
    <a href="/cart" aria-label="Cart">Cart ({{ cart.item_count }})</a>
  </div>
</header>`,
`.ck-header--health{padding:14px 0}.ck-header__inner{display:flex;align-items:center;justify-content:space-between}.ck-header__brand{font-size:20px;font-weight:600;color:#2d6a4f;text-decoration:none}.ck-hdr-link{margin:0 14px;font-size:14px;color:#333;text-decoration:none}.ck-hdr-link:hover{color:#2d6a4f}`,
S({name:"CK Health Header",settings:[{type:"image_picker",id:"logo",label:"Logo"},{type:"link_list",id:"menu",label:"Menu",default:"main-menu"},{type:"color",id:"bg_color",label:"Background","default":"#f0fdf4"}]})),

  h("hdr-electronics","Tech Electronics Header","header","electronics",
`<header class="ck-header--tech" style="background:#111"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
  <a href="/" style="color:#fff;font-size:20px;font-weight:700;text-decoration:none">{{ shop.name }}</a>
  <nav style="display:flex;gap:20px">{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="color:#ccc;font-size:13px;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="color:#fff;font-size:13px;text-decoration:none">Cart ({{ cart.item_count }})</a>
</div></header>`,
``,S({name:"CK Tech Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),

  h("hdr-food","Artisan Food Header","header","food",
`<header style="background:{{ section.settings.bg }};padding:14px 0;border-bottom:2px solid #d4a574"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between">
  <a href="/" style="font-family:Georgia,serif;font-size:24px;color:#5c3d2e;text-decoration:none">{{ shop.name }}</a>
  <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 16px;font-size:14px;color:#5c3d2e;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="color:#5c3d2e;text-decoration:none">🛒 {{ cart.item_count }}</a>
</div></header>`,
``,S({name:"CK Food Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"},{type:"color",id:"bg",label:"Background","default":"#fef7ed"}]})),

  h("hdr-fitness","Fitness Bold Header","header","fitness",
`<header style="background:#000;padding:10px 0"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between">
  <a href="/" style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:3px;text-decoration:none">{{ shop.name }}</a>
  <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 12px;font-size:13px;font-weight:600;text-transform:uppercase;color:#fff;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="background:#e11d48;color:#fff;padding:8px 18px;border-radius:4px;font-size:13px;font-weight:600;text-decoration:none">CART ({{ cart.item_count }})</a>
</div></header>`,
``,S({name:"CK Fitness Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),

  h("hdr-home","Home & Living Header","header","home",
`<header style="background:#fff;padding:16px 0;border-bottom:1px solid #e5e5e5"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between">
  <a href="/" style="font-size:20px;font-weight:500;color:#333;text-decoration:none;letter-spacing:1px">{{ shop.name }}</a>
  <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 16px;font-size:14px;color:#555;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="color:#333;text-decoration:none">Cart ({{ cart.item_count }})</a>
</div></header>`,
``,S({name:"CK Home Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),

  h("hdr-beauty","Beauty & Skincare Header","header","beauty",
`<header style="background:linear-gradient(135deg,#fdf2f8,#fce7f3);padding:14px 0"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between">
  <a href="/" style="font-size:22px;font-weight:300;color:#831843;text-decoration:none;letter-spacing:2px">{{ shop.name }}</a>
  <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 14px;font-size:13px;color:#9d174d;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="color:#831843;text-decoration:none">Bag ({{ cart.item_count }})</a>
</div></header>`,
``,S({name:"CK Beauty Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),

  h("hdr-streetwear","Streetwear Header","header","streetwear",
`<header style="background:#0a0a0a;padding:10px 0"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between">
  <a href="/" style="color:#fff;font-size:24px;font-weight:900;text-transform:uppercase;text-decoration:none">{{ shop.name }}</a>
  <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 12px;font-size:12px;font-weight:700;text-transform:uppercase;color:#fff;text-decoration:none;letter-spacing:1px">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="color:#fff;text-decoration:none;font-size:12px;text-transform:uppercase;font-weight:700">Cart {{ cart.item_count }}</a>
</div></header>`,
``,S({name:"CK Streetwear Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),

  h("hdr-general","Clean General Header","header","general",
`<header style="background:#fff;padding:14px 0;box-shadow:0 1px 3px rgba(0,0,0,.08)"><div class="page-width" style="display:flex;align-items:center;justify-content:space-between">
  <a href="/" style="font-size:20px;font-weight:600;color:#1a1a1a;text-decoration:none">{{ shop.name }}</a>
  <nav>{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 16px;font-size:14px;color:#303030;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <a href="/cart" style="color:#1a1a1a;text-decoration:none">Cart ({{ cart.item_count }})</a>
</div></header>`,
``,S({name:"CK General Header",settings:[{type:"link_list",id:"menu",label:"Menu",default:"main-menu"}]})),
];

// ── HERO TEMPLATES (6) ──
const heroes: CKTemplate[] = [
  h("hero-split","Split Hero","hero","general",
`<section class="ck-hero-split" style="background:{{ section.settings.bg_color }}">
  <div class="page-width" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:60px 0">
    <div>
      <h1 style="font-size:48px;font-weight:700;color:{{ section.settings.heading_color }};line-height:1.1;margin:0 0 16px">{{ section.settings.heading }}</h1>
      <p style="font-size:18px;color:#666;margin:0 0 24px;line-height:1.6">{{ section.settings.subheading }}</p>
      <a href="{{ section.settings.button_link }}" style="display:inline-block;padding:14px 32px;background:{{ section.settings.button_bg }};color:{{ section.settings.button_color }};border-radius:6px;text-decoration:none;font-weight:600;font-size:15px">{{ section.settings.button_text }}</a>
    </div>
    <div>{%- if section.settings.image -%}<img src="{{ section.settings.image | image_url: width: 800 }}" alt="{{ section.settings.heading }}" style="width:100%;border-radius:12px" loading="eager">{%- endif -%}</div>
  </div>
</section>`,
`@media(max-width:768px){.ck-hero-split .page-width{grid-template-columns:1fr!important;text-align:center}}`,
S({name:"CK Split Hero",settings:[{type:"text",id:"heading",label:"Heading","default":"Elevate Your Style"},{type:"textarea",id:"subheading",label:"Subheading","default":"Discover our curated collection of premium essentials."},{type:"image_picker",id:"image",label:"Image"},{type:"text",id:"button_text",label:"Button text","default":"Shop Now"},{type:"url",id:"button_link",label:"Button link","default":"/collections/all"},{type:"color",id:"bg_color",label:"Background","default":"#ffffff"},{type:"color",id:"heading_color",label:"Heading color","default":"#1a1a1a"},{type:"color",id:"button_bg",label:"Button background","default":"#1a1a1a"},{type:"color",id:"button_color",label:"Button text color","default":"#ffffff"}]})),

  h("hero-fullwidth","Full-Width Image Hero","hero","general",
`<section style="position:relative;min-height:{{ section.settings.height }}vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden">
  {%- if section.settings.image -%}<img src="{{ section.settings.image | image_url: width: 1920 }}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="eager">{%- endif -%}
  <div style="position:absolute;inset:0;background:rgba(0,0,0,{{ section.settings.overlay_opacity | divided_by: 100.0 }})"></div>
  <div style="position:relative;z-index:1;max-width:680px;padding:40px 20px">
    <h1 style="font-size:52px;font-weight:700;color:#fff;margin:0 0 16px;line-height:1.1">{{ section.settings.heading }}</h1>
    <p style="font-size:18px;color:rgba(255,255,255,.85);margin:0 0 28px">{{ section.settings.subheading }}</p>
    <a href="{{ section.settings.button_link }}" style="display:inline-block;padding:14px 36px;background:#fff;color:#000;border-radius:6px;text-decoration:none;font-weight:600">{{ section.settings.button_text }}</a>
  </div>
</section>`,``,
S({name:"CK Fullwidth Hero",settings:[{type:"image_picker",id:"image",label:"Background image"},{type:"text",id:"heading",label:"Heading","default":"New Collection"},{type:"textarea",id:"subheading",label:"Subheading","default":"Shop the latest arrivals"},{type:"text",id:"button_text",label:"Button text","default":"Explore"},{type:"url",id:"button_link",label:"Button link","default":"/collections/all"},{type:"range",id:"height",label:"Height",min:40,max:100,step:5,"default":80,unit:"vh"},{type:"range",id:"overlay_opacity",label:"Overlay opacity",min:0,max:80,step:5,"default":40,unit:"%"}]})),

  h("hero-video","Video Background Hero","hero","general",
`<section style="position:relative;min-height:80vh;display:flex;align-items:center;justify-content:center;overflow:hidden">
  {%- if section.settings.video_url != blank -%}<video autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><source src="{{ section.settings.video_url }}" type="video/mp4"></video>{%- endif -%}
  <div style="position:absolute;inset:0;background:rgba(0,0,0,.45)"></div>
  <div style="position:relative;z-index:1;text-align:center;max-width:600px;padding:20px">
    <h1 style="font-size:48px;color:#fff;font-weight:700;margin:0 0 16px">{{ section.settings.heading }}</h1>
    <p style="font-size:18px;color:rgba(255,255,255,.8);margin:0 0 24px">{{ section.settings.subheading }}</p>
    <a href="{{ section.settings.button_link }}" style="padding:14px 32px;background:#fff;color:#000;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">{{ section.settings.button_text }}</a>
  </div>
</section>`,``,
S({name:"CK Video Hero",settings:[{type:"text",id:"video_url",label:"Video URL"},{type:"text",id:"heading",label:"Heading","default":"Watch. Shop. Wear."},{type:"textarea",id:"subheading",label:"Subheading","default":"Our latest campaign"},{type:"text",id:"button_text",label:"Button","default":"Shop Now"},{type:"url",id:"button_link",label:"Button link","default":"/collections/all"}]})),

  h("hero-minimal","Minimal Text Hero","hero","general",
`<section style="padding:80px 0;text-align:center;background:{{ section.settings.bg }}"><div class="page-width">
  <h1 style="font-size:56px;font-weight:300;color:{{ section.settings.color }};letter-spacing:-1px;margin:0 0 16px">{{ section.settings.heading }}</h1>
  <p style="font-size:18px;color:#666;max-width:520px;margin:0 auto 28px">{{ section.settings.subheading }}</p>
  <a href="{{ section.settings.link }}" style="padding:12px 28px;border:2px solid {{ section.settings.color }};color:{{ section.settings.color }};text-decoration:none;font-size:13px;letter-spacing:1px;text-transform:uppercase">{{ section.settings.button }}</a>
</div></section>`,``,
S({name:"CK Minimal Hero",settings:[{type:"text",id:"heading",label:"Heading","default":"Less is More"},{type:"textarea",id:"subheading",label:"Subheading","default":"Timeless pieces for every occasion"},{type:"text",id:"button",label:"Button","default":"Discover"},{type:"url",id:"link",label:"Link","default":"/collections/all"},{type:"color",id:"bg",label:"Background","default":"#fff"},{type:"color",id:"color",label:"Text","default":"#1a1a1a"}]})),

  h("hero-gradient","Gradient Hero","hero","general",
`<section style="background:linear-gradient(135deg,{{ section.settings.color_1 }},{{ section.settings.color_2 }});padding:80px 0;text-align:center"><div class="page-width" style="max-width:640px;margin:0 auto">
  <h1 style="font-size:48px;font-weight:800;color:#fff;margin:0 0 16px">{{ section.settings.heading }}</h1>
  <p style="font-size:18px;color:rgba(255,255,255,.85);margin:0 0 28px">{{ section.settings.sub }}</p>
  <a href="{{ section.settings.link }}" style="padding:14px 32px;background:#fff;color:#000;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">{{ section.settings.btn }}</a>
</div></section>`,``,
S({name:"CK Gradient Hero",settings:[{type:"text",id:"heading",label:"Heading","default":"Summer Collection"},{type:"textarea",id:"sub",label:"Subheading","default":"Bold new arrivals"},{type:"text",id:"btn",label:"Button","default":"Shop Now"},{type:"url",id:"link",label:"Link","default":"/collections/all"},{type:"color",id:"color_1",label:"Gradient start","default":"#6366f1"},{type:"color",id:"color_2",label:"Gradient end","default":"#ec4899"}]})),

  h("hero-cards","Product Cards Hero","hero","general",
`<section style="padding:60px 0;background:{{ section.settings.bg }}"><div class="page-width">
  <h2 style="text-align:center;font-size:36px;font-weight:700;margin:0 0 32px;color:#1a1a1a">{{ section.settings.heading }}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    {%- for product in collections[section.settings.collection].products limit:3 -%}
    <a href="{{ product.url }}" style="text-decoration:none;color:#1a1a1a">
      <div style="border-radius:12px;overflow:hidden;background:#f5f5f5"><img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" style="width:100%;aspect-ratio:1;object-fit:cover" loading="lazy"></div>
      <p style="margin:12px 0 4px;font-weight:600;font-size:15px">{{ product.title }}</p>
      <p style="margin:0;color:#666;font-size:14px">{{ product.price | money }}</p>
    </a>
    {%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK Product Cards Hero",settings:[{type:"text",id:"heading",label:"Heading","default":"Best Sellers"},{type:"collection",id:"collection",label:"Collection"},{type:"color",id:"bg",label:"Background","default":"#fff"}]})),
];

// ── BANNER TEMPLATES (5) ──
const banners: CKTemplate[] = [
  h("ban-announce","Announcement Bar","banner","general",
`<div style="background:{{ section.settings.bg }};padding:10px 0;text-align:center"><p style="margin:0;font-size:13px;color:{{ section.settings.color }};font-weight:500">{{ section.settings.text }} {%- if section.settings.link != blank -%}<a href="{{ section.settings.link }}" style="color:{{ section.settings.color }};font-weight:700;margin-left:8px;text-decoration:underline">{{ section.settings.link_text }}</a>{%- endif -%}</p></div>`,``,
S({name:"CK Announcement",settings:[{type:"text",id:"text",label:"Text","default":"Free shipping on orders over $50"},{type:"url",id:"link",label:"Link"},{type:"text",id:"link_text",label:"Link text","default":"Shop now"},{type:"color",id:"bg",label:"Background","default":"#1a1a1a"},{type:"color",id:"color",label:"Text color","default":"#ffffff"}]})),

  h("ban-sale","Sale Banner","banner","general",
`<section style="background:linear-gradient(90deg,#dc2626,#b91c1c);padding:24px 0;text-align:center"><div class="page-width"><h2 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 8px">{{ section.settings.heading }}</h2><p style="color:rgba(255,255,255,.9);font-size:16px;margin:0 0 16px">{{ section.settings.sub }}</p><a href="{{ section.settings.link }}" style="display:inline-block;padding:10px 24px;background:#fff;color:#dc2626;border-radius:6px;font-weight:700;text-decoration:none">{{ section.settings.btn }}</a></div></section>`,``,
S({name:"CK Sale Banner",settings:[{type:"text",id:"heading",label:"Heading","default":"FLASH SALE — UP TO 50% OFF"},{type:"text",id:"sub",label:"Subheading","default":"Limited time only"},{type:"text",id:"btn",label:"Button","default":"Shop Sale"},{type:"url",id:"link",label:"Link","default":"/collections/sale"}]})),

  h("ban-shipping","Free Shipping Bar","banner","general",
`<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:12px 0;text-align:center"><p style="margin:0;font-size:14px;color:#166534"><strong>🚚 Free Shipping</strong> on all orders over {{ section.settings.threshold }}</p></div>`,``,
S({name:"CK Shipping Bar",settings:[{type:"text",id:"threshold",label:"Threshold","default":"$75"}]})),

  h("ban-countdown","Countdown Banner","banner","general",
`<section style="background:#1e1b4b;padding:20px 0;text-align:center"><div class="page-width"><h3 style="color:#fff;font-size:20px;margin:0 0 12px">{{ section.settings.heading }}</h3><div id="ck-ban-timer" style="display:flex;justify-content:center;gap:16px;color:#fff;font-size:24px;font-weight:700" data-deadline="{{ section.settings.deadline }}"></div></div></section>
<script>!function(){var t=document.getElementById("ck-ban-timer");if(t){var d=new Date(t.dataset.deadline).getTime();!function u(){var n=d-Date.now();if(n<=0){t.innerHTML="<span>Offer ended</span>";return}var dd=Math.floor(n/864e5),hh=Math.floor(n%864e5/36e5),mm=Math.floor(n%36e5/6e4),ss=Math.floor(n%6e4/1e3);t.innerHTML='<span>'+dd+'d</span><span>'+hh+'h</span><span>'+mm+'m</span><span>'+ss+'s</span>';requestAnimationFrame(u)}()}}()</script>`,``,
S({name:"CK Countdown Banner",settings:[{type:"text",id:"heading",label:"Heading","default":"Sale ends in"},{type:"text",id:"deadline",label:"Deadline (ISO)","default":"2025-12-31T23:59:59"}]})),

  h("ban-trust","Trust Icons Bar","banner","general",
`<section style="background:{{ section.settings.bg }};padding:16px 0"><div class="page-width" style="display:flex;justify-content:center;gap:40px;flex-wrap:wrap">
  <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>{{ section.settings.text_1 }}</div>
  <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>{{ section.settings.text_2 }}</div>
  <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>{{ section.settings.text_3 }}</div>
</div></section>`,``,
S({name:"CK Trust Bar",settings:[{type:"text",id:"text_1",label:"Badge 1","default":"Secure Checkout"},{type:"text",id:"text_2",label:"Badge 2","default":"Free Shipping"},{type:"text",id:"text_3",label:"Badge 3","default":"Easy Returns"},{type:"color",id:"bg",label:"Background","default":"#f9fafb"}]})),
];

// ── COLLECTION TEMPLATES (4) ──
const collections: CKTemplate[] = [
  h("col-featured","Featured Collection Grid","collection","general",
`<section style="padding:60px 0;background:{{ section.settings.bg }}"><div class="page-width">
  <h2 style="text-align:center;font-size:28px;font-weight:700;margin:0 0 32px;color:#1a1a1a">{{ section.settings.heading }}</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px">
    {%- for product in collections[section.settings.collection].products limit:8 -%}
    <a href="{{ product.url }}" style="text-decoration:none;color:#1a1a1a">
      <div style="border-radius:8px;overflow:hidden;background:#f5f5f5"><img src="{{ product.featured_image | image_url: width: 480 }}" alt="{{ product.title }}" style="width:100%;aspect-ratio:1;object-fit:cover" loading="lazy"></div>
      <p style="margin:10px 0 4px;font-size:14px;font-weight:600">{{ product.title }}</p>
      <p style="margin:0;font-size:14px;color:#666">{{ product.price | money }}</p>
    </a>
    {%- endfor -%}
  </div>
</div></section>`,`@media(max-width:768px){section .page-width>div{grid-template-columns:repeat(2,1fr)!important}}`,
S({name:"CK Featured Collection",settings:[{type:"text",id:"heading",label:"Heading","default":"Featured Products"},{type:"collection",id:"collection",label:"Collection"},{type:"color",id:"bg",label:"Background","default":"#ffffff"}]})),

  h("col-scroll","Horizontal Scroll Collection","collection","general",
`<section style="padding:48px 0"><div class="page-width"><h2 style="font-size:24px;font-weight:700;margin:0 0 24px">{{ section.settings.heading }}</h2>
  <div style="display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:12px">
    {%- for product in collections[section.settings.collection].products limit:12 -%}
    <a href="{{ product.url }}" style="flex:0 0 220px;scroll-snap-align:start;text-decoration:none;color:#1a1a1a"><div style="border-radius:8px;overflow:hidden"><img src="{{ product.featured_image | image_url: width: 440 }}" alt="{{ product.title }}" style="width:100%;aspect-ratio:1;object-fit:cover" loading="lazy"></div><p style="margin:8px 0 2px;font-size:13px;font-weight:600">{{ product.title }}</p><p style="margin:0;font-size:13px;color:#666">{{ product.price | money }}</p></a>
    {%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK Scroll Collection",settings:[{type:"text",id:"heading",label:"Heading","default":"New Arrivals"},{type:"collection",id:"collection",label:"Collection"}]})),

  h("col-tabs","Tabbed Collections","collection","general",
`<section style="padding:60px 0"><div class="page-width"><h2 style="text-align:center;font-size:28px;font-weight:700;margin:0 0 24px">{{ section.settings.heading }}</h2>
  <div style="text-align:center;margin-bottom:28px"><a href="/collections/all" style="margin:0 12px;font-size:14px;color:#005bd3;text-decoration:none;font-weight:600;border-bottom:2px solid #005bd3;padding-bottom:8px">All</a></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px">
    {%- for product in collections[section.settings.collection].products limit:8 -%}
    <a href="{{ product.url }}" style="text-decoration:none;color:#1a1a1a"><img src="{{ product.featured_image | image_url: width: 480 }}" alt="{{ product.title }}" style="width:100%;border-radius:8px;aspect-ratio:1;object-fit:cover" loading="lazy"><p style="margin:8px 0 2px;font-size:14px;font-weight:600">{{ product.title }}</p><p style="margin:0;font-size:14px;color:#666">{{ product.price | money }}</p></a>
    {%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK Tabbed Collection",settings:[{type:"text",id:"heading",label:"Heading","default":"Shop by Category"},{type:"collection",id:"collection",label:"Collection"}]})),

  h("col-banner","Collection with Banner","collection","general",
`<section style="padding:48px 0"><div class="page-width" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">
  <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:12px;padding:40px;color:#fff"><h2 style="font-size:32px;font-weight:700;margin:0 0 12px">{{ section.settings.heading }}</h2><p style="font-size:16px;opacity:.85;margin:0 0 20px">{{ section.settings.sub }}</p><a href="{{ section.settings.link }}" style="padding:10px 24px;background:#fff;color:#1e1b4b;border-radius:6px;font-weight:600;text-decoration:none;display:inline-block">{{ section.settings.btn }}</a></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    {%- for product in collections[section.settings.collection].products limit:4 -%}
    <a href="{{ product.url }}" style="text-decoration:none;color:#1a1a1a"><img src="{{ product.featured_image | image_url: width: 360 }}" alt="{{ product.title }}" style="width:100%;border-radius:8px;aspect-ratio:1;object-fit:cover" loading="lazy"><p style="margin:6px 0 0;font-size:13px;font-weight:600">{{ product.title }}</p></a>
    {%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK Collection Banner",settings:[{type:"text",id:"heading",label:"Heading","default":"New In"},{type:"textarea",id:"sub",label:"Subheading","default":"Fresh arrivals just dropped"},{type:"text",id:"btn",label:"Button","default":"View All"},{type:"url",id:"link",label:"Link","default":"/collections/all"},{type:"collection",id:"collection",label:"Collection"}]})),
];

// ── SOCIAL PROOF TEMPLATES (4) ──
const socialProof: CKTemplate[] = [
  h("sp-reviews","Customer Reviews Grid","social-proof","general",
`<section style="padding:60px 0;background:{{ section.settings.bg }}"><div class="page-width"><h2 style="text-align:center;font-size:28px;font-weight:700;margin:0 0 32px">{{ section.settings.heading }}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    {%- for block in section.blocks -%}
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:10px;padding:24px">
      <div style="color:#f59e0b;font-size:16px;margin-bottom:8px">★★★★★</div>
      <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 16px">{{ block.settings.quote }}</p>
      <p style="font-size:13px;font-weight:600;color:#1a1a1a;margin:0">{{ block.settings.author }}</p>
      <p style="font-size:12px;color:#9ca3af;margin:4px 0 0">{{ block.settings.location }}</p>
    </div>
    {%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK Reviews Grid",settings:[{type:"text",id:"heading",label:"Heading","default":"What Our Customers Say"},{type:"color",id:"bg",label:"Background","default":"#fafafa"}],blocks:[{type:"review",name:"Review",settings:[{type:"textarea",id:"quote",label:"Quote","default":"Amazing quality!"},{type:"text",id:"author",label:"Author","default":"Sarah M."},{type:"text",id:"location",label:"Location","default":"New York, NY"}]}],presets:[{name:"CK Reviews Grid",blocks:[{type:"review"},{type:"review"},{type:"review"}]}]})),

  h("sp-logos","Press Logos Bar","social-proof","general",
`<section style="padding:40px 0;background:#fff"><div class="page-width" style="text-align:center"><p style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin:0 0 20px">{{ section.settings.label }}</p>
  <div style="display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap;opacity:.5">
    {%- for block in section.blocks -%}{%- if block.settings.logo -%}<img src="{{ block.settings.logo | image_url: width: 120 }}" alt="Press logo" style="height:32px;width:auto">{%- endif -%}{%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK Press Logos",settings:[{type:"text",id:"label",label:"Label","default":"As seen in"}],blocks:[{type:"logo",name:"Logo",settings:[{type:"image_picker",id:"logo",label:"Logo image"}]}],presets:[{name:"CK Press Logos",blocks:[{type:"logo"},{type:"logo"},{type:"logo"},{type:"logo"}]}]})),

  h("sp-stats","Stats Counter","social-proof","general",
`<section style="padding:48px 0;background:{{ section.settings.bg }}"><div class="page-width" style="display:flex;justify-content:center;gap:60px;flex-wrap:wrap;text-align:center">
  {%- for block in section.blocks -%}
  <div><p style="font-size:36px;font-weight:800;color:{{ section.settings.color }};margin:0">{{ block.settings.number }}</p><p style="font-size:13px;color:#666;margin:4px 0 0">{{ block.settings.label }}</p></div>
  {%- endfor -%}
</div></section>`,``,
S({name:"CK Stats",settings:[{type:"color",id:"bg",label:"Background","default":"#f9fafb"},{type:"color",id:"color",label:"Number color","default":"#1a1a1a"}],blocks:[{type:"stat",name:"Stat",settings:[{type:"text",id:"number",label:"Number","default":"10K+"},{type:"text",id:"label",label:"Label","default":"Happy Customers"}]}],presets:[{name:"CK Stats",blocks:[{type:"stat"},{type:"stat"},{type:"stat"}]}]})),

  h("sp-ugc","UGC Photo Grid","social-proof","general",
`<section style="padding:48px 0"><div class="page-width"><h2 style="text-align:center;font-size:24px;font-weight:700;margin:0 0 8px">{{ section.settings.heading }}</h2><p style="text-align:center;font-size:14px;color:#666;margin:0 0 24px">{{ section.settings.sub }}</p>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">
    {%- for block in section.blocks -%}{%- if block.settings.image -%}<div style="aspect-ratio:1;overflow:hidden"><img src="{{ block.settings.image | image_url: width: 300 }}" alt="Customer photo" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>{%- endif -%}{%- endfor -%}
  </div>
</div></section>`,``,
S({name:"CK UGC Grid",settings:[{type:"text",id:"heading",label:"Heading","default":"#ShopWithUs"},{type:"text",id:"sub",label:"Subheading","default":"Tag us on Instagram"}],blocks:[{type:"photo",name:"Photo",settings:[{type:"image_picker",id:"image",label:"Image"}]}],presets:[{name:"CK UGC Grid",blocks:[{type:"photo"},{type:"photo"},{type:"photo"},{type:"photo"},{type:"photo"},{type:"photo"}]}]})),
];

// ── FOOTER TEMPLATES (5) ──
const footers: CKTemplate[] = [
  h("ftr-standard","Standard Footer","footer","general",
`<footer style="background:#1a1a1a;color:#fff;padding:48px 0 24px"><div class="page-width" style="display:grid;grid-template-columns:repeat(4,1fr);gap:32px">
  <div><h4 style="font-size:14px;font-weight:700;margin:0 0 16px">{{ shop.name }}</h4><p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0">{{ section.settings.about }}</p></div>
  <div><h4 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px">Shop</h4><nav>{%- for link in linklists[section.settings.menu_1].links -%}<a href="{{ link.url }}" style="display:block;font-size:13px;color:#9ca3af;text-decoration:none;margin-bottom:8px">{{ link.title }}</a>{%- endfor -%}</nav></div>
  <div><h4 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px">Help</h4><nav>{%- for link in linklists[section.settings.menu_2].links -%}<a href="{{ link.url }}" style="display:block;font-size:13px;color:#9ca3af;text-decoration:none;margin-bottom:8px">{{ link.title }}</a>{%- endfor -%}</nav></div>
  <div><h4 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px">Newsletter</h4><p style="font-size:13px;color:#9ca3af;margin:0 0 12px">{{ section.settings.newsletter_text }}</p></div>
</div><div class="page-width" style="border-top:1px solid #333;margin-top:32px;padding-top:16px;text-align:center"><p style="font-size:12px;color:#666;margin:0">© {{ 'now' | date: '%Y' }} {{ shop.name }}. All rights reserved.</p></div></footer>`,``,
S({name:"CK Standard Footer",settings:[{type:"textarea",id:"about",label:"About text","default":"Quality products for everyday life."},{type:"link_list",id:"menu_1",label:"Shop menu","default":"main-menu"},{type:"link_list",id:"menu_2",label:"Help menu","default":"footer"},{type:"text",id:"newsletter_text",label:"Newsletter text","default":"Get 10% off your first order"}]})),

  h("ftr-minimal","Minimal Footer","footer","general",
`<footer style="border-top:1px solid #e5e5e5;padding:24px 0;text-align:center"><div class="page-width"><p style="font-size:12px;color:#999;margin:0">© {{ 'now' | date: '%Y' }} {{ shop.name }}</p></div></footer>`,``,
S({name:"CK Minimal Footer",settings:[]})),

  h("ftr-centered","Centered Footer","footer","general",
`<footer style="background:#fafafa;padding:48px 0;text-align:center"><div class="page-width">
  <p style="font-size:20px;font-weight:600;color:#1a1a1a;margin:0 0 16px">{{ shop.name }}</p>
  <nav style="margin-bottom:16px">{%- for link in linklists[section.settings.menu].links -%}<a href="{{ link.url }}" style="margin:0 12px;font-size:13px;color:#666;text-decoration:none">{{ link.title }}</a>{%- endfor -%}</nav>
  <p style="font-size:12px;color:#999;margin:0">© {{ 'now' | date: '%Y' }} {{ shop.name }}</p>
</div></footer>`,``,
S({name:"CK Centered Footer",settings:[{type:"link_list",id:"menu",label:"Menu","default":"footer"}]})),

  h("ftr-dark","Dark Footer with Columns","footer","general",
`<footer style="background:#0a0a0a;color:#e5e5e5;padding:60px 0 24px"><div class="page-width" style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px">
  <div><p style="font-size:22px;font-weight:700;color:#fff;margin:0 0 12px">{{ shop.name }}</p><p style="font-size:13px;color:#888;line-height:1.6;margin:0">{{ section.settings.tagline }}</p></div>
  <div><h4 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;color:#fff">Shop</h4>{%- for link in linklists[section.settings.menu_1].links -%}<a href="{{ link.url }}" style="display:block;font-size:13px;color:#888;text-decoration:none;margin-bottom:6px">{{ link.title }}</a>{%- endfor -%}</div>
  <div><h4 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;color:#fff">Support</h4>{%- for link in linklists[section.settings.menu_2].links -%}<a href="{{ link.url }}" style="display:block;font-size:13px;color:#888;text-decoration:none;margin-bottom:6px">{{ link.title }}</a>{%- endfor -%}</div>
  <div><h4 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;color:#fff">Legal</h4>{%- for link in linklists[section.settings.menu_3].links -%}<a href="{{ link.url }}" style="display:block;font-size:13px;color:#888;text-decoration:none;margin-bottom:6px">{{ link.title }}</a>{%- endfor -%}</div>
</div><div class="page-width" style="border-top:1px solid #222;margin-top:40px;padding-top:16px;text-align:center"><p style="font-size:11px;color:#555;margin:0">© {{ 'now' | date: '%Y' }} {{ shop.name }}</p></div></footer>`,``,
S({name:"CK Dark Footer",settings:[{type:"text",id:"tagline",label:"Tagline","default":"Quality you can trust."},{type:"link_list",id:"menu_1",label:"Shop menu","default":"main-menu"},{type:"link_list",id:"menu_2",label:"Support menu","default":"footer"},{type:"link_list",id:"menu_3",label:"Legal menu","default":"footer"}]})),

  h("ftr-newsletter","Newsletter Footer","footer","general",
`<footer style="background:#f5f5f4;padding:48px 0"><div class="page-width" style="text-align:center;max-width:480px;margin:0 auto">
  <h3 style="font-size:20px;font-weight:700;margin:0 0 8px">{{ section.settings.heading }}</h3>
  <p style="font-size:14px;color:#666;margin:0 0 20px">{{ section.settings.sub }}</p>
  <form style="display:flex;gap:8px"><input type="email" placeholder="your@email.com" style="flex:1;padding:10px 14px;border:1px solid #d4d4d4;border-radius:6px;font-size:14px"><button type="submit" style="padding:10px 20px;background:#1a1a1a;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer">Subscribe</button></form>
  <p style="font-size:12px;color:#999;margin:16px 0 0">© {{ 'now' | date: '%Y' }} {{ shop.name }}</p>
</div></footer>`,``,
S({name:"CK Newsletter Footer",settings:[{type:"text",id:"heading",label:"Heading","default":"Stay in the loop"},{type:"text",id:"sub",label:"Subheading","default":"Get exclusive offers and new product alerts"}]})),
];

// ── FAQ (added to fill gallery slot since no gallery templates needed) ──
const faqTemplates: CKTemplate[] = [];

// ── CONVERSION TEMPLATES (2) ──
const conversion: CKTemplate[] = [
  h("conv-sticky-cart", "Sticky Add to Cart", "conversion", "general",
    `<div class="ck-sticky-cart" id="ck-sticky-cart" style="display:none;background:{{ section.settings.bg }};">
      <div class="page-width ck-sticky-cart__inner">
        <div class="ck-sticky-cart__product">
          {%- if product.featured_image -%}
            <img src="{{ product.featured_image | image_url: width: 80 }}" alt="{{ product.title }}" loading="lazy">
          {%- endif -%}
          <div>
            <div class="ck-sticky-cart__title" style="color:{{ section.settings.text_color }}">{{ product.title }}</div>
            <div class="ck-sticky-cart__price" style="color:{{ section.settings.text_color }}">{{ product.price | money }}</div>
          </div>
        </div>
        <button class="ck-sticky-cart__btn" style="background:{{ section.settings.btn_bg }};color:{{ section.settings.btn_color }}" onclick="document.querySelector('form[action=\\'/cart/add\\'] button[type=\\'submit\\']').click()">{{ section.settings.btn_text }}</button>
      </div>
    </div>
    <script>
      document.addEventListener("scroll", () => {
        const sc = document.getElementById("ck-sticky-cart");
        const btn = document.querySelector('form[action="/cart/add"] button[type="submit"]');
        if(!sc || !btn) return;
        const rect = btn.getBoundingClientRect();
        if(rect.bottom < 0) {
          sc.style.display = 'block';
          setTimeout(() => sc.classList.add('is-visible'), 10);
        } else {
          sc.classList.remove('is-visible');
          setTimeout(() => { if(!sc.classList.contains('is-visible')) sc.style.display='none'; }, 300);
        }
      });
    </script>`,
    `.ck-sticky-cart { position:fixed; bottom:0; left:0; width:100%; z-index:999; box-shadow:0 -4px 12px rgba(0,0,0,0.1); transform:translateY(100%); transition:transform 0.3s ease; padding: 12px 0; }
     .ck-sticky-cart.is-visible { transform:translateY(0); }
     .ck-sticky-cart__inner { display:flex; justify-content:space-between; align-items:center; }
     .ck-sticky-cart__product { display:flex; align-items:center; gap: 16px; }
     .ck-sticky-cart__product img { width: 48px; height: 48px; border-radius: 4px; object-fit: cover; }
     .ck-sticky-cart__title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
     .ck-sticky-cart__price { font-size: 13px; opacity: 0.8; }
     .ck-sticky-cart__btn { font-weight:700; border:none; padding:12px 24px; border-radius:6px; cursor:pointer; font-size:14px; text-transform:uppercase; letter-spacing:1px; transition:opacity 0.2s; }
     .ck-sticky-cart__btn:hover { opacity:0.9; }
     @media (max-width: 768px) { .ck-sticky-cart__product { display:none; } .ck-sticky-cart__btn { width:100%; } }`,
    JSON.stringify({
      name: "Sticky Add to Cart",
      limit: 1,
      enabled_on: { templates: ["product"] },
      settings: [
        { type: "color", id: "bg", label: "Background", default: "#ffffff" },
        { type: "color", id: "text_color", label: "Text", default: "#1a1a1a" },
        { type: "color", id: "btn_bg", label: "Button Background", default: "#1a1a1a" },
        { type: "color", id: "btn_color", label: "Button Text", default: "#ffffff" },
        { type: "text", id: "btn_text", label: "Button Label", default: "Add to Cart" }
      ]
    })
  ),
  h("conv-urgency", "Urgency / Low Stock", "conversion", "general",
    `<div class="ck-urgency" style="background:{{ section.settings.bg }}; color:{{ section.settings.text_color }};">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>{{ section.settings.text | replace: '[inventory]', product.selected_or_first_available_variant.inventory_quantity }}</span>
    </div>`,
    `.ck-urgency { display:flex; align-items:center; gap: 8px; padding: 12px 16px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-bottom: 16px; }
     .ck-urgency svg { animation: ck-pulse 2s infinite; color: #dc2626; }
     @keyframes ck-pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`,
    JSON.stringify({
      name: "Urgency Indicator",
      enabled_on: { templates: ["product"] },
      settings: [
        { type: "text", id: "text", label: "Message", default: "Hurry! Only [inventory] items left in stock." },
        { type: "color", id: "bg", label: "Background", default: "#fee2e2" },
        { type: "color", id: "text_color", label: "Text Color", default: "#991b1b" }
      ]
    })
  )
];

export const CONVERTKIT_TEMPLATES: CKTemplate[] = [
  ...headers, ...heroes, ...banners, ...collections, ...socialProof, ...footers, ...faqTemplates, ...conversion,
];

export function getTemplateById(id: string): CKTemplate | undefined {
  return CONVERTKIT_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(cat: CKTemplate["category"]): CKTemplate[] {
  return CONVERTKIT_TEMPLATES.filter((t) => t.category === cat);
}
