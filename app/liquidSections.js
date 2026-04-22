export const LIQUID_SECTIONS = {
  "cf-ayurveda-wellness-cart": `{% comment %}ConvertFlow: Ayurva Wellness — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #2E4B35; --cf-bg: #F5FCF5; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Ayurva Wellness Cart",
  "settings": [],
  "presets": [{ "name": "CF Ayurva Wellness Cart" }]
}
{% endschema %}`,
  "cf-ayurveda-wellness-collection": `{% comment %}ConvertFlow: Ayurva Wellness — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #2E4B35; --cf-bg: #F5FCF5; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF Ayurva Wellness Collection",
  "settings": [],
  "presets": [{ "name": "CF Ayurva Wellness Collection" }]
}
{% endschema %}`,
  "cf-ayurveda-wellness-landing": `{% comment %}ConvertFlow: Ayurva Wellness — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--saffron:#E07B2A;--forest:#2E4B35;--cream:#FBF6EF;--gold:#C9A84C;--text:#2A2018;--muted:#7A6A58;--border:#E8DDD0;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--cream);color:var(--text);font-family:'Hind',sans-serif;font-size:16px;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-family:'Yatra One',cursive;font-weight:400;}

/* HEADER */
.announce{background:var(--forest);color:#fff;text-align:center;padding:10px;font-size:12px;letter-spacing:2px;}
header{background:var(--cream);padding:20px 60px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--border);}
.brand{font-family:'Yatra One',cursive;font-size:32px;color:var(--forest);text-decoration:none;display:flex;align-items:center;gap:10px;}
.brand-sub{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);font-family:'Hind',sans-serif;font-weight:500;}
nav ul{display:flex;gap:32px;list-style:none;}
nav a{font-size:14px;font-weight:500;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--saffron);}
.hdr-cta{background:var(--forest);color:#fff;padding:12px 28px;font-size:12px;font-weight:600;letter-spacing:1px;text-decoration:none;transition:background .2s;}
.hdr-cta:hover{background:var(--saffron);}

/* HERO — mandala decorative */
.hero{min-height:90vh;background:linear-gradient(135deg,#FDF8F0 0%,#F5EDE0 100%);display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 60px;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;right:-100px;top:50%;transform:translateY(-50%);width:700px;height:700px;border-radius:50%;border:1px solid rgba(201,168,76,.15);pointer-events:none;}
.hero::after{content:'';position:absolute;right:-130px;top:50%;transform:translateY(-50%);width:800px;height:800px;border-radius:50%;border:1px solid rgba(201,168,76,.08);pointer-events:none;}
.hero-text .label{font-size:12px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--saffron);margin-bottom:20px;display:block;}
.hero-text h1{font-size:72px;line-height:1.05;color:var(--forest);margin-bottom:24px;}
.hero-text p{font-size:17px;color:var(--muted);line-height:1.9;max-width:440px;margin-bottom:40px;}
.hero-btns{display:flex;gap:16px;}
.btn-forest{background:var(--forest);color:#fff;padding:16px 40px;font-family:'Hind',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;text-decoration:none;transition:background .2s;display:inline-block;}
.btn-forest:hover{background:var(--saffron);}
.btn-gold{background:transparent;border:1.5px solid var(--gold);color:var(--gold);padding:15px 40px;font-family:'Hind',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;text-decoration:none;transition:all .2s;display:inline-block;}
.btn-gold:hover{background:var(--gold);color:#fff;}
.hero-img{display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
.mandala-ring{position:absolute;width:500px;height:500px;border-radius:50%;border:1px dashed rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;}
.hero-img-content{width:60%;aspect-ratio:1;background:radial-gradient(circle,rgba(201,168,76,.15),transparent 70%);border-radius:50%;display:flex;align-items:center;justify-content:center;}
.hero-img svg{width:50%;color:var(--forest);opacity:.3;}

/* BENEFITS */
.benefits{display:grid;grid-template-columns:repeat(4,1fr);border-top:2px solid var(--border);border-bottom:2px solid var(--border);}
.benefit{padding:40px 32px;text-align:center;border-right:1px solid var(--border);}
.benefit:last-child{border-right:none;}
.b-icon{width:52px;height:52px;border-radius:50%;background:rgba(46,75,53,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:var(--forest);}
.b-icon svg{width:26px;stroke-width:1.5;}
.b-title{font-family:'Yatra One',cursive;font-size:18px;color:var(--forest);margin-bottom:8px;}
.b-text{font-size:13px;color:var(--muted);line-height:1.7;}

/* PRODUCTS */
.shop{padding:100px 60px;max-width:1400px;margin:0 auto;}
.sec-label{text-align:center;margin-bottom:60px;}
.sec-label span{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--saffron);display:block;margin-bottom:12px;}
.sec-label h2{font-size:48px;color:var(--forest);}
.sec-label p{font-size:16px;color:var(--muted);max-width:500px;margin:12px auto 0;}

.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;}
.prod-card{background:#fff;border:1px solid var(--border);overflow:hidden;transition:all .3s;}
.prod-card:hover{box-shadow:0 12px 40px rgba(46,75,53,.08);transform:translateY(-4px);}
.pc-img{aspect-ratio:1;background:linear-gradient(135deg,#FDF8F0,#F0E8D8);display:flex;align-items:center;justify-content:center;position:relative;}
.pc-img svg{width:40%;color:var(--forest);opacity:.4;transition:opacity .3s;}
.prod-card:hover .pc-img svg{opacity:.7;}
.pc-badge-forest{position:absolute;top:14px;right:14px;background:var(--forest);color:#fff;padding:4px 12px;font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;}
.pc-body{padding:20px;}
.pc-concern{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--saffron);margin-bottom:6px;}
.pc-name{font-family:'Yatra One',cursive;font-size:20px;color:var(--forest);margin-bottom:8px;line-height:1.2;}
.pc-ing{font-size:12px;color:var(--muted);font-style:italic;margin-bottom:16px;}
.pc-qty{font-size:11px;color:var(--muted);margin-bottom:14px;}
.pc-foot{display:flex;justify-content:space-between;align-items:center;}
.pc-price-wrap strong{font-size:20px;font-weight:700;color:var(--forest);}
.pc-price-wrap small{font-size:12px;color:var(--muted);text-decoration:line-through;margin-left:6px;}
.btn-add-forest{background:var(--forest);color:#fff;border:none;padding:10px 20px;font-family:'Hind',sans-serif;font-size:12px;font-weight:600;letter-spacing:.5px;cursor:pointer;transition:background .2s;}
.btn-add-forest:hover{background:var(--saffron);}

/* INGREDIENTS */
.ingredients{padding:100px 60px;background:var(--forest);text-align:center;}
.ing-title{font-size:48px;color:#fff;margin-bottom:16px;}
.ing-sub{font-size:15px;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 60px;}
.ing-grid{display:flex;gap:40px;justify-content:center;flex-wrap:wrap;max-width:1000px;margin:0 auto;}
.ing-item{display:flex;flex-direction:column;align-items:center;gap:14px;}
.ing-circle{width:100px;height:100px;border-radius:50%;border:1.5px solid rgba(201,168,76,.4);display:flex;align-items:center;justify-content:center;position:relative;}
.ing-circle::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:1px dashed rgba(201,168,76,.2);}
.ing-circle svg{width:40%;color:var(--gold);stroke-width:1;}
.ing-name{font-family:'Yatra One',cursive;font-size:16px;color:#fff;}
.ing-bene{font-size:11px;color:rgba(255,255,255,.4);text-align:center;max-width:80px;line-height:1.5;}

/* FOOTER */
footer{background:#1E2E21;padding:80px 60px 40px;}
.f-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.1);}
.fb-brand{font-family:'Yatra One',cursive;font-size:28px;color:var(--gold);margin-bottom:16px;}
.fb-text{font-size:13px;color:rgba(255,255,255,.35);line-height:1.9;max-width:280px;}
.f-col h4{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:20px;}
.f-col ul{list-style:none;}
.f-col li{margin-bottom:10px;}
.f-col a{color:rgba(255,255,255,.4);text-decoration:none;font-size:14px;transition:color .2s;}
.f-col a:hover{color:var(--gold);}
.f-bottom{display:flex;justify-content:space-between;padding-top:28px;font-size:11px;color:rgba(255,255,255,.2);letter-spacing:1px;}

@media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto;padding:80px 40px}.hero-img{display:none}.prod-grid{grid-template-columns:repeat(2,1fr)}.benefits{grid-template-columns:1fr 1fr}.f-grid{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}nav{display:none}.shop{padding:60px 20px}.ingredients{padding:60px 20px}.f-grid{grid-template-columns:1fr}footer{padding:60px 20px 30px}}
</style>
<div class="announce">Ancient Wisdom. Modern Science. Free consultation with every order above ₹999.</div>
<header>
  <a href="#" class="brand">
    AYURVA
    <span class="brand-sub">Pure Ayurveda</span>
  </a>
  <nav><ul>
    <li><a href="#">Skincare</a></li>
    <li><a href="#">Hair Care</a></li>
    <li><a href="#">Wellness</a></li>
    <li><a href="#">Nutrition</a></li>
    <li><a href="#">Consult</a></li>
  </ul></nav>
  <a href="#" class="hdr-cta">Shop Now</a>
</header>

<section class="hero">
  <div class="hero-text">
    <span class="label">5000 Years of Healing Wisdom</span>
    <h1>Heal from the Root</h1>
    <p>Formulated with authentic Ayurvedic herbs, cold-pressed oils, and sustainably sourced botanicals. Every product is Ayush-certified and DCCL-approved.</p>
    <div class="hero-btns">
      <a href="#" class="btn-forest">Explore Products</a>
      <a href="#" class="btn-gold">Free Quiz: Find Your Dosha</a>
    </div>
  </div>
  <div class="hero-img">
    <div class="mandala-ring">
      <div class="hero-img-content">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>
      </div>
    </div>
  </div>
</section>

<div class="benefits">
  <div class="benefit"><div class="b-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><div class="b-title">Ayush Certified</div><div class="b-text">Government-licensed AYUSH formulations</div></div>
  <div class="benefit"><div class="b-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></div><div class="b-title">100% Natural</div><div class="b-text">No parabens, sulphates or mineral oils</div></div>
  <div class="benefit"><div class="b-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div><div class="b-title">Cruelty Free</div><div class="b-text">Vegan & never tested on animals</div></div>
  <div class="benefit"><div class="b-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div class="b-title">Seen Results in 21 Days</div><div class="b-text">Clinically tested with measurable outcomes</div></div>
</div>

<section class="shop">
  <div class="sec-label">
    <span>Bestsellers</span>
    <h2>Most Loved Formulas</h2>
    <p>Trusted by over 2 lakh customers across India for daily wellness rituals.</p>
  </div>
  <div class="prod-grid">
    <div class="prod-card">
      <div class="pc-img"><span class="pc-badge-forest">Top Seller</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></div>
      <div class="pc-body"><div class="pc-concern">Hair Care</div><div class="pc-name">Brahmi Bhringraj Hair Oil</div><div class="pc-ing">Brahmi · Bhringraj · Coconut · Neem</div><div class="pc-qty">200ml | 60-day supply</div><div class="pc-foot"><div class="pc-price-wrap"><strong>₹599</strong><small>₹799</small></div><button class="btn-add-forest">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:linear-gradient(135deg,#EEF3EC,#DDE8D9);"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
      <div class="pc-body"><div class="pc-concern">Skincare</div><div class="pc-name">Kumkumadi Face Oil</div><div class="pc-ing">Kumkumadi · Saffron · Sandalwood</div><div class="pc-qty">15ml | 45-day supply</div><div class="pc-foot"><div class="pc-price-wrap"><strong>₹899</strong></div><button class="btn-add-forest">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:linear-gradient(135deg,#F5F0E8,#EDE5D5);"><span class="pc-badge-forest">New</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
      <div class="pc-body"><div class="pc-concern">Wellness</div><div class="pc-name">Ashwagandha Shilajit Gummies</div><div class="pc-ing">Ashwagandha KSM-66 · Pure Shilajit</div><div class="pc-qty">60 gummies | 30-day supply</div><div class="pc-foot"><div class="pc-price-wrap"><strong>₹799</strong><small>₹999</small></div><button class="btn-add-forest">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:linear-gradient(135deg,#F8F2E8,#EEE0C8);"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
      <div class="pc-body"><div class="pc-concern">Body Care</div><div class="pc-name">Nalpamaradi Ubtan Scrub</div><div class="pc-ing">Turmeric · Neem · Chickpea · Rose</div><div class="pc-qty">150g | 45-day supply</div><div class="pc-foot"><div class="pc-price-wrap"><strong>₹449</strong></div><button class="btn-add-forest">Add to Cart</button></div></div>
    </div>
  </div>
</section>

<div class="ingredients">
  <h2 class="ing-title">Sacred Botanicals</h2>
  <p class="ing-sub">We source our herbs directly from Himalayan farms and Kerala spice estates — traceable and certified.</p>
  <div class="ing-grid">
    <div class="ing-item"><div class="ing-circle"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3"/></svg></div><div class="ing-name">Brahmi</div><div class="ing-bene">Memory & Clarity</div></div>
    <div class="ing-item"><div class="ing-circle"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/></svg></div><div class="ing-name">Ashwagandha</div><div class="ing-bene">Stress Relief</div></div>
    <div class="ing-item"><div class="ing-circle"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div><div class="ing-name">Saffron</div><div class="ing-bene">Radiance & Glow</div></div>
    <div class="ing-item"><div class="ing-circle"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="ing-name">Turmeric</div><div class="ing-bene">Anti-Inflammatory</div></div>
    <div class="ing-item"><div class="ing-circle"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M11 20A7 7 0 014.07 7.96l8.04-8.04A7 7 0 0120 12H11V20z"/></svg></div><div class="ing-name">Neem</div><div class="ing-bene">Purifying Detox</div></div>
  </div>
</div>

<footer>
  <div class="f-grid">
    <div><div class="fb-brand">AYURVA</div><p class="fb-text">Bridging 5000 years of Ayurvedic wisdom with modern formulation science. Certified, tested, and loved.</p></div>
    <div class="f-col"><h4>Products</h4><ul><li><a href="#">Skincare</a></li><li><a href="#">Hair Care</a></li><li><a href="#">Wellness</a></li><li><a href="#">Nutrition</a></li></ul></div>
    <div class="f-col"><h4>Know More</h4><ul><li><a href="#">Dosha Quiz</a></li><li><a href="#">Ingredient Glossary</a></li><li><a href="#">Blog</a></li><li><a href="#">Consult Vaidya</a></li></ul></div>
    <div class="f-col"><h4>Support</h4><ul><li><a href="#">FAQ</a></li><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="f-bottom"><span>© 2025 Ayurva Wellness Pvt. Ltd. | FSSAI Lic.</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF Ayurva Wellness Landing",
  "settings": [],
  "presets": [{ "name": "CF Ayurva Wellness Landing" }]
}
{% endschema %}`,
  "cf-ayurveda-wellness-product": `{% comment %}ConvertFlow: Ayurva Wellness — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #2E4B35;
  --cf-bg: #F5FCF5;
  --cf-font: 'Hind', sans-serif;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Ayurva Wellness Product",
  "settings": [],
  "presets": [{ "name": "CF Ayurva Wellness Product" }]
}
{% endschema %}`,
  "cf-caratlane-cart": `{% comment %}
  ConvertFlow — CaratLane Cart Page
  Luxury 2-column cart layout with order summary, promo codes, trust badges.
  Fully responsive — mobile stacks beautifully with sticky checkout.
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  :root {
    --cf-primary: {{ section.settings.color_primary }};
    --cf-accent: {{ section.settings.color_accent }};
    --cf-bg: {{ section.settings.color_bg }};
    --cf-text: {{ section.settings.color_text }};
    --cf-text-light: #666666;
    --cf-border-radius: {{ section.settings.border_radius }}px;
    --cf-font-heading: 'Playfair Display', serif;
    --cf-font-body: 'Inter', sans-serif;
    --cf-success: #16a34a;
    --cf-danger: #dc2626;
  }

  .cf-cart * { box-sizing: border-box; margin: 0; padding: 0; }
  .cf-cart {
    font-family: var(--cf-font-body);
    color: var(--cf-text);
    background: var(--cf-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    padding: clamp(20px, 4vw, 40px);
    max-width: 1440px;
    margin: 0 auto;
    min-height: 70vh;
  }
  .cf-cart a { text-decoration: none; color: inherit; }
  .cf-cart h1, .cf-cart h2, .cf-cart h3 {
    font-family: var(--cf-font-heading);
    color: var(--cf-primary);
  }

  /* ── Top Header ── */
  .cf-cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(238,238,238,0.6);
  }
  .cf-cart-title {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
  }
  .cf-cart-count {
    font-size: 14px;
    color: var(--cf-text-light);
    font-weight: 500;
  }
  .cf-cart-continue {
    font-size: 14px;
    font-weight: 600;
    color: var(--cf-primary);
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .cf-cart-continue:hover { opacity: 0.8; }
  .cf-cart-continue svg { width: 16px; height: 16px; }

  /* ── Cart Layout ── */
  .cf-cart-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: clamp(30px, 5vw, 60px);
    align-items: start;
  }

  /* ── Cart Items ── */
  .cf-cart-items { display: flex; flex-direction: column; gap: 0; }
  .cf-cart-item {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    align-items: center;
    padding: 28px 0;
    border-bottom: 1px solid rgba(238,238,238,0.5);
    transition: background 0.3s ease;
  }
  .cf-cart-item:first-child { padding-top: 0; }
  .cf-cart-item:hover { background: rgba(246, 239, 251, 0.3); margin: 0 -16px; padding-left: 16px; padding-right: 16px; border-radius: 12px; }

  /* Item Image */
  .cf-cart-item-img {
    width: 120px;
    height: 120px;
    border-radius: calc(var(--cf-border-radius) - 2px);
    overflow: hidden;
    background: #fafafa;
    border: 1px solid rgba(238,238,238,0.8);
    flex-shrink: 0;
  }
  .cf-cart-item-img img { width: 100%; height: 100%; object-fit: contain; }

  /* Item Details */
  .cf-cart-item-info { display: flex; flex-direction: column; gap: 6px; }
  .cf-cart-item-brand { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--cf-text-light); font-weight: 600; }
  .cf-cart-item-name { font-size: 16px; font-weight: 600; color: var(--cf-text); line-height: 1.3; }
  .cf-cart-item-variant { font-size: 13px; color: var(--cf-text-light); }
  .cf-cart-item-meta { display: flex; align-items: center; gap: 16px; margin-top: 4px; }

  /* Quantity Control */
  .cf-cart-qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(238,238,238,0.9);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .cf-cart-qty button {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    color: var(--cf-text);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--cf-font-body);
  }
  .cf-cart-qty button:hover { background: var(--cf-primary); color: #fff; }
  .cf-cart-qty span {
    width: 36px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: var(--cf-text);
  }

  /* Remove */
  .cf-cart-remove {
    background: none; border: none;
    font-size: 12px; font-weight: 600; color: var(--cf-danger);
    cursor: pointer; transition: opacity 0.2s;
    display: flex; align-items: center; gap: 4px;
  }
  .cf-cart-remove:hover { opacity: 0.7; }
  .cf-cart-remove svg { width: 14px; height: 14px; }

  /* Item Price Column */
  .cf-cart-item-prices { text-align: right; display: flex; flex-direction: column; gap: 4px; }
  .cf-cart-item-price { font-size: 18px; font-weight: 700; color: var(--cf-primary); }
  .cf-cart-item-original { font-size: 13px; color: var(--cf-text-light); text-decoration: line-through; }
  .cf-cart-item-save { font-size: 12px; color: var(--cf-success); font-weight: 600; }

  /* ── Order Summary ── */
  .cf-cart-summary {
    background: #fafafa;
    border-radius: var(--cf-border-radius);
    padding: 32px;
    border: 1px solid rgba(238,238,238,0.8);
    position: sticky;
    top: 20px;
  }
  .cf-cart-summary-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 24px;
  }

  /* Coupon Input */
  .cf-cart-coupon {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }
  .cf-cart-coupon input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid rgba(238,238,238,0.9);
    border-radius: 10px;
    font-family: var(--cf-font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    background: #fff;
  }
  .cf-cart-coupon input:focus { border-color: var(--cf-primary); }
  .cf-cart-coupon input::placeholder { color: #bbb; }
  .cf-cart-coupon button {
    padding: 12px 20px;
    border: none;
    background: var(--cf-primary);
    color: #fff;
    font-family: var(--cf-font-body);
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
  }
  .cf-cart-coupon button:hover { background: #3a2750; transform: translateY(-1px); }

  /* Summary Lines */
  .cf-cart-summary-lines { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(238,238,238,0.7); }
  .cf-cart-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--cf-text-light);
  }
  .cf-cart-summary-row.discount { color: var(--cf-success); font-weight: 600; }
  .cf-cart-summary-row.total {
    font-size: 20px;
    font-weight: 700;
    color: var(--cf-text);
    padding-top: 16px;
    border-top: 2px solid rgba(238,238,238,0.8);
    margin-top: 4px;
  }
  .cf-cart-summary-row.saved {
    font-size: 13px;
    color: var(--cf-success);
    font-weight: 600;
    background: rgba(22, 163, 74, 0.06);
    padding: 8px 12px;
    border-radius: 8px;
    margin-top: -4px;
  }

  /* Checkout Button */
  .cf-cart-checkout-btn {
    width: 100%;
    padding: 18px;
    background: var(--cf-accent);
    color: #fff;
    border: none;
    border-radius: 40px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    font-family: var(--cf-font-body);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 15px rgba(222, 187, 67, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .cf-cart-checkout-btn:hover {
    background: #cca72c;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(222, 187, 67, 0.4);
  }
  .cf-cart-checkout-btn svg { width: 20px; height: 20px; }

  /* Payment Icons */
  .cf-cart-payments {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .cf-cart-payment-label { font-size: 11px; color: var(--cf-text-light); font-weight: 500; width: 100%; text-align: center; }
  .cf-cart-payment-icon {
    width: 44px; height: 28px;
    border-radius: 4px;
    border: 1px solid rgba(238,238,238,0.8);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; color: var(--cf-text-light);
    letter-spacing: 0.3px;
  }

  /* Trust in Summary */
  .cf-cart-summary-trust {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid rgba(238,238,238,0.7);
  }
  .cf-cart-summary-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--cf-text-light);
  }
  .cf-cart-summary-trust-item svg { width: 18px; height: 18px; color: var(--cf-success); flex-shrink: 0; }

  /* ── Empty Cart ── */
  .cf-cart-empty {
    text-align: center;
    padding: 80px 20px;
    grid-column: 1 / -1;
  }
  .cf-cart-empty svg { width: 64px; height: 64px; color: var(--cf-text-light); opacity: 0.3; margin-bottom: 24px; }
  .cf-cart-empty h2 { font-size: 28px; margin-bottom: 12px; }
  .cf-cart-empty p { font-size: 16px; color: var(--cf-text-light); margin-bottom: 30px; }
  .cf-cart-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 40px;
    background: var(--cf-primary);
    color: #fff;
    border: none;
    border-radius: 40px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--cf-font-body);
    transition: all 0.3s;
  }
  .cf-cart-empty-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(73, 49, 97, 0.25); }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .cf-cart-layout { grid-template-columns: 1fr 360px; gap: 30px; }
  }
  @media (max-width: 900px) {
    .cf-cart-layout { grid-template-columns: 1fr; gap: 30px; }
    .cf-cart-summary { position: static; }
    .cf-cart-item { grid-template-columns: 100px 1fr auto; gap: 16px; }
    .cf-cart-item-img { width: 100px; height: 100px; }
  }
  @media (max-width: 600px) {
    .cf-cart { padding: 16px; }
    .cf-cart-header { flex-direction: column; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
    .cf-cart-item { grid-template-columns: 80px 1fr; gap: 12px; padding: 20px 0; }
    .cf-cart-item-img { width: 80px; height: 80px; }
    .cf-cart-item-prices { grid-column: 1 / -1; text-align: left; flex-direction: row; align-items: center; gap: 12px; }
    .cf-cart-item-name { font-size: 14px; }
    .cf-cart-item-price { font-size: 16px; }
    .cf-cart-summary { padding: 20px; border-radius: 16px; }
    .cf-cart-summary-title { font-size: 18px; margin-bottom: 16px; }
    .cf-cart-coupon { flex-direction: column; }
    .cf-cart-coupon button { width: 100%; }
    /* Sticky mobile checkout */
    .cf-cart-sticky-mobile {
      position: fixed; bottom: 0; left: 0; width: 100%;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(12px);
      padding: 14px 16px;
      box-shadow: 0 -4px 30px rgba(0,0,0,0.12);
      z-index: 1000;
      border-top: 1px solid rgba(0,0,0,0.05);
      border-radius: 16px 16px 0 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .cf-cart-sticky-total { font-size: 18px; font-weight: 700; color: var(--cf-primary); white-space: nowrap; }
    .cf-cart-sticky-btn {
      flex: 1;
      padding: 14px;
      background: var(--cf-accent);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      font-family: var(--cf-font-body);
      transition: all 0.3s;
    }
    .cf-cart-sticky-btn:hover { background: #cca72c; }
    .cf-cart { padding-bottom: 100px; }
  }
  @media (min-width: 601px) {
    .cf-cart-sticky-mobile { display: none; }
  }
{% endstyle %}

<div class="cf-cart">

  <!-- Cart Header -->
  <div class="cf-cart-header">
    <div>
      <h1 class="cf-cart-title">{{ section.settings.cart_title }}</h1>
      <span class="cf-cart-count">{{ cart.item_count | default: 3 }} items in your bag</span>
    </div>
    <a href="/collections/all" class="cf-cart-continue">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      Continue Shopping
    </a>
  </div>

  <div class="cf-cart-layout">

    <!-- CART ITEMS -->
    <div class="cf-cart-items">
      {% for item in cart.items %}
        <div class="cf-cart-item">
          <div class="cf-cart-item-img">
            <img src="{{ item.image | img_url: '200x' }}" alt="{{ item.product.title }}">
          </div>
          <div class="cf-cart-item-info">
            <span class="cf-cart-item-brand">{{ item.product.vendor | default: 'CaratLane' }}</span>
            <a href="{{ item.url }}" class="cf-cart-item-name">{{ item.product.title }}</a>
            {% if item.variant.title != 'Default Title' %}
            <span class="cf-cart-item-variant">{{ item.variant.title }}</span>
            {% endif %}
            <div class="cf-cart-item-meta">
              <div class="cf-cart-qty">
                <button onclick="window.location.href='/cart/change?id={{ item.key }}&quantity={{ item.quantity | minus: 1 }}'">−</button>
                <span>{{ item.quantity }}</span>
                <button onclick="window.location.href='/cart/change?id={{ item.key }}&quantity={{ item.quantity | plus: 1 }}'">+</button>
              </div>
              <button class="cf-cart-remove" onclick="window.location.href='/cart/change?id={{ item.key }}&quantity=0'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Remove
              </button>
            </div>
          </div>
          <div class="cf-cart-item-prices">
            <span class="cf-cart-item-price">{{ item.final_line_price | money }}</span>
            {% if item.original_line_price > item.final_line_price %}
              <span class="cf-cart-item-original">{{ item.original_line_price | money }}</span>
              <span class="cf-cart-item-save">You save {{ item.original_line_price | minus: item.final_line_price | money }}</span>
            {% endif %}
          </div>
        </div>
      {% else %}
        <!-- Fallback Preview Items -->
        <div class="cf-cart-item">
          <div class="cf-cart-item-img">
            <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1.png" alt="Sample">
          </div>
          <div class="cf-cart-item-info">
            <span class="cf-cart-item-brand">CaratLane</span>
            <span class="cf-cart-item-name">Sparkling Daisy Diamond Stud Earrings</span>
            <span class="cf-cart-item-variant">18K Rose Gold</span>
            <div class="cf-cart-item-meta">
              <div class="cf-cart-qty"><button>−</button><span>1</span><button>+</button></div>
              <button class="cf-cart-remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Remove</button>
            </div>
          </div>
          <div class="cf-cart-item-prices">
            <span class="cf-cart-item-price">₹14,999</span>
            <span class="cf-cart-item-original">₹19,999</span>
            <span class="cf-cart-item-save">You save ₹5,000</span>
          </div>
        </div>
        <div class="cf-cart-item">
          <div class="cf-cart-item-img">
            <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2.png" alt="Sample">
          </div>
          <div class="cf-cart-item-info">
            <span class="cf-cart-item-brand">CaratLane</span>
            <span class="cf-cart-item-name">Elegant Diamond Solitaire Ring</span>
            <span class="cf-cart-item-variant">Platinum</span>
            <div class="cf-cart-item-meta">
              <div class="cf-cart-qty"><button>−</button><span>2</span><button>+</button></div>
              <button class="cf-cart-remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Remove</button>
            </div>
          </div>
          <div class="cf-cart-item-prices">
            <span class="cf-cart-item-price">₹24,998</span>
            <span class="cf-cart-item-original">₹30,000</span>
            <span class="cf-cart-item-save">You save ₹5,002</span>
          </div>
        </div>
      {% endfor %}
    </div>

    <!-- ORDER SUMMARY -->
    <div class="cf-cart-summary">
      <h2 class="cf-cart-summary-title">{{ section.settings.summary_title }}</h2>

      <!-- Coupon Code -->
      <div class="cf-cart-coupon">
        <input type="text" placeholder="Enter coupon code…">
        <button>Apply</button>
      </div>

      <!-- Summary Lines -->
      <div class="cf-cart-summary-lines">
        <div class="cf-cart-summary-row">
          <span>Subtotal ({{ cart.item_count | default: 3 }} items)</span>
          <span>{{ cart.total_price | money | default: '₹39,997' }}</span>
        </div>
        <div class="cf-cart-summary-row">
          <span>Shipping</span>
          <span style="color: var(--cf-success); font-weight: 600;">FREE</span>
        </div>
        <div class="cf-cart-summary-row discount">
          <span>Coupon Discount</span>
          <span>-{{ cart.total_discount | money | default: '₹0' }}</span>
        </div>
        <div class="cf-cart-summary-row">
          <span>Estimated Tax</span>
          <span>Included</span>
        </div>
      </div>

      <div class="cf-cart-summary-row total">
        <span>Total</span>
        <span>{{ cart.total_price | money | default: '₹39,997' }}</span>
      </div>
      <div class="cf-cart-summary-row saved">
        <span>🎉 You are saving ₹10,002 on this order!</span>
      </div>
      <br>

      <!-- Checkout Button -->
      <form action="/checkout" method="post">
        <button type="submit" class="cf-cart-checkout-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          {{ section.settings.checkout_text }}
        </button>
      </form>

      <!-- Payment Icons -->
      <div class="cf-cart-payments">
        <span class="cf-cart-payment-label">We Accept</span>
        <span class="cf-cart-payment-icon">VISA</span>
        <span class="cf-cart-payment-icon">MC</span>
        <span class="cf-cart-payment-icon">AMEX</span>
        <span class="cf-cart-payment-icon">UPI</span>
        <span class="cf-cart-payment-icon">EMI</span>
      </div>

      <!-- Trust in Summary -->
      <div class="cf-cart-summary-trust">
        <div class="cf-cart-summary-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          100% Certified & Hallmarked Products
        </div>
        <div class="cf-cart-summary-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SSL Encrypted Secure Checkout
        </div>
        <div class="cf-cart-summary-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          15-Day Hassle-Free Returns
        </div>
        <div class="cf-cart-summary-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Lifetime Exchange Policy
        </div>
      </div>
    </div>

  </div>
</div>

<!-- Sticky Mobile Checkout Bar -->
<div class="cf-cart-sticky-mobile">
  <span class="cf-cart-sticky-total">{{ cart.total_price | money | default: '₹39,997' }}</span>
  <form action="/checkout" method="post" style="flex:1; display:flex;">
    <button type="submit" class="cf-cart-sticky-btn">Proceed to Checkout</button>
  </form>
</div>

{% schema %}
{
  "name": "CaratLane Cart Page",
  "settings": [
    {
      "type": "header",
      "content": "Theme Colors"
    },
    {
      "type": "color",
      "id": "color_primary",
      "label": "Primary Brand Color",
      "default": "#493161"
    },
    {
      "type": "color",
      "id": "color_accent",
      "label": "Accent Color",
      "default": "#DEBB43"
    },
    {
      "type": "color",
      "id": "color_bg",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "color",
      "id": "color_text",
      "label": "Text Color",
      "default": "#333333"
    },
    {
      "type": "range",
      "id": "border_radius",
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px",
      "label": "Corner Radius",
      "default": 12
    },
    {
      "type": "header",
      "content": "Cart Settings"
    },
    {
      "type": "text",
      "id": "cart_title",
      "label": "Cart Page Title",
      "default": "Your Shopping Bag"
    },
    {
      "type": "text",
      "id": "summary_title",
      "label": "Summary Title",
      "default": "Order Summary"
    },
    {
      "type": "text",
      "id": "checkout_text",
      "label": "Checkout Button Text",
      "default": "Proceed to Secure Checkout"
    }
  ],
  "presets": [
    {
      "name": "CaratLane Cart Page"
    }
  ]
}
{% endschema %}
`,
  "cf-caratlane-collection": `{% comment %}
  ConvertFlow — CaratLane Collection Page (Phase 2)
  Premium product cards with Sale badges, Star ratings, Wishlist,
  Choose Options CTA, and pixel-perfect responsive grid.
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  :root {
    --cf-primary: {{ section.settings.color_primary }};
    --cf-accent: {{ section.settings.color_accent }};
    --cf-bg: {{ section.settings.color_bg }};
    --cf-text: {{ section.settings.color_text }};
    --cf-light-bg: #F6EFFB;
    --cf-border-radius: {{ section.settings.border_radius }}px;
    --cf-font-heading: 'Playfair Display', serif;
    --cf-font-body: 'Inter', sans-serif;
    --cf-success: #16a34a;
    --cf-danger: #dc2626;
  }

  .cf-cl-c * { box-sizing: border-box; margin: 0; padding: 0; }
  .cf-cl-c {
    font-family: var(--cf-font-body);
    color: var(--cf-text);
    background: var(--cf-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    padding: clamp(20px, 4vw, 40px);
    max-width: 1440px;
    margin: 0 auto;
  }
  .cf-cl-c a { text-decoration: none; color: inherit; }

  /* ── Collection Hero Banner ── */
  .cf-cl-hero {
    background: linear-gradient(135deg, var(--cf-primary) 0%, #5e3d7a 100%);
    border-radius: var(--cf-border-radius);
    padding: clamp(30px, 5vw, 60px) clamp(24px, 4vw, 48px);
    margin-bottom: 32px;
    text-align: center;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .cf-cl-hero::before {
    content: '';
    position: absolute;
    top: -50%; right: -30%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(222,187,67,0.12) 0%, transparent 70%);
    border-radius: 50%;
  }
  .cf-cl-hero-title {
    font-family: var(--cf-font-heading);
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    margin-bottom: 8px;
    position: relative;
    color: #fff;
  }
  .cf-cl-hero-sub {
    font-size: clamp(14px, 2vw, 18px);
    opacity: 0.85;
    font-weight: 400;
    position: relative;
  }
  .cf-cl-hero-count {
    display: inline-block;
    margin-top: 14px;
    background: rgba(255,255,255,0.15);
    padding: 6px 18px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    position: relative;
  }

  /* ── Page Header & Utilities ── */
  .cf-cl-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(238,238,238,0.8);
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  .cf-cl-active-tags {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .cf-cl-filters-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #444; }
  .cf-cl-tag {
    border: 1px solid #ccc;
    padding: 7px 16px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #fff;
  }
  .cf-cl-tag:hover { border-color: var(--cf-primary); background: rgba(73, 49, 97, 0.05); }
  .cf-cl-clear { font-size: 13px; color: var(--cf-danger); font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
  .cf-cl-clear:hover { opacity: 0.7; }

  .cf-cl-sort { font-size: 14px; font-weight: 500; color: #666; display: flex; align-items: center; gap: 10px; }
  .cf-cl-sort select {
    border: 1px solid #eee;
    font-family: var(--cf-font-body);
    font-size: 14px;
    font-weight: 600;
    color: var(--cf-primary);
    background: #fff;
    cursor: pointer;
    outline: none;
    padding: 8px 32px 8px 14px;
    border-radius: 8px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23493161' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }

  /* ── Layout Grid ── */
  .cf-cl-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: clamp(24px, 4vw, 48px);
    align-items: start;
  }

  /* ── Sidebar Filters ── */
  .cf-cl-sidebar { padding-right: 24px; }
  .cf-cl-filter-group {
    margin-bottom: 28px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(238,238,238,0.7);
  }
  .cf-cl-filter-group:last-child { border-bottom: none; }
  .cf-cl-filter-title {
    font-size: 14px; font-weight: 700; color: #111; margin-bottom: 16px;
    letter-spacing: 0.5px; text-transform: uppercase;
    display: flex; justify-content: space-between; align-items: center; cursor: pointer;
  }
  .cf-cl-filter-title svg { width: 16px; height: 16px; color: #999; transition: transform 0.3s; }
  .cf-cl-filter-list { display: flex; flex-direction: column; gap: 12px; }
  .cf-cl-filter-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: #555; cursor: pointer; transition: color 0.2s;
  }
  .cf-cl-filter-item:hover { color: var(--cf-primary); }
  .cf-cl-filter-item input[type="checkbox"] {
    appearance: none; width: 18px; height: 18px; border: 2px solid #ddd; border-radius: 4px;
    cursor: pointer; position: relative; transition: all 0.2s; flex-shrink: 0;
  }
  .cf-cl-filter-item input[type="checkbox"]:checked {
    background: var(--cf-primary); border-color: var(--cf-primary);
  }
  .cf-cl-filter-item input[type="checkbox"]:checked::after {
    content: '✓'; position: absolute; color: white; font-size: 11px; left: 2px; top: 0; font-weight: bold;
  }
  .cf-cl-filter-item.active { color: var(--cf-primary); font-weight: 600; }
  .cf-cl-filter-count { color: #bbb; font-size: 12px; margin-left: auto; }
  .cf-cl-filter-more {
    color: var(--cf-primary); font-size: 13px; font-weight: 600; margin-top: 8px;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s;
  }
  .cf-cl-filter-more:hover { opacity: 0.8; }

  /* ── Product Grid ── */
  .cf-cl-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(14px, 2vw, 20px);
  }

  /* ── Product Card — Premium Redesign ── */
  .cf-cl-card {
    background: #fff;
    border-radius: var(--cf-border-radius);
    border: 1px solid rgba(238,238,238,0.7);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .cf-cl-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(73, 49, 97, 0.08);
    border-color: rgba(73, 49, 97, 0.12);
  }

  /* Card Image */
  .cf-cl-card-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: #f9f9f9;
    overflow: hidden;
  }
  .cf-cl-card-img-wrap img {
    width: 100%; height: 100%; object-fit: contain;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cf-cl-card:hover .cf-cl-card-img-wrap img { transform: scale(1.08); }

  /* Sale Badge */
  .cf-cl-badge {
    position: absolute;
    top: 12px; left: 12px;
    background: var(--cf-danger);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 4px;
    letter-spacing: 0.3px;
    z-index: 2;
    display: flex; align-items: center; gap: 4px;
  }
  .cf-cl-badge svg { width: 12px; height: 12px; }

  /* Wishlist Heart */
  .cf-cl-heart {
    position: absolute;
    top: 12px; right: 12px;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    z-index: 3;
  }
  .cf-cl-heart:hover { background: #fff; transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .cf-cl-heart svg { width: 18px; height: 18px; color: #bbb; transition: color 0.2s; }
  .cf-cl-heart:hover svg { color: var(--cf-danger); }

  /* Image Nav Arrows */
  .cf-cl-img-nav {
    position: absolute;
    top: 50%; width: 100%;
    display: flex; justify-content: space-between;
    transform: translateY(-50%);
    opacity: 0; padding: 0 8px;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  .cf-cl-card:hover .cf-cl-img-nav { opacity: 1; }
  .cf-cl-img-nav span {
    width: 30px; height: 30px; background: rgba(255,255,255,0.92); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; color: #555;
    transition: all 0.2s;
  }
  .cf-cl-img-nav span:hover { background: var(--cf-primary); color: #fff; transform: scale(1.1); }

  /* Card Info */
  .cf-cl-card-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* Star Rating */
  .cf-cl-card-rating {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 2px;
  }
  .cf-cl-card-stars { display: flex; gap: 1px; }
  .cf-cl-card-stars svg { width: 14px; height: 14px; fill: var(--cf-accent); color: var(--cf-accent); }
  .cf-cl-card-stars svg.empty { fill: none; color: #ddd; }
  .cf-cl-card-reviews { font-size: 12px; color: #999; font-weight: 500; }

  /* Title */
  .cf-cl-card-title {
    font-size: 13px; font-weight: 500; color: #444;
    line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    min-height: 36px;
  }

  /* Price Row */
  .cf-cl-card-price-row { display: flex; align-items: baseline; gap: 8px; margin-top: auto; }
  .cf-cl-card-price { font-size: clamp(16px, 2vw, 18px); font-weight: 700; color: var(--cf-primary); }
  .cf-cl-card-compare { font-size: clamp(12px, 1.5vw, 14px); color: #bbb; text-decoration: line-through; }

  /* Wishlist Text */
  .cf-cl-card-wishlist {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #888; font-weight: 500;
    margin-top: 4px;
    cursor: pointer;
    transition: color 0.2s;
  }
  .cf-cl-card-wishlist:hover { color: var(--cf-danger); }
  .cf-cl-card-wishlist svg { width: 14px; height: 14px; }

  /* Choose Options Button */
  .cf-cl-card-cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%;
    margin-top: 12px;
    padding: 11px 16px;
    border: none;
    border-radius: 8px;
    background: var(--cf-primary) !important;
    color: #ffffff !important;
    font-family: var(--cf-font-body);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    letter-spacing: 0.3px;
    -webkit-text-fill-color: #ffffff !important;
  }
  .cf-cl-card-cta:hover { background: #3a2750 !important; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(73,49,97,0.2); }
  .cf-cl-card-cta svg { color: #ffffff !important; stroke: #ffffff !important; }
  .cf-cl-card-cta svg { width: 15px; height: 15px; }

  /* ── Result Count ── */
  .cf-cl-result-count { font-size: 13px; color: #999; font-weight: 500; margin-bottom: 6px; }

  /* ── Filter Toggle Button (Mobile) ── */
  .cf-cl-filter-btn {
    display: none;
    align-items: center; gap: 8px;
    padding: 10px 20px;
    background: var(--cf-primary);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: var(--cf-font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  .cf-cl-filter-btn svg { width: 18px; height: 18px; }
  .cf-cl-filter-btn:hover { background: #3a2750; }

  /* ── Filter Drawer Overlay (Mobile) ── */
  .cf-cl-filter-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 9998;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .cf-cl-filter-overlay.open { opacity: 1; }

  .cf-cl-filter-drawer {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    max-height: 80vh;
    background: #fff;
    border-radius: 20px 20px 0 0;
    z-index: 9999;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow-y: auto;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
  }
  .cf-cl-filter-drawer.open { transform: translateY(0); }

  .cf-cl-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(238,238,238,0.7);
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 2;
    border-radius: 20px 20px 0 0;
  }
  .cf-cl-drawer-title { font-size: 18px; font-weight: 700; color: var(--cf-primary); font-family: var(--cf-font-heading); }
  .cf-cl-drawer-close {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: none;
    background: #f5f5f5;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 18px;
    color: #666;
  }
  .cf-cl-drawer-close:hover { background: var(--cf-primary); color: #fff; }

  .cf-cl-drawer-body { padding: 20px 24px 100px; }
  .cf-cl-drawer-body .cf-cl-filter-group { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(238,238,238,0.5); }
  .cf-cl-drawer-body .cf-cl-filter-group:last-child { border-bottom: none; }
  .cf-cl-drawer-body .cf-cl-filter-item { font-size: 14px; padding: 4px 0; }

  .cf-cl-drawer-apply {
    position: sticky;
    bottom: 0;
    padding: 16px 24px;
    background: #fff;
    border-top: 1px solid rgba(238,238,238,0.7);
    display: flex; gap: 12px;
  }
  .cf-cl-drawer-apply-btn {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-family: var(--cf-font-body);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
  }
  .cf-cl-drawer-apply-btn.primary { background: var(--cf-primary); color: #fff; }
  .cf-cl-drawer-apply-btn.primary:hover { background: #3a2750; }
  .cf-cl-drawer-apply-btn.secondary { background: #f5f5f5; color: var(--cf-text); }
  .cf-cl-drawer-apply-btn.secondary:hover { background: #eee; }

  /* ── Responsive ── */
  @media (max-width: 1200px) {
    .cf-cl-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 900px) {
    .cf-cl-layout { grid-template-columns: 1fr; gap: 20px; }
    .cf-cl-sidebar { display: none !important; }
    .cf-cl-filter-btn { display: flex; }
    .cf-cl-filter-overlay { display: block; pointer-events: none; }
    .cf-cl-filter-overlay.open { pointer-events: auto; }
    .cf-cl-filter-drawer { display: block; }
    .cf-cl-top { flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; }
    .cf-cl-grid { grid-template-columns: repeat(3, 1fr); }
    .cf-cl-hero { border-radius: 12px; }
  }
  @media (max-width: 600px) {
    .cf-cl-c { padding: 12px; }
    .cf-cl-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .cf-cl-card { border-radius: 10px; }
    .cf-cl-card:hover { transform: translateY(-3px); }
    .cf-cl-card-info { padding: 12px; }
    .cf-cl-card-cta { padding: 10px 12px; font-size: 12px; border-radius: 6px; }
    .cf-cl-badge { font-size: 10px; padding: 4px 8px; top: 8px; left: 8px; }
    .cf-cl-heart { width: 32px; height: 32px; top: 8px; right: 8px; }
    .cf-cl-heart svg { width: 16px; height: 16px; }
    .cf-cl-img-nav { display: none; }
    .cf-cl-active-tags { display: none; }
    .cf-cl-top { gap: 10px; padding-bottom: 12px; margin-bottom: 16px; }
    .cf-cl-hero { padding: 24px 16px; margin-bottom: 16px; }
    .cf-cl-card-title { font-size: 12px; min-height: 32px; }
    .cf-cl-card-price { font-size: 15px; }
    .cf-cl-card-wishlist { font-size: 11px; }
    .cf-cl-card-rating { margin-bottom: 0; }
    .cf-cl-card-stars svg { width: 12px; height: 12px; }
    .cf-cl-card-reviews { font-size: 11px; }
    .cf-cl-sort select { font-size: 13px; padding: 6px 28px 6px 10px; }
  }
{% endstyle %}

<div class="cf-cl-c">

  <!-- Collection Hero Banner -->
  <div class="cf-cl-hero">
    <h1 class="cf-cl-hero-title">{{ collection.title | default: section.settings.fallback_col_title }}</h1>
    <p class="cf-cl-hero-sub">{{ section.settings.hero_subtitle }}</p>
    <span class="cf-cl-hero-count">{{ collection.products_count | default: '1,247' }} Products</span>
  </div>

  <!-- TOP UTILITIES -->
  <div class="cf-cl-top">
    <div class="cf-cl-active-tags">
      <span class="cf-cl-filters-label">FILTERS</span>
      <span class="cf-cl-clear">CLEAR ALL</span>
      <div class="cf-cl-tag">
        {{ collection.title | default: section.settings.fallback_col_title }}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
    </div>

    <!-- Filter Icon Button (visible on mobile only) -->
    <button class="cf-cl-filter-btn" onclick="document.getElementById('cfFilterOverlay').classList.add('open');document.getElementById('cfFilterDrawer').classList.add('open');document.body.style.overflow='hidden';">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="16" y2="12"></line><line x1="4" y1="18" x2="12" y2="18"></line></svg>
      Filters
    </button>

    <div class="cf-cl-sort">
      Sort By:
      <select>
        <option>Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Newest Arrivals</option>
        <option>Best Selling</option>
      </select>
    </div>
  </div>

  <!-- Filter Drawer (Mobile Slide-Up) -->
  <div class="cf-cl-filter-overlay" id="cfFilterOverlay" onclick="this.classList.remove('open');document.getElementById('cfFilterDrawer').classList.remove('open');document.body.style.overflow='';"></div>
  <div class="cf-cl-filter-drawer" id="cfFilterDrawer">
    <div class="cf-cl-drawer-header">
      <span class="cf-cl-drawer-title">Filters</span>
      <button class="cf-cl-drawer-close" onclick="document.getElementById('cfFilterOverlay').classList.remove('open');document.getElementById('cfFilterDrawer').classList.remove('open');document.body.style.overflow='';">✕</button>
    </div>
    <div class="cf-cl-drawer-body">
      <div class="cf-cl-filter-group">
        <div class="cf-cl-filter-title">Price</div>
        <div class="cf-cl-filter-list">
          <label class="cf-cl-filter-item"><input type="checkbox"> ₹10,001 - ₹15,000 <span class="cf-cl-filter-count">(298)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> ₹20,001 - ₹30,000 <span class="cf-cl-filter-count">(379)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Under ₹5,000 <span class="cf-cl-filter-count">(1)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> ₹5,001 - ₹10,000 <span class="cf-cl-filter-count">(119)</span></label>
        </div>
      </div>
      <div class="cf-cl-filter-group">
        <div class="cf-cl-filter-title">Discounts</div>
        <div class="cf-cl-filter-list">
          <label class="cf-cl-filter-item"><input type="checkbox"> Flat 25% off on Making Charges <span class="cf-cl-filter-count">(402)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> 50% Off Making + 15% Diamond <span class="cf-cl-filter-count">(2533)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Flat 10% off on Making Charges <span class="cf-cl-filter-count">(426)</span></label>
        </div>
      </div>
      <div class="cf-cl-filter-group">
        <div class="cf-cl-filter-title">Product Type</div>
        <div class="cf-cl-filter-list">
          <label class="cf-cl-filter-item"><input type="checkbox" checked> Earrings <span class="cf-cl-filter-count">(3464)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Rings <span class="cf-cl-filter-count">(2937)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Necklaces <span class="cf-cl-filter-count">(1014)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Bangles <span class="cf-cl-filter-count">(847)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Pendants <span class="cf-cl-filter-count">(692)</span></label>
        </div>
      </div>
    </div>
    <div class="cf-cl-drawer-apply">
      <button class="cf-cl-drawer-apply-btn secondary" onclick="document.getElementById('cfFilterOverlay').classList.remove('open');document.getElementById('cfFilterDrawer').classList.remove('open');document.body.style.overflow='';">Clear All</button>
      <button class="cf-cl-drawer-apply-btn primary" onclick="document.getElementById('cfFilterOverlay').classList.remove('open');document.getElementById('cfFilterDrawer').classList.remove('open');document.body.style.overflow='';">Apply Filters</button>
    </div>
  </div>

  <!-- MAIN LAYOUT -->
  <div class="cf-cl-layout">

    <!-- SIDEBAR -->
    {% if section.settings.show_sidebar %}
    <aside class="cf-cl-sidebar">

      <div class="cf-cl-filter-group">
        <div class="cf-cl-filter-title">
          Price
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="cf-cl-filter-list">
          <label class="cf-cl-filter-item"><input type="checkbox"> ₹10,001 - ₹15,000 <span class="cf-cl-filter-count">(298)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> ₹20,001 - ₹30,000 <span class="cf-cl-filter-count">(379)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Under ₹5,000 <span class="cf-cl-filter-count">(1)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> ₹5,001 - ₹10,000 <span class="cf-cl-filter-count">(119)</span></label>
          <div class="cf-cl-filter-more">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            10 More
          </div>
        </div>
      </div>

      <div class="cf-cl-filter-group">
        <div class="cf-cl-filter-title">
          Discounts
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="cf-cl-filter-list">
          <label class="cf-cl-filter-item"><input type="checkbox"> Flat 25% off on Making Charges <span class="cf-cl-filter-count">(402)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> 50% Off Making + 15% Diamond <span class="cf-cl-filter-count">(2533)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Flat 10% off on Making Charges <span class="cf-cl-filter-count">(426)</span></label>
          <div class="cf-cl-filter-more">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            2 More
          </div>
        </div>
      </div>

      <div class="cf-cl-filter-group">
        <div class="cf-cl-filter-title">
          Product Type
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="cf-cl-filter-list">
          <label class="cf-cl-filter-item active"><input type="checkbox" checked> Earrings <span class="cf-cl-filter-count">(3464)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Rings <span class="cf-cl-filter-count">(2937)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Necklaces <span class="cf-cl-filter-count">(1014)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Bangles <span class="cf-cl-filter-count">(847)</span></label>
          <label class="cf-cl-filter-item"><input type="checkbox"> Pendants <span class="cf-cl-filter-count">(692)</span></label>
        </div>
      </div>

    </aside>
    {% endif %}

    <!-- PRODUCT GRID -->
    {% paginate collection.products by section.settings.products_per_page %}
    <div>
      <p class="cf-cl-result-count">Showing {{ collection.products_count | default: '8' }} results</p>
      <div class="cf-cl-grid">
        {% for product in collection.products %}
          <div class="cf-cl-card">
            <div class="cf-cl-card-img-wrap">
              {% if product.compare_at_price > product.price %}
                <div class="cf-cl-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  Sale
                </div>
              {% endif %}
              <button class="cf-cl-heart" onclick="event.preventDefault();" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <a href="{{ product.url }}">
                <img src="{{ product.featured_image | img_url: '400x' }}" alt="{{ product.title }}">
              </a>
              <div class="cf-cl-img-nav">
                <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></span>
                <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
              </div>
            </div>

            <div class="cf-cl-card-info">
              <div class="cf-cl-card-rating">
                <div class="cf-cl-card-stars">
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24" class="empty"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <span class="cf-cl-card-reviews">({{ forloop.index | times: 47 | plus: 23 }})</span>
              </div>
              <a href="{{ product.url }}" class="cf-cl-card-title">{{ product.title }}</a>
              <div class="cf-cl-card-price-row">
                <span class="cf-cl-card-price">{{ product.price | money }}</span>
                {% if product.compare_at_price > product.price %}
                  <span class="cf-cl-card-compare">{{ product.compare_at_price | money }}</span>
                {% endif %}
              </div>
              <div class="cf-cl-card-wishlist" onclick="event.preventDefault();">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Add to Wishlist
              </div>
              <a href="{{ product.url }}" class="cf-cl-card-cta" style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Choose Options
              </a>
            </div>
          </div>
        {% else %}
          <!-- Fallbacks for App Dashboard Preview -->
          {% assign fallback_names = "Sparkling Daisy Diamond Stud Earrings,Elegant Solitaire Ring,Boho Beaded Necklace,Diamond Eternity Ring,Charm Bracelet,Diamond Studs,Enamel Pattern Bangle,Floral Carved Bangle" | split: ',' %}
          {% assign fallback_prices = "14999,24998,8500,19453,12750,8600,9800,10000" | split: ',' %}
          {% assign fallback_compare = "19999,30000,12000,24431,16500,12000,12000,12000" | split: ',' %}
          {% for i in (1..8) %}
          {% assign idx = forloop.index0 %}
          <div class="cf-cl-card">
            <div class="cf-cl-card-img-wrap">
              {% if i == 1 or i == 3 or i == 6 %}
              <div class="cf-cl-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Sale
              </div>
              {% endif %}
              <button class="cf-cl-heart" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-{{ i | modulo: 6 | plus: 1 }}.png" alt="Fallback">
              <div class="cf-cl-img-nav">
                <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></span>
                <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
              </div>
            </div>
            <div class="cf-cl-card-info">
              <div class="cf-cl-card-rating">
                <div class="cf-cl-card-stars">
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <svg viewBox="0 0 24 24" class="empty"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <span class="cf-cl-card-reviews">({{ i | times: 47 | plus: 23 }} reviews)</span>
              </div>
              <span class="cf-cl-card-title">{{ fallback_names[idx] }}</span>
              <div class="cf-cl-card-price-row">
                <span class="cf-cl-card-price">Rs. {{ fallback_prices[idx] }}</span>
                <span class="cf-cl-card-compare">Rs. {{ fallback_compare[idx] }}</span>
              </div>
              <div class="cf-cl-card-wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Add to Wishlist
              </div>
              <a href="#" class="cf-cl-card-cta" style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Choose Options
              </a>
            </div>
          </div>
          {% endfor %}
        {% endfor %}
      </div>
    </div>
    {% endpaginate %}

  </div>

</div>

<!-- ── FOOTER ── -->
<style>
  .cf-cl-footer {
    background: linear-gradient(180deg, #2d1b3d 0%, #1a0f24 100%);
    color: rgba(255,255,255,0.8);
    font-family: var(--cf-font-body, 'Inter', sans-serif);
    padding: 0;
    margin-top: 60px;
  }
  .cf-cl-footer * { box-sizing: border-box; margin: 0; padding: 0; }
  .cf-cl-footer a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s, transform 0.2s; }
  .cf-cl-footer a:hover { color: #DEBB43; }

  /* Newsletter Strip */
  .cf-cl-footer-newsletter {
    background: linear-gradient(90deg, #493161, #5e3d7a);
    padding: 36px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    flex-wrap: wrap;
  }
  .cf-cl-footer-nl-text { flex: 1; min-width: 280px; }
  .cf-cl-footer-nl-text h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px;
  }
  .cf-cl-footer-nl-text p { font-size: 14px; color: rgba(255,255,255,0.75); }
  .cf-cl-footer-nl-form { display: flex; gap: 10px; flex: 1; max-width: 460px; min-width: 280px; }
  .cf-cl-footer-nl-form input {
    flex: 1; padding: 14px 20px; border: none; border-radius: 10px;
    font-family: inherit; font-size: 14px; outline: none;
    background: rgba(255,255,255,0.15); color: #fff;
    backdrop-filter: blur(4px);
  }
  .cf-cl-footer-nl-form input::placeholder { color: rgba(255,255,255,0.5); }
  .cf-cl-footer-nl-form button {
    padding: 14px 28px; border: none; border-radius: 10px;
    background: #DEBB43; color: #1a0f24; font-weight: 700; font-size: 14px;
    cursor: pointer; font-family: inherit; transition: all 0.3s; white-space: nowrap;
  }
  .cf-cl-footer-nl-form button:hover { background: #cca72c; transform: translateY(-2px); }

  /* Footer Main Grid */
  .cf-cl-footer-main {
    max-width: 1440px; margin: 0 auto;
    padding: 50px 40px 30px;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 40px;
  }

  /* Brand Column */
  .cf-cl-footer-brand h2 {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 14px;
  }
  .cf-cl-footer-brand p { font-size: 14px; line-height: 1.7; margin-bottom: 20px; color: rgba(255,255,255,0.6); }
  .cf-cl-footer-socials { display: flex; gap: 12px; }
  .cf-cl-footer-social {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s; cursor: pointer;
  }
  .cf-cl-footer-social:hover { background: #DEBB43; transform: scale(1.1); }
  .cf-cl-footer-social svg { width: 18px; height: 18px; color: rgba(255,255,255,0.8); }
  .cf-cl-footer-social:hover svg { color: #1a0f24; }

  /* Link Columns */
  .cf-cl-footer-col h4 {
    font-size: 14px; font-weight: 700; color: #fff;
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 20px;
  }
  .cf-cl-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .cf-cl-footer-col li a { font-size: 14px; display: block; }

  /* Footer Bottom */
  .cf-cl-footer-bottom {
    max-width: 1440px; margin: 0 auto;
    padding: 24px 40px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .cf-cl-footer-copy { font-size: 13px; color: rgba(255,255,255,0.4); }
  .cf-cl-footer-payments { display: flex; gap: 10px; align-items: center; }
  .cf-cl-footer-pay-icon {
    width: 44px; height: 28px; border-radius: 4px;
    background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.6);
    letter-spacing: 0.3px;
  }

  /* Footer Responsive */
  @media (max-width: 900px) {
    .cf-cl-footer-main { grid-template-columns: 1fr 1fr; gap: 30px; padding: 40px 24px 24px; }
    .cf-cl-footer-newsletter { padding: 28px 24px; }
    .cf-cl-footer-bottom { padding: 20px 24px; }
  }
  @media (max-width: 600px) {
    .cf-cl-footer-main { grid-template-columns: 1fr; gap: 28px; padding: 30px 16px 20px; }
    .cf-cl-footer-newsletter { flex-direction: column; padding: 24px 16px; gap: 16px; }
    .cf-cl-footer-nl-form { flex-direction: column; max-width: 100%; }
    .cf-cl-footer-nl-form button { width: 100%; }
    .cf-cl-footer-bottom { flex-direction: column; text-align: center; padding: 16px; }
    .cf-cl-footer-brand h2 { font-size: 22px; }
  }
</style>

<footer class="cf-cl-footer">
  <!-- Newsletter -->
  <div class="cf-cl-footer-newsletter">
    <div class="cf-cl-footer-nl-text">
      <h3>Stay in the Loop</h3>
      <p>Subscribe for exclusive offers, new arrivals & styling tips.</p>
    </div>
    <div class="cf-cl-footer-nl-form">
      <input type="email" placeholder="Enter your email address…">
      <button>Subscribe</button>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="cf-cl-footer-main">
    <div class="cf-cl-footer-brand">
      <h2>{{ shop.name | default: 'CaratLane' }}</h2>
      <p>Bringing you the finest handcrafted jewellery since 2008. Every piece tells a story of elegance, tradition, and modern design. BIS Hallmarked. Certified. Trusted.</p>
      <div class="cf-cl-footer-socials">
        <a class="cf-cl-footer-social" href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
        <a class="cf-cl-footer-social" href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
        <a class="cf-cl-footer-social" href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
        <a class="cf-cl-footer-social" href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
      </div>
    </div>

    <div class="cf-cl-footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a href="/collections/all">All Jewellery</a></li>
        <li><a href="#">Rings</a></li>
        <li><a href="#">Earrings</a></li>
        <li><a href="#">Necklaces</a></li>
        <li><a href="#">Bangles</a></li>
        <li><a href="#">New Arrivals</a></li>
      </ul>
    </div>

    <div class="cf-cl-footer-col">
      <h4>Help</h4>
      <ul>
        <li><a href="#">Track Order</a></li>
        <li><a href="#">Returns & Exchange</a></li>
        <li><a href="#">Shipping Info</a></li>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Size Guide</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
    </div>

    <div class="cf-cl-footer-col">
      <h4>Company</h4>
      <ul>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Careers</a></li>
        <li><a href="#">Store Locator</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms & Conditions</a></li>
      </ul>
    </div>
  </div>

  <!-- Bottom Bar -->
  <div class="cf-cl-footer-bottom">
    <span class="cf-cl-footer-copy">&copy; {{ 'now' | date: '%Y' }} {{ shop.name | default: 'CaratLane' }}. All rights reserved.</span>
    <div class="cf-cl-footer-payments">
      <span class="cf-cl-footer-pay-icon">VISA</span>
      <span class="cf-cl-footer-pay-icon">MC</span>
      <span class="cf-cl-footer-pay-icon">AMEX</span>
      <span class="cf-cl-footer-pay-icon">UPI</span>
      <span class="cf-cl-footer-pay-icon">EMI</span>
      <span class="cf-cl-footer-pay-icon">COD</span>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "CaratLane Collection",
  "settings": [
    {
      "type": "header",
      "content": "Theme Colors"
    },
    {
      "type": "color",
      "id": "color_primary",
      "label": "Primary Brand Color",
      "default": "#493161"
    },
    {
      "type": "color",
      "id": "color_accent",
      "label": "Accent Color",
      "default": "#DEBB43"
    },
    {
      "type": "color",
      "id": "color_bg",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "color",
      "id": "color_text",
      "label": "Text Color",
      "default": "#333333"
    },
    {
      "type": "range",
      "id": "border_radius",
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px",
      "label": "Corner Radius",
      "default": 12
    },
    {
      "type": "header",
      "content": "Collection Settings"
    },
    {
      "type": "text",
      "id": "fallback_col_title",
      "label": "Fallback Collection Title",
      "default": "Earrings"
    },
    {
      "type": "text",
      "id": "hero_subtitle",
      "label": "Hero Subtitle",
      "default": "Explore our exquisite collection of handcrafted designs"
    },
    {
      "type": "checkbox",
      "id": "show_sidebar",
      "label": "Show Filter Sidebar",
      "default": true
    },
    {
      "type": "range",
      "id": "products_per_page",
      "min": 8,
      "max": 48,
      "step": 4,
      "label": "Products Per Page",
      "default": 16
    }
  ],
  "presets": [
    {
      "name": "CaratLane Collection"
    }
  ]
}
{% endschema %}
`,
  "cf-caratlane-landing": `{% comment %}
  ConvertFlow — CaratLane Clone Landing Page (Premium Edition)
  Features dynamic blocks: Hero Slider, Trendsetters, Categories, Promo Grids, Collections
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  :root {
    --cf-primary: {{ section.settings.color_primary }};
    --cf-accent: {{ section.settings.color_accent }};
    --cf-bg: {{ section.settings.color_bg }};
    --cf-text: {{ section.settings.color_text }};
    --cf-light-bg: #F6EFFB;
    --cf-border-radius: {{ section.settings.border_radius }}px;
    --cf-font-heading: 'Playfair Display', serif;
    --cf-font-body: 'Inter', sans-serif;
  }

  /* Base Reset */
  .cf-cl { font-family: var(--cf-font-body); color: var(--cf-text); background: var(--cf-bg); -webkit-font-smoothing: antialiased; padding-bottom: 60px; overflow-x: hidden; }
  .cf-cl * { box-sizing: border-box; margin: 0; padding: 0; }
  .cf-cl a { text-decoration: none; color: inherit; transition: opacity 0.2s ease, transform 0.2s ease; }

  /* ── Header Glassmorphism ── */
  .cf-cl-header { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(238, 238, 238, 0.8); position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
  .cf-cl-header-top { display: flex; justify-content: space-between; align-items: center; padding: 16px 40px; gap: 24px; transition: padding 0.3s ease; }
  .cf-cl-logo { font-family: var(--cf-font-heading); font-size: clamp(24px, 3vw, 32px); font-weight: 700; color: var(--cf-primary); }
  .cf-cl-search { flex: 1; max-width: 600px; position: relative; }
  .cf-cl-search input { width: 100%; border: 1px solid #e2e8f0; border-radius: 40px; padding: 14px 24px; font-size: 14px; background: #f8fafc; outline: none; transition: all 0.3s ease; }
  .cf-cl-search input:focus { border-color: var(--cf-primary); background: #fff; box-shadow: 0 0 0 3px rgba(73, 49, 97, 0.1); }
  .cf-cl-icons { display: flex; gap: 24px; }
  .cf-cl-icon { display: flex; flex-direction: column; align-items: center; font-size: 11px; font-weight: 600; color: var(--cf-primary); gap: 4px; }
  .cf-cl-icon:hover { opacity: 0.7; }
  .cf-cl-icon svg { width: 22px; height: 22px; stroke-width: 1.5; }

  /* Subheader Navigation */
  .cf-cl-nav { background: var(--cf-primary); padding: 12px 40px; display: flex; gap: clamp(16px, 3vw, 32px); justify-content: center; overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
  .cf-cl-nav::-webkit-scrollbar { display: none; }
  .cf-cl-nav a { color: #fff; font-size: 13px; font-weight: 500; text-transform: capitalize; opacity: 0.9; position: relative; }
  .cf-cl-nav a:hover { opacity: 1; }
  .cf-cl-nav a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: #fff; transition: width 0.3s ease; }
  .cf-cl-nav a:hover::after { width: 100%; }

  /* ── Hero Slider Block ── */
  .cf-cl-hero { position: relative; width: 100%; aspect-ratio: 21/9; min-height: 400px; max-height: 640px; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; display: flex; background: #f4f4f4; scrollbar-width: none; scroll-behavior: smooth; }
  .cf-cl-hero::-webkit-scrollbar { display: none; }
  .cf-cl-hero-slide { min-width: 100vw; height: 100%; position: relative; scroll-snap-align: start; }
  .cf-cl-hero-slide img { width: 100%; height: 100%; object-fit: cover; }
  .cf-cl-hero-overlay { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 10%; background: linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%); }
  .cf-cl-hero-text { max-width: 600px; animation: cfFadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .cf-cl-hero-text h2 { font-family: var(--cf-font-heading); font-size: clamp(32px, 5vw, 64px); color: var(--cf-primary); line-height: 1.1; margin-bottom: 16px; font-weight: 700; text-wrap: balance; }
  .cf-cl-hero-text p { font-size: clamp(15px, 2vw, 18px); color: #444; font-weight: 500; }
  @keyframes cfFadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Wrapped With Love (Categories) ── */
  .cf-cl-wrapped { background: var(--cf-light-bg); padding: clamp(20px, 4vw, 50px); margin: clamp(30px, 5vw, 60px) 0; border-radius: var(--cf-border-radius); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .cf-cl-wrapped-scroll { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 16px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .cf-cl-wrapped-scroll::-webkit-scrollbar { display: none; }
  
  .cf-cl-wrap-lead { flex: 0 0 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--cf-primary); scroll-snap-align: start; }
  .cf-cl-wrap-lead img { width: 80px; margin-bottom: 12px; }
  .cf-cl-wrap-lead h3 { font-size: 16px; font-weight: 600; font-family: var(--cf-font-body); line-height: 1.3; }

  .cf-cl-cat-item { flex: 0 0 140px; display: flex; flex-direction: column; gap: 12px; text-align: center; scroll-snap-align: start; }
  .cf-cl-cat-img { width: 100%; aspect-ratio: 1; border-radius: var(--cf-border-radius); overflow: hidden; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; transform: translateZ(0); }
  .cf-cl-cat-item:hover .cf-cl-cat-img { transform: translateY(-8px) scale(1.02); box-shadow: 0 16px 30px rgba(0,0,0,0.12); }
  .cf-cl-cat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .cf-cl-cat-item:hover .cf-cl-cat-img img { transform: scale(1.1); }
  .cf-cl-cat-title { font-size: 11px; font-weight: 700; color: var(--cf-primary); letter-spacing: 0.5px; text-transform: uppercase; }

  /* ── Trendsetters Split Block ── */
  .cf-cl-trend { margin: clamp(30px, 5vw, 60px) clamp(20px, 4vw, 40px); display: grid; grid-template-columns: 1fr 1fr; border-radius: var(--cf-border-radius); overflow: hidden; box-shadow: 0 6px 30px rgba(0,0,0,0.06); }
  .cf-cl-trend-left { position: relative; padding: clamp(40px, 6vw, 80px); display: flex; flex-direction: column; justify-content: center; background: #eee; overflow: hidden; }
  .cf-cl-trend-left img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
  .cf-cl-trend:hover .cf-cl-trend-left img { transform: scale(1.05); }
  .cf-cl-trend-content { position: relative; z-index: 2; max-width: 320px; background: rgba(255,255,255,0.7); backdrop-filter: blur(8px); padding: 30px; border-radius: var(--cf-border-radius); border: 1px solid rgba(255,255,255,0.5); }
  .cf-cl-trend-content h2 { font-family: var(--cf-font-heading); font-size: clamp(32px, 4vw, 48px); color: var(--cf-primary); line-height: 1.1; margin-bottom: 12px; }
  .cf-cl-trend-content h2 em { font-style: italic; color: #8C52FF; font-weight: 400; }
  .cf-cl-trend-content p { font-size: 15px; color: #333; line-height: 1.6; font-weight: 500; }
  
  .cf-cl-trend-right { background: linear-gradient(135deg, #e3d5ff, #f6effb); padding: clamp(30px, 5vw, 60px); display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
  .cf-cl-trend-products { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .cf-cl-trend-card { flex: 0 0 clamp(180px, 20vw, 220px); background: #fff; border-radius: calc(var(--cf-border-radius) - 4px); padding: 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.04); scroll-snap-align: center; transition: transform 0.4s ease, box-shadow 0.4s ease; }
  .cf-cl-trend-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
  .cf-cl-trend-card-img { width: 100%; aspect-ratio: 1; margin-bottom: 12px; overflow: hidden; border-radius: 8px; }
  .cf-cl-trend-card-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s ease; }
  .cf-cl-trend-card:hover .cf-cl-trend-card-img img { transform: scale(1.1); }
  .cf-cl-trend-price { font-size: 16px; font-weight: 700; color: var(--cf-primary); margin-bottom: 4px; }
  .cf-cl-trend-compare { font-size: 12px; color: #999; text-decoration: line-through; margin-left: 6px; }
  .cf-cl-trend-name { font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── Promo Banner Grid (Mosaic) ── */
  .cf-cl-mosaic { margin: clamp(30px, 5vw, 60px) clamp(20px, 4vw, 40px); display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 3vw, 24px); }
  .cf-cl-mosaic-item { border-radius: var(--cf-border-radius); overflow: hidden; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
  .cf-cl-mosaic-item::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.1), transparent); pointer-events: none; }
  .cf-cl-mosaic-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
  .cf-cl-mosaic-item:hover img { transform: scale(1.06); }
  .cf-cl-mosaic-left { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 3vw, 24px); }

  /* ── Collections Cards ── */
  .cf-cl-collections { padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px); text-align: center; background: #fafafa; }
  .cf-cl-collections > h2 { font-family: var(--cf-font-heading); font-size: clamp(32px, 4vw, 42px); color: var(--cf-primary); font-weight: 700; margin-bottom: clamp(30px, 5vw, 50px); }
  .cf-cl-coll-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(16px, 2vw, 24px); margin-bottom: 50px; }
  .cf-cl-coll-card { position: relative; aspect-ratio: 3/4; border-radius: var(--cf-border-radius); overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
  .cf-cl-coll-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
  .cf-cl-coll-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(73, 49, 97, 0.4) 100%); }
  .cf-cl-coll-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
  .cf-cl-coll-card:hover img { transform: scale(1.08); }
  .cf-cl-coll-logo { position: absolute; bottom: 24px; left: 0; width: 100%; display: flex; justify-content: center; z-index: 2; transition: transform 0.4s ease; }
  .cf-cl-coll-card:hover .cf-cl-coll-logo { transform: translateY(-4px); }
  .cf-cl-coll-logo img { max-width: 140px; height: auto; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
  .cf-cl-coll-btn { display: inline-block; background: var(--cf-primary); color: #fff; padding: 16px 48px; border-radius: 40px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(73, 49, 97, 0.2); }
  .cf-cl-coll-btn:hover { background: #332244; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(73, 49, 97, 0.3); }

  /* ── Trust Badges ── */
  .cf-cl-trust { background: #fdfafb; padding: clamp(16px, 3vw, 24px) 40px; display: flex; justify-content: center; gap: clamp(20px, 4vw, 50px); border-bottom: 1px solid rgba(240, 230, 234, 0.8); overflow-x: auto; white-space: nowrap; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .cf-cl-trust::-webkit-scrollbar { display: none; }
  .cf-cl-trust-item { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600; color: var(--cf-primary); scroll-snap-align: center; }
  .cf-cl-trust-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; position: relative; overflow: hidden; transition: transform 0.3s ease; }
  .cf-cl-trust-item:hover .cf-cl-trust-icon { transform: scale(1.1) rotate(5deg); }

  /* ── Promo Slider ── */
  .cf-cl-pslider { padding: clamp(40px, 5vw, 60px) 0; background: #fff; overflow: hidden; }
  .cf-cl-pslider-inner { display: flex; gap: clamp(16px, 3vw, 24px); padding: 0 clamp(20px, 4vw, 40px); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; scroll-behavior: smooth; }
  .cf-cl-pslider-inner::-webkit-scrollbar { display: none; }
  .cf-cl-pslide { flex: 0 0 clamp(80%, 85vw, 900px); border-radius: var(--cf-border-radius); overflow: hidden; position: relative; scroll-snap-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.04); transition: transform 0.4s ease; transform: translateZ(0); }
  .cf-cl-pslide:hover { transform: scale(1.02); }
  .cf-cl-pslide img { width: 100%; height: auto; display: block; object-fit: cover; }

  /* ── Responsive Mobile Upgrades ── */
  @media (max-width: 1024px) {
    .cf-cl-header-top { padding: 12px 20px; }
    .cf-cl-trend { grid-template-columns: 1fr; }
    .cf-cl-trend-left { aspect-ratio: 16/9; }
    .cf-cl-mosaic { grid-template-columns: 1fr; }
    .cf-cl-coll-grid { grid-template-columns: repeat(3, 1fr); }
    .cf-cl-hero-overlay { padding: 0 5%; background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%); }
    .cf-cl-trust { justify-content: flex-start; padding: 16px 20px; }
  }
  @media (max-width: 600px) {
    .cf-cl-search { display: none; } /* Hide search visually on phone topbar */
    .cf-cl-hero { aspect-ratio: 4/5; min-height: 480px; }
    .cf-cl-hero-overlay { background: linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 80%); align-items: flex-end; padding-bottom: 40px; }
    .cf-cl-hero-text h2 { text-align: center; font-size: 32px; }
    .cf-cl-hero-text p { text-align: center; margin-bottom: 0; }
    .cf-cl-coll-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 20px; gap: 16px; margin-bottom: 30px; }
    .cf-cl-coll-card { flex: 0 0 240px; scroll-snap-align: center; }
    .cf-cl-trend-content { background: rgba(255,255,255,0.9); border: none; padding: 20px; text-align: center; }
    .cf-cl-trend-left { aspect-ratio: auto; min-height: 400px; padding: 20px; }
  }
{% endstyle %}

<div class="cf-cl">
  
  <!-- HEADER SECTION -->
  <header class="cf-cl-header">
    <div class="cf-cl-header-top">
      <a href="/" class="cf-cl-logo">{{ section.settings.logo_text }}</a>
      <div class="cf-cl-search">
        <input type="text" placeholder="{{ section.settings.search_placeholder }}">
      </div>
      <div class="cf-cl-icons">
        <a href="/account" class="cf-cl-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Profile
        </a>
        <a href="/cart" class="cf-cl-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
          Cart
        </a>
      </div>
    </div>
    
    <div class="cf-cl-nav">
      <a href="#">Rings</a>
      <a href="#">Earrings</a>
      <a href="#">Bracelets & Bangles</a>
      <a href="#">Solitaires</a>
      <a href="#">Mangalsutras</a>
      <a href="#">Necklaces & Pendants</a>
      <a href="#">Gifting</a>
      <a href="#">Collections</a>
      <a href="#">More Jewellery</a>
    </div>
  </header>

  <!-- DYNAMIC BLOCKS RENDERER -->
  {% for block in section.blocks %}
    
    {% case block.type %}
      
      {% when 'hero_slide' %}
        <div class="cf-cl-hero" {{ block.shopify_attributes }}>
          <div class="cf-cl-hero-slide">
            {% if block.settings.image %}
              <img src="{{ block.settings.image | img_url: 'master' }}" alt="{{ block.settings.heading }}">
            {% else %}
              <div style="width:100%; height:100%; background:linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);"></div>
            {% endif %}
            
            <div class="cf-cl-hero-overlay">
              <div class="cf-cl-hero-text">
                <h2>{{ block.settings.heading }}</h2>
                <p>{{ block.settings.subheading }}</p>
              </div>
            </div>
          </div>
        </div>

      {% when 'trust_badges' %}
        <div class="cf-cl-trust" {{ block.shopify_attributes }}>
          {% for i in (1..4) %}
            {% assign icon_key = 'icon_' | append: i %}
            {% assign text_key = 'text_' | append: i %}
            {% assign color_key = 'bg_color_' | append: i %}
            
            {% if block.settings[text_key] != blank %}
            <div class="cf-cl-trust-item">
              <div class="cf-cl-trust-icon" style="background: {{ block.settings[color_key] }}; box-shadow: 0 2px 8px {{ block.settings[color_key] }}40;">
                {% if block.settings[icon_key] != blank %}
                  <img src="{{ block.settings[icon_key] | img_url: '60x' }}" style="width:18px; max-height:18px; object-fit:contain;">
                {% else %}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {% endif %}
              </div>
              {{ block.settings[text_key] }}
            </div>
            {% endif %}
          {% endfor %}
        </div>
        
      {% when 'promo_slider' %}
        <div class="cf-cl-pslider" {{ block.shopify_attributes }}>
          <div class="cf-cl-pslider-inner">
            {% for i in (1..4) %}
              {% assign img_key = 'slide_img_' | append: i %}
              {% assign url_key = 'slide_url_' | append: i %}
              
              {% if block.settings[img_key] != blank %}
              <a href="{{ block.settings[url_key] }}" class="cf-cl-pslide">
                <img src="{{ block.settings[img_key] | img_url: '1200x' }}" alt="Promo Slide">
              </a>
              {% endif %}
            {% endfor %}
            {% if block.settings.slide_img_1 == blank %}
              <div class="cf-cl-pslide" style="background:#e0e0e0; min-height: 250px; display:flex; align-items:center; justify-content:center; color:#666;">Upload Banner in Editor</div>
              <div class="cf-cl-pslide" style="background:#d0d0d0; min-height: 250px; display:flex; align-items:center; justify-content:center; color:#666;">Upload Banner in Editor</div>
            {% endif %}
          </div>
        </div>

      {% when 'wrapped_categories' %}
        <div class="cf-cl-wrapped" {{ block.shopify_attributes }}>
          <div class="cf-cl-wrapped-scroll">
            <div class="cf-cl-wrap-lead">
              <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/wrapped-icon.png?v=1" alt="Wrapped with love" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3712/3712217.png'">
              <h3>Wrapped with love</h3>
            </div>
            
            {% for i in (1..6) %}
              {% assign img_key = 'cat_img_' | append: i %}
              {% assign title_key = 'cat_title_' | append: i %}
              {% assign url_key = 'cat_url_' | append: i %}
              
              {% if block.settings[title_key] != blank %}
              <a href="{{ block.settings[url_key] }}" class="cf-cl-cat-item">
                <div class="cf-cl-cat-img">
                  {% if block.settings[img_key] %}
                    <img src="{{ block.settings[img_key] | img_url: '400x' }}" alt="{{ block.settings[title_key] }}">
                  {% else %}
                    <div style="width:100%; height:100%; background:#e0e0e0;"></div>
                  {% endif %}
                </div>
                <span class="cf-cl-cat-title">{{ block.settings[title_key] }}</span>
              </a>
              {% endif %}
            {% endfor %}
          </div>
        </div>
        
      {% when 'trendsetters' %}
        <div class="cf-cl-trend" {{ block.shopify_attributes }}>
          <div class="cf-cl-trend-left">
            {% if block.settings.bg_image %}
              <img src="{{ block.settings.bg_image | img_url: '1000x' }}" alt="Trendsetters">
            {% else %}
              <div style="background: linear-gradient(135deg, #fdfbfb, #ebedee); position:absolute; inset:0;"></div>
            {% endif %}
            <div class="cf-cl-trend-content">
              <h2>{{ block.settings.heading }}</h2>
              <p>{{ block.settings.subheading }}</p>
            </div>
          </div>
          
          <div class="cf-cl-trend-right">
            <div class="cf-cl-trend-products">
              {% assign col = collections[block.settings.collection] %}
              {% for product in col.products limit: 4 %}
                <a href="{{ product.url }}" class="cf-cl-trend-card">
                  <div class="cf-cl-trend-card-img">
                    <img src="{{ product.featured_image | img_url: '400x' }}" alt="{{ product.title }}">
                  </div>
                  <div class="cf-cl-trend-price">
                    {{ product.price | money }}
                    {% if product.compare_at_price > product.price %}
                      <span class="cf-cl-trend-compare">{{ product.compare_at_price | money }}</span>
                    {% endif %}
                  </div>
                  <div class="cf-cl-trend-name">{{ product.title }}</div>
                </a>
              {% else %}
                {% for i in (1..3) %}
                  <div class="cf-cl-trend-card">
                    <div class="cf-cl-trend-card-img" style="background:#f5f5f5;"></div>
                    <div class="cf-cl-trend-price">₹14,999</div>
                    <div class="cf-cl-trend-name">Sample Gold Ring {{ i }}</div>
                  </div>
                {% endfor %}
              {% endfor %}
            </div>
          </div>
        </div>

      {% when 'promo_mosaic' %}
        <div class="cf-cl-mosaic" {{ block.shopify_attributes }}>
          <div class="cf-cl-mosaic-item">
            {% if block.settings.image_left %}
              <img src="{{ block.settings.image_left | img_url: '1000x' }}" alt="Promo">
            {% else %}
              <div style="background:#e0e0e0; width:100%; height:100%; min-height:400px;"></div>
            {% endif %}
          </div>
          <div>
            <div class="cf-cl-mosaic-item" style="height: 100%;">
              {% if block.settings.image_right %}
                <img src="{{ block.settings.image_right | img_url: '1000x' }}" alt="Promo">
              {% else %}
                <div style="background:#d0d0d0; width:100%; height:100%; min-height:400px;"></div>
              {% endif %}
            </div>
          </div>
        </div>

      {% when 'collections_grid' %}
        <div class="cf-cl-collections" {{ block.shopify_attributes }}>
          <h2>{{ block.settings.heading }}</h2>
          <div class="cf-cl-coll-grid">
            {% for i in (1..5) %}
              {% assign bg_key = 'coll_bg_' | append: i %}
              {% assign logo_key = 'coll_logo_' | append: i %}
              {% assign url_key = 'coll_url_' | append: i %}
              
              {% if block.settings[bg_key] != blank or block.settings[logo_key] != blank %}
              <a href="{{ block.settings[url_key] }}" class="cf-cl-coll-card">
                {% if block.settings[bg_key] %}
                  <img src="{{ block.settings[bg_key] | img_url: '600x' }}" alt="Collection">
                {% else %}
                  <div style="background:#e0e0e0; width:100%; height:100%;"></div>
                {% endif %}
                <div class="cf-cl-coll-logo">
                  {% if block.settings[logo_key] %}
                    <img src="{{ block.settings[logo_key] | img_url: '400x' }}" alt="Logo">
                  {% endif %}
                </div>
              </a>
              {% endif %}
            {% endfor %}
          </div>
          <a href="/collections" class="cf-cl-coll-btn">{{ block.settings.btn_text }}</a>
        </div>
        
    {% endcase %}
  {% endfor %}

  <!-- FOOTER -->
  <footer style="padding: 60px 40px; background: #fff; text-align: center; border-top: 1px solid #eee; margin-top: 40px;">
    <p style="color: #666; font-size: 14px;">&copy; {{ 'now' | date: '%Y' }} {{ section.settings.logo_text }}. All rights reserved.</p>
  </footer>
</div>

{% schema %}
{
  "name": "CaratLane Landing Pro",
  "settings": [
    {
      "type": "header",
      "content": "Global Settings"
    },
    {
      "type": "color",
      "id": "color_primary",
      "label": "Primary Brand Color",
      "default": "#493161"
    },
    {
      "type": "color",
      "id": "color_accent",
      "label": "Accent Color",
      "default": "#DEBB43"
    },
    {
      "type": "color",
      "id": "color_bg",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "color",
      "id": "color_text",
      "label": "Text Color",
      "default": "#333333"
    },
    {
      "type": "range",
      "id": "border_radius",
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px",
      "label": "Corner Radius",
      "default": 12
    },
    {
      "type": "text",
      "id": "logo_text",
      "label": "Logo Text",
      "default": "CaratLane Clone"
    },
    {
      "type": "text",
      "id": "search_placeholder",
      "label": "Search Placeholder",
      "default": "Search for Rings, Earrings..."
    }
  ],
  "blocks": [
    {
      "type": "hero_slide",
      "name": "Hero Banner",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Banner Image"
        },
        {
          "type": "html",
          "id": "heading",
          "label": "Heading",
          "default": "Shop stunning diamond designs with EXTRA ₹500/GM"
        },
        {
          "type": "text",
          "id": "subheading",
          "label": "Subheading",
          "default": "on your Digital Gold balance."
        }
      ]
    },
    {
      "type": "trendsetters",
      "name": "Trendsetters Section",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "bg_image",
          "label": "Left Lifestyle Image"
        },
        {
          "type": "html",
          "id": "heading",
          "label": "Heading (use <em> for italic)",
          "default": "Thursday <em>trendsetters</em>"
        },
        {
          "type": "text",
          "id": "subheading",
          "label": "Subheading",
          "default": "This is what bold looks like in diamonds"
        },
        {
          "type": "collection",
          "id": "collection",
          "label": "Products to Display"
        }
      ]
    },
    {
      "type": "wrapped_categories",
      "name": "Wrapped With Love Strip",
      "limit": 1,
      "settings": [
        { "type": "image_picker", "id": "cat_img_1", "label": "Cat 1 Image" },
        { "type": "text", "id": "cat_title_1", "label": "Cat 1 Title", "default": "FESTIVE JHUMKAS" },
        { "type": "url", "id": "cat_url_1", "label": "Cat 1 Link" },
        
        { "type": "image_picker", "id": "cat_img_2", "label": "Cat 2 Image" },
        { "type": "text", "id": "cat_title_2", "label": "Cat 2 Title", "default": "GEMSTONE RINGS" },
        { "type": "url", "id": "cat_url_2", "label": "Cat 2 Link" },
        
        { "type": "image_picker", "id": "cat_img_3", "label": "Cat 3 Image" },
        { "type": "text", "id": "cat_title_3", "label": "Cat 3 Title", "default": "GOLD COINS" },
        { "type": "url", "id": "cat_url_3", "label": "Cat 3 Link" },
        
        { "type": "image_picker", "id": "cat_img_4", "label": "Cat 4 Image" },
        { "type": "text", "id": "cat_title_4", "label": "Cat 4 Title", "default": "EVERYDAY NECKLACES" },
        { "type": "url", "id": "cat_url_4", "label": "Cat 4 Link" },
        
        { "type": "image_picker", "id": "cat_img_5", "label": "Cat 5 Image" },
        { "type": "text", "id": "cat_title_5", "label": "Cat 5 Title", "default": "STYLES UNDER 10K" },
        { "type": "url", "id": "cat_url_5", "label": "Cat 5 Link" },
        
        { "type": "image_picker", "id": "cat_img_6", "label": "Cat 6 Image" },
        { "type": "text", "id": "cat_title_6", "label": "Cat 6 Title", "default": "TENNIS BRACELETS" },
        { "type": "url", "id": "cat_url_6", "label": "Cat 6 Link" }
      ]
    },
    {
      "type": "trust_badges",
      "name": "Trust Badges Strip",
      "limit": 1,
      "settings": [
        { "type": "image_picker", "id": "icon_1", "label": "Icon 1" },
        { "type": "text", "id": "text_1", "label": "Text 1", "default": "100% Certified" },
        { "type": "color", "id": "bg_color_1", "label": "Icon 1 BG", "default": "#EAF2FE" },
        
        { "type": "image_picker", "id": "icon_2", "label": "Icon 2" },
        { "type": "text", "id": "text_2", "label": "Text 2", "default": "15 Day Exchange" },
        { "type": "color", "id": "bg_color_2", "label": "Icon 2 BG", "default": "#FCECEC" },
        
        { "type": "image_picker", "id": "icon_3", "label": "Icon 3" },
        { "type": "text", "id": "text_3", "label": "Text 3", "default": "Lifetime Exchange" },
        { "type": "color", "id": "bg_color_3", "label": "Icon 3 BG", "default": "#F1F8E9" },
        
        { "type": "image_picker", "id": "icon_4", "label": "Icon 4" },
        { "type": "text", "id": "text_4", "label": "Text 4", "default": "One Year Warranty" },
        { "type": "color", "id": "bg_color_4", "label": "Icon 4 BG", "default": "#FFFDE7" }
      ]
    },
    {
      "type": "promo_slider",
      "name": "Promo Slider (Wide)",
      "limit": 1,
      "settings": [
        { "type": "image_picker", "id": "slide_img_1", "label": "Slide 1 Image" },
        { "type": "url", "id": "slide_url_1", "label": "Slide 1 Link" },
        { "type": "image_picker", "id": "slide_img_2", "label": "Slide 2 Image" },
        { "type": "url", "id": "slide_url_2", "label": "Slide 2 Link" },
        { "type": "image_picker", "id": "slide_img_3", "label": "Slide 3 Image" },
        { "type": "url", "id": "slide_url_3", "label": "Slide 3 Link" },
        { "type": "image_picker", "id": "slide_img_4", "label": "Slide 4 Image" },
        { "type": "url", "id": "slide_url_4", "label": "Slide 4 Link" }
      ]
    },
    {
      "type": "promo_mosaic",
      "name": "Promo Mosaic Grid",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "image_left",
          "label": "Left Collage Image"
        },
        {
          "type": "image_picker",
          "id": "image_right",
          "label": "Right Banner Image"
        }
      ]
    },
    {
      "type": "collections_grid",
      "name": "Collections Grid",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "heading",
          "label": "Section Heading",
          "default": "CaratLane Collections"
        },
        { "type": "image_picker", "id": "coll_bg_1", "label": "Card 1 Background" },
        { "type": "image_picker", "id": "coll_logo_1", "label": "Card 1 Logo" },
        { "type": "url", "id": "coll_url_1", "label": "Card 1 Link" },
        
        { "type": "image_picker", "id": "coll_bg_2", "label": "Card 2 Background" },
        { "type": "image_picker", "id": "coll_logo_2", "label": "Card 2 Logo" },
        { "type": "url", "id": "coll_url_2", "label": "Card 2 Link" },
        
        { "type": "image_picker", "id": "coll_bg_3", "label": "Card 3 Background" },
        { "type": "image_picker", "id": "coll_logo_3", "label": "Card 3 Logo" },
        { "type": "url", "id": "coll_url_3", "label": "Card 3 Link" },
        
        { "type": "image_picker", "id": "coll_bg_4", "label": "Card 4 Background" },
        { "type": "image_picker", "id": "coll_logo_4", "label": "Card 4 Logo" },
        { "type": "url", "id": "coll_url_4", "label": "Card 4 Link" },
        
        { "type": "image_picker", "id": "coll_bg_5", "label": "Card 5 Background" },
        { "type": "image_picker", "id": "coll_logo_5", "label": "Card 5 Logo" },
        { "type": "url", "id": "coll_url_5", "label": "Card 5 Link" },
        
        {
          "type": "text",
          "id": "btn_text",
          "label": "Button Text",
          "default": "VIEW ALL COLLECTIONS"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "CaratLane Landing Pro",
      "blocks": [
        { "type": "trust_badges" },
        { "type": "hero_slide" },
        { "type": "promo_slider" },
        { "type": "trendsetters" },
        { "type": "wrapped_categories" },
        { "type": "promo_mosaic" },
        { "type": "collections_grid" }
      ]
    }
  ]
}
{% endschema %}
`,
  "cf-caratlane-product": `{% comment %}
  ConvertFlow — CaratLane Product Page (Phase 2)
  Dual CTA, Urgency Timers, Offer Banners, Full Details, Responsive.
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  :root {
    --cf-primary: {{ section.settings.color_primary }};
    --cf-accent: {{ section.settings.color_accent }};
    --cf-bg: {{ section.settings.color_bg }};
    --cf-text: {{ section.settings.color_text }};
    --cf-text-light: #666666;
    --cf-border-radius: {{ section.settings.border_radius }}px;
    --cf-font-heading: 'Playfair Display', serif;
    --cf-font-body: 'Inter', sans-serif;
    --cf-success: #16a34a;
    --cf-danger: #dc2626;
    --cf-warning: #f59e0b;
  }

  .cf-cl-p * { box-sizing: border-box; margin: 0; padding: 0; }
  .cf-cl-p {
    font-family: var(--cf-font-body);
    color: var(--cf-text);
    background: var(--cf-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    padding: clamp(20px, 4vw, 40px);
    max-width: 1440px;
    margin: 0 auto;
  }
  .cf-cl-p h1, .cf-cl-p h2, .cf-cl-p h3 {
    font-family: var(--cf-font-heading);
    color: var(--cf-primary);
  }

  /* ── Product Layout ── */
  .cf-cl-product-layout {
    display: grid;
    grid-template-columns: 1fr 480px;
    gap: clamp(30px, 5vw, 80px);
    align-items: start;
  }

  /* ── Gallery ── */
  .cf-cl-gallery {
    display: grid;
    grid-template-columns: 84px 1fr;
    gap: clamp(16px, 3vw, 24px);
    position: sticky;
    top: 20px;
  }
  .cf-cl-thumbnails {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .cf-cl-thumb {
    width: clamp(60px, 10vw, 84px);
    aspect-ratio: 1;
    border-radius: calc(var(--cf-border-radius) / 2);
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    background: #F6EFFB;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cf-cl-thumb:hover, .cf-cl-thumb.active {
    border-color: var(--cf-primary);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(73, 49, 97, 0.15);
  }
  .cf-cl-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .cf-cl-main-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--cf-border-radius);
    overflow: hidden;
    background: #FFF;
    border: 1px solid rgba(238,238,238,0.8);
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    transition: transform 0.4s ease;
    position: relative;
  }
  .cf-cl-main-image:hover { transform: scale(1.01); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
  .cf-cl-main-image img { width: 100%; height: 100%; object-fit: contain; }

  /* ── Wishlist Heart ── */
  .cf-cl-wishlist {
    position: absolute; top: 16px; right: 16px;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    z-index: 2;
  }
  .cf-cl-wishlist:hover { background: #fff; transform: scale(1.1); }
  .cf-cl-wishlist svg { width: 22px; height: 22px; color: var(--cf-danger); }

  /* ── Details ── */
  .cf-cl-details { padding: 0; }
  .cf-cl-breadcrumb { font-size: 12px; color: var(--cf-text-light); margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
  .cf-cl-breadcrumb a { color: var(--cf-primary); text-decoration: none; font-weight: 500; }
  .cf-cl-breadcrumb a:hover { text-decoration: underline; }
  .cf-cl-breadcrumb span { opacity: 0.5; }

  .cf-cl-title {
    font-size: clamp(24px, 3.5vw, 36px);
    margin-bottom: 8px;
    font-weight: 700;
    line-height: 1.2;
    text-wrap: balance;
  }
  .cf-cl-subtitle {
    font-size: 14px;
    color: var(--cf-text-light);
    margin-bottom: 16px;
    font-weight: 400;
  }
  .cf-cl-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }
  .cf-cl-stars { display: flex; gap: 2px; }
  .cf-cl-stars svg { width: 16px; height: 16px; fill: var(--cf-warning); color: var(--cf-warning); }
  .cf-cl-rating-text { font-size: 13px; color: var(--cf-text-light); font-weight: 500; }
  .cf-cl-rating-count { font-size: 13px; color: var(--cf-primary); font-weight: 600; cursor: pointer; }
  .cf-cl-rating-count:hover { text-decoration: underline; }

  /* ── Price Block ── */
  .cf-cl-price-wrap {
    display: flex;
    align-items: baseline;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(238,238,238,0.6);
  }
  .cf-cl-price {
    font-size: clamp(28px, 4vw, 36px);
    font-weight: 700;
    color: var(--cf-primary);
  }
  .cf-cl-compare {
    font-size: clamp(16px, 2vw, 18px);
    color: var(--cf-text-light);
    text-decoration: line-through;
  }
  .cf-cl-discount-badge {
    background: linear-gradient(135deg, var(--cf-success), #22c55e);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    letter-spacing: 0.3px;
  }
  .cf-cl-tax-label {
    font-size: 12px;
    color: var(--cf-text-light);
    margin-top: -14px;
    margin-bottom: 16px;
  }

  /* ── Urgency Bar ── */
  .cf-cl-urgency {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: linear-gradient(90deg, #FEF2F2, #fff, #FEF2F2);
    background-size: 200% auto;
    animation: cfUrgencyPulse 3s ease infinite;
    border: 1px solid rgba(220, 38, 38, 0.15);
    border-radius: calc(var(--cf-border-radius) - 4px);
    margin-bottom: 16px;
  }
  @keyframes cfUrgencyPulse { 0%, 100% { background-position: 0% center; } 50% { background-position: 100% center; } }
  .cf-cl-urgency-icon { font-size: 18px; flex-shrink: 0; animation: cfFirePulse 1s ease infinite; }
  @keyframes cfFirePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .cf-cl-urgency-text { font-size: 13px; font-weight: 600; color: var(--cf-danger); }
  .cf-cl-urgency-text strong { font-weight: 800; }

  /* ── Dispatch Timer ── */
  .cf-cl-dispatch {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    background: #F0FDF4;
    border: 1px solid rgba(22, 163, 74, 0.15);
    border-radius: calc(var(--cf-border-radius) - 4px);
    margin-bottom: 20px;
  }
  .cf-cl-dispatch svg { width: 20px; height: 20px; color: var(--cf-success); flex-shrink: 0; }
  .cf-cl-dispatch-text { font-size: 13px; color: #15803d; font-weight: 500; }
  .cf-cl-dispatch-text strong { font-weight: 700; color: var(--cf-success); }
  .cf-cl-dispatch-timer { font-family: 'SF Mono', 'Fira Code', monospace; font-weight: 700; color: var(--cf-success); background: rgba(22,163,74,0.08); padding: 2px 8px; border-radius: 6px; letter-spacing: 1px; }

  /* ── Offer Banner ── */
  .cf-cl-offers {
    background: linear-gradient(135deg, #493161 0%, #5e3d7a 100%);
    border-radius: var(--cf-border-radius);
    padding: 20px;
    margin-bottom: 20px;
    color: #fff;
  }
  .cf-cl-offers-title { font-size: 14px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; letter-spacing: 0.3px; }
  .cf-cl-offers-title svg { width: 18px; height: 18px; color: var(--cf-accent); }
  .cf-cl-offer-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-top: 1px solid rgba(255,255,255,0.12);
    font-size: 13px;
    line-height: 1.5;
  }
  .cf-cl-offer-item:first-of-type { border-top: none; }
  .cf-cl-offer-icon { width: 28px; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
  .cf-cl-offer-detail { flex: 1; }
  .cf-cl-offer-detail strong { color: var(--cf-accent); }

  /* ── Promo Strip ── */
  .cf-cl-promo-strip {
    background: linear-gradient(90deg, #FDF9F1, #fff, #FDF9F1);
    background-size: 200% auto;
    animation: cfPromoGlow 6s linear infinite;
    border: 1px dashed rgba(222, 187, 67, 0.8);
    border-radius: calc(var(--cf-border-radius) - 4px);
    padding: 14px 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 10px rgba(222, 187, 67, 0.05);
  }
  @keyframes cfPromoGlow { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
  .cf-cl-promo-strip svg { width: 24px; height: 24px; color: #DEBB43; flex-shrink: 0; }
  .cf-cl-promo-text { font-size: 14px; color: var(--cf-text); font-weight: 500; flex: 1; line-height: 1.5; }
  .cf-cl-promo-code { font-weight: 700; color: var(--cf-primary); letter-spacing: 0.5px; border-bottom: 1px dashed var(--cf-primary); cursor: pointer; transition: color 0.2s; }
  .cf-cl-promo-code:hover { color: var(--cf-accent); border-color: var(--cf-accent); }

  /* ── Buy Module ── */
  .cf-cl-form { margin-bottom: 24px; transition: all 0.3s ease; }
  .cf-cl-btn-group { display: flex; gap: 14px; margin-bottom: 16px; }
  .cf-cl-btn-atc {
    flex: 1;
    padding: 16px 20px;
    background: transparent;
    color: var(--cf-primary);
    border: 2px solid var(--cf-primary);
    border-radius: 40px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--cf-font-body);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cf-cl-btn-atc:hover {
    background: var(--cf-primary);
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(73, 49, 97, 0.25);
  }
  .cf-cl-btn-atc svg { width: 18px; height: 18px; }
  .cf-cl-btn-buy {
    flex: 1;
    padding: 16px 20px;
    background: var(--cf-accent);
    color: #fff;
    border: 2px solid var(--cf-accent);
    border-radius: 40px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--cf-font-body);
    box-shadow: 0 4px 15px rgba(222, 187, 67, 0.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cf-cl-btn-buy:hover {
    background: #cca72c;
    border-color: #cca72c;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(222, 187, 67, 0.4);
  }
  .cf-cl-btn-buy svg { width: 18px; height: 18px; }

  /* ── Trust Badges ── */
  .cf-cl-trust {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 30px;
    padding: 24px;
    background: #F6EFFB;
    border-radius: var(--cf-border-radius);
    border: 1px solid rgba(73, 49, 97, 0.05);
  }
  .cf-cl-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 600;
  }
  .cf-cl-trust-item svg { width: 22px; height: 22px; color: var(--cf-primary); }

  /* ── Product Details Accordion ── */
  .cf-cl-accordion { margin-bottom: 24px; border-top: 1px solid rgba(238,238,238,0.6); }
  .cf-cl-accordion-item { border-bottom: 1px solid rgba(238,238,238,0.6); }
  .cf-cl-accordion-btn {
    width: 100%; background: none; border: none;
    padding: 18px 0; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    font-family: var(--cf-font-body);
    font-size: 15px; font-weight: 600; color: var(--cf-text);
    transition: color 0.2s;
  }
  .cf-cl-accordion-btn:hover { color: var(--cf-primary); }
  .cf-cl-accordion-btn svg { width: 18px; height: 18px; color: var(--cf-text-light); transition: transform 0.3s ease; }
  .cf-cl-accordion-item.open .cf-cl-accordion-btn svg { transform: rotate(180deg); }
  .cf-cl-accordion-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s;
    padding: 0 0;
  }
  .cf-cl-accordion-item.open .cf-cl-accordion-body { max-height: 500px; padding-bottom: 20px; }
  .cf-cl-accordion-body p, .cf-cl-accordion-body ul { font-size: 14px; color: var(--cf-text-light); line-height: 1.8; }
  .cf-cl-accordion-body ul { padding-left: 20px; }
  .cf-cl-accordion-body li { margin-bottom: 6px; }
  .cf-cl-spec-grid { display: grid; grid-template-columns: 140px 1fr; gap: 10px 20px; font-size: 14px; }
  .cf-cl-spec-label { font-weight: 600; color: var(--cf-text); }
  .cf-cl-spec-value { color: var(--cf-text-light); }

  /* ── Share Row ── */
  .cf-cl-share { display: flex; align-items: center; gap: 12px; margin-top: 10px; padding-top: 20px; border-top: 1px solid rgba(238,238,238,0.5); }
  .cf-cl-share-label { font-size: 13px; font-weight: 600; color: var(--cf-text); }
  .cf-cl-share-icon { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(238,238,238,0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .cf-cl-share-icon:hover { border-color: var(--cf-primary); background: var(--cf-primary); color: #fff; }
  .cf-cl-share-icon svg { width: 16px; height: 16px; }

  /* ── Responsive Mobile Hierarchy ── */
  @media (max-width: 1024px) {
    .cf-cl-product-layout { grid-template-columns: 1fr 380px; gap: 40px; }
  }
  @media (max-width: 900px) {
    .cf-cl-product-layout { grid-template-columns: 1fr; gap: 30px; }
    .cf-cl-gallery { grid-template-columns: 1fr; position: static; }
    .cf-cl-thumbnails { flex-direction: row; overflow-x: auto; order: 2; scroll-snap-type: x mandatory; padding-bottom: 8px; scrollbar-width: none; }
    .cf-cl-thumbnails::-webkit-scrollbar { display: none; }
    .cf-cl-thumb { flex: 0 0 clamp(70px, 15vw, 100px); scroll-snap-align: center; }
    .cf-cl-main-image { order: 1; border-radius: 8px; }
    .cf-cl-offers { margin-bottom: 16px; }
  }
  @media (max-width: 600px) {
    .cf-cl-p { padding: 16px; }
    .cf-cl-trust { grid-template-columns: 1fr; gap: 12px; padding: 16px; }
    .cf-cl-price-wrap { margin-bottom: 16px; padding-bottom: 14px; }
    .cf-cl-btn-group { flex-direction: column; gap: 10px; }
    /* Sticky Mobile CTA */
    .cf-cl-form { position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(255,255,255,0.97); backdrop-filter: blur(12px); padding: 14px 16px; box-shadow: 0 -4px 30px rgba(0,0,0,0.12); z-index: 1000; margin: 0; border-top: 1px solid rgba(0,0,0,0.05); border-radius: 16px 16px 0 0; }
    .cf-cl-btn-group { flex-direction: row; margin-bottom: 0; }
    .cf-cl-btn-atc, .cf-cl-btn-buy { padding: 14px 10px; font-size: 14px; border-radius: 12px; }
    .cf-cl-details { padding-bottom: 110px; }
    .cf-cl-spec-grid { grid-template-columns: 120px 1fr; gap: 8px 12px; font-size: 13px; }
    .cf-cl-offers { padding: 16px; }
  }
{% endstyle %}

<div class="cf-cl-p">
  <div class="cf-cl-product-layout">

    <!-- GALLERY -->
    <div class="cf-cl-gallery">
      <div class="cf-cl-thumbnails">
        {% for image in product.images %}
          <div class="cf-cl-thumb {% if forloop.first %}active{% endif %}" onclick="document.getElementById('cf-main-img').src='{{ image | img_url: 'master' }}'; this.parentNode.querySelectorAll('.cf-cl-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
            <img src="{{ image | img_url: '200x' }}" alt="{{ product.title }}">
          </div>
        {% else %}
          <div class="cf-cl-thumb active"><img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1.png" alt="Fallback"></div>
          <div class="cf-cl-thumb"><img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2.png" alt="Fallback"></div>
          <div class="cf-cl-thumb"><img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-3.png" alt="Fallback"></div>
        {% endfor %}
      </div>
      <div class="cf-cl-main-image">
        {% if product.featured_image %}
          <img id="cf-main-img" src="{{ product.featured_image | img_url: 'master' }}" alt="{{ product.title }}">
        {% else %}
          <img id="cf-main-img" src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1.png" alt="Fallback">
        {% endif %}
        <button class="cf-cl-wishlist" aria-label="Add to Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
    </div>

    <!-- DETAILS -->
    <div class="cf-cl-details">
      <!-- Breadcrumb -->
      <div class="cf-cl-breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <a href="{{ collection.url | default: '/collections/all' }}">{{ collection.title | default: 'Shop' }}</a>
        <span>›</span>
        {{ product.title | default: section.settings.fallback_title | truncate: 30 }}
      </div>

      <h1 class="cf-cl-title">{{ product.title | default: section.settings.fallback_title }}</h1>
      <p class="cf-cl-subtitle">{{ section.settings.subtitle_text }}</p>

      <!-- Rating -->
      <div class="cf-cl-rating">
        <div class="cf-cl-stars">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24" style="opacity:0.3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <span class="cf-cl-rating-text">4.2</span>
        <span class="cf-cl-rating-count">({{ section.settings.review_count }} Reviews)</span>
      </div>

      <!-- Price -->
      <div class="cf-cl-price-wrap">
        <span class="cf-cl-price">{{ product.price | money | default: '₹14,999' }}</span>
        {% if product.compare_at_price > product.price %}
          <span class="cf-cl-compare">{{ product.compare_at_price | money }}</span>
          <span class="cf-cl-discount-badge">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price }}% OFF</span>
        {% else %}
          <span class="cf-cl-compare">₹19,999</span>
          <span class="cf-cl-discount-badge">25% OFF</span>
        {% endif %}
      </div>
      <p class="cf-cl-tax-label">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

      <!-- Urgency -->
      {% if section.settings.show_urgency %}
      <div class="cf-cl-urgency">
        <span class="cf-cl-urgency-icon">🔥</span>
        <span class="cf-cl-urgency-text">{{ section.settings.urgency_text }}</span>
      </div>
      {% endif %}

      <!-- Dispatch Timer -->
      {% if section.settings.show_dispatch %}
      <div class="cf-cl-dispatch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        <span class="cf-cl-dispatch-text">Order within <span class="cf-cl-dispatch-timer" id="cf-dispatch-timer">02:14:33</span> to get it <strong>dispatched today</strong>.</span>
      </div>
      {% endif %}

      <!-- Offer Banner -->
      {% if section.settings.show_offers %}
      <div class="cf-cl-offers">
        <div class="cf-cl-offers-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          Available Offers
        </div>
        <div class="cf-cl-offer-item">
          <span class="cf-cl-offer-icon">🏦</span>
          <span class="cf-cl-offer-detail">{{ section.settings.offer_1 }}</span>
        </div>
        <div class="cf-cl-offer-item">
          <span class="cf-cl-offer-icon">💳</span>
          <span class="cf-cl-offer-detail">{{ section.settings.offer_2 }}</span>
        </div>
        <div class="cf-cl-offer-item">
          <span class="cf-cl-offer-icon">🎁</span>
          <span class="cf-cl-offer-detail">{{ section.settings.offer_3 }}</span>
        </div>
      </div>
      {% endif %}

      <!-- Promo Strip -->
      {% if section.settings.show_promo_strip %}
      <div class="cf-cl-promo-strip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        <div class="cf-cl-promo-text">{{ section.settings.promo_text }} <span class="cf-cl-promo-code">{{ section.settings.promo_code }}</span></div>
      </div>
      {% endif %}

      <!-- Buy Module: Dual CTA -->
      {% form 'product', product, class: 'cf-cl-form' %}
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
        <div class="cf-cl-btn-group">
          <button type="submit" class="cf-cl-btn-atc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {{ section.settings.add_to_cart_text }}
          </button>
          <button type="submit" name="checkout" class="cf-cl-btn-buy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            {{ section.settings.buy_now_text }}
          </button>
        </div>
      {% endform %}

      <!-- Trust Badges -->
      <div class="cf-cl-trust">
        <div class="cf-cl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          {{ section.settings.trust_1 }}
        </div>
        <div class="cf-cl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          {{ section.settings.trust_2 }}
        </div>
        <div class="cf-cl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {{ section.settings.trust_3 }}
        </div>
        <div class="cf-cl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          {{ section.settings.trust_4 }}
        </div>
      </div>

      <!-- Product Details Accordion -->
      <div class="cf-cl-accordion">
        <div class="cf-cl-accordion-item open">
          <button class="cf-cl-accordion-btn" onclick="this.parentElement.classList.toggle('open')">
            {{ section.settings.desc_heading }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="cf-cl-accordion-body">
            {{ product.description | default: '<p>Experience the perfect blend of modern aesthetics and traditional craftsmanship with this exquisite piece. Designed with precision and adorned with the finest materials, this product is a must-have for discerning tastes.</p>' }}
          </div>
        </div>
        <div class="cf-cl-accordion-item">
          <button class="cf-cl-accordion-btn" onclick="this.parentElement.classList.toggle('open')">
            Specifications
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="cf-cl-accordion-body">
            <div class="cf-cl-spec-grid">
              <span class="cf-cl-spec-label">Material</span>
              <span class="cf-cl-spec-value">{{ section.settings.spec_material }}</span>
              <span class="cf-cl-spec-label">Weight</span>
              <span class="cf-cl-spec-value">{{ section.settings.spec_weight }}</span>
              <span class="cf-cl-spec-label">Purity</span>
              <span class="cf-cl-spec-value">{{ section.settings.spec_purity }}</span>
              <span class="cf-cl-spec-label">Stone</span>
              <span class="cf-cl-spec-value">{{ section.settings.spec_stone }}</span>
              <span class="cf-cl-spec-label">Occasion</span>
              <span class="cf-cl-spec-value">{{ section.settings.spec_occasion }}</span>
            </div>
          </div>
        </div>
        <div class="cf-cl-accordion-item">
          <button class="cf-cl-accordion-btn" onclick="this.parentElement.classList.toggle('open')">
            Shipping & Returns
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="cf-cl-accordion-body">
            <ul>
              <li>Free standard shipping on all orders above ₹999</li>
              <li>Express delivery within 2-3 business days</li>
              <li>15-day hassle-free returns</li>
              <li>Lifetime exchange on all products</li>
              <li>100% certified and hallmarked</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Share -->
      <div class="cf-cl-share">
        <span class="cf-cl-share-label">Share:</span>
        <span class="cf-cl-share-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></span>
        <span class="cf-cl-share-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></span>
        <span class="cf-cl-share-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></span>
        <span class="cf-cl-share-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></span>
      </div>
    </div>

  </div>
</div>

<!-- Dispatch Countdown Timer Script -->
<script>
(function(){
  var el = document.getElementById('cf-dispatch-timer');
  if (!el) return;
  var deadline = new Date();
  deadline.setHours(23,59,59,0);
  function tick(){
    var now = new Date();
    var diff = deadline - now;
    if(diff <= 0) { el.textContent = '00:00:00'; return; }
    var h = Math.floor(diff/3600000);
    var m = Math.floor((diff%3600000)/60000);
    var s = Math.floor((diff%60000)/1000);
    el.textContent = (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>

<!-- ── FOOTER ── -->
<style>
  .cf-cl-footer {
    background: linear-gradient(180deg, #2d1b3d 0%, #1a0f24 100%);
    color: rgba(255,255,255,0.8);
    font-family: var(--cf-font-body, 'Inter', sans-serif);
    padding: 0; margin-top: 60px;
  }
  .cf-cl-footer * { box-sizing: border-box; margin: 0; padding: 0; }
  .cf-cl-footer a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s; }
  .cf-cl-footer a:hover { color: #DEBB43; }
  .cf-cl-footer-newsletter {
    background: linear-gradient(90deg, #493161, #5e3d7a);
    padding: 36px 40px; display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap;
  }
  .cf-cl-footer-nl-text { flex: 1; min-width: 280px; }
  .cf-cl-footer-nl-text h3 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .cf-cl-footer-nl-text p { font-size: 14px; color: rgba(255,255,255,0.75); }
  .cf-cl-footer-nl-form { display: flex; gap: 10px; flex: 1; max-width: 460px; min-width: 280px; }
  .cf-cl-footer-nl-form input { flex: 1; padding: 14px 20px; border: none; border-radius: 10px; font-family: inherit; font-size: 14px; outline: none; background: rgba(255,255,255,0.15); color: #fff; }
  .cf-cl-footer-nl-form input::placeholder { color: rgba(255,255,255,0.5); }
  .cf-cl-footer-nl-form button { padding: 14px 28px; border: none; border-radius: 10px; background: #DEBB43; color: #1a0f24; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.3s; white-space: nowrap; }
  .cf-cl-footer-nl-form button:hover { background: #cca72c; }
  .cf-cl-footer-main { max-width: 1440px; margin: 0 auto; padding: 50px 40px 30px; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
  .cf-cl-footer-brand h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 14px; }
  .cf-cl-footer-brand p { font-size: 14px; line-height: 1.7; margin-bottom: 20px; color: rgba(255,255,255,0.6); }
  .cf-cl-footer-socials { display: flex; gap: 12px; }
  .cf-cl-footer-social { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; transition: all 0.3s; cursor: pointer; }
  .cf-cl-footer-social:hover { background: #DEBB43; transform: scale(1.1); }
  .cf-cl-footer-social svg { width: 18px; height: 18px; color: rgba(255,255,255,0.8); }
  .cf-cl-footer-social:hover svg { color: #1a0f24; }
  .cf-cl-footer-col h4 { font-size: 14px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .cf-cl-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .cf-cl-footer-col li a { font-size: 14px; }
  .cf-cl-footer-bottom { max-width: 1440px; margin: 0 auto; padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .cf-cl-footer-copy { font-size: 13px; color: rgba(255,255,255,0.4); }
  .cf-cl-footer-payments { display: flex; gap: 10px; }
  .cf-cl-footer-pay-icon { width: 44px; height: 28px; border-radius: 4px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.6); }
  @media (max-width: 900px) { .cf-cl-footer-main { grid-template-columns: 1fr 1fr; gap: 30px; padding: 40px 24px 24px; } .cf-cl-footer-newsletter { padding: 28px 24px; } .cf-cl-footer-bottom { padding: 20px 24px; } }
  @media (max-width: 600px) { .cf-cl-footer-main { grid-template-columns: 1fr; gap: 28px; padding: 30px 16px 20px; } .cf-cl-footer-newsletter { flex-direction: column; padding: 24px 16px; gap: 16px; } .cf-cl-footer-nl-form { flex-direction: column; max-width: 100%; } .cf-cl-footer-nl-form button { width: 100%; } .cf-cl-footer-bottom { flex-direction: column; text-align: center; padding: 16px; } }
</style>

<footer class="cf-cl-footer">
  <div class="cf-cl-footer-newsletter">
    <div class="cf-cl-footer-nl-text">
      <h3>Stay in the Loop</h3>
      <p>Subscribe for exclusive offers, new arrivals & styling tips.</p>
    </div>
    <div class="cf-cl-footer-nl-form">
      <input type="email" placeholder="Enter your email address…">
      <button>Subscribe</button>
    </div>
  </div>
  <div class="cf-cl-footer-main">
    <div class="cf-cl-footer-brand">
      <h2>{{ shop.name | default: 'CaratLane' }}</h2>
      <p>Bringing you the finest handcrafted jewellery since 2008. BIS Hallmarked. Certified. Trusted.</p>
      <div class="cf-cl-footer-socials">
        <a class="cf-cl-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
        <a class="cf-cl-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
        <a class="cf-cl-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
        <a class="cf-cl-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
      </div>
    </div>
    <div class="cf-cl-footer-col">
      <h4>Shop</h4>
      <ul><li><a href="/collections/all">All Jewellery</a></li><li><a href="#">Rings</a></li><li><a href="#">Earrings</a></li><li><a href="#">Necklaces</a></li><li><a href="#">Bangles</a></li></ul>
    </div>
    <div class="cf-cl-footer-col">
      <h4>Help</h4>
      <ul><li><a href="#">Track Order</a></li><li><a href="#">Returns & Exchange</a></li><li><a href="#">Shipping Info</a></li><li><a href="#">FAQs</a></li><li><a href="#">Contact Us</a></li></ul>
    </div>
    <div class="cf-cl-footer-col">
      <h4>Company</h4>
      <ul><li><a href="#">About Us</a></li><li><a href="#">Careers</a></li><li><a href="#">Store Locator</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms</a></li></ul>
    </div>
  </div>
  <div class="cf-cl-footer-bottom">
    <span class="cf-cl-footer-copy">&copy; {{ 'now' | date: '%Y' }} {{ shop.name | default: 'CaratLane' }}. All rights reserved.</span>
    <div class="cf-cl-footer-payments">
      <span class="cf-cl-footer-pay-icon">VISA</span><span class="cf-cl-footer-pay-icon">MC</span><span class="cf-cl-footer-pay-icon">AMEX</span><span class="cf-cl-footer-pay-icon">UPI</span><span class="cf-cl-footer-pay-icon">EMI</span><span class="cf-cl-footer-pay-icon">COD</span>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "CaratLane Product Page",
  "settings": [
    {
      "type": "header",
      "content": "Theme Colors"
    },
    {
      "type": "color",
      "id": "color_primary",
      "label": "Primary Brand Color",
      "default": "#493161"
    },
    {
      "type": "color",
      "id": "color_accent",
      "label": "Accent Color",
      "default": "#DEBB43"
    },
    {
      "type": "color",
      "id": "color_bg",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "color",
      "id": "color_text",
      "label": "Text Color",
      "default": "#333333"
    },
    {
      "type": "range",
      "id": "border_radius",
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px",
      "label": "Corner Radius",
      "default": 12
    },
    {
      "type": "header",
      "content": "Product Settings"
    },
    {
      "type": "text",
      "id": "fallback_title",
      "label": "Fallback Title (if no product)",
      "default": "Elegant Diamond Solitaire Ring"
    },
    {
      "type": "text",
      "id": "subtitle_text",
      "label": "Product Subtitle",
      "default": "Handcrafted 18K Rose Gold • BIS Hallmarked"
    },
    {
      "type": "text",
      "id": "review_count",
      "label": "Review Count",
      "default": "1,247"
    },
    {
      "type": "text",
      "id": "add_to_cart_text",
      "label": "Add to Cart Button Text",
      "default": "Add to Cart"
    },
    {
      "type": "text",
      "id": "buy_now_text",
      "label": "Buy Now Button Text",
      "default": "Buy Now"
    },
    {
      "type": "header",
      "content": "Urgency & Scarcity"
    },
    {
      "type": "checkbox",
      "id": "show_urgency",
      "label": "Show Urgency Bar",
      "default": true
    },
    {
      "type": "text",
      "id": "urgency_text",
      "label": "Urgency Text",
      "default": "Selling Fast! Only <strong>3 left</strong> in stock — 27 people are viewing this right now."
    },
    {
      "type": "checkbox",
      "id": "show_dispatch",
      "label": "Show Dispatch Timer",
      "default": true
    },
    {
      "type": "header",
      "content": "Offer Banner"
    },
    {
      "type": "checkbox",
      "id": "show_offers",
      "label": "Show Offers Block",
      "default": true
    },
    {
      "type": "text",
      "id": "offer_1",
      "label": "Offer 1",
      "default": "Get <strong>Flat 10% OFF</strong> on HDFC Bank Credit Card. Min order ₹5,000."
    },
    {
      "type": "text",
      "id": "offer_2",
      "label": "Offer 2",
      "default": "No Cost <strong>EMI starting ₹1,250/month</strong> on select banks."
    },
    {
      "type": "text",
      "id": "offer_3",
      "label": "Offer 3",
      "default": "Free <strong>Gift Wrapping</strong> + complimentary cleaning kit on this item."
    },
    {
      "type": "header",
      "content": "Promo Strip"
    },
    {
      "type": "checkbox",
      "id": "show_promo_strip",
      "label": "Show Promo Strip",
      "default": true
    },
    {
      "type": "text",
      "id": "promo_text",
      "label": "Promo Text",
      "default": "Get Flat 10% OFF on making charges. Use Code:"
    },
    {
      "type": "text",
      "id": "promo_code",
      "label": "Promo Code",
      "default": "CARATEST"
    },
    {
      "type": "header",
      "content": "Trust Badges"
    },
    {
      "type": "text",
      "id": "trust_1",
      "label": "Trust Badge 1",
      "default": "100% Certified"
    },
    {
      "type": "text",
      "id": "trust_2",
      "label": "Trust Badge 2",
      "default": "Secure Checkout"
    },
    {
      "type": "text",
      "id": "trust_3",
      "label": "Trust Badge 3",
      "default": "15-Day Returns"
    },
    {
      "type": "text",
      "id": "trust_4",
      "label": "Trust Badge 4",
      "default": "Lifetime Exchange"
    },
    {
      "type": "header",
      "content": "Product Details"
    },
    {
      "type": "text",
      "id": "desc_heading",
      "label": "Description Heading",
      "default": "Product Description"
    },
    {
      "type": "text",
      "id": "spec_material",
      "label": "Spec: Material",
      "default": "18K Rose Gold"
    },
    {
      "type": "text",
      "id": "spec_weight",
      "label": "Spec: Weight",
      "default": "2.45 grams"
    },
    {
      "type": "text",
      "id": "spec_purity",
      "label": "Spec: Purity",
      "default": "750 (18K)"
    },
    {
      "type": "text",
      "id": "spec_stone",
      "label": "Spec: Stone",
      "default": "SI IJ Diamond, 0.15 Carat"
    },
    {
      "type": "text",
      "id": "spec_occasion",
      "label": "Spec: Occasion",
      "default": "Everyday, Office, Party"
    }
  ],
  "presets": [
    {
      "name": "CaratLane Product Page"
    }
  ]
}
{% endschema %}
`,
  "cf-fashion-clothing-cart": `{% comment %}ConvertFlow: VŌLT Fashion — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #0A0A0A; --cf-bg: #F5F3EF; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF VŌLT Fashion Cart",
  "settings": [],
  "presets": [{ "name": "CF VŌLT Fashion Cart" }]
}
{% endschema %}`,
  "cf-fashion-clothing-collection": `{% comment %}ConvertFlow: VŌLT Fashion — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #0A0A0A; --cf-bg: #F5F3EF; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF VŌLT Fashion Collection",
  "settings": [],
  "presets": [{ "name": "CF VŌLT Fashion Collection" }]
}
{% endschema %}`,
  "cf-fashion-clothing-landing": `{% comment %}ConvertFlow: VŌLT Fashion — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
:root{--ink:#0A0A0A;--paper:#F5F3EF;--accent:#E8D5B0;--mid:#888;--border:#E0DDD8;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--paper);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3,.bebas{font-family:'Bebas Neue',sans-serif;font-weight:400;letter-spacing:2px;}

/* PROMO */
.promo{background:var(--ink);color:#fff;text-align:center;padding:11px;font-size:12px;letter-spacing:3px;text-transform:uppercase;}
.promo a{color:var(--accent);text-decoration:none;}

/* HEADER */
header{background:var(--paper);padding:20px 60px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
.brand{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:6px;color:var(--ink);text-decoration:none;}
nav{display:flex;gap:36px;list-style:none;}
nav a{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--mid);}
.h-actions{display:flex;align-items:center;gap:20px;}
.h-btn{background:var(--ink);color:#fff;padding:10px 24px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;text-decoration:none;transition:opacity .2s;}
.h-btn:hover{opacity:.8;}

/* HERO — full viewport editorial */
.hero{display:grid;grid-template-columns:1.1fr .9fr;height:92vh;border-bottom:1px solid var(--border);}
.hero-visual{background:#1A1A1A;display:flex;align-items:flex-end;padding:60px;position:relative;overflow:hidden;}
.hero-visual::before{content:'COLLECTION';position:absolute;top:50%;left:-80px;transform:translateY(-50%) rotate(-90deg);font-family:'Bebas Neue',sans-serif;font-size:200px;color:rgba(255,255,255,.04);letter-spacing:10px;white-space:nowrap;}
.hero-tag{display:inline-flex;align-items:center;gap:12px;color:var(--accent);font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;}
.hero-tag::before{content:'';width:32px;height:1px;background:var(--accent);}

.hero-content{padding:80px 80px 80px 70px;display:flex;flex-direction:column;justify-content:center;position:relative;}
.hero-content h1{font-size:110px;line-height:.92;margin:20px 0 30px;color:var(--ink);}
.hero-content p{font-size:17px;color:var(--mid);line-height:1.8;max-width:380px;margin-bottom:48px;font-weight:300;}
.hero-cta-group{display:flex;gap:16px;}
.btn-dark{background:var(--ink);color:#fff;padding:18px 40px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;transition:opacity .2s;}
.btn-dark:hover{opacity:.8;}
.btn-outline{background:transparent;color:var(--ink);border:1px solid var(--ink);padding:17px 40px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;transition:all .2s;}
.btn-outline:hover{background:var(--ink);color:#fff;}
.hero-scroll{position:absolute;bottom:40px;right:60px;display:flex;align-items:center;gap:12px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--mid);}
.hero-scroll::after{content:'';width:40px;height:1px;background:var(--mid);}

/* CATEGORIES */
.cats{display:flex;border-bottom:1px solid var(--border);}
.cat{flex:1;padding:32px;text-align:center;border-right:1px solid var(--border);text-decoration:none;color:var(--ink);transition:background .2s;position:relative;overflow:hidden;}
.cat:last-child{border-right:none;}
.cat:hover{background:var(--ink);}
.cat:hover .cat-label,.cat:hover .cat-count{color:#fff;}
.cat-label{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;display:block;margin-bottom:4px;transition:color .2s;}
.cat-count{font-size:11px;color:var(--mid);letter-spacing:2px;text-transform:uppercase;transition:color .2s;}

/* PRODUCTS */
.shop{padding:100px 60px;max-width:1400px;margin:0 auto;}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;}
.sec-head h2{font-size:64px;color:var(--ink);}
.view-all{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--mid);text-decoration:none;border-bottom:1px solid var(--mid);padding-bottom:4px;}
.view-all:hover{color:var(--ink);border-color:var(--ink);}

.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.prod-card{position:relative;cursor:pointer;}
.prod-card:hover .pc-overlay{opacity:1;}
.pc-img{aspect-ratio:3/4;background:#E8E4DC;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;margin-bottom:18px;}
.pc-img:nth-child(odd){background:#1A1A1A;}
.pc-img svg{width:35%;color:rgba(0,0,0,.15);transition:transform .6s;}
.prod-card:hover .pc-img svg{transform:scale(1.05);}
.pc-overlay{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;}
.pc-overlay-btn{background:#fff;color:var(--ink);padding:12px 28px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;}
.pc-badge{position:absolute;top:16px;left:16px;background:var(--ink);color:#fff;padding:5px 12px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;z-index:2;}
.pc-badge.sale{background:#C0392B;}
.pc-name{font-weight:700;font-size:14px;margin-bottom:4px;}
.pc-type{font-size:12px;color:var(--mid);margin-bottom:8px;letter-spacing:1px;}
.pc-prices{display:flex;gap:10px;align-items:center;}
.pc-price{font-size:15px;font-weight:700;}
.pc-old{font-size:13px;color:var(--mid);text-decoration:line-through;}

/* EDITORIAL STRIP */
.editorial{display:grid;grid-template-columns:1fr 1fr;height:600px;margin:40px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.ed-left{background:#1a1a1a;display:flex;flex-direction:column;justify-content:flex-end;padding:60px;position:relative;overflow:hidden;}
.ed-left::before{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 60%);}
.ed-left-content{position:relative;z-index:1;}
.ed-left h2{font-size:72px;color:#fff;margin-bottom:16px;}
.ed-left p{font-size:15px;color:rgba(255,255,255,.6);margin-bottom:30px;max-width:360px;line-height:1.8;}
.ed-right{display:grid;grid-template-rows:1fr 1fr;}
.ed-item{background:#2A2A2A;display:flex;flex-direction:column;justify-content:flex-end;padding:40px;border-bottom:1px solid rgba(255,255,255,.05);position:relative;}
.ed-item:last-child{border-bottom:none;background:#F0EBE0;}
.ed-item h3{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;letter-spacing:2px;margin-bottom:8px;}
.ed-item:last-child h3{color:var(--ink);}
.ed-item p{font-size:13px;color:rgba(255,255,255,.5);letter-spacing:1px;}
.ed-item:last-child p{color:var(--mid);}

/* SIZE GUIDE BAND */
.size-band{background:var(--ink);color:#fff;padding:40px 60px;display:flex;align-items:center;justify-content:space-between;gap:40px;}
.sb-text h3{font-size:32px;margin-bottom:8px;}
.sb-text p{font-size:14px;color:rgba(255,255,255,.5);}
.sb-sizes{display:flex;gap:16px;}
.sz{width:52px;height:52px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;}
.sz:hover,.sz.active{background:#fff;color:var(--ink);}
.sb-btn{background:#fff;color:var(--ink);padding:16px 32px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;white-space:nowrap;transition:opacity .2s;}
.sb-btn:hover{opacity:.85;}

/* FOOTER */
footer{background:var(--ink);padding:80px 60px 40px;}
.f-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.1);}
.f-brand a{font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:6px;color:#fff;text-decoration:none;display:block;margin-bottom:20px;}
.f-brand p{font-size:13px;color:rgba(255,255,255,.4);line-height:1.9;max-width:280px;}
.f-col h4{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:24px;}
.f-col ul{list-style:none;}
.f-col li{margin-bottom:12px;}
.f-col a{color:rgba(255,255,255,.6);text-decoration:none;font-size:14px;transition:color .2s;}
.f-col a:hover{color:#fff;}
.f-bottom{display:flex;justify-content:space-between;padding-top:30px;font-size:11px;color:rgba(255,255,255,.25);letter-spacing:1px;}

@media(max-width:1024px){.hero{grid-template-columns:1fr;height:auto}.hero-content{padding:60px 40px}.hero-content h1{font-size:72px}.prod-grid{grid-template-columns:repeat(2,1fr)}.editorial{grid-template-columns:1fr;height:auto}.f-top{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}nav{display:none}.shop{padding:60px 20px}.cats{flex-wrap:wrap}.cat{min-width:50%}.size-band{flex-direction:column;padding:40px 20px}.f-top{grid-template-columns:1fr;gap:40px}}
</style>
<div class="promo">New Season Drop — Extra 15% off with code VOLT15 &nbsp;<a href="#">Shop Now →</a></div>
<header>
  <a href="#" class="brand">VŌLT</a>
  <nav>
    <li><a href="#">New In</a></li>
    <li><a href="#">Women</a></li>
    <li><a href="#">Men</a></li>
    <li><a href="#">Denim</a></li>
    <li><a href="#">Sale</a></li>
  </nav>
  <div class="h-actions">
    <a href="#" class="h-btn">Bag (0)</a>
  </div>
</header>

<section class="hero">
  <div class="hero-visual">
    <div class="hero-tag">SS 2025 Collection</div>
  </div>
  <div class="hero-content">
    <h1>DRESSED FOR THE FUTURE</h1>
    <p>Premium essentials engineered for people who move with intention. Every stitch, deliberate. Every fabric, chosen for life.</p>
    <div class="hero-cta-group">
      <a href="#" class="btn-dark">Shop Women</a>
      <a href="#" class="btn-outline">Shop Men</a>
    </div>
    <div class="hero-scroll">Scroll</div>
  </div>
</section>

<div class="cats">
  <a href="#" class="cat"><span class="cat-label">Outerwear</span><span class="cat-count">48 Styles</span></a>
  <a href="#" class="cat"><span class="cat-label">Denim</span><span class="cat-count">36 Styles</span></a>
  <a href="#" class="cat"><span class="cat-label">Knitwear</span><span class="cat-count">52 Styles</span></a>
  <a href="#" class="cat"><span class="cat-label">Accessories</span><span class="cat-count">24 Styles</span></a>
</div>

<section class="shop">
  <div class="sec-head"><h2>NEW IN</h2><a href="#" class="view-all">View All →</a></div>
  <div class="prod-grid">
    <div class="prod-card">
      <div class="pc-img"><span class="pc-badge">New</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg><div class="pc-overlay"><button class="pc-overlay-btn">Quick View</button></div></div>
      <div class="pc-name">Oversized Wool Blazer</div><div class="pc-type">Women's Outerwear</div>
      <div class="pc-prices"><span class="pc-price">₹8,999</span></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#1A1A1A;"><span class="pc-badge sale">Sale</span><svg fill="none" stroke="rgba(255,255,255,.2)" viewBox="0 0 24 24" stroke-width="1"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg><div class="pc-overlay"><button class="pc-overlay-btn">Quick View</button></div></div>
      <div class="pc-name">Classic Slim Denim</div><div class="pc-type">Men's Bottoms</div>
      <div class="pc-prices"><span class="pc-price">₹3,499</span><span class="pc-old">₹4,999</span></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#D4CFC6;"><svg fill="none" stroke="rgba(0,0,0,.2)" viewBox="0 0 24 24" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><div class="pc-overlay"><button class="pc-overlay-btn">Quick View</button></div></div>
      <div class="pc-name">Fine Knit Crew Neck</div><div class="pc-type">Women's Knitwear</div>
      <div class="pc-prices"><span class="pc-price">₹5,499</span></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#2C2C2C;"><span class="pc-badge">Trending</span><svg fill="none" stroke="rgba(255,255,255,.15)" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg><div class="pc-overlay"><button class="pc-overlay-btn">Quick View</button></div></div>
      <div class="pc-name">Structured Tote Bag</div><div class="pc-type">Accessories</div>
      <div class="pc-prices"><span class="pc-price">₹6,299</span></div>
    </div>
  </div>
</section>

<div class="editorial">
  <div class="ed-left">
    <div class="ed-left-content">
      <h2>THE DENIM STORY</h2>
      <p>Raw, tumbled, and washed to perfection. Our denim is built to break in beautifully and last a lifetime.</p>
      <a href="#" class="btn-dark">Shop Denim</a>
    </div>
  </div>
  <div class="ed-right">
    <div class="ed-item"><h3>New Arrivals Daily</h3><p>Fresh styles every Monday & Thursday</p></div>
    <div class="ed-item"><h3>The Essentials Edit</h3><p>Build a wardrobe that works forever</p></div>
  </div>
</div>

<div class="size-band">
  <div class="sb-text"><h3>FIND YOUR FIT</h3><p>Our extended size range covers XS to 4XL across all categories.</p></div>
  <div class="sb-sizes">
    <div class="sz">XS</div><div class="sz active">S</div><div class="sz">M</div><div class="sz">L</div><div class="sz">XL</div><div class="sz">2XL</div>
  </div>
  <button class="sb-btn">Size Guide</button>
</div>

<footer>
  <div class="f-top">
    <div class="f-brand"><a href="#">VŌLT</a><p>Premium fashion engineered for modern life. Thoughtfully designed, responsibly made, built to last.</p></div>
    <div class="f-col"><h4>Shop</h4><ul><li><a href="#">Women</a></li><li><a href="#">Men</a></li><li><a href="#">Accessories</a></li><li><a href="#">Sale</a></li></ul></div>
    <div class="f-col"><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Sustainability</a></li><li><a href="#">Careers</a></li><li><a href="#">Press</a></li></ul></div>
    <div class="f-col"><h4>Support</h4><ul><li><a href="#">Size Guide</a></li><li><a href="#">Returns</a></li><li><a href="#">Shipping</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="f-bottom"><span>© 2025 VŌLT Fashion. All rights reserved.</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF VŌLT Fashion Landing",
  "settings": [],
  "presets": [{ "name": "CF VŌLT Fashion Landing" }]
}
{% endschema %}`,
  "cf-fashion-clothing-product": `{% comment %}ConvertFlow: VŌLT Fashion — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #0A0A0A;
  --cf-bg: #F5F3EF;
  --cf-font: 'Bebas Neue', cursive;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF VŌLT Fashion Product",
  "settings": [],
  "presets": [{ "name": "CF VŌLT Fashion Product" }]
}
{% endschema %}`,
  "cf-food-delivery-cart": `{% comment %}ConvertFlow: Veda Eats — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #FF5722; --cf-bg: #FFF0E8; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Veda Eats Cart",
  "settings": [],
  "presets": [{ "name": "CF Veda Eats Cart" }]
}
{% endschema %}`,
  "cf-food-delivery-collection": `{% comment %}ConvertFlow: Veda Eats — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #FF5722; --cf-bg: #FFF0E8; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF Veda Eats Collection",
  "settings": [],
  "presets": [{ "name": "CF Veda Eats Collection" }]
}
{% endschema %}`,
  "cf-food-delivery-landing": `{% comment %}ConvertFlow: Veda Eats — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--orange:#FF5722;--yellow:#FFC107;--dark:#1A0A00;--bg:#FFF7F0;--surface:#fff;--text:#2A1A0E;--muted:#8A7060;--border:#F0E4D8;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'Poppins',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}

/* HEADER */
.top{background:var(--orange);color:#fff;text-align:center;padding:9px;font-size:12px;font-weight:600;letter-spacing:.5px;}
header{padding:18px 60px;background:#fff;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 20px rgba(0,0,0,.05);position:sticky;top:0;z-index:100;}
.brand{font-size:24px;font-weight:800;color:var(--dark);text-decoration:none;display:flex;align-items:center;gap:8px;}
.brand-icon{width:36px;height:36px;background:var(--orange);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}
nav ul{display:flex;gap:28px;list-style:none;}
nav a{font-size:14px;font-weight:500;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--orange);}
.hdr-btns{display:flex;gap:10px;}
.hdr-login{background:transparent;border:1.5px solid var(--orange);color:var(--orange);padding:10px 20px;border-radius:100px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
.hdr-login:hover{background:var(--orange);color:#fff;}
.hdr-order{background:var(--orange);color:#fff;border:none;padding:10px 20px;border-radius:100px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s;}
.hdr-order:hover{opacity:.88;}

/* HERO */
.hero{background:linear-gradient(120deg,#1A0A00 0%,#3A1A00 60%,#2A0E00 100%);min-height:88vh;display:grid;grid-template-columns:1fr 1fr;padding:0 60px;align-items:center;gap:60px;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-100px;right:-100px;width:500px;height:500px;border-radius:50%;background:rgba(255,87,34,.08);}
.hero::after{content:'';position:absolute;bottom:-100px;left:20%;width:400px;height:400px;border-radius:50%;background:rgba(255,193,7,.05);}
.hero-text .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,87,34,.2);border:1px solid rgba(255,87,34,.3);color:var(--orange);padding:8px 18px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:20px;}
.hero-text h1{font-size:68px;font-weight:800;line-height:1.05;color:#fff;margin-bottom:20px;}
.hero-text h1 span{color:var(--orange);}
.hero-text p{font-size:17px;color:rgba(255,255,255,.5);line-height:1.8;max-width:440px;margin-bottom:40px;}
/* Location input */
.loc-input{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:20px 24px;display:flex;align-items:center;gap:16px;max-width:500px;margin-bottom:14px;}
.loc-input svg{width:20px;color:var(--orange);flex-shrink:0;}
.loc-input input{background:transparent;border:none;outline:none;font-family:'Poppins',sans-serif;font-size:15px;color:#fff;flex:1;}
.loc-input input::placeholder{color:rgba(255,255,255,.3);}
.loc-btn{background:var(--orange);color:#fff;border:none;padding:12px 24px;border-radius:12px;font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity .2s;}
.loc-btn:hover{opacity:.88;}
.delivery-info{font-size:13px;color:rgba(255,255,255,.35);font-weight:500;}
.hero-visual{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;}
.food-float{width:100%;max-width:420px;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,87,34,.15),rgba(255,87,34,.03));display:flex;align-items:center;justify-content:center;border:1px dashed rgba(255,87,34,.2);}
.food-float svg{width:50%;color:var(--orange);opacity:.3;}

/* CUISINE TABS */
.cuisine{background:#fff;padding:30px 60px;border-bottom:1px solid var(--border);}
.cuisine-inner{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;}
.c-chip{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:100px;border:1.5px solid var(--border);background:transparent;font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;color:var(--text);}
.c-chip:hover,.c-chip.active{border-color:var(--orange);color:var(--orange);background:rgba(255,87,34,.06);}
.c-chip-icon{font-size:18px;}

/* MENU */
.menu{padding:80px 60px;max-width:1400px;margin:0 auto;}
.menu-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px;}
.menu-head h2{font-size:36px;font-weight:800;color:var(--text);}
.menu-head a{font-size:13px;font-weight:600;color:var(--orange);text-decoration:none;}
.menu-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.menu-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid var(--border);transition:all .3s;cursor:pointer;}
.menu-card:hover{box-shadow:0 12px 40px rgba(255,87,34,.08);transform:translateY(-4px);}
.mc-img{aspect-ratio:16/9;background:linear-gradient(135deg,#FFF0E0,#FFE0C0);display:flex;align-items:center;justify-content:center;position:relative;}
.mc-img svg{width:35%;color:var(--orange);opacity:.4;transition:opacity .3s,transform .4s;}
.menu-card:hover .mc-img svg{opacity:.7;transform:scale(1.06);}
.mc-badge{position:absolute;top:14px;left:14px;background:var(--orange);color:#fff;padding:5px 14px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.5px;}
.mc-badge.veg{background:#27AE60;}
.mc-time{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.5);color:#fff;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:600;}
.mc-body{padding:20px;}
.mc-kitchen{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--orange);margin-bottom:6px;}
.mc-name{font-size:18px;font-weight:700;margin-bottom:6px;color:var(--text);}
.mc-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:16px;}
.mc-foot{display:flex;justify-content:space-between;align-items:center;}
.mc-price-w strong{font-size:22px;font-weight:800;color:var(--text);}
.mc-off{font-size:12px;color:#27AE60;font-weight:700;margin-left:6px;}
.mc-atc{background:var(--orange);color:#fff;border:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;font-weight:700;transition:opacity .2s;flex-shrink:0;}
.mc-atc:hover{opacity:.85;}

/* TRUST */
.trust{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.t-item{padding:40px 32px;text-align:center;border-right:1px solid var(--border);}
.t-item:last-child{border-right:none;}
.t-icon{font-size:36px;margin-bottom:12px;}
.t-num{font-size:28px;font-weight:800;color:var(--orange);margin-bottom:4px;}
.t-label{font-size:12px;color:var(--muted);font-weight:500;}

/* FOOTER */
footer{background:var(--dark);padding:70px 60px 36px;}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.08);}
.fb .brand{display:flex;font-size:22px;margin-bottom:16px;color:#fff;}
.fb p{font-size:13px;color:rgba(255,255,255,.35);line-height:1.9;max-width:260px;}
.fc h4{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--orange);margin-bottom:20px;}
.fc ul{list-style:none;}
.fc li{margin-bottom:10px;}
.fc a{color:rgba(255,255,255,.4);text-decoration:none;font-size:14px;transition:color .2s;}
.fc a:hover{color:#fff;}
.fbot{display:flex;justify-content:space-between;padding-top:28px;font-size:11px;color:rgba(255,255,255,.2);}

@media(max-width:1024px){.hero{grid-template-columns:1fr;padding:60px 40px;min-height:auto}.hero-visual{display:none}.menu-grid{grid-template-columns:repeat(2,1fr)}.trust{grid-template-columns:1fr 1fr}.fg{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:14px 20px}nav{display:none}.hero{padding:60px 20px}.hero-text h1{font-size:44px}.cuisine{padding:20px}.menu{padding:60px 20px}.menu-grid{grid-template-columns:1fr}.trust{grid-template-columns:1fr 1fr}.fg{grid-template-columns:1fr;gap:40px}footer{padding:60px 20px 30px}}
</style>
<div class="top">🛵 30-minute delivery guaranteed or your next order is FREE!</div>
<header>
  <a href="#" class="brand"><div class="brand-icon">🍛</div>VEDA EATS</a>
  <nav><ul>
    <li><a href="#">Menu</a></li>
    <li><a href="#">Cuisines</a></li>
    <li><a href="#">Offers</a></li>
    <li><a href="#">Track Order</a></li>
  </ul></nav>
  <div class="hdr-btns">
    <button class="hdr-login">Login</button>
    <button class="hdr-order">Order Now</button>
  </div>
</header>

<section class="hero">
  <div class="hero-text">
    <div class="badge">🔥 400+ Daily Orders — 4.8★ Rating</div>
    <h1>Restaurant<br><span>Quality</span><br>At Home.</h1>
    <p>Chef-crafted meals from top cloud kitchens, delivered fresh to your door in under 30 minutes.</p>
    <div class="loc-input">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <input type="text" placeholder="Enter your delivery address...">
      <button class="loc-btn">Find Food →</button>
    </div>
    <div class="delivery-info">📍 Currently delivering in Bangalore, Mumbai &amp; Delhi</div>
  </div>
  <div class="hero-visual">
    <div class="food-float">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
    </div>
  </div>
</section>

<div class="cuisine">
  <div class="cuisine-inner">
    <button class="c-chip active"><span class="c-chip-icon">🍽️</span>All</button>
    <button class="c-chip"><span class="c-chip-icon">🍜</span>North Indian</button>
    <button class="c-chip"><span class="c-chip-icon">🥘</span>South Indian</button>
    <button class="c-chip"><span class="c-chip-icon">🍕</span>Italian</button>
    <button class="c-chip"><span class="c-chip-icon">🍣</span>Asian</button>
    <button class="c-chip"><span class="c-chip-icon">🥗</span>Healthy</button>
    <button class="c-chip"><span class="c-chip-icon">🍔</span>Burgers</button>
    <button class="c-chip"><span class="c-chip-icon">🧁</span>Desserts</button>
    <button class="c-chip"><span class="c-chip-icon">☕</span>Beverages</button>
  </div>
</div>

<section class="menu">
  <div class="menu-head"><h2>🔥 Popular Right Now</h2><a href="#">See full menu →</a></div>
  <div class="menu-grid">
    <div class="menu-card">
      <div class="mc-img"><span class="mc-badge">Bestseller</span><span class="mc-time">⏱ 22 min</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M16 11l-4-8-4 8a7.07 7.07 0 000 2c.75 3.86 3.07 7 4 7s3.25-3.14 4-7a7.07 7.07 0 000-2z"/></svg></div>
      <div class="mc-body"><div class="mc-kitchen">Punjabi Kitchen</div><div class="mc-name">Dal Makhani + Naan Combo</div><div class="mc-desc">Slow-cooked black lentils in a rich tomato &amp; cream gravy. Served with 2 butter naan.</div><div class="mc-foot"><div class="mc-price-w"><strong>₹199</strong><span class="mc-off">20% OFF</span></div><button class="mc-atc">+</button></div></div>
    </div>
    <div class="menu-card">
      <div class="mc-img" style="background:linear-gradient(135deg,#FFF8D0,#FFF0A0);"><span class="mc-badge veg">Veg</span><span class="mc-time">⏱ 18 min</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
      <div class="mc-body"><div class="mc-kitchen">South Bites</div><div class="mc-name">Masala Dosa &amp; Filter Coffee</div><div class="mc-desc">Crispy golden dosa with spiced potato filling. Served with sambar, 2 chutneys, and aromatic filter coffee.</div><div class="mc-foot"><div class="mc-price-w"><strong>₹149</strong></div><button class="mc-atc">+</button></div></div>
    </div>
    <div class="menu-card">
      <div class="mc-img" style="background:linear-gradient(135deg,#F0F8FF,#D0E8FF);"><span class="mc-badge">Chef's Pick</span><span class="mc-time">⏱ 25 min</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg></div>
      <div class="mc-body"><div class="mc-kitchen">Fusion Fire</div><div class="mc-name">Butter Chicken Pasta</div><div class="mc-desc">A fusion of creamy butter chicken sauce tossed with penne pasta. Topped with fresh cream and herbs.</div><div class="mc-foot"><div class="mc-price-w"><strong>₹259</strong><span class="mc-off">10% OFF</span></div><button class="mc-atc">+</button></div></div>
    </div>
  </div>
</section>

<div class="trust">
  <div class="t-item"><div class="t-icon">⏱</div><div class="t-num">28 min</div><div class="t-label">Avg Delivery Time</div></div>
  <div class="t-item"><div class="t-icon">🍽️</div><div class="t-num">50+</div><div class="t-label">Cloud Kitchens</div></div>
  <div class="t-item"><div class="t-icon">⭐</div><div class="t-num">4.8</div><div class="t-label">Average Rating</div></div>
  <div class="t-item"><div class="t-icon">😊</div><div class="t-num">2L+</div><div class="t-label">Happy Customers</div></div>
</div>

<footer>
  <div class="fg">
    <div class="fb"><div class="brand"><div class="brand-icon">🍛</div>VEDA EATS</div><p>Bringing chef-quality meals from the best cloud kitchens to your doorstep, every single day.</p></div>
    <div class="fc"><h4>Explore</h4><ul><li><a href="#">Full Menu</a></li><li><a href="#">Cuisines</a></li><li><a href="#">Offers</a></li><li><a href="#">Combos</a></li></ul></div>
    <div class="fc"><h4>Company</h4><ul><li><a href="#">About Us</a></li><li><a href="#">List Your Kitchen</a></li><li><a href="#">Careers</a></li><li><a href="#">Blog</a></li></ul></div>
    <div class="fc"><h4>Help</h4><ul><li><a href="#">Track Order</a></li><li><a href="#">Refund Policy</a></li><li><a href="#">FAQ</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 Veda Eats. FSSAI Lic. No. 12345678.</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF Veda Eats Landing",
  "settings": [],
  "presets": [{ "name": "CF Veda Eats Landing" }]
}
{% endschema %}`,
  "cf-food-delivery-product": `{% comment %}ConvertFlow: Veda Eats — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #FF5722;
  --cf-bg: #FFF0E8;
  --cf-font: 'Poppins', sans-serif;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Veda Eats Product",
  "settings": [],
  "presets": [{ "name": "CF Veda Eats Product" }]
}
{% endschema %}`,
  "cf-footwear-cart": `{% comment %}ConvertFlow: Solera Footwear — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #C65D2A; --cf-bg: #FBF0E8; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Solera Footwear Cart",
  "settings": [],
  "presets": [{ "name": "CF Solera Footwear Cart" }]
}
{% endschema %}`,
  "cf-footwear-collection": `{% comment %}ConvertFlow: Solera Footwear — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #C65D2A; --cf-bg: #FBF0E8; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF Solera Footwear Collection",
  "settings": [],
  "presets": [{ "name": "CF Solera Footwear Collection" }]
}
{% endschema %}`,
  "cf-footwear-landing": `{% comment %}ConvertFlow: Solera Footwear — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--rust:#C65D2A;--sand:#F0E6D3;--dark:#1C1510;--text:#2A2018;--muted:#8A7A6A;--border:#E0D4C0;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#fff;color:var(--text);font-family:'Inter',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-family:'Syne',sans-serif;}

/* HEADER */
.top-bar{background:var(--rust);color:#fff;text-align:center;padding:10px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;}
header{padding:24px 60px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
.brand{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--dark);text-decoration:none;letter-spacing:4px;}
.nav-links{display:flex;gap:32px;list-style:none;}
.nav-links a{font-size:13px;font-weight:500;color:var(--text);text-decoration:none;letter-spacing:.5px;transition:color .2s;}
.nav-links a:hover{color:var(--rust);}
.h-icons{display:flex;gap:16px;}
.h-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text);position:relative;transition:color .2s;}
.h-icon:hover{color:var(--rust);}
.h-icon svg{width:20px;stroke-width:1.5;}
.cart-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--rust);}

/* HERO — dynamic full-width */
.hero{min-height:92vh;background:var(--sand);display:grid;grid-template-columns:1fr 1fr;overflow:hidden;}
.hero-l{padding:100px 80px;display:flex;flex-direction:column;justify-content:center;}
.hero-l .overline{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--rust);margin-bottom:24px;}
.hero-l h1{font-size:80px;line-height:1;font-weight:800;color:var(--dark);margin-bottom:28px;}
.hero-l h1 em{font-style:italic;color:var(--rust);}
.hero-l p{font-size:17px;color:var(--muted);line-height:1.8;max-width:420px;margin-bottom:48px;font-weight:300;}
.hero-btns{display:flex;gap:16px;}
.btn-rust{background:var(--rust);color:#fff;padding:18px 44px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:opacity .2s;display:inline-block;}
.btn-rust:hover{opacity:.9;}
.btn-ghost{background:transparent;color:var(--dark);border:1.5px solid var(--dark);padding:17px 44px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:all .2s;display:inline-block;}
.btn-ghost:hover{background:var(--dark);color:#fff;}
.hero-r{background:var(--dark);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.hero-r::after{content:'';position:absolute;width:400px;height:400px;border-radius:50%;border:1px solid rgba(255,255,255,.05);top:50%;left:50%;transform:translate(-50%,-50%);}
.hero-shoe-icon{width:60%;color:rgba(198,93,42,.3);}

/* FILTER TABS */
.tabs{display:flex;gap:4px;padding:24px 60px;border-bottom:1px solid var(--border);background:#fafaf8;}
.tab{padding:10px 24px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--border);background:transparent;cursor:pointer;transition:all .2s;color:var(--muted);}
.tab.active,.tab:hover{background:var(--dark);color:#fff;border-color:var(--dark);}

/* PRODUCTS — unique card with size selector built-in */
.shop{padding:80px 60px;max-width:1400px;margin:0 auto;}
.shop-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:50px;}
.shop-head h2{font-size:48px;font-weight:800;color:var(--dark);}
.sort-select{font-family:'Inter',sans-serif;font-size:13px;border:1px solid var(--border);padding:10px 20px;background:transparent;color:var(--text);outline:none;cursor:pointer;}

.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;}
.card{position:relative;border:1px solid var(--border);transition:all .35s;overflow:hidden;}
.card:hover{box-shadow:0 16px 40px rgba(198,93,42,.08);transform:translateY(-4px);}
.card-img{aspect-ratio:1;background:var(--sand);display:flex;align-items:center;justify-content:center;position:relative;}
.card-img svg{width:40%;color:var(--muted);opacity:.5;transition:transform .4s;}
.card:hover .card-img svg{transform:scale(1.06);color:var(--rust);opacity:.8;}
.c-badge{position:absolute;top:18px;left:18px;background:var(--rust);color:#fff;padding:5px 14px;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;}
.card-body{padding:24px;}
.c-cat{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:8px;}
.c-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;margin-bottom:6px;color:var(--dark);}
.c-desc{font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.6;}
.c-sizes{display:flex;gap:6px;margin-bottom:18px;}
.cs{width:32px;height:32px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;}
.cs:hover{border-color:var(--rust);color:var(--rust);}
.card-foot{display:flex;justify-content:space-between;align-items:center;}
.c-price{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--dark);}
.c-old{font-size:14px;color:var(--muted);text-decoration:line-through;margin-left:8px;font-weight:400;}
.c-atc{background:var(--dark);color:#fff;border:none;padding:12px 24px;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:background .2s;}
.c-atc:hover{background:var(--rust);}

/* SUSTAINABILITY */
.sustain{background:var(--dark);padding:100px 60px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;}
.s-text .overline{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--rust);margin-bottom:20px;display:block;}
.s-text h2{font-size:52px;font-weight:800;color:#fff;margin-bottom:24px;line-height:1.1;}
.s-text p{font-size:16px;color:rgba(255,255,255,.5);line-height:1.9;margin-bottom:36px;}
.s-pillars{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.s-pillar{border:1px solid rgba(255,255,255,.1);padding:24px;}
.s-pillar h4{font-family:'Syne',sans-serif;font-size:16px;color:#fff;margin-bottom:8px;}
.s-pillar p{font-size:13px;color:rgba(255,255,255,.4);}

/* FOOTER */
footer{background:var(--sand);padding:80px 60px 40px;}
.f-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid var(--border);}
.f-brand-name{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--dark);letter-spacing:4px;margin-bottom:16px;}
.f-brand p{font-size:14px;color:var(--muted);line-height:1.8;max-width:260px;}
.f-col h4{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.f-col ul{list-style:none;}
.f-col li{margin-bottom:10px;}
.f-col a{color:var(--text);text-decoration:none;font-size:14px;transition:color .2s;}
.f-col a:hover{color:var(--rust);}
.f-bottom{display:flex;justify-content:space-between;padding-top:30px;font-size:12px;color:var(--muted);}

@media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto}.hero-r{display:none}.grid{grid-template-columns:repeat(2,1fr)}.sustain{grid-template-columns:1fr}.s-pillars{grid-template-columns:1fr}.f-grid{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}.nav-links{display:none}.hero-l{padding:60px 20px}.hero-l h1{font-size:52px}.shop{padding:60px 20px}.grid{grid-template-columns:1fr}.tabs{padding:16px 20px;overflow-x:auto;flex-wrap:nowrap}.f-grid{grid-template-columns:1fr;gap:40px}}
</style>
<div class="top-bar">Free shipping on orders above ₹2,999 | Easy 30-day returns</div>
<header>
  <a href="#" class="brand">SOLERA</a>
  <ul class="nav-links">
    <li><a href="#">New Drops</a></li>
    <li><a href="#">Sneakers</a></li>
    <li><a href="#">Formal</a></li>
    <li><a href="#">Sandals</a></li>
    <li><a href="#">Boots</a></li>
  </ul>
  <div class="h-icons">
    <div class="h-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
    <div class="h-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
    <div class="h-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><div class="cart-dot"></div></div>
  </div>
</header>

<section class="hero">
  <div class="hero-l">
    <span class="overline">SS 2025 — The Ground Collection</span>
    <h1>Walk with <em>Purpose</em></h1>
    <p>Footwear built for the unscripted journey. Premium leather, handcrafted soles, and silhouettes that age beautifully.</p>
    <div class="hero-btns">
      <a href="#" class="btn-rust">Shop Collection</a>
      <a href="#" class="btn-ghost">Find Your Size</a>
    </div>
  </div>
  <div class="hero-r">
    <svg class="hero-shoe-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width=".8"><path d="M21.5 15.5c-1.1 1.1-3.1 1.5-5.5 1.5H4a2 2 0 01-2-2v-1c0-.6.1-1.2.4-1.7L6 7.5V7a2 2 0 012-2h2.5L14 9l2-1.5 2.5 1 1.5 3.5-1 1.5 2.5 2z"/></svg>
  </div>
</section>

<div class="tabs">
  <button class="tab active">All</button>
  <button class="tab">Sneakers</button>
  <button class="tab">Formal</button>
  <button class="tab">Sandals</button>
  <button class="tab">Boots</button>
  <button class="tab">Sport</button>
</div>

<section class="shop">
  <div class="shop-head">
    <h2>Our Collection</h2>
    <select class="sort-select"><option>Sort: Featured</option><option>Price: Low-High</option><option>Newest</option></select>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-img"><span class="c-badge">Bestseller</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M21.5 15.5c-1.1 1.1-3.1 1.5-5.5 1.5H4a2 2 0 01-2-2v-1c0-.6.1-1.2.4-1.7L6 7.5V7a2 2 0 012-2h2.5L14 9l2-1.5 2.5 1 1.5 3.5-1 1.5 2.5 2z"/></svg></div>
      <div class="card-body">
        <div class="c-cat">Sneakers</div>
        <div class="c-name">Terra Runner Pro</div>
        <div class="c-desc">Full-grain leather upper with memory foam insole.</div>
        <div class="c-sizes"><div class="cs">6</div><div class="cs">7</div><div class="cs">8</div><div class="cs">9</div><div class="cs">10</div></div>
        <div class="card-foot"><div class="c-price">₹7,499</div><button class="c-atc">Add to Cart</button></div>
      </div>
    </div>
    <div class="card">
      <div class="card-img" style="background:#E8E0D5;"><span class="c-badge">New</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="9"/><path d="M4.22 4.22l15.56 15.56"/></svg></div>
      <div class="card-body">
        <div class="c-cat">Formal</div>
        <div class="c-name">Oxford Classic II</div>
        <div class="c-desc">Italian leather brogue with Goodyear welted construction.</div>
        <div class="c-sizes"><div class="cs">7</div><div class="cs">8</div><div class="cs">9</div><div class="cs">10</div><div class="cs">11</div></div>
        <div class="card-foot"><div class="c-price">₹12,999 <span class="c-old">₹15,999</span></div><button class="c-atc">Add to Cart</button></div>
      </div>
    </div>
    <div class="card">
      <div class="card-img" style="background:#D4C4A8;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
      <div class="card-body">
        <div class="c-cat">Boots</div>
        <div class="c-name">Canyon Chelsea Boot</div>
        <div class="c-desc">Chelsea silhouette in burnished calfskin with elastic gussets.</div>
        <div class="c-sizes"><div class="cs">7</div><div class="cs">8</div><div class="cs">9</div><div class="cs">10</div></div>
        <div class="card-foot"><div class="c-price">₹9,999</div><button class="c-atc">Add to Cart</button></div>
      </div>
    </div>
  </div>
</section>

<div class="sustain">
  <div class="s-text">
    <span class="overline">Our Commitment</span>
    <h2>Crafted to Last, Not to Waste</h2>
    <p>Every pair is built with materials that improve with age and processes that respect the planet. We are pursuing full supply chain transparency by 2026.</p>
    <a href="#" class="btn-rust">Our Story</a>
  </div>
  <div class="s-pillars">
    <div class="s-pillar"><h4>Vegetable Tanned Leather</h4><p>Using traditional tanneries in Kanpur, free from heavy metals.</p></div>
    <div class="s-pillar"><h4>Recycled Packaging</h4><p>100% recycled & FSC-certified shoe boxes and tissue paper.</p></div>
    <div class="s-pillar"><h4>Resoleable Design</h4><p>All formal range can be resoled, extending life by years.</p></div>
    <div class="s-pillar"><h4>Fair Wages</h4><p>Living wages guaranteed across our entire artisan network.</p></div>
  </div>
</div>

<footer>
  <div class="f-grid">
    <div class="f-brand"><div class="f-brand-name">SOLERA</div><p>Footwear designed for the discerning walker. Handcrafted in India with ethically sourced leathers.</p></div>
    <div class="f-col"><h4>Shop</h4><ul><li><a href="#">Sneakers</a></li><li><a href="#">Formal</a></li><li><a href="#">Boots</a></li><li><a href="#">Sandals</a></li></ul></div>
    <div class="f-col"><h4>About</h4><ul><li><a href="#">Our Story</a></li><li><a href="#">Sustainability</a></li><li><a href="#">Artisans</a></li></ul></div>
    <div class="f-col"><h4>Help</h4><ul><li><a href="#">Size Chart</a></li><li><a href="#">Care Guide</a></li><li><a href="#">Returns</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="f-bottom"><span>© 2025 Solera Footwear</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF Solera Footwear Landing",
  "settings": [],
  "presets": [{ "name": "CF Solera Footwear Landing" }]
}
{% endschema %}`,
  "cf-footwear-product": `{% comment %}ConvertFlow: Solera Footwear — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #C65D2A;
  --cf-bg: #FBF0E8;
  --cf-font: 'Syne', sans-serif;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Solera Footwear Product",
  "settings": [],
  "presets": [{ "name": "CF Solera Footwear Product" }]
}
{% endschema %}`,
  "cf-home-furniture-cart": `{% comment %}ConvertFlow: Haven Furniture — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #B5834A; --cf-bg: #F5EFE6; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Haven Furniture Cart",
  "settings": [],
  "presets": [{ "name": "CF Haven Furniture Cart" }]
}
{% endschema %}`,
  "cf-home-furniture-collection": `{% comment %}ConvertFlow: Haven Furniture — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #B5834A; --cf-bg: #F5EFE6; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF Haven Furniture Collection",
  "settings": [],
  "presets": [{ "name": "CF Haven Furniture Collection" }]
}
{% endschema %}`,
  "cf-home-furniture-landing": `{% comment %}ConvertFlow: Haven Furniture — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--oak:#B5834A;--smoke:#F0EDE8;--dark:#1E1A16;--text:#2D2720;--muted:#7D7068;--border:#E0D8CC;--light:#FAF8F5;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--light);color:var(--text);font-family:'Manrope',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-family:'Libre Baskerville',serif;}

/* HEADER */
.top{background:var(--dark);color:rgba(255,255,255,.6);text-align:center;padding:10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;}
header{padding:24px 60px;background:var(--light);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
.brand{font-family:'Libre Baskerville',serif;font-size:26px;color:var(--dark);text-decoration:none;letter-spacing:1px;display:flex;flex-direction:column;}
.brand-tagline{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--oak);font-family:'Manrope',sans-serif;font-weight:600;}
nav ul{display:flex;gap:32px;list-style:none;}
nav a{font-size:13px;font-weight:500;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--oak);}
.h-right{display:flex;gap:16px;align-items:center;}
.h-link{font-size:12px;font-weight:600;letter-spacing:1px;color:var(--muted);text-decoration:none;transition:color .2s;}
.h-link:hover{color:var(--text);}
.h-cta{background:var(--dark);color:#fff;padding:12px 28px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:background .2s;}
.h-cta:hover{background:var(--oak);}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:90vh;border-bottom:1px solid var(--border);}
.hero-left{padding:100px 80px;display:flex;flex-direction:column;justify-content:center;background:var(--light);}
.hero-left .overline{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--oak);margin-bottom:24px;}
.hero-left h1{font-size:68px;line-height:1.05;margin-bottom:28px;color:var(--dark);}
.hero-left h1 em{font-style:italic;color:var(--oak);}
.hero-left p{font-size:17px;color:var(--muted);line-height:1.9;max-width:420px;margin-bottom:44px;font-weight:400;}
.hero-actions{display:flex;flex-direction:column;gap:16px;max-width:260px;}
.btn-dark{background:var(--dark);color:#fff;padding:18px 40px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;text-align:center;transition:background .2s;font-family:'Manrope',sans-serif;}
.btn-dark:hover{background:var(--oak);}
.btn-oak{background:transparent;color:var(--oak);border:1.5px solid var(--oak);padding:16px 40px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;text-align:center;transition:all .2s;font-family:'Manrope',sans-serif;}
.btn-oak:hover{background:var(--oak);color:#fff;}
.hero-stats{display:flex;gap:40px;margin-top:60px;padding-top:40px;border-top:1px solid var(--border);}
.hs strong{display:block;font-family:'Libre Baskerville',serif;font-size:28px;color:var(--dark);}
.hs span{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);}

.hero-right{background:var(--smoke);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.hero-right::before{content:'';position:absolute;width:500px;height:500px;border-radius:50%;border:1px solid rgba(181,131,74,.15);top:50%;left:50%;transform:translate(-50%,-50%);}
.hero-img{width:70%;aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;position:relative;}
.hero-img svg{width:60%;color:var(--oak);opacity:.25;}

/* ROOM IDEAS */
.rooms{padding:100px 60px;max-width:1400px;margin:0 auto;}
.sh{text-align:center;margin-bottom:60px;}
.sh h2{font-size:44px;color:var(--dark);margin-bottom:12px;}
.sh p{font-size:16px;color:var(--muted);max-width:480px;margin:0 auto;}
.room-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.room-card{position:relative;aspect-ratio:4/5;overflow:hidden;text-decoration:none;color:#fff;display:block;}
.room-card:nth-child(1){grid-column:span 2;aspect-ratio:16/9;}
.room-card:nth-child(n+3){aspect-ratio:1;}
.rc-bg{width:100%;height:100%;transition:transform .8s ease;display:flex;align-items:center;justify-content:center;}
.room-card:hover .rc-bg{transform:scale(1.04);}
.rc-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 50%);display:flex;flex-direction:column;justify-content:flex-end;padding:28px;}
.rc-label{font-family:'Libre Baskerville',serif;font-size:20px;margin-bottom:4px;}
.rc-cta{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.7);}
.rc-bg svg{width:30%;color:rgba(255,255,255,.15);}

/* PRODUCTS */
.products{padding:0 60px 100px;max-width:1400px;margin:0 auto;}
.ph{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:50px;}
.ph h2{font-size:44px;color:var(--dark);}
.ph a{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--oak);text-decoration:none;border-bottom:1px solid var(--oak);padding-bottom:3px;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;}
.prod-card{background:#fff;border:1px solid var(--border);transition:all .35s;overflow:hidden;}
.prod-card:hover{box-shadow:0 16px 48px rgba(30,26,22,.06);transform:translateY(-6px);}
.pc-img{aspect-ratio:1;background:var(--smoke);display:flex;align-items:center;justify-content:center;position:relative;}
.pc-img svg{width:35%;color:var(--oak);opacity:.4;transition:transform .5s;}
.prod-card:hover .pc-img svg{transform:scale(1.06);opacity:.7;}
.pc-badge{position:absolute;top:16px;left:16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;}
.pc-badge.new{background:var(--dark);color:#fff;}
.pc-badge.sale{background:var(--oak);color:#fff;}
.pc-info{padding:24px;}
.pc-category{font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--oak);margin-bottom:8px;}
.pc-name{font-family:'Libre Baskerville',serif;font-size:20px;margin-bottom:6px;color:var(--dark);}
.pc-material{font-size:13px;color:var(--muted);font-style:italic;margin-bottom:16px;}
.pc-footer{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--border);}
.pc-price{font-family:'Libre Baskerville',serif;font-size:22px;color:var(--dark);}
.pc-old{font-size:13px;color:var(--muted);text-decoration:line-through;margin-left:8px;font-family:'Manrope',sans-serif;font-weight:400;}
.pc-atc{background:transparent;color:var(--dark);border:1px solid var(--dark);padding:10px 20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-family:'Manrope',sans-serif;transition:all .2s;}
.pc-atc:hover{background:var(--dark);color:#fff;}

/* HOW IT WORKS */
.hiw{background:var(--dark);padding:100px 60px;}
.hiw-inner{max-width:1000px;margin:0 auto;text-align:center;}
.hiw h2{font-size:44px;color:#fff;margin-bottom:16px;}
.hiw p{font-size:16px;color:rgba(255,255,255,.4);margin-bottom:70px;}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:60px;position:relative;}
.steps::before{content:'';position:absolute;top:40px;left:16%;width:68%;height:1px;background:rgba(255,255,255,.08);}
.step{text-align:center;}
.step-num{width:80px;height:80px;border-radius:50%;border:1px solid rgba(181,131,74,.4);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-family:'Libre Baskerville',serif;font-size:28px;color:var(--oak);}
.step h4{font-family:'Libre Baskerville',serif;font-size:18px;color:#fff;margin-bottom:10px;}
.step p{font-size:14px;color:rgba(255,255,255,.4);line-height:1.8;}

/* FOOTER */
footer{padding:80px 60px 40px;background:var(--light);border-top:1px solid var(--border);}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid var(--border);}
.fb .brand{font-size:22px;display:flex;flex-direction:column;margin-bottom:16px;}
.fb p{font-size:13px;color:var(--muted);line-height:1.9;max-width:270px;}
.fc h4{font-family:'Manrope',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.fc ul{list-style:none;}
.fc li{margin-bottom:10px;}
.fc a{color:var(--text);text-decoration:none;font-size:14px;transition:color .2s;}
.fc a:hover{color:var(--oak);}
.fbot{display:flex;justify-content:space-between;padding-top:28px;font-size:11px;color:var(--muted);letter-spacing:1px;}

@media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto}.hero-right{display:none}.room-grid{grid-template-columns:1fr 1fr}.room-card:nth-child(1){grid-column:span 2}.grid{grid-template-columns:repeat(2,1fr)}.fg{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}nav{display:none}.hero-left{padding:60px 20px}.hero-left h1{font-size:44px}.rooms{padding:60px 20px}.room-grid{grid-template-columns:1fr}.room-card:nth-child(1){grid-column:span 1}.products{padding:0 20px 60px}.grid{grid-template-columns:1fr}.hiw{padding:60px 20px}.steps{grid-template-columns:1fr;gap:40px}.steps::before{display:none}.fg{grid-template-columns:1fr;gap:40px}footer{padding:60px 20px 30px}}
</style>
<div class="top">Complimentary white-glove delivery and assembly on all furniture orders.</div>
<header>
  <a href="#" class="brand">
    HAVEN
    <span class="brand-tagline">Premium Furniture &amp; Living</span>
  </a>
  <nav><ul>
    <li><a href="#">Living Room</a></li>
    <li><a href="#">Bedroom</a></li>
    <li><a href="#">Dining</a></li>
    <li><a href="#">Home Office</a></li>
    <li><a href="#">Outdoor</a></li>
  </ul></nav>
  <div class="h-right">
    <a href="#" class="h-link">Wishlist</a>
    <a href="#" class="h-link">Account</a>
    <a href="#" class="h-cta">View Cart</a>
  </div>
</header>

<section class="hero">
  <div class="hero-left">
    <span class="overline">2025 — The Natural Edit</span>
    <h1>Rooms That<br>Feel Like <em>Home</em></h1>
    <p>Solid wood furniture crafted by eighth-generation artisans in Jodhpur. Designed to age gracefully and tell a story with every scratch.</p>
    <div class="hero-actions">
      <a href="#" class="btn-dark">Explore Collections</a>
      <a href="#" class="btn-oak">Book Free Design Call</a>
    </div>
    <div class="hero-stats">
      <div class="hs"><strong>18+</strong><span>Year Legacy</span></div>
      <div class="hs"><strong>40K+</strong><span>Happy Homes</span></div>
      <div class="hs"><strong>100%</strong><span>Solid Wood</span></div>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
  </div>
</section>

<section class="rooms">
  <div class="sh"><h2>Shop the Look</h2><p>Curated room aesthetics to inspire your next transformation.</p></div>
  <div class="room-grid">
    <div class="room-card"><div class="rc-bg" style="background:linear-gradient(135deg,#2D2720,#4A3828);"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="rc-overlay"><div class="rc-label">The Walnut Living Room</div><div class="rc-cta">Shop This Look →</div></div></div>
    <div class="room-card"><div class="rc-bg" style="background:linear-gradient(135deg,#3D3028,#5A4030);"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg></div><div class="rc-overlay"><div class="rc-label">Calm Bedroom</div><div class="rc-cta">Shop This Look →</div></div></div>
    <div class="room-card"><div class="rc-bg" style="background:linear-gradient(135deg,#28302D,#3A4A40);"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div><div class="rc-overlay"><div class="rc-label">Home Office</div><div class="rc-cta">Shop This Look →</div></div></div>
  </div>
</section>

<section class="products">
  <div class="ph"><h2>Featured Pieces</h2><a href="#">View All →</a></div>
  <div class="grid">
    <div class="prod-card">
      <div class="pc-img"><span class="pc-badge new">New</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
      <div class="pc-info"><div class="pc-category">Sofas &amp; Seating</div><div class="pc-name">Ashwood Three-Seater</div><div class="pc-material">Solid Ash wood · Organic linen · Brass legs</div><div class="pc-footer"><div class="pc-price">₹89,000<span class="pc-old">₹1,05,000</span></div><button class="pc-atc">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#E8E2D5;"><span class="pc-badge sale">Sale</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/></svg></div>
      <div class="pc-info"><div class="pc-category">Dining</div><div class="pc-name">Mango Wood Dining Set</div><div class="pc-material">Recycled Mango wood · 6-seat · Hand-carved</div><div class="pc-footer"><div class="pc-price">₹1,24,000<span class="pc-old">₹1,45,000</span></div><button class="pc-atc">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#EDE8E0;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 9H4l1 12h14z"/><path d="M8 9V6a4 4 0 018 0v3"/></svg></div>
      <div class="pc-info"><div class="pc-category">Storage</div><div class="pc-name">Heritage Teak Wardrobe</div><div class="pc-material">Grade-A Teak · Soft-close hinges · 4-door</div><div class="pc-footer"><div class="pc-price">₹2,10,000</div><button class="pc-atc">Add to Cart</button></div></div>
    </div>
  </div>
</section>

<div class="hiw">
  <div class="hiw-inner">
    <h2>Your Journey to a Beautiful Home</h2>
    <p>Simple, personal, and delivered to your doorstep.</p>
    <div class="steps">
      <div class="step"><div class="step-num">01</div><h4>Design Consultation</h4><p>Book a free 30-minute call with our in-house interior designer to discuss your vision and space.</p></div>
      <div class="step"><div class="step-num">02</div><h4>Custom Crafting</h4><p>Your piece is handcrafted to order by our master carpenters in Jodhpur, India — delivered in 4-6 weeks.</p></div>
      <div class="step"><div class="step-num">03</div><h4>White-Glove Delivery</h4><p>We handle delivery, assembly, and removal of packaging. You just sit back and enjoy your beautiful new home.</p></div>
    </div>
  </div>
</div>

<footer>
  <div class="fg">
    <div class="fb"><a href="#" class="brand">HAVEN<span class="brand-tagline">Premium Furniture &amp; Living</span></a><p>Premium Indian craftsmanship meeting global design standards. Heirloom furniture for the modern family.</p></div>
    <div class="fc"><h4>Collections</h4><ul><li><a href="#">Living Room</a></li><li><a href="#">Bedroom</a></li><li><a href="#">Dining</a></li><li><a href="#">Home Office</a></li></ul></div>
    <div class="fc"><h4>Services</h4><ul><li><a href="#">Design Consultation</a></li><li><a href="#">Customisation</a></li><li><a href="#">Assembly</a></li></ul></div>
    <div class="fc"><h4>Support</h4><ul><li><a href="#">Care Guide</a></li><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 Haven Furniture Pvt. Ltd.</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF Haven Furniture Landing",
  "settings": [],
  "presets": [{ "name": "CF Haven Furniture Landing" }]
}
{% endschema %}`,
  "cf-home-furniture-product": `{% comment %}ConvertFlow: Haven Furniture — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #B5834A;
  --cf-bg: #F5EFE6;
  --cf-font: 'Libre Baskerville', serif;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Haven Furniture Product",
  "settings": [],
  "presets": [{ "name": "CF Haven Furniture Product" }]
}
{% endschema %}`,
  "cf-jewellery-heritage-cart": `{% comment %}ConvertFlow: Meenakshi Heritage Jewellers — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #8B1A2C; --cf-bg: #FAF0F0; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Meenakshi Heritage Jewellers Cart",
  "settings": [],
  "presets": [{ "name": "CF Meenakshi Heritage Jewellers Cart" }]
}
{% endschema %}`,
  "cf-jewellery-heritage-collection": `{% comment %}ConvertFlow: Meenakshi Heritage Jewellers — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #8B1A2C; --cf-bg: #FAF0F0; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF Meenakshi Heritage Jewellers Collection",
  "settings": [],
  "presets": [{ "name": "CF Meenakshi Heritage Jewellers Collection" }]
}
{% endschema %}`,
  "cf-jewellery-heritage-landing": `{% comment %}ConvertFlow: Meenakshi Heritage Jewellers — Landing Page{% endcomment %}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --crimson: #8B1A2C;
  --rose-gold: #C89B72;
  --deep-red: #5C0E1A;
  --cream: #FDF8F2;
  --ivory: #F5ECD9;
  --text: #2A1A1A;
  --text-muted: #7A6060;
  --border: rgba(200, 155, 114, 0.25);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { background: var(--cream); color: var(--text); font-family: 'Raleway', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: 'Cinzel', serif; font-weight: 600; letter-spacing: 0.5px; }

/* ── UTILITY ── */
.container { max-width: 1380px; margin: 0 auto; padding: 0 48px; }
.ornament { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px; }
.ornament::before, .ornament::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-gold), transparent); max-width: 80px; }
.ornament span { font-size: 18px; color: var(--rose-gold); }

/* ── TOP BAND ── */
.top-band { background: var(--crimson); color: var(--rose-gold); text-align: center; padding: 11px 20px; font-size: 12px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; }

/* ── HEADER ── */
header { background: var(--cream); padding: 0 48px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); }
.header-top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 20px 0; }
.brand { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; color: var(--crimson); text-decoration: none; text-align: center; letter-spacing: 3px; line-height: 1; }
.brand small { display: block; font-size: 9px; letter-spacing: 6px; color: var(--rose-gold); font-weight: 400; margin-top: 4px; text-transform: uppercase; }

.header-left { display: flex; align-items: center; gap: 8px; }
.h-badge { background: var(--ivory); border: 1px solid var(--border); padding: 5px 14px; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--crimson); cursor: pointer; transition: all 0.2s; }
.h-badge:hover { background: var(--crimson); color: #fff; }
.header-right { display: flex; align-items: center; gap: 20px; justify-content: flex-end; }
.icon-link { color: var(--text); text-decoration: none; display: flex; flex-direction: column; align-items: center; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; gap: 4px; font-weight: 600; transition: color 0.2s; }
.icon-link:hover { color: var(--crimson); }
.icon-link svg { width: 20px; height: 20px; stroke-width: 1.5; }

.header-nav { display: flex; justify-content: center; gap: 40px; padding: 12px 0; border-top: 1px solid var(--border); }
.header-nav a { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; color: var(--text); transition: color 0.3s; position: relative; }
.header-nav a::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 1.5px; background: var(--rose-gold); transition: width 0.3s; }
.header-nav a:hover { color: var(--crimson); }
.header-nav a:hover::after { width: 100%; }

/* ── HERO: SPLIT ── */
.hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 88vh; }
.hero-left { position: relative; background: var(--deep-red); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.hero-left::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C89B72' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.hero-img-placeholder { width: 70%; aspect-ratio: 2/3; position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; }
.hero-img-placeholder svg { width: 60%; color: rgba(200, 155, 114, 0.2); }
.hero-frame { position: absolute; inset: 30px; border: 1px solid rgba(200, 155, 114, 0.2); pointer-events: none; z-index: 2; }
.hero-frame::before, .hero-frame::after { content: ''; position: absolute; width: 24px; height: 24px; border-color: var(--rose-gold); border-style: solid; opacity: 0.8; }
.hero-frame::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.hero-frame::after { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

.hero-right { background: var(--ivory); padding: 80px 80px 80px 70px; display: flex; flex-direction: column; justify-content: center; position: relative; }
.hero-right::before { content: ''; position: absolute; top: 40px; left: 40px; width: 80%; height: 80%; border: 1px solid var(--border); pointer-events: none; }
.hero-tag { font-size: 10px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--rose-gold); margin-bottom: 20px; }
.hero-right h1 { font-size: 56px; line-height: 1.1; color: var(--crimson); margin-bottom: 24px; }
.hero-right h1 span { color: var(--rose-gold); display: block; font-style: italic; }
.hero-right p { font-size: 16px; color: var(--text-muted); line-height: 1.9; margin-bottom: 40px; max-width: 420px; font-weight: 400; }
.hero-ctas { display: flex; flex-direction: column; gap: 16px; max-width: 240px; }
.btn-primary { background: var(--crimson); color: #fff; padding: 18px 32px; font-family: 'Raleway', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; border: 1px solid var(--crimson); text-decoration: none; text-align: center; transition: all 0.3s; }
.btn-primary:hover { background: var(--deep-red); }
.btn-secondary { background: transparent; color: var(--crimson); padding: 17px 32px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; border: 1px solid var(--rose-gold); text-decoration: none; text-align: center; transition: all 0.3s; font-family: 'Raleway', sans-serif; }
.btn-secondary:hover { background: var(--rose-gold); color: #fff; }

/* HERO BADGES */
.hero-badges { display: flex; gap: 24px; margin-top: 40px; padding-top: 32px; border-top: 1px dashed var(--border); }
.h-badge-item { text-align: center; }
.h-badge-item strong { display: block; font-family: 'Cinzel', serif; font-size: 22px; color: var(--crimson); }
.h-badge-item span { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }

/* ── OCCASION STRIP ── */
.occasion-strip { padding: 60px 0; background: var(--deep-red); overflow: hidden; }
.occasion-strip .container { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.occ-btn { background: transparent; border: 1px solid rgba(200, 155, 114, 0.4); color: var(--rose-gold); padding: 12px 28px; font-family: 'Raleway', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; text-decoration: none; }
.occ-btn:hover, .occ-btn.active { background: var(--rose-gold); color: var(--deep-red); border-color: var(--rose-gold); }
.occ-title { text-align: center; margin-bottom: 32px; }
.occ-title h2 { font-size: 28px; color: #fff; margin-bottom: 8px; }
.occ-title p { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(200, 155, 114, 0.7); }

/* ── FEATURED COLLECTION: HORIZONTAL SCROLLABLE ── */
.featured { padding: 100px 0; background: var(--cream); }
.featured .container > .sec-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; }
.sec-header h2 { font-size: 32px; color: var(--crimson); }
.sec-header a { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--rose-gold); text-decoration: none; border-bottom: 1px solid var(--rose-gold); padding-bottom: 4px; transition: color 0.2s; }
.sec-header a:hover { color: var(--crimson); }

/* Unique horizontal product cards */
.prod-scroll { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.prod-card { position: relative; background: #fff; border: 1px solid var(--border); display: flex; flex-direction: column; transition: all 0.4s ease; }
.prod-card:hover { box-shadow: 0 20px 60px rgba(139, 26, 44, 0.08); transform: translateY(-6px); }

.pc-img { aspect-ratio: 3/4; background: var(--ivory); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.pc-img svg { width: 35%; color: var(--rose-gold); opacity: 0.7; transition: transform 0.6s ease, opacity 0.4s; }
.prod-card:hover .pc-img svg { transform: scale(1.08); opacity: 1; }
.pc-badge { position: absolute; top: 0; right: 0; background: var(--crimson); color: #fff; padding: 6px 14px; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.pc-badge.new { background: var(--rose-gold); }

.pc-info { padding: 24px; border-top: 1px solid var(--border); }
.pc-type { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--rose-gold); margin-bottom: 6px; }
.pc-name { font-family: 'Cinzel', serif; font-size: 16px; margin-bottom: 12px; color: var(--text); line-height: 1.4; }
.pc-material { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; font-style: italic; }
.pc-footer { display: flex; justify-content: space-between; align-items: center; }
.pc-price { font-family: 'Cinzel', serif; font-size: 18px; color: var(--crimson); }
.pc-price small { font-size: 12px; color: var(--text-muted); text-decoration: line-through; font-family: 'Raleway', sans-serif; margin-left: 8px; font-weight: 400; }
.pc-wish { width: 36px; height: 36px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-muted); }
.pc-wish:hover { border-color: var(--crimson); color: var(--crimson); }
.pc-atc { display: block; width: 100%; padding: 14px; text-align: center; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; background: var(--ivory); border: none; border-top: 1px solid var(--border); font-family: 'Raleway', sans-serif; cursor: pointer; color: var(--text); transition: all 0.3s; }
.pc-atc:hover { background: var(--crimson); color: #fff; }

/* ── THE CRAFT SECTION ── */
.craft { padding: 120px 0; background: var(--ivory); }
.craft-inner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; align-items: center; }
.craft-text { grid-column: 1 / 2; }
.craft-text .sec-label { font-size: 10px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--rose-gold); margin-bottom: 24px; display: block; }
.craft-text h2 { font-size: 38px; color: var(--crimson); line-height: 1.2; margin-bottom: 24px; }
.craft-text p { font-size: 15px; color: var(--text-muted); line-height: 1.9; margin-bottom: 32px; }
.craft-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 40px; padding-top: 40px; border-top: 1px solid var(--border); }
.craft-stat strong { display: block; font-family: 'Cinzel', serif; font-size: 32px; color: var(--crimson); }
.craft-stat span { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); }

.craft-visual { grid-column: 2 / 4; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.craft-img { background: #E8D5C0; display: flex; align-items: center; justify-content: center; position: relative; }
.craft-img:first-child { aspect-ratio: 3/4; }
.craft-img:last-child { aspect-ratio: 3/4; margin-top: 60px; background: #D4C0A8; }
.craft-img svg { width: 40%; color: #a08060; opacity: 0.5; }

/* ── BRIDAL SHOWCASE ── */
.bridal { padding: 100px 0; background: var(--deep-red); }
.bridal .container { text-align: center; }
.bridal h2 { font-size: 40px; color: #fff; margin-bottom: 16px; }
.bridal-sub { font-size: 13px; color: rgba(200, 155, 114, 0.8); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 70px; }
.bridal-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 30px; align-items: center; }
.b-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(200, 155, 114, 0.2); padding: 30px; text-align: center; position: relative; }
.b-card-center { background: rgba(255,255,255,0.08); border: 1px solid rgba(200, 155, 114, 0.4); }
.b-img { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.b-img svg { width: 40%; color: var(--rose-gold); opacity: 0.6; }
.b-card h3 { font-family: 'Cinzel', serif; font-size: 18px; color: #fff; margin-bottom: 8px; }
.b-card p { font-size: 13px; color: rgba(200, 155, 114, 0.7); }
.b-card-center h3 { font-size: 24px; }
.b-price { font-family: 'Cinzel', serif; font-size: 20px; color: var(--rose-gold); margin-top: 16px; }
.b-cta { display: inline-block; margin-top: 50px; background: var(--rose-gold); color: var(--deep-red); padding: 18px 60px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; font-family: 'Raleway', sans-serif; transition: all 0.3s; }
.b-cta:hover { background: #fff; }

/* ── TESTIMONIALS ── */
.testimonials { padding: 100px 0; }
.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
.t-card { padding: 40px; border: 1px solid var(--border); position: relative; }
.t-card::before { content: '"'; position: absolute; top: 20px; left: 28px; font-family: 'Cinzel', serif; font-size: 80px; color: var(--rose-gold); opacity: 0.15; line-height: 1; }
.t-stars { display: flex; gap: 4px; margin-bottom: 20px; }
.t-stars svg { width: 14px; fill: var(--rose-gold); }
.t-text { font-size: 14px; color: var(--text-muted); line-height: 1.9; font-style: italic; margin-bottom: 24px; }
.t-author { display: flex; align-items: center; gap: 14px; padding-top: 20px; border-top: 1px solid var(--border); }
.t-av { width: 44px; height: 44px; border-radius: 50%; background: var(--ivory); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 16px; color: var(--crimson); }
.t-name { font-family: 'Cinzel', serif; font-size: 14px; color: var(--text); }
.t-city { font-size: 11px; color: var(--text-muted); letter-spacing: 1px; }

/* ── FOOTER ── */
footer { background: #160A0A; padding: 80px 0 0; color: rgba(255,255,255,0.6); }
.f-top { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr; gap: 60px; padding-bottom: 60px; border-bottom: 1px solid rgba(200, 155, 114, 0.15); }
.f-brand .brand { text-align: left; display: inline-block; }
.f-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.9; margin: 20px 0 30px; max-width: 280px; }
.f-socials { display: flex; gap: 12px; }
.f-social { width: 36px; height: 36px; border: 1px solid rgba(200, 155, 114, 0.3); display: flex; align-items: center; justify-content: center; color: var(--rose-gold); transition: all 0.2s; }
.f-social:hover { border-color: var(--rose-gold); background: rgba(200, 155, 114, 0.1); }
.f-social svg { width: 16px; fill: currentColor; }

.f-col h4 { font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600; letter-spacing: 3px; color: var(--rose-gold); margin-bottom: 24px; text-transform: uppercase; }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 12px; }
.f-col a { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 13px; transition: color 0.3s; }
.f-col a:hover { color: var(--rose-gold); }

.f-bottom { display: flex; justify-content: space-between; padding: 24px 0; font-size: 11px; letter-spacing: 1px; color: rgba(255,255,255,0.25); }
.f-bottom-links { display: flex; gap: 32px; }
.f-bottom-links a { color: rgba(255,255,255,0.25); text-decoration: none; transition: color 0.3s; }
.f-bottom-links a:hover { color: var(--rose-gold); }

/* ── RESPONSIVE ── */
@media(max-width: 1200px) {
  .prod-scroll { grid-template-columns: repeat(2, 1fr); }
  .bridal-grid { grid-template-columns: 1fr 1fr; }
  .f-top { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 1024px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-left { aspect-ratio: 4/3; }
  .hero-right { padding: 60px 48px; }
  .hero-right h1 { font-size: 40px; }
  .craft-inner { grid-template-columns: 1fr; }
  .craft-visual { grid-column: 1 / 2; }
  .bridal-grid { grid-template-columns: 1fr; }
  .test-grid { grid-template-columns: 1fr; }
}
@media(max-width: 768px) {
  .container { padding: 0 20px; }
  header { padding: 0 20px; }
  .header-top { grid-template-columns: auto 1fr; gap: 0; }
  .header-left { display: none; }
  .header-nav { gap: 20px; overflow-x: auto; }
  .hero-right { padding: 40px 20px; }
  .prod-scroll { grid-template-columns: 1fr; }
  .craft-stats { grid-template-columns: 1fr 1fr; }
  .f-top { grid-template-columns: 1fr; gap: 40px; }
  .f-bottom { flex-direction: column; gap: 16px; }
}
</style>
<div class="top-band">✦ Make charges waived on bridal sets this season ✦ BIS Hallmarked ✦ Free insured shipping across India ✦</div>

<header>
  <div class="header-top">
    <div class="header-left">
      <a href="#" class="h-badge">Book Visit</a>
      <a href="#" class="h-badge">Bridal Lookbook</a>
    </div>
    <a href="#" class="brand">
      MEENAKSHI
      <small>Heritage Jewellers Est. 1966</small>
    </a>
    <div class="header-right">
      <a href="#" class="icon-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Search
      </a>
      <a href="#" class="icon-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Wishlist
      </a>
      <a href="#" class="icon-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        Bag (0)
      </a>
    </div>
  </div>
  <nav class="header-nav">
    <a href="#">New Arrivals</a>
    <a href="#">Necklaces</a>
    <a href="#">Rings</a>
    <a href="#">Earrings</a>
    <a href="#">Bangles & Kadas</a>
    <a href="#">Bridal Sets</a>
    <a href="#">Men's</a>
    <a href="#">Our Story</a>
  </nav>
</header>

<section class="hero">
  <div class="hero-left">
    <div class="hero-frame"></div>
    <div class="hero-img-placeholder">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    </div>
  </div>
  <div class="hero-right">
    <span class="hero-tag">✦ The Grand Wedding Edit</span>
    <h1>Where Heritage<br>Meets <span>Modern Grace</span></h1>
    <p>Each piece in our collection is handcrafted by third-generation artisans from Jaipur. Exquisite workmanship, ethically sourced gemstones, and stories passed through time.</p>
    <div class="hero-ctas">
      <a href="#" class="btn-primary">Explore Bridal</a>
      <a href="#" class="btn-secondary">Book a Consultation</a>
    </div>
    <div class="hero-badges">
      <div class="h-badge-item">
        <strong>58+</strong>
        <span>Years of Legacy</span>
      </div>
      <div class="h-badge-item">
        <strong>12,000+</strong>
        <span>Unique Designs</span>
      </div>
      <div class="h-badge-item">
        <strong>4.9★</strong>
        <span>Customer Rating</span>
      </div>
    </div>
  </div>
</section>

<section class="occasion-strip">
  <div class="container">
    <div class="occ-title">
      <h2>Shop by Occasion</h2>
      <p>Find the perfect jewellery for every milestone</p>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="#" class="occ-btn active">Bridal</a>
      <a href="#" class="occ-btn">Engagement</a>
      <a href="#" class="occ-btn">Anniversary</a>
      <a href="#" class="occ-btn">Festive</a>
      <a href="#" class="occ-btn">Office Wear</a>
      <a href="#" class="occ-btn">Gifts</a>
    </div>
  </div>
</section>

<section class="featured" id="collection">
  <div class="container">
    <div class="sec-header">
      <div>
        <div class="ornament"><span>✦</span></div>
        <h2>Bestselling Collections</h2>
      </div>
      <a href="#">View All Designs →</a>
    </div>
    <div class="prod-scroll">

      <div class="prod-card">
        <div class="pc-img">
          <span class="pc-badge">Bestseller</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div class="pc-info">
          <div class="pc-type">Necklace Set</div>
          <div class="pc-name">Rani Haar Polki Set</div>
          <div class="pc-material">22KT Gold · Uncut Diamonds · Enamel</div>
          <div class="pc-footer">
            <div class="pc-price">₹4,85,000 <small>₹5,40,000</small></div>
            <button class="pc-wish"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
          </div>
        </div>
        <button class="pc-atc">Add to Wishlist</button>
      </div>

      <div class="prod-card">
        <div class="pc-img" style="background:#EDE0D0;">
          <span class="pc-badge new">New</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        </div>
        <div class="pc-info">
          <div class="pc-type">Ring</div>
          <div class="pc-name">Solitaire Kundan Cocktail Ring</div>
          <div class="pc-material">18KT Rose Gold · Certified Diamond</div>
          <div class="pc-footer">
            <div class="pc-price">₹1,28,000</div>
            <button class="pc-wish"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
          </div>
        </div>
        <button class="pc-atc">Add to Wishlist</button>
      </div>

      <div class="prod-card">
        <div class="pc-img" style="background:#E8D8C8;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>
        </div>
        <div class="pc-info">
          <div class="pc-type">Earrings</div>
          <div class="pc-name">Chandelier Jhumki Set</div>
          <div class="pc-material">22KT Gold · Pearl & Ruby</div>
          <div class="pc-footer">
            <div class="pc-price">₹92,500 <small>₹1,04,000</small></div>
            <button class="pc-wish"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
          </div>
        </div>
        <button class="pc-atc">Add to Wishlist</button>
      </div>

      <div class="prod-card">
        <div class="pc-img" style="background:#EAE0CE;">
          <span class="pc-badge">Wedding</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
        <div class="pc-info">
          <div class="pc-type">Bangle Set</div>
          <div class="pc-name">Meenakari Bangle Set of 4</div>
          <div class="pc-material">22KT Gold · Enamel Work · 92g</div>
          <div class="pc-footer">
            <div class="pc-price">₹3,10,000</div>
            <button class="pc-wish"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
          </div>
        </div>
        <button class="pc-atc">Add to Wishlist</button>
      </div>

    </div>
  </div>
</section>

<section class="craft">
  <div class="container">
    <div class="craft-inner">
      <div class="craft-text">
        <span class="sec-label">Our Heritage</span>
        <h2>58 Years of Handcrafted Mastery</h2>
        <p>What begins as a rough sketch transforms into a wearable heirloom through 200 hours of meticulous work. Our artisans in Jaipur have kept alive the traditions of Kundan, Meenakari, and temple jewellery making that were perfected centuries ago.</p>
        <a href="#" class="btn-primary" style="max-width:200px;display:block;">Our Story →</a>
        <div class="craft-stats">
          <div class="craft-stat"><strong>200+</strong><span>Hours per piece</span></div>
          <div class="craft-stat"><strong>3rd Gen</strong><span>Artisan families</span></div>
          <div class="craft-stat"><strong>BIS</strong><span>Hallmarked</span></div>
          <div class="craft-stat"><strong>GIA</strong><span>Certified Gems</span></div>
        </div>
      </div>
      <div class="craft-visual">
        <div class="craft-img">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div class="craft-img">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bridal">
  <div class="container">
    <h2>The Bridal Suite</h2>
    <p class="bridal-sub">Complete sets curated by our master artisans for your most precious day</p>
    <div class="bridal-grid">
      <div class="b-card">
        <div class="b-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1" style="width:50%;color:var(--rose-gold);opacity:0.5;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></div>
        <h3>Kangan Collection</h3>
        <p>Traditional bangles for the bride's wrist ritual</p>
        <div class="b-price">From ₹85,000</div>
      </div>
      <div class="b-card b-card-center">
        <div class="b-img" style="aspect-ratio:3/4;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.8" style="width:50%;color:var(--rose-gold);opacity:0.6;"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <h3>Grand Bridal Set</h3>
        <p>Necklace · Jhumki · Maang Tikka · Haath Phool · 4 Bangles</p>
        <div class="b-price">From ₹8,50,000</div>
      </div>
      <div class="b-card">
        <div class="b-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1" style="width:50%;color:var(--rose-gold);opacity:0.5;"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></div>
        <h3>Maang Tikka</h3>
        <p>Statement headpiece for the crown of your look</p>
        <div class="b-price">From ₹42,000</div>
      </div>
    </div>
    <a href="#" class="b-cta">Explore The Bridal Suite</a>
  </div>
</section>

<section class="testimonials">
  <div class="container">
    <div class="ornament"><span>✦</span></div>
    <h2 style="text-align:center;font-size:32px;color:var(--crimson);">Stories from Our Brides</h2>
    <div class="test-grid">
      <div class="t-card">
        <div class="t-stars">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <p class="t-text">"The Rani Haar they crafted for my wedding was beyond anything I had imagined. Three months after the ceremony, guests still ask where it came from."</p>
        <div class="t-author">
          <div class="t-av">S</div>
          <div>
            <div class="t-name">Shreya Kapoor</div>
            <div class="t-city">Delhi NCR</div>
          </div>
        </div>
      </div>

      <div class="t-card">
        <div class="t-stars">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <p class="t-text">"The artisan consultation experience was extraordinary. They listened to every detail and delivered a set that told the story of our families."</p>
        <div class="t-author">
          <div class="t-av">P</div>
          <div>
            <div class="t-name">Preethi Nair</div>
            <div class="t-city">Chennai</div>
          </div>
        </div>
      </div>

      <div class="t-card">
        <div class="t-stars">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <p class="t-text">"The GIA certificate gave my mother-in-law complete confidence. The Meenakari bangles are heirloom quality. My daughter will wear them someday."</p>
        <div class="t-author">
          <div class="t-av">A</div>
          <div>
            <div class="t-name">Anita Mehta</div>
            <div class="t-city">Mumbai</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="f-top">
      <div class="f-brand">
        <div class="brand" style="text-align:left;">MEENAKSHI<small>Heritage Jewellers Est. 1966</small></div>
        <p class="f-desc">Three generations of artisan excellence from the heart of Jaipur. Every piece is a living heirloom, handcrafted with devotion and precision.</p>
        <div class="f-socials">
          <a href="#" class="f-social"><svg viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
          <a href="#" class="f-social"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a href="#" class="f-social"><svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.85a8.24 8.24 0 004.82 1.55V6.93a4.85 4.85 0 01-1.05-.24z"/></svg></a>
        </div>
      </div>
      <div class="f-col">
        <h4>Collections</h4>
        <ul>
          <li><a href="#">Bridal Sets</a></li>
          <li><a href="#">Gold Necklaces</a></li>
          <li><a href="#">Diamond Rings</a></li>
          <li><a href="#">Earrings</a></li>
          <li><a href="#">Bangles & Kadas</a></li>
          <li><a href="#">Men's Jewellery</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h4>The House</h4>
        <ul>
          <li><a href="#">Our Story</a></li>
          <li><a href="#">Artisans</a></li>
          <li><a href="#">Craftsmanship</a></li>
          <li><a href="#">Certifications</a></li>
          <li><a href="#">Store Locator</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h4>Help & Support</h4>
        <ul>
          <li><a href="#">Book Consultation</a></li>
          <li><a href="#">Track Order</a></li>
          <li><a href="#">Shipping Policy</a></li>
          <li><a href="#">Returns & Exchange</a></li>
          <li><a href="#">Care Guide</a></li>
          <li><a href="#">EMI Options</a></li>
        </ul>
      </div>
    </div>
    <div class="f-bottom">
      <span>© 2025 Meenakshi Heritage Jewellers. All rights reserved.</span>
      <div class="f-bottom-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Use</a>
        <a href="#">Hallmark Policy</a>
      </div>
    </div>
  </div>
</footer>
{% schema %}
{
  "name": "CF Meenakshi Heritage Jewellers Landing",
  "settings": [],
  "presets": [{ "name": "CF Meenakshi Heritage Jewellers Landing" }]
}
{% endschema %}`,
  "cf-jewellery-heritage-product": `{% comment %}ConvertFlow: Meenakshi Heritage Jewellers — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #8B1A2C;
  --cf-bg: #FAF0F0;
  --cf-font: 'Cinzel', serif;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Meenakshi Heritage Jewellers Product",
  "settings": [],
  "presets": [{ "name": "CF Meenakshi Heritage Jewellers Product" }]
}
{% endschema %}`,
  "cf-kids-toys-cart": `{% comment %}ConvertFlow: PlayBox Kids — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #2D6BE4; --cf-bg: #EFF4FF; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF PlayBox Kids Cart",
  "settings": [],
  "presets": [{ "name": "CF PlayBox Kids Cart" }]
}
{% endschema %}`,
  "cf-kids-toys-collection": `{% comment %}ConvertFlow: PlayBox Kids — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #2D6BE4; --cf-bg: #EFF4FF; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF PlayBox Kids Collection",
  "settings": [],
  "presets": [{ "name": "CF PlayBox Kids Collection" }]
}
{% endschema %}`,
  "cf-kids-toys-landing": `{% comment %}ConvertFlow: PlayBox Kids — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--yellow:#F9C22E;--blue:#2D6BE4;--red:#E83A3A;--teal:#1ABFA1;--bg:#FFFEF8;--surface:#fff;--text:#1A1A2E;--muted:#6B6B80;--border:#EAE8F0;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3,.baloo{font-family:'Baloo 2',cursive;}

/* WAVY TOP */
.top-wave{background:var(--yellow);color:#000;text-align:center;padding:10px;font-size:13px;font-weight:700;letter-spacing:.5px;}

/* HEADER */
header{padding:16px 60px;background:#fff;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid var(--yellow);position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,.04);}
.brand{font-family:'Baloo 2',cursive;font-size:30px;font-weight:800;color:var(--blue);text-decoration:none;display:flex;align-items:center;gap:4px;}
.brand .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--yellow);margin-bottom:8px;}
nav ul{display:flex;gap:28px;list-style:none;}
nav a{font-size:14px;font-weight:700;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--blue);}
.hdr-right{display:flex;gap:12px;align-items:center;}
.hdr-btn{background:var(--blue);color:#fff;padding:12px 24px;border-radius:100px;font-family:'Baloo 2',cursive;font-size:14px;font-weight:700;text-decoration:none;transition:opacity .2s;}
.hdr-btn:hover{opacity:.88;}

/* HERO */
.hero{background:linear-gradient(135deg,#EEF4FF 0%,#FFF8E8 100%);display:grid;grid-template-columns:1fr 1fr;min-height:88vh;padding:0 60px;align-items:center;gap:60px;overflow:hidden;position:relative;}
.hero::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(249,194,46,.15);}
.hero::after{content:'';position:absolute;bottom:-40px;left:40px;width:200px;height:200px;border-radius:50%;background:rgba(45,107,228,.08);}
.hero-text .badge{display:inline-flex;align-items:center;gap:8px;background:var(--yellow);color:#000;padding:6px 16px;border-radius:100px;font-size:12px;font-weight:800;letter-spacing:.5px;margin-bottom:20px;}
.hero-text h1{font-size:64px;font-weight:800;line-height:1.1;color:var(--text);margin-bottom:20px;}
.hero-text h1 span{color:var(--blue);}
.hero-text p{font-size:17px;color:var(--muted);line-height:1.8;max-width:440px;margin-bottom:36px;}
.hero-btns{display:flex;gap:12px;}
.btn-blue{background:var(--blue);color:#fff;padding:16px 40px;border-radius:100px;font-family:'Baloo 2',cursive;font-size:16px;font-weight:700;text-decoration:none;display:inline-block;transition:all .2s;box-shadow:0 6px 20px rgba(45,107,228,.3);}
.btn-blue:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(45,107,228,.35);}
.btn-outline-b{background:transparent;color:var(--blue);border:2px solid var(--blue);padding:14px 40px;border-radius:100px;font-family:'Baloo 2',cursive;font-size:16px;font-weight:700;text-decoration:none;display:inline-block;transition:all .2s;}
.btn-outline-b:hover{background:var(--blue);color:#fff;}
.hero-visual{display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
.toy-float{width:100%;max-width:460px;aspect-ratio:1;border-radius:40% 60% 60% 40% / 60% 40% 60% 40%;background:linear-gradient(135deg,#FFE8A3,#FFD166);display:flex;align-items:center;justify-content:center;animation:blob 6s ease-in-out infinite;}
.toy-float svg{width:55%;color:#2D6BE4;opacity:.5;}
@keyframes blob{0%,100%{border-radius:40% 60% 60% 40% / 60% 40% 60% 40%}50%{border-radius:60% 40% 40% 60% / 40% 60% 40% 60%}}
.age-badges{display:flex;gap:8px;margin-top:32px;}
.age-b{padding:6px 16px;border-radius:100px;font-size:12px;font-weight:800;letter-spacing:.5px;}
.ab1{background:#FFE8E8;color:#E83A3A;}
.ab2{background:#E8F0FF;color:#2D6BE4;}
.ab3{background:#E8FAF7;color:#1ABFA1;}

/* CATEGORIES */
.categories{padding:70px 60px;max-width:1400px;margin:0 auto;}
.sec-head{text-align:center;margin-bottom:50px;}
.sec-head h2{font-size:44px;font-weight:800;color:var(--text);}
.sec-head p{font-size:16px;color:var(--muted);margin-top:8px;}
.cat-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;}
.cat-card{border-radius:24px;padding:28px 20px;text-align:center;text-decoration:none;color:var(--text);transition:all .3s;position:relative;overflow:hidden;}
.cat-card:hover{transform:translateY(-6px);}
.cat-card:nth-child(1){background:#FFF0E0;}
.cat-card:nth-child(2){background:#E8F0FF;}
.cat-card:nth-child(3){background:#E8FAF7;}
.cat-card:nth-child(4){background:#FFF0F0;}
.cat-card:nth-child(5){background:#F0EAFF;}
.cat-icon{width:64px;height:64px;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;}
.cat-icon svg{width:36px;stroke-width:2;}
.cat-name{font-family:'Baloo 2',cursive;font-size:16px;font-weight:700;margin-bottom:4px;}
.cat-count{font-size:12px;color:var(--muted);}

/* PRODUCTS */
.products{padding:0 60px 80px;max-width:1400px;margin:0 auto;}
.ph{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;}
.ph h2{font-size:40px;font-weight:800;}
.ph a{font-size:13px;font-weight:700;color:var(--blue);text-decoration:none;}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.prod-card{background:#fff;border-radius:24px;overflow:hidden;border:2px solid var(--border);transition:all .3s;}
.prod-card:hover{border-color:var(--yellow);box-shadow:0 12px 40px rgba(0,0,0,.07);transform:translateY(-4px);}
.pc-img{aspect-ratio:1;display:flex;align-items:center;justify-content:center;position:relative;}
.pc-img svg{width:45%;opacity:.5;transition:transform .4s,opacity .3s;}
.prod-card:hover .pc-img svg{transform:scale(1.08);opacity:.8;}
.pc-age{position:absolute;top:14px;left:14px;background:var(--yellow);color:#000;padding:5px 12px;border-radius:100px;font-size:9px;font-weight:800;letter-spacing:1px;}
.pc-wish{position:absolute;top:12px;right:12px;width:34px;height:34px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--border);cursor:pointer;}
.pc-wish svg{width:16px;color:var(--muted);stroke-width:2;}
.pc-body{padding:20px;}
.pc-type{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--blue);margin-bottom:6px;}
.pc-name{font-family:'Baloo 2',cursive;font-size:17px;font-weight:700;margin-bottom:8px;line-height:1.3;}
.pc-skills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.skill{font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;}
.sk-green{background:#E8FAF7;color:#1ABFA1;}
.sk-blue{background:#E8F0FF;color:#2D6BE4;}
.pc-foot{display:flex;justify-content:space-between;align-items:center;}
.pc-price{font-size:20px;font-weight:800;color:var(--text);}
.pc-old{font-size:13px;color:var(--muted);text-decoration:line-through;margin-left:6px;}
.btn-add{background:var(--blue);color:#fff;border:none;padding:10px 18px;border-radius:100px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;}
.btn-add:hover{background:#1d54c4;}

/* SAFETY BANNER */
.safety{background:var(--blue);padding:70px 60px;display:flex;align-items:center;justify-content:center;gap:80px;flex-wrap:wrap;}
.safety-item{display:flex;flex-direction:column;align-items:center;gap:12px;color:#fff;}
.s-icon{width:60px;height:60px;border-radius:50%;border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;}
.s-icon svg{width:28px;color:#fff;stroke-width:1.5;}
.safety-item strong{font-family:'Baloo 2',cursive;font-size:16px;}
.safety-item span{font-size:12px;color:rgba(255,255,255,.6);text-align:center;max-width:120px;}

/* FOOTER */
footer{background:var(--text);padding:80px 60px 40px;}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.08);}
.fb a{font-family:'Baloo 2',cursive;font-size:26px;font-weight:800;color:var(--yellow);text-decoration:none;display:block;margin-bottom:16px;}
.fb p{font-size:13px;color:rgba(255,255,255,.4);line-height:1.9;max-width:260px;}
.fc h4{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:20px;}
.fc ul{list-style:none;}
.fc li{margin-bottom:10px;}
.fc a{color:rgba(255,255,255,.5);text-decoration:none;font-size:14px;transition:color .2s;}
.fc a:hover{color:var(--yellow);}
.fbot{display:flex;justify-content:space-between;padding-top:28px;font-size:11px;color:rgba(255,255,255,.2);letter-spacing:1px;}

@media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto;padding:80px 40px}.hero-visual{display:none}.cat-grid{grid-template-columns:repeat(3,1fr)}.grid{grid-template-columns:repeat(2,1fr)}.fg{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}nav{display:none}.hero{padding:60px 20px}.hero-text h1{font-size:44px}.categories{padding:60px 20px}.cat-grid{grid-template-columns:repeat(2,1fr)}.products{padding:0 20px 60px}.safety{gap:40px;padding:60px 20px}.fg{grid-template-columns:1fr;gap:40px}footer{padding:60px 20px 30px}}
</style>
<div class="top-wave">🎁 Free gift-wrapping on all orders! Use code GIFTED at checkout.</div>
<header>
  <a href="#" class="brand">PLAY<div class="dot"></div>BOX</a>
  <nav><ul>
    <li><a href="#">Toys</a></li>
    <li><a href="#">Learning</a></li>
    <li><a href="#">Outdoor</a></li>
    <li><a href="#">Arts & Crafts</a></li>
    <li><a href="#">Gift Sets</a></li>
  </ul></nav>
  <div class="hdr-right">
    <a href="#" class="hdr-btn">🛒 Cart (0)</a>
  </div>
</header>

<section class="hero">
  <div class="hero-text">
    <div class="badge">⭐ 4.9 — Trusted by 1L+ Families</div>
    <h1>Play. <span>Learn.</span><br>Grow Together.</h1>
    <p>Award-winning educational toys and games that spark curiosity, develop skills, and create lifelong memories. BIS-certified and BPA-free.</p>
    <div class="hero-btns">
      <a href="#" class="btn-blue">Shop by Age</a>
      <a href="#" class="btn-outline-b">Gift Guide →</a>
    </div>
    <div class="age-badges">
      <span class="age-b ab1">0–2 Years</span>
      <span class="age-b ab2">3–6 Years</span>
      <span class="age-b ab3">7–12 Years</span>
    </div>
  </div>
  <div class="hero-visual">
    <div class="toy-float">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
    </div>
  </div>
</section>

<section class="categories">
  <div class="sec-head"><h2>Shop by Category</h2><p>Curated for every age, interest, and milestone.</p></div>
  <div class="cat-grid">
    <a href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#E07B2A" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div><div class="cat-name">Building & STEM</div><div class="cat-count">120+ toys</div></a>
    <a href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#2D6BE4" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 015 0 2.5 2.5 0 015 0"/></svg></div><div class="cat-name">Board Games</div><div class="cat-count">80+ games</div></a>
    <a href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#1ABFA1" viewBox="0 0 24 24"><path d="M2 12h20M12 2a10 10 0 0010 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z"/></svg></div><div class="cat-name">Outdoor Play</div><div class="cat-count">60+ items</div></a>
    <a href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#E83A3A" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div class="cat-name">Arts & Crafts</div><div class="cat-count">95+ kits</div></a>
    <a href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#9B59B6" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div><div class="cat-name">Gift Sets</div><div class="cat-count">45+ sets</div></a>
  </div>
</section>

<section class="products">
  <div class="ph"><h2>🔥 Trending Picks</h2><a href="#">See all →</a></div>
  <div class="grid">
    <div class="prod-card">
      <div class="pc-img" style="background:#FFF0E0;"><span class="pc-age">Ages 5–10</span><button class="pc-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button><svg fill="none" stroke="#E07B2A" viewBox="0 0 24 24" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
      <div class="pc-body"><div class="pc-type">STEM Toys</div><div class="pc-name">GearBot Jr. Robot Builder Kit</div><div class="pc-skills"><span class="skill sk-green">Logic</span><span class="skill sk-blue">Engineering</span></div><div class="pc-foot"><div class="pc-price">₹1,299<span class="pc-old">₹1,699</span></div><button class="btn-add">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#E8F0FF;"><span class="pc-age">Ages 3–8</span><button class="pc-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button><svg fill="none" stroke="#2D6BE4" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/></svg></div>
      <div class="pc-body"><div class="pc-type">Board Games</div><div class="pc-name">Colour & Shape Family Game</div><div class="pc-skills"><span class="skill sk-blue">Creativity</span><span class="skill sk-green">Social</span></div><div class="pc-foot"><div class="pc-price">₹899</div><button class="btn-add">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#E8FAF7;"><span class="pc-age">Ages 2–5</span><button class="pc-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button><svg fill="none" stroke="#1ABFA1" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
      <div class="pc-body"><div class="pc-type">Soft Toys</div><div class="pc-name">Cuddly Zoo Animal Set (6pc)</div><div class="pc-skills"><span class="skill sk-green">Sensory</span></div><div class="pc-foot"><div class="pc-price">₹1,499<span class="pc-old">₹1,799</span></div><button class="btn-add">Add to Cart</button></div></div>
    </div>
    <div class="prod-card">
      <div class="pc-img" style="background:#FFF0F0;"><span class="pc-age">Ages 6–12</span><button class="pc-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button><svg fill="none" stroke="#E83A3A" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
      <div class="pc-body"><div class="pc-type">Arts & Crafts</div><div class="pc-name">SuperArtist Deluxe Kit (180pc)</div><div class="pc-skills"><span class="skill sk-blue">Creativity</span><span class="skill sk-green">Fine Motor</span></div><div class="pc-foot"><div class="pc-price">₹2,199</div><button class="btn-add">Add to Cart</button></div></div>
    </div>
  </div>
</section>

<div class="safety">
  <div class="safety-item"><div class="s-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><strong>BIS Certified</strong><span>All toys meet Indian safety standards</span></div>
  <div class="safety-item"><div class="s-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div><strong>BPA-Free</strong><span>Non-toxic, child-friendly materials</span></div>
  <div class="safety-item"><div class="s-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></div><strong>Eco-Friendly</strong><span>Sustainable wood & recycled materials</span></div>
  <div class="safety-item"><div class="s-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div><strong>Free Delivery</strong><span>On all orders above ₹499</span></div>
</div>

<footer>
  <div class="fg">
    <div class="fb"><a href="#">PLAYBOX 🎲</a><p>Making childhood magical through play that educates, inspires, and connects families.</p></div>
    <div class="fc"><h4>Shop</h4><ul><li><a href="#">0-2 Years</a></li><li><a href="#">3-6 Years</a></li><li><a href="#">7-12 Years</a></li><li><a href="#">Gift Sets</a></li></ul></div>
    <div class="fc"><h4>Learn</h4><ul><li><a href="#">Blog</a></li><li><a href="#">Age Guide</a></li><li><a href="#">Reviews</a></li></ul></div>
    <div class="fc"><h4>Support</h4><ul><li><a href="#">FAQ</a></li><li><a href="#">Returns</a></li><li><a href="#">Shipping</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 Playbox. All rights reserved.</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF PlayBox Kids Landing",
  "settings": [],
  "presets": [{ "name": "CF PlayBox Kids Landing" }]
}
{% endschema %}`,
  "cf-kids-toys-product": `{% comment %}ConvertFlow: PlayBox Kids — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #2D6BE4;
  --cf-bg: #EFF4FF;
  --cf-font: 'Baloo 2', cursive;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF PlayBox Kids Product",
  "settings": [],
  "presets": [{ "name": "CF PlayBox Kids Product" }]
}
{% endschema %}`,
  "cf-mobile-accessories-cart": `{% comment %}ConvertFlow: STACKD Accessories — Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #00F0C8; --cf-bg: #0D0D12; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>−</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>−{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">Proceed to Checkout →</a>
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Secure SSL Checkout</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Free Returns</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Money-Back Guarantee</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF STACKD Accessories Cart",
  "settings": [],
  "presets": [{ "name": "CF STACKD Accessories Cart" }]
}
{% endschema %}`,
  "cf-mobile-accessories-collection": `{% comment %}ConvertFlow: STACKD Accessories — Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: #00F0C8; --cf-bg: #0D0D12; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
{
  "name": "CF STACKD Accessories Collection",
  "settings": [],
  "presets": [{ "name": "CF STACKD Accessories Collection" }]
}
{% endschema %}`,
  "cf-mobile-accessories-landing": `{% comment %}ConvertFlow: STACKD Accessories — Landing Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--neon:#00F0C8;--dark:#0D0D12;--mid:#1A1A22;--text:#E8E8F0;--muted:#666670;--border:rgba(255,255,255,.08);}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--dark);color:var(--text);font-family:'Space Grotesk',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
a{text-decoration:none;}

/* HEADER */
.top{background:var(--neon);color:#000;text-align:center;padding:9px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
header{padding:20px 48px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(13,13,18,.95);backdrop-filter:blur(10px);z-index:100;}
.brand{font-size:24px;font-weight:700;color:var(--text);letter-spacing:2px;}
.brand span{color:var(--neon);}
nav ul{display:flex;gap:28px;list-style:none;}
nav a{font-size:13px;font-weight:500;color:var(--muted);transition:color .2s;}
nav a:hover{color:var(--text);}
.h-right{display:flex;gap:12px;align-items:center;}
.h-badge{background:var(--neon);color:#000;padding:10px 20px;font-size:12px;font-weight:700;letter-spacing:1px;transition:opacity .2s;}
.h-badge:hover{opacity:.85;}
.h-cart{background:var(--border);width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:var(--text);}
.h-cart svg{width:18px;stroke-width:1.5;}

/* HERO */
.hero{min-height:90vh;display:grid;grid-template-columns:1fr 1fr;padding:0 60px;align-items:center;gap:60px;border-bottom:1px solid var(--border);}
.hero-text .tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--neon);margin-bottom:20px;display:inline-flex;align-items:center;gap:10px;}
.hero-text .tag::before{content:'';width:24px;height:1px;background:var(--neon);}
.hero-text h1{font-size:84px;font-weight:700;line-height:.95;margin-bottom:28px;color:#fff;}
.hero-text h1 span{color:var(--neon);}
.hero-text p{font-size:16px;color:var(--muted);line-height:1.8;max-width:420px;margin-bottom:40px;}
.hero-ctas{display:flex;gap:12px;}
.btn-neon{background:var(--neon);color:#000;padding:16px 36px;font-size:13px;font-weight:700;letter-spacing:1px;display:inline-block;transition:opacity .2s;}
.btn-neon:hover{opacity:.85;}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border);padding:15px 36px;font-size:13px;font-weight:600;letter-spacing:1px;display:inline-block;transition:border-color .2s;}
.btn-ghost:hover{border-color:var(--neon);color:var(--neon);}
.hero-visual{height:500px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;}
.hv-card{border:1px solid var(--border);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.hv-card:first-child{grid-row:1/3;background:radial-gradient(circle at 30% 70%,rgba(0,240,200,.08),transparent 60%);}
.hv-card svg{width:40%;color:var(--neon);opacity:.3;}
.hv-label{position:absolute;bottom:16px;left:16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--neon);}

/* DEVICE SELECTOR */
.device-select{padding:24px 60px;border-bottom:1px solid var(--border);background:var(--mid);display:flex;align-items:center;gap:16px;}
.ds-label{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.ds-btns{display:flex;gap:8px;}
.ds-btn{padding:8px 20px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Space Grotesk',sans-serif;}
.ds-btn.active,.ds-btn:hover{border-color:var(--neon);color:var(--neon);}

/* PRODUCTS */
.products{padding:80px 60px;max-width:1400px;margin:0 auto;}
.ph{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px;}
.ph h2{font-size:48px;font-weight:700;color:#fff;}
.ph a{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--neon);}

.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.card{background:var(--mid);border:1px solid var(--border);transition:all .3s;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,240,200,.05),transparent);opacity:0;transition:opacity .3s;}
.card:hover::before{opacity:1;}
.card:hover{border-color:rgba(0,240,200,.3);transform:translateY(-4px);}
.c-img{aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1A1A22,#12121A);}
.c-img svg{width:40%;color:var(--neon);opacity:.3;transition:opacity .3s,transform .4s;}
.card:hover .c-img svg{opacity:.6;transform:scale(1.06);}
.c-pill{position:absolute;top:14px;right:14px;background:var(--neon);color:#000;padding:4px 12px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
.c-pill.limited{background:#FF4B6E;}
.c-body{padding:20px;}
.c-compat{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--neon);margin-bottom:6px;}
.c-name{font-size:16px;font-weight:700;color:#fff;margin-bottom:8px;}
.c-feat{font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.6;}
.c-foot{display:flex;justify-content:space-between;align-items:center;}
.c-price{font-size:20px;font-weight:700;color:#fff;}
.c-price small{font-size:12px;font-weight:400;color:var(--muted);text-decoration:line-through;margin-left:6px;}
.c-atc{background:var(--neon);color:#000;border:none;padding:10px 16px;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:opacity .2s;}
.c-atc:hover{opacity:.85;}

/* TRUST */
.trust{padding:60px;display:flex;justify-content:center;gap:80px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.trust-item{text-align:center;}
.ti-num{font-size:40px;font-weight:700;color:var(--neon);}
.ti-label{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:6px;}

/* FOOTER */
footer{background:#080810;padding:70px 60px 36px;}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid var(--border);}
.fb .brand{display:block;margin-bottom:16px;font-size:20px;}
.fb p{font-size:13px;color:var(--muted);line-height:1.9;max-width:260px;}
.fc h4{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--neon);margin-bottom:20px;}
.fc ul{list-style:none;}
.fc li{margin-bottom:10px;}
.fc a{color:var(--muted);font-size:14px;transition:color .2s;}
.fc a:hover{color:#fff;}
.fbot{display:flex;justify-content:space-between;padding-top:28px;font-size:11px;color:var(--muted);letter-spacing:1px;}

@media(max-width:1024px){.hero{grid-template-columns:1fr;gap:40px}.hero-visual{display:none}.grid{grid-template-columns:repeat(2,1fr)}.fg{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}nav{display:none}.hero{padding:0 20px;min-height:auto;padding-top:60px;padding-bottom:60px}.hero-text h1{font-size:52px}.products{padding:60px 20px}.trust{flex-wrap:wrap;gap:40px;padding:40px 20px}.fg{grid-template-columns:1fr;gap:40px}footer{padding:60px 20px 30px}}
</style>
<div class="top">🔥 SALE — Up to 40% off MagSafe Collection. Ends Sunday.</div>
<header>
  <div class="brand">STACK<span>D</span></div>
  <nav><ul>
    <li><a href="#">iPhone Cases</a></li>
    <li><a href="#">Android Cases</a></li>
    <li><a href="#">MagSafe</a></li>
    <li><a href="#">Chargers</a></li>
    <li><a href="#">Bundles</a></li>
  </ul></nav>
  <div class="h-right">
    <a href="#" class="h-badge">Shop Now</a>
    <div class="h-cart"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></div>
  </div>
</header>

<section class="hero">
  <div class="hero-text">
    <span class="tag">Drop 07 - 2025</span>
    <h1>STACK<br><span>YOUR</span><br>STYLE.</h1>
    <p>MagSafe-compatible cases crafted from aircraft-grade materials. Drop protection that doesn't compromise millimeter precision.</p>
    <div class="hero-ctas">
      <a href="#" class="btn-neon">Shop iPhone 16</a>
      <a href="#" class="btn-ghost">View All Devices</a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="hv-card"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg><span class="hv-label">Cases</span></div>
    <div class="hv-card"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg><span class="hv-label">Chargers</span></div>
    <div class="hv-card"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M8 18V8l8 5z"/></svg><span class="hv-label">Bundles</span></div>
  </div>
</section>

<div class="device-select">
  <span class="ds-label">Your Device:</span>
  <div class="ds-btns">
    <button class="ds-btn active">iPhone 16 Pro</button>
    <button class="ds-btn">iPhone 16</button>
    <button class="ds-btn">iPhone 15 Pro</button>
    <button class="ds-btn">Samsung S25</button>
    <button class="ds-btn">Pixel 9</button>
  </div>
</div>

<section class="products">
  <div class="ph"><h2>Top Picks</h2><a href="#">View all →</a></div>
  <div class="grid">
    <div class="card">
      <div class="c-img"><span class="c-pill">Bestseller</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg></div>
      <div class="c-body"><div class="c-compat">iPhone 16 Pro</div><div class="c-name">ArmorCore Ultra Case</div><div class="c-feat">Military-grade drop protection · MagSafe · Camera lens guard</div><div class="c-foot"><div class="c-price">₹3,499<small>₹4,299</small></div><button class="c-atc">Add</button></div></div>
    </div>
    <div class="card">
      <div class="c-img"><span class="c-pill limited">Limited</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="9"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg></div>
      <div class="c-body"><div class="c-compat">iPhone 16 Pro</div><div class="c-name">ClearShell Magsafe</div><div class="c-feat">Crystal clear · Yellowing resistant · 6m drop tested</div><div class="c-foot"><div class="c-price">₹2,199</div><button class="c-atc">Add</button></div></div>
    </div>
    <div class="card">
      <div class="c-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M5 12.55a11 11 0 0014.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg></div>
      <div class="c-body"><div class="c-compat">Universal</div><div class="c-name">MagCharge Pad 15W</div><div class="c-feat">15W fast charge · Qi2 · LED charge indicator · Sleek aluminum</div><div class="c-foot"><div class="c-price">₹4,999<small>₹5,999</small></div><button class="c-atc">Add</button></div></div>
    </div>
    <div class="card">
      <div class="c-img"><span class="c-pill">Popular</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></div>
      <div class="c-body"><div class="c-compat">MagSafe Bundle</div><div class="c-name">The Complete Setup</div><div class="c-feat">Case + Pad + Wallet + Stand — Save ₹1,500 when bundled</div><div class="c-foot"><div class="c-price">₹8,999<small>₹10,499</small></div><button class="c-atc">Add</button></div></div>
    </div>
  </div>
</section>

<div class="trust">
  <div class="trust-item"><div class="ti-num">500K+</div><div class="ti-label">Cases Sold</div></div>
  <div class="trust-item"><div class="ti-num">4.8★</div><div class="ti-label">Avg Rating</div></div>
  <div class="trust-item"><div class="ti-num">6m</div><div class="ti-label">Drop Tested</div></div>
  <div class="trust-item"><div class="ti-num">2 Year</div><div class="ti-label">Warranty</div></div>
</div>

<footer>
  <div class="fg">
    <div class="fb"><div class="brand">STACK<span style="color:var(--neon)">D</span></div><p>Built different. Protect everything you care about with gear engineered to outlast the phone itself.</p></div>
    <div class="fc"><h4>Shop</h4><ul><li><a href="#">iPhone Cases</a></li><li><a href="#">Android Cases</a></li><li><a href="#">Chargers</a></li><li><a href="#">Bundles</a></li></ul></div>
    <div class="fc"><h4>Info</h4><ul><li><a href="#">About</a></li><li><a href="#">Blog</a></li><li><a href="#">Affiliate</a></li></ul></div>
    <div class="fc"><h4>Help</h4><ul><li><a href="#">FAQ</a></li><li><a href="#">Returns</a></li><li><a href="#">Shipping</a></li><li><a href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 STACKD Technologies</span><span>Privacy · Terms</span></div>
</footer>
{% schema %}
{
  "name": "CF STACKD Accessories Landing",
  "settings": [],
  "presets": [{ "name": "CF STACKD Accessories Landing" }]
}
{% endschema %}`,
  "cf-mobile-accessories-product": `{% comment %}ConvertFlow: STACKD Accessories — Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: #00F0C8;
  --cf-bg: #0D0D12;
  --cf-font: 'Space Grotesk', sans-serif;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--cf-font), 'Inter', sans-serif; background: var(--cf-bg); color: #1a1a1a; -webkit-font-smoothing: antialiased; }

/* ── Breadcrumb ── */
.cfp-crumb { padding: 16px 60px; font-size: 12px; color: #888; background: #fff; border-bottom: 1px solid #eee; }
.cfp-crumb a { color: #888; text-decoration: none; }
.cfp-crumb span { margin: 0 8px; }

/* ── Product Layout ── */
.cfp-wrap { max-width: 1300px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

/* ── Gallery ── */
.cfp-gallery {}
.cfp-main-img { background: #f0ece6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 4px; }
.cfp-main-img svg { width: 30%; color: var(--cf-accent); opacity: 0.3; }
.cfp-thumbs { display: flex; gap: 10px; }
.cfp-thumb { width: 80px; aspect-ratio: 1; background: #e8e4de; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; }
.cfp-thumb:first-child { border-color: var(--cf-accent); }

/* ── Info ── */
.cfp-info {}
.cfp-vendor { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 12px; display: block; }
.cfp-name { font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.cfp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #888; font-size: 13px; }
.cfp-stars { color: #F59E0B; letter-spacing: 2px; }
.cfp-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.cfp-price { font-size: 32px; font-weight: 700; color: #1a1a1a; }
.cfp-compare { font-size: 20px; color: #aaa; text-decoration: line-through; }
.cfp-save { background: #DCFCE7; color: #16A34A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.cfp-desc { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 28px; }

/* ── Variants ── */
.cfp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; color: #333; }
.cfp-variants { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cfp-var { padding: 8px 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all .2s; }
.cfp-var:hover, .cfp-var.active { border-color: var(--cf-accent); background: var(--cf-accent); color: #fff; }

/* ── Qty + ATC ── */
.cfp-atc-row { display: flex; gap: 12px; margin-bottom: 16px; }
.cfp-qty { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
.cfp-qty button { width: 40px; height: 52px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
.cfp-qty span { width: 40px; text-align: center; font-size: 16px; font-weight: 600; }
.cfp-atc { flex: 1; background: var(--cf-accent); color: #fff; border: none; padding: 16px 32px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; transition: opacity .2s; border-radius: 4px; }
.cfp-atc:hover { opacity: .9; }
.cfp-wishlist { width: 52px; height: 52px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; color: #888; transition: all .2s; flex-shrink: 0; }
.cfp-wishlist:hover { border-color: var(--cf-accent); color: var(--cf-accent); }

/* ── Trust badges ── */
.cfp-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
.cfp-trust-item { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; font-weight: 500; }
.cfp-trust-icon { color: var(--cf-accent); }

/* ── About section ── */
.cfp-about { background: #fff; border-top: 1px solid #eee; padding: 80px 60px; }
.cfp-about-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.cfp-about h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
.cfp-about p { font-size: 15px; color: #555; line-height: 1.9; }
.cfp-specs { list-style: none; }
.cfp-specs li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.cfp-specs li:last-child { border-bottom: none; }
.cfp-specs strong { color: #888; font-weight: 500; }

@media(max-width: 1024px) { .cfp-wrap { grid-template-columns: 1fr; padding: 40px 20px; gap: 40px; } .cfp-about { padding: 60px 20px; } .cfp-about-inner { grid-template-columns: 1fr; gap: 40px; } .cfp-crumb { padding: 12px 20px; } }
</style>

<div class="cfp-crumb">
  <a href="/">Home</a><span>›</span>
  <a href="/collections/all">{{ product.type | default: 'Products' }}</a><span>›</span>
  {{ product.title }}
</div>

<div class="cfp-wrap">
  <!-- Gallery -->
  <div class="cfp-gallery">
    <div class="cfp-main-img">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 4 %}
        <div class="cfp-thumb" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center;"></div>
      {% else %}
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Info -->
  <div class="cfp-info">
    <span class="cfp-vendor">{{ product.vendor }}</span>
    <h1 class="cfp-name">{{ product.title }}</h1>
    <div class="cfp-rating"><span class="cfp-stars">★★★★★</span> 4.9 · 2,148 reviews</div>
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 240 }}</p>

    {% if product.has_only_default_variant == false %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endif %}

    <div class="cfp-atc-row">
      <div class="cfp-qty">
        <button onclick="this.nextElementSibling.textContent=Math.max(1,+this.nextElementSibling.textContent-1)">−</button>
        <span>1</span>
        <button onclick="this.previousElementSibling.textContent=+this.previousElementSibling.textContent+1">+</button>
      </div>
      <button class="cfp-atc">Add to Cart</button>
      <button class="cfp-wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> Authentic &amp; Certified</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Delivery</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> Easy 30-Day Returns</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> Secure Checkout</div>
    </div>
  </div>
</div>

<div class="cfp-about">
  <div class="cfp-about-inner">
    <div>
      <h2>About This Product</h2>
      <p>{{ product.description }}</p>
    </div>
    <div>
      <h2>Product Details</h2>
      <ul class="cfp-specs">
        <li><strong>Type</strong> {{ product.type | default: '—' }}</li>
        <li><strong>Vendor</strong> {{ product.vendor | default: '—' }}</li>
        <li><strong>SKU</strong> {{ product.selected_or_first_available_variant.sku | default: '—' }}</li>
        <li><strong>Available</strong> {% if product.available %}In Stock{% else %}Out of Stock{% endif %}</li>
        {% for tag in product.tags limit: 4 %}
          <li><strong>Tag</strong> {{ tag }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF STACKD Accessories Product",
  "settings": [],
  "presets": [{ "name": "CF STACKD Accessories Product" }]
}
{% endschema %}`,
  "cf-pilgrim-cart": `{% comment %}
  ConvertFlow — Pilgrim-Style Premium Cart Page
  Self-contained, injects into templates/cart.json
{% endcomment %}

{% style %}
  .cf-cart * { margin: 0; padding: 0; box-sizing: border-box; }
  .cf-cart {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
    min-height: 60vh;
  }

  /* ── Cart Layout ── */
  .cf-cart-wrap {
    max-width: 1280px;
    margin: 0 auto;
    padding: 48px 40px;
  }
  .cf-cart-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }
  .cf-cart-subtitle { font-size: 14px; color: #888; margin-bottom: 40px; }
  .cf-cart-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }

  /* ── Cart Items ── */
  .cf-cart-items {}
  .cf-cart-header {
    display: grid;
    grid-template-columns: 1fr 120px 140px 80px;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #1a1a1a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #555;
  }
  .cf-cart-item {
    display: grid;
    grid-template-columns: 1fr 120px 140px 80px;
    gap: 16px;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid #f0ebe5;
  }
  .cf-cart-item-left {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .cf-cart-item-img {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    overflow: hidden;
    background: #faf7f2;
    flex-shrink: 0;
  }
  .cf-cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .cf-cart-item-name {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  .cf-cart-item-variant { font-size: 12px; color: #888; margin-bottom: 8px; }
  .cf-cart-item-remove {
    font-size: 12px;
    color: #E74C3C;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }
  .cf-cart-item-price {
    font-size: 16px;
    font-weight: 700;
  }
  .cf-cart-item-price-original {
    font-size: 12px;
    color: #aaa;
    text-decoration: line-through;
  }

  /* Quantity */
  .cf-cart-qty {
    display: flex;
    align-items: center;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
    width: fit-content;
  }
  .cf-cart-qty button {
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a1a1a;
    transition: background 0.2s;
  }
  .cf-cart-qty button:hover { background: #faf7f2; }
  .cf-cart-qty span {
    width: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    border-left: 1.5px solid #e5e7eb;
    border-right: 1.5px solid #e5e7eb;
    line-height: 36px;
  }
  .cf-cart-item-total { font-size: 16px; font-weight: 800; }

  /* ── Empty Cart ── */
  .cf-cart-empty {
    text-align: center;
    padding: 80px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .cf-cart-empty-icon { color: #ddd; }
  .cf-cart-empty h3 { font-size: 22px; font-weight: 700; }
  .cf-cart-empty p { font-size: 14px; color: #888; }
  .cf-cart-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: #1a1a1a;
    color: #fff;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
  }

  /* ── Cart Summary ── */
  .cf-cart-summary {
    background: #faf7f2;
    border-radius: 20px;
    padding: 32px;
    border: 1px solid #f0ebe5;
    position: sticky;
    top: 20px;
  }
  .cf-cart-summary h3 {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0ebe5;
  }
  .cf-cart-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #555;
  }
  .cf-cart-summary-row.total {
    font-size: 18px;
    font-weight: 800;
    color: #1a1a1a;
    border-top: 1px solid #e5e7eb;
    padding-top: 16px;
    margin-top: 16px;
    margin-bottom: 24px;
  }
  .cf-cart-checkout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 18px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    text-decoration: none;
    text-align: center;
  }
  .cf-cart-checkout:hover {
    background: #333;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
  .cf-cart-continue {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px;
    background: transparent;
    color: #555;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    margin-bottom: 24px;
    transition: all 0.2s;
  }
  .cf-cart-continue:hover { border-color: #C17F5E; color: #C17F5E; }

  /* Promo */
  .cf-promo-row {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }
  .cf-promo-input {
    flex: 1;
    padding: 12px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .cf-promo-input:focus { border-color: #C17F5E; }
  .cf-promo-btn {
    padding: 12px 20px;
    background: #fff;
    border: 1.5px solid #1a1a1a;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
  }
  .cf-promo-btn:hover { background: #1a1a1a; color: #fff; }

  /* Trust strip */
  .cf-cart-trust {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 0 0;
    border-top: 1px solid #f0ebe5;
  }
  .cf-cart-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #666;
  }
  .cf-cart-trust-icon { color: #C17F5E; flex-shrink: 0; }

  /* ── You May Also Like ── */
  .cf-cart-upsell {
    padding: 60px 40px;
    border-top: 1px solid #f0ebe5;
    background: #fff;
  }
  .cf-cart-upsell-inner { max-width: 1280px; margin: 0 auto; }
  .cf-cart-upsell h2 { font-size: 24px; font-weight: 800; margin-bottom: 24px; }
  .cf-cart-upsell-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .cf-upsell-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #f0ebe5;
    transition: all 0.3s ease;
    text-decoration: none;
    color: #1a1a1a;
    display: block;
  }
  .cf-upsell-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.07); }
  .cf-upsell-img {
    aspect-ratio: 1;
    overflow: hidden;
    background: #faf7f2;
  }
  .cf-upsell-img img { width: 100%; height: 100%; object-fit: cover; }
  .cf-upsell-info { padding: 16px; }
  .cf-upsell-name { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
  .cf-upsell-price { font-size: 15px; font-weight: 800; color: #C17F5E; }
  .cf-upsell-atc {
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.5px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .cf-cart-wrap { padding: 24px 16px; }
    .cf-cart-grid { grid-template-columns: 1fr; }
    .cf-cart-header { display: none; }
    .cf-cart-item { grid-template-columns: 1fr; gap: 12px; }
    .cf-cart-upsell-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cf-cart-upsell { padding: 40px 16px; }
    .cf-cart-summary { position: static; }
  }
{% endstyle %}

<div class="cf-cart">
  <div class="cf-cart-wrap">
    <h1 class="cf-cart-title">Your Cart</h1>

    {%- if cart.item_count == 0 -%}
      <div class="cf-cart-empty">
        <svg class="cf-cart-empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet. Let's fix that!</p>
        <a href="/collections/all" class="cf-cart-empty-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Shop Now
        </a>
      </div>
    {%- else -%}
      <p class="cf-cart-subtitle">{{ cart.item_count }} item{% if cart.item_count > 1 %}s{% endif %} in your cart</p>

      <div class="cf-cart-grid">
        <!-- Items -->
        <div class="cf-cart-items">
          <div class="cf-cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {%- form 'cart', cart, id: 'cf-cart-form' -%}
            {%- for item in cart.items -%}
              <div class="cf-cart-item">
                <div class="cf-cart-item-left">
                  <div class="cf-cart-item-img">
                    <a href="{{ item.url }}">
                      {%- if item.image -%}
                        <img src="{{ item.image | image_url: width: 200 }}" alt="{{ item.title }}" loading="lazy">
                      {%- else -%}
                        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#faf7f2;">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a574" stroke-width="1.5"><path d="M9 2h6l1 7H8l1-7Z"/></svg>
                        </div>
                      {%- endif -%}
                    </a>
                  </div>
                  <div>
                    <a href="{{ item.url }}" style="text-decoration:none;color:#1a1a1a;">
                      <div class="cf-cart-item-name">{{ item.product.title }}</div>
                    </a>
                    {%- unless item.variant.title == 'Default Title' -%}
                      <div class="cf-cart-item-variant">{{ item.variant.title }}</div>
                    {%- endunless -%}
                    <a href="{{ routes.cart_change_url }}?id={{ item.key }}&quantity=0" class="cf-cart-item-remove" data-remove="{{ item.key }}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      Remove
                    </a>
                  </div>
                </div>

                <div class="cf-cart-item-price">
                  {{ item.price | money }}
                  {%- if item.original_price > item.price -%}
                    <div class="cf-cart-item-price-original">{{ item.original_price | money }}</div>
                  {%- endif -%}
                </div>

                <div class="cf-cart-qty">
                  <button type="button" onclick="cfCartQty('{{ item.key }}', {{ item.quantity }}, -1)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <span id="qty-{{ item.key }}">{{ item.quantity }}</span>
                  <button type="button" onclick="cfCartQty('{{ item.key }}', {{ item.quantity }}, 1)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>

                <div class="cf-cart-item-total">{{ item.line_price | money }}</div>
              </div>
            {%- endfor -%}
          {%- endform -%}
        </div>

        <!-- Summary -->
        <div class="cf-cart-summary">
          <h3>Order Summary</h3>

          <div class="cf-cart-summary-row">
            <span>Subtotal</span>
            <span>{{ cart.total_price | money }}</span>
          </div>
          <div class="cf-cart-summary-row">
            <span>Shipping</span>
            <span style="color:#27ae60;font-weight:700;">
              {%- if cart.total_price >= 49900 -%}FREE{%- else -%}Calculated at checkout{%- endif -%}
            </span>
          </div>
          {%- if cart.total_discount > 0 -%}
            <div class="cf-cart-summary-row" style="color:#27ae60;">
              <span>Discount</span>
              <span>- {{ cart.total_discount | money }}</span>
            </div>
          {%- endif -%}
          <div class="cf-cart-summary-row total">
            <span>Total</span>
            <span>{{ cart.total_price | money }}</span>
          </div>

          <!-- Promo Code -->
          <div class="cf-promo-row">
            <input type="text" class="cf-promo-input" placeholder="Promo code" id="cf-promo-code">
            <button class="cf-promo-btn" onclick="cfApplyPromo()">Apply</button>
          </div>

          <a href="/checkout" class="cf-cart-checkout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Proceed to Checkout
          </a>
          <a href="/collections/all" class="cf-cart-continue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="19 12 5 12"/><polyline points="12 5 5 12 12 19"/></svg>
            Continue Shopping
          </a>

          <!-- Trust -->
          <div class="cf-cart-trust">
            <div class="cf-cart-trust-item">
              <svg class="cf-cart-trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Free Shipping on orders above {{ section.settings.free_shipping_threshold | default: '₹499' }}
            </div>
            <div class="cf-cart-trust-item">
              <svg class="cf-cart-trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              100% Secure Checkout
            </div>
            <div class="cf-cart-trust-item">
              <svg class="cf-cart-trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Easy 30-Day Returns
            </div>
          </div>
        </div>
      </div>
    {%- endif -%}
  </div>

  <!-- You May Also Like -->
  {%- if section.settings.show_upsell and cart.item_count > 0 -%}
    <div class="cf-cart-upsell">
      <div class="cf-cart-upsell-inner">
        <h2>{{ section.settings.upsell_title | default: 'You May Also Like' }}</h2>
        <div class="cf-cart-upsell-grid">
          {%- assign upsell_col = collections[section.settings.upsell_collection] -%}
          {%- for product in upsell_col.products limit: 4 -%}
            <a href="{{ product.url }}" class="cf-upsell-card">
              <div class="cf-upsell-img">
                {%- if product.featured_image -%}
                  <img src="{{ product.featured_image | image_url: width: 400 }}" alt="{{ product.title }}" loading="lazy">
                {%- endif -%}
              </div>
              <div class="cf-upsell-info">
                <div class="cf-upsell-name">{{ product.title }}</div>
                <div class="cf-upsell-price">{{ product.price | money }}</div>
                <button class="cf-upsell-atc" onclick="cfAddUpsell(event, {{ product.variants.first.id }})">QUICK ADD</button>
              </div>
            </a>
          {%- endfor -%}
        </div>
      </div>
    </div>
  {%- endif -%}
</div>

<script>
  // Quantity update via AJAX
  function cfCartQty(key, currentQty, delta) {
    var newQty = Math.max(0, currentQty + delta);
    var el = document.getElementById('qty-' + key);
    if (el) el.textContent = newQty;
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: newQty })
    }).then(function() { location.reload(); });
  }

  // Add upsell product
  function cfAddUpsell(e, variantId) {
    e.preventDefault();
    e.stopPropagation();
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    }).then(function() { location.reload(); });
  }

  // Promo stub
  function cfApplyPromo() {
    var code = document.getElementById('cf-promo-code').value;
    if (code) {
      window.location.href = '/checkout?discount=' + encodeURIComponent(code);
    }
  }
</script>

{% schema %}
{
  "name": "CF: Pilgrim Cart Page",
  "tag": "section",
  "class": "convertflow-cart",
  "settings": [
    { "type": "header", "content": "Shipping" },
    { "type": "text", "id": "free_shipping_threshold", "label": "Free Shipping Threshold Label", "default": "₹499" },
    { "type": "header", "content": "Upsell Section" },
    { "type": "checkbox", "id": "show_upsell", "label": "Show You May Also Like", "default": true },
    { "type": "text", "id": "upsell_title", "label": "Upsell Section Title", "default": "You May Also Like" },
    { "type": "collection", "id": "upsell_collection", "label": "Upsell Products Collection" }
  ],
  "presets": [
    { "name": "CF: Pilgrim Cart Page" }
  ]
}
{% endschema %}
`,
  "cf-pilgrim-landing": `{% comment %}
  ConvertFlow — Pilgrim-Style Beauty Landing Page
  A premium, full-page beauty/skincare section inspired by discoverpilgrim.com
  Self-contained with all CSS/JS — inject into any Shopify theme.
{% endcomment %}

{% style %}
  /* ── Reset & Base ── */
  .cf-pilgrim * { margin: 0; padding: 0; box-sizing: border-box; }
  .cf-pilgrim {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    color: #1a1a1a;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Announcement Bar ── */
  .cf-announce {
    background: {{ section.settings.announce_bg | default: '#2D2D2D' }};
    color: {{ section.settings.announce_text | default: '#fff' }};
    text-align: center;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .cf-announce a {
    color: {{ section.settings.announce_link_color | default: '#FFD700' }};
    text-decoration: underline;
    font-weight: 600;
  }

  /* ── Hero Banner ── */
  .cf-hero {
    position: relative;
    width: 100%;
    min-height: 520px;
    background: {{ section.settings.hero_bg | default: 'linear-gradient(135deg, #FFF5EE 0%, #FAEBD7 50%, #FFE4C4 100%)' }};
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .cf-hero-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 60px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    width: 100%;
  }
  .cf-hero-badge {
    display: inline-block;
    background: {{ section.settings.badge_bg | default: '#D4A574' }};
    color: #fff;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .cf-hero h1 {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.15;
    color: {{ section.settings.hero_heading_color | default: '#1a1a1a' }};
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  .cf-hero h1 span {
    color: {{ section.settings.hero_accent | default: '#C17F5E' }};
  }
  .cf-hero-sub {
    font-size: 17px;
    color: #555;
    margin-bottom: 28px;
    max-width: 440px;
    line-height: 1.7;
  }
  .cf-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: {{ section.settings.cta_bg | default: '#1a1a1a' }};
    color: {{ section.settings.cta_text | default: '#fff' }};
    padding: 16px 36px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    letter-spacing: 0.5px;
  }
  .cf-hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  .cf-hero-img-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cf-hero-img-wrap img {
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 20px;
    object-fit: cover;
  }
  .cf-hero-float {
    position: absolute;
    background: #fff;
    border-radius: 16px;
    padding: 14px 20px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: cf-float 3s ease-in-out infinite;
  }
  .cf-hero-float.top-right { top: 20px; right: -20px; }
  .cf-hero-float.bottom-left { bottom: 30px; left: -20px; }
  .cf-hero-float .cf-icon { font-size: 22px; }

  @keyframes cf-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* ── Trust Bar ── */
  .cf-trust-bar {
    background: {{ section.settings.trust_bg | default: '#FAF7F2' }};
    border-top: 1px solid rgba(0,0,0,0.05);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    padding: 18px 20px;
  }
  .cf-trust-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .cf-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    letter-spacing: 0.3px;
  }
  .cf-trust-item .cf-icon { font-size: 20px; }

  /* ── Section Headings ── */
  .cf-section-head {
    text-align: center;
    margin-bottom: 48px;
  }
  .cf-section-head .cf-overline {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: {{ section.settings.accent_color | default: '#C17F5E' }};
    margin-bottom: 12px;
    display: block;
  }
  .cf-section-head h2 {
    font-size: 36px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }
  .cf-section-head p {
    font-size: 16px;
    color: #777;
    max-width: 560px;
    margin: 0 auto;
  }

  /* ── Category Grid ── */
  .cf-categories {
    padding: 80px 40px;
    max-width: 1280px;
    margin: 0 auto;
  }
  .cf-cat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .cf-cat-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 3/4;
    cursor: pointer;
    text-decoration: none;
    color: #fff;
    display: block;
  }
  .cf-cat-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  .cf-cat-card:hover img { transform: scale(1.08); }
  .cf-cat-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
  }
  .cf-cat-overlay h3 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .cf-cat-overlay span {
    font-size: 13px;
    opacity: 0.85;
  }

  /* ── Product Grid ── */
  .cf-products {
    padding: 80px 40px;
    background: {{ section.settings.products_bg | default: '#fff' }};
  }
  .cf-products-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .cf-prod-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .cf-prod-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #f0ebe5;
    transition: all 0.3s ease;
    text-decoration: none;
    color: #1a1a1a;
    display: block;
  }
  .cf-prod-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  }
  .cf-prod-img {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: #faf7f2;
  }
  .cf-prod-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .cf-prod-card:hover .cf-prod-img img { transform: scale(1.05); }
  .cf-prod-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: {{ section.settings.badge_hot_bg | default: '#E74C3C' }};
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .cf-prod-badge.new { background: #2ECC71; }
  .cf-prod-badge.best { background: #E67E22; }
  .cf-prod-info {
    padding: 20px;
  }
  .cf-prod-name {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .cf-prod-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    font-size: 12px;
    color: #999;
  }
  .cf-prod-stars { color: #F5A623; font-size: 13px; }
  .cf-prod-price {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cf-prod-price .cf-current {
    font-size: 18px;
    font-weight: 800;
    color: #1a1a1a;
  }
  .cf-prod-price .cf-original {
    font-size: 14px;
    color: #aaa;
    text-decoration: line-through;
  }
  .cf-prod-price .cf-discount {
    font-size: 12px;
    font-weight: 700;
    color: #27ae60;
  }
  .cf-prod-atc {
    display: block;
    width: 100%;
    margin-top: 14px;
    padding: 12px;
    background: {{ section.settings.atc_bg | default: '#1a1a1a' }};
    color: {{ section.settings.atc_text | default: '#fff' }};
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    letter-spacing: 0.5px;
  }
  .cf-prod-atc:hover { opacity: 0.85; }

  /* ── Ingredients Section ── */
  .cf-ingredients {
    padding: 80px 40px;
    background: {{ section.settings.ingredients_bg | default: '#FFF9F4' }};
  }
  .cf-ingredients-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .cf-ingr-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
  }
  .cf-ingr-card {
    text-align: center;
    padding: 28px 16px;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #f0ebe5;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
    color: #1a1a1a;
    display: block;
  }
  .cf-ingr-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    border-color: {{ section.settings.accent_color | default: '#C17F5E' }};
  }
  .cf-ingr-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: {{ section.settings.ingr_icon_bg | default: '#FFF0E5' }};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    font-size: 28px;
  }
  .cf-ingr-card h4 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .cf-ingr-card p {
    font-size: 11px;
    color: #888;
    line-height: 1.4;
  }

  /* ── Story / About Banner ── */
  .cf-story {
    padding: 100px 40px;
    background: {{ section.settings.story_bg | default: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }};
    color: #fff;
  }
  .cf-story-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .cf-story-overline {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: {{ section.settings.accent_color | default: '#C17F5E' }};
    margin-bottom: 16px;
    display: block;
  }
  .cf-story h2 {
    font-size: 40px;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.2;
    letter-spacing: -0.3px;
  }
  .cf-story p {
    font-size: 16px;
    line-height: 1.8;
    color: rgba(255,255,255,0.75);
    margin-bottom: 32px;
  }
  .cf-story-stats {
    display: flex;
    gap: 40px;
  }
  .cf-story-stat h3 {
    font-size: 32px;
    font-weight: 800;
    color: {{ section.settings.accent_color | default: '#C17F5E' }};
  }
  .cf-story-stat span {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
  }
  .cf-story-img {
    border-radius: 20px;
    overflow: hidden;
  }
  .cf-story-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }

  /* ── Testimonials ── */
  .cf-reviews {
    padding: 80px 40px;
    background: #fff;
  }
  .cf-reviews-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .cf-rev-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .cf-rev-card {
    background: {{ section.settings.review_card_bg | default: '#FAF7F2' }};
    border-radius: 16px;
    padding: 32px;
    border: 1px solid #f0ebe5;
  }
  .cf-rev-stars {
    color: #F5A623;
    font-size: 16px;
    margin-bottom: 16px;
    letter-spacing: 2px;
  }
  .cf-rev-text {
    font-size: 15px;
    color: #444;
    line-height: 1.7;
    margin-bottom: 20px;
    font-style: italic;
  }
  .cf-rev-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cf-rev-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: {{ section.settings.accent_color | default: '#C17F5E' }};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
  }
  .cf-rev-name {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
  }
  .cf-rev-verified {
    font-size: 11px;
    color: #27ae60;
  }

  /* ── Newsletter ── */
  .cf-newsletter {
    padding: 80px 40px;
    background: {{ section.settings.newsletter_bg | default: '#FFF5EE' }};
    text-align: center;
  }
  .cf-newsletter-inner {
    max-width: 560px;
    margin: 0 auto;
  }
  .cf-newsletter h2 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    color: #1a1a1a;
  }
  .cf-newsletter p {
    font-size: 15px;
    color: #777;
    margin-bottom: 28px;
  }
  .cf-newsletter-form {
    display: flex;
    gap: 12px;
    max-width: 480px;
    margin: 0 auto;
  }
  .cf-newsletter-input {
    flex: 1;
    padding: 16px 20px;
    border: 2px solid #e0d5c9;
    border-radius: 50px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
    background: #fff;
  }
  .cf-newsletter-input:focus {
    border-color: {{ section.settings.accent_color | default: '#C17F5E' }};
  }
  .cf-newsletter-btn {
    padding: 16px 32px;
    background: {{ section.settings.cta_bg | default: '#1a1a1a' }};
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  .cf-newsletter-btn:hover { opacity: 0.85; }

  /* ── Footer ── */
  .cf-footer {
    background: #1a1a1a;
    color: #bbb;
    padding: 60px 40px 30px;
  }
  .cf-footer-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .cf-footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }
  .cf-footer-brand h3 {
    font-size: 24px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 12px;
  }
  .cf-footer-brand p {
    font-size: 13px;
    line-height: 1.7;
    color: #888;
  }
  .cf-footer h4 {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
  }
  .cf-footer ul { list-style: none; }
  .cf-footer li { margin-bottom: 10px; }
  .cf-footer a {
    color: #888;
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s ease;
  }
  .cf-footer a:hover { color: {{ section.settings.accent_color | default: '#C17F5E' }}; }
  .cf-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #666;
  }

  /* ── Mobile Responsive ── */
  @media (max-width: 768px) {
    .cf-hero-inner { grid-template-columns: 1fr; padding: 40px 20px; gap: 30px; }
    .cf-hero h1 { font-size: 32px; }
    .cf-hero-img-wrap { display: none; }
    .cf-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cf-prod-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cf-ingr-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .cf-story-inner { grid-template-columns: 1fr; gap: 40px; }
    .cf-rev-grid { grid-template-columns: 1fr; }
    .cf-footer-grid { grid-template-columns: 1fr 1fr; }
    .cf-trust-inner { justify-content: center; }
    .cf-newsletter-form { flex-direction: column; }
    .cf-categories, .cf-products, .cf-ingredients, .cf-story, .cf-reviews, .cf-newsletter {
      padding: 50px 20px;
    }
    .cf-section-head h2 { font-size: 26px; }
  }
{% endstyle %}


<div class="cf-pilgrim">
  <!-- ── Announcement Bar ── -->
  <div class="cf-announce">
    <span>{{ section.settings.announce_icon | default: '🎉' }}</span>
    <span>{{ section.settings.announce_text_content | default: 'FLAT 20% OFF on your first order' }}</span>
    <a href="{{ section.settings.announce_link | default: '#' }}">
      {{ section.settings.announce_cta | default: 'Shop Now →' }}
    </a>
  </div>

  <!-- ── Hero Banner ── -->
  <div class="cf-hero">
    <div class="cf-hero-inner">
      <div>
        <span class="cf-hero-badge">{{ section.settings.hero_badge | default: 'NEW COLLECTION' }}</span>
        <h1>
          {{ section.settings.hero_title_1 | default: 'Discover Your' }}
          <br>
          <span>{{ section.settings.hero_title_accent | default: 'Natural Glow' }}</span>
        </h1>
        <p class="cf-hero-sub">
          {{ section.settings.hero_subtitle | default: 'Premium skincare powered by ancient beauty secrets from around the world. Vegan, cruelty-free, and FDA approved.' }}
        </p>
        <a href="{{ section.settings.hero_cta_link | default: '/collections/all' }}" class="cf-hero-cta">
          {{ section.settings.hero_cta_text | default: 'Explore Collection' }} →
        </a>
      </div>
      <div class="cf-hero-img-wrap">
        {% if section.settings.hero_image %}
          <img src="{{ section.settings.hero_image | image_url: width: 800 }}" alt="Hero product" loading="eager">
        {% else %}
          <div style="width:100%;max-width:500px;aspect-ratio:4/5;background:linear-gradient(135deg,#f0e6da,#e8d5c4);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:48px;">🌿</div>
        {% endif %}
        <div class="cf-hero-float top-right">
          <span class="cf-icon">✨</span>
          <div>
            <div style="font-size:11px;color:#999">Rating</div>
            <div style="font-weight:800">4.9 / 5.0</div>
          </div>
        </div>
        <div class="cf-hero-float bottom-left">
          <span class="cf-icon">🧴</span>
          <div>
            <div style="font-size:11px;color:#999">Products</div>
            <div style="font-weight:800">200+ SKUs</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Trust Bar ── -->
  <div class="cf-trust-bar">
    <div class="cf-trust-inner">
      <div class="cf-trust-item"><span class="cf-icon">🚚</span> Free Shipping above ₹499</div>
      <div class="cf-trust-item"><span class="cf-icon">🐰</span> Cruelty Free</div>
      <div class="cf-trust-item"><span class="cf-icon">🌱</span> 100% Vegan</div>
      <div class="cf-trust-item"><span class="cf-icon">✅</span> FDA Approved</div>
      <div class="cf-trust-item"><span class="cf-icon">🔬</span> Dermat Tested</div>
    </div>
  </div>

  <!-- ── Shop By Category ── -->
  <div class="cf-categories">
    <div class="cf-section-head">
      <span class="cf-overline">{{ section.settings.cat_overline | default: 'Explore' }}</span>
      <h2>{{ section.settings.cat_title | default: 'Shop by Category' }}</h2>
      <p>{{ section.settings.cat_desc | default: 'Find the perfect products for your beauty routine' }}</p>
    </div>
    <div class="cf-cat-grid">
      {% for block in section.blocks %}
        {% if block.type == 'category' %}
          {%- assign cat_collection = block.settings.collection -%}
          {%- assign cat_label = block.settings.custom_title | default: cat_collection.title | default: 'Category' -%}
          {%- assign cat_url = cat_collection.url | default: block.settings.custom_link | default: '#' -%}
          {%- assign cat_count = cat_collection.products_count | default: block.settings.custom_count -%}
          <a href="{{ cat_url }}" class="cf-cat-card">
            {%- if block.settings.custom_image -%}
              <img src="{{ block.settings.custom_image | image_url: width: 600 }}" alt="{{ cat_label }}" loading="lazy">
            {%- elsif cat_collection.image -%}
              <img src="{{ cat_collection.image | image_url: width: 600 }}" alt="{{ cat_label }}" loading="lazy">
            {%- elsif cat_collection.products.first.featured_image -%}
              <img src="{{ cat_collection.products.first.featured_image | image_url: width: 600 }}" alt="{{ cat_label }}" loading="lazy">
            {%- else -%}
              <div style="width:100%;height:100%;background:linear-gradient(135deg,#e8d5c4,#d4a574);"></div>
            {%- endif -%}
            <div class="cf-cat-overlay">
              <h3>{{ cat_label }}</h3>
              {%- if cat_count and cat_count != 0 -%}
                <span>{{ cat_count }} Products</span>
              {%- else -%}
                <span>{{ block.settings.custom_count | default: 'Shop Now' }}</span>
              {%- endif -%}
            </div>
          </a>
        {% endif %}
      {% endfor %}
    </div>
  </div>

  <!-- ── Bestseller Products ── -->
  <div class="cf-products">
    <div class="cf-products-inner">
      <div class="cf-section-head">
        <span class="cf-overline">{{ section.settings.prod_overline | default: 'Most Loved' }}</span>
        <h2>{{ section.settings.prod_title | default: 'Bestselling Products' }}</h2>
        <p>{{ section.settings.prod_desc | default: 'Trusted by 5 million+ customers across India' }}</p>
      </div>
      <div class="cf-prod-grid">
        {% for block in section.blocks %}
          {% if block.type == 'product' %}
            {%- assign prd = block.settings.product -%}
            {%- assign prd_title = block.settings.custom_title | default: prd.title | default: 'Product Name' -%}
            {%- assign prd_url = prd.url | default: '#' -%}
            {%- assign prd_img = block.settings.custom_image | default: prd.featured_image -%}
            {%- assign prd_price = prd.price | money_without_trailing_zeros -%}
            {%- assign prd_compare = prd.compare_at_price | money_without_trailing_zeros -%}
            <a href="{{ prd_url }}" class="cf-prod-card">
              <div class="cf-prod-img">
                {%- if prd_img -%}
                  <img src="{{ prd_img | image_url: width: 500 }}" alt="{{ prd_title }}" loading="lazy">
                {%- else -%}
                  <div style="width:100%;height:100%;background:#faf7f2;"></div>
                {%- endif -%}
                {%- if block.settings.badge != blank -%}
                  <span class="cf-prod-badge {{ block.settings.badge_style }}">{{ block.settings.badge }}</span>
                {%- endif -%}
              </div>
              <div class="cf-prod-info">
                <div class="cf-prod-name">{{ prd_title }}</div>
                <div class="cf-prod-rating">
                  <span class="cf-prod-stars">★★★★★</span>
                  <span>{{ block.settings.review_count | default: '' }}</span>
                </div>
                <div class="cf-prod-price">
                  {%- if prd.price -%}
                    <span class="cf-current">{{ prd_price }}</span>
                    {%- if prd.compare_at_price > prd.price -%}
                      <span class="cf-original">{{ prd_compare }}</span>
                      {%- assign saving = prd.compare_at_price | minus: prd.price | times: 100 | divided_by: prd.compare_at_price -%}
                      <span class="cf-discount">{{ saving }}% OFF</span>
                    {%- endif -%}
                  {%- else -%}
                    <span class="cf-current">{{ block.settings.custom_price | default: '' }}</span>
                    {%- if block.settings.custom_compare != blank -%}
                      <span class="cf-original">{{ block.settings.custom_compare }}</span>
                      <span class="cf-discount">{{ block.settings.custom_discount | default: '' }}</span>
                    {%- endif -%}
                  {%- endif -%}
                </div>
                <button class="cf-prod-atc" onclick="event.preventDefault();">ADD TO CART</button>
              </div>
            </a>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </div>

  <!-- ── Shop by Ingredients ── -->
  <div class="cf-ingredients">
    <div class="cf-ingredients-inner">
      <div class="cf-section-head">
        <span class="cf-overline">{{ section.settings.ingr_overline | default: 'Powered By Science' }}</span>
        <h2>{{ section.settings.ingr_title | default: 'Shop by Ingredients' }}</h2>
        <p>{{ section.settings.ingr_desc | default: 'Clinically proven ingredients for visible results' }}</p>
      </div>
      <div class="cf-ingr-grid">
        {% for block in section.blocks %}
          {% if block.type == 'ingredient' %}
            <a href="{{ block.settings.link | default: '#' }}" class="cf-ingr-card">
              <div class="cf-ingr-icon">{{ block.settings.icon | default: '🧪' }}</div>
              <h4>{{ block.settings.title | default: 'Vitamin C' }}</h4>
              <p>{{ block.settings.desc | default: 'Brightening & Glow' }}</p>
            </a>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </div>

  <!-- ── Brand Story ── -->
  <div class="cf-story">
    <div class="cf-story-inner">
      <div>
        <span class="cf-story-overline">{{ section.settings.story_overline | default: 'Our Story' }}</span>
        <h2>{{ section.settings.story_title | default: 'Beauty Secrets From Around The World' }}</h2>
        <p>{{ section.settings.story_text | default: 'We travel the globe to discover the most powerful natural ingredients and bring them to you in beautifully crafted formulations. No harmful chemicals, no animal testing — just pure, effective skincare.' }}</p>
        <div class="cf-story-stats">
          <div class="cf-story-stat">
            <h3>{{ section.settings.stat1_number | default: '5M+' }}</h3>
            <span>{{ section.settings.stat1_label | default: 'Happy Customers' }}</span>
          </div>
          <div class="cf-story-stat">
            <h3>{{ section.settings.stat2_number | default: '200+' }}</h3>
            <span>{{ section.settings.stat2_label | default: 'Products' }}</span>
          </div>
          <div class="cf-story-stat">
            <h3>{{ section.settings.stat3_number | default: '50+' }}</h3>
            <span>{{ section.settings.stat3_label | default: 'Active Ingredients' }}</span>
          </div>
        </div>
      </div>
      <div class="cf-story-img">
        {% if section.settings.story_image %}
          <img src="{{ section.settings.story_image | image_url: width: 800 }}" alt="Brand story" loading="lazy">
        {% else %}
          <div style="width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,#3a3a3a,#555);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:64px;">🌍</div>
        {% endif %}
      </div>
    </div>
  </div>

  <!-- ── Testimonials ── -->
  <div class="cf-reviews">
    <div class="cf-reviews-inner">
      <div class="cf-section-head">
        <span class="cf-overline">{{ section.settings.rev_overline | default: 'Real Results' }}</span>
        <h2>{{ section.settings.rev_title | default: 'What Our Customers Say' }}</h2>
      </div>
      <div class="cf-rev-grid">
        {% for block in section.blocks %}
          {% if block.type == 'review' %}
            <div class="cf-rev-card">
              <div class="cf-rev-stars">★★★★★</div>
              <p class="cf-rev-text">"{{ block.settings.text | default: 'This product completely transformed my skin! I have been using it for 3 months and the results are incredible.' }}"</p>
              <div class="cf-rev-author">
                <div class="cf-rev-avatar">{{ block.settings.name | default: 'P' | slice: 0 }}</div>
                <div>
                  <div class="cf-rev-name">{{ block.settings.name | default: 'Priya S.' }}</div>
                  <div class="cf-rev-verified">✓ Verified Purchase</div>
                </div>
              </div>
            </div>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </div>

  <!-- ── Newsletter ── -->
  <div class="cf-newsletter">
    <div class="cf-newsletter-inner">
      <h2>{{ section.settings.nl_title | default: 'Join the Glow Club' }}</h2>
      <p>{{ section.settings.nl_desc | default: 'Get 15% OFF your first order + exclusive access to new launches, beauty tips, and member-only offers.' }}</p>
      <div class="cf-newsletter-form">
        <input type="email" class="cf-newsletter-input" placeholder="Enter your email address">
        <button class="cf-newsletter-btn">{{ section.settings.nl_btn | default: 'Subscribe' }}</button>
      </div>
    </div>
  </div>

  <!-- ── Footer ── -->
  <div class="cf-footer">
    <div class="cf-footer-inner">
      <div class="cf-footer-grid">
        <div class="cf-footer-brand">
          <h3>{{ section.settings.brand_name | default: shop.name }}</h3>
          <p>{{ section.settings.footer_about | default: 'Premium beauty brand bringing the best of global beauty secrets to your doorstep. Cruelty-free, vegan, and FDA approved.' }}</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/collections/all">All Products</a></li>
            <li><a href="/collections/bestsellers">Bestsellers</a></li>
            <li><a href="/pages/about">About Us</a></li>
            <li><a href="/pages/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="/pages/shipping">Shipping Info</a></li>
            <li><a href="/pages/returns">Returns & Exchange</a></li>
            <li><a href="/pages/faq">FAQs</a></li>
            <li><a href="/pages/track-order">Track Order</a></li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">YouTube</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div class="cf-footer-bottom">
        <span>© {{ 'now' | date: '%Y' }} {{ section.settings.brand_name | default: shop.name }}. All rights reserved.</span>
        <span>Powered by ConvertFlow</span>
      </div>
    </div>
  </div>
</div>


{% schema %}
{
  "name": "CF: Pilgrim Landing Page",
  "tag": "section",
  "class": "convertflow-pilgrim",
  "settings": [
    { "type": "header", "content": "Announcement Bar" },
    { "type": "text", "id": "announce_text_content", "label": "Announcement Text", "default": "FLAT 20% OFF on your first order" },
    { "type": "text", "id": "announce_cta", "label": "CTA Text", "default": "Shop Now" },
    { "type": "url", "id": "announce_link", "label": "CTA Link" },
    { "type": "color", "id": "announce_bg", "label": "Bar Background Color", "default": "#2D2D2D" },

    { "type": "header", "content": "Hero Banner" },
    { "type": "text", "id": "hero_badge", "label": "Badge Text", "default": "NEW COLLECTION" },
    { "type": "text", "id": "hero_title_1", "label": "Title Line 1", "default": "Discover Your" },
    { "type": "text", "id": "hero_title_accent", "label": "Title Accent (colored)", "default": "Natural Glow" },
    { "type": "textarea", "id": "hero_subtitle", "label": "Subtitle", "default": "Premium skincare powered by ancient beauty secrets from around the world. Vegan, cruelty-free, and FDA approved." },
    { "type": "text", "id": "hero_cta_text", "label": "Button Text", "default": "Explore Collection" },
    { "type": "url", "id": "hero_cta_link", "label": "Button Link" },
    { "type": "image_picker", "id": "hero_image", "label": "Hero Product Image" },
    { "type": "color", "id": "hero_accent", "label": "Accent / Highlight Color", "default": "#C17F5E" },

    { "type": "header", "content": "Categories Section" },
    { "type": "text", "id": "cat_overline", "label": "Section Label", "default": "Explore" },
    { "type": "text", "id": "cat_title", "label": "Section Title", "default": "Shop by Category" },
    { "type": "text", "id": "cat_desc", "label": "Section Description", "default": "Find the perfect products for your beauty routine" },

    { "type": "header", "content": "Products Section" },
    { "type": "text", "id": "prod_overline", "label": "Section Label", "default": "Most Loved" },
    { "type": "text", "id": "prod_title", "label": "Section Title", "default": "Bestselling Products" },
    { "type": "text", "id": "prod_desc", "label": "Section Description", "default": "Trusted by 5 million+ customers across India" },

    { "type": "header", "content": "Ingredients Section" },
    { "type": "text", "id": "ingr_overline", "label": "Section Label", "default": "Powered By Science" },
    { "type": "text", "id": "ingr_title", "label": "Section Title", "default": "Shop by Ingredients" },
    { "type": "text", "id": "ingr_desc", "label": "Section Description", "default": "Clinically proven ingredients for visible results" },

    { "type": "header", "content": "Brand Story" },
    { "type": "text", "id": "story_overline", "label": "Section Label", "default": "Our Story" },
    { "type": "text", "id": "story_title", "label": "Story Title", "default": "Beauty Secrets From Around The World" },
    { "type": "textarea", "id": "story_text", "label": "Story Body Text", "default": "We travel the globe to discover the most powerful natural ingredients and bring them to you in beautifully crafted formulations." },
    { "type": "image_picker", "id": "story_image", "label": "Story Image" },
    { "type": "text", "id": "stat1_number", "label": "Stat 1 Number", "default": "5M+" },
    { "type": "text", "id": "stat1_label", "label": "Stat 1 Label", "default": "Happy Customers" },
    { "type": "text", "id": "stat2_number", "label": "Stat 2 Number", "default": "200+" },
    { "type": "text", "id": "stat2_label", "label": "Stat 2 Label", "default": "Products" },
    { "type": "text", "id": "stat3_number", "label": "Stat 3 Number", "default": "50+" },
    { "type": "text", "id": "stat3_label", "label": "Stat 3 Label", "default": "Active Ingredients" },

    { "type": "header", "content": "Reviews Section" },
    { "type": "text", "id": "rev_overline", "label": "Section Label", "default": "Real Results" },
    { "type": "text", "id": "rev_title", "label": "Section Title", "default": "What Our Customers Say" },

    { "type": "header", "content": "Newsletter" },
    { "type": "text", "id": "nl_title", "label": "Newsletter Title", "default": "Join the Glow Club" },
    { "type": "text", "id": "nl_desc", "label": "Newsletter Description", "default": "Get 15% OFF your first order + exclusive access to new launches." },
    { "type": "text", "id": "nl_btn", "label": "Subscribe Button Text", "default": "Subscribe" },

    { "type": "header", "content": "Design" },
    { "type": "color", "id": "accent_color", "label": "Accent Color", "default": "#C17F5E" },
    { "type": "color", "id": "cta_bg", "label": "Button Background", "default": "#1a1a1a" },
    { "type": "color", "id": "cta_text", "label": "Button Text Color", "default": "#ffffff" },
    { "type": "text", "id": "brand_name", "label": "Brand Name (Footer)" }
  ],
  "blocks": [
    {
      "type": "category",
      "name": "Category Card",
      "limit": 8,
      "settings": [
        { "type": "header", "content": "Select a Collection" },
        { "type": "collection", "id": "collection", "label": "Collection" },
        { "type": "header", "content": "Overrides (optional)" },
        { "type": "text", "id": "custom_title", "label": "Custom Title", "info": "Leave blank to use the collection name" },
        { "type": "text", "id": "custom_count", "label": "Custom Product Count", "info": "e.g. 45+. Leave blank to show auto count" },
        { "type": "image_picker", "id": "custom_image", "label": "Custom Image", "info": "Overrides collection image" },
        { "type": "url", "id": "custom_link", "label": "Custom Link", "info": "Overrides collection URL" }
      ]
    },
    {
      "type": "product",
      "name": "Product Card",
      "limit": 8,
      "settings": [
        { "type": "header", "content": "Select a Product" },
        { "type": "product", "id": "product", "label": "Product" },
        { "type": "header", "content": "Badge" },
        { "type": "text", "id": "badge", "label": "Badge Text", "default": "BESTSELLER", "info": "e.g. BESTSELLER, TRENDING, HOT, NEW" },
        {
          "type": "select",
          "id": "badge_style",
          "label": "Badge Color",
          "options": [
            { "value": "best", "label": "Orange (Bestseller)" },
            { "value": "new", "label": "Green (New/Trending)" },
            { "value": "hot", "label": "Red (Hot)" }
          ],
          "default": "best"
        },
        { "type": "header", "content": "Overrides (optional)" },
        { "type": "text", "id": "custom_title", "label": "Custom Product Title", "info": "Leave blank to use product title" },
        { "type": "image_picker", "id": "custom_image", "label": "Custom Product Image", "info": "Overrides product featured image" },
        { "type": "text", "id": "review_count", "label": "Review Count", "default": "2,847", "info": "e.g. 4,523" },
        { "type": "text", "id": "custom_price", "label": "Custom Price", "info": "Only if product not selected" },
        { "type": "text", "id": "custom_compare", "label": "Custom Compare Price" },
        { "type": "text", "id": "custom_discount", "label": "Custom Discount Label", "default": "20% OFF" }
      ]
    },
    {
      "type": "ingredient",
      "name": "Ingredient Card",
      "limit": 12,
      "settings": [
        { "type": "text", "id": "title", "label": "Ingredient Name", "default": "Vitamin C" },
        { "type": "text", "id": "desc", "label": "Benefit", "default": "Brightening & Glow" },
        { "type": "url", "id": "link", "label": "Link to Collection" },
        { "type": "image_picker", "id": "icon_image", "label": "Icon Image (optional)", "info": "Small square image for the ingredient icon" }
      ]
    },
    {
      "type": "review",
      "name": "Customer Review",
      "limit": 6,
      "settings": [
        { "type": "text", "id": "name", "label": "Customer Name", "default": "Priya S." },
        { "type": "text", "id": "location", "label": "Location / Product Used", "default": "Mumbai" },
        { "type": "textarea", "id": "text", "label": "Review Text", "default": "This product completely transformed my skin! The results are incredible." },
        {
          "type": "range",
          "id": "rating",
          "min": 1,
          "max": 5,
          "step": 1,
          "label": "Star Rating",
          "default": 5
        }
      ]
    },
    {
      "type": "trust_item",
      "name": "Trust Badge",
      "limit": 6,
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "Free Shipping" },
        { "type": "text", "id": "sublabel", "label": "Sub-label", "default": "On orders above Rs.499" },
        { "type": "image_picker", "id": "icon_image", "label": "Icon Image" }
      ]
    }
  ],
  "presets": [
    {
      "name": "CF: Pilgrim Landing Page",
      "blocks": [
        { "type": "category" },
        { "type": "category" },
        { "type": "category" },
        { "type": "category" },
        { "type": "product", "settings": { "badge": "BESTSELLER", "badge_style": "best", "review_count": "4,523" } },
        { "type": "product", "settings": { "badge": "TRENDING", "badge_style": "new", "review_count": "3,182" } },
        { "type": "product", "settings": { "badge": "BESTSELLER", "badge_style": "best", "review_count": "5,847" } },
        { "type": "product", "settings": { "badge": "HOT", "badge_style": "hot", "review_count": "2,156" } },
        { "type": "ingredient", "settings": { "title": "Vitamin C", "desc": "Brightening & Glow" } },
        { "type": "ingredient", "settings": { "title": "Hyaluronic Acid", "desc": "Deep Hydration" } },
        { "type": "ingredient", "settings": { "title": "Niacinamide", "desc": "Acne & Oil Control" } },
        { "type": "ingredient", "settings": { "title": "Retinol", "desc": "Anti-Ageing" } },
        { "type": "ingredient", "settings": { "title": "Salicylic Acid", "desc": "Pore Cleansing" } },
        { "type": "ingredient", "settings": { "title": "Ceramides", "desc": "Skin Barrier" } },
        { "type": "review", "settings": { "name": "Priya S.", "location": "Mumbai", "text": "The Vitamin C serum gave me visible results in just 2 weeks. My skin looks so much brighter!", "rating": 5 } },
        { "type": "review", "settings": { "name": "Ananya K.", "location": "Delhi", "text": "Been using the Rice Water Moisturizer for a month. My dry patches are completely gone!", "rating": 5 } },
        { "type": "review", "settings": { "name": "Meera R.", "location": "Bangalore", "text": "The Hair Growth Serum actually works! Noticed reduced hair fall within 3 weeks.", "rating": 5 } }
      ]
    }
  ]
}
{% endschema %}
`,
  "cf-pilgrim-product": `{% comment %}
  ConvertFlow — Pilgrim-Style Premium Product Page
  Self-contained, injects into templates/product.json
{% endcomment %}

{% style %}
  .cf-pdp * { margin: 0; padding: 0; box-sizing: border-box; }
  .cf-pdp {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Breadcrumb ── */
  .cf-pdp-breadcrumb {
    background: #faf7f2;
    padding: 12px 40px;
    font-size: 13px;
    color: #888;
    border-bottom: 1px solid #f0ebe5;
  }
  .cf-pdp-breadcrumb a { color: #888; text-decoration: none; }
  .cf-pdp-breadcrumb a:hover { color: #C17F5E; }
  .cf-pdp-breadcrumb span { margin: 0 8px; }

  /* ── Main Product Layout ── */
  .cf-pdp-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 48px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }

  /* ── Product Gallery ── */
  .cf-pdp-gallery {}
  .cf-pdp-main-img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 20px;
    overflow: hidden;
    background: #faf7f2;
    margin-bottom: 16px;
    position: relative;
  }
  .cf-pdp-main-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .cf-pdp-main-img:hover img { transform: scale(1.03); }
  .cf-pdp-badges {
    position: absolute;
    top: 16px;
    left: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cf-pdp-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fff;
  }
  .cf-pdp-badge.bestseller { background: #E67E22; }
  .cf-pdp-badge.sale { background: #E74C3C; }
  .cf-pdp-badge.new { background: #27ae60; }
  .cf-pdp-thumbs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .cf-pdp-thumb {
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    background: #faf7f2;
    transition: border-color 0.2s;
  }
  .cf-pdp-thumb.active { border-color: #C17F5E; }
  .cf-pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* ── Product Info ── */
  .cf-pdp-info {}
  .cf-pdp-brand {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #C17F5E;
    margin-bottom: 10px;
    display: block;
  }
  .cf-pdp-title {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 16px;
    letter-spacing: -0.3px;
  }

  /* Rating Row */
  .cf-pdp-rating-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0ebe5;
  }
  .cf-pdp-stars { display: flex; gap: 2px; }
  .cf-pdp-star { color: #F5A623; }
  .cf-pdp-rating-num { font-size: 14px; font-weight: 700; }
  .cf-pdp-rating-count { font-size: 13px; color: #888; }
  .cf-pdp-reviews-link { font-size: 13px; color: #C17F5E; text-decoration: underline; cursor: pointer; }

  /* Price */
  .cf-pdp-price-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .cf-pdp-price-current {
    font-size: 36px;
    font-weight: 800;
    color: #1a1a1a;
  }
  .cf-pdp-price-original {
    font-size: 20px;
    color: #aaa;
    text-decoration: line-through;
  }
  .cf-pdp-price-save {
    background: #FFF0E5;
    color: #C17F5E;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
  }

  /* Highlights */
  .cf-pdp-highlights {
    background: #faf7f2;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cf-pdp-highlight {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
  }
  .cf-pdp-highlight-icon {
    color: #C17F5E;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* Quantity */
  .cf-pdp-qty-label { font-size: 13px; font-weight: 700; margin-bottom: 10px; color: #555; }
  .cf-pdp-qty-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .cf-pdp-qty {
    display: flex;
    align-items: center;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
  }
  .cf-pdp-qty button {
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .cf-pdp-qty button:hover { background: #faf7f2; }
  .cf-pdp-qty span {
    width: 44px;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
    border-left: 1.5px solid #e5e7eb;
    border-right: 1.5px solid #e5e7eb;
    line-height: 40px;
  }

  /* CTA Buttons */
  .cf-pdp-atc {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 18px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }
  .cf-pdp-atc:hover {
    background: #333;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  .cf-pdp-buy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 18px;
    background: #C17F5E;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
  }
  .cf-pdp-buy:hover { background: #A0634B; }

  /* Trust row */
  .cf-pdp-trust {
    display: flex;
    gap: 20px;
    padding: 16px 0;
    border-top: 1px solid #f0ebe5;
    border-bottom: 1px solid #f0ebe5;
    margin-bottom: 24px;
  }
  .cf-pdp-trust-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #555;
    font-weight: 600;
  }
  .cf-pdp-trust-icon { color: #C17F5E; flex-shrink: 0; }

  /* Accordion */
  .cf-pdp-accordion { margin-top: 8px; }
  .cf-pdp-acc-item {
    border-bottom: 1px solid #f0ebe5;
  }
  .cf-pdp-acc-trigger {
    width: 100%;
    background: none;
    border: none;
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    color: #1a1a1a;
    text-align: left;
  }
  .cf-pdp-acc-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
    color: #888;
  }
  .cf-pdp-acc-item.open .cf-pdp-acc-icon { transform: rotate(180deg); }
  .cf-pdp-acc-content {
    display: none;
    padding: 0 0 16px;
    font-size: 14px;
    line-height: 1.8;
    color: #555;
  }
  .cf-pdp-acc-item.open .cf-pdp-acc-content { display: block; }

  /* ── How to Use ── */
  .cf-pdp-how {
    background: #faf7f2;
    padding: 60px 40px;
    margin-top: 0;
  }
  .cf-pdp-how-inner { max-width: 1280px; margin: 0 auto; }
  .cf-pdp-how h2 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 32px;
    text-align: center;
  }
  .cf-pdp-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .cf-pdp-step {
    text-align: center;
    padding: 28px 20px;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #f0ebe5;
  }
  .cf-pdp-step-num {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #C17F5E;
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }
  .cf-pdp-step h4 { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
  .cf-pdp-step p { font-size: 13px; color: #777; line-height: 1.6; }

  /* ── Ingredients ── */
  .cf-pdp-ingr {
    padding: 60px 40px;
    max-width: 1280px;
    margin: 0 auto;
  }
  .cf-pdp-ingr h2 { font-size: 28px; font-weight: 800; margin-bottom: 28px; }
  .cf-pdp-ingr-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .cf-pdp-ingr-item {
    padding: 20px;
    background: #faf7f2;
    border-radius: 14px;
    border: 1px solid #f0ebe5;
  }
  .cf-pdp-ingr-item h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: #C17F5E; }
  .cf-pdp-ingr-item p { font-size: 12px; color: #666; line-height: 1.5; }

  /* ── Reviews ── */
  .cf-pdp-reviews {
    padding: 60px 40px;
    background: #fff;
  }
  .cf-pdp-reviews-inner { max-width: 1280px; margin: 0 auto; }
  .cf-pdp-rev-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
  .cf-pdp-rev-header h2 { font-size: 28px; font-weight: 800; }
  .cf-pdp-rev-avg {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cf-pdp-rev-avg-num { font-size: 48px; font-weight: 800; }
  .cf-pdp-rev-avg-stars { display: flex; flex-direction: column; gap: 4px; }
  .cf-pdp-rev-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .cf-pdp-rev-card {
    background: #faf7f2;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #f0ebe5;
  }
  .cf-pdp-rev-card-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .cf-pdp-rev-stars { display: flex; gap: 2px; margin-bottom: 10px; }
  .cf-pdp-rev-text { font-size: 13px; color: #444; line-height: 1.7; margin-bottom: 14px; font-style: italic; }
  .cf-pdp-rev-author { font-size: 12px; font-weight: 700; }
  .cf-pdp-rev-date { font-size: 11px; color: #999; }
  .cf-pdp-verified { font-size: 11px; color: #27ae60; display: flex; align-items: center; gap: 4px; }

  /* Mobile */
  @media (max-width: 768px) {
    .cf-pdp-main { grid-template-columns: 1fr; padding: 24px 16px; gap: 32px; }
    .cf-pdp-breadcrumb { padding: 12px 16px; }
    .cf-pdp-title { font-size: 24px; }
    .cf-pdp-price-current { font-size: 28px; }
    .cf-pdp-steps { grid-template-columns: 1fr; gap: 16px; }
    .cf-pdp-ingr-list { grid-template-columns: 1fr 1fr; }
    .cf-pdp-rev-grid { grid-template-columns: 1fr; }
    .cf-pdp-how, .cf-pdp-ingr, .cf-pdp-reviews { padding: 40px 16px; }
    .cf-pdp-trust { flex-wrap: wrap; gap: 12px; }
  }
{% endstyle %}

<div class="cf-pdp">
  {%- assign current_product = product -%}

  <!-- Breadcrumb -->
  <div class="cf-pdp-breadcrumb">
    <a href="/">Home</a>
    <span>›</span>
    {%- if current_product.collections.first -%}
      <a href="{{ current_product.collections.first.url }}">{{ current_product.collections.first.title }}</a>
      <span>›</span>
    {%- endif -%}
    <span style="color:#1a1a1a;font-weight:600;">{{ current_product.title }}</span>
  </div>

  <!-- Main Product Section -->
  <div class="cf-pdp-main">

    <!-- Gallery -->
    <div class="cf-pdp-gallery">
      <div class="cf-pdp-main-img" id="cf-main-img">
        {%- if current_product.featured_image -%}
          <img src="{{ current_product.featured_image | image_url: width: 900 }}" alt="{{ current_product.title }}" id="cf-main-img-el" loading="eager">
        {%- else -%}
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#faf7f2;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d4a574" stroke-width="1"><path d="M9 2h6l1 7H8l1-7Z"/><path d="M8 9v10a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V9"/></svg>
          </div>
        {%- endif -%}
        <div class="cf-pdp-badges">
          {%- if current_product.compare_at_price > current_product.price -%}
            {%- assign save_pct = current_product.compare_at_price | minus: current_product.price | times: 100 | divided_by: current_product.compare_at_price -%}
            <span class="cf-pdp-badge sale">{{ save_pct }}% OFF</span>
          {%- endif -%}
          {%- if current_product.tags contains 'bestseller' -%}
            <span class="cf-pdp-badge bestseller">BESTSELLER</span>
          {%- endif -%}
          {%- if current_product.tags contains 'new' -%}
            <span class="cf-pdp-badge new">NEW</span>
          {%- endif -%}
        </div>
      </div>
      {%- if current_product.images.size > 1 -%}
        <div class="cf-pdp-thumbs">
          {%- for img in current_product.images limit: 4 -%}
            <div class="cf-pdp-thumb {% if forloop.first %}active{% endif %}" onclick="cfSwitchImg('{{ img | image_url: width: 900 }}', this)">
              <img src="{{ img | image_url: width: 200 }}" alt="{{ current_product.title }}" loading="lazy">
            </div>
          {%- endfor -%}
        </div>
      {%- endif -%}
    </div>

    <!-- Info -->
    <div class="cf-pdp-info">
      <span class="cf-pdp-brand">{{ section.settings.brand_label | default: shop.name }}</span>
      <h1 class="cf-pdp-title">{{ current_product.title }}</h1>

      <!-- Rating -->
      <div class="cf-pdp-rating-row">
        <div class="cf-pdp-stars">
          {%- for i in (1..5) -%}
            <svg class="cf-pdp-star" width="16" height="16" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {%- endfor -%}
        </div>
        <span class="cf-pdp-rating-num">{{ section.settings.avg_rating | default: '4.8' }}</span>
        <span class="cf-pdp-rating-count">({{ section.settings.review_total | default: '2,847' }} Reviews)</span>
        <a class="cf-pdp-reviews-link" href="#cf-reviews">Read reviews</a>
      </div>

      <!-- Price -->
      <div class="cf-pdp-price-row">
        <span class="cf-pdp-price-current">{{ current_product.price | money }}</span>
        {%- if current_product.compare_at_price > current_product.price -%}
          <span class="cf-pdp-price-original">{{ current_product.compare_at_price | money }}</span>
          <span class="cf-pdp-price-save">Save {{ save_pct | default: 0 }}%</span>
        {%- endif -%}
      </div>

      <!-- Highlights -->
      <div class="cf-pdp-highlights">
        {%- for block in section.blocks -%}
          {%- if block.type == 'highlight' -%}
            <div class="cf-pdp-highlight">
              <svg class="cf-pdp-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ block.settings.text }}</span>
            </div>
          {%- endif -%}
        {%- endfor -%}
        {%- if section.blocks.size == 0 -%}
          <div class="cf-pdp-highlight"><svg class="cf-pdp-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Dermatologist Tested &amp; Approved</span></div>
          <div class="cf-pdp-highlight"><svg class="cf-pdp-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>No Parabens | No Sulphates | Cruelty Free</span></div>
          <div class="cf-pdp-highlight"><svg class="cf-pdp-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Results visible in 2–4 weeks</span></div>
        {%- endif -%}
      </div>

      <!-- Add to Cart Form -->
      {%- form 'product', current_product, id: 'cf-product-form' -%}
        <input type="hidden" name="id" value="{{ current_product.selected_or_first_available_variant.id }}">

        <p class="cf-pdp-qty-label">Quantity</p>
        <div class="cf-pdp-qty-row">
          <div class="cf-pdp-qty">
            <button type="button" onclick="cfQty(-1)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span id="cf-qty-val">1</span>
            <button type="button" onclick="cfQty(1)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <input type="number" name="quantity" id="cf-qty-input" value="1" min="1" style="display:none">
          {%- if current_product.available -%}
            <span style="font-size:13px;color:#27ae60;font-weight:600;display:flex;align-items:center;gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#27ae60"><circle cx="12" cy="12" r="10"/></svg> In Stock
            </span>
          {%- else -%}
            <span style="font-size:13px;color:#E74C3C;font-weight:600;">Out of Stock</span>
          {%- endif -%}
        </div>

        <button type="submit" name="add" class="cf-pdp-atc" {% unless current_product.available %}disabled{% endunless %}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {% if current_product.available %}Add to Cart{% else %}Sold Out{% endif %}
        </button>
      {%- endform -%}

      <button class="cf-pdp-buy" onclick="document.getElementById('cf-product-form').submit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Buy It Now
      </button>

      <!-- Trust -->
      <div class="cf-pdp-trust">
        <div class="cf-pdp-trust-item">
          <svg class="cf-pdp-trust-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Free Shipping
        </div>
        <div class="cf-pdp-trust-item">
          <svg class="cf-pdp-trust-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          100% Authentic
        </div>
        <div class="cf-pdp-trust-item">
          <svg class="cf-pdp-trust-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Easy Returns
        </div>
      </div>

      <!-- Accordion -->
      <div class="cf-pdp-accordion">
        <div class="cf-pdp-acc-item open">
          <button class="cf-pdp-acc-trigger" onclick="cfToggleAcc(this)">
            Description
            <svg class="cf-pdp-acc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="cf-pdp-acc-content">{{ current_product.description }}</div>
        </div>
        <div class="cf-pdp-acc-item">
          <button class="cf-pdp-acc-trigger" onclick="cfToggleAcc(this)">
            How to Use
            <svg class="cf-pdp-acc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="cf-pdp-acc-content">{{ section.settings.how_to_use | default: 'Apply a few drops to clean, dry skin. Gently massage in upward circular motions until fully absorbed. Use daily for best results, morning and/or night.' }}</div>
        </div>
        <div class="cf-pdp-acc-item">
          <button class="cf-pdp-acc-trigger" onclick="cfToggleAcc(this)">
            Ingredients
            <svg class="cf-pdp-acc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="cf-pdp-acc-content">{{ section.settings.ingredients_text | default: 'Water, Niacinamide, Ascorbic Acid (Vitamin C), Hyaluronic Acid, Glycerin, Retinol, Ceramides, Centella Asiatica Extract.' }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- How To Use Steps -->
  <div class="cf-pdp-how">
    <div class="cf-pdp-how-inner">
      <h2>{{ section.settings.steps_title | default: 'How to Use' }}</h2>
      <div class="cf-pdp-steps">
        {%- for block in section.blocks -%}
          {%- if block.type == 'step' -%}
            <div class="cf-pdp-step">
              <div class="cf-pdp-step-num">{{ forloop.index }}</div>
              <h4>{{ block.settings.title }}</h4>
              <p>{{ block.settings.desc }}</p>
            </div>
          {%- endif -%}
        {%- endfor -%}
        {%- if section.blocks == empty -%}
          <div class="cf-pdp-step"><div class="cf-pdp-step-num">1</div><h4>Cleanse</h4><p>Start with a clean, dry face. Pat dry with a soft towel.</p></div>
          <div class="cf-pdp-step"><div class="cf-pdp-step-num">2</div><h4>Apply</h4><p>Take 2–3 drops and apply evenly across face and neck.</p></div>
          <div class="cf-pdp-step"><div class="cf-pdp-step-num">3</div><h4>Absorb</h4><p>Gently massage in circular motions and let it absorb fully.</p></div>
        {%- endif -%}
      </div>
    </div>
  </div>

  <!-- Reviews -->
  <div class="cf-pdp-reviews" id="cf-reviews">
    <div class="cf-pdp-reviews-inner">
      <div class="cf-pdp-rev-header">
        <h2>Customer Reviews</h2>
        <div class="cf-pdp-rev-avg">
          <span class="cf-pdp-rev-avg-num">{{ section.settings.avg_rating | default: '4.8' }}</span>
          <div class="cf-pdp-rev-avg-stars">
            <div style="display:flex;gap:2px;">
              {%- for i in (1..5) -%}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {%- endfor -%}
            </div>
            <span style="font-size:12px;color:#888;">Based on {{ section.settings.review_total | default: '2,847' }} reviews</span>
          </div>
        </div>
      </div>
      <div class="cf-pdp-rev-grid">
        {%- for block in section.blocks -%}
          {%- if block.type == 'review' -%}
            <div class="cf-pdp-rev-card">
              <div class="cf-pdp-rev-stars">
                {%- for i in (1..block.settings.rating) -%}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {%- endfor -%}
              </div>
              <p class="cf-pdp-rev-text">"{{ block.settings.text }}"</p>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="cf-pdp-rev-author">{{ block.settings.name }}</span>
                <span class="cf-pdp-verified">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Verified
                </span>
              </div>
            </div>
          {%- endif -%}
        {%- endfor -%}
      </div>
    </div>
  </div>
</div>

<script>
  // Image switcher
  function cfSwitchImg(src, thumb) {
    document.getElementById('cf-main-img-el').src = src;
    document.querySelectorAll('.cf-pdp-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  }

  // Quantity stepper
  var cfQtyVal = 1;
  function cfQty(delta) {
    cfQtyVal = Math.max(1, cfQtyVal + delta);
    document.getElementById('cf-qty-val').textContent = cfQtyVal;
    document.getElementById('cf-qty-input').value = cfQtyVal;
  }

  // Accordion
  function cfToggleAcc(btn) {
    var item = btn.parentElement;
    item.classList.toggle('open');
  }
</script>

{% schema %}
{
  "name": "CF: Pilgrim Product Page",
  "tag": "section",
  "class": "convertflow-product",
  "settings": [
    { "type": "header", "content": "Product Info" },
    { "type": "text", "id": "brand_label", "label": "Brand Label", "default": "Your Brand" },
    { "type": "text", "id": "avg_rating", "label": "Average Rating", "default": "4.8" },
    { "type": "text", "id": "review_total", "label": "Total Reviews", "default": "2,847" },
    { "type": "header", "content": "Content" },
    { "type": "textarea", "id": "how_to_use", "label": "How to Use Text", "default": "Apply a few drops to clean, dry skin. Gently massage in upward circular motions until fully absorbed." },
    { "type": "textarea", "id": "ingredients_text", "label": "Ingredients List", "default": "Water, Niacinamide, Ascorbic Acid (Vitamin C), Hyaluronic Acid, Glycerin, Retinol, Ceramides." },
    { "type": "text", "id": "steps_title", "label": "How-to-Use Section Title", "default": "How to Use" }
  ],
  "blocks": [
    {
      "type": "highlight",
      "name": "Product Highlight",
      "limit": 5,
      "settings": [
        { "type": "text", "id": "text", "label": "Highlight Text", "default": "Dermatologist Tested & Approved" }
      ]
    },
    {
      "type": "step",
      "name": "Usage Step",
      "limit": 4,
      "settings": [
        { "type": "text", "id": "title", "label": "Step Title", "default": "Cleanse" },
        { "type": "text", "id": "desc", "label": "Step Description", "default": "Start with a clean, dry face." }
      ]
    },
    {
      "type": "review",
      "name": "Customer Review",
      "limit": 6,
      "settings": [
        { "type": "text", "id": "name", "label": "Customer Name", "default": "Priya S." },
        { "type": "textarea", "id": "text", "label": "Review Text", "default": "Amazing product! Visible results in just 2 weeks." },
        { "type": "range", "id": "rating", "min": 1, "max": 5, "step": 1, "label": "Rating", "default": 5 }
      ]
    }
  ],
  "presets": [
    {
      "name": "CF: Pilgrim Product Page",
      "blocks": [
        { "type": "highlight", "settings": { "text": "Dermatologist Tested & Approved" } },
        { "type": "highlight", "settings": { "text": "No Parabens | No Sulphates | Cruelty Free" } },
        { "type": "highlight", "settings": { "text": "Results visible in 2–4 weeks" } },
        { "type": "step", "settings": { "title": "Cleanse", "desc": "Start with a clean, dry face. Pat dry with a soft towel." } },
        { "type": "step", "settings": { "title": "Apply", "desc": "Take 2-3 drops and apply evenly across face and neck." } },
        { "type": "step", "settings": { "title": "Absorb", "desc": "Gently massage and let it fully absorb. Follow with moisturizer." } },
        { "type": "review", "settings": { "name": "Priya S.", "text": "The Vitamin C serum gave me visible results in just 2 weeks. My skin looks so much brighter!", "rating": 5 } },
        { "type": "review", "settings": { "name": "Ananya K.", "text": "Been using this for a month and my skin texture has improved so much. Love it!", "rating": 5 } },
        { "type": "review", "settings": { "name": "Rahul M.", "text": "Great product, really effective. Will definitely repurchase.", "rating": 5 } }
      ]
    }
  ]
}
{% endschema %}
`,
  "cf-tanishq-cart": `{% comment %}
  ConvertFlow — Tanishq Cart Page (Redesigned)
  Authentic tanishq.co.in cart/shopping bag experience
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cfj-cart * { margin: 0; padding: 0; box-sizing: border-box; }
  .cfj-cart {
    font-family: 'DM Sans', sans-serif; color: #404040;
    background: #FFFCF5; line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  .cfj-cart a { text-decoration: none; color: inherit; }

  /* ── Header ── */
  .cfj-cart-header {
    background: #2C1810; padding: 36px 40px; text-align: center;
  }
  .cfj-cart-header h1 {
    font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 36px);
    font-weight: 700; color: #FFFCF5;
  }
  .cfj-cart-header p { font-size: 14px; color: rgba(255,252,245,0.5); margin-top: 6px; }

  /* ── Layout ── */
  .cfj-cart-layout {
    max-width: 1320px; margin: 0 auto; padding: 40px;
    display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start;
  }

  /* ── Cart Items ── */
  .cfj-cart-items {}
  .cfj-cart-item {
    display: grid; grid-template-columns: 100px 1fr auto; gap: 20px;
    padding: 24px 0; border-bottom: 1px solid rgba(44,24,16,0.06);
    align-items: start;
  }
  .cfj-cart-item:first-child { padding-top: 0; }
  .cfj-cart-item-img {
    width: 100px; height: 100px; background: #FAF5ED;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .cfj-cart-item-img img { max-width: 85%; max-height: 85%; object-fit: contain; }
  .cfj-cart-item-details {}
  .cfj-cart-item-title {
    font-size: 15px; font-weight: 600; color: #2C1810; margin-bottom: 4px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .cfj-cart-item-meta { font-size: 12px; color: #8B7355; margin-bottom: 10px; }
  .cfj-cart-item-meta span { margin-right: 12px; }
  .cfj-cart-qty {
    display: inline-flex; align-items: center; border: 1px solid rgba(44,24,16,0.1);
  }
  .cfj-cart-qty button {
    width: 32px; height: 32px; background: #fff; border: none;
    font-size: 16px; cursor: pointer; color: #2C1810; transition: background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .cfj-cart-qty button:hover { background: #FAF5ED; }
  .cfj-cart-qty span {
    width: 36px; height: 32px; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: #2C1810;
    border-left: 1px solid rgba(44,24,16,0.1); border-right: 1px solid rgba(44,24,16,0.1);
  }
  .cfj-cart-item-actions { display: flex; gap: 12px; margin-top: 10px; }
  .cfj-cart-item-action {
    font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s;
    display: flex; align-items: center; gap: 4px; background: none; border: none;
    font-family: 'DM Sans'; color: #8B7355;
  }
  .cfj-cart-item-action:hover { color: #D4AF37; }
  .cfj-cart-item-action svg { width: 14px; height: 14px; }
  .cfj-cart-item-price-col { text-align: right; }
  .cfj-cart-item-price { font-size: 17px; font-weight: 700; color: #2C1810; }
  .cfj-cart-item-compare { font-size: 12px; color: #bbb; text-decoration: line-through; display: block; }

  .cfj-cart-empty {
    text-align: center; padding: 60px 20px;
  }
  .cfj-cart-empty svg { width: 60px; height: 60px; color: #ddd; margin-bottom: 20px; }
  .cfj-cart-empty h3 { font-family: 'Playfair Display', serif; font-size: 24px; color: #2C1810; margin-bottom: 10px; }
  .cfj-cart-empty p { font-size: 14px; color: #8B7355; margin-bottom: 24px; }
  .cfj-cart-empty a {
    display: inline-block; padding: 14px 36px; background: #D4AF37;
    color: #2C1810; font-size: 12px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s;
  }
  .cfj-cart-empty a:hover { background: #F5D060; }

  /* ── Order Summary ── */
  .cfj-cart-summary {
    background: #fff; border: 1px solid rgba(44,24,16,0.06);
    padding: 28px; position: sticky; top: 80px;
  }
  .cfj-cart-summary h3 {
    font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700;
    color: #2C1810; margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 1px solid rgba(44,24,16,0.06);
  }
  .cfj-cart-summary-row {
    display: flex; justify-content: space-between; font-size: 14px;
    color: #666; margin-bottom: 12px;
  }
  .cfj-cart-summary-row span:last-child { font-weight: 600; color: #2C1810; }
  .cfj-cart-summary-row.discount span:last-child { color: #16a34a; }
  .cfj-cart-summary-total {
    display: flex; justify-content: space-between;
    font-size: 18px; font-weight: 700; color: #2C1810;
    padding-top: 16px; margin-top: 16px;
    border-top: 2px solid #2C1810;
  }

  /* Promo */
  .cfj-cart-promo {
    margin: 20px 0; display: flex; border: 1px solid rgba(44,24,16,0.1);
  }
  .cfj-cart-promo input {
    flex: 1; padding: 12px 16px; border: none; font-family: inherit;
    font-size: 13px; outline: none; color: #404040; background: transparent;
  }
  .cfj-cart-promo input::placeholder { color: #bbb; }
  .cfj-cart-promo button {
    padding: 12px 20px; background: #2C1810; color: #FFFCF5;
    border: none; font-family: 'DM Sans'; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: background 0.3s;
  }
  .cfj-cart-promo button:hover { background: #D4AF37; color: #2C1810; }

  /* Checkout CTA */
  .cfj-cart-checkout {
    display: block; width: 100%; padding: 16px; margin-top: 20px;
    background: linear-gradient(135deg, #D4AF37, #C5A028);
    color: #2C1810; border: none; font-family: 'DM Sans'; font-size: 13px;
    font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase;
    text-align: center; cursor: pointer; transition: all 0.3s;
  }
  .cfj-cart-checkout:hover { background: #F5D060; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.3); }

  .cfj-cart-continue {
    display: block; width: 100%; padding: 14px; margin-top: 10px;
    background: transparent; color: #2C1810; border: 1px solid rgba(44,24,16,0.1);
    font-family: 'DM Sans'; font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; text-align: center;
    cursor: pointer; transition: all 0.3s;
  }
  .cfj-cart-continue:hover { border-color: #D4AF37; color: #D4AF37; }

  /* Trust */
  .cfj-cart-trust {
    display: flex; justify-content: center; gap: 20px; margin-top: 20px;
    padding-top: 20px; border-top: 1px solid rgba(44,24,16,0.06);
  }
  .cfj-cart-trust-item {
    display: flex; align-items: center; gap: 6px; font-size: 11px;
    font-weight: 600; color: #8B7355;
  }
  .cfj-cart-trust-item svg { width: 16px; height: 16px; color: #D4AF37; }

  /* ── Mobile Sticky ── */
  .cfj-cart-mobile-bar {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    background: #fff; border-top: 1px solid rgba(44,24,16,0.08);
    padding: 12px 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
  }
  .cfj-cart-mobile-bar-inner {
    display: flex; justify-content: space-between; align-items: center; gap: 16px;
  }
  .cfj-cart-mobile-total { font-size: 18px; font-weight: 700; color: #2C1810; }
  .cfj-cart-mobile-total span { display: block; font-size: 11px; font-weight: 400; color: #8B7355; }
  .cfj-cart-mobile-btn {
    padding: 14px 32px; background: #D4AF37; color: #2C1810; border: none;
    font-family: 'DM Sans'; font-size: 12px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
  }

  /* ── Footer ── */
  .cfj-cart-footer { background: #1a0f0a; color: rgba(255,252,245,0.7); margin-top: 60px; }
  .cfj-cart-footer-inner { max-width: 1320px; margin: 0 auto; padding: 40px; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
  .cfj-cart-footer h4 { font-size: 12px; font-weight: 700; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; font-family: 'DM Sans'; }
  .cfj-cart-footer ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .cfj-cart-footer li a { font-size: 13px; color: rgba(255,252,245,0.5); transition: color 0.2s; }
  .cfj-cart-footer li a:hover { color: #D4AF37; }
  .cfj-cart-footer-copy { text-align: center; padding: 20px; border-top: 1px solid rgba(212,175,55,0.08); font-size: 12px; color: rgba(255,252,245,0.3); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cfj-cart-layout { grid-template-columns: 1fr; padding: 20px 16px 100px; gap: 24px; }
    .cfj-cart-summary { position: static; }
    .cfj-cart-mobile-bar { display: block; }
    .cfj-cart-checkout { display: none; }
    .cfj-cart-header { padding: 24px 16px; }
    .cfj-cart-item { grid-template-columns: 80px 1fr auto; gap: 12px; }
    .cfj-cart-item-img { width: 80px; height: 80px; }
    .cfj-cart-footer-inner { grid-template-columns: 1fr 1fr; gap: 24px; padding: 30px 16px; }
  }
  @media (max-width: 600px) {
    .cfj-cart-item { grid-template-columns: 70px 1fr; gap: 12px; }
    .cfj-cart-item-price-col { grid-column: 2; text-align: left; }
    .cfj-cart-item-img { width: 70px; height: 70px; }
    .cfj-cart-trust { flex-direction: column; align-items: center; gap: 8px; }
    .cfj-cart-footer-inner { grid-template-columns: 1fr; }
  }
{% endstyle %}

<div class="cfj-cart">
  <!-- Header -->
  <div class="cfj-cart-header">
    <h1>Shopping Bag</h1>
    <p>{{ cart.item_count | default: '3' }} items in your bag</p>
  </div>

  <!-- Layout -->
  <div class="cfj-cart-layout">
    <!-- Items -->
    <div class="cfj-cart-items">
      {% for item in cart.items %}
      <div class="cfj-cart-item">
        <div class="cfj-cart-item-img">
          <a href="{{ item.url }}"><img src="{{ item.image | img_url: '200x' }}" alt="{{ item.product.title }}"></a>
        </div>
        <div class="cfj-cart-item-details">
          <a href="{{ item.url }}" class="cfj-cart-item-title">{{ item.product.title }}</a>
          <div class="cfj-cart-item-meta">
            {% if item.variant.title != 'Default Title' %}<span>{{ item.variant.title }}</span>{% endif %}
            <span>Qty: {{ item.quantity }}</span>
          </div>
          <div class="cfj-cart-qty">
            <button>−</button>
            <span>{{ item.quantity }}</span>
            <button>+</button>
          </div>
          <div class="cfj-cart-item-actions">
            <button class="cfj-cart-item-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Save</button>
            <button class="cfj-cart-item-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Remove</button>
          </div>
        </div>
        <div class="cfj-cart-item-price-col">
          <span class="cfj-cart-item-price">{{ item.final_line_price | money }}</span>
          {% if item.original_line_price > item.final_line_price %}
            <span class="cfj-cart-item-compare">{{ item.original_line_price | money }}</span>
          {% endif %}
        </div>
      </div>
      {% else %}
        <!-- Fallback items -->
        {% assign fb_titles = "Sparkling Diamond Ring,Gold Jhumka Earrings,Kundan Necklace" | split: "," %}
        {% assign fb_prices = "24999,14999,38999" | split: "," %}
        {% assign fb_metals = "18K Gold • 2.4g,22K Gold • 6.8g,22K Gold • 12.3g" | split: "," %}
        {% for i in (0..2) %}
        <div class="cfj-cart-item">
          <div class="cfj-cart-item-img">
            <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-{{ forloop.index }}.png" alt="{{ fb_titles[i] }}">
          </div>
          <div class="cfj-cart-item-details">
            <span class="cfj-cart-item-title">{{ fb_titles[i] }}</span>
            <div class="cfj-cart-item-meta"><span>{{ fb_metals[i] }}</span></div>
            <div class="cfj-cart-qty"><button>−</button><span>1</span><button>+</button></div>
            <div class="cfj-cart-item-actions">
              <button class="cfj-cart-item-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Save</button>
              <button class="cfj-cart-item-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Remove</button>
            </div>
          </div>
          <div class="cfj-cart-item-price-col">
            <span class="cfj-cart-item-price">₹{{ fb_prices[i] }}</span>
          </div>
        </div>
        {% endfor %}
      {% endfor %}
    </div>

    <!-- Summary -->
    <div class="cfj-cart-summary">
      <h3>Order Summary</h3>
      <div class="cfj-cart-summary-row"><span>Subtotal</span><span>{{ cart.total_price | money | default: '₹78,997' }}</span></div>
      <div class="cfj-cart-summary-row"><span>Making Charges</span><span>₹8,200</span></div>
      <div class="cfj-cart-summary-row discount"><span>Discount (25% off MC)</span><span>-₹2,050</span></div>
      <div class="cfj-cart-summary-row"><span>GST (3%)</span><span>₹2,554</span></div>
      <div class="cfj-cart-summary-row"><span>Shipping</span><span style="color:#16a34a;">FREE</span></div>
      <div class="cfj-cart-summary-total"><span>Total</span><span>{{ cart.total_price | money | default: '₹87,701' }}</span></div>

      <div class="cfj-cart-promo">
        <input type="text" placeholder="Have a promo code?">
        <button style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">Apply</button>
      </div>

      <button class="cfj-cart-checkout" style="color:#2C1810 !important;-webkit-text-fill-color:#2C1810 !important;">Proceed to Checkout</button>
      <a href="/collections/all" class="cfj-cart-continue">Continue Shopping</a>

      <div class="cfj-cart-trust">
        <span class="cfj-cart-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Secure Payment</span>
        <span class="cfj-cart-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> Free Shipping</span>
        <span class="cfj-cart-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Easy Returns</span>
      </div>
    </div>
  </div>

  <!-- Mobile Sticky -->
  <div class="cfj-cart-mobile-bar">
    <div class="cfj-cart-mobile-bar-inner">
      <div class="cfj-cart-mobile-total">
        <span>Incl. all taxes</span>
        {{ cart.total_price | money | default: '₹87,701' }}
      </div>
      <button class="cfj-cart-mobile-btn" style="color:#2C1810 !important;-webkit-text-fill-color:#2C1810 !important;">Checkout</button>
    </div>
  </div>

  <!-- Footer -->
  <footer class="cfj-cart-footer">
    <div class="cfj-cart-footer-inner">
      <div><h4>Shop</h4><ul><li><a href="/collections/all">All Jewellery</a></li><li><a href="#">Rings</a></li><li><a href="#">Earrings</a></li><li><a href="#">Necklaces</a></li></ul></div>
      <div><h4>Help</h4><ul><li><a href="#">Track Order</a></li><li><a href="#">Returns</a></li><li><a href="#">Shipping</a></li><li><a href="#">FAQs</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Careers</a></li><li><a href="#">Stores</a></li><li><a href="#">Privacy</a></li></ul></div>
      <div><h4>Connect</h4><ul><li><a href="#">Facebook</a></li><li><a href="#">Instagram</a></li><li><a href="#">Twitter</a></li><li><a href="#">YouTube</a></li></ul></div>
    </div>
    <div class="cfj-cart-footer-copy">&copy; {{ 'now' | date: '%Y' }} {{ shop.name | default: 'Tanishq' }}. All rights reserved. A TATA Product.</div>
  </footer>
</div>

{% schema %}
{
  "name": "Tanishq Cart",
  "settings": [],
  "presets": [{ "name": "Tanishq Cart" }]
}
{% endschema %}
`,
  "cf-tanishq-collection": `{% comment %}
  ConvertFlow — Tanishq Collection Page (NEW)
  Authentic tanishq.co.in collection/category page
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cfj-col * { margin: 0; padding: 0; box-sizing: border-box; }
  .cfj-col {
    font-family: 'DM Sans', sans-serif; color: #404040;
    background: #FFFCF5; line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  .cfj-col a { text-decoration: none; color: inherit; }

  /* ── Collection Hero ── */
  .cfj-col-hero {
    background: #2C1810; padding: clamp(40px, 6vw, 80px) 40px;
    text-align: center; position: relative; overflow: hidden;
  }
  .cfj-col-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 60%);
  }
  .cfj-col-hero-overline {
    font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;
    color: #D4AF37; margin-bottom: 14px; display: block; position: relative;
  }
  .cfj-col-hero h1 {
    font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 52px);
    font-weight: 700; color: #FFFCF5; margin-bottom: 10px; position: relative;
  }
  .cfj-col-hero p {
    font-size: 15px; color: rgba(255,252,245,0.5); max-width: 500px;
    margin: 0 auto; position: relative;
  }
  .cfj-col-hero-count {
    display: inline-block; margin-top: 16px; padding: 6px 20px;
    border: 1px solid rgba(212,175,55,0.2); font-size: 12px; font-weight: 600;
    color: #D4AF37; position: relative; letter-spacing: 1px;
  }

  /* ── Top Bar ── */
  .cfj-col-topbar {
    max-width: 1320px; margin: 0 auto; padding: 20px 40px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(44,24,16,0.06);
  }
  .cfj-col-result { font-size: 13px; color: #8B7355; }
  .cfj-col-topbar-right { display: flex; align-items: center; gap: 16px; }
  .cfj-col-filter-btn {
    display: none; align-items: center; gap: 8px;
    padding: 10px 20px; background: #2C1810; color: #FFFCF5;
    border: none; font-family: 'DM Sans'; font-size: 13px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .cfj-col-filter-btn svg { width: 16px; height: 16px; }
  .cfj-col-filter-btn:hover { background: #D4AF37; color: #2C1810; }
  .cfj-col-sort select {
    border: 1px solid rgba(44,24,16,0.1); padding: 10px 36px 10px 14px;
    font-family: 'DM Sans'; font-size: 13px; font-weight: 600; color: #2C1810;
    background: #fff; cursor: pointer; outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232C1810' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
  }

  /* ── Layout ── */
  .cfj-col-layout {
    max-width: 1320px; margin: 0 auto; padding: 30px 40px 60px;
    display: grid; grid-template-columns: 240px 1fr; gap: 40px; align-items: start;
  }

  /* ── Sidebar ── */
  .cfj-col-sidebar {}
  .cfj-col-filter-group { margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid rgba(44,24,16,0.06); }
  .cfj-col-filter-group:last-child { border-bottom: none; }
  .cfj-col-filter-title {
    font-size: 12px; font-weight: 700; color: #2C1810;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;
    display: flex; justify-content: space-between; align-items: center; cursor: pointer;
  }
  .cfj-col-filter-title svg { width: 14px; height: 14px; color: #8B7355; }
  .cfj-col-filter-list { display: flex; flex-direction: column; gap: 12px; }
  .cfj-col-filter-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: #666; cursor: pointer; transition: color 0.2s;
  }
  .cfj-col-filter-item:hover { color: #D4AF37; }
  .cfj-col-filter-item input[type="checkbox"] {
    appearance: none; width: 18px; height: 18px; border: 1px solid #ccc;
    cursor: pointer; position: relative; transition: all 0.2s; flex-shrink: 0;
  }
  .cfj-col-filter-item input:checked { background: #D4AF37; border-color: #D4AF37; }
  .cfj-col-filter-item input:checked::after { content: '✓'; position: absolute; color: #2C1810; font-size: 11px; left: 3px; top: 0; font-weight: bold; }
  .cfj-col-filter-count { color: #bbb; font-size: 12px; margin-left: auto; }

  /* ── Product Grid ── */
  .cfj-col-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
  }
  .cfj-col-card { background: #fff; border: 1px solid rgba(44,24,16,0.04); transition: all 0.4s; cursor: pointer; }
  .cfj-col-card:hover { box-shadow: 0 12px 32px rgba(44,24,16,0.06); transform: translateY(-4px); }
  .cfj-col-card-img { position: relative; aspect-ratio: 1; overflow: hidden; background: #FAF5ED; }
  .cfj-col-card-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s; }
  .cfj-col-card:hover .cfj-col-card-img img { transform: scale(1.05); }
  .cfj-col-card-wish {
    position: absolute; top: 10px; right: 10px; width: 34px; height: 34px;
    background: rgba(255,255,255,0.9); border: none; display: flex;
    align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 2;
  }
  .cfj-col-card-wish:hover { background: #fff; }
  .cfj-col-card-wish svg { width: 16px; height: 16px; color: #aaa; }
  .cfj-col-card-wish:hover svg { color: #D4AF37; }
  .cfj-col-card-badge {
    position: absolute; top: 10px; left: 10px; background: #D4AF37;
    color: #2C1810; font-size: 10px; font-weight: 800; padding: 4px 10px;
    letter-spacing: 1px; text-transform: uppercase; z-index: 2;
  }
  .cfj-col-card-info { padding: 16px; }
  .cfj-col-card-title {
    font-size: 13px; font-weight: 500; color: #404040; margin-bottom: 6px;
    line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden; min-height: 36px;
  }
  .cfj-col-card-price { font-size: 17px; font-weight: 700; color: #2C1810; }
  .cfj-col-card-compare { font-size: 12px; color: #bbb; text-decoration: line-through; margin-left: 8px; }
  .cfj-col-card-cta {
    display: block; text-align: center; margin-top: 12px; padding: 11px;
    background: #2C1810; font-size: 10px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s;
    border: none; width: 100%; cursor: pointer; font-family: 'DM Sans';
  }
  .cfj-col-card-cta:hover { background: #D4AF37; }

  /* ── Mobile Filter Drawer ── */
  .cfj-col-overlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(3px); z-index: 998; opacity: 0; transition: opacity 0.3s;
  }
  .cfj-col-overlay.open { opacity: 1; pointer-events: auto; }
  .cfj-col-drawer {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    max-height: 80vh; background: #FFFCF5; z-index: 999;
    transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    overflow-y: auto;
  }
  .cfj-col-drawer.open { transform: translateY(0); }
  .cfj-col-drawer-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid rgba(44,24,16,0.06);
    position: sticky; top: 0; background: #FFFCF5; z-index: 2;
  }
  .cfj-col-drawer-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #2C1810; }
  .cfj-col-drawer-close {
    width: 36px; height: 36px; border: 1px solid rgba(44,24,16,0.1);
    background: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; color: #666; transition: all 0.2s;
  }
  .cfj-col-drawer-close:hover { background: #2C1810; color: #FFFCF5; }
  .cfj-col-drawer-body { padding: 20px 24px 100px; }
  .cfj-col-drawer-body .cfj-col-filter-item { font-size: 14px; padding: 4px 0; }
  .cfj-col-drawer-footer {
    position: sticky; bottom: 0; padding: 16px 24px;
    background: #FFFCF5; border-top: 1px solid rgba(44,24,16,0.06);
    display: flex; gap: 12px;
  }
  .cfj-col-drawer-btn {
    flex: 1; padding: 14px; border: none; font-family: 'DM Sans'; font-size: 13px;
    font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .cfj-col-drawer-btn.primary { background: #D4AF37; color: #2C1810; }
  .cfj-col-drawer-btn.secondary { background: #FAF5ED; color: #404040; }

  /* ── Footer ── */
  .cfj-col-footer { background: #1a0f0a; color: rgba(255,252,245,0.7); margin-top: 60px; }
  .cfj-col-footer-inner { max-width: 1320px; margin: 0 auto; padding: 40px; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
  .cfj-col-footer h4 { font-size: 12px; font-weight: 700; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; font-family: 'DM Sans'; }
  .cfj-col-footer ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .cfj-col-footer li a { font-size: 13px; color: rgba(255,252,245,0.5); transition: color 0.2s; }
  .cfj-col-footer li a:hover { color: #D4AF37; }
  .cfj-col-footer-copy { text-align: center; padding: 20px; border-top: 1px solid rgba(212,175,55,0.08); font-size: 12px; color: rgba(255,252,245,0.3); }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .cfj-col-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px) {
    .cfj-col-layout { grid-template-columns: 1fr; padding: 20px 16px 40px; }
    .cfj-col-sidebar { display: none !important; }
    .cfj-col-filter-btn { display: flex; }
    .cfj-col-overlay, .cfj-col-drawer { display: block; }
    .cfj-col-overlay { pointer-events: none; }
    .cfj-col-overlay.open { pointer-events: auto; }
    .cfj-col-topbar { padding: 16px; flex-wrap: wrap; gap: 10px; }
    .cfj-col-hero { padding: 30px 16px; }
    .cfj-col-footer-inner { grid-template-columns: 1fr 1fr; gap: 24px; padding: 30px 16px; }
  }
  @media (max-width: 600px) {
    .cfj-col-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .cfj-col-card-info { padding: 12px; }
    .cfj-col-card-title { font-size: 12px; min-height: 30px; }
    .cfj-col-card-price { font-size: 15px; }
    .cfj-col-card-cta { padding: 10px; font-size: 9px; }
    .cfj-col-card-wish { width: 28px; height: 28px; }
    .cfj-col-card-wish svg { width: 14px; height: 14px; }
    .cfj-col-footer-inner { grid-template-columns: 1fr; }
  }
{% endstyle %}

<div class="cfj-col">
  <!-- Hero -->
  <div class="cfj-col-hero">
    <span class="cfj-col-hero-overline">Curated Collection</span>
    <h1>{{ collection.title | default: 'Earrings' }}</h1>
    <p>Discover our handcrafted collection of exquisite designs</p>
    <span class="cfj-col-hero-count">{{ collection.products_count | default: '1,247' }} Designs</span>
  </div>

  <!-- Top Bar -->
  <div class="cfj-col-topbar">
    <span class="cfj-col-result">Showing {{ collection.products_count | default: '24' }} results</span>
    <div class="cfj-col-topbar-right">
      <button class="cfj-col-filter-btn" onclick="document.getElementById('cfjColOverlay').classList.add('open');document.getElementById('cfjColDrawer').classList.add('open');document.body.style.overflow='hidden';">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="16" y2="12"></line><line x1="4" y1="18" x2="12" y2="18"></line></svg>Filters
      </button>
      <div class="cfj-col-sort">
        <select><option>Sort By: Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Newest</option><option>Best Selling</option></select>
      </div>
    </div>
  </div>

  <!-- Mobile Filter Drawer -->
  <div class="cfj-col-overlay" id="cfjColOverlay" onclick="this.classList.remove('open');document.getElementById('cfjColDrawer').classList.remove('open');document.body.style.overflow='';"></div>
  <div class="cfj-col-drawer" id="cfjColDrawer">
    <div class="cfj-col-drawer-head">
      <span class="cfj-col-drawer-title">Filters</span>
      <button class="cfj-col-drawer-close" onclick="document.getElementById('cfjColOverlay').classList.remove('open');document.getElementById('cfjColDrawer').classList.remove('open');document.body.style.overflow='';">✕</button>
    </div>
    <div class="cfj-col-drawer-body">
      <div class="cfj-col-filter-group"><div class="cfj-col-filter-title">Price</div><div class="cfj-col-filter-list">
        <label class="cfj-col-filter-item"><input type="checkbox"> Under ₹10,000 <span class="cfj-col-filter-count">(89)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> ₹10,001 - ₹25,000 <span class="cfj-col-filter-count">(312)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> ₹25,001 - ₹50,000 <span class="cfj-col-filter-count">(198)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Above ₹50,000 <span class="cfj-col-filter-count">(67)</span></label>
      </div></div>
      <div class="cfj-col-filter-group"><div class="cfj-col-filter-title">Metal</div><div class="cfj-col-filter-list">
        <label class="cfj-col-filter-item"><input type="checkbox"> Gold <span class="cfj-col-filter-count">(534)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Diamond <span class="cfj-col-filter-count">(312)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Platinum <span class="cfj-col-filter-count">(45)</span></label>
      </div></div>
      <div class="cfj-col-filter-group"><div class="cfj-col-filter-title">Category</div><div class="cfj-col-filter-list">
        <label class="cfj-col-filter-item"><input type="checkbox" checked> Earrings <span class="cfj-col-filter-count">(867)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Rings <span class="cfj-col-filter-count">(654)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Necklaces <span class="cfj-col-filter-count">(321)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Bangles <span class="cfj-col-filter-count">(198)</span></label>
      </div></div>
    </div>
    <div class="cfj-col-drawer-footer">
      <button class="cfj-col-drawer-btn secondary" onclick="document.getElementById('cfjColOverlay').classList.remove('open');document.getElementById('cfjColDrawer').classList.remove('open');document.body.style.overflow='';">Clear All</button>
      <button class="cfj-col-drawer-btn primary" onclick="document.getElementById('cfjColOverlay').classList.remove('open');document.getElementById('cfjColDrawer').classList.remove('open');document.body.style.overflow='';">Apply Filters</button>
    </div>
  </div>

  <!-- Layout -->
  <div class="cfj-col-layout">
    <!-- Sidebar -->
    <aside class="cfj-col-sidebar">
      <div class="cfj-col-filter-group"><div class="cfj-col-filter-title">Price <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="cfj-col-filter-list">
        <label class="cfj-col-filter-item"><input type="checkbox"> Under ₹10,000 <span class="cfj-col-filter-count">(89)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> ₹10,001 - ₹25,000 <span class="cfj-col-filter-count">(312)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> ₹25,001 - ₹50,000 <span class="cfj-col-filter-count">(198)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Above ₹50,000 <span class="cfj-col-filter-count">(67)</span></label>
      </div></div>
      <div class="cfj-col-filter-group"><div class="cfj-col-filter-title">Metal <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="cfj-col-filter-list">
        <label class="cfj-col-filter-item"><input type="checkbox"> Gold <span class="cfj-col-filter-count">(534)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Diamond <span class="cfj-col-filter-count">(312)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Platinum <span class="cfj-col-filter-count">(45)</span></label>
      </div></div>
      <div class="cfj-col-filter-group"><div class="cfj-col-filter-title">Category <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="cfj-col-filter-list">
        <label class="cfj-col-filter-item"><input type="checkbox" checked> Earrings <span class="cfj-col-filter-count">(867)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Rings <span class="cfj-col-filter-count">(654)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Necklaces <span class="cfj-col-filter-count">(321)</span></label>
        <label class="cfj-col-filter-item"><input type="checkbox"> Bangles <span class="cfj-col-filter-count">(198)</span></label>
      </div></div>
    </aside>

    <!-- Grid -->
    <div>
      {% paginate collection.products by 16 %}
      <div class="cfj-col-grid">
        {% for product in collection.products %}
        <div class="cfj-col-card">
          <div class="cfj-col-card-img">
            {% if product.compare_at_price > product.price %}<span class="cfj-col-card-badge">Sale</span>{% endif %}
            <button class="cfj-col-card-wish" onclick="event.preventDefault();" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
            <a href="{{ product.url }}"><img src="{{ product.featured_image | img_url: '400x' }}" alt="{{ product.title }}"></a>
          </div>
          <div class="cfj-col-card-info">
            <a href="{{ product.url }}" class="cfj-col-card-title">{{ product.title }}</a>
            <div><span class="cfj-col-card-price">{{ product.price | money }}</span>{% if product.compare_at_price > product.price %}<span class="cfj-col-card-compare">{{ product.compare_at_price | money }}</span>{% endif %}</div>
            <a href="{{ product.url }}" class="cfj-col-card-cta" style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">View Product</a>
          </div>
        </div>
        {% else %}
          {% assign fb_names = "Diamond Solitaire Ring,Gold Jhumka Earrings,Kundan Necklace,Diamond Eternity Ring,Pearl Drop Earrings,Gold Chain Bracelet,Emerald Pendant,Ruby Stud Earrings" | split: "," %}
          {% assign fb_prices = "24999,14999,38999,19999,12500,8999,27500,16999" | split: "," %}
          {% for i in (1..8) %}
          {% assign idx = forloop.index0 %}
          <div class="cfj-col-card">
            <div class="cfj-col-card-img">
              {% if i == 1 or i == 4 or i == 7 %}<span class="cfj-col-card-badge">New</span>{% endif %}
              <button class="cfj-col-card-wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
              <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-{{ i | modulo: 6 | plus: 1 }}.png" alt="{{ fb_names[idx] }}">
            </div>
            <div class="cfj-col-card-info">
              <span class="cfj-col-card-title">{{ fb_names[idx] }}</span>
              <div><span class="cfj-col-card-price">₹{{ fb_prices[idx] }}</span></div>
              <a href="#" class="cfj-col-card-cta" style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">View Product</a>
            </div>
          </div>
          {% endfor %}
        {% endfor %}
      </div>
      {% endpaginate %}
    </div>
  </div>

  <!-- Footer -->
  <footer class="cfj-col-footer">
    <div class="cfj-col-footer-inner">
      <div><h4>Shop</h4><ul><li><a href="/collections/all">All Jewellery</a></li><li><a href="#">Rings</a></li><li><a href="#">Earrings</a></li><li><a href="#">Necklaces</a></li></ul></div>
      <div><h4>Help</h4><ul><li><a href="#">Track Order</a></li><li><a href="#">Returns</a></li><li><a href="#">Shipping</a></li><li><a href="#">FAQs</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Careers</a></li><li><a href="#">Stores</a></li><li><a href="#">Privacy</a></li></ul></div>
      <div><h4>Connect</h4><ul><li><a href="#">Facebook</a></li><li><a href="#">Instagram</a></li><li><a href="#">Twitter</a></li><li><a href="#">YouTube</a></li></ul></div>
    </div>
    <div class="cfj-col-footer-copy">&copy; {{ 'now' | date: '%Y' }} {{ shop.name | default: 'Tanishq' }}. All rights reserved.</div>
  </footer>
</div>

{% schema %}
{
  "name": "Tanishq Collection",
  "settings": [],
  "presets": [{ "name": "Tanishq Collection" }]
}
{% endschema %}
`,
  "cf-tanishq-landing": `{% comment %}
  ConvertFlow — Tanishq Landing Page (Redesigned)
  Authentic tanishq.co.in design: Dark brown, gold accents, sharp edges
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');

  .cfj * { margin: 0; padding: 0; box-sizing: border-box; }
  .cfj {
    font-family: 'DM Sans', sans-serif;
    color: #404040;
    line-height: 1.6;
    background: #FFFCF5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  .cfj a { text-decoration: none; color: inherit; }
  .cfj h1,.cfj h2,.cfj h3,.cfj h4 { font-family: 'Playfair Display', serif; color: #2C1810; }
  .cfj-container { max-width: 1320px; margin: 0 auto; padding: 0 40px; }

  /* ── Top Info Strip ── */
  .cfj-strip {
    background: #2C1810; color: #D4AF37;
    display: flex; justify-content: center; align-items: center; gap: 40px;
    padding: 9px 16px; font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
  }
  .cfj-strip-item { display: flex; align-items: center; gap: 8px; }
  .cfj-strip-item svg { width: 14px; height: 14px; flex-shrink: 0; }
  .cfj-strip-div { width: 1px; height: 14px; background: rgba(212,175,55,0.3); }

  /* ── Announcement ── */
  .cfj-announce {
    background: linear-gradient(90deg, #D4AF37, #F5D060, #D4AF37);
    color: #2C1810; text-align: center; padding: 10px 16px;
    font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
  }
  .cfj-announce a { text-decoration: underline; font-weight: 800; }

  /* ── Navbar ── */
  .cfj-nav {
    background: #FFFCF5; border-bottom: 1px solid rgba(44,24,16,0.08);
    position: sticky; top: 0; z-index: 100;
  }
  .cfj-nav-inner {
    max-width: 1320px; margin: 0 auto; padding: 0 40px;
    display: flex; justify-content: space-between; align-items: center; height: 70px;
  }
  .cfj-nav-logo {
    font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700;
    color: #2C1810; letter-spacing: 2px;
  }
  .cfj-nav-logo span { color: #D4AF37; }
  .cfj-nav-links { display: flex; gap: 32px; list-style: none; }
  .cfj-nav-links li a {
    font-size: 13px; font-weight: 600; color: #2C1810;
    letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s;
    position: relative; padding-bottom: 4px;
  }
  .cfj-nav-links li a::after {
    content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
    background: #D4AF37; transition: width 0.3s;
  }
  .cfj-nav-links li a:hover { color: #D4AF37; }
  .cfj-nav-links li a:hover::after { width: 100%; }
  .cfj-nav-icons { display: flex; gap: 20px; align-items: center; }
  .cfj-nav-icon {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: color 0.2s; color: #2C1810;
  }
  .cfj-nav-icon:hover { color: #D4AF37; }
  .cfj-nav-icon svg { width: 22px; height: 22px; }

  /* ── Hero ── */
  .cfj-hero {
    background: linear-gradient(135deg, #1a0f0a 0%, #2C1810 40%, #3d2317 100%);
    position: relative; overflow: hidden;
  }
  .cfj-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 70% 50%, rgba(212,175,55,0.06) 0%, transparent 60%);
  }
  .cfj-hero-inner {
    max-width: 1320px; margin: 0 auto; padding: 100px 48px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
    align-items: center; position: relative; z-index: 1;
  }
  .cfj-hero-overline {
    display: inline-flex; align-items: center; gap: 12px;
    color: #D4AF37; font-size: 11px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px;
  }
  .cfj-hero-overline::before, .cfj-hero-overline::after {
    content: ''; width: 32px; height: 1px; background: #D4AF37;
  }
  .cfj-hero h1 {
    font-size: clamp(36px, 5vw, 56px); font-weight: 700; line-height: 1.12;
    color: #FFFCF5; margin-bottom: 20px;
  }
  .cfj-hero h1 em { color: #D4AF37; font-style: italic; }
  .cfj-hero-sub {
    font-size: 16px; color: rgba(255,252,245,0.65); margin-bottom: 36px;
    max-width: 460px; line-height: 1.8;
  }
  .cfj-hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
  .cfj-btn-gold {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #D4AF37, #C5A028);
    color: #2C1810; padding: 16px 40px; border: none; cursor: pointer;
    font-size: 12px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase;
    font-family: 'DM Sans', sans-serif; transition: all 0.3s;
  }
  .cfj-btn-gold:hover { background: #F5D060; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.3); }
  .cfj-btn-gold svg { width: 16px; height: 16px; }
  .cfj-btn-outline {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; color: #D4AF37; padding: 16px 40px;
    border: 1px solid rgba(212,175,55,0.4); cursor: pointer;
    font-size: 12px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase;
    font-family: 'DM Sans', sans-serif; transition: all 0.3s;
  }
  .cfj-btn-outline:hover { border-color: #D4AF37; background: rgba(212,175,55,0.08); }
  .cfj-hero-img {
    position: relative; display: flex; justify-content: center; align-items: center;
  }
  .cfj-hero-img img {
    max-width: 100%; height: auto; filter: drop-shadow(0 20px 60px rgba(0,0,0,0.4));
  }
  .cfj-hero-img-ring {
    position: absolute; width: 320px; height: 320px; border-radius: 50%;
    border: 1px solid rgba(212,175,55,0.15);
    animation: cfj-spin 20s linear infinite;
  }
  @keyframes cfj-spin { to { transform: rotate(360deg); } }

  /* ── Section Heading ── */
  .cfj-heading { text-align: center; padding: 70px 0 40px; }
  .cfj-heading-overline {
    font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;
    color: #D4AF37; margin-bottom: 14px; display: block;
  }
  .cfj-heading h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: #2C1810; margin-bottom: 10px; }
  .cfj-heading p { font-size: 15px; color: #8B7355; max-width: 560px; margin: 0 auto; }

  /* ── Category Grid ── */
  .cfj-cats { padding: 0 0 70px; }
  .cfj-cats-grid {
    max-width: 1320px; margin: 0 auto; padding: 0 40px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
  }
  .cfj-cat-card {
    position: relative; overflow: hidden; aspect-ratio: 3/4;
    cursor: pointer; background: #FAF5ED;
  }
  .cfj-cat-card img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
  }
  .cfj-cat-card:hover img { transform: scale(1.06); }
  .cfj-cat-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(44,24,16,0.7) 0%, transparent 50%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 28px;
  }
  .cfj-cat-card-overlay h3 {
    color: #fff; font-size: 22px; font-weight: 600; margin-bottom: 8px;
  }
  .cfj-cat-card-overlay span {
    color: #D4AF37; font-size: 12px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px;
  }
  .cfj-cat-card-overlay span svg { width: 14px; height: 14px; }

  /* ── Featured Products ── */
  .cfj-featured { background: #FAF5ED; padding: 70px 0; }
  .cfj-feat-grid {
    max-width: 1320px; margin: 0 auto; padding: 0 40px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
  }
  .cfj-prod-card { background: #fff; transition: all 0.4s; cursor: pointer; }
  .cfj-prod-card:hover { box-shadow: 0 12px 32px rgba(44,24,16,0.06); transform: translateY(-4px); }
  .cfj-prod-card-img { position: relative; aspect-ratio: 1; overflow: hidden; background: #f9f6f0; }
  .cfj-prod-card-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s; }
  .cfj-prod-card:hover .cfj-prod-card-img img { transform: scale(1.05); }
  .cfj-prod-card-wish {
    position: absolute; top: 12px; right: 12px; width: 36px; height: 36px;
    border-radius: 50%; background: rgba(255,255,255,0.9); border: none;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: all 0.2s;
  }
  .cfj-prod-card-wish:hover { background: #fff; transform: scale(1.15); }
  .cfj-prod-card-wish svg { width: 18px; height: 18px; color: #aaa; }
  .cfj-prod-card-wish:hover svg { color: #D4AF37; }
  .cfj-prod-card-info { padding: 20px; }
  .cfj-prod-card-title {
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: #404040; margin-bottom: 8px; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .cfj-prod-card-price { font-size: 18px; font-weight: 700; color: #2C1810; }
  .cfj-prod-card-compare { font-size: 13px; color: #bbb; text-decoration: line-through; margin-left: 8px; }
  .cfj-prod-card-cta {
    display: block; text-align: center; margin-top: 14px; padding: 12px;
    background: #2C1810; color: #FFFCF5; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s;
    cursor: pointer; border: none; width: 100%; font-family: 'DM Sans', sans-serif;
  }
  .cfj-prod-card-cta:hover { background: #D4AF37; color: #2C1810; }

  /* ── Trust Bar ── */
  .cfj-trust { padding: 70px 0; }
  .cfj-trust-grid {
    max-width: 1320px; margin: 0 auto; padding: 0 40px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
  }
  .cfj-trust-item {
    text-align: center; padding: 36px 24px;
    border: 1px solid rgba(44,24,16,0.06);
    transition: all 0.3s;
  }
  .cfj-trust-item:hover { border-color: rgba(212,175,55,0.3); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(44,24,16,0.04); }
  .cfj-trust-icon {
    width: 56px; height: 56px; margin: 0 auto 20px;
    background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05));
    display: flex; align-items: center; justify-content: center; border-radius: 50%;
  }
  .cfj-trust-icon svg { width: 28px; height: 28px; color: #D4AF37; }
  .cfj-trust-item h4 { font-size: 16px; font-weight: 600; color: #2C1810; margin-bottom: 8px; font-family: 'DM Sans', sans-serif; }
  .cfj-trust-item p { font-size: 13px; color: #8B7355; line-height: 1.6; }

  /* ── Promotional Banner ── */
  .cfj-promo {
    background: #2C1810; padding: 80px 0; position: relative; overflow: hidden;
  }
  .cfj-promo::before {
    content: ''; position: absolute; top: -100px; right: -100px;
    width: 400px; height: 400px; border-radius: 50%;
    border: 1px solid rgba(212,175,55,0.08);
  }
  .cfj-promo-inner {
    max-width: 1320px; margin: 0 auto; padding: 0 48px;
    display: flex; justify-content: space-between; align-items: center; gap: 60px;
    position: relative; z-index: 1;
  }
  .cfj-promo-text { max-width: 560px; }
  .cfj-promo-text h2 { font-size: clamp(28px, 4vw, 40px); color: #FFFCF5; margin-bottom: 16px; }
  .cfj-promo-text h2 em { color: #D4AF37; font-style: italic; }
  .cfj-promo-text p { font-size: 15px; color: rgba(255,252,245,0.6); margin-bottom: 32px; line-height: 1.8; }

  /* ── Footer ── */
  .cfj-footer { background: #1a0f0a; color: rgba(255,252,245,0.7); }
  .cfj-footer-nl {
    background: linear-gradient(90deg, #2C1810, #3d2317);
    padding: 40px; display: flex; justify-content: space-between;
    align-items: center; gap: 30px; flex-wrap: wrap;
  }
  .cfj-footer-nl h3 { font-size: 22px; color: #FFFCF5; margin-bottom: 6px; }
  .cfj-footer-nl p { font-size: 14px; color: rgba(255,252,245,0.5); }
  .cfj-footer-nl-form { display: flex; gap: 0; max-width: 420px; flex: 1; }
  .cfj-footer-nl-form input {
    flex: 1; padding: 14px 20px; border: 1px solid rgba(212,175,55,0.2);
    background: transparent; color: #FFFCF5; font-family: inherit; font-size: 14px;
    outline: none; border-right: none;
  }
  .cfj-footer-nl-form input::placeholder { color: rgba(255,252,245,0.3); }
  .cfj-footer-nl-form button {
    padding: 14px 28px; background: #D4AF37; color: #2C1810; border: none;
    font-weight: 700; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.3s;
  }
  .cfj-footer-nl-form button:hover { background: #F5D060; }
  .cfj-footer-main {
    max-width: 1320px; margin: 0 auto; padding: 50px 40px 30px;
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px;
  }
  .cfj-footer-brand h2 { font-size: 24px; color: #FFFCF5; margin-bottom: 14px; }
  .cfj-footer-brand h2 span { color: #D4AF37; }
  .cfj-footer-brand p { font-size: 13px; line-height: 1.7; color: rgba(255,252,245,0.5); margin-bottom: 20px; }
  .cfj-footer-socials { display: flex; gap: 10px; }
  .cfj-footer-social {
    width: 38px; height: 38px; border-radius: 50%;
    border: 1px solid rgba(212,175,55,0.2); display: flex;
    align-items: center; justify-content: center; transition: all 0.3s; cursor: pointer;
  }
  .cfj-footer-social:hover { background: #D4AF37; border-color: #D4AF37; }
  .cfj-footer-social svg { width: 16px; height: 16px; color: rgba(255,252,245,0.6); }
  .cfj-footer-social:hover svg { color: #2C1810; }
  .cfj-footer-col h4 {
    font-size: 12px; font-weight: 700; color: #D4AF37;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;
    font-family: 'DM Sans', sans-serif;
  }
  .cfj-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .cfj-footer-col li a { font-size: 13px; color: rgba(255,252,245,0.5); transition: color 0.2s; }
  .cfj-footer-col li a:hover { color: #D4AF37; }
  .cfj-footer-bottom {
    max-width: 1320px; margin: 0 auto; padding: 24px 40px;
    border-top: 1px solid rgba(212,175,55,0.08);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 16px;
  }
  .cfj-footer-copy { font-size: 12px; color: rgba(255,252,245,0.3); }
  .cfj-footer-pays { display: flex; gap: 8px; }
  .cfj-footer-pay {
    width: 42px; height: 26px; border: 1px solid rgba(212,175,55,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 800; color: rgba(255,252,245,0.4); letter-spacing: 0.5px;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .cfj-hero-inner { grid-template-columns: 1fr; padding: 60px 32px; text-align: center; }
    .cfj-hero-sub { margin: 0 auto 36px; }
    .cfj-hero-ctas { justify-content: center; }
    .cfj-hero-img { display: none; }
    .cfj-cats-grid, .cfj-feat-grid { grid-template-columns: repeat(3, 1fr); }
    .cfj-trust-grid { grid-template-columns: repeat(2, 1fr); }
    .cfj-promo-inner { flex-direction: column; text-align: center; }
  }
  @media (max-width: 768px) {
    .cfj-strip { flex-wrap: wrap; gap: 12px; font-size: 10px; }
    .cfj-strip-div { display: none; }
    .cfj-nav-links { display: none; }
    .cfj-nav-inner { padding: 0 16px; height: 56px; }
    .cfj-nav-logo { font-size: 22px; }
    .cfj-cats-grid, .cfj-feat-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 0 16px; }
    .cfj-heading { padding: 50px 16px 30px; }
    .cfj-trust-grid { grid-template-columns: 1fr 1fr; gap: 16px; padding: 0 16px; }
    .cfj-footer-main { grid-template-columns: 1fr 1fr; gap: 24px; padding: 30px 16px; }
    .cfj-footer-nl { padding: 28px 16px; flex-direction: column; }
    .cfj-footer-nl-form { max-width: 100%; }
    .cfj-footer-bottom { padding: 16px; flex-direction: column; text-align: center; }
    .cfj-container { padding: 0 16px; }
  }
  @media (max-width: 480px) {
    .cfj-cats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .cfj-feat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .cfj-trust-grid { grid-template-columns: 1fr; }
    .cfj-footer-main { grid-template-columns: 1fr; }
    .cfj-hero-inner { padding: 50px 16px; }
    .cfj-btn-gold, .cfj-btn-outline { padding: 14px 24px; font-size: 11px; }
    .cfj-promo-inner { padding: 0 16px; }
  }
{% endstyle %}

<!-- TOP INFO STRIP -->
<div class="cfj">
  <div class="cfj-strip">
    <div class="cfj-strip-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      Free Shipping Over ₹2,499
    </div>
    <div class="cfj-strip-div"></div>
    <div class="cfj-strip-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      100% BIS Hallmarked
    </div>
    <div class="cfj-strip-div"></div>
    <div class="cfj-strip-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
      Lifetime Exchange
    </div>
    <div class="cfj-strip-div"></div>
    <div class="cfj-strip-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
      0% EMI Available
    </div>
  </div>

  <!-- ANNOUNCEMENT -->
  <div class="cfj-announce">
    ✦ Celebrate the Season of Sparkle — Flat 25% Off on Making Charges + 15% Off on Diamond Value ✦
    <a href="#">Shop Now</a>
  </div>

  <!-- NAVBAR -->
  <nav class="cfj-nav">
    <div class="cfj-nav-inner">
      <a href="/" class="cfj-nav-logo">{{ shop.name | default: 'TANISHQ' }}<span>.</span></a>
      <ul class="cfj-nav-links">
        <li><a href="/collections/all">Jewellery</a></li>
        <li><a href="#">Collections</a></li>
        <li><a href="#">Diamonds</a></li>
        <li><a href="#">Gold Coins</a></li>
        <li><a href="#">Gifts</a></li>
        <li><a href="#">Occasions</a></li>
      </ul>
      <div class="cfj-nav-icons">
        <span class="cfj-nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
        <span class="cfj-nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></span>
        <a href="/cart" class="cfj-nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></a>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="cfj-hero">
    <div class="cfj-hero-inner">
      <div>
        <div class="cfj-hero-overline">{{ section.settings.hero_overline }}</div>
        <h1>{{ section.settings.hero_title }} <em>{{ section.settings.hero_title_accent }}</em></h1>
        <p class="cfj-hero-sub">{{ section.settings.hero_subtitle }}</p>
        <div class="cfj-hero-ctas">
          <a href="/collections/all" class="cfj-btn-gold">
            Explore Collection
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="#" class="cfj-btn-outline">New Arrivals</a>
        </div>
      </div>
      <div class="cfj-hero-img">
        <div class="cfj-hero-img-ring"></div>
        {% if section.settings.hero_image != blank %}
          <img src="{{ section.settings.hero_image | img_url: 'master' }}" alt="Hero">
        {% else %}
          <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1.png" alt="Jewellery">
        {% endif %}
      </div>
    </div>
  </section>

  <!-- CATEGORIES -->
  <div class="cfj-heading">
    <span class="cfj-heading-overline">Curated For You</span>
    <h2>Shop By Category</h2>
    <p>Discover our handcrafted collections, from timeless rings to statement necklaces.</p>
  </div>
  <section class="cfj-cats">
    <div class="cfj-cats-grid">
      {% for collection in collections limit: 4 %}
      <a href="{{ collection.url }}" class="cfj-cat-card">
        {% if collection.image %}
          <img src="{{ collection.image | img_url: '600x800' }}" alt="{{ collection.title }}">
        {% else %}
          <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-{{ forloop.index }}.png" alt="{{ collection.title }}">
        {% endif %}
        <div class="cfj-cat-card-overlay">
          <h3>{{ collection.title }}</h3>
          <span>Shop Now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
        </div>
      </a>
      {% else %}
        {% assign cat_names = "Rings,Earrings,Necklaces,Bangles" | split: "," %}
        {% for name in cat_names %}
        <div class="cfj-cat-card">
          <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-{{ forloop.index }}.png" alt="{{ name }}">
          <div class="cfj-cat-card-overlay">
            <h3>{{ name }}</h3>
            <span>Shop Now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
          </div>
        </div>
        {% endfor %}
      {% endfor %}
    </div>
  </section>

  <!-- FEATURED PRODUCTS -->
  <section class="cfj-featured">
    <div class="cfj-heading">
      <span class="cfj-heading-overline">India's Most Wishlisted</span>
      <h2>Trending Now</h2>
      <p>The pieces everyone is talking about — curated from our bestsellers.</p>
    </div>
    <div class="cfj-feat-grid">
      {% for product in collections.all.products limit: 4 %}
      <div class="cfj-prod-card">
        <div class="cfj-prod-card-img">
          <button class="cfj-prod-card-wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
          <a href="{{ product.url }}"><img src="{{ product.featured_image | img_url: '400x' }}" alt="{{ product.title }}"></a>
        </div>
        <div class="cfj-prod-card-info">
          <a href="{{ product.url }}" class="cfj-prod-card-title">{{ product.title }}</a>
          <div>
            <span class="cfj-prod-card-price">{{ product.price | money }}</span>
            {% if product.compare_at_price > product.price %}
              <span class="cfj-prod-card-compare">{{ product.compare_at_price | money }}</span>
            {% endif %}
          </div>
          <a href="{{ product.url }}" class="cfj-prod-card-cta" style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">View Product</a>
        </div>
      </div>
      {% else %}
        {% assign fb = "Diamond Solitaire Ring,Gold Jhumka Earrings,Mangalsutra Pendant,Kundan Bangle" | split: "," %}
        {% assign fp = "24999,14999,18999,32999" | split: "," %}
        {% for name in fb %}
        <div class="cfj-prod-card">
          <div class="cfj-prod-card-img">
            <button class="cfj-prod-card-wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
            <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-{{ forloop.index }}.png" alt="{{ name }}">
          </div>
          <div class="cfj-prod-card-info">
            <span class="cfj-prod-card-title">{{ name }}</span>
            <div><span class="cfj-prod-card-price">₹{{ fp[forloop.index0] }}</span></div>
            <a href="#" class="cfj-prod-card-cta" style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">View Product</a>
          </div>
        </div>
        {% endfor %}
      {% endfor %}
    </div>
  </section>

  <!-- TRUST -->
  <section class="cfj-trust">
    <div class="cfj-heading">
      <span class="cfj-heading-overline">The Tanishq Promise</span>
      <h2>Why Choose Us</h2>
    </div>
    <div class="cfj-trust-grid">
      <div class="cfj-trust-item">
        <div class="cfj-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
        <h4>Purity Guaranteed</h4>
        <p>Every piece is BIS Hallmarked with certified gold purity.</p>
      </div>
      <div class="cfj-trust-item">
        <div class="cfj-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></div>
        <h4>Lifetime Exchange</h4>
        <p>Exchange your old jewellery at full value, anytime.</p>
      </div>
      <div class="cfj-trust-item">
        <div class="cfj-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
        <h4>Free Insured Shipping</h4>
        <p>Safely delivered to your doorstep, fully insured.</p>
      </div>
      <div class="cfj-trust-item">
        <div class="cfj-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></div>
        <h4>Detailed Certificate</h4>
        <p>Diamond & gemstone certificates included with every purchase.</p>
      </div>
    </div>
  </section>

  <!-- PROMO BANNER -->
  <section class="cfj-promo">
    <div class="cfj-promo-inner">
      <div class="cfj-promo-text">
        <h2>Celebrate Every <em>Moment</em></h2>
        <p>From weddings to anniversaries, birthdays to milestones — find the perfect piece for every occasion in our curated gift collections.</p>
        <a href="/collections/all" class="cfj-btn-gold">Shop Gifts <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
      </div>
      <div>
        <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-1.png" alt="Gifts" style="max-width:400px;width:100%;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.3));">
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="cfj-footer">
    <div class="cfj-footer-nl">
      <div>
        <h3>Stay in the Loop</h3>
        <p>Be the first to know about new collections & exclusive offers.</p>
      </div>
      <div class="cfj-footer-nl-form">
        <input type="email" placeholder="Your email address">
        <button>Subscribe</button>
      </div>
    </div>
    <div class="cfj-footer-main">
      <div class="cfj-footer-brand">
        <h2>{{ shop.name | default: 'TANISHQ' }}<span>.</span></h2>
        <p>India's most trusted jewellery brand. Every piece is a masterwork of tradition, trust and timeless design. BIS Hallmarked since 1994.</p>
        <div class="cfj-footer-socials">
          <a class="cfj-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
          <a class="cfj-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          <a class="cfj-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
          <a class="cfj-footer-social" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
        </div>
      </div>
      <div class="cfj-footer-col"><h4>Shop</h4><ul><li><a href="/collections/all">All Jewellery</a></li><li><a href="#">Rings</a></li><li><a href="#">Earrings</a></li><li><a href="#">Necklaces</a></li><li><a href="#">Bangles</a></li><li><a href="#">Gold Coins</a></li></ul></div>
      <div class="cfj-footer-col"><h4>Help</h4><ul><li><a href="#">Track Order</a></li><li><a href="#">Returns & Exchange</a></li><li><a href="#">Shipping Info</a></li><li><a href="#">FAQs</a></li><li><a href="#">Contact Us</a></li></ul></div>
      <div class="cfj-footer-col"><h4>Company</h4><ul><li><a href="#">About Tanishq</a></li><li><a href="#">Careers</a></li><li><a href="#">Store Locator</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms</a></li></ul></div>
    </div>
    <div class="cfj-footer-bottom">
      <span class="cfj-footer-copy">&copy; {{ 'now' | date: '%Y' }} {{ shop.name | default: 'Tanishq' }}. All rights reserved. A TATA Product.</span>
      <div class="cfj-footer-pays">
        <span class="cfj-footer-pay">VISA</span><span class="cfj-footer-pay">MC</span><span class="cfj-footer-pay">AMEX</span><span class="cfj-footer-pay">UPI</span><span class="cfj-footer-pay">EMI</span><span class="cfj-footer-pay">COD</span>
      </div>
    </div>
  </footer>
</div>

{% schema %}
{
  "name": "Tanishq Landing",
  "settings": [
    { "type": "header", "content": "Hero Section" },
    { "type": "text", "id": "hero_overline", "label": "Hero Overline", "default": "New Collection 2025" },
    { "type": "text", "id": "hero_title", "label": "Hero Title", "default": "Celebrate Your" },
    { "type": "text", "id": "hero_title_accent", "label": "Hero Accent Word", "default": "Sparkle" },
    { "type": "textarea", "id": "hero_subtitle", "label": "Hero Subtitle", "default": "Discover exquisite handcrafted jewellery that celebrates every moment of your life. From timeless classics to contemporary designs." },
    { "type": "image_picker", "id": "hero_image", "label": "Hero Image" }
  ],
  "presets": [{ "name": "Tanishq Landing" }]
}
{% endschema %}
`,
  "cf-tanishq-product": `{% comment %}
  ConvertFlow — Tanishq Product Page (Redesigned)
  Authentic tanishq.co.in product detail page
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cfj-pdp * { margin: 0; padding: 0; box-sizing: border-box; }
  .cfj-pdp {
    font-family: 'DM Sans', sans-serif; color: #404040;
    background: #FFFCF5; line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  .cfj-pdp a { text-decoration: none; color: inherit; }
  .cfj-pdp h1,.cfj-pdp h2,.cfj-pdp h3 { font-family: 'Playfair Display', serif; color: #2C1810; }

  /* ── Breadcrumb ── */
  .cfj-pdp-bread {
    max-width: 1320px; margin: 0 auto; padding: 20px 40px;
    font-size: 13px; color: #8B7355; display: flex; align-items: center; gap: 8px;
  }
  .cfj-pdp-bread a { color: #8B7355; transition: color 0.2s; }
  .cfj-pdp-bread a:hover { color: #D4AF37; }
  .cfj-pdp-bread span { color: #ccc; }

  /* ── Main Layout ── */
  .cfj-pdp-main {
    max-width: 1320px; margin: 0 auto; padding: 0 40px 60px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;
  }

  /* ── Gallery ── */
  .cfj-pdp-gallery { position: sticky; top: 80px; }
  .cfj-pdp-gallery-main {
    width: 100%; aspect-ratio: 1; background: #FAF5ED; overflow: hidden;
    display: flex; align-items: center; justify-content: center; position: relative;
    border: 1px solid rgba(44,24,16,0.06);
  }
  .cfj-pdp-gallery-main img { max-width: 85%; max-height: 85%; object-fit: contain; transition: transform 0.5s; }
  .cfj-pdp-gallery-main:hover img { transform: scale(1.1); }
  .cfj-pdp-gallery-wish {
    position: absolute; top: 16px; right: 16px; width: 44px; height: 44px;
    background: rgba(255,255,255,0.9); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .cfj-pdp-gallery-wish:hover { background: #fff; }
  .cfj-pdp-gallery-wish svg { width: 22px; height: 22px; color: #8B7355; }
  .cfj-pdp-gallery-wish:hover svg { color: #D4AF37; }
  .cfj-pdp-thumbs {
    display: flex; gap: 10px; margin-top: 14px; overflow-x: auto; scrollbar-width: none;
  }
  .cfj-pdp-thumbs::-webkit-scrollbar { display: none; }
  .cfj-pdp-thumb {
    width: 72px; height: 72px; flex-shrink: 0; border: 2px solid transparent;
    background: #FAF5ED; cursor: pointer; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s;
  }
  .cfj-pdp-thumb:first-child { border-color: #D4AF37; }
  .cfj-pdp-thumb:hover { border-color: #D4AF37; }
  .cfj-pdp-thumb img { max-width: 90%; max-height: 90%; object-fit: contain; }

  /* ── Details ── */
  .cfj-pdp-details { padding-top: 10px; }
  .cfj-pdp-title { font-size: clamp(24px, 3vw, 32px); font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
  .cfj-pdp-subtitle { font-size: 14px; color: #8B7355; margin-bottom: 20px; }

  /* Rating */
  .cfj-pdp-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
  .cfj-pdp-stars { display: flex; gap: 2px; }
  .cfj-pdp-stars svg { width: 16px; height: 16px; fill: #D4AF37; color: #D4AF37; }
  .cfj-pdp-stars svg.empty { fill: none; color: #ddd; }
  .cfj-pdp-reviews { font-size: 13px; color: #8B7355; }

  /* Price */
  .cfj-pdp-price-block {
    background: #FAF5ED; padding: 20px 24px; margin-bottom: 24px;
    border-left: 3px solid #D4AF37;
  }
  .cfj-pdp-price { font-size: 28px; font-weight: 700; color: #2C1810; }
  .cfj-pdp-compare { font-size: 16px; color: #bbb; text-decoration: line-through; margin-left: 12px; }
  .cfj-pdp-price-note { font-size: 12px; color: #8B7355; margin-top: 6px; }
  .cfj-pdp-price-row { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-top: 8px; }
  .cfj-pdp-price-row span:last-child { font-weight: 600; color: #2C1810; }

  /* Purity Badge */
  .cfj-pdp-purity {
    display: flex; gap: 16px; margin-bottom: 24px;
  }
  .cfj-pdp-purity-badge {
    flex: 1; text-align: center; padding: 14px; border: 1px solid rgba(44,24,16,0.06);
    background: #fff;
  }
  .cfj-pdp-purity-badge strong { display: block; font-size: 16px; color: #2C1810; margin-bottom: 2px; }
  .cfj-pdp-purity-badge span { font-size: 11px; color: #8B7355; text-transform: uppercase; letter-spacing: 1px; }

  /* Size Selector */
  .cfj-pdp-size { margin-bottom: 24px; }
  .cfj-pdp-size-label { font-size: 13px; font-weight: 600; color: #2C1810; margin-bottom: 10px; display: flex; justify-content: space-between; }
  .cfj-pdp-size-label a { color: #D4AF37; font-size: 12px; }
  .cfj-pdp-sizes { display: flex; gap: 8px; flex-wrap: wrap; }
  .cfj-pdp-size-opt {
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(44,24,16,0.12); font-size: 13px; font-weight: 600; color: #404040;
    cursor: pointer; transition: all 0.2s; background: #fff;
  }
  .cfj-pdp-size-opt:hover, .cfj-pdp-size-opt.active { border-color: #D4AF37; color: #D4AF37; background: rgba(212,175,55,0.04); }

  /* CTAs */
  .cfj-pdp-ctas { display: flex; gap: 12px; margin-bottom: 24px; }
  .cfj-pdp-atc {
    flex: 1; padding: 16px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .cfj-pdp-atc.gold { background: linear-gradient(135deg, #D4AF37, #C5A028); color: #2C1810; }
  .cfj-pdp-atc.gold:hover { background: #F5D060; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.3); }
  .cfj-pdp-atc.dark { background: #2C1810; color: #FFFCF5; }
  .cfj-pdp-atc.dark:hover { background: #1a0f0a; transform: translateY(-2px); }
  .cfj-pdp-atc svg { width: 18px; height: 18px; }

  /* Delivery Check */
  .cfj-pdp-delivery {
    border: 1px solid rgba(44,24,16,0.06); padding: 16px 20px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .cfj-pdp-delivery svg { width: 20px; height: 20px; color: #D4AF37; flex-shrink: 0; }
  .cfj-pdp-delivery input {
    flex: 1; border: none; outline: none; font-family: inherit; font-size: 14px;
    color: #404040; background: transparent;
  }
  .cfj-pdp-delivery button {
    background: none; border: none; color: #D4AF37; font-weight: 700; font-size: 13px;
    cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
    font-family: 'DM Sans', sans-serif;
  }

  /* Assurance */
  .cfj-pdp-assurance {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;
  }
  .cfj-pdp-assure-item {
    text-align: center; padding: 16px 8px; border: 1px solid rgba(44,24,16,0.06); background: #fff;
  }
  .cfj-pdp-assure-item svg { width: 24px; height: 24px; color: #D4AF37; margin-bottom: 8px; }
  .cfj-pdp-assure-item span { display: block; font-size: 11px; font-weight: 600; color: #2C1810; line-height: 1.3; }

  /* Accordion */
  .cfj-pdp-accordion { border-top: 1px solid rgba(44,24,16,0.06); }
  .cfj-pdp-acc-item { border-bottom: 1px solid rgba(44,24,16,0.06); }
  .cfj-pdp-acc-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 0; cursor: pointer; font-size: 14px; font-weight: 600; color: #2C1810;
  }
  .cfj-pdp-acc-head svg { width: 18px; height: 18px; color: #8B7355; transition: transform 0.3s; }
  .cfj-pdp-acc-body { padding: 0 0 18px; font-size: 14px; color: #666; line-height: 1.8; display: none; }
  .cfj-pdp-acc-item.open .cfj-pdp-acc-body { display: block; }
  .cfj-pdp-acc-item.open .cfj-pdp-acc-head svg { transform: rotate(180deg); }

  /* ── Mobile Sticky CTA ── */
  .cfj-pdp-mobile-bar {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    background: #fff; border-top: 1px solid rgba(44,24,16,0.08);
    padding: 12px 16px; gap: 10px;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
  }
  .cfj-pdp-mobile-bar .cfj-pdp-atc { flex: 1; padding: 14px; font-size: 11px; }

  /* ── Footer (reuse) ── */
  .cfj-pdp-footer { background: #1a0f0a; color: rgba(255,252,245,0.7); margin-top: 60px; }
  .cfj-pdp-footer-inner {
    max-width: 1320px; margin: 0 auto; padding: 40px; display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px;
  }
  .cfj-pdp-footer h4 { font-size: 12px; font-weight: 700; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; font-family: 'DM Sans'; }
  .cfj-pdp-footer ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .cfj-pdp-footer li a { font-size: 13px; color: rgba(255,252,245,0.5); transition: color 0.2s; }
  .cfj-pdp-footer li a:hover { color: #D4AF37; }
  .cfj-pdp-footer-copy { text-align: center; padding: 20px 40px; border-top: 1px solid rgba(212,175,55,0.08); font-size: 12px; color: rgba(255,252,245,0.3); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cfj-pdp-main { grid-template-columns: 1fr; gap: 30px; padding: 0 16px 40px; }
    .cfj-pdp-gallery { position: static; }
    .cfj-pdp-bread { padding: 16px; }
    .cfj-pdp-mobile-bar { display: flex; }
    .cfj-pdp-ctas { display: none; }
    .cfj-pdp-footer-inner { grid-template-columns: 1fr 1fr; gap: 24px; padding: 30px 16px; }
  }
  @media (max-width: 600px) {
    .cfj-pdp-purity { flex-direction: column; gap: 8px; }
    .cfj-pdp-assurance { grid-template-columns: 1fr; }
    .cfj-pdp-footer-inner { grid-template-columns: 1fr; }
    .cfj-pdp-gallery-main { aspect-ratio: 4/3; }
    .cfj-pdp-thumb { width: 56px; height: 56px; }
  }
{% endstyle %}

<div class="cfj-pdp">
  <!-- Breadcrumb -->
  <div class="cfj-pdp-bread">
    <a href="/">Home</a><span>›</span>
    <a href="{{ collection.url | default: '/collections/all' }}">{{ collection.title | default: 'Jewellery' }}</a><span>›</span>
    {{ product.title | default: 'Diamond Ring' | truncate: 40 }}
  </div>

  <!-- Main -->
  <div class="cfj-pdp-main">
    <!-- Gallery -->
    <div class="cfj-pdp-gallery">
      <div class="cfj-pdp-gallery-main">
        <button class="cfj-pdp-gallery-wish" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        {% if product.featured_image %}
          <img id="cfj-main-img" src="{{ product.featured_image | img_url: 'master' }}" alt="{{ product.title }}">
        {% else %}
          <img id="cfj-main-img" src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1.png" alt="Product">
        {% endif %}
      </div>
      <div class="cfj-pdp-thumbs">
        {% for image in product.images limit: 5 %}
          <div class="cfj-pdp-thumb" onclick="document.getElementById('cfj-main-img').src='{{ image | img_url: 'master' }}'">
            <img src="{{ image | img_url: '100x' }}" alt="Thumb">
          </div>
        {% else %}
          {% for i in (1..4) %}
          <div class="cfj-pdp-thumb">
            <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-{{ i }}.png" alt="Thumb">
          </div>
          {% endfor %}
        {% endfor %}
      </div>
    </div>

    <!-- Details -->
    <div class="cfj-pdp-details">
      <h1 class="cfj-pdp-title">{{ product.title | default: 'Sparkling Diamond Solitaire Ring' }}</h1>
      <p class="cfj-pdp-subtitle">{{ product.vendor | default: 'Tanishq' }} • {{ product.type | default: 'Gold Ring' }}</p>

      <div class="cfj-pdp-rating">
        <div class="cfj-pdp-stars">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <svg viewBox="0 0 24 24" class="empty"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <span class="cfj-pdp-reviews">4.2 (312 Reviews)</span>
      </div>

      <div class="cfj-pdp-price-block">
        <div>
          <span class="cfj-pdp-price">{{ product.price | money | default: '₹24,999' }}</span>
          {% if product.compare_at_price > product.price %}
            <span class="cfj-pdp-compare">{{ product.compare_at_price | money }}</span>
          {% endif %}
        </div>
        <p class="cfj-pdp-price-note">Inclusive of all taxes. EMI starts at ₹2,083/mo</p>
        <div class="cfj-pdp-price-row"><span>Metal Price</span><span>₹18,400</span></div>
        <div class="cfj-pdp-price-row"><span>Making Charges</span><span>₹4,200</span></div>
        <div class="cfj-pdp-price-row"><span>GST (3%)</span><span>₹678</span></div>
      </div>

      <div class="cfj-pdp-purity">
        <div class="cfj-pdp-purity-badge"><strong>18K</strong><span>Gold Purity</span></div>
        <div class="cfj-pdp-purity-badge"><strong>2.4g</strong><span>Net Weight</span></div>
        <div class="cfj-pdp-purity-badge"><strong>VVS1</strong><span>Diamond Clarity</span></div>
      </div>

      <div class="cfj-pdp-size">
        <div class="cfj-pdp-size-label"><span>Select Size</span><a href="#">Size Guide</a></div>
        <div class="cfj-pdp-sizes">
          {% for i in (5..14) %}
            <div class="cfj-pdp-size-opt {% if i == 7 %}active{% endif %}">{{ i }}</div>
          {% endfor %}
        </div>
      </div>

      <div class="cfj-pdp-ctas">
        <button class="cfj-pdp-atc gold" style="color:#2C1810 !important;-webkit-text-fill-color:#2C1810 !important;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Add to Cart
        </button>
        <button class="cfj-pdp-atc dark" style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">Buy Now</button>
      </div>

      <div class="cfj-pdp-delivery">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        <input type="text" placeholder="Enter pincode for delivery details">
        <button>CHECK</button>
      </div>

      <div class="cfj-pdp-assurance">
        <div class="cfj-pdp-assure-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Purity Guaranteed</span>
        </div>
        <div class="cfj-pdp-assure-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          <span>Lifetime Exchange</span>
        </div>
        <div class="cfj-pdp-assure-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <span>Certificate Included</span>
        </div>
      </div>

      <div class="cfj-pdp-accordion">
        <div class="cfj-pdp-acc-item open">
          <div class="cfj-pdp-acc-head" onclick="this.parentElement.classList.toggle('open')">
            Product Description
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div class="cfj-pdp-acc-body">
            {{ product.description | default: 'This exquisitely crafted piece features BIS Hallmarked gold with ethically sourced diamonds. The intricate design is perfect for both everyday wear and special occasions, reflecting the Tanishq legacy of craftsmanship and trust.' }}
          </div>
        </div>
        <div class="cfj-pdp-acc-item">
          <div class="cfj-pdp-acc-head" onclick="this.parentElement.classList.toggle('open')">
            Specifications
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div class="cfj-pdp-acc-body">Metal: 18K Yellow Gold • Weight: 2.4g • Diamond: 0.15ct, VVS1, F-G Color • Setting: Prong • BIS Hallmark: Yes • Certificate: IGI Certified</div>
        </div>
        <div class="cfj-pdp-acc-item">
          <div class="cfj-pdp-acc-head" onclick="this.parentElement.classList.toggle('open')">
            Shipping & Returns
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div class="cfj-pdp-acc-body">Free insured shipping on all orders. 15-day easy returns with full refund. Lifetime exchange at any Tanishq store. Free resizing within 30 days.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Sticky Bar -->
  <div class="cfj-pdp-mobile-bar">
    <button class="cfj-pdp-atc gold" style="color:#2C1810 !important;-webkit-text-fill-color:#2C1810 !important;">Add to Cart</button>
    <button class="cfj-pdp-atc dark" style="color:#FFFCF5 !important;-webkit-text-fill-color:#FFFCF5 !important;">Buy Now</button>
  </div>

  <!-- Footer -->
  <footer class="cfj-pdp-footer">
    <div class="cfj-pdp-footer-inner">
      <div><h4>Shop</h4><ul><li><a href="/collections/all">All Jewellery</a></li><li><a href="#">Rings</a></li><li><a href="#">Earrings</a></li><li><a href="#">Necklaces</a></li></ul></div>
      <div><h4>Help</h4><ul><li><a href="#">Track Order</a></li><li><a href="#">Returns</a></li><li><a href="#">Shipping</a></li><li><a href="#">FAQs</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Careers</a></li><li><a href="#">Store Locator</a></li><li><a href="#">Privacy</a></li></ul></div>
      <div><h4>Connect</h4><ul><li><a href="#">Facebook</a></li><li><a href="#">Instagram</a></li><li><a href="#">Twitter</a></li><li><a href="#">YouTube</a></li></ul></div>
    </div>
    <div class="cfj-pdp-footer-copy">&copy; {{ 'now' | date: '%Y' }} {{ shop.name | default: 'Tanishq' }}. All rights reserved. A TATA Product.</div>
  </footer>
</div>

{% schema %}
{
  "name": "Tanishq Product",
  "settings": [],
  "presets": [{ "name": "Tanishq Product" }]
}
{% endschema %}
`,
};
