export function style01(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Floating Island (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: ${niche.color3}; padding: 60px 20px; font-family: system-ui; }
  .${prefix}-island { max-width: 1200px; margin: 0 auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 30px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 30px 60px rgba(0,0,0,0.05); padding: 60px; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; position: relative; overflow: hidden; }
  .${prefix}-island::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background: radial-gradient(circle at 50% 50%, ${niche.color1}33 0%, transparent 50%); z-index: -1; animation: ${prefix}-spin 20s linear infinite; }
  @keyframes ${prefix}-spin { 100% { transform: rotate(360deg); } }
  .${prefix}-brand { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, ${niche.color1}, #000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; }
  .${prefix}-col h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }
  .${prefix}-col a { color: #666; text-decoration: none; display: block; margin-bottom: 12px; transition: 0.3s; }
  .${prefix}-col a:hover { color: ${niche.color1}; transform: translateX(5px); }
  @media (max-width: 768px) { .${prefix}-island { grid-template-columns: 1fr; padding: 30px; } }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-island">
  <div>
    <h2 class="${prefix}-brand">{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <p style="color:#555">{{ section.settings.brand_text | default: "The future of ${niche.name}." }}</p>
  </div>
  {% for block in section.blocks %}
    <div class="${prefix}-col">
      <h4>{{ block.settings.title }}</h4>
      {% for i in (1..4) %}<a href="#">{{ block.settings.title }} Link {{i}}</a>{% endfor %}
    </div>
  {% endfor %}
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [
    { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" },
    { "type": "textarea", "id": "brand_text", "label": "Brand Description" }
  ],
  "blocks": [ { "type": "link_list", "name": "Link Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style02(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Bento Box (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #f8f9fa; padding: 80px 20px; font-family: system-ui; }
  .${prefix}-bento { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(150px, auto); gap: 20px; }
  .${prefix}-tile { background: #fff; border-radius: 24px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); transition: 0.3s; }
  .${prefix}-tile:hover { transform: scale(1.02); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
  .${prefix}-tile-large { grid-column: span 2; grid-row: span 2; background: linear-gradient(135deg, ${niche.color1}, #000); color: #fff; }
  .${prefix}-tile-large h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 20px; }
  .${prefix}-tile-large p { color: rgba(255,255,255,0.8); font-size: 1.1rem; }
  .${prefix}-col h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; color: ${niche.color1}; }
  .${prefix}-col a { color: #555; text-decoration: none; display: block; margin-bottom: 12px; transition: 0.3s; }
  .${prefix}-col a:hover { color: #000; }
  @media (max-width: 900px) { .${prefix}-bento { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .${prefix}-bento { grid-template-columns: 1fr; } .${prefix}-tile-large { grid-column: span 1; grid-row: span 1; } }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-bento">
  <div class="${prefix}-tile ${prefix}-tile-large">
    <h2>{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <p>{{ section.settings.brand_text | default: "Bento box perfection for ${niche.name}." }}</p>
  </div>
  {% for block in section.blocks limit:4 %}
    <div class="${prefix}-tile ${prefix}-col">
      <h4>{{ block.settings.title }}</h4>
      {% for i in (1..3) %}<a href="#">Link {{i}}</a>{% endfor %}
    </div>
  {% endfor %}
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [
    { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" },
    { "type": "textarea", "id": "brand_text", "label": "Brand Description" }
  ],
  "blocks": [ { "type": "link_list", "name": "Tile", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style03(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Fluid Gradient (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: linear-gradient(120deg, ${niche.color1} 0%, ${niche.color3} 100%); padding: 100px 20px; font-family: system-ui; color: #fff; position: relative; overflow: hidden; }
  .${prefix}-blur { position: absolute; width: 400px; height: 400px; background: rgba(255,255,255,0.2); filter: blur(100px); border-radius: 50%; top: -100px; left: -100px; animation: ${prefix}-move 10s infinite alternate; }
  @keyframes ${prefix}-move { 100% { transform: translate(200px, 100px); } }
  .${prefix}-content { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
  .${prefix}-brand { flex: 1 1 400px; }
  .${prefix}-brand h2 { font-size: 3rem; font-weight: 900; margin-bottom: 20px; }
  .${prefix}-brand p { font-size: 1.2rem; opacity: 0.9; max-width: 400px; }
  .${prefix}-nav { display: flex; gap: 60px; flex-wrap: wrap; }
  .${prefix}-col h4 { font-size: 1.2rem; font-weight: 700; margin-bottom: 25px; }
  .${prefix}-col a { color: rgba(255,255,255,0.8); text-decoration: none; display: block; margin-bottom: 15px; font-size: 1.1rem; transition: 0.3s; }
  .${prefix}-col a:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-blur"></div>
  <div class="${prefix}-content">
    <div class="${prefix}-brand">
      <h2>{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
      <p>{{ section.settings.brand_text | default: "Fluid experiences for ${niche.name}." }}</p>
    </div>
    <div class="${prefix}-nav">
      {% for block in section.blocks %}
        <div class="${prefix}-col">
          <h4>{{ block.settings.title }}</h4>
          {% for i in (1..4) %}<a href="#">Link {{i}}</a>{% endfor %}
        </div>
      {% endfor %}
    </div>
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" }, { "type": "textarea", "id": "brand_text", "label": "Brand Description" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style04(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Mega Typography (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #000; color: #fff; padding: 100px 20px 40px; font-family: 'Inter', system-ui, sans-serif; overflow: hidden; }
  .${prefix}-container { max-width: 1400px; margin: 0 auto; }
  .${prefix}-mega { font-size: clamp(4rem, 15vw, 15rem); font-weight: 900; line-height: 0.8; letter-spacing: -0.05em; margin: 0 0 60px -10px; color: transparent; -webkit-text-stroke: 2px rgba(255,255,255,0.2); transition: 0.5s; cursor: default; }
  .${prefix}-mega:hover { color: ${niche.color1}; -webkit-text-stroke: 0; }
  .${prefix}-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 60px; }
  .${prefix}-col h4 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 20px; }
  .${prefix}-col a { color: #fff; text-decoration: none; display: block; font-size: 1.2rem; margin-bottom: 12px; transition: 0.3s; }
  .${prefix}-col a:hover { color: ${niche.color1}; transform: translateX(10px); }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-container">
  <div class="${prefix}-mega">{{ section.settings.brand_name | default: "${niche.name}" | upcase }}</div>
  <div class="${prefix}-grid">
    {% for block in section.blocks %}
      <div class="${prefix}-col">
        <h4>{{ block.settings.title }}</h4>
        {% for i in (1..5) %}<a href="#">Link {{i}}</a>{% endfor %}
      </div>
    {% endfor %}
  </div>
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style05(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Video Immersive (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { position: relative; padding: 120px 20px; color: #fff; font-family: system-ui; overflow: hidden; }
  .${prefix}-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; filter: brightness(0.4) saturate(1.2); }
  .${prefix}-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, #000 0%, transparent 100%); z-index: -1; }
  .${prefix}-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; text-align: center; }
  .${prefix}-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; }
  .${prefix}-nav { display: flex; justify-content: center; gap: 40px; margin-top: 60px; flex-wrap: wrap; }
  .${prefix}-link { color: #fff; text-decoration: none; font-size: 1.2rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; position: relative; }
  .${prefix}-link::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: ${niche.color1}; transition: 0.3s; }
  .${prefix}-link:hover::after { width: 100%; }
</style>
<div class="${prefix}-wrapper">
  <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-bg" alt="Video Placeholder">
  <div class="${prefix}-overlay"></div>
  <div class="${prefix}-container">
    <h2 class="${prefix}-title">{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <p style="font-size:1.2rem; max-width:600px; margin:0 auto; opacity:0.8;">{{ section.settings.brand_text | default: "Experience the immersive future of ${niche.name}." }}</p>
    <div class="${prefix}-nav">
      {% for block in section.blocks %}
        <a href="#" class="${prefix}-link">{{ block.settings.title }}</a>
      {% endfor %}
    </div>
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" }, { "type": "textarea", "id": "brand_text", "label": "Brand Description" } ],
  "blocks": [ { "type": "link_list", "name": "Link", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style06(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Neo-Brutalist (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: ${niche.color3}; padding: 0; font-family: 'Space Grotesk', system-ui, sans-serif; border-top: 4px solid #000; }
  .${prefix}-marquee { background: ${niche.color1}; color: #fff; padding: 15px 0; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; border-bottom: 4px solid #000; }
  .${prefix}-marquee span { display: inline-block; padding-left: 100%; animation: ${prefix}-scroll 15s linear infinite; }
  @keyframes ${prefix}-scroll { 100% { transform: translate(-100%, 0); } }
  .${prefix}-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 4px solid #000; }
  .${prefix}-col { padding: 40px; border-right: 4px solid #000; }
  .${prefix}-col:last-child { border-right: none; }
  .${prefix}-col h4 { font-size: 1.5rem; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; }
  .${prefix}-col a { display: block; font-size: 1.2rem; font-weight: 700; color: #000; text-decoration: none; padding: 10px; border: 2px solid transparent; transition: 0.2s; margin-bottom: 10px; }
  .${prefix}-col a:hover { background: #000; color: ${niche.color3}; transform: translate(5px, -5px); box-shadow: -5px 5px 0 ${niche.color1}; border: 2px solid #000; }
  @media (max-width: 900px) { .${prefix}-grid { grid-template-columns: 1fr; } .${prefix}-col { border-right: none; border-bottom: 4px solid #000; } .${prefix}-col:last-child { border-bottom: none; } }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-marquee"><span>{{ section.settings.brand_name | default: "${niche.name}" }} - FUTURE OF E-COMMERCE - EST. 2050 - </span></div>
  <div class="${prefix}-grid">
    <div class="${prefix}-col">
      <h4>Join Us</h4>
      <p style="font-weight:600; font-size:1.1rem;">Subscribe to our brutally honest newsletter.</p>
      <input type="email" placeholder="EMAIL" style="width:100%; padding:15px; border:4px solid #000; font-weight:700; margin-bottom:15px; background:#fff;">
      <button style="width:100%; padding:15px; background:#000; color:#fff; border:none; font-weight:900; font-size:1.2rem; text-transform:uppercase; cursor:pointer;">Submit</button>
    </div>
    {% for block in section.blocks limit:2 %}
      <div class="${prefix}-col">
        <h4>{{ block.settings.title }}</h4>
        {% for i in (1..4) %}<a href="#">Link {{i}}</a>{% endfor %}
      </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style07(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Interactive Hover Reveal (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #111; color: #fff; padding: 100px 20px; font-family: system-ui; text-align: center; }
  .${prefix}-list { display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto; }
  .${prefix}-item { position: relative; }
  .${prefix}-link { font-size: clamp(2rem, 6vw, 5rem); font-weight: 800; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.3); text-decoration: none; text-transform: uppercase; transition: 0.3s; display: inline-block; z-index: 2; position: relative; }
  .${prefix}-link:hover { color: ${niche.color1}; -webkit-text-stroke: 0; transform: scale(1.05); }
  .${prefix}-img { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8); width: 300px; height: 200px; object-fit: cover; border-radius: 20px; opacity: 0; pointer-events: none; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 1; }
  .${prefix}-link:hover ~ .${prefix}-img { opacity: 0.5; transform: translate(-50%, -50%) scale(1); filter: blur(5px); }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-list">
    {% for block in section.blocks %}
      <div class="${prefix}-item">
        <a href="#" class="${prefix}-link">{{ block.settings.title }}</a>
        <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img" alt="Hover Image">
      </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [],
  "blocks": [ { "type": "link_list", "name": "Main Link", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list", "settings": {"title": "Products"} }, { "type": "link_list", "settings": {"title": "About"} }, { "type": "link_list", "settings": {"title": "Contact"} } ] } ]
}
{% endschema %}`;
}

export function style08(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - E-Commerce Mega (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #fff; padding: 80px 40px; font-family: system-ui; border-top: 1px solid #eaeaea; }
  .${prefix}-grid { max-width: 1600px; margin: 0 auto; display: grid; grid-template-columns: 2fr repeat(4, 1fr); gap: 60px; }
  .${prefix}-brand { display: flex; flex-direction: column; justify-content: space-between; }
  .${prefix}-brand h2 { font-size: 2.5rem; font-weight: 800; color: ${niche.color1}; margin-bottom: 20px; }
  .${prefix}-badges { display: flex; gap: 15px; margin-top: 30px; }
  .${prefix}-badge { width: 50px; height: 50px; background: ${niche.color3}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .${prefix}-col h4 { font-size: 1rem; font-weight: 700; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; color: #333; }
  .${prefix}-col a { color: #666; text-decoration: none; display: block; margin-bottom: 12px; font-size: 0.95rem; transition: 0.2s; }
  .${prefix}-col a:hover { color: ${niche.color1}; padding-left: 5px; }
  @media (max-width: 1200px) { .${prefix}-grid { grid-template-columns: 1fr; gap: 40px; } .${prefix}-brand { border-bottom: 1px solid #eaeaea; padding-bottom: 40px; } }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-grid">
  <div class="${prefix}-brand">
    <div>
      <h2>{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
      <p style="color:#555; line-height:1.6; max-width:300px;">{{ section.settings.brand_text | default: "The definitive mega-store for ${niche.name}. 10,000+ products." }}</p>
    </div>
    <div class="${prefix}-badges">
      <div class="${prefix}-badge">🔒</div>
      <div class="${prefix}-badge">🚚</div>
      <div class="${prefix}-badge">⭐</div>
    </div>
  </div>
  {% for block in section.blocks limit:4 %}
    <div class="${prefix}-col">
      <h4>{{ block.settings.title }}</h4>
      {% for i in (1..6) %}<a href="#">Link Item {{i}}</a>{% endfor %}
    </div>
  {% endfor %}
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" }, { "type": "textarea", "id": "brand_text", "label": "Brand Description" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style09(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Newsletter Takeover (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: ${niche.color1}; color: #fff; padding: 150px 20px; font-family: system-ui; text-align: center; }
  .${prefix}-title { font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 900; margin-bottom: 30px; letter-spacing: -0.03em; }
  .${prefix}-form { max-width: 600px; margin: 0 auto 80px; position: relative; }
  .${prefix}-input { width: 100%; padding: 25px 40px; font-size: 1.2rem; border-radius: 50px; border: none; background: rgba(255,255,255,0.1); color: #fff; outline: none; backdrop-filter: blur(10px); box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2); transition: 0.3s; }
  .${prefix}-input::placeholder { color: rgba(255,255,255,0.5); }
  .${prefix}-input:focus { background: rgba(255,255,255,0.2); box-shadow: inset 0 0 0 2px #fff; }
  .${prefix}-btn { position: absolute; right: 10px; top: 10px; bottom: 10px; padding: 0 40px; border-radius: 40px; border: none; background: #fff; color: ${niche.color1}; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
  .${prefix}-btn:hover { transform: scale(1.05); }
  .${prefix}-links { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
  .${prefix}-links a { color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: 0.2s; }
  .${prefix}-links a:hover { color: #fff; }
</style>
<div class="${prefix}-wrapper">
  <h2 class="${prefix}-title">{{ section.settings.brand_text | default: "STAY AHEAD OF THE CURVE." }}</h2>
  <div class="${prefix}-form">
    <input type="email" class="${prefix}-input" placeholder="Enter your email address">
    <button class="${prefix}-btn">JOIN</button>
  </div>
  <div class="${prefix}-links">
    {% for block in section.blocks %}
      <a href="#">{{ block.settings.title }}</a>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_text", "label": "Heading", "default": "STAY AHEAD OF THE CURVE." } ],
  "blocks": [ { "type": "link_list", "name": "Link", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style10(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Split-Screen Dual (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { display: flex; font-family: system-ui; min-height: 600px; }
  .${prefix}-left { flex: 1; background: url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081') center/cover; position: relative; }
  .${prefix}-left::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, transparent, ${niche.color3}); }
  .${prefix}-right { flex: 1; background: ${niche.color3}; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; }
  .${prefix}-title { font-size: 3rem; font-weight: 800; color: ${niche.color1}; margin-bottom: 40px; }
  .${prefix}-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .${prefix}-col h4 { font-size: 1.2rem; font-weight: 700; margin-bottom: 20px; color: #111; }
  .${prefix}-col a { color: #555; text-decoration: none; display: block; margin-bottom: 15px; font-size: 1.1rem; transition: 0.2s; }
  .${prefix}-col a:hover { color: ${niche.color1}; transform: translateX(5px); }
  @media (max-width: 900px) { .${prefix}-wrapper { flex-direction: column; } .${prefix}-left { min-height: 300px; } .${prefix}-right { padding: 60px 30px; } }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-left"></div>
  <div class="${prefix}-right">
    <h2 class="${prefix}-title">{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <div class="${prefix}-grid">
      {% for block in section.blocks limit:2 %}
        <div class="${prefix}-col">
          <h4>{{ block.settings.title }}</h4>
          {% for i in (1..5) %}<a href="#">Link {{i}}</a>{% endfor %}
        </div>
      {% endfor %}
    </div>
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style11(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - App Accordion (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #000; padding: 60px 20px; font-family: system-ui; color: #fff; }
  .${prefix}-container { max-width: 800px; margin: 0 auto; }
  .${prefix}-brand { text-align: center; margin-bottom: 40px; }
  .${prefix}-brand h2 { font-size: 2.5rem; color: ${niche.color1}; margin-bottom: 10px; }
  .${prefix}-accordion { border-top: 1px solid rgba(255,255,255,0.1); }
  .${prefix}-item { border-bottom: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
  .${prefix}-header { width: 100%; text-align: left; background: none; border: none; color: #fff; padding: 25px 0; font-size: 1.2rem; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.3s; }
  .${prefix}-header:hover { color: ${niche.color1}; }
  .${prefix}-content { max-height: 0; transition: max-height 0.4s ease-out; padding: 0; }
  .${prefix}-item.active .${prefix}-content { max-height: 500px; padding-bottom: 25px; }
  .${prefix}-link { display: block; padding: 10px 0; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 1.1rem; }
  .${prefix}-link:hover { color: #fff; padding-left: 10px; }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-container">
    <div class="${prefix}-brand">
      <h2>{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
      <p style="color:rgba(255,255,255,0.5)">App-like navigation for the mobile-first era.</p>
    </div>
    <div class="${prefix}-accordion" id="${prefix}-acc">
      {% for block in section.blocks %}
        <div class="${prefix}-item" onclick="this.classList.toggle('active')">
          <button class="${prefix}-header">{{ block.settings.title }} <span>+</span></button>
          <div class="${prefix}-content">
            {% for i in (1..4) %}<a href="#" class="${prefix}-link">{{ block.settings.title }} Link {{i}}</a>{% endfor %}
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Accordion", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style12(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Social Proof Wall (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #fafafa; padding: 80px 20px; font-family: system-ui; }
  .${prefix}-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
  .${prefix}-social { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .${prefix}-social img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; transition: 0.4s; cursor: pointer; }
  .${prefix}-social img:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 2; position: relative; }
  .${prefix}-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-content: center; }
  .${prefix}-title { font-size: 2rem; font-weight: 800; color: #111; margin-bottom: 20px; }
  .${prefix}-col h4 { font-size: 1.1rem; color: ${niche.color1}; margin-bottom: 20px; }
  .${prefix}-col a { display: block; color: #555; text-decoration: none; margin-bottom: 12px; font-weight: 500; }
  .${prefix}-col a:hover { color: #000; text-decoration: underline; }
  @media (max-width: 900px) { .${prefix}-grid { grid-template-columns: 1fr; } }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-grid">
  <div>
    <h2 class="${prefix}-title">Join the ${niche.name} Community</h2>
    <div class="${prefix}-social">
      {% for i in (1..6) %}
        <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" alt="Social post">
      {% endfor %}
    </div>
  </div>
  <div class="${prefix}-nav">
    {% for block in section.blocks limit:4 %}
      <div class="${prefix}-col">
        <h4>{{ block.settings.title }}</h4>
        {% for i in (1..4) %}<a href="#">Link {{i}}</a>{% endfor %}
      </div>
    {% endfor %}
  </div>
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style13(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Support Centric (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: ${niche.color1}; color: #fff; padding: 100px 20px; font-family: system-ui; }
  .${prefix}-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: stretch; gap: 40px; flex-wrap: wrap; }
  .${prefix}-support { background: rgba(255,255,255,0.1); padding: 50px; border-radius: 20px; flex: 1 1 400px; display: flex; flex-direction: column; justify-content: center; backdrop-filter: blur(10px); }
  .${prefix}-support h2 { font-size: 2.5rem; margin-bottom: 30px; font-weight: 800; }
  .${prefix}-btn { display: inline-block; padding: 20px 40px; background: #fff; color: ${niche.color1}; border-radius: 50px; font-size: 1.2rem; font-weight: 800; text-decoration: none; text-align: center; transition: 0.3s; }
  .${prefix}-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
  .${prefix}-nav { flex: 2 1 500px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 40px; }
  .${prefix}-col h4 { font-size: 1.2rem; color: rgba(255,255,255,0.6); margin-bottom: 20px; }
  .${prefix}-col a { color: #fff; text-decoration: none; display: block; margin-bottom: 15px; font-size: 1.1rem; transition: 0.2s; }
  .${prefix}-col a:hover { color: ${niche.color3}; padding-left: 10px; }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-container">
  <div class="${prefix}-support">
    <h2>Here for you 24/7.</h2>
    <p style="font-size:1.2rem; opacity:0.8; margin-bottom:40px;">Expert advice and support for all your ${niche.name} needs.</p>
    <a href="#" class="${prefix}-btn">Start Live Chat</a>
  </div>
  <div class="${prefix}-nav">
    {% for block in section.blocks %}
      <div class="${prefix}-col">
        <h4>{{ block.settings.title }}</h4>
        {% for i in (1..5) %}<a href="#">Link {{i}}</a>{% endfor %}
      </div>
    {% endfor %}
  </div>
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style14(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Dark Luxury (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #0a0a0a; padding: 120px 20px; font-family: 'Times New Roman', serif; color: #d4af37; border-top: 1px solid rgba(212,175,55,0.2); }
  .${prefix}-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 60px; }
  .${prefix}-brand { flex: 1 1 300px; }
  .${prefix}-brand h2 { font-size: 3rem; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 20px; }
  .${prefix}-brand p { font-family: system-ui; color: #888; font-size: 0.9rem; line-height: 1.8; }
  .${prefix}-nav { display: flex; gap: 80px; flex-wrap: wrap; }
  .${prefix}-col h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 30px; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 10px; }
  .${prefix}-col a { font-family: system-ui; color: #ccc; text-decoration: none; display: block; margin-bottom: 15px; font-size: 0.95rem; transition: 0.4s; }
  .${prefix}-col a:hover { color: #d4af37; letter-spacing: 1px; }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-container">
  <div class="${prefix}-brand">
    <h2>{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <p>{{ section.settings.brand_text | default: "Excellence and refinement in every detail." }}</p>
  </div>
  <div class="${prefix}-nav">
    {% for block in section.blocks %}
      <div class="${prefix}-col">
        <h4>{{ block.settings.title }}</h4>
        {% for i in (1..4) %}<a href="#">Link {{i}}</a>{% endfor %}
      </div>
    {% endfor %}
  </div>
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" }, { "type": "textarea", "id": "brand_text", "label": "Brand Description" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style15(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Sticky Bottom Bar (${niche.name}) {% endcomment %}
<style>
  .${prefix}-spacer { height: 400px; }
  .${prefix}-wrapper { position: fixed; bottom: 0; left: 0; width: 100%; height: 400px; background: ${niche.color3}; padding: 60px 40px; font-family: system-ui; z-index: -10; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.1); }
  .${prefix}-brand { max-width: 400px; }
  .${prefix}-brand h2 { font-size: 2.5rem; font-weight: 900; color: ${niche.color1}; margin-bottom: 20px; }
  .${prefix}-nav { display: flex; gap: 60px; }
  .${prefix}-col h4 { font-size: 1.1rem; color: #111; margin-bottom: 20px; }
  .${prefix}-col a { color: #666; text-decoration: none; display: block; margin-bottom: 12px; transition: 0.2s; }
  .${prefix}-col a:hover { color: ${niche.color1}; }
  body { margin-bottom: 400px !important; }
  @media (max-width: 900px) {
    .${prefix}-spacer { height: auto; }
    .${prefix}-wrapper { position: relative; height: auto; flex-direction: column; z-index: 1; }
    body { margin-bottom: 0 !important; }
  }
</style>
<!-- The spacer pushes normal content up so the fixed footer is revealed on scroll -->
<div class="${prefix}-spacer"></div>
<div class="${prefix}-wrapper">
  <div class="${prefix}-brand">
    <h2>{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <p>A persistent, sticky experience revealed at the end of your journey.</p>
  </div>
  <div class="${prefix}-nav">
    {% for block in section.blocks limit:3 %}
      <div class="${prefix}-col">
        <h4>{{ block.settings.title }}</h4>
        {% for i in (1..4) %}<a href="#">Link {{i}}</a>{% endfor %}
      </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style16(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - 3D Layered (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #e0e5ec; padding: 100px 20px; font-family: system-ui; perspective: 1000px; }
  .${prefix}-container { max-width: 1000px; margin: 0 auto; transform-style: preserve-3d; transform: rotateX(10deg); transition: transform 0.5s; }
  .${prefix}-container:hover { transform: rotateX(0deg); }
  .${prefix}-layer { background: #fff; padding: 60px; border-radius: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.1); display: grid; grid-template-columns: 1fr 2fr; gap: 40px; transform: translateZ(50px); }
  .${prefix}-title { font-size: 2.5rem; font-weight: 900; color: ${niche.color1}; margin-bottom: 20px; }
  .${prefix}-nav { display: flex; gap: 40px; justify-content: space-around; }
  .${prefix}-col a { display: block; color: #555; text-decoration: none; padding: 10px 0; font-size: 1.1rem; transition: 0.3s; }
  .${prefix}-col a:hover { color: ${niche.color1}; transform: translateZ(20px); font-weight: 700; }
  @media (max-width: 768px) { .${prefix}-layer { grid-template-columns: 1fr; transform: translateZ(0); } .${prefix}-container { transform: none; } }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-container">
  <div class="${prefix}-layer">
    <div>
      <h2 class="${prefix}-title">{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
      <p style="color:#666">3D Depth and dimension for a futuristic web.</p>
    </div>
    <div class="${prefix}-nav">
      {% for block in section.blocks limit:2 %}
        <div class="${prefix}-col">
          {% for i in (1..4) %}<a href="#">{{ block.settings.title }} Link {{i}}</a>{% endfor %}
        </div>
      {% endfor %}
    </div>
  </div>
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Column", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style17(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Map & Location (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { display: flex; font-family: system-ui; background: #fff; border-top: 1px solid #eee; }
  .${prefix}-map { flex: 1; background: #eee; min-height: 400px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .${prefix}-map img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) contrast(120%); opacity: 0.8; }
  .${prefix}-info { flex: 1; padding: 80px; display: flex; flex-direction: column; justify-content: center; }
  .${prefix}-title { font-size: 2rem; font-weight: 800; color: ${niche.color1}; margin-bottom: 30px; }
  .${prefix}-address { font-size: 1.2rem; line-height: 1.8; color: #555; margin-bottom: 40px; }
  .${prefix}-nav { display: flex; gap: 40px; }
  .${prefix}-nav a { color: #111; text-decoration: none; font-weight: 600; text-transform: uppercase; font-size: 0.9rem; transition: 0.2s; border-bottom: 2px solid transparent; padding-bottom: 5px; }
  .${prefix}-nav a:hover { border-bottom-color: ${niche.color1}; color: ${niche.color1}; }
  @media (max-width: 900px) { .${prefix}-wrapper { flex-direction: column; } .${prefix}-map { min-height: 300px; } .${prefix}-info { padding: 40px 20px; } }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-info">
    <h2 class="${prefix}-title">Visit Our Flagship</h2>
    <div class="${prefix}-address">
      <strong>{{ section.settings.brand_name | default: "${niche.name}" }} HQ</strong><br>
      2050 Innovation Drive<br>
      Neo-Tokyo, NT 90210<br>
      contact@{{ section.settings.brand_name | default: "${niche.name}" | downcase | replace: " ", "" }}.com
    </div>
    <div class="${prefix}-nav">
      {% for block in section.blocks limit:3 %}
        <a href="#">{{ block.settings.title }}</a>
      {% endfor %}
    </div>
  </div>
  <div class="${prefix}-map">
    <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" alt="Map Location">
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Link", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style18(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Gamified Icons (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: ${niche.color3}; padding: 100px 20px; font-family: system-ui; text-align: center; }
  .${prefix}-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; }
  .${prefix}-item { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #333; transition: 0.3s; }
  .${prefix}-icon { width: 100px; height: 100px; background: #fff; border-radius: 30px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: 0 15px 35px rgba(0,0,0,0.05); margin-bottom: 20px; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .${prefix}-item:hover .${prefix}-icon { transform: translateY(-15px) scale(1.1) rotate(5deg); box-shadow: 0 25px 45px rgba(0,0,0,0.1); background: ${niche.color1}; color: #fff; }
  .${prefix}-item h4 { font-size: 1.2rem; font-weight: 700; margin: 0; }
  .${prefix}-item p { font-size: 0.9rem; color: #777; margin-top: 10px; }
</style>
<div class="${prefix}-wrapper">
  <h2 style="font-size:2.5rem; margin-bottom:60px; color:${niche.color1};">{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
  <div class="${prefix}-grid">
    {% for block in section.blocks limit:4 %}
      <a href="#" class="${prefix}-item">
        <div class="${prefix}-icon">✦</div>
        <h4>{{ block.settings.title }}</h4>
        <p>Explore our latest {{ block.settings.title | downcase }}</p>
      </a>
    {% endfor %}
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Icon Card", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list", "settings": {"title":"Shop"} }, { "type": "link_list", "settings": {"title":"Community"} }, { "type": "link_list", "settings": {"title":"Rewards"} }, { "type": "link_list", "settings": {"title":"Support"} } ] } ]
}
{% endschema %}`;
}

export function style19(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Minimalist Strip (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #fff; padding: 40px 20px; font-family: system-ui; border-top: 1px solid #eee; }
  .${prefix}-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .${prefix}-brand { font-size: 1.5rem; font-weight: 900; color: ${niche.color1}; text-decoration: none; letter-spacing: -0.02em; }
  .${prefix}-nav { display: flex; gap: 30px; flex-wrap: wrap; }
  .${prefix}-nav a { color: #555; text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: 0.2s; }
  .${prefix}-nav a:hover { color: #000; }
</style>
<div class="${prefix}-wrapper"><div class="${prefix}-container">
  <a href="#" class="${prefix}-brand">{{ section.settings.brand_name | default: "${niche.name}" }}</a>
  <div class="${prefix}-nav">
    {% for block in section.blocks limit:6 %}
      <a href="#">{{ block.settings.title }}</a>
    {% endfor %}
  </div>
  <div style="font-size:0.9rem; color:#888;">&copy; {{ 'now' | date: '%Y' }} All Rights Reserved.</div>
</div></div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Link", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Link" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" }, { "type": "link_list" } ] } ]
}
{% endschema %}`;
}

export function style20(niche, prefix, schemaName) {
  return `{% comment %} 2050 Advanced Footer - Hologram (${niche.name}) {% endcomment %}
<style>
  .${prefix}-wrapper { background: #050505; padding: 120px 20px; font-family: 'Space Grotesk', system-ui, sans-serif; color: #fff; position: relative; overflow: hidden; }
  .${prefix}-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 40px 40px; transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px); animation: ${prefix}-gridMove 10s linear infinite; z-index: 1; }
  @keyframes ${prefix}-gridMove { from { background-position: 0 0; } to { background-position: 0 40px; } }
  .${prefix}-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center; }
  .${prefix}-title { font-size: clamp(3rem, 10vw, 8rem); font-weight: 900; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.8); text-shadow: 0 0 20px ${niche.color1}; margin-bottom: 60px; letter-spacing: 5px; }
  .${prefix}-nav { display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; background: rgba(0,0,0,0.5); padding: 30px 60px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); box-shadow: 0 0 30px ${niche.color1}44; }
  .${prefix}-nav a { color: #fff; text-decoration: none; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; transition: 0.3s; }
  .${prefix}-nav a:hover { color: ${niche.color1}; text-shadow: 0 0 10px ${niche.color1}; transform: scale(1.1); }
</style>
<div class="${prefix}-wrapper">
  <div class="${prefix}-grid"></div>
  <div class="${prefix}-container">
    <h2 class="${prefix}-title">{{ section.settings.brand_name | default: "${niche.name}" }}</h2>
    <div class="${prefix}-nav">
      {% for block in section.blocks limit:4 %}
        <a href="#">{{ block.settings.title }}</a>
      {% endfor %}
    </div>
  </div>
</div>
{% schema %}
{
  "name": "${schemaName}",
  "settings": [ { "type": "text", "id": "brand_name", "label": "Brand Name", "default": "${niche.name}" } ],
  "blocks": [ { "type": "link_list", "name": "Link", "settings": [ { "type": "text", "id": "title", "label": "Title", "default": "Explore" } ] } ],
  "presets": [ { "name": "${schemaName}", "blocks": [ { "type": "link_list", "settings": {"title": "Cyber"} }, { "type": "link_list", "settings": {"title": "Nexus"} }, { "type": "link_list", "settings": {"title": "Core"} } ] } ]
}
{% endschema %}`;
}
