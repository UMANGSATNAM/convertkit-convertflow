const fs=require('fs'),path=require('path');
const base='dev-theme-peri';
const niches=[
  {id:'streetwear', label:'STREETWEAR', accent:'#E11D48', accent2:'#FACC15', bg:'#0B0B0D', text:'#FFFFFF', icon:'◼', desc:'Heavyweight cotton, utility cuts'},
  {id:'activewear', label:'ACTIVEWEAR', accent:'#06B6D4', accent2:'#0EA5E9', bg:'#ECFEFF', text:'#0F172A', icon:'⚡', desc:'Seamless stretch for every rep'},
  {id:'beauty', label:'BEAUTY', accent:'#EC4899', accent2:'#F43F5E', bg:'#FFF1F2', text:'#4A044E', icon:'✦', desc:'Clean botanicals, clinical potency'},
  {id:'electronics', label:'ELECTRONICS', accent:'#6366F1', accent2:'#22D3EE', bg:'#0F172A', text:'#F8FAFC', icon:'◆', desc:'Flagship specs, honest price'},
  {id:'ethnic-wear', label:'ETHNIC WEAR', accent:'#B45309', accent2:'#D97706', bg:'#FFFBEB', text:'#431407', icon:'❦', desc:'Handloom sarees rooted in craft'},
  {id:'food', label:'GOURMET', accent:'#16A34A', accent2:'#84CC16', bg:'#F0FDF4', text:'#052E16', icon:'🌿', desc:'Artisan organic staples'},
  {id:'grooming', label:'GROOMING', accent:'#0D9488', accent2:'#14B8A6', bg:'#F0FDFA', text:'#134E4A', icon:'✂', desc:'Barber-grade care'},
  {id:'home-decor', label:'HOME DECOR', accent:'#7C3AED', accent2:'#A78BFA', bg:'#F5F3FF', text:'#1E1B4B', icon:'⬢', desc:'Handcrafted ceramics'},
  {id:'jewellery', label:'JEWELLERY', accent:'#CA8A04', accent2:'#EAB308', bg:'#FEFCE8', text:'#422006', icon:'◇', desc:'Gold & lab diamonds'},
  {id:'kids', label:'KIDS', accent:'#F97316', accent2:'#FB923C', bg:'#FFF7ED', text:'#431407', icon:'★', desc:'Safe soft essentials'},
];
function nicheFor52(v){
  // map v52-64 to niches sequentially, wrap if needed 13 entries
  const idx=(v-52)%niches.length;
  return niches[idx];
}
// reuse hero functions from previous file - copy simplified versions
function hero_cyber(v,n){ return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;800&family=Space+Grotesk:wght@500;700&display=swap');
#shopify-section-{{ section.id }}{background:${n.bg};color:${n.text};font-family:'Space Grotesk',sans-serif;padding:0;position:relative;overflow:hidden}
.hp${v}-hero{max-width:1280px;margin:0 auto;padding:70px 24px;display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center}
.hp${v}-kicker{border:1px solid ${n.accent};color:${n.accent};padding:6px 12px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase}
.hp${v}-title{font-family:'JetBrains Mono',monospace;font-size:clamp(32px,5vw,54px);font-weight:800;line-height:1;margin:14px 0}
.hp${v}-title span{color:${n.accent}}
.hp${v}-media{border:1px solid ${n.accent}40;border-radius:12px;overflow:hidden;height:520px}
.hp${v}-media img{width:100%;height:100%;object-fit:cover}
@media(max-width:900px){.hp${v}-hero{grid-template-columns:1fr;text-align:center}}
{%- endstyle -%}
<div class="hp${v}-hero"><div><div class="hp${v}-kicker">{{section.settings.badge|default:'${n.label} v${v}'}}</div><h1 class="hp${v}-title">{{section.settings.heading|default:'${n.label} <span>${n.id}</span>'}}</h1><p>{{section.settings.description|default:'${n.desc}'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" style="display:inline-block;margin-top:14px;padding:14px 26px;background:${n.accent};color:#fff;text-decoration:none;font-weight:700">{{section.settings.btn_text|default:'Shop Now'}}</a></div><div class="hp${v}-media">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" alt="">{% else %}{{'lifestyle-1'|placeholder_svg_tag}}{% endif %}</div></div>
{% schema %}{"name":"HP${v} Hero Cyber","settings":[{"type":"color","id":"bg_color","label":"BG","default":"${n.bg}"},{"type":"text","id":"badge","label":"Badge","default":"${n.label} v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"${n.label} ${n.id}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop Now"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Cyber"}]}{% endschema %}`;
}
function hero_editorial(v,n){ return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap');
#shopify-section-{{ section.id }}{background:#FFFBEB;padding:80px 0}
.hp${v}-wrap{max-width:1240px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:.95fr 1.05fr;gap:50px;align-items:center}
.hp${v}-h{font-family:'Cormorant Garamond',serif;font-size:clamp(38px,5vw,60px);font-weight:700}
.hp${v}-h em{color:${n.accent};font-style:italic}
.hp${v}-arch{border-radius:180px 180px 24px 24px;overflow:hidden;height:520px;border:1px solid ${n.accent}30}
.hp${v}-arch img{width:100%;height:100%;object-fit:cover}
@media(max-width:900px){.hp${v}-wrap{grid-template-columns:1fr}}
{%- endstyle -%}
<div class="hp${v}-wrap"><div><p style="letter-spacing:3px;text-transform:uppercase;color:${n.accent};font-size:11px;font-weight:700">{{section.settings.badge|default:'${n.label} v${v}'}}</p><h1 class="hp${v}-h">{{section.settings.heading|default:'Quiet <em>${n.id}</em>'}}</h1><p>{{section.settings.description|default:'${n.desc}'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" style="background:${n.accent};color:#fff;padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:700">{{section.settings.btn_text|default:'Explore'}}</a></div><div class="hp${v}-arch">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}</div></div>
{% schema %}{"name":"HP${v} Hero Editorial","settings":[{"type":"text","id":"badge","label":"Badge","default":"${n.label} v${v}"},{"type":"textarea","id":"heading","label":"Heading","default":"Quiet ${n.id}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Explore"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Editorial"}]}{% endschema %}`;
}
function hero_brutalist(v,n){ return `{%- style -%}
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono&display=swap');
#shopify-section-{{ section.id }}{border-top:6px solid ${n.accent};border-bottom:6px solid #111}
.hp${v}-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;min-height:520px}
.hp${v}-left{padding:40px 24px;border-right:6px solid #111}
.hp${v}-h{font-family:'Anton',sans-serif;font-size:clamp(42px,6vw,74px);text-transform:uppercase}
.hp${v}-h span{color:${n.accent}}
@media(max-width:900px){.hp${v}-grid{grid-template-columns:1fr}}
{%- endstyle -%}
<div class="hp${v}-grid"><div class="hp${v}-left"><h1 class="hp${v}-h">{{section.settings.heading|default:'RAW <span>${n.id.toUpperCase()}</span>'}}</h1><p>{{section.settings.description|default:'${n.desc}'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" style="background:${n.accent};padding:12px 20px;text-decoration:none;font-weight:700">{{section.settings.btn_text|default:'Shop'}}</a></div><div>{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" style="width:100%;height:520px;object-fit:cover">{% else %}{{'product-1'|placeholder_svg_tag}}{% endif %}</div></div>
{% schema %}{"name":"HP${v} Hero Brutalist","settings":[{"type":"textarea","id":"heading","label":"Heading","default":"RAW ${n.id}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Brutalist"}]}{% endschema %}`;
}
function hero_center(v,n){ return `{%- style -%}
#shopify-section-{{ section.id }}{text-align:center;padding:60px 0}
.hp${v}-inner{max-width:820px;margin:0 auto;padding:0 24px}
.hp${v}-h{font-size:clamp(36px,6vw,60px);font-weight:800}
.hp${v}-media{height:460px;border-radius:20px;overflow:hidden;margin-top:20px}
.hp${v}-media img{width:100%;height:100%;object-fit:cover}
{%- endstyle -%}
<div class="hp${v}-inner"><h1 class="hp${v}-h">{{section.settings.heading|default:'${n.id} Simple'}}</h1><p>{{section.settings.description|default:'${n.desc}'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" style="background:${n.accent};color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">{{section.settings.btn_text|default:'Shop Now'}}</a><div class="hp${v}-media">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1200}}">{% else %}{{'lifestyle-2'|placeholder_svg_tag}}{% endif %}</div></div>
{% schema %}{"name":"HP${v} Hero Center","settings":[{"type":"textarea","id":"heading","label":"Heading","default":"${n.id} Simple"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop Now"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Center"}]}{% endschema %}`;
}
function hero_stats(v,n){ return `{%- style -%}#shopify-section-{{ section.id }}{background:${n.bg};padding:50px 0}.hp${v}-wrap{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:40px}@media(max-width:900px){.hp${v}-wrap{grid-template-columns:1fr}}{%- endstyle -%}<div class="hp${v}-wrap"><div><h1 style="font-size:32px;font-weight:800">{{section.settings.heading|default:'${n.label} v${v}'}}</h1><p>{{section.settings.description|default:'${n.desc}'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" style="background:${n.accent};color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">{{section.settings.btn_text|default:'Shop'}}</a></div><div>{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1000}}" style="width:100%;height:400px;object-fit:cover;border-radius:12px">{% else %}{{'collection-1'|placeholder_svg_tag}}{% endif %}</div></div>{% schema %}{"name":"HP${v} Hero Stats","settings":[{"type":"textarea","id":"heading","label":"Heading","default":"${n.label} v${v}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Shop"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Stats"}]}{% endschema %}`;
}
function hero_full(v,n){ return `{%- style -%}#shopify-section-{{ section.id }}{position:relative;color:#fff}.hp${v}-bg{position:absolute;inset:0}.hp${v}-bg img{width:100%;height:100%;object-fit:cover}.hp${v}-bg::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.5)}.hp${v}-content{position:relative;max-width:1280px;margin:0 auto;padding:90px 24px;min-height:560px;display:flex;align-items:center}{%- endstyle -%}<div class="hp${v}-bg">{% if section.settings.image != blank %}<img src="{{section.settings.image|image_url:width:1600}}">{% else %}{{'lifestyle-1'|placeholder_svg_tag}}{% endif %}</div><div class="hp${v}-content"><div><h1 style="font-size:48px;font-weight:800">{{section.settings.heading|default:'Live ${n.id}'}}</h1><p>{{section.settings.description|default:'${n.desc}'}}</p><a href="{{section.settings.btn_url|default:'/collections/all'}}" style="background:#fff;color:#111;padding:12px 20px;text-decoration:none;font-weight:700">{{section.settings.btn_text|default:'Explore'}}</a></div></div>{% schema %}{"name":"HP${v} Hero Full","settings":[{"type":"textarea","id":"heading","label":"Heading","default":"Live ${n.id}"},{"type":"textarea","id":"description","label":"Desc","default":"${n.desc}"},{"type":"text","id":"btn_text","label":"CTA","default":"Explore"},{"type":"url","id":"btn_url","label":"Link"},{"type":"image_picker","id":"image","label":"Image"}],"presets":[{"name":"HP${v} Hero Full"}]}{% endschema %}`;
}
const fns=[hero_cyber, hero_editorial, hero_brutalist, hero_center, hero_stats, hero_full];
for(let v=52;v<=64;v++){
 const n=nicheFor52(v);
 const fn=fns[v%fns.length];
 const liquid=fn(v,n);
 fs.writeFileSync(path.join(base,'sections',`hp${v}-hero.liquid`), liquid);
 // also ensure other sections have presets (add if missing)
}
console.log('v52-64 heroes distinct done');
