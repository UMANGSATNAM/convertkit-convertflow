import fs from 'fs';
const out = `{% comment %}ConvertFlow — Pilgrim Beauty | Collection Page{% endcomment %}
{% paginate collection.products by 24 %}
{% style %}
.pfc*{box-sizing:border-box;margin:0;padding:0}
.pfc{font-family:'DM Sans','Segoe UI',sans-serif;color:#1a1a1a;background:#fff;-webkit-font-smoothing:antialiased}
{% endstyle %}
<div class="pfc">test</div>
{% endpaginate %}
{% schema %}{"name":"CF Pilgrim Collection","settings":[]}
{% endschema %}`;
fs.writeFileSync('extensions/convertkit-sections/sections/cf-pilgrim-collection.liquid', out);
console.log('Done');
