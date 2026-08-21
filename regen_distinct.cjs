const fs=require('fs');const path=require('path');
const base='dev-theme-peri';
const niches=[
  {id:'streetwear', label:'STREETWEAR', accent:'#E11D48', accent2:'#FACC15', bg:'#0B0B0D', text:'#FFFFFF', icon:'◼', desc:'Heavyweight cotton, utility cuts for city motion'},
  {id:'activewear', label:'ACTIVEWEAR', accent:'#06B6D4', accent2:'#0EA5E9', bg:'#ECFEFF', text:'#0F172A', icon:'⚡', desc:'Seamless stretch, breathable knit for every rep'},
  {id:'beauty', label:'BEAUTY', accent:'#EC4899', accent2:'#F43F5E', bg:'#FFF1F2', text:'#4A044E', icon:'✦', desc:'Clean botanicals, clinical potency for real skin'},
  {id:'electronics', label:'ELECTRONICS', accent:'#6366F1', accent2:'#22D3EE', bg:'#0F172A', text:'#F8FAFC', icon:'◆', desc:'Flagship specs, honest price on gadgets that matter'},
  {id:'ethnic-wear', label:'ETHNIC WEAR', accent:'#B45309', accent2:'#D97706', bg:'#FFFBEB', text:'#431407', icon:'❦', desc:'Handloom sarees & kurta sets rooted in craft'},
  {id:'food', label:'GOURMET', accent:'#16A34A', accent2:'#84CC16', bg:'#F0FDF4', text:'#052E16', icon:'🌿', desc:'Artisan organic staples for honest kitchens'},
  {id:'grooming', label:'GROOMING', accent:'#0D9488', accent2:'#14B8A6', bg:'#F0FDFA', text:'#134E4A', icon:'✂', desc:'Barber-grade care for modern men'},
  {id:'home-decor', label:'HOME DECOR', accent:'#7C3AED', accent2:'#A78BFA', bg:'#F5F3FF', text:'#1E1B4B', icon:'⬢', desc:'Handcrafted ceramics & linens for lived-in spaces'},
  {id:'jewellery', label:'JEWELLERY', accent:'#CA8A04', accent2:'#EAB308', bg:'#FEFCE8', text:'#422006', icon:'◇', desc:'Gold & lab diamonds for everyday heirlooms'},
  {id:'kids', label:'KIDS', accent:'#F97316', accent2:'#FB923C', bg:'#FFF7ED', text:'#431407', icon:'★', desc:'Safe soft creative essentials for tiny humans'},
];
function nicheFor(v){ return niches[(v-65)%niches.length]; }

// Hero distinct templates - 6 variants
function hero_cyber(v,n){
 return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;800&family=Space+Grotesk:wght@500;700&display=swap');
#shopify-section-{{ section.id }}{--hp${v}-bg:{{section.settings.bg_color|default:'${n.bg}'}};--hp${v}-accent:${n.accent};background: var(--hp${v}-bg);color: {{section.settings.text_color|default:'${n.text}'}};font-family:'Space Grotesk',sans-serif;padding:0;position:relative;overflow:hidden}
#shopify-section-{{ section.id }}::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 1px, transparent 1px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0 1px, transparent 1px 80px);pointer-events:none}
.hp${v}-hero{max-width:{{section.settings.container_width|default:1280}}px;margin:0 auto;padding:70px 24px 70px;display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;position:relative;z-index:1}
.hp${v}-kicker{display:inline-flex;gap:8px;align-items:center;padding:6px 14px;border:1px solid ${n.accent};background: ${n.accent}14;color:${n.accent};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-radius:4px}
.hp${v}-title{font-family:'JetBrains Mono',monospace;font-size:clamp(30px,4.8vw,54px);font-weight:800;line-height:1;text-transform:uppercase;margin:18px 0 14px;letter-spacing:-1px}
.hp${v}-title span{background:linear-gradient(90deg,${n.accent},${n.accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hp${v}-desc{opacity:.7;line-height:1.7;max-width:520px}
.hp${v}-cta{margin-top:22px;display:flex;gap:12px;flex-wrap:wrap}
.hp${v}-btn{padding:14px 26px;background:${n.accent};color:#fff;font-weight:700;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;text-decoration:none;border-radius:4px}
.hp${v}-btn--ghost{background:transparent;color:${n.accent};border:1px solid ${n.accent}}
.hp${v}-media{position:relative;border:1px solid ${n.accent}40;border-radius:12px;overflow:hidden;height:520px;background:#000}
.hp${v}-media img{width:100%;height:100%;object-fit:cover;filter:contrast(1.1) saturate(1.2)}
.hp${v}-hud{position:absolute;bottom:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:10px}
.hp${v}-hud span{background:rgba(0,0,0,.7);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15);color:#fff;padding:8px 12px;border-radius:6px;font-size:11px;font-family:'JetBrains Mono',monospace}
@media(max-width:992px){.hp${v}-hero{grid-template-columns:1fr;text-align:center}.hp${v}-cta{justify-content:center}.hp${v}-media{height:360px}}
{%- endstyle -%}
<div class="hp${v}-hero">
  <div>
    <div class="hp${v}-kicker"><span>${n.icon}</span><span>{{section.settings.badge|default:'${n.label} // MATRIX v${v}'}}</span></div>
    <h1 class="hp${v}-title">{{section.settings.heading|default:'${n.label.split(' ')[0]} <span>${n.id.toUpperCase()}</span>'}}</h1>
    <p class="hp${v}-desc">{{section.settings.description|default:'${n.desc} Cyber grid, terminal hud & drop-coded utility.'}}</p>
    <div class="hp${v}-cta"><a href="{{section.settings.btn_url|default:'/collections/all'}}" class="hp${v}-btn">{{section.settings.btn_text|default:'Enter Matrix'}}</a>{% if section.settings.btn2_text != blank %}<a href="{{section.settings.btn2_url}}" class="hp${v}-btn hp${v}-btn--ghost">{{section.settings.btn2_text}}</a>{% endif %}</div>
  </div>
  <div class="hp${v}-media">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" alt="{{section.settings.heading|strip_html}}" loading="eager">{% else %}{{'lifestyle-1'|placeholder_svg_tag}}{% endif %}<div class="hp${v}-hud"><span>● LIVE DROP</span><span>{{section.settings.float_sub|default:'50K VERIFIED'}}</span></div></div>
</div>
{% schema %}{"name":"HP${v} Hero Cyber","settings":[{"type":"color","id":"bg_color","label":"BG","default":"${n.bg}"},{"type":"color","id":"text_color","label":"Text","default":"${n.text}"},{"type":"text","id":"badge","label":"Badge","default":"${n.label} // MATRIX v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"${n.label.split(' ')[0]} <span>${n.id.toUpperCase()}</span>"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Enter Matrix"},{"type":"url","id":"btn_url","label":"Link"},{"type":"text","id":"btn2_text","label":"Ghost"},{"type":"url","id":"btn2_url","label":"Ghost link"},{"type":"image_picker","id":"image","label":"Image"},{"type":"text","id":"float_sub","label":"HUD","default":"50K VERIFIED"},{"type":"range","id":"container_width","min":1000,"max":1440,"step":20,"unit":"px","label":"Width","default":1280}],"presets":[{"name":"HP${v} Hero Cyber"}]}{% endschema %}`;
}
function hero_editorial(v,n){
 return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
#shopify-section-{{ section.id }}{--hp${v}-bg:{{section.settings.bg_color|default:'#FFFBEB'}};--hp${v}-accent:${n.accent};background:var(--hp${v}-bg);color:{{section.settings.text_color|default:'${n.text}'}};font-family:'Plus Jakarta Sans',sans-serif;padding:80px 0;position:relative}
.hp${v}-wrap{max-width:{{section.settings.container_width|default:1240}}px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:.95fr 1.05fr;gap:56px;align-items:center}
.hp${v}-eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${n.accent};font-weight:700;margin-bottom:14px}
.hp${v}-h{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,62px);line-height:.95;font-weight:700;margin:0}
.hp${v}-h em{font-style:italic;font-weight:400;color:${n.accent}}
.hp${v}-p{margin:16px 0 28px;opacity:.7;line-height:1.8;max-width:500px}
.hp${v}-btn{display:inline-flex;align-items:center;gap:10px;padding:15px 30px;background:${n.accent};color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
.hp${v}-arch{border-radius:180px 180px 24px 24px;overflow:hidden;height:560px;border:1px solid ${n.accent}22;box-shadow:0 20px 50px rgba(0,0,0,.08);position:relative}
.hp${v}-arch img{width:100%;height:100%;object-fit:cover}
.hp${v}-note{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:#fff;border-radius:12px;padding:12px 18px;display:flex;gap:12px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.12);white-space:nowrap}
@media(max-width:900px){.hp${v}-wrap{grid-template-columns:1fr;text-align:center}.hp${v}-p{margin-left:auto;margin-right:auto}.hp${v}-arch{height:380px;border-radius:24px}}
{%- endstyle -%}
<div class="hp${v}-wrap">
  <div>
    <div class="hp${v}-eyebrow">{{section.settings.badge|default:'${n.label} — Atelier v${v}'}}</div>
    <h1 class="hp${v}-h">{{section.settings.heading|default:'Quiet Luxury, <em>${n.accentTitle||n.id}</em>'}}</h1>
    <p class="hp${v}-p">{{section.settings.description|default:'${n.desc} Soft drape, heritage craft & modern ease.'}}</p>
    <a href="{{section.settings.btn_url|default:'/collections/all'}}" class="hp${v}-btn">{{section.settings.btn_text|default:'Explore Collection'}} →</a>
  </div>
  <div class="hp${v}-arch">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" alt="" loading="eager">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}<div class="hp${v}-note"><span style="width:36px;height:36px;border-radius:50%;background:${n.accent};display:grid;place-items:center;color:#fff">${n.icon}</span><span style="font-weight:700">{{section.settings.float_title|default:'Handcrafted'}}</span></div></div>
</div>
{% schema %}{"name":"HP${v} Hero Editorial","settings":[{"type":"color","id":"bg_color","label":"BG","default":"${n.bg}"},{"type":"color","id":"text_color","label":"Text","default":"${n.text}"},{"type":"text","id":"badge","label":"Eyebrow","default":"${n.label} — Atelier v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"Quiet Luxury, <em>${n.id}</em>"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Explore Collection"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"},{"type":"text","id":"float_title","label":"Note","default":"Handcrafted"},{"type":"range","id":"container_width","min":1000,"max":1440,"step":20,"unit":"px","label":"Width","default":1240}],"presets":[{"name":"HP${v} Hero Editorial"}]}{% endschema %}`;
}
function hero_brutalist(v,n){
 return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&display=swap');
#shopify-section-{{ section.id }}{background:{{section.settings.bg_color|default:'#ffffff'}};color:#111;padding:0;border-top:6px solid ${n.accent};border-bottom:6px solid #111}
.hp${v}-bar{background:${n.accent};color:#fff;padding:8px 0;overflow:hidden;white-space:nowrap}
.hp${v}-bar span{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-right:32px}
.hp${v}-grid{max-width:{{section.settings.container_width|default:1280}}px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;min-height:560px}
.hp${v}-left{padding:50px 24px;border-right:6px solid #111;display:flex;flex-direction:column;justify-content:center}
.hp${v}-badge{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:#111;color:#fff;display:inline-block;padding:6px 10px;margin-bottom:16px}
.hp${v}-h{font-family:'Anton',sans-serif;font-size:clamp(40px,6vw,78px);line-height:.9;text-transform:uppercase;margin:0}
.hp${v}-h span{color:${n.accent};-webkit-text-stroke:1.5px #111}
.hp${v}-p{font-family:'Space Mono',monospace;font-size:13px;line-height:1.7;opacity:.7;margin:14px 0 22px;max-width:480px}
.hp${v}-btn{font-family:'Anton',sans-serif;font-size:18px;letter-spacing:1px;text-transform:uppercase;background:${n.accent};color:#111;border:3px solid #111;padding:14px 26px;text-decoration:none;display:inline-block;box-shadow:6px 6px 0 #111}
.hp${v}-right{background:#f5f5f5;position:relative;overflow:hidden}
.hp${v}-right img{width:100%;height:100%;object-fit:cover;filter:grayscale(.1) contrast(1.1)}
.hp${v}-price{position:absolute;top:16px;right:16px;background:#fff;border:3px solid #111;padding:10px 14px;font-family:'Anton',sans-serif;box-shadow:4px 4px 0 #111}
@media(max-width:900px){.hp${v}-grid{grid-template-columns:1fr}.hp${v}-left{border-right:none;border-bottom:6px solid #111;text-align:center;align-items:center}}
{%- endstyle -%}
<div class="hp${v}-bar"><span>● ${n.label} DROP v${v}</span><span>● FREE SHIPPING</span><span>● LIMITED STOCK</span><span>● ${n.label} DROP v${v}</span></div>
<div class="hp${v}-grid">
  <div class="hp${v}-left">
    <div class="hp${v}-badge">{{section.settings.badge|default:'${n.label} v${v} — BRUTALIST'}}</div>
    <h1 class="hp${v}-h">{{section.settings.heading|default:'RAW <span>${n.id.toUpperCase()}</span>'}}</h1>
    <p class="hp${v}-p">{{section.settings.description|default:'${n.desc} Built brutal, worn daily.'}}</p>
    <a href="{{section.settings.btn_url|default:'/collections/all'}}" class="hp${v}-btn">{{section.settings.btn_text|default:'Shop Brutal'}} →</a>
  </div>
  <div class="hp${v}-right">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" alt="" loading="eager">{% else %}{{'product-1'|placeholder_svg_tag}}{% endif %}<div class="hp${v}-price">FROM {{section.settings.price|default:'₹1,499'}}</div></div>
</div>
{% schema %}{"name":"HP${v} Hero Brutalist","settings":[{"type":"color","id":"bg_color","label":"BG","default":"#ffffff"},{"type":"text","id":"badge","label":"Badge","default":"${n.label} v${v} — BRUTALIST"},{"type":"textarea","id":"heading","label":"Heading","default":"RAW ${n.id.toUpperCase()}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop Brutal"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"},{"type":"text","id":"price","label":"Price badge","default":"FROM ₹1,499"},{"type":"range","id":"container_width","min":1000,"max":1440,"step":20,"unit":"px","label":"Width","default":1280}],"presets":[{"name":"HP${v} Hero Brutalist"}]}{% endschema %}`;
}
function hero_center(v,n){
 return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Inter:wght@400;500&display=swap');
#shopify-section-{{ section.id }}{background:{{section.settings.bg_color|default:'#ffffff'}};color:{{section.settings.text_color|default:'${n.text}'}};text-align:center;padding:60px 0}
.hp${v}-inner{max-width:820px;margin:0 auto;padding:0 24px}
.hp${v}-pill{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${n.accent};border:1px solid ${n.accent}30;padding:6px 12px;border-radius:999px}
.hp${v}-h{font-family:'Syne',sans-serif;font-size:clamp(36px,6vw,64px);font-weight:800;line-height:1;margin:16px 0 12px}
.hp${v}-p{opacity:.6;line-height:1.8;margin:0 auto 22px;max-width:600px}
.hp${v}-btns{display:flex;gap:12px;justify-content:center;margin-bottom:28px;flex-wrap:wrap}
.hp${v}-btn{padding:14px 26px;background:${n.accent};color:#fff;border-radius:999px;text-decoration:none;font-weight:700;font-size:13px}
.hp${v}-btn--line{background:#fff;color:${n.accent};border:1.5px solid ${n.accent}}
.hp${v}-media{border-radius:20px;overflow:hidden;height:460px;box-shadow:0 20px 60px rgba(0,0,0,.12)}
.hp${v}-media img{width:100%;height:100%;object-fit:cover}
@media(max-width:600px){.hp${v}-media{height:300px}}
{%- endstyle -%}
<div class="hp${v}-inner">
  <span class="hp${v}-pill">{{section.settings.badge|default:'${n.label} • v${v}'}}</span>
  <h1 class="hp${v}-h">{{section.settings.heading|default:'${n.id} — Made Simple'}}</h1>
  <p class="hp${v}-p">{{section.settings.description|default:'${n.desc} Minimal, honest, designed to last.'}}</p>
  <div class="hp${v}-btns"><a href="{{section.settings.btn_url|default:'/collections/all'}}" class="hp${v}-btn">{{section.settings.btn_text|default:'Shop Now'}}</a>{% if section.settings.btn2_text != blank %}<a href="{{section.settings.btn2_url}}" class="hp${v}-btn hp${v}-btn--line">{{section.settings.btn2_text}}</a>{% endif %}</div>
  <div class="hp${v}-media">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1200}}" alt="" loading="eager">{% else %}{{'lifestyle-2'|placeholder_svg_tag}}{% endif %}</div>
</div>
{% schema %}{"name":"HP${v} Hero Center","settings":[{"type":"color","id":"bg_color","label":"BG","default":"#ffffff"},{"type":"color","id":"text_color","label":"Text","default":"${n.text}"},{"type":"text","id":"badge","label":"Pill","default":"${n.label} • v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"${n.id} — Made Simple"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop Now"},{"type":"url","id":"btn_url","label":"Link"},{"type":"text","id":"btn2_text","label":"Ghost"},{"type":"url","id":"btn2_url","label":"Ghost link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Center"}]}{% endschema %}`;
}
function hero_splitStats(v,n){
 return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&family=Inter:wght@400;500&display=swap');
#shopify-section-{{ section.id }}{background:${n.bg};padding:50px 0}
.hp${v}-wrap{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
.hp${v}-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}
.hp${v}-stat{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;padding:14px;text-align:center}
.hp${v}-stat b{font-family:'Manrope',sans-serif;font-size:20px;display:block}
.hp${v}-stat span{font-size:11px;letter-spacing:1px;text-transform:uppercase;opacity:.6}
.hp${v}-h{font-family:'Manrope',sans-serif;font-size:clamp(32px,4.5vw,52px);font-weight:800;line-height:1;margin:0}
.hp${v}-h span{color:${n.accent}}
.hp${v}-btn{margin-top:18px;display:inline-block;padding:14px 26px;background:${n.accent};color:#fff;border-radius:10px;text-decoration:none;font-weight:700}
.hp${v}-media{border-radius:16px;overflow:hidden;height:520px;position:relative}
.hp${v}-media img{width:100%;height:100%;object-fit:cover}
.hp${v}-float{position:absolute;bottom:14px;left:14px;background:#fff;border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.12)}
@media(max-width:900px){.hp${v}-wrap{grid-template-columns:1fr}.hp${v}-media{height:360px}}
{%- endstyle -%}
<div class="hp${v}-wrap">
  <div>
    <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${n.accent};font-weight:700;margin:0 0 8px">{{section.settings.badge|default:'${n.label} LAB v${v}'}}</p>
    <h1 class="hp${v}-h">{{section.settings.heading|default:'Measure <span>Every Rep</span>'}}</h1>
    <p style="opacity:.7;line-height:1.7;margin:10px 0">{{section.settings.description|default:'${n.desc}'}}</p>
    <div class="hp${v}-stats"><div class="hp${v}-stat"><b>4.8★</b><span>50k reviews</span></div><div class="hp${v}-stat"><b>₹${Math.floor(1500+v*10)}</b><span>from</span></div><div class="hp${v}-stat"><b>7d</b><span>returns</span></div></div>
    <a href="{{section.settings.btn_url|default:'/collections/all'}}" class="hp${v}-btn">{{section.settings.btn_text|default:'Shop ${n.label}'}}</a>
  </div>
  <div class="hp${v}-media">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" alt="" loading="eager">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}<div class="hp${v}-float"><span style="width:38px;height:38px;border-radius:8px;background:${n.accent};display:grid;place-items:center;color:#fff">${n.icon}</span><span><b>{{section.settings.float_title|default:'Lab Tested'}}</b><br><small style="opacity:.6">{{section.settings.float_sub|default:'Certified'}}</small></span></div></div>
</div>
{% schema %}{"name":"HP${v} Hero Stats","settings":[{"type":"color","id":"bg_color","label":"BG","default":"${n.bg}"},{"type":"text","id":"badge","label":"Badge","default":"${n.label} LAB v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"Measure Every Rep"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop ${n.label}"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"},{"type":"text","id":"float_title","label":"Float","default":"Lab Tested"},{"type":"text","id":"float_sub","label":"Sub","default":"Certified"}],"presets":[{"name":"HP${v} Hero Stats"}]}{% endschema %}`;
}
function hero_fullBleed(v,n){
 return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap');
#shopify-section-{{ section.id }}{position:relative;color:#fff}
.hp${v}-bg{position:absolute;inset:0}
.hp${v}-bg img{width:100%;height:100%;object-fit:cover}
.hp${v}-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg, rgba(0,0,0,.65) 0%, rgba(0,0,0,.15) 60%, rgba(0,0,0,.25) 100%)}
.hp${v}-content{position:relative;max-width:1280px;margin:0 auto;padding:90px 24px;min-height:560px;display:flex;align-items:center}
.hp${v}-box{max-width:560px}
.hp${v}-eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;opacity:.9}
.hp${v}-h{font-family:'Playfair Display',serif;font-size:clamp(38px,5vw,60px);line-height:1;margin:12px 0}
.hp${v}-p{opacity:.85;line-height:1.7}
.hp${v}-btn{margin-top:18px;display:inline-block;padding:14px 26px;background:#fff;color:#111;text-decoration:none;font-weight:700;border-radius:6px}
@media(max-width:700px){.hp${v}-content{padding:60px 24px;min-height:480px}}
{%- endstyle -%}
<div class="hp${v}-bg">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1600}}" alt="" loading="eager">{% else %}{{'lifestyle-1'|placeholder_svg_tag}}{% endif %}</div>
<div class="hp${v}-content"><div class="hp${v}-box"><div class="hp${v}-eyebrow">{{section.settings.badge|default:'${n.label} • v${v}'}}</div><h1 class="hp${v}-h">{{section.settings.heading|default:'Live In Your ${n.id}'}}</h1><p class="hp${v}-p">{{section.settings.description|default:'${n.desc} Full-bleed immersion for ${n.id}.'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" class="hp${v}-btn">{{section.settings.btn_text|default:'Explore'}}</a></div></div>
{% schema %}{"name":"HP${v} Hero Full","settings":[{"type":"text","id":"badge","label":"Eyebrow","default":"${n.label} • v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"Live In Your ${n.id}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Explore"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Full"}]}{% endschema %}`;
}

const heroFns=[hero_cyber, hero_editorial, hero_brutalist, hero_center, hero_splitStats, hero_fullBleed];

// distinct collection variants
function featured_variant(v,n, idx){
 const style=idx%4;
 if(style===0) {
   // 4-col grid
   return `{%- style -%}#shopify-section-{{ section.id }}{background:{{section.settings.bg_color|default:'#fff'}};padding:50px 0}.hp${v}-fc{max-width:1280px;margin:0 auto;padding:0 24px}.hp${v}-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:18px}.hp${v}-h{font-size:24px;font-weight:800;margin:0}.hp${v}-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}@media(max-width:900px){.hp${v}-grid{grid-template-columns:repeat(2,1fr)}}.hp${v}-card{border:1px solid rgba(0,0,0,.06);border-radius:12px;overflow:hidden;background:#fff;text-decoration:none;color:inherit}.hp${v}-card img{width:100%;aspect-ratio:1;object-fit:cover}.hp${v}-body{padding:10px}.hp${v}-title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0}.hp${v}-price{font-weight:700;color:${n.accent};margin:4px 0 0}{%- endstyle -%}<div class="hp${v}-fc"><div class="hp${v}-head"><h2 class="hp${v}-h">{{section.settings.heading|default:'Featured ${n.label}'}}</h2><a href="{{section.settings.link|default:'/collections/all'}}" style="font-size:12px;font-weight:700;color:${n.accent};text-decoration:none">{{section.settings.link_text|default:'View All →'}}</a></div><div class="hp${v}-grid">{% for product in collections[section.settings.collection].products limit: section.settings.limit %}<a href="{{product.url}}" class="hp${v}-card"><img src="{{product.featured_image|image_url:width:500}}" alt="{{product.title|escape}}" loading="lazy"><div class="hp${v}-body"><p class="hp${v}-title">{{product.title}}</p><p class="hp${v}-price">{{product.price|money}}</p></div></a>{% else %}{% for i in (1..4) %}<div class="hp${v}-card"><div style="aspect-ratio:1;background:#f5f5f5">{{'product-1'|placeholder_svg_tag}}</div><div class="hp${v}-body"><p class="hp${v}-title">Sample ${n.label}</p><p class="hp${v}-price">₹1,999</p></div></div>{% endfor %}{% endfor %}</div></div>{% schema %}{"name":"HP${v} Featured Grid","settings":[{"type":"text","id":"heading","label":"Heading","default":"Featured ${n.label}"},{"type":"collection","id":"collection","label":"Collection"},{"type":"range","id":"limit","min":2,"max":8,"step":1,"label":"Limit","default":4},{"type":"color","id":"bg_color","label":"BG","default":"#ffffff"},{"type":"url","id":"link","label":"Link"},{"type":"text","id":"link_text","label":"Link text","default":"View All →"}],"presets":[{"name":"HP${v} Featured Grid"}]}{% endschema %}`;
 } else if(style===1){
   // 3-col large
   return `{%- style -%}#shopify-section-{{ section.id }}{background:{{section.settings.bg_color|default:'${n.bg}'}};padding:60px 0}.hp${v}-fc3{max-width:1280px;margin:0 auto;padding:0 24px}.hp${v}-h3{text-align:center;font-size:28px;font-weight:800;margin:0 0 6px}.hp${v}-sub{text-align:center;opacity:.6;margin:0 0 22px}.hp${v}-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}@media(max-width:800px){.hp${v}-grid3{grid-template-columns:1fr}}.hp${v}-card3{border-radius:16px;overflow:hidden;background:#fff;border:1px solid rgba(0,0,0,.06)}.hp${v}-card3 img{width:100%;aspect-ratio:4/5;object-fit:cover}{%- endstyle -%}<div class="hp${v}-fc3"><h2 class="hp${v}-h3">{{section.settings.heading|default:'Best of ${n.label}'}}</h2><p class="hp${v}-sub">{{section.settings.subheading|default:'Curated for ${n.id}'}}</p><div class="hp${v}-grid3">{% for product in collections[section.settings.collection].products limit:3 %}<a href="{{product.url}}" style="text-decoration:none;color:inherit"><div class="hp${v}-card3"><img src="{{product.featured_image|image_url:width:600}}" alt="{{product.title|escape}}"><div style="padding:12px"><p style="font-weight:700;margin:0">{{product.title}}</p><p style="color:${n.accent};font-weight:700">{{product.price|money}}</p></div></div></a>{% else %}{% for i in (1..3) %}<div class="hp${v}-card3"><div style="aspect-ratio:4/5;background:#eee"></div><div style="padding:12px"><p>Sample ${n.label}</p></div></div>{% endfor %}{% endfor %}</div></div>{% schema %}{"name":"HP${v} Featured Large","settings":[{"type":"text","id":"heading","label":"Heading","default":"Best of ${n.label}"},{"type":"text","id":"subheading","label":"Sub","default":"Curated for ${n.id}"},{"type":"collection","id":"collection","label":"Collection"},{"type":"color","id":"bg_color","label":"BG","default":"${n.bg}"}],"presets":[{"name":"HP${v} Featured Large"}]}{% endschema %}`;
 } else if(style===2){
   // slider scroll
   return `{%- style -%}#shopify-section-{{ section.id }}{background:#fff;padding:50px 0}.hp${v}-sl{max-width:1280px;margin:0 auto;padding:0 24px}.hp${v}-track{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px}.hp${v}-track::-webkit-scrollbar{display:none}.hp${v}-item{flex:0 0 240px;scroll-snap-align:start;border:1px solid rgba(0,0,0,.06);border-radius:12px;overflow:hidden;background:#fff;text-decoration:none;color:inherit}.hp${v}-item img{width:100%;aspect-ratio:1;object-fit:cover}{%- endstyle -%}<div class="hp${v}-sl"><h2 style="font-size:24px;font-weight:800;margin:0 0 14px">{{section.settings.heading|default:'Trending ${n.label}'}}</h2><div class="hp${v}-track">{% for product in collections[section.settings.collection].products limit: section.settings.limit %}<a href="{{product.url}}" class="hp${v}-item"><img src="{{product.featured_image|image_url:width:400}}" alt="{{product.title|escape}}"><div style="padding:10px"><p style="font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{product.title}}</p><p style="color:${n.accent};font-weight:700">{{product.price|money}}</p></div></a>{% endfor %}</div></div>{% schema %}{"name":"HP${v} Slider","settings":[{"type":"text","id":"heading","label":"Heading","default":"Trending ${n.label}"},{"type":"collection","id":"collection","label":"Collection"},{"type":"range","id":"limit","min":4,"max":10,"step":1,"label":"Limit","default":6}],"presets":[{"name":"HP${v} Slider"}]}{% endschema %}`;
 } else {
   // editorial 2+2
   return `{%- style -%}#shopify-section-{{ section.id }}{background:#fff;padding:60px 0}.hp${v}-ed{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1.2fr .8fr;gap:20px}@media(max-width:900px){.hp${v}-ed{grid-template-columns:1fr}}.hp${v}-big{border-radius:16px;overflow:hidden;position:relative;height:480px}.hp${v}-big img{width:100%;height:100%;object-fit:cover}.hp${v}-small{display:grid;gap:16px}.hp${v}-sm{border:1px solid rgba(0,0,0,.06);border-radius:12px;overflow:hidden;display:flex;gap:12px;padding:10px;align-items:center;text-decoration:none;color:inherit}.hp${v}-sm img{width:90px;height:90px;object-fit:cover;border-radius:8px}{%- endstyle -%}<div class="hp${v}-ed"><a href="{{section.settings.link|default:'/collections/all'}}" class="hp${v}-big">{% assign prod = collections[section.settings.collection].products.first %}{% if prod %}<img src="{{prod.featured_image|image_url:width:800}}" alt="">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}<span style="position:absolute;bottom:16px;left:16px;background:#fff;padding:8px 12px;border-radius:8px;font-weight:700">{{section.settings.heading|default:'${n.label} Edit'}}</span></a><div class="hp${v}-small">{% for product in collections[section.settings.collection].products limit:3 %}<a href="{{product.url}}" class="hp${v}-sm"><img src="{{product.featured_image|image_url:width:200}}"><span><b>{{product.title}}</b><br><span style="color:${n.accent}">{{product.price|money}}</span></span></a>{% endfor %}</div></div>{% schema %}{"name":"HP${v} Editorial Picks","settings":[{"type":"text","id":"heading","label":"Heading","default":"${n.label} Edit"},{"type":"collection","id":"collection","label":"Collection"},{"type":"url","id":"link","label":"Link"}],"presets":[{"name":"HP${v} Editorial Picks"}]}{% endschema %}`;
 }
}

// generic distinct placeholders for other sections - make each version unique via accents and layout tweaks
function sectionVariant(v,n,type, idx){
 const accent=n.accent;
 if(type==='marquee'){
   return `{%- style -%}#shopify-section-{{ section.id }}{background:${accent};color:#fff;padding:10px 0;overflow:hidden;white-space:nowrap}.hp${v}-mq{display:flex;gap:36px;animation:hp${v}m 18s linear infinite}@keyframes hp${v}m{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.hp${v}-mq span{font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700}{%- endstyle -%}<div class="hp${v}-mq">{% for i in (1..2) %}{% for block in section.blocks %}<span>{{block.settings.text}} •</span>{% endfor %}{% if section.blocks.size==0 %}<span>${n.label} • FREE SHIPPING • v${v} •</span>{% endif %}{% endfor %}</div>{% schema %}{"name":"HP${v} Marquee","settings":[],"blocks":[{"type":"item","name":"Item","settings":[{"type":"text","id":"text","label":"Text","default":"Free Shipping"}]}]}{% endschema %}`;
 }
 if(type==='usp'){
   const cols= idx%2===0?4:3;
   return `{%- style -%}#shopify-section-{{ section.id }}{background:#fff;padding:22px 0;border-bottom:1px solid rgba(0,0,0,.06)}.hp${v}-usp{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px}@media(max-width:700px){.hp${v}-usp{grid-template-columns:repeat(2,1fr)}}.hp${v}-u{display:flex;gap:10px;align-items:center}.hp${v}-ico{width:38px;height:38px;border-radius:8px;background:${accent}18;color:${accent};display:grid;place-items:center;border:1px solid ${accent}30}{%- endstyle -%}<div class="hp${v}-usp">{% for block in section.blocks %}<div class="hp${v}-u"><div class="hp${v}-ico">{{block.settings.icon}}</div><div><b style="font-size:13px">{{block.settings.title}}</b><br><small style="opacity:.6">{{block.settings.desc}}</small></div></div>{% else %}<div class="hp${v}-u"><div class="hp${v}-ico">✓</div><div><b>Free Ship</b><br><small>Over ₹999</small></div></div><div class="hp${v}-u"><div class="hp${v}-ico">↺</div><div><b>Returns</b><br><small>7 days</small></div></div><div class="hp${v}-u"><div class="hp${v}-ico">★</div><div><b>4.8 ★</b><br><small>50k reviews</small></div></div>{% if ${cols}==4 %}<div class="hp${v}-u"><div class="hp${v}-ico">⚡</div><div><b>COD</b><br><small>Pan India</small></div></div>{% endif %}{% endfor %}</div>{% schema %}{"name":"HP${v} USP","blocks":[{"type":"usp","name":"USP","settings":[{"type":"text","id":"icon","label":"Icon","default":"✓"},{"type":"text","id":"title","label":"Title","default":"Free Shipping"},{"type":"text","id":"desc","label":"Desc","default":"Over ₹999"}]}]}{% endschema %}`;
 }
 if(type==='bestsellers') return featured_variant(v,n, idx+1);
 if(type==='ugc-reels') return `{%- style -%}#shopify-section-{{ section.id }}{background:${n.bg};padding:40px 0}.hp${v}-ugc{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}@media(max-width:800px){.hp${v}-ugc{grid-template-columns:repeat(2,1fr)}}.hp${v}-reel{aspect-ratio:9/16;border-radius:12px;overflow:hidden;background:#000;position:relative}.hp${v}-reel img{width:100%;height:100%;object-fit:cover}.hp${v}-play{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:28px}{%- endstyle -%}<div class="hp${v}-ugc">{% for i in (1..4) %}<div class="hp${v}-reel">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:400}}">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}<span class="hp${v}-play">▶</span></div>{% endfor %}</div>{% schema %}{"name":"HP${v} Reels","settings":[{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Reels"}]}{% endschema %}`;
 if(type==='brand-story') return `{%- style -%}#shopify-section-{{ section.id }}{background:${idx%2===0?n.bg:'#fff'};padding:60px 0}.hp${v}-story{max-width:1100px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:${idx%2===0?'1fr 1fr':'1.1fr .9fr'};gap:32px;align-items:center}@media(max-width:800px){.hp${v}-story{grid-template-columns:1fr}}.hp${v}-story img{width:100%;height:420px;object-fit:cover;border-radius:${idx%2===0?'16px':'24px 4px 24px 4px'}}{%- endstyle -%}<div class="hp${v}-story"><div>{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:800}}">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}</div><div><p style="color:${accent};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700">{{section.settings.kicker|default:'Our Story v${v}'}}</p><h2 style="font-size:28px;font-weight:800;margin:8px 0">{{section.settings.heading|default:'Made for ${n.id}'}}</h2><p style="opacity:.7;line-height:1.7">{{section.settings.text|default:'${n.desc}'}}</p><a href="{{section.settings.url|default:'/collections/all'}}" style="display:inline-block;margin-top:14px;padding:12px 20px;background:${accent};color:#fff;border-radius:8px;text-decoration:none;font-weight:700">{{section.settings.btn|default:'Discover'}}</a></div></div>{% schema %}{"name":"HP${v} Story","settings":[{"type":"text","id":"kicker","label":"Kicker","default":"Our Story v${v}"},{"type":"text","id":"heading","label":"Heading","default":"Made for ${n.id}"},{"type":"textarea","id":"text","label":"Text","default":"${n.desc}"},{"type":"image_picker","id":"image","label":"Image"},{"type":"text","id":"btn","label":"Btn","default":"Discover"},{"type":"url","id":"url","label":"Link"}],"presets":[{"name":"HP${v} Story"}]}{% endschema %}`;
 if(type==='offer-banner') return `{%- style -%}#shopify-section-{{ section.id }}{background:${accent};color:#fff;padding:${14+idx}px 24px;text-align:center;font-weight:700;letter-spacing:1px}${idx%2===0?'.hp'+v+'-off{border:2px dashed rgba(255,255,255,.6);padding:10px;border-radius:8px;display:inline-block}':''}{%- endstyle -%}<div class="${idx%2===0?'hp'+v+'-off':''}">{{section.settings.text|default:'FLAT 20% OFF • CODE ${n.label}${v}'}} {% if section.settings.btn_text != blank %}<a href="{{section.settings.url}}" style="margin-left:10px;background:#fff;color:${accent};padding:6px 12px;border-radius:999px;text-decoration:none">{{section.settings.btn_text}}</a>{% endif %}</div>{% schema %}{"name":"HP${v} Offer","settings":[{"type":"text","id":"text","label":"Text","default":"FLAT 20% OFF • CODE ${n.label}${v}"},{"type":"text","id":"btn_text","label":"Btn"},{"type":"url","id":"url","label":"Link"}],"presets":[{"name":"HP${v} Offer"}]}{% endschema %}`;
 if(type==='press-logos') return `{%- style -%}#shopify-section-{{ section.id }}{background:#fff;padding:18px 0;border-top:1px solid rgba(0,0,0,.06);border-bottom:1px solid rgba(0,0,0,.06)}.hp${v}-press{max-width:1280px;margin:0 auto;padding:0 24px;display:flex;gap:28px;justify-content:center;flex-wrap:wrap;opacity:.5;font-weight:800;letter-spacing:2px;font-size:12px}{%- endstyle -%}<div class="hp${v}-press">{% for block in section.blocks %}<span>{{block.settings.text}}</span>{% else %}<span>VOGUE</span><span>GQ</span><span>FORBES</span><span>ELLE</span>{% endfor %}</div>{% schema %}{"name":"HP${v} Press","blocks":[{"type":"logo","name":"Logo","settings":[{"type":"text","id":"text","label":"Text","default":"VOGUE"}]}]}{% endschema %}`;
 if(type==='faq') return `{%- style -%}#shopify-section-{{ section.id }}{background:#fff;padding:50px 24px}.hp${v}-faq{max-width:760px;margin:0 auto}.hp${v}-faq h2{text-align:center;font-size:26px;font-weight:800;margin:0 0 16px}.hp${v}-faq details{border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:14px;margin-bottom:10px}{%- endstyle -%}<div class="hp${v}-faq"><h2>{{section.settings.heading|default:'FAQs v${v}'}}</h2>{% for block in section.blocks %}<details><summary style="font-weight:700;cursor:pointer">{{block.settings.q}}</summary><p style="opacity:.7">{{block.settings.a}}</p></details>{% else %}<details><summary>Delivery time?</summary><p style="opacity:.7">3-5 days.</p></details>{% endfor %}</div>{% schema %}{"name":"HP${v} FAQ","settings":[{"type":"text","id":"heading","label":"Heading","default":"FAQs v${v}"}],"blocks":[{"type":"qa","name":"QA","settings":[{"type":"text","id":"q","label":"Q","default":"What is delivery?"},{"type":"textarea","id":"a","label":"A","default":"3-5 days"}]}]}{% endschema %}`;
 if(type==='testimonials') return `{%- style -%}#shopify-section-{{ section.id }}{background:${n.bg};padding:50px 0}.hp${v}-t{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(${idx%2===0?3:2},1fr);gap:14px}@media(max-width:800px){.hp${v}-t{grid-template-columns:1fr}}.hp${v}-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;padding:16px}.hp${v}-stars{color:${accent}}{%- endstyle -%}<div class="hp${v}-t">{% for block in section.blocks %}<div class="hp${v}-card"><div class="hp${v}-stars">★★★★★</div><p style="font-weight:600">{{block.settings.text}}</p><small style="opacity:.6">— {{block.settings.author}}</small></div>{% else %}<div class="hp${v}-card"><div class="hp${v}-stars">★★★★★</div><p>Loved ${n.label}!</p><small>— A. Sharma</small></div><div class="hp${v}-card"><div class="hp${v}-stars">★★★★★</div><p>Super fast.</p><small>— R. Mehta</small></div>{% if ${idx%2===0} %}<div class="hp${v}-card"><div class="hp${v}-stars">★★★★★</div><p>Will reorder!</p><small>— P. Rao</small></div>{% endif %}{% endfor %}</div>{% schema %}{"name":"HP${v} Testimonials","blocks":[{"type":"t","name":"T","settings":[{"type":"textarea","id":"text","label":"Text","default":"Great!"},{"type":"text","id":"author","label":"Author","default":"A. Sharma"}]}]}{% endschema %}`;
 if(type==='newsletter') return `{%- style -%}#shopify-section-{{ section.id }}{background:${n.bg};padding:50px 24px;text-align:center}.hp${v}-nl{max-width:520px;margin:0 auto}.hp${v}-nl input{flex:1;padding:12px;border:1px solid rgba(0,0,0,.15);border-radius:8px}.hp${v}-nl button{padding:12px 20px;background:${accent};color:#fff;border:none;border-radius:8px;font-weight:700}{%- endstyle -%}<div class="hp${v}-nl"><h2 style="font-size:24px;font-weight:800;margin:0">{{section.settings.heading|default:'Join ${n.label}'}}</h2><p style="opacity:.6">{{section.settings.sub|default:'Get 10% off'}}</p><form method="post" action="/contact#contact_form" style="display:flex;gap:8px;margin-top:12px"><input type="email" name="contact[email]" placeholder="you@email.com" required><button type="submit">{{section.settings.btn|default:'Subscribe'}}</button></form></div>{% schema %}{"name":"HP${v} Newsletter","settings":[{"type":"text","id":"heading","label":"Heading","default":"Join ${n.label}"},{"type":"text","id":"sub","label":"Sub","default":"Get 10% off"},{"type":"text","id":"btn","label":"Btn","default":"Subscribe"}],"presets":[{"name":"HP${v} Newsletter"}]}{% endschema %}`;
 if(type==='video-banner') return `{%- style -%}#shopify-section-{{ section.id }}{background:#000;color:#fff;padding:60px 24px;text-align:center}.hp${v}-vb{max-width:800px;margin:0 auto}.hp${v}-play{width:60px;height:60px;border-radius:50%;background:#fff;color:#000;display:inline-grid;place-items:center;margin:0 auto 14px;font-size:20px}{%- endstyle -%}<div class="hp${v}-vb"><div class="hp${v}-play">▶</div><h2 style="font-size:26px;font-weight:800;margin:0">{{section.settings.heading|default:'See ${n.id} in Motion'}}</h2><p style="opacity:.7">{{section.settings.sub|default:'${n.desc}'}}</p>{% if section.settings.url != blank %}<a href="{{section.settings.url}}" style="color:#fff;text-decoration:underline">Watch film</a>{% endif %}</div>{% schema %}{"name":"HP${v} Video","settings":[{"type":"text","id":"heading","label":"Heading","default":"See ${n.id} in Motion"},{"type":"text","id":"sub","label":"Sub","default":"${n.desc}"},{"type":"url","id":"url","label":"URL"}],"presets":[{"name":"HP${v} Video"}]}{% endschema %}`;
 if(type==='trust-badges') return `{%- style -%}#shopify-section-{{ section.id }}{background:#fff;padding:16px 0;border-top:1px solid rgba(0,0,0,.06)}.hp${v}-trust{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;opacity:.7}{%- endstyle -%}<div class="hp${v}-trust"><span>✓ Secure</span><span>•</span><span>✓ 7d Returns</span><span>•</span><span>✓ COD</span><span>•</span><span>✓ Made in India</span></div>{% schema %}{"name":"HP${v} Trust","settings":[],"presets":[{"name":"HP${v} Trust"}]}{% endschema %}`;
 // default for remaining types
 return `{%- style -%}#shopify-section-{{ section.id }}{padding:40px 24px;text-align:center;background:${idx%2===0?'#fff':n.bg}}.hp${v}-${type}{max-width:800px;margin:0 auto;border:1px dashed ${accent}40;padding:24px;border-radius:12px}{%- endstyle -%}<div class="hp${v}-${type}"><h3 style="margin:0;font-weight:800">${type} v${v} — ${n.label}</h3><p style="opacity:.6">${n.desc}</p></div>{% schema %}{"name":"HP${v} ${type}","settings":[],"presets":[{"name":"HP${v} ${type}"}]}{% endschema %}`;
}

const orders=[
 ['hero','marquee','usp','featured-collection','category-pills','brand-story','bestsellers','offer-banner','video-banner','testimonials','ugc-reels','faq','press-logos','newsletter','trust-badges','comparison-table','features-grid','instashop-gallery'],
 ['marquee','hero','press-logos','usp','bestsellers','brand-story','featured-collection','offer-banner','testimonials','video-banner','ugc-reels','faq','newsletter','trust-badges'],
 ['hero','usp','featured-collection','brand-story','comparison-table','bestsellers','testimonials','offer-banner','press-logos','faq','instashop-gallery','newsletter','trust-badges'],
 ['hero','category-pills','featured-collection','video-banner','bestsellers','ugc-reels','brand-story','testimonials','faq','newsletter','trust-badges','marquee'],
 ['marquee','hero','featured-collection','offer-banner','usp','bestsellers','brand-story','video-banner','press-logos','testimonials','comparison-table','newsletter','trust-badges'],
 ['hero','brand-story','featured-collection','usp','press-logos','bestsellers','video-banner','faq','ugc-reels','newsletter','trust-badges','offer-banner','marquee']
];

for(let v=65; v<=100; v++){
 const n=nicheFor(v);
 const variant=v%heroFns.length;
 const heroFn=heroFns[variant];
 const heroLiquid=heroFn(v,n);
 const sectionsOrder=orders[variant];
 // clean old sections first? overwrite
 const sectionsMap={};
 const order=[];
 // hero first if in order else add
 for(let idx=0; idx<sectionsOrder.length; idx++){
   const type=sectionsOrder[idx];
   let liquid;
   if(type==='hero') liquid=heroLiquid;
   else if(type==='featured-collection' || type==='bestsellers') liquid=featured_variant(v,n, v+idx);
   else liquid=sectionVariant(v,n,type, v+idx);
   const secFile=`hp${v}-${type}`;
   fs.writeFileSync(path.join(base,'sections',secFile+'.liquid'), liquid);
   const key=`${type.replace(/-/g,'_')}_${v}`;
   sectionsMap[key]={type: secFile};
   order.push(key);
 }
 // handle remaining types not in order but needed for registry completeness? we already cover 14-18
 const json={name:`HP-v${v} ${n.label} ${['Cyber Matrix','Editorial Atelier','Brutalist','Center Minimal','Stats Lab','Full Bleed'][variant]}`, sections: sectionsMap, order: order};
 fs.writeFileSync(path.join(base,'templates',`index.hp-v${v}.json`), JSON.stringify(json,null,2));
 fs.writeFileSync(path.join(base,'templates',`page.hp-v${v}.json`), JSON.stringify(json,null,2));
 console.log(`v${v} ${n.id} hero:${['cyber','editorial','brutalist','center','stats','full'][variant]} order:${order.length}`);
}
console.log('distinct regen done');
