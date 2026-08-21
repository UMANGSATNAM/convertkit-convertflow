const fs=require('fs');
const niches=['streetwear','activewear','beauty','electronics','ethnic-wear','food','grooming','home-decor','jewellery','kids'];
let v=52;
for(const niche of niches){
 for(let i=1;i<=5;i++){
  if(v>100) break;
  const ver='v'+v;
  const base='themes/'+niche;
  fs.mkdirSync(base+'/templates',{recursive:true});
  fs.mkdirSync(base+'/sections',{recursive:true});
  const s1='hp-'+ver+'-hero';
  const liquid1 = `<section class="hp-${ver}" style="padding:60px 20px;max-width:1200px;margin:auto">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;align-items:center">
<div>
<h1 style="font-size:clamp(28px,5vw,56px);line-height:1.1">{{ section.settings.heading }}</h1>
<p style="opacity:.7;margin:16px 0">{{ section.settings.subheading }}</p>
<a href="{{ section.settings.cta_link }}" style="display:inline-block;padding:14px 28px;background:{{ settings.colors_accent_1 }};color:white;border-radius:999px;text-decoration:none">{{ section.settings.cta_label }}</a>
</div>
{% if section.settings.image != blank %}<img src="{{ section.settings.image | image_url: width: 800 }}" style="width:100%;border-radius:16px;object-fit:cover" loading="lazy">{% endif %}
</div>
<style>@media(max-width:768px){.hp-${ver}{padding:32px 16px !important}}</style>
</section>
{% schema %}{"name":"HP ${ver} Hero (${niche})","settings":[{"type":"text","id":"heading","label":"Heading","default":"${niche} ${ver}"},{"type":"textarea","id":"subheading","label":"Subheading","default":"Mobile responsive real Liquid for ${niche}"},{"type":"image_picker","id":"image","label":"Image"},{"type":"text","id":"cta_label","label":"CTA","default":"Shop Now"},{"type":"url","id":"cta_link","label":"Link"}],"presets":[{"name":"HP ${ver} Hero"}]}{% endschema %}`;
  fs.writeFileSync(base+'/sections/'+s1+'.liquid', liquid1);
  const s2='hp-'+ver+'-featured';
  const liquid2 = `<section style="max-width:1200px;margin:auto;padding:24px"><h2>{{ section.settings.title }}</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-top:16px">{% for product in collections[section.settings.collection].products limit: section.settings.limit %}<a href="{{ product.url }}"><img src="{{ product.featured_image | image_url: width: 400 }}" style="width:100%;border-radius:12px;aspect-ratio:1;object-fit:cover"><p>{{ product.title }}</p><p>{{ product.price | money }}</p></a>{% else %}{% for i in (1..4) %}<div style="background:#f5f5f5;height:200px;border-radius:12px"></div>{% endfor %}{% endfor %}</div></section>{% schema %}{"name":"HP ${ver} Featured","settings":[{"type":"text","id":"title","label":"Title","default":"Best Sellers"},{"type":"collection","id":"collection","label":"Collection"},{"type":"range","id":"limit","min":2,"max":8,"step":1,"label":"Products","default":4}],"presets":[{"name":"HP ${ver} Featured"}]}{% endschema %}`;
  fs.writeFileSync(base+'/sections/'+s2+'.liquid', liquid2);
  const json={layout:"theme", sections:{["hero_"+ver]:{type:s1,settings:{heading: niche+" "+ver, subheading:"Mobile responsive real Liquid",cta_label:"Shop Now",cta_link:"/collections/all"}},["feat_"+ver]:{type:s2,settings:{title:"Trending in "+niche,limit:4}}},order:["hero_"+ver,"feat_"+ver]};
  fs.writeFileSync(base+'/templates/index.'+ver+'.json', JSON.stringify(json,null,2));
  v++;
 }
}
console.log('done',v);
