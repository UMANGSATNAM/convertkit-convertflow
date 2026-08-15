export function style1(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Glassmorphic Grid (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 80px 20px; background: linear-gradient(135deg, ${niche.color3}, #ffffff); position: relative; overflow: hidden; font-family: system-ui; }
  .${prefix}-bg-blob { position: absolute; width: 600px; height: 600px; background: ${niche.color1}33; border-radius: 50%; filter: blur(80px); top: -100px; left: -100px; z-index: 1; animation: float 10s infinite alternate; }
  .${prefix}-title { text-align: center; font-size: 3rem; font-weight: 900; color: #111; margin-bottom: 50px; position: relative; z-index: 2; }
  .${prefix}-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; }
  .${prefix}-card { background: rgba(255,255,255,0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5); padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .${prefix}-card:hover { transform: translateY(-10px) scale(1.02); }
  .${prefix}-stars { color: ${niche.color1}; font-size: 1.2rem; margin-bottom: 15px; }
  .${prefix}-text { font-size: 1.1rem; line-height: 1.6; color: #444; font-style: italic; margin-bottom: 20px; }
  .${prefix}-author { display: flex; align-items: center; gap: 15px; }
  .${prefix}-avatar { width: 50px; height: 50px; border-radius: 50%; background: ${niche.color1}; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 1.2rem; }
  .${prefix}-name { font-weight: 700; color: #111; }
  .${prefix}-verified { font-size: 0.8rem; color: #2e8b57; font-weight: 600; display: flex; align-items: center; gap: 5px; }
  @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(100px, 50px); } }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-bg-blob"></div>
  <h2 class="${prefix}-title">Loved by ${niche.name} Experts</h2>
  <div class="${prefix}-grid">
    {% for i in (1..3) %}
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-text">"Absolutely transformative for my daily routine. The quality of this ${niche.name} product is unmatched in 2050."</p>
      <div class="${prefix}-author">
        <div class="${prefix}-avatar">A{{ i }}</div>
        <div>
          <div class="${prefix}-name">Alex M.</div>
          <div class="${prefix}-verified">✓ Verified Buyer</div>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style2(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Infinite Marquee (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 0; background: #050505; color: #fff; overflow: hidden; font-family: 'Helvetica Neue', sans-serif; }
  .${prefix}-title { text-align: center; font-size: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: ${niche.color2}; margin-bottom: 50px; }
  .${prefix}-marquee { display: flex; width: max-content; animation: ${prefix}-scroll 30s linear infinite; }
  .${prefix}-marquee:hover { animation-play-state: paused; }
  @keyframes ${prefix}-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .${prefix}-card { width: 450px; background: #111; border: 1px solid rgba(255,255,255,0.1); padding: 40px; margin: 0 15px; border-radius: 10px; transition: 0.3s; }
  .${prefix}-card:hover { border-color: ${niche.color1}; box-shadow: 0 0 30px ${niche.color1}44; }
  .${prefix}-quote { font-size: 1.4rem; font-weight: 300; line-height: 1.5; margin-bottom: 30px; }
  .${prefix}-author { display: flex; justify-content: space-between; align-items: flex-end; }
  .${prefix}-name { font-weight: 700; font-size: 1.1rem; color: ${niche.color1}; }
  .${prefix}-handle { color: #888; font-size: 0.9rem; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">Community Validation</h2>
  <div style="display:flex; overflow:hidden; position:relative;">
    <div style="position:absolute; left:0; top:0; bottom:0; width:100px; background:linear-gradient(90deg, #050505, transparent); z-index:2;"></div>
    <div style="position:absolute; right:0; top:0; bottom:0; width:100px; background:linear-gradient(-90deg, #050505, transparent); z-index:2;"></div>
    <div class="${prefix}-marquee">
      {% for i in (1..6) %}
      <div class="${prefix}-card">
        <p class="${prefix}-quote">"The ${niche.name} ecosystem they built here is lightyears ahead. Completely changed how we operate."</p>
        <div class="${prefix}-author">
          <div><div class="${prefix}-name">Sarah J.</div><div class="${prefix}-handle">@sarah_tech{{ i }}</div></div>
          <div style="color:${niche.color1};">★★★★★</div>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style3(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - 3D Rotating Carousel (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 120px 20px; background: #fff; font-family: system-ui; display: flex; flex-direction: column; align-items: center; overflow: hidden; perspective: 1200px; }
  .${prefix}-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 80px; color: #111; z-index: 10; text-align: center; }
  .${prefix}-carousel { position: relative; width: 300px; height: 400px; transform-style: preserve-3d; animation: ${prefix}-spin 20s infinite linear; }
  @keyframes ${prefix}-spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
  .${prefix}-carousel:hover { animation-play-state: paused; }
  .${prefix}-card { position: absolute; top: 0; left: 0; width: 300px; height: 350px; background: ${niche.color3}; border: 1px solid #eee; border-radius: 20px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; backface-visibility: hidden; }
  /* Distribute 4 cards evenly */
  .${prefix}-card:nth-child(1) { transform: rotateY(0deg) translateZ(350px); }
  .${prefix}-card:nth-child(2) { transform: rotateY(90deg) translateZ(350px); }
  .${prefix}-card:nth-child(3) { transform: rotateY(180deg) translateZ(350px); }
  .${prefix}-card:nth-child(4) { transform: rotateY(270deg) translateZ(350px); }
  .${prefix}-stars { color: ${niche.color1}; font-size: 1.5rem; margin-bottom: 20px; }
  .${prefix}-text { font-size: 1.1rem; font-weight: 500; color: #333; margin-bottom: 30px; }
  .${prefix}-author { font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">${niche.name} 3D Experiences</h2>
  <div class="${prefix}-carousel">
    {% for i in (1..4) %}
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-text">"Unbelievable 3D presence and incredible utility. The ${niche.name} market needed this exact product in 2050."</p>
      <div class="${prefix}-author">Customer 0{{ i }}</div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style4(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Video UGC Feed (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 80px 5vw; background: #fdfdfd; font-family: system-ui; }
  .${prefix}-title { font-size: 3rem; font-weight: 800; color: #111; margin-bottom: 50px; }
  .${prefix}-title span { color: ${niche.color1}; }
  .${prefix}-grid { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 40px; scroll-snap-type: x mandatory; }
  .${prefix}-grid::-webkit-scrollbar { height: 10px; }
  .${prefix}-grid::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  .${prefix}-card { flex: 0 0 300px; height: 500px; border-radius: 30px; background: #000; position: relative; overflow: hidden; scroll-snap-align: start; box-shadow: 0 15px 35px rgba(0,0,0,0.1); cursor: pointer; }
  .${prefix}-video-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: 0.4s; filter: grayscale(50%); }
  .${prefix}-card:hover .${prefix}-video-bg { opacity: 0.9; filter: grayscale(0%); transform: scale(1.05); }
  .${prefix}-content { position: absolute; bottom: 0; left: 0; width: 100%; padding: 30px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); color: #fff; }
  .${prefix}-stars { color: #fff; margin-bottom: 10px; font-size: 1.2rem; }
  .${prefix}-quote { font-weight: 700; font-size: 1.2rem; margin: 0 0 10px 0; line-height: 1.4; }
  .${prefix}-user { font-size: 0.9rem; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 10px; }
  .${prefix}-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 1.5rem; transition: 0.3s; }
  .${prefix}-card:hover .${prefix}-play { background: ${niche.color1}; transform: translate(-50%, -50%) scale(1.1); }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">Real <span>${niche.name}</span> Creators</h2>
  <div class="${prefix}-grid">
    {% for i in (1..6) %}
    <div class="${prefix}-card">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-1.png?v=1530129113" class="${prefix}-video-bg">
      <div class="${prefix}-play">▶</div>
      <div class="${prefix}-content">
        <div class="${prefix}-stars">★★★★★</div>
        <p class="${prefix}-quote">"Obsessed with this ${niche.name} find! Watch till the end."</p>
        <div class="${prefix}-user">@creator_{{ i }}</div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style5(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Brutalist Quote Blocks (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 5vw; background: #fff; font-family: 'Helvetica Neue', sans-serif; border-top: 4px solid #000; border-bottom: 4px solid #000; }
  .${prefix}-title { font-size: clamp(3rem, 5vw, 5rem); font-weight: 900; text-transform: uppercase; margin-bottom: 80px; line-height: 1; letter-spacing: -2px; }
  .${prefix}-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px; }
  .${prefix}-card { border: 4px solid #000; background: ${niche.color3}; padding: 40px; position: relative; box-shadow: 10px 10px 0 ${niche.color1}; transition: 0.2s; }
  .${prefix}-card:hover { transform: translate(-5px, -5px); box-shadow: 15px 15px 0 ${niche.color1}; }
  .${prefix}-quote-mark { position: absolute; top: 10px; right: 20px; font-size: 8rem; color: rgba(0,0,0,0.1); font-weight: 900; line-height: 1; font-family: serif; }
  .${prefix}-text { font-size: 1.5rem; font-weight: 700; text-transform: uppercase; margin-bottom: 40px; position: relative; z-index: 2; }
  .${prefix}-footer { border-top: 4px solid #000; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-weight: 900; font-size: 1.2rem; text-transform: uppercase; }
  .${prefix}-rating { color: ${niche.color1}; font-size: 1.5rem; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">HEAR IT<br>FROM THEM</h2>
  <div class="${prefix}-grid">
    {% for i in (1..4) %}
    <div class="${prefix}-card">
      <div class="${prefix}-quote-mark">"</div>
      <p class="${prefix}-text">"THE ONLY ${niche.name} GEAR I TRUST ANYMORE. BRUTALLY EFFECTIVE."</p>
      <div class="${prefix}-footer">
        <div>SUBJECT 00{{ i }}</div>
        <div class="${prefix}-rating">★★★★★</div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style6(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Neumorphic Sliders (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 20px; background: #e0e5ec; font-family: system-ui; display: flex; justify-content: center; align-items: center; flex-direction: column; }
  .${prefix}-title { font-size: 2.5rem; font-weight: 800; color: #444; margin-bottom: 60px; text-shadow: 2px 2px 4px rgba(255,255,255,0.5); }
  .${prefix}-slider { width: 100%; max-width: 800px; background: #e0e5ec; padding: 60px; border-radius: 40px; box-shadow: 12px 12px 24px rgba(163,177,198,0.6), -12px -12px 24px rgba(255,255,255,0.8); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
  .${prefix}-avatar { width: 100px; height: 100px; border-radius: 50%; box-shadow: inset 6px 6px 12px rgba(163,177,198,0.6), inset -6px -6px 12px rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; margin-bottom: 30px; font-size: 3rem; color: ${niche.color1}; font-weight: 900; background: #e0e5ec; border: 4px solid #e0e5ec; }
  .${prefix}-quote { font-size: 1.5rem; color: #555; font-weight: 500; font-style: italic; margin-bottom: 40px; line-height: 1.5; }
  .${prefix}-name { font-weight: 800; font-size: 1.2rem; color: #333; }
  .${prefix}-controls { display: flex; gap: 20px; margin-top: 50px; }
  .${prefix}-btn { width: 50px; height: 50px; border-radius: 50%; border: none; background: #e0e5ec; box-shadow: 6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.8); cursor: pointer; color: ${niche.color1}; font-size: 1.2rem; transition: 0.2s; font-weight: 900; }
  .${prefix}-btn:active { box-shadow: inset 4px 4px 8px rgba(163,177,198,0.6), inset -4px -4px 8px rgba(255,255,255,0.8); }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">${niche.name} Voices</h2>
  <div class="${prefix}-slider">
    <div class="${prefix}-avatar">T</div>
    <p class="${prefix}-quote">"A completely seamless experience from start to finish. The soft interface and incredible ${niche.name} performance blew me away."</p>
    <div class="${prefix}-name">Timothy C. — ★★★★★</div>
  </div>
  <div class="${prefix}-controls">
    <button class="${prefix}-btn">←</button>
    <button class="${prefix}-btn">→</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style7(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Bento Review Wall (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 80px 5vw; background: #f4f4f5; font-family: system-ui; }
  .${prefix}-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
  .${prefix}-title { font-size: 3rem; font-weight: 800; color: #111; margin: 0; }
  .${prefix}-badge { background: ${niche.color1}; color: #fff; padding: 10px 20px; border-radius: 100px; font-weight: 800; font-size: 1.1rem; }
  .${prefix}-bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 250px; gap: 20px; }
  .${prefix}-card { background: #fff; border-radius: 30px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; flex-direction: column; transition: 0.3s; }
  .${prefix}-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
  .${prefix}-card.large { grid-column: span 2; grid-row: span 2; }
  .${prefix}-card.wide { grid-column: span 2; }
  .${prefix}-stars { color: #fbbf24; font-size: 1.5rem; margin-bottom: 15px; }
  .${prefix}-text { font-size: 1.1rem; font-weight: 500; color: #444; flex: 1; }
  .${prefix}-large-text { font-size: 1.8rem; font-weight: 700; color: #111; line-height: 1.3; flex: 1; }
  .${prefix}-author { display: flex; align-items: center; gap: 15px; margin-top: 20px; }
  .${prefix}-author img { width: 40px; height: 40px; border-radius: 50%; }
  .${prefix}-name { font-weight: 700; color: #000; }
  @media (max-width: 1024px) { .${prefix}-bento { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .${prefix}-bento { grid-template-columns: 1fr; grid-auto-rows: auto; } .${prefix}-card.large, .${prefix}-card.wide { grid-column: span 1; grid-row: span 1; } }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Wall of Love</h2>
    <div class="${prefix}-badge">4.9/5 Average Rating</div>
  </div>
  <div class="${prefix}-bento">
    <div class="${prefix}-card large">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-large-text">"I've tried every ${niche.name} brand on the market, but this is the first one that genuinely feels like it's from the future. Exceptional."</p>
      <div class="${prefix}-author"><div class="${prefix}-name">Elena Rodriguez</div></div>
    </div>
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-text">"Instant favorite."</p>
      <div class="${prefix}-author"><div class="${prefix}-name">Mark T.</div></div>
    </div>
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★☆</div>
      <p class="${prefix}-text">"Great ${niche.name} design."</p>
      <div class="${prefix}-author"><div class="${prefix}-name">Sophie L.</div></div>
    </div>
    <div class="${prefix}-card wide">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-text">"Customer service was amazing and the product itself exceeded all expectations."</p>
      <div class="${prefix}-author"><div class="${prefix}-name">David W.</div></div>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style8(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Dark Mode Glowing (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 5vw; background: #000; color: #fff; font-family: 'Inter', sans-serif; }
  .${prefix}-title { text-align: center; font-size: 3rem; font-weight: 800; margin-bottom: 80px; position: relative; }
  .${prefix}-title::after { content: ''; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: ${niche.color1}; box-shadow: 0 0 20px ${niche.color1}; }
  .${prefix}-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; }
  .${prefix}-card { background: #0a0a0a; border: 1px solid #222; border-radius: 20px; padding: 40px; position: relative; overflow: hidden; transition: 0.4s; }
  .${prefix}-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(transparent, transparent, transparent, ${niche.color1}); animation: ${prefix}-border-glow 4s linear infinite; opacity: 0; transition: 0.4s; z-index: 1; }
  .${prefix}-card:hover::before { opacity: 1; }
  .${prefix}-card::after { content: ''; position: absolute; inset: 2px; background: #0a0a0a; border-radius: 18px; z-index: 2; }
  @keyframes ${prefix}-border-glow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .${prefix}-content { position: relative; z-index: 3; }
  .${prefix}-quote { font-size: 1.2rem; font-weight: 300; line-height: 1.6; color: #ddd; margin-bottom: 30px; }
  .${prefix}-stars { color: ${niche.color1}; letter-spacing: 5px; margin-bottom: 20px; text-shadow: 0 0 10px ${niche.color1}88; }
  .${prefix}-author { font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">ILLUMINATED EXPERIENCES</h2>
  <div class="${prefix}-grid">
    {% for i in (1..3) %}
    <div class="${prefix}-card">
      <div class="${prefix}-content">
        <div class="${prefix}-stars">★★★★★</div>
        <p class="${prefix}-quote">"The glowing aesthetic and deep integration for my ${niche.name} setup is flawless. 10/10 would buy again."</p>
        <div class="${prefix}-author">NEXUS_USER_0{{ i }}</div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style9(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Cyberpunk Terminal (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 80px 20px; background: #000; font-family: 'Courier New', monospace; color: #0f0; border-top: 1px dashed #0f0; border-bottom: 1px dashed #0f0; }
  .${prefix}-terminal { max-width: 900px; margin: 0 auto; background: #050505; border: 2px solid #0f0; padding: 40px; box-shadow: inset 0 0 20px rgba(0,255,0,0.1), 0 0 30px rgba(0,255,0,0.1); }
  .${prefix}-header { border-bottom: 2px dashed #0f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; font-weight: bold; }
  .${prefix}-log { margin-bottom: 30px; }
  .${prefix}-timestamp { color: #fff; margin-right: 15px; }
  .${prefix}-user { color: #f0f; font-weight: bold; }
  .${prefix}-text { display: block; margin-top: 10px; line-height: 1.5; }
  .${prefix}-stars { color: #ff0; }
  .cursor-blink { animation: blinker 1s linear infinite; }
  @keyframes blinker { 50% { opacity: 0; } }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-terminal">
    <div class="${prefix}-header">
      <div>> SYS.LOG.REVIEWS // ${niche.name}</div>
      <div>ENCRYPTED_CONNECTION</div>
    </div>
    {% for i in (1..3) %}
    <div class="${prefix}-log">
      <span class="${prefix}-timestamp">[2050.11.0{{ i }}]</span>
      <span class="${prefix}-user">@HACKER_{{ i }}</span>
      <span class="${prefix}-stars">[RATING: 5/5]</span>
      <span class="${prefix}-text">>> "This module bypasses all expectations. The ${niche.name} framework holds up under heavy load."</span>
    </div>
    {% endfor %}
    <div>> AWAITING NEW INPUT <span class="cursor-blink">█</span></div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style10(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Interactive Scatter (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 150px 20px; background: #f9f9f9; position: relative; overflow: hidden; min-height: 600px; display: flex; align-items: center; justify-content: center; font-family: system-ui; }
  .${prefix}-title { font-size: 4rem; font-weight: 900; color: rgba(0,0,0,0.05); position: absolute; z-index: 1; text-align: center; width: 100%; pointer-events: none; }
  .${prefix}-container { position: relative; width: 100%; max-width: 1200px; height: 400px; z-index: 2; }
  .${prefix}-card { position: absolute; width: 320px; background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 15px 30px rgba(0,0,0,0.1); border: 1px solid #eee; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: crosshair; }
  .${prefix}-card:hover { transform: scale(1.1) rotate(0deg) !important; z-index: 10; box-shadow: 0 25px 50px rgba(0,0,0,0.15); border-color: ${niche.color1}; }
  .${prefix}-card:nth-child(1) { top: 10%; left: 10%; transform: rotate(-5deg); }
  .${prefix}-card:nth-child(2) { top: 40%; left: 40%; transform: rotate(3deg); z-index: 3; }
  .${prefix}-card:nth-child(3) { top: 20%; right: 10%; transform: rotate(8deg); }
  .${prefix}-stars { color: ${niche.color1}; font-size: 1.2rem; margin-bottom: 15px; }
  .${prefix}-text { font-size: 1.1rem; color: #444; font-weight: 500; margin-bottom: 20px; }
  .${prefix}-author { font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #111; }
  @media (max-width: 768px) { .${prefix}-card { position: relative; top: auto !important; left: auto !important; right: auto !important; transform: none !important; margin: 0 auto 20px auto; width: 100%; max-width: 350px; } .${prefix}-container { height: auto; display: flex; flex-direction: column; } }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">${niche.name}<br>REVIEWS</h2>
  <div class="${prefix}-container">
    {% for i in (1..3) %}
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-text">"Hover over these cards! The ${niche.name} UX here is crazy fun. Love the products too."</p>
      <div class="${prefix}-author">Reviewer 0{{ i }}</div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style11(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Liquid Gradient Slider (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 5vw; background: #000; font-family: system-ui; overflow: hidden; position: relative; }
  .${prefix}-bg { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 50% 50%, ${niche.color1}, transparent 40%), radial-gradient(circle at 20% 80%, ${niche.color3}, transparent 40%); filter: blur(100px); animation: ${prefix}-liquid 20s infinite alternate linear; opacity: 0.5; }
  @keyframes ${prefix}-liquid { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(180deg) scale(1.5); } }
  .${prefix}-container { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; text-align: center; color: #fff; }
  .${prefix}-title { font-size: 3rem; font-weight: 900; margin-bottom: 60px; letter-spacing: 2px; }
  .${prefix}-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.1); border-radius: 40px; padding: 60px 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
  .${prefix}-stars { font-size: 2rem; color: ${niche.color2}; margin-bottom: 30px; letter-spacing: 10px; }
  .${prefix}-text { font-size: 2rem; font-weight: 300; line-height: 1.4; margin-bottom: 40px; }
  .${prefix}-author { font-size: 1.2rem; font-weight: 700; color: ${niche.color1}; }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-bg"></div>
  <div class="${prefix}-container">
    <h2 class="${prefix}-title">LIQUID PRAISE</h2>
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-text">"It feels fluid, dynamic, and perfectly aligned with our ${niche.name} goals. Phenomenal design."</p>
      <div class="${prefix}-author">FLUID_USER_01</div>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style12(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Minimalist Brutalist (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 150px 5vw; background: ${niche.color1}; color: ${niche.color2}; font-family: Helvetica, sans-serif; }
  .${prefix}-quote { font-size: clamp(4rem, 8vw, 8rem); font-weight: 900; line-height: 0.9; text-transform: uppercase; margin: 0; letter-spacing: -3px; }
  .${prefix}-author { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 100px; padding-top: 20px; border-top: 5px solid ${niche.color2}; font-size: 2rem; font-weight: 700; }
  .${prefix}-stars { font-size: 3rem; }
  .${prefix}-tag { background: ${niche.color2}; color: ${niche.color1}; padding: 10px 20px; border-radius: 50px; font-size: 1rem; margin-bottom: 20px; display: inline-block; font-weight: 900; }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-tag">VERIFIED ${niche.name} BUYER</div>
  <h2 class="${prefix}-quote">"LITERALLY THE BEST THING I BOUGHT THIS YEAR."</h2>
  <div class="${prefix}-author">
    <div>JOHN DOE</div>
    <div class="${prefix}-stars">★★★★★</div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style13(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Floating Avatars (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 20px; background: #fff; position: relative; height: 600px; overflow: hidden; font-family: system-ui; display: flex; align-items: center; justify-content: center; }
  .${prefix}-title { font-size: 4rem; font-weight: 900; color: #f0f0f0; position: absolute; z-index: 1; text-align: center; }
  .${prefix}-avatar { position: absolute; width: 80px; height: 80px; border-radius: 50%; background: ${niche.color1}; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 1.5rem; cursor: pointer; transition: 0.3s; z-index: 2; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
  .${prefix}-avatar:hover { transform: scale(1.2); z-index: 10; }
  .${prefix}-avatar:nth-child(2) { top: 20%; left: 15%; animation: ${prefix}-float 6s infinite alternate; }
  .${prefix}-avatar:nth-child(3) { top: 60%; left: 25%; animation: ${prefix}-float 8s infinite alternate-reverse; }
  .${prefix}-avatar:nth-child(4) { top: 30%; right: 20%; animation: ${prefix}-float 7s infinite alternate; }
  .${prefix}-avatar:nth-child(5) { top: 70%; right: 15%; animation: ${prefix}-float 9s infinite alternate-reverse; }
  @keyframes ${prefix}-float { 0% { transform: translateY(0); } 100% { transform: translateY(30px); } }
  .${prefix}-review-box { position: absolute; z-index: 5; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 400px; text-align: center; pointer-events: none; transition: 0.3s; opacity: 1; }
  .${prefix}-stars { color: #fbbf24; font-size: 1.5rem; margin-bottom: 10px; }
  .${prefix}-text { font-size: 1.2rem; font-weight: 500; color: #333; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">${niche.name} GALAXY</h2>
  <div class="${prefix}-avatar">A1</div>
  <div class="${prefix}-avatar">B2</div>
  <div class="${prefix}-avatar">C3</div>
  <div class="${prefix}-avatar">D4</div>
  <div class="${prefix}-review-box">
    <div class="${prefix}-stars">★★★★★</div>
    <p class="${prefix}-text">"Hover over an avatar to see their story. The ${niche.name} community is vibrant."</p>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style14(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Retro Vaporwave (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 5vw; background: linear-gradient(180deg, #1a0033 0%, #000 100%); color: #fff; font-family: 'Courier New', monospace; position: relative; overflow: hidden; }
  .${prefix}-grid-floor { position: absolute; bottom: 0; left: -50%; width: 200%; height: 50%; background-image: linear-gradient(transparent 95%, #f0f 100%), linear-gradient(90deg, transparent 95%, #f0f 100%); background-size: 40px 40px; transform: perspective(500px) rotateX(60deg); animation: ${prefix}-move-grid 5s linear infinite; }
  @keyframes ${prefix}-move-grid { 0% { background-position: 0 0; } 100% { background-position: 0 40px; } }
  .${prefix}-title { text-align: center; font-size: 4rem; font-weight: 900; color: #0ff; text-shadow: 4px 4px 0 #f0f; position: relative; z-index: 2; margin-bottom: 60px; font-style: italic; }
  .${prefix}-card { background: rgba(0,0,0,0.7); border: 2px solid #0ff; padding: 40px; position: relative; z-index: 2; max-width: 800px; margin: 0 auto; box-shadow: 0 0 20px rgba(0,255,255,0.5), inset 0 0 20px rgba(255,0,255,0.5); }
  .${prefix}-quote { font-size: 1.5rem; line-height: 1.6; color: #fff; text-shadow: 1px 1px 5px #f0f; margin-bottom: 30px; }
  .${prefix}-author { font-size: 1.2rem; color: #0ff; display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-stars { color: #f0f; letter-spacing: 5px; }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-grid-floor"></div>
  <h2 class="${prefix}-title">VIRTUAL PRAISE</h2>
  <div class="${prefix}-card">
    <p class="${prefix}-quote">"THIS ${niche.name} ARTIFACT IS STRAIGHT OUT OF 1984 BUT FEELS LIKE 2050. ABSOLUTE VIBES."</p>
    <div class="${prefix}-author">
      <span>// USER_99</span>
      <span class="${prefix}-stars">★★★★★</span>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style15(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Holographic Glass (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 120px 5vw; background: #fafafa; font-family: system-ui; display: flex; justify-content: center; }
  .${prefix}-card { width: 100%; max-width: 900px; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0)); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 30px 60px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.5); border-radius: 40px; padding: 80px 60px; position: relative; overflow: hidden; }
  .${prefix}-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent, ${niche.color1}44, ${niche.color3}88, transparent); animation: ${prefix}-holo 10s linear infinite; pointer-events: none; z-index: 1; mix-blend-mode: overlay; }
  @keyframes ${prefix}-holo { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .${prefix}-content { position: relative; z-index: 2; text-align: center; }
  .${prefix}-quote { font-size: 2.5rem; font-weight: 300; line-height: 1.4; color: #111; margin-bottom: 40px; }
  .${prefix}-author { font-weight: 800; font-size: 1.2rem; color: ${niche.color1}; letter-spacing: 2px; text-transform: uppercase; }
  .${prefix}-stars { font-size: 2rem; color: #000; margin-bottom: 20px; }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-card">
    <div class="${prefix}-content">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-quote">"The holographic finish on these ${niche.name} products is stunning. A masterpiece of modern engineering."</p>
      <div class="${prefix}-author">Holo_Enthusiast</div>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style16(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Dynamic Split Screen (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { display: flex; height: 800px; font-family: system-ui; background: #000; color: #fff; }
  .${prefix}-left { flex: 1; background: url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1.png') center/cover; position: relative; }
  .${prefix}-left::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, #000); }
  .${prefix}-title { position: absolute; bottom: 50px; left: 50px; font-size: 4rem; font-weight: 900; z-index: 2; line-height: 1; text-transform: uppercase; }
  .${prefix}-right { flex: 1; padding: 80px; overflow-y: auto; scrollbar-width: none; }
  .${prefix}-right::-webkit-scrollbar { display: none; }
  .${prefix}-card { margin-bottom: 60px; padding-bottom: 60px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .${prefix}-stars { color: ${niche.color1}; font-size: 1.5rem; margin-bottom: 20px; }
  .${prefix}-quote { font-size: 1.8rem; font-weight: 300; line-height: 1.4; margin-bottom: 20px; }
  .${prefix}-author { font-weight: 700; color: #888; }
  @media (max-width: 900px) { .${prefix}-section { flex-direction: column; height: auto; } .${prefix}-left { height: 400px; } .${prefix}-right { padding: 40px; } }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-left">
    <h2 class="${prefix}-title">REAL<br>STORIES</h2>
  </div>
  <div class="${prefix}-right">
    {% for i in (1..4) %}
    <div class="${prefix}-card">
      <div class="${prefix}-stars">★★★★★</div>
      <p class="${prefix}-quote">"This ${niche.name} collection completely changed my workflow. It's fast, beautiful, and hyper-efficient."</p>
      <div class="${prefix}-author">Reviewer {{ i }}</div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style17(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Neon Cyber-Grid (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 100px 5vw; background: #050505; font-family: 'Courier New', Courier, monospace; color: #fff; }
  .${prefix}-title { text-align: center; font-size: 3rem; font-weight: bold; color: ${niche.color1}; text-shadow: 0 0 10px ${niche.color1}; margin-bottom: 80px; text-transform: uppercase; }
  .${prefix}-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px; }
  .${prefix}-card { border: 1px solid ${niche.color1}; background: rgba(0,0,0,0.5); padding: 40px; position: relative; box-shadow: inset 0 0 20px rgba(0,0,0,1); transition: 0.3s; }
  .${prefix}-card::before { content: ''; position: absolute; top: -1px; left: -1px; width: 20px; height: 20px; border-top: 2px solid ${niche.color1}; border-left: 2px solid ${niche.color1}; }
  .${prefix}-card::after { content: ''; position: absolute; bottom: -1px; right: -1px; width: 20px; height: 20px; border-bottom: 2px solid ${niche.color1}; border-right: 2px solid ${niche.color1}; }
  .${prefix}-card:hover { box-shadow: inset 0 0 40px ${niche.color1}44, 0 0 20px ${niche.color1}44; }
  .${prefix}-quote { font-size: 1.2rem; line-height: 1.6; margin-bottom: 30px; }
  .${prefix}-author { color: ${niche.color1}; font-weight: bold; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">SYSTEM_FEEDBACK</h2>
  <div class="${prefix}-grid">
    {% for i in (1..3) %}
    <div class="${prefix}-card">
      <p class="${prefix}-quote">"Integration of the ${niche.name} protocol was seamless. 100% uptime and visual perfection."</p>
      <div class="${prefix}-author">>> USER_00{{ i }} // VERIFIED</div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style18(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Elegant Serif Dark (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 120px 5vw; background: #111; color: #f9f9f9; font-family: 'Playfair Display', serif; text-align: center; }
  .${prefix}-title { font-size: 1rem; text-transform: uppercase; letter-spacing: 5px; color: ${niche.color1}; margin-bottom: 80px; font-family: system-ui; }
  .${prefix}-quote-large { font-size: clamp(2rem, 5vw, 4rem); font-style: italic; line-height: 1.3; max-width: 1000px; margin: 0 auto 60px auto; color: #fff; }
  .${prefix}-author { font-family: system-ui; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
  .${prefix}-role { font-family: system-ui; font-size: 0.9rem; color: #888; margin-top: 5px; }
  .${prefix}-nav { display: flex; justify-content: center; gap: 10px; margin-top: 60px; }
  .${prefix}-dot { width: 10px; height: 10px; border-radius: 50%; background: #333; cursor: pointer; transition: 0.3s; }
  .${prefix}-dot.active { background: ${niche.color1}; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">Client Testimonials</h2>
  <div class="${prefix}-quote-large">"An absolute triumph in ${niche.name} design. The attention to detail is unparalleled in the modern era."</div>
  <div>
    <div class="${prefix}-author">Eleanor Vance</div>
    <div class="${prefix}-role">Creative Director</div>
  </div>
  <div class="${prefix}-nav">
    <div class="${prefix}-dot active"></div>
    <div class="${prefix}-dot"></div>
    <div class="${prefix}-dot"></div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style19(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - TikTok Video Grid (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 80px 5vw; background: #fff; font-family: system-ui; }
  .${prefix}-title { font-size: 2.5rem; font-weight: 900; text-align: center; margin-bottom: 50px; color: #000; text-transform: uppercase; }
  .${prefix}-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
  .${prefix}-video { width: 100%; aspect-ratio: 9/16; background: #000; border-radius: 15px; position: relative; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.1); cursor: pointer; }
  .${prefix}-video img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: 0.3s; }
  .${prefix}-video:hover img { opacity: 1; transform: scale(1.05); }
  .${prefix}-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.3); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.2rem; pointer-events: none; }
  .${prefix}-info { position: absolute; bottom: 20px; left: 20px; right: 20px; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
  .${prefix}-name { font-weight: 800; font-size: 1.1rem; margin-bottom: 5px; }
  .${prefix}-desc { font-size: 0.9rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
<div class="${prefix}-section">
  <h2 class="${prefix}-title">TRENDING IN ${niche.name}</h2>
  <div class="${prefix}-grid">
    {% for i in (1..4) %}
    <div class="${prefix}-video">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081">
      <div class="${prefix}-play">▶</div>
      <div class="${prefix}-info">
        <div class="${prefix}-name">@creator_0{{ i }}</div>
        <div class="${prefix}-desc">I literally cannot live without this ${niche.name} product anymore! 😍✨</div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style20(niche, prefix, schemaName) {
  return `{% comment %} 2050 Testimonial - Abstract Geometry (${niche.name}) {% endcomment %}
<style>
  .${prefix}-section { padding: 150px 5vw; background: #fdfdfd; font-family: system-ui; position: relative; overflow: hidden; min-height: 700px; display: flex; align-items: center; justify-content: center; }
  .${prefix}-shape1 { position: absolute; top: 10%; left: 10%; width: 300px; height: 300px; background: ${niche.color1}22; border-radius: 50%; filter: blur(40px); z-index: 1; }
  .${prefix}-shape2 { position: absolute; bottom: 10%; right: 10%; width: 400px; height: 400px; background: ${niche.color3}55; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); filter: blur(50px); z-index: 1; transform: rotate(15deg); }
  .${prefix}-card { position: relative; z-index: 2; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border-radius: 30px; padding: 80px; max-width: 800px; text-align: center; box-shadow: 0 40px 80px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,1); }
  .${prefix}-quote { font-size: 2.5rem; font-weight: 800; color: #222; margin-bottom: 40px; line-height: 1.3; }
  .${prefix}-author { font-size: 1.2rem; font-weight: 700; color: ${niche.color1}; text-transform: uppercase; letter-spacing: 3px; }
  .${prefix}-stars { font-size: 2rem; color: #000; margin-bottom: 30px; }
</style>
<div class="${prefix}-section">
  <div class="${prefix}-shape1"></div>
  <div class="${prefix}-shape2"></div>
  <div class="${prefix}-card">
    <div class="${prefix}-stars">★★★★★</div>
    <p class="${prefix}-quote">"A sublime mixture of form and function. This ${niche.name} innovation defines the future."</p>
    <div class="${prefix}-author">Geometric Visionary</div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}
