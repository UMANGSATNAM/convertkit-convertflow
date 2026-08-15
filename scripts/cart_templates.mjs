export function style1(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Glassmorphic Slide-Out (${niche.name}) {% endcomment %}
<style>
  .${prefix}-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); z-index: 9998; opacity: 0; pointer-events: none; transition: 0.4s; }
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 450px; height: 100vh; background: rgba(255,255,255,0.6); backdrop-filter: blur(30px); z-index: 9999; transition: right 0.5s cubic-bezier(0.19, 1, 0.22, 1); display: flex; flex-direction: column; box-shadow: -10px 0 40px rgba(0,0,0,0.1); border-left: 1px solid rgba(255,255,255,0.5); font-family: system-ui; }
  .cart-open .${prefix}-overlay { opacity: 1; pointer-events: auto; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 30px; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 1.5rem; font-weight: 800; color: ${niche.color1}; margin: 0; }
  .${prefix}-close { background: none; border: none; font-size: 2rem; cursor: pointer; color: #333; transition: 0.2s; }
  .${prefix}-close:hover { transform: rotate(90deg); color: ${niche.color1}; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 30px; }
  .${prefix}-item { display: flex; gap: 20px; background: rgba(255,255,255,0.8); padding: 15px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: 0.3s; }
  .${prefix}-item:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
  .${prefix}-img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; }
  .${prefix}-details { flex: 1; }
  .${prefix}-name { font-weight: 700; color: #111; margin: 0 0 5px 0; font-size: 1rem; }
  .${prefix}-price { color: ${niche.color1}; font-weight: 800; }
  .${prefix}-footer { padding: 30px; background: rgba(255,255,255,0.9); border-top: 1px solid rgba(0,0,0,0.05); }
  .${prefix}-total { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; margin-bottom: 20px; }
  .${prefix}-checkout { display: block; width: 100%; padding: 20px; background: linear-gradient(135deg, ${niche.color1}, #000); color: #fff; text-align: center; border-radius: 20px; font-size: 1.1rem; font-weight: 700; text-decoration: none; transition: 0.3s; border: none; cursor: pointer; }
  .${prefix}-checkout:hover { transform: translateY(-3px); box-shadow: 0 10px 25px ${niche.color1}66; }
</style>
<div class="${prefix}-overlay" onclick="document.body.classList.remove('cart-open')"></div>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Your Bag</h2>
    <button class="${prefix}-close" onclick="document.body.classList.remove('cart-open')">&times;</button>
  </div>
  <div class="${prefix}-body">
    <!-- Demo Items -->
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div class="${prefix}-details">
        <h4 class="${prefix}-name">${niche.name} Premium Item</h4>
        <div class="${prefix}-price">$99.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <div class="${prefix}-total"><span>Total</span><span>$297.00</span></div>
    <button class="${prefix}-checkout">Secure Checkout</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style2(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Neon Cyberpunk (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 450px; height: 100vh; background: #050505; z-index: 9999; transition: right 0.4s ease-in-out; display: flex; flex-direction: column; border-left: 2px solid ${niche.color1}; box-shadow: -10px 0 50px ${niche.color1}44; font-family: 'Courier New', monospace; color: #fff; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 30px; border-bottom: 1px dashed ${niche.color1}; display: flex; justify-content: space-between; }
  .${prefix}-title { font-size: 1.5rem; color: ${niche.color1}; text-shadow: 0 0 10px ${niche.color1}; margin: 0; text-transform: uppercase; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 30px; }
  .${prefix}-item { border: 1px solid rgba(255,255,255,0.1); padding: 15px; margin-bottom: 20px; background: rgba(255,255,255,0.02); display: flex; gap: 15px; transition: 0.3s; }
  .${prefix}-item:hover { border-color: ${niche.color1}; box-shadow: inset 0 0 20px ${niche.color1}22; }
  .${prefix}-img { width: 70px; height: 70px; filter: grayscale(100%) contrast(150%); border: 1px solid #333; }
  .${prefix}-item:hover .${prefix}-img { filter: none; border-color: ${niche.color1}; }
  .${prefix}-details h4 { margin: 0 0 10px 0; font-size: 0.9rem; letter-spacing: 1px; }
  .${prefix}-footer { padding: 30px; border-top: 1px dashed ${niche.color1}; background: #0a0a0a; }
  .${prefix}-checkout { width: 100%; padding: 20px; background: transparent; color: ${niche.color1}; border: 2px solid ${niche.color1}; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: 0.3s; }
  .${prefix}-checkout:hover { background: ${niche.color1}; color: #000; box-shadow: 0 0 20px ${niche.color1}; }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">SYSTEM_CART</h2>
    <div style="cursor:pointer; color:${niche.color1};" onclick="document.body.classList.remove('cart-open')">[X] CLOSE</div>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div class="${prefix}-details">
        <h4>${niche.name} Module {{ i }}</h4>
        <div style="color:${niche.color1};">99.00 CREDITS</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">INITIATE CHECKOUT</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style3(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Mega Overlay (${niche.name}) {% endcomment %}
<style>
  .${prefix}-overlay { position: fixed; inset: 0; background: ${niche.color3}; z-index: 9999; transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1); font-family: system-ui; display: flex; flex-direction: column; overflow-y: auto; }
  .cart-open .${prefix}-overlay { transform: translateY(0); }
  .${prefix}-header { padding: 40px 5vw; display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: clamp(3rem, 6vw, 6rem); font-weight: 900; color: ${niche.color1}; margin: 0; letter-spacing: -0.03em; }
  .${prefix}-close { font-size: 2rem; border: none; background: none; cursor: pointer; color: #000; }
  .${prefix}-content { padding: 0 5vw 80px 5vw; max-width: 1600px; margin: 0 auto; width: 100%; }
  .${prefix}-item { display: flex; align-items: center; justify-content: space-between; padding: 30px 0; border-bottom: 2px solid rgba(0,0,0,0.1); font-size: 1.5rem; font-weight: 600; }
  .${prefix}-item img { width: 120px; height: 120px; border-radius: 20px; object-fit: cover; }
  .${prefix}-footer { margin-top: 60px; display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 40px; border-radius: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
  .${prefix}-checkout { background: #000; color: #fff; padding: 25px 60px; font-size: 1.5rem; border-radius: 100px; text-decoration: none; transition: 0.3s; }
  .${prefix}-checkout:hover { background: ${niche.color1}; transform: scale(1.05); }
  @media (max-width: 768px) { .${prefix}-item { flex-direction: column; text-align: center; gap: 20px; } .${prefix}-footer { flex-direction: column; gap: 30px; } }
</style>
<div class="${prefix}-overlay">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">CART</h2>
    <button class="${prefix}-close" onclick="document.body.classList.remove('cart-open')">Close &times;</button>
  </div>
  <div class="${prefix}-content">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081">
      <div>${niche.name} Essential</div>
      <div>Qty: 1</div>
      <div>$150.00</div>
    </div>
    {% endfor %}
    <div class="${prefix}-footer">
      <div style="font-size:2rem; font-weight:900;">Total: $450.00</div>
      <a href="/checkout" class="${prefix}-checkout">Checkout Now</a>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style4(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Bento Box (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 20px; right: -100%; width: calc(100% - 40px); max-width: 500px; height: calc(100vh - 40px); background: #f0f0f0; border-radius: 30px; z-index: 9999; transition: right 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; overflow: hidden; font-family: system-ui; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
  .cart-open .${prefix}-drawer { right: 20px; }
  .${prefix}-header { background: #fff; margin: 15px; border-radius: 20px; padding: 25px; display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 1.4rem; font-weight: 800; margin: 0; color: #111; }
  .${prefix}-body { flex: 1; padding: 0 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
  .${prefix}-item { background: #fff; border-radius: 20px; padding: 20px; display: flex; gap: 20px; align-items: center; transition: 0.3s; }
  .${prefix}-item:hover { transform: scale(1.02); }
  .${prefix}-img { width: 90px; height: 90px; border-radius: 15px; object-fit: cover; }
  .${prefix}-details h4 { margin: 0 0 5px 0; font-size: 1.1rem; color: #222; }
  .${prefix}-details p { margin: 0; color: ${niche.color1}; font-weight: bold; }
  .${prefix}-footer { background: #fff; margin: 15px; border-radius: 20px; padding: 25px; }
  .${prefix}-checkout { width: 100%; padding: 20px; background: ${niche.color1}; color: #fff; border: none; border-radius: 15px; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
  .${prefix}-checkout:hover { opacity: 0.9; transform: translateY(-2px); }
  @media (max-width: 600px) { .${prefix}-drawer { top: 0; height: 100vh; border-radius: 0; width: 100%; max-width: none; } .cart-open .${prefix}-drawer { right: 0; } }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Shopping Cart</h2>
    <button style="border:none;background:none;font-size:1.5rem;cursor:pointer;" onclick="document.body.classList.remove('cart-open')">✕</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..4) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div class="${prefix}-details">
        <h4>${niche.name} Bento Item</h4>
        <p>$45.00</p>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Checkout - $180.00</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style5(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Gamified Progress (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 480px; height: 100vh; background: #fff; z-index: 9999; transition: right 0.4s ease; display: flex; flex-direction: column; font-family: system-ui; box-shadow: -5px 0 30px rgba(0,0,0,0.1); }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 40px 30px 20px; background: ${niche.color3}; }
  .${prefix}-progress-wrap { background: rgba(0,0,0,0.1); border-radius: 20px; height: 12px; margin-top: 20px; overflow: hidden; position: relative; }
  .${prefix}-progress-bar { background: linear-gradient(90deg, ${niche.color1}, ${niche.color2}); width: 75%; height: 100%; border-radius: 20px; transition: 1s ease-out; position: relative; }
  .${prefix}-progress-bar::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); animation: ${prefix}-shine 2s infinite; }
  @keyframes ${prefix}-shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px 30px; }
  .${prefix}-item { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eee; }
  .${prefix}-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
  .${prefix}-footer { padding: 30px; box-shadow: 0 -10px 20px rgba(0,0,0,0.02); }
  .${prefix}-btn { display: block; text-align: center; background: #111; color: #fff; padding: 20px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; }
  .${prefix}-btn:hover { background: ${niche.color1}; }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0; font-weight:800; font-size:1.5rem;">Cart</h2>
      <button style="border:none;background:none;font-size:1.5rem;cursor:pointer;" onclick="document.body.classList.remove('cart-open')">✕</button>
    </div>
    <div style="margin-top:20px; font-weight:600; font-size:0.9rem;">You're $25 away from FREE shipping! 🚀</div>
    <div class="${prefix}-progress-wrap"><div class="${prefix}-progress-bar"></div></div>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 5px 0;">${niche.name} Core Product</h4>
        <div style="color:${niche.color1}; font-weight:700;">$75.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <a href="/checkout" class="${prefix}-btn">Checkout - $225.00</a>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style6(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Split Pane (${niche.name}) {% endcomment %}
<style>
  .${prefix}-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9998; opacity: 0; pointer-events: none; transition: 0.4s; }
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 900px; height: 100vh; background: #fff; z-index: 9999; transition: right 0.5s cubic-bezier(0.25, 1, 0.5, 1); display: flex; font-family: system-ui; }
  .cart-open .${prefix}-overlay { opacity: 1; pointer-events: auto; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-left { flex: 1.5; padding: 40px; overflow-y: auto; background: #fdfdfd; }
  .${prefix}-right { flex: 1; padding: 40px; background: ${niche.color3}; display: flex; flex-direction: column; justify-content: space-between; border-left: 1px solid rgba(0,0,0,0.05); }
  .${prefix}-title { font-size: 2rem; font-weight: 800; margin-bottom: 40px; color: #111; }
  .${prefix}-item { display: flex; gap: 20px; margin-bottom: 30px; }
  .${prefix}-img { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; }
  .${prefix}-checkout { background: #000; color: #fff; padding: 25px; text-align: center; border-radius: 0; text-transform: uppercase; font-weight: 800; font-size: 1.1rem; border: none; cursor: pointer; transition: 0.3s; }
  .${prefix}-checkout:hover { background: ${niche.color1}; }
  @media (max-width: 768px) { .${prefix}-drawer { flex-direction: column; max-width: 100%; } .${prefix}-left, .${prefix}-right { flex: none; height: 50vh; } }
</style>
<div class="${prefix}-overlay" onclick="document.body.classList.remove('cart-open')"></div>
<div class="${prefix}-drawer">
  <div class="${prefix}-left">
    <h2 class="${prefix}-title">Shopping Cart</h2>
    {% for i in (1..4) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 10px 0; font-size:1.1rem;">${niche.name} Premium Item</h4>
        <div style="font-weight:700;">$120.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-right">
    <div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom:20px;">
        <h3 style="margin:0;">Summary</h3>
        <button style="border:none;background:none;font-size:1.5rem;cursor:pointer;" onclick="document.body.classList.remove('cart-open')">✕</button>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 10px; font-size:1.1rem;"><span>Subtotal</span><span>$480.00</span></div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 10px; font-size:1.1rem;"><span>Shipping</span><span style="color:${niche.color1};">Free</span></div>
    </div>
    <div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 30px; font-size:1.5rem; font-weight:800;"><span>Total</span><span>$480.00</span></div>
      <button class="${prefix}-checkout" style="width:100%;">Checkout Now</button>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style7(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Minimalist Brutalism (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100vh; background: #fff; z-index: 9999; transition: right 0.3s cubic-bezier(0,0,0,1); display: flex; flex-direction: column; font-family: 'Helvetica Neue', sans-serif; border-left: 4px solid #000; box-shadow: -15px 15px 0 ${niche.color1}; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 30px; border-bottom: 4px solid #000; display: flex; justify-content: space-between; align-items: center; background: ${niche.color3}; }
  .${prefix}-title { font-size: 2.5rem; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -2px; }
  .${prefix}-close { font-size: 2rem; font-weight: 900; border: none; background: none; cursor: pointer; color: #000; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 30px; }
  .${prefix}-item { border-bottom: 4px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
  .${prefix}-item h4 { font-size: 1.2rem; font-weight: 800; text-transform: uppercase; margin: 0 0 10px 0; }
  .${prefix}-price { font-size: 1.5rem; font-weight: 900; color: ${niche.color1}; }
  .${prefix}-footer { padding: 30px; border-top: 4px solid #000; background: ${niche.color3}; }
  .${prefix}-checkout { width: 100%; padding: 20px; background: #000; color: #fff; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; border: none; cursor: pointer; transition: 0.2s; }
  .${prefix}-checkout:hover { background: ${niche.color1}; color: #000; box-shadow: 8px 8px 0 #000; transform: translate(-4px, -4px); }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">CART</h2>
    <button class="${prefix}-close" onclick="document.body.classList.remove('cart-open')">X</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <h4>${niche.name} Brutal Object</h4>
      <div class="${prefix}-price">$ 99.00</div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">BUY NOW</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style8(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Soft Neumorphism (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 450px; height: 100vh; background: #e0e5ec; z-index: 9999; transition: right 0.5s ease; display: flex; flex-direction: column; font-family: system-ui; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 40px; display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 1.8rem; font-weight: 700; color: #333; margin: 0; }
  .${prefix}-btn-neo { width: 50px; height: 50px; border-radius: 50%; border: none; background: #e0e5ec; box-shadow: 9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold; color: #555; transition: 0.2s; }
  .${prefix}-btn-neo:active { box-shadow: inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5); }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px 40px; }
  .${prefix}-item { padding: 20px; border-radius: 20px; background: #e0e5ec; box-shadow: 9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5); margin-bottom: 30px; display: flex; gap: 20px; align-items: center; }
  .${prefix}-img { width: 70px; height: 70px; border-radius: 50%; box-shadow: inset 5px 5px 10px rgba(163,177,198,0.6), inset -5px -5px 10px rgba(255,255,255,0.5); padding: 5px; }
  .${prefix}-footer { padding: 40px; }
  .${prefix}-checkout { width: 100%; padding: 20px; border-radius: 30px; border: none; background: #e0e5ec; box-shadow: 9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5); font-size: 1.2rem; font-weight: 800; color: ${niche.color1}; cursor: pointer; transition: 0.3s; }
  .${prefix}-checkout:active { box-shadow: inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5); }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Soft Bag</h2>
    <button class="${prefix}-btn-neo" onclick="document.body.classList.remove('cart-open')">✕</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 5px 0; color:#444;">${niche.name} Neo Item</h4>
        <div style="font-weight:bold; color:${niche.color1};">$145.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Checkout Now</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style9(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Interactive 3D (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 500px; height: 100vh; background: linear-gradient(135deg, #ffffff, ${niche.color3}); z-index: 9999; transition: right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; flex-direction: column; font-family: system-ui; perspective: 1000px; box-shadow: -20px 0 60px rgba(0,0,0,0.1); }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 40px; display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 2rem; font-weight: 900; color: ${niche.color1}; margin: 0; text-transform: uppercase; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px 40px; transform-style: preserve-3d; }
  .${prefix}-item { display: flex; gap: 20px; align-items: center; background: #fff; padding: 20px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.4s; transform: translateZ(0); }
  .${prefix}-item:hover { transform: translateZ(30px) rotateX(5deg); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
  .${prefix}-img { width: 90px; height: 90px; border-radius: 15px; object-fit: cover; }
  .${prefix}-footer { padding: 40px; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
  .${prefix}-checkout { width: 100%; padding: 25px; background: ${niche.color1}; color: #fff; font-size: 1.2rem; font-weight: 800; border: none; border-radius: 20px; cursor: pointer; transition: 0.3s; transform: translateZ(0); box-shadow: 0 15px 30px ${niche.color1}44; }
  .${prefix}-checkout:hover { transform: translateZ(20px) scale(1.05); }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Your Cart</h2>
    <button style="border:none;background:none;font-size:2rem;cursor:pointer;color:#000;" onclick="document.body.classList.remove('cart-open')">&times;</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..4) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 8px 0; font-size:1.1rem; color:#222;">3D ${niche.name} Object</h4>
        <div style="font-weight:800; color:${niche.color1}; font-size:1.2rem;">$199.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Proceed to Secure Checkout</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style10(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Holographic Floating (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 2vh; right: -100%; width: 96vw; max-width: 420px; height: 96vh; background: rgba(255,255,255,0.85); backdrop-filter: blur(40px); z-index: 9999; transition: right 0.5s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; font-family: system-ui; border-radius: 40px; box-shadow: 0 0 0 1px rgba(255,255,255,0.5), 0 30px 80px rgba(0,0,0,0.15); overflow: hidden; }
  .cart-open .${prefix}-drawer { right: 2vh; }
  .${prefix}-header { padding: 40px; position: relative; overflow: hidden; }
  .${prefix}-header::before { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(120deg, ${niche.color1}44, transparent, ${niche.color3}); z-index: -1; }
  .${prefix}-title { font-size: 2rem; font-weight: 900; margin: 0; color: #111; letter-spacing: -1px; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px 40px; }
  .${prefix}-item { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .${prefix}-name { font-weight: 700; color: #333; font-size: 1.1rem; }
  .${prefix}-footer { padding: 40px; }
  .${prefix}-checkout { width: 100%; padding: 20px; border-radius: 30px; background: linear-gradient(90deg, ${niche.color1}, #000); color: #fff; font-size: 1.2rem; font-weight: 800; border: none; cursor: pointer; transition: 0.3s; }
  .${prefix}-checkout:hover { opacity: 0.8; box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
  @media (max-width: 600px) { .${prefix}-drawer { top:0; right:-100%; width:100%; height:100vh; border-radius:0; } .cart-open .${prefix}-drawer { right:0; } }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 class="${prefix}-title">Holo Cart</h2>
      <button style="border:none;background:none;font-size:2rem;cursor:pointer;color:#000;" onclick="document.body.classList.remove('cart-open')">&times;</button>
    </div>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..5) %}
    <div class="${prefix}-item">
      <div>
        <div class="${prefix}-name">${niche.name} Hologram</div>
        <div style="color:#777; font-size:0.9rem;">Qty: 1</div>
      </div>
      <div style="font-weight:800; font-size:1.2rem; color:${niche.color1};">$49.00</div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Checkout - $245.00</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style11(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Dark Mode Luxury (${niche.name}) {% endcomment %}
<style>
  .${prefix}-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9998; opacity: 0; pointer-events: none; transition: 0.5s ease; backdrop-filter: blur(10px); }
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 480px; height: 100vh; background: #0a0a0a; z-index: 9999; transition: right 0.6s cubic-bezier(0.8, 0, 0.2, 1); display: flex; flex-direction: column; font-family: 'Playfair Display', serif; color: #f5f5f5; border-left: 1px solid rgba(255,255,255,0.1); }
  .cart-open .${prefix}-overlay { opacity: 1; pointer-events: auto; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 1.8rem; font-weight: 400; font-style: italic; color: ${niche.color2}; margin: 0; letter-spacing: 2px; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 40px; }
  .${prefix}-item { display: flex; gap: 25px; align-items: center; padding-bottom: 30px; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .${prefix}-img { width: 80px; height: 100px; object-fit: cover; border-radius: 4px; }
  .${prefix}-details h4 { margin: 0 0 10px 0; font-size: 1.1rem; font-family: 'Helvetica Neue', sans-serif; font-weight: 300; letter-spacing: 1px; }
  .${prefix}-price { color: ${niche.color2}; font-size: 1.2rem; }
  .${prefix}-footer { padding: 40px; background: #050505; }
  .${prefix}-checkout { width: 100%; padding: 25px; background: transparent; color: ${niche.color2}; border: 1px solid ${niche.color2}; font-family: 'Helvetica Neue', sans-serif; text-transform: uppercase; letter-spacing: 3px; font-size: 0.9rem; cursor: pointer; transition: 0.4s; }
  .${prefix}-checkout:hover { background: ${niche.color2}; color: #000; }
</style>
<div class="${prefix}-overlay" onclick="document.body.classList.remove('cart-open')"></div>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Le Panier</h2>
    <button style="border:none;background:none;font-size:1.5rem;cursor:pointer;color:#fff;font-family:sans-serif;" onclick="document.body.classList.remove('cart-open')">✕</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div class="${prefix}-details">
        <h4>${niche.name} Signature</h4>
        <div class="${prefix}-price">$395.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Secure Checkout</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style12(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Floating Action Cart (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; bottom: -100%; right: 20px; width: calc(100% - 40px); max-width: 400px; height: 80vh; background: #fff; z-index: 9999; transition: bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; flex-direction: column; font-family: system-ui; border-radius: 30px 30px 0 0; box-shadow: 0 -20px 60px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); }
  .cart-open .${prefix}-drawer { bottom: 0; }
  .${prefix}-header { padding: 30px; text-align: center; border-bottom: 1px solid #eee; position: relative; }
  .${prefix}-header::before { content: ''; position: absolute; top: 15px; left: 50%; transform: translateX(-50%); width: 40px; height: 5px; background: #ddd; border-radius: 10px; }
  .${prefix}-title { font-size: 1.3rem; font-weight: 800; color: #111; margin: 15px 0 0 0; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px; }
  .${prefix}-item { display: flex; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 20px; margin-bottom: 15px; transition: 0.3s; }
  .${prefix}-item:hover { background: #f0f0f0; transform: scale(1.02); }
  .${prefix}-img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
  .${prefix}-footer { padding: 20px; }
  .${prefix}-checkout { width: 100%; padding: 20px; background: ${niche.color1}; color: #fff; border: none; border-radius: 25px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px ${niche.color1}44; }
  .${prefix}-checkout:hover { transform: translateY(-3px); box-shadow: 0 15px 25px ${niche.color1}66; }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header" onclick="document.body.classList.remove('cart-open')" style="cursor:pointer;">
    <h2 class="${prefix}-title">Your Bag</h2>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..5) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 5px 0; font-size:1rem;">${niche.name} Mini Item</h4>
        <div style="font-weight:700; color:${niche.color1};">$25.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Pay $125.00</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style13(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Card Stack Cart (${niche.name}) {% endcomment %}
<style>
  .${prefix}-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); z-index: 9998; opacity: 0; pointer-events: none; transition: 0.4s; }
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 450px; height: 100vh; background: transparent; z-index: 9999; transition: right 0.6s cubic-bezier(0.2, 1, 0.3, 1); display: flex; flex-direction: column; font-family: system-ui; padding: 40px 20px; }
  .cart-open .${prefix}-overlay { opacity: 1; pointer-events: auto; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { margin-bottom: 40px; display: flex; justify-content: space-between; color: #fff; }
  .${prefix}-body { flex: 1; display: flex; flex-direction: column; gap: -50px; }
  .${prefix}-item { background: #fff; border-radius: 20px; padding: 25px; box-shadow: 0 -10px 30px rgba(0,0,0,0.2); position: relative; margin-bottom: -40px; transition: 0.4s; display: flex; gap: 20px; border-top: 1px solid rgba(255,255,255,0.5); }
  .${prefix}-body:hover .${prefix}-item { margin-bottom: 20px; transform: scale(1); }
  .${prefix}-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
  .${prefix}-footer { margin-top: 80px; }
  .${prefix}-checkout { width: 100%; padding: 25px; background: ${niche.color3}; color: #000; border: none; border-radius: 20px; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: 0.3s; }
  .${prefix}-checkout:hover { background: #fff; transform: translateY(-5px); }
</style>
<div class="${prefix}-overlay" onclick="document.body.classList.remove('cart-open')"></div>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 style="margin:0; font-size:2rem; font-weight:900;">CART</h2>
    <button style="border:none;background:none;font-size:2rem;cursor:pointer;color:#fff;" onclick="document.body.classList.remove('cart-open')">&times;</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..4) %}
    <div class="${prefix}-item" style="z-index: {{ 10 | minus: i }}; background: linear-gradient(135deg, #fff, {% if forloop.last %}${niche.color3}{% else %}#f5f5f5{% endif %});">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 5px 0;">${niche.name} Card</h4>
        <div style="font-weight:800; color:${niche.color1};">$89.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">PAY $356.00</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style14(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Retro Terminal (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 550px; height: 100vh; background: #000; z-index: 9999; transition: right 0.3s steps(10); display: flex; flex-direction: column; font-family: 'Courier New', monospace; color: #0f0; border-left: 2px solid #0f0; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-drawer::before { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 2px, 3px 100%; pointer-events: none; z-index: 10; }
  .${prefix}-header { padding: 30px; border-bottom: 2px solid #0f0; }
  .${prefix}-title { font-size: 1.5rem; font-weight: normal; margin: 0; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 30px; }
  .${prefix}-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed #0f0; }
  .${prefix}-price { float: right; }
  .${prefix}-footer { padding: 30px; border-top: 2px solid #0f0; }
  .${prefix}-checkout { width: 100%; padding: 20px; background: #0f0; color: #000; font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: bold; border: none; cursor: pointer; text-transform: uppercase; }
  .${prefix}-checkout:hover { background: #fff; color: #000; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .cursor { display: inline-block; width: 10px; height: 1.2rem; background: #0f0; animation: blink 1s step-end infinite; vertical-align: middle; }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <div style="float:right; cursor:pointer;" onclick="document.body.classList.remove('cart-open')">[EXIT]</div>
    <h2 class="${prefix}-title">> ROOT/CART<span class="cursor"></span></h2>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..4) %}
    <div class="${prefix}-item">
      <div>> LOADING MODULE {{ i }}... [OK]</div>
      <div style="margin-top:10px;">${niche.name} ASSET_{{ i }} <span class="${prefix}-price">99.99 CRD</span></div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <div style="margin-bottom:20px;">> TOTAL: 399.96 CRD</div>
    <button class="${prefix}-checkout">> EXECUTE_CHECKOUT()</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style15(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Full Bleed Editorial (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; inset: 0; background: ${niche.color3}; z-index: 9999; transform: translateX(100%); transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1); display: flex; font-family: 'Georgia', serif; }
  .cart-open .${prefix}-drawer { transform: translateX(0); }
  .${prefix}-image-pane { flex: 1; background: url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1.png?v=1530129113') center/cover; position: relative; }
  .${prefix}-image-pane::after { content:''; position:absolute; inset:0; background: rgba(0,0,0,0.2); }
  .${prefix}-cart-pane { flex: 1; background: #fff; padding: 60px 80px; display: flex; flex-direction: column; }
  .${prefix}-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
  .${prefix}-title { font-size: 4rem; font-weight: normal; margin: 0; line-height: 1; color: #111; }
  .${prefix}-close { font-size: 2rem; background: none; border: none; cursor: pointer; color: #999; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding-right: 20px; }
  .${prefix}-item { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 1.5rem; color: #333; }
  .${prefix}-footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 40px; }
  .${prefix}-checkout { display: block; width: 100%; text-align: center; padding: 25px; background: #111; color: #fff; font-family: 'Helvetica Neue', sans-serif; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 4px; transition: 0.4s; }
  .${prefix}-checkout:hover { background: ${niche.color1}; }
  @media (max-width: 1024px) { .${prefix}-image-pane { display: none; } .${prefix}-cart-pane { padding: 30px; } .${prefix}-title { font-size: 3rem; } }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-image-pane"></div>
  <div class="${prefix}-cart-pane">
    <div class="${prefix}-header">
      <h2 class="${prefix}-title">The<br>Collection</h2>
      <button class="${prefix}-close" onclick="document.body.classList.remove('cart-open')">✕</button>
    </div>
    <div class="${prefix}-body">
      {% for i in (1..3) %}
      <div class="${prefix}-item">
        <div>
          <div style="margin-bottom:10px;">${niche.name} Edition {{ i }}</div>
          <div style="font-family:sans-serif; font-size:1rem; color:#888;">Variant: Standard</div>
        </div>
        <div>$250</div>
      </div>
      {% endfor %}
    </div>
    <div class="${prefix}-footer">
      <div style="display:flex; justify-content:space-between; font-size:2rem; margin-bottom: 40px;"><span>Total</span><span>$750</span></div>
      <a href="/checkout" class="${prefix}-checkout">Complete Purchase</a>
    </div>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style16(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Dynamic Shape Cart (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 480px; height: 100vh; background: transparent; z-index: 9999; transition: right 0.7s cubic-bezier(0.3, 1, 0.3, 1); display: flex; flex-direction: column; font-family: system-ui; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-bg { position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background: ${niche.color3}; z-index: -1; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; animation: ${prefix}-morph 15s ease-in-out infinite alternate; box-shadow: -20px 0 50px rgba(0,0,0,0.1); }
  @keyframes ${prefix}-morph { 0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; } 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } }
  .${prefix}-content { padding: 40px; display: flex; flex-direction: column; height: 100%; }
  .${prefix}-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
  .${prefix}-title { font-size: 2.2rem; font-weight: 800; color: #111; margin: 0; }
  .${prefix}-body { flex: 1; overflow-y: auto; }
  .${prefix}-item { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); padding: 20px; border-radius: 20px; margin-bottom: 20px; display: flex; gap: 20px; align-items: center; }
  .${prefix}-img { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; }
  .${prefix}-checkout { margin-top: auto; padding: 25px; background: #fff; color: ${niche.color1}; font-size: 1.3rem; font-weight: 900; border: none; border-radius: 40px; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
  .${prefix}-checkout:hover { transform: translateY(-5px); box-shadow: 0 15px 25px rgba(0,0,0,0.1); }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-bg"></div>
  <div class="${prefix}-content">
    <div class="${prefix}-header">
      <h2 class="${prefix}-title">My Bag</h2>
      <button style="border:none;background:none;font-size:2rem;cursor:pointer;" onclick="document.body.classList.remove('cart-open')">&times;</button>
    </div>
    <div class="${prefix}-body">
      {% for i in (1..3) %}
      <div class="${prefix}-item">
        <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
        <div>
          <h4 style="margin:0 0 5px 0;">${niche.name} Morph</h4>
          <div style="font-weight:700;">$55.00</div>
        </div>
      </div>
      {% endfor %}
    </div>
    <button class="${prefix}-checkout">Checkout - $165.00</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style17(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Tickertape Cart (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 450px; height: 100vh; background: #fff; z-index: 9999; transition: right 0.4s ease; display: flex; flex-direction: column; font-family: system-ui; border-left: 1px solid #eee; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 40px; }
  .${prefix}-item { display: flex; gap: 20px; margin-bottom: 30px; }
  .${prefix}-img { width: 100px; height: 100px; border-radius: 0; object-fit: cover; }
  .${prefix}-footer { background: #000; color: #fff; display: flex; flex-direction: column; }
  .${prefix}-ticker-wrap { width: 100%; overflow: hidden; background: ${niche.color1}; padding: 15px 0; }
  .${prefix}-ticker { display: inline-block; white-space: nowrap; animation: ${prefix}-scroll 15s linear infinite; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
  @keyframes ${prefix}-scroll { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
  .${prefix}-checkout { padding: 30px; background: transparent; color: #fff; border: none; font-size: 1.5rem; font-weight: 900; cursor: pointer; text-align: center; transition: 0.3s; }
  .${prefix}-checkout:hover { background: #111; color: ${niche.color1}; }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 style="margin:0; font-size:1.8rem; font-weight:900;">BASKET</h2>
    <button style="border:none;background:none;font-size:1.5rem;cursor:pointer;" onclick="document.body.classList.remove('cart-open')">✕</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 10px 0; font-size:1.1rem;">${niche.name} Product</h4>
        <div style="font-weight:700; color:#666;">$120.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <div class="${prefix}-ticker-wrap">
      <div class="${prefix}-ticker">FREE SHIPPING UNLOCKED • FREE SHIPPING UNLOCKED • FREE SHIPPING UNLOCKED • FREE SHIPPING UNLOCKED • </div>
    </div>
    <button class="${prefix}-checkout">CHECKOUT NOW</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style18(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Frosted Acrylic (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 20px; right: -100%; width: calc(100% - 40px); max-width: 480px; height: calc(100vh - 40px); background: rgba(255,255,255,0.4); backdrop-filter: blur(40px) saturate(150%); border: 2px solid rgba(255,255,255,0.8); border-radius: 40px; z-index: 9999; transition: right 0.5s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
  .cart-open .${prefix}-drawer { right: 20px; }
  .${prefix}-header { padding: 30px 40px; border-bottom: 1px solid rgba(255,255,255,0.5); display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 1.5rem; font-weight: 700; margin: 0; color: #000; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px 40px; }
  .${prefix}-item { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.4); display: flex; gap: 20px; align-items: center; }
  .${prefix}-img { width: 80px; height: 80px; border-radius: 20px; object-fit: cover; background: #fff; padding: 5px; }
  .${prefix}-footer { padding: 30px 40px; background: rgba(255,255,255,0.5); border-radius: 0 0 40px 40px; border-top: 1px solid rgba(255,255,255,0.5); }
  .${prefix}-checkout { width: 100%; padding: 20px; background: #000; color: #fff; border: none; border-radius: 20px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .${prefix}-checkout:hover { transform: scale(1.02); background: ${niche.color1}; }
  @media (max-width: 600px) { .${prefix}-drawer { top: 0; height: 100vh; border-radius: 0; width: 100%; max-width: none; } .cart-open .${prefix}-drawer { right: 0; } }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Cart</h2>
    <button style="background:rgba(255,255,255,0.8); border:none; width:40px; height:40px; border-radius:50%; font-size:1.2rem; cursor:pointer;" onclick="document.body.classList.remove('cart-open')">✕</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div>
        <h4 style="margin:0 0 5px 0; font-weight:600;">${niche.name} Acrylic</h4>
        <div style="color:#555;">$95.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <div style="display:flex; justify-content:space-between; margin-bottom: 20px; font-size:1.2rem; font-weight:700;"><span>Total</span><span>$285.00</span></div>
    <button class="${prefix}-checkout">Checkout</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style19(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Micro-Interaction Cart (${niche.name}) {% endcomment %}
<style>
  .${prefix}-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 450px; height: 100vh; background: #fff; z-index: 9999; transition: right 0.5s ease; display: flex; flex-direction: column; font-family: system-ui; }
  .cart-open .${prefix}-drawer { right: 0; }
  .${prefix}-header { padding: 40px; display: flex; justify-content: space-between; align-items: center; }
  .${prefix}-title { font-size: 1.5rem; font-weight: 800; margin: 0; position: relative; display: inline-block; }
  .${prefix}-title::after { content:''; position:absolute; bottom:-5px; left:0; width:0; height:3px; background:${niche.color1}; transition:0.4s; }
  .${prefix}-drawer:hover .${prefix}-title::after { width:100%; }
  .${prefix}-body { flex: 1; overflow-y: auto; padding: 20px 40px; }
  .${prefix}-item { padding: 15px 0; margin-bottom: 20px; display: flex; gap: 20px; align-items: center; position: relative; overflow: hidden; }
  .${prefix}-item::before { content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:${niche.color1}; transform:scaleY(0); transition:0.3s; transform-origin:bottom; }
  .${prefix}-item:hover::before { transform:scaleY(1); }
  .${prefix}-img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; transition:0.4s; }
  .${prefix}-item:hover .${prefix}-img { transform: scale(1.1) rotate(3deg); }
  .${prefix}-details { flex: 1; padding-left: 10px; }
  .${prefix}-footer { padding: 40px; }
  .${prefix}-checkout { position: relative; width: 100%; padding: 20px; background: #f5f5f5; color: #111; font-weight: 800; border: none; border-radius: 12px; cursor: pointer; overflow: hidden; z-index: 1; transition:0.3s; }
  .${prefix}-checkout::before { content:''; position:absolute; top:0; left:0; width:0; height:100%; background:${niche.color1}; z-index:-1; transition:0.4s; }
  .${prefix}-checkout:hover::before { width:100%; }
  .${prefix}-checkout:hover { color:#fff; }
</style>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <h2 class="${prefix}-title">Cart</h2>
    <button style="border:none;background:none;font-size:1.5rem;cursor:pointer;transition:0.3s;" onclick="document.body.classList.remove('cart-open')" onmouseover="this.style.transform='rotate(90deg)'" onmouseout="this.style.transform='rotate(0deg)'">✕</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image.png?v=1530129081" class="${prefix}-img">
      <div class="${prefix}-details">
        <h4 style="margin:0 0 5px 0;">${niche.name} Interactive</h4>
        <div style="font-weight:700;">$60.00</div>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Checkout</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}

export function style20(niche, prefix, schemaName) {
  return `{% comment %} 2050 Cart - Zero UI (${niche.name}) {% endcomment %}
<style>
  .${prefix}-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.95); z-index: 9998; opacity: 0; pointer-events: none; transition: 0.5s; backdrop-filter: blur(20px); }
  .${prefix}-drawer { position: fixed; top: 0; right: 0; width: 100%; max-width: 600px; height: 100vh; z-index: 9999; display: flex; flex-direction: column; font-family: system-ui; padding: 60px; pointer-events: none; opacity: 0; transform: translateX(50px); transition: 0.5s cubic-bezier(0.1, 0.9, 0.2, 1); }
  .cart-open .${prefix}-overlay { opacity: 1; pointer-events: auto; }
  .cart-open .${prefix}-drawer { opacity: 1; transform: translateX(0); pointer-events: auto; }
  .${prefix}-header { display: flex; justify-content: flex-end; margin-bottom: 60px; }
  .${prefix}-close { font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border: none; background: none; cursor: pointer; color: #111; }
  .${prefix}-close:hover { color: ${niche.color1}; }
  .${prefix}-body { flex: 1; overflow-y: auto; }
  .${prefix}-item { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; font-size: 1.5rem; font-weight: 300; }
  .${prefix}-name { font-weight: 800; font-size: 2rem; color: #000; letter-spacing: -1px; }
  .${prefix}-price { color: ${niche.color1}; font-weight: 600; }
  .${prefix}-footer { margin-top: 40px; }
  .${prefix}-checkout { display: inline-block; padding: 0; background: none; color: #000; font-size: 3rem; font-weight: 900; border: none; cursor: pointer; text-decoration: underline; text-decoration-color: ${niche.color1}; text-decoration-thickness: 4px; transition: 0.3s; }
  .${prefix}-checkout:hover { color: ${niche.color1}; }
  @media (max-width: 768px) { .${prefix}-drawer { padding: 30px; } .${prefix}-name { font-size: 1.5rem; } .${prefix}-checkout { font-size: 2rem; } }
</style>
<div class="${prefix}-overlay" onclick="document.body.classList.remove('cart-open')"></div>
<div class="${prefix}-drawer">
  <div class="${prefix}-header">
    <button class="${prefix}-close" onclick="document.body.classList.remove('cart-open')">Close</button>
  </div>
  <div class="${prefix}-body">
    {% for i in (1..3) %}
    <div class="${prefix}-item">
      <div>
        <div class="${prefix}-name">${niche.name} Zero</div>
        <div style="font-size:1rem; color:#888;">Qty 1</div>
      </div>
      <div class="${prefix}-price">$ 120</div>
    </div>
    {% endfor %}
  </div>
  <div class="${prefix}-footer">
    <button class="${prefix}-checkout">Pay $360</button>
  </div>
</div>
{% schema %}
{ "name": "${schemaName}", "settings": [], "presets": [{"name": "${schemaName}"}] }
{% endschema %}`;
}
