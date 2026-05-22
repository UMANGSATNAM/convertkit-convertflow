export const TEMPLATE_HTMLS = {
  "electronics": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TECHVAULT | Electronics</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --bg: #09090b;
  --surface: #18181b;
  --surface-hover: #27272a;
  --border: #3f3f46;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --text: #f4f4f5;
  --muted: #a1a1aa;
  --accent: #22d3ee;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; -webkit-font-smoothing: antialiased; }
a { text-decoration: none; color: inherit; }

/* HEADER & MEGA MENU */
.header { display: flex; justify-content: space-between; align-items: center; padding: 0 40px; height: 80px; background: rgba(9, 9, 11, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 1000; }
.brand { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; letter-spacing: -1px; display: flex; align-items: center; gap: 8px; }
.brand span { color: var(--primary); }

.nav-links { display: flex; height: 100%; list-style: none; }
.nav-item { position: relative; display: flex; align-items: center; padding: 0 24px; font-size: 14px; font-weight: 600; color: var(--muted); transition: color 0.2s; cursor: pointer; height: 100%; }
.nav-item:hover, .nav-item.active { color: var(--text); }
.nav-item::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary); transform: scaleX(0); transition: transform 0.3s; }
.nav-item:hover::after, .nav-item.active::after { transform: scaleX(1); }

.mega-menu { position: absolute; top: 80px; left: 0; width: 100%; background: var(--surface); border-bottom: 1px solid var(--border); padding: 40px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
.nav-item:hover .mega-menu { opacity: 1; visibility: visible; transform: translateY(0); }
.mm-col h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
.mm-col ul { list-style: none; }
.mm-col li { margin-bottom: 12px; }
.mm-col a { font-size: 14px; color: var(--text); font-weight: 500; transition: color 0.2s; display: flex; align-items: center; gap: 8px; }
.mm-col a:hover { color: var(--primary); }
.mm-col a:hover::before { content: '>'; color: var(--primary); font-family: 'JetBrains Mono'; font-size: 12px; }

.header-actions { display: flex; gap: 20px; align-items: center; }
.search-bar { display: flex; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; width: 250px; }
.search-bar svg { width: 16px; height: 16px; fill: var(--muted); margin-right: 8px; }
.search-bar input { background: transparent; border: none; color: var(--text); outline: none; font-size: 13px; font-family: 'Inter', sans-serif; width: 100%; }
.cart-btn { position: relative; cursor: pointer; }
.cart-btn svg { width: 24px; height: 24px; stroke: var(--text); stroke-width: 2; fill: none; }
.cart-badge { position: absolute; top: -5px; right: -8px; background: var(--primary); color: #fff; font-size: 10px; font-weight: 700; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }

/* HERO */
.hero { height: 600px; position: relative; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(9,9,11,1) 0%, rgba(9,9,11,0.7) 50%, rgba(9,9,11,0) 100%); z-index: 2; }
.hero-content { position: relative; z-index: 3; padding: 0 80px; max-width: 800px; }
.hero-tag { display: inline-block; background: rgba(59, 130, 246, 0.2); color: var(--primary); border: 1px solid rgba(59, 130, 246, 0.4); padding: 6px 12px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 24px; }
.hero h1 { font-size: 64px; line-height: 1.1; font-weight: 800; letter-spacing: -2px; margin-bottom: 20px; }
.hero p { font-size: 18px; color: var(--muted); margin-bottom: 40px; max-width: 500px; }
.btn-primary { display: inline-flex; align-items: center; justify-content: center; background: var(--text); color: var(--bg); font-weight: 600; font-size: 14px; padding: 14px 32px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--muted); }

/* GRID CATEGORIES */
.categories { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 40px 80px; margin-top: -60px; position: relative; z-index: 10; }
.cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.cat-card:hover { border-color: var(--primary); transform: translateY(-5px); background: var(--surface-hover); }
.cat-info h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.cat-info p { font-size: 12px; color: var(--muted); }
.cat-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.cat-icon svg { width: 24px; height: 24px; stroke: var(--primary); stroke-width: 1.5; fill: none; }

/* PRODUCTS */
.products { padding: 60px 80px; }
.section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
.section-title { font-size: 28px; font-weight: 700; letter-spacing: -1px; }
.view-all { font-size: 14px; color: var(--primary); font-weight: 600; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.p-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: all 0.3s; position: relative; display: flex; flex-direction: column; }
.p-card:hover { border-color: var(--muted); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.p-badge { position: absolute; top: 12px; left: 12px; background: var(--primary); color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; z-index: 10; }
.p-img-box { height: 240px; background: #000; position: relative; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden; }
.p-img-box img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.4s; }
.p-card:hover .p-img-box img { transform: scale(1.05); }
.p-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.p-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.p-specs { font-size: 12px; color: var(--muted); margin-bottom: 20px; flex: 1; }
.p-specs ul { padding-left: 15px; margin-top: 8px; }
.p-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid var(--border); padding-top: 15px; }
.p-price { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.btn-add { background: var(--primary); color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-add:hover { background: var(--primary-hover); }

/* FEATURES BANNER */
.features { display: flex; margin: 40px 80px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
.feat-img { width: 50%; object-fit: cover; border-right: 1px solid var(--border); }
.feat-content { width: 50%; background: var(--surface); padding: 60px; display: flex; flex-direction: column; justify-content: center; }
.feat-content h2 { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 20px; }
.feat-content p { color: var(--muted); margin-bottom: 40px; line-height: 1.6; }
.f-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.f-item { display: flex; gap: 15px; }
.f-item svg { width: 24px; height: 24px; stroke: var(--accent); stroke-width: 2; fill: none; flex-shrink: 0; }
.f-item div h4 { font-size: 15px; margin-bottom: 4px; }
.f-item div p { font-size: 13px; color: var(--muted); margin: 0; }

/* FOOTER */
.footer { background: var(--surface); border-top: 1px solid var(--border); padding: 80px 80px 40px; margin-top: 80px; }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 60px; }
.foot-brand { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; margin-bottom: 15px; }
.foot-brand span { color: var(--primary); }
.foot-desc { font-size: 14px; color: var(--muted); line-height: 1.6; max-width: 300px; }
.foot-title { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; color: var(--text); }
.foot-links { list-style: none; }
.foot-links li { margin-bottom: 12px; }
.foot-links a { font-size: 14px; color: var(--muted); transition: color 0.2s; }
.foot-links a:hover { color: var(--text); }
.n-form { display: flex; margin-top: 20px; }
.n-form input { flex: 1; background: var(--bg); border: 1px solid var(--border); padding: 12px 16px; border-radius: 6px 0 0 6px; color: var(--text); font-family: 'Inter', sans-serif; outline: none; }
.n-form button { background: var(--primary); color: #fff; border: none; padding: 0 20px; border-radius: 0 6px 6px 0; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.n-form button:hover { background: var(--primary-hover); }
.foot-bottom { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 30px; font-size: 13px; color: var(--muted); }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .categories { grid-template-columns: repeat(2, 1fr); margin-top: 40px; padding: 0 40px; }
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-content { padding: 0 40px; }
  .products { padding: 60px 40px; }
  .features { margin: 40px; flex-direction: column; }
  .feat-img, .feat-content { width: 100%; }
  .feat-img { height: 300px; border-right: none; border-bottom: 1px solid var(--border); }
  .foot-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media(max-width: 768px) {
  .nav-links, .search-bar { display: none; }
  .hero h1 { font-size: 48px; }
  .categories { grid-template-columns: 1fr; }
  .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
  .foot-grid { grid-template-columns: 1fr; }
  .foot-bottom { flex-direction: column; gap: 15px; text-align: center; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">TECH<span>VAULT</span></div>
  
  <ul class="nav-links">
    <li class="nav-item active">
      Computers
      <div class="mega-menu">
        <div class="mm-col">
          <h4>Laptops</h4>
          <ul>
            <li><a href="#">Gaming Laptops</a></li>
            <li><a href="#">Ultrabooks</a></li>
            <li><a href="#">Creator Series</a></li>
            <li><a href="#">Business</a></li>
          </ul>
        </div>
        <div class="mm-col">
          <h4>Desktops</h4>
          <ul>
            <li><a href="#">Gaming PCs</a></li>
            <li><a href="#">Workstations</a></li>
            <li><a href="#">All-in-Ones</a></li>
            <li><a href="#">Mini PCs</a></li>
          </ul>
        </div>
        <div class="mm-col">
          <h4>Components</h4>
          <ul>
            <li><a href="#">Processors</a></li>
            <li><a href="#">Graphics Cards</a></li>
            <li><a href="#">Motherboards</a></li>
            <li><a href="#">Memory (RAM)</a></li>
          </ul>
        </div>
        <div class="mm-col">
          <h4>Peripherals</h4>
          <ul>
            <li><a href="#">Monitors</a></li>
            <li><a href="#">Keyboards</a></li>
            <li><a href="#">Mice</a></li>
            <li><a href="#">Headsets</a></li>
          </ul>
        </div>
      </div>
    </li>
    <li class="nav-item">Smartphones</li>
    <li class="nav-item">Audio</li>
    <li class="nav-item">Photography</li>
    <li class="nav-item">Gaming</li>
  </ul>
  
  <div class="header-actions">
    <div class="search-bar">
      <svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input type="text" placeholder="Search products, brands, models...">
    </div>
    <div class="cart-btn">
      <svg viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.29 5.17c-.22.5.14 1.08.68 1.08H19M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
      <div class="cart-badge">3</div>
    </div>
  </div>
</header>

<section class="hero">
  <img src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=2000&q=80" alt="Tech Hero" class="skeleton hero-bg" onload="this.classList.remove(\'skeleton\')">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-tag">Nvidia RTX 50 Series</div>
    <h1>Unleash Ultimate<br>Performance.</h1>
    <p>Experience the next generation of computing with our curated selection of high-performance laptops and components.</p>
    <button class="btn-primary">Shop The Drop</button>
  </div>
</section>

<div class="categories">
  <div class="cat-card">
    <div class="cat-info">
      <h3>Computers</h3>
      <p>Laptops, Desktops, Parts</p>
    </div>
    <div class="cat-icon">
      <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    </div>
  </div>
  <div class="cat-card">
    <div class="cat-info">
      <h3>Audio</h3>
      <p>Headphones, Speakers</p>
    </div>
    <div class="cat-icon">
      <svg viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    </div>
  </div>
  <div class="cat-card">
    <div class="cat-info">
      <h3>Smart Home</h3>
      <p>Cameras, Hubs, Lighting</p>
    </div>
    <div class="cat-icon">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>
  </div>
  <div class="cat-card">
    <div class="cat-info">
      <h3>Wearables</h3>
      <p>Smartwatches, Fitness</p>
    </div>
    <div class="cat-icon">
      <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="4" ry="4"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    </div>
  </div>
</div>

<section class="products">
  <div class="section-header">
    <h2 class="section-title">Trending Tech</h2>
    <a href="#" class="view-all">View All Products &rarr;</a>
  </div>
  
  <div class="p-grid">
    <div class="p-card">
      <div class="p-badge">New</div>
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" alt="Headphones" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-content">
        <h3 class="p-title">Sony WH-1000XM5 Wireless Noise Canceling Headphones</h3>
        <div class="p-specs">
          <ul>
            <li>Industry Leading ANC</li>
            <li>30 Hour Battery Life</li>
            <li>Multipoint Connection</li>
          </ul>
        </div>
        <div class="p-bottom">
          <div class="p-price">$398.00</div>
          <button class="btn-add">Add to Cart</button>
        </div>
      </div>
    </div>
    
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80" alt="Smart Glasses" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-content">
        <h3 class="p-title">Ray-Ban Meta Smart Glasses - Wayfarer</h3>
        <div class="p-specs">
          <ul>
            <li>12MP Ultra-wide Camera</li>
            <li>Open-ear Audio</li>
            <li>Meta AI Integration</li>
          </ul>
        </div>
        <div class="p-bottom">
          <div class="p-price">$299.00</div>
          <button class="btn-add">Add to Cart</button>
        </div>
      </div>
    </div>
    
    <div class="p-card">
      <div class="p-badge">Bestseller</div>
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80" alt="Laptop" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-content">
        <h3 class="p-title">Dell XPS 15 (2025) Creator Edition</h3>
        <div class="p-specs">
          <ul>
            <li>Intel Core Ultra 9</li>
            <li>3.5K OLED Touch Display</li>
            <li>NVIDIA RTX 4070</li>
          </ul>
        </div>
        <div class="p-bottom">
          <div class="p-price">$2,499.00</div>
          <button class="btn-add">Add to Cart</button>
        </div>
      </div>
    </div>
    
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80" alt="Smartwatch" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-content">
        <h3 class="p-title">Garmin Fenix 8 Pro Sapphire Solar</h3>
        <div class="p-specs">
          <ul>
            <li>Solar Charging Lens</li>
            <li>Built-in LED Flashlight</li>
            <li>Advanced Training Metrics</li>
          </ul>
        </div>
        <div class="p-bottom">
          <div class="p-price">$899.99</div>
          <button class="btn-add">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="features">
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80" alt="Processor" class="skeleton feat-img" onload="this.classList.remove(\'skeleton\')">
  <div class="feat-content">
    <h2>Build your dream rig.</h2>
    <p>From custom water-cooled beasts to sleek SFF workstations, our PC Builder tool ensures 100% component compatibility and optimal thermal performance.</p>
    <div class="f-grid">
      <div class="f-item">
        <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <div>
          <h4>Compatibility Engine</h4>
          <p>Real-time checks for clearance, power draw, and socket matching.</p>
        </div>
      </div>
      <div class="f-item">
        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <div>
          <h4>Professional Assembly</h4>
          <p>Opt for our white-glove assembly service with cable management.</p>
        </div>
      </div>
      <div class="f-item">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <div>
          <h4>Extended Warranty</h4>
          <p>3-year comprehensive warranty on all custom built systems.</p>
        </div>
      </div>
      <div class="f-item">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div>
          <h4>Express Shipping</h4>
          <p>Next-day delivery available on all pre-built configurations.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="foot-grid">
    <div>
      <div class="foot-brand">TECH<span>VAULT</span></div>
      <p class="foot-desc">The ultimate destination for premium electronics, pc components, and smart home technology.</p>
    </div>
    <div>
      <h4 class="foot-title">Categories</h4>
      <ul class="foot-links">
        <li><a href="#">PC Components</a></li>
        <li><a href="#">Laptops & Tablets</a></li>
        <li><a href="#">Audio & Home Theater</a></li>
        <li><a href="#">Smart Home</a></li>
      </ul>
    </div>
    <div>
      <h4 class="foot-title">Customer Service</h4>
      <ul class="foot-links">
        <li><a href="#">Order Status</a></li>
        <li><a href="#">Returns & Exchanges</a></li>
        <li><a href="#">Tech Support</a></li>
        <li><a href="#">Financing</a></li>
      </ul>
    </div>
    <div>
      <h4 class="foot-title">Stay Updated</h4>
      <p class="foot-desc" style="margin-bottom: 15px;">Subscribe for hardware news, drop alerts, and exclusive deals.</p>
      <div class="n-form">
        <input type="email" placeholder="Enter email address">
        <button>Subscribe</button>
      </div>
    </div>
  </div>
  <div class="foot-bottom">
    <div>&copy; 2026 TECHVAULT ELECTRONICS. ALL RIGHTS RESERVED.</div>
    <div style="display: flex; gap: 20px;">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Accessibility</a>
    </div>
  </div>
</footer>

</body>
</html>`,
  "home-decor": `
<div style="background:#FAF9F6; color:#2C2C2C; min-height:100vh; font-family:'Lato', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#2C2C2C; color:#FFFFFF; text-align:center; padding:10px; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">
    Complimentary shipping on orders over $150
  </div>

  <!-- Header -->
  <div style="padding:32px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; box-shadow:0 10px 30px rgba(0,0,0,0.02);">
    <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:600; letter-spacing:2px;">CASA & CO</div>
    <div style="display:flex; gap:32px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#5A5A5A;">
      <span style="color:#B8860B;">Shop</span>
      <span>Collections</span>
      <span>Journal</span>
      <span>About</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:flex; align-items:center; min-height:80vh; background:#FAF9F6;">
    <div style="width:60%; padding:0 80px; position:relative; z-index:2;">
      <div style="background:#FFFFFF; padding:60px; box-shadow:0 30px 60px rgba(0,0,0,0.05);">
        <div style="font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#B8860B; margin-bottom:24px;">NEW ARRIVALS</div>
        <div style="font-family:'Playfair Display', serif; font-size:64px; font-weight:400; line-height:1.1; margin-bottom:24px;">Artistry in Every Detail</div>
        <div style="font-size:16px; font-weight:300; color:#5A5A5A; line-height:1.8; margin-bottom:40px;">Curate a space that reflects your unique style with our handcrafted home accents.</div>
        <div style="display:inline-block; background:#2C2C2C; color:#FFFFFF; font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:18px 40px;">SHOP THE COLLECTION</div>
      </div>
    </div>
    <div style="position:absolute; top:0; right:0; width:50%; height:100%; z-index:1;">
      <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80" style="width:100%; height:100%; object-fit:cover;">
    </div>
  </div>

  <!-- Categories -->
  <div style="padding:120px 40px; background:#FAF9F6; text-align:center;">
    <div style="font-family:'Playfair Display', serif; font-size:48px; font-weight:400; margin-bottom:80px;">Shop by Category</div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px; max-width:1440px; margin:0 auto;">
      <div>
        <div style="position:relative; padding-bottom:120%; border-radius:200px 200px 0 0; overflow:hidden; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Lighting</div>
      </div>
      <div>
        <div style="position:relative; padding-bottom:120%; border-radius:200px 200px 0 0; overflow:hidden; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Textiles</div>
      </div>
      <div>
        <div style="position:relative; padding-bottom:120%; border-radius:200px 200px 0 0; overflow:hidden; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Vases & Objects</div>
      </div>
      <div>
        <div style="position:relative; padding-bottom:120%; border-radius:200px 200px 0 0; overflow:hidden; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Wall Art</div>
      </div>
    </div>
  </div>

  <!-- Featured Collection -->
  <div style="padding:120px 40px; background:#FFFFFF;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <div style="font-family:'Playfair Display', serif; font-size:48px; font-weight:400;">Curator's Picks</div>
        <div style="font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase; border-bottom:1px solid #2C2C2C; padding-bottom:4px;">VIEW ALL</div>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:125%; background:#F5F5F5; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Playfair Display', serif; font-size:18px; margin-bottom:8px;">Aura Ceramic Vase</div>
          <div style="font-size:14px; color:#5A5A5A;">$85.00</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:125%; background:#F5F5F5; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Playfair Display', serif; font-size:18px; margin-bottom:8px;">Lumina Table Lamp</div>
          <div style="font-size:14px; color:#5A5A5A;">$145.00</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:125%; background:#F5F5F5; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Playfair Display', serif; font-size:18px; margin-bottom:8px;">Woven Linen Throw</div>
          <div style="font-size:14px; color:#5A5A5A;">$95.00</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:125%; background:#F5F5F5; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Playfair Display', serif; font-size:18px; margin-bottom:8px;">Abstract Wall Art</div>
          <div style="font-size:14px; color:#5A5A5A;">$210.00</div>
        </div>
      </div>
    </div>
  </div>

</div>
`,
  "pet-supplies": `
<div style="background:#FFF9E6; color:#333333; min-height:100vh; font-family:'Quicksand', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#FF6B6B; color:#FFFFFF; text-align:center; padding:12px; font-size:14px; font-weight:800; font-family:'Nunito', sans-serif; letter-spacing:1px; text-transform:uppercase;">
    🐾 FREE shipping on orders over $50! 🐾
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-bottom:4px solid #FFEDD5;">
    <div style="font-family:'Nunito', sans-serif; font-size:28px; font-weight:900; color:#FF6B6B; letter-spacing:1px;">PAWS & PLAY</div>
    <div style="display:flex; gap:32px; font-size:16px; font-weight:700; font-family:'Nunito', sans-serif; color:#555555;">
      <span style="color:#FF6B6B;">Dogs</span>
      <span>Cats</span>
      <span>Small Pets</span>
      <span>Toys</span>
      <span>Treats</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:flex; align-items:center; min-height:80vh; background:#FFF9E6; overflow:hidden;">
    <div style="width:50%; padding:0 80px; position:relative; z-index:2;">
      <div style="display:inline-flex; align-items:center; gap:8px; background:#FFEDD5; color:#EA580C; font-family:'Nunito', sans-serif; font-size:14px; font-weight:800; padding:8px 20px; border-radius:30px; text-transform:uppercase; letter-spacing:1px; margin-bottom:24px;">
        🦴 SPOIL YOUR FURRY FRIENDS
      </div>
      <div style="font-family:'Nunito', sans-serif; font-size:72px; font-weight:900; line-height:1.1; margin-bottom:24px;">Only the Best for Your Best Friend.</div>
      <div style="font-size:20px; font-weight:500; color:#555555; line-height:1.6; margin-bottom:40px;">Premium toys, organic treats, and cozy beds designed for happy, healthy pets.</div>
      <div style="display:inline-block; background:#FF6B6B; color:#FFFFFF; font-family:'Nunito', sans-serif; font-size:18px; font-weight:800; padding:18px 48px; border-radius:50px; box-shadow:0 10px 20px rgba(255,107,107,0.3);">SHOP NOW</div>
    </div>
    <div style="width:50%; position:relative; z-index:1; display:flex; justify-content:center; align-items:center;">
      <div style="position:absolute; width:600px; height:600px; background:#FFD166; border-radius:40% 60% 70% 30% / 40% 50% 60% 50%; z-index:1;"></div>
      <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80" style="position:relative; z-index:2; width:500px; height:500px; object-fit:cover; border-radius:30px; border:8px solid #FFFFFF; box-shadow:0 20px 40px rgba(0,0,0,0.1); transform:rotate(3deg);">
    </div>
  </div>

  <!-- Categories -->
  <div style="padding:100px 40px; background:#FFFFFF; text-align:center;">
    <div style="font-family:'Nunito', sans-serif; font-size:48px; font-weight:900; margin-bottom:16px;">Shop by Pet</div>
    <div style="width:60px; height:6px; background:#FF6B6B; border-radius:3px; margin:0 auto 80px auto;"></div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px; max-width:1440px; margin:0 auto;">
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1552728089-571ebd49e5d4?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">For Dogs</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">For Cats</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">Small Pets</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">For Birds</div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div style="padding:100px 40px; background:#FF6B6B; text-align:center;">
    <div style="font-family:'Nunito', sans-serif; font-size:48px; font-weight:900; color:#FFFFFF; margin-bottom:80px;">Why Pet Parents Love Us</div>
    
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:30px; max-width:1440px; margin:0 auto;">
      <div style="background:#FFFFFF; padding:40px; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#FFF9E6; display:flex; align-items:center; justify-content:center; margin:0 auto 24px auto; font-size:40px;">🩺</div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; margin-bottom:16px;">Vet Approved</div>
        <div style="font-size:16px; font-weight:500; color:#555555; line-height:1.6;">All products are tested and approved by certified veterinarians.</div>
      </div>
      <div style="background:#FFFFFF; padding:40px; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#FFF9E6; display:flex; align-items:center; justify-content:center; margin:0 auto 24px auto; font-size:40px;">🌿</div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; margin-bottom:16px;">Organic Ingredients</div>
        <div style="font-size:16px; font-weight:500; color:#555555; line-height:1.6;">Natural, healthy treats with no artificial additives.</div>
      </div>
      <div style="background:#FFFFFF; padding:40px; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#FFF9E6; display:flex; align-items:center; justify-content:center; margin:0 auto 24px auto; font-size:40px;">🚚</div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; margin-bottom:16px;">Fast Delivery</div>
        <div style="font-size:16px; font-weight:500; color:#555555; line-height:1.6;">Same-day dispatch because your pet can't wait!</div>
      </div>
    </div>
  </div>

</div>
`,
  "luxury-watches": `
<div style="background:#0A0A0A; color:#FFFFFF; min-height:100vh; font-family:'Montserrat', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#000000; color:#D4AF37; text-align:center; padding:10px; font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase; border-bottom:1px solid rgba(212,175,55,0.2);">
    Complimentary Worldwide Insured Shipping
  </div>

  <!-- Header -->
  <div style="padding:32px 40px; display:flex; justify-content:space-between; align-items:center; background:#0A0A0A; border-bottom:1px solid rgba(255,255,255,0.05);">
    <div style="font-family:'Cinzel', serif; font-size:24px; font-weight:400; letter-spacing:4px; color:#FFFFFF;">AURELIUS</div>
    <div style="display:flex; gap:32px; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:2px; color:#AAAAAA;">
      <span style="color:#D4AF37;">Timepieces</span>
      <span>Heritage</span>
      <span>Boutiques</span>
      <span>Services</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:flex; align-items:center; min-height:85vh; overflow:hidden;">
    <div style="position:absolute; inset:0; z-index:1;">
      <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=2000&q=80" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.6);">
      <div style="position:absolute; inset:0; background:linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 100%);"></div>
    </div>
    
    <div style="max-width:1440px; margin:0 auto; width:100%; padding:0 40px; position:relative; z-index:2;">
      <div style="max-width:700px;">
        <div style="display:inline-block; font-size:12px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:24px; position:relative; padding-left:40px;">
          <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:24px; height:1px; background:#D4AF37;"></span>
          THE NEW COLLECTION
        </div>
        <div style="font-family:'Cinzel', serif; font-size:72px; font-weight:400; line-height:1.1; margin-bottom:32px; letter-spacing:2px;">Mastery of Time.</div>
        <div style="font-size:16px; font-weight:300; line-height:1.8; color:#CCCCCC; margin-bottom:48px; letter-spacing:0.5px;">Precision engineering meets timeless elegance. Discover timepieces forged for eternity.</div>
        <div style="display:inline-block; font-size:12px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:#0A0A0A; background:#D4AF37; padding:20px 48px; border:1px solid #D4AF37;">EXPLORE THE COLLECTION</div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:120px 24px; border-top:1px solid rgba(255,255,255,0.05); background:#0A0A0A;">
    <div style="text-align:center; margin-bottom:80px;">
      <div style="font-family:'Cinzel', serif; font-size:48px; font-weight:400; margin-bottom:16px; letter-spacing:2px;">Exceptional Timepieces</div>
      <div style="font-size:14px; font-weight:300; color:#888888; letter-spacing:1px;">Curated selections from our master horologists.</div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:2px; background:rgba(255,255,255,0.05); max-width:1440px; margin:0 auto;">
      <div style="background:#0A0A0A; padding:60px 40px; text-align:center;">
        <div style="position:relative; padding-bottom:120%; margin-bottom:40px;">
          <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
        </div>
        <div style="font-size:10px; font-weight:600; letter-spacing:3px; color:#D4AF37; margin-bottom:12px;">AUTOMATIC</div>
        <div style="font-family:'Cinzel', serif; font-size:20px; font-weight:400; margin-bottom:16px; letter-spacing:1px;">The Vanguard</div>
        <div style="font-size:14px; font-weight:300; color:#888888;">$4,500</div>
      </div>
      <div style="background:#0A0A0A; padding:60px 40px; text-align:center;">
        <div style="position:relative; padding-bottom:120%; margin-bottom:40px;">
          <img src="https://images.unsplash.com/photo-1548169874-53ce86f05359?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
        </div>
        <div style="font-size:10px; font-weight:600; letter-spacing:3px; color:#D4AF37; margin-bottom:12px;">CHRONOGRAPH</div>
        <div style="font-family:'Cinzel', serif; font-size:20px; font-weight:400; margin-bottom:16px; letter-spacing:1px;">Apex Chrono</div>
        <div style="font-size:14px; font-weight:300; color:#888888;">$6,200</div>
      </div>
      <div style="background:#0A0A0A; padding:60px 40px; text-align:center;">
        <div style="position:relative; padding-bottom:120%; margin-bottom:40px;">
          <img src="https://images.unsplash.com/photo-1587836374828-cb4387860965?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
        </div>
        <div style="font-size:10px; font-weight:600; letter-spacing:3px; color:#D4AF37; margin-bottom:12px;">TOURBILLON</div>
        <div style="font-family:'Cinzel', serif; font-size:20px; font-weight:400; margin-bottom:16px; letter-spacing:1px;">Stellar Infinite</div>
        <div style="font-size:14px; font-weight:300; color:#888888;">$12,800</div>
      </div>
    </div>
  </div>

  <!-- Details -->
  <div style="background:#000000; padding:120px 24px; border-top:1px solid rgba(212,175,55,0.15); border-bottom:1px solid rgba(212,175,55,0.15);">
    <div style="max-width:1440px; margin:0 auto; text-align:center;">
      <div style="margin-bottom:80px;">
        <div style="display:inline-block; width:1px; height:60px; background:linear-gradient(to bottom, rgba(212,175,55,0), rgba(212,175,55,1)); margin-bottom:24px;"></div>
        <div style="font-family:'Cinzel', serif; font-size:48px; font-weight:400; letter-spacing:2px;">The Art of Movement</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:60px;">
        <div>
          <div style="font-family:'Cinzel', serif; font-size:32px; color:#D4AF37; margin-bottom:24px; opacity:0.8;">I</div>
          <div style="font-size:16px; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;">Tourbillon Movement</div>
          <div style="font-size:14px; font-weight:300; line-height:1.8; color:#888888; margin:0 auto; max-width:300px;">Counteracting the effects of gravity for unparalleled accuracy.</div>
        </div>
        <div>
          <div style="font-family:'Cinzel', serif; font-size:32px; color:#D4AF37; margin-bottom:24px; opacity:0.8;">II</div>
          <div style="font-size:16px; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;">Sapphire Crystal</div>
          <div style="font-size:14px; font-weight:300; line-height:1.8; color:#888888; margin:0 auto; max-width:300px;">Virtually scratch-proof and treated with anti-reflective coating.</div>
        </div>
        <div>
          <div style="font-family:'Cinzel', serif; font-size:32px; color:#D4AF37; margin-bottom:24px; opacity:0.8;">III</div>
          <div style="font-size:16px; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;">18K Rose Gold</div>
          <div style="font-size:14px; font-weight:300; line-height:1.8; color:#888888; margin:0 auto; max-width:300px;">Forged in our own foundry for an unmistakable, lasting glow.</div>
        </div>
      </div>
    </div>
  </div>

</div>
`,
  "outdoor-gear": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TERRALINE | Technical Outdoor Gear</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --forest: #1C2B1C;
  --stone: #4A4A3A;
  --lime: #B8E04A;
  --khaki: #E8E0C8;
  --white: #F8F8F8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Barlow', sans-serif; background: var(--white); color: var(--stone); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
h1, h2, h3, h4, .display-font { font-family: 'Bebas Neue', cursive; letter-spacing: 2px; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: var(--forest); color: var(--white); position: sticky; top: 0; z-index: 100; border-bottom: 4px solid var(--lime); }
.brand { font-family: 'Bebas Neue', cursive; font-size: 32px; letter-spacing: 4px; display: flex; align-items: center; gap: 8px; }
.brand svg { width: 32px; height: 32px; fill: var(--lime); }
.nav-links { display: flex; gap: 30px; list-style: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; }
.nav-links li:hover { color: var(--lime); cursor: pointer; }
.header-actions { display: flex; gap: 20px; }
.header-actions svg { width: 20px; height: 20px; fill: var(--white); cursor: pointer; }
.header-actions svg:hover { fill: var(--lime); }

/* HERO */
.hero { height: 90vh; position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding: 60px 40px; background: url('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80') center/cover; }
.hero::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(28,43,28,0.9) 0%, rgba(28,43,28,0.2) 100%); z-index: 1; }
.hero-content { position: relative; z-index: 2; max-width: 800px; color: var(--white); }
.hero-tag { display: inline-block; background: var(--lime); color: var(--forest); font-weight: 800; text-transform: uppercase; padding: 4px 12px; font-size: 14px; margin-bottom: 20px; border-radius: 2px; }
.hero h1 { font-size: 96px; line-height: 0.9; margin-bottom: 20px; text-transform: uppercase; }
.hero p { font-size: 20px; font-weight: 500; margin-bottom: 40px; max-width: 600px; }
.btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--lime); color: var(--forest); font-family: 'Bebas Neue', cursive; font-size: 24px; padding: 16px 40px; border: none; cursor: pointer; transition: transform 0.2s, background 0.2s; clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%); }
.btn-primary:hover { transform: translateX(5px); background: #fff; }

/* ACTIVITIES */
.activities { padding: 40px; background: var(--khaki); display: flex; gap: 20px; overflow-x: auto; scrollbar-width: none; }
.activities::-webkit-scrollbar { display: none; }
.activity-pill { flex: 0 0 auto; background: #fff; color: var(--forest); padding: 12px 30px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; border: 2px solid var(--forest); cursor: pointer; transition: all 0.2s; }
.activity-pill:hover, .activity-pill.active { background: var(--forest); color: var(--white); }

/* PRODUCTS */
.products { padding: 100px 40px; }
.section-title { font-size: 64px; color: var(--forest); margin-bottom: 60px; border-bottom: 4px solid var(--forest); padding-bottom: 10px; display: inline-block; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.p-card { background: #fff; border: 1px solid #ddd; position: relative; transition: border-color 0.3s; }
.p-card:hover { border-color: var(--forest); }
.p-img-box { position: relative; height: 350px; background: var(--khaki); overflow: hidden; }
.p-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; mix-blend-mode: multiply; }
.p-card:hover .p-img-box img { transform: scale(1.05); }
.p-specs-overlay { position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px; }
.spec-badge { background: rgba(28,43,28,0.8); color: var(--white); font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; backdrop-filter: blur(4px); }
.p-info { padding: 20px; border-top: 1px solid #ddd; }
.p-category { font-size: 12px; font-weight: 700; color: var(--stone); text-transform: uppercase; margin-bottom: 8px; }
.p-title { font-family: 'Bebas Neue', cursive; font-size: 28px; color: var(--forest); margin-bottom: 10px; line-height: 1.1; }
.p-price { font-size: 20px; font-weight: 700; color: var(--forest); margin-bottom: 20px; }
.btn-outline { width: 100%; background: transparent; border: 2px solid var(--forest); color: var(--forest); font-family: 'Bebas Neue', cursive; font-size: 20px; padding: 10px; cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--forest); color: var(--lime); }

/* TECH SPECS BANNER */
.tech-banner { display: flex; background: var(--forest); color: var(--white); border-top: 10px solid var(--lime); }
.tb-img { width: 50%; object-fit: cover; }
.tb-content { width: 50%; padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; }
.tb-content h2 { font-size: 64px; color: var(--lime); margin-bottom: 40px; }
.tb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.tb-item h3 { font-size: 24px; margin-bottom: 10px; }
.tb-item p { color: #ccc; font-size: 15px; line-height: 1.5; }

/* REVIEWS */
.reviews { padding: 100px 40px; background: var(--khaki); }
.r-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.r-card { background: var(--white); padding: 40px; border-left: 8px solid var(--lime); }
.r-stars { color: var(--forest); font-size: 20px; margin-bottom: 20px; letter-spacing: 2px; }
.r-text { font-size: 18px; font-weight: 600; line-height: 1.6; margin-bottom: 20px; color: var(--forest); }
.r-author { font-size: 14px; font-weight: 700; text-transform: uppercase; color: var(--stone); display: flex; align-items: center; gap: 10px; }
.r-author img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--forest); }

/* WARRANTY */
.warranty { text-align: center; padding: 80px 40px; background: var(--stone); color: var(--white); }
.warranty svg { width: 64px; height: 64px; fill: var(--lime); margin-bottom: 20px; }
.warranty h2 { font-size: 48px; margin-bottom: 20px; }
.warranty p { font-size: 18px; max-width: 600px; margin: 0 auto; color: #ddd; }

/* FOOTER */
.footer { background: var(--forest); color: var(--white); padding: 80px 40px 40px; }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
.f-brand { font-family: 'Bebas Neue', cursive; font-size: 48px; color: var(--lime); margin-bottom: 20px; display: inline-block; }
.f-desc { color: #aaa; font-weight: 500; max-width: 300px; line-height: 1.6; }
.f-title { font-family: 'Bebas Neue', cursive; font-size: 24px; margin-bottom: 20px; color: #fff; letter-spacing: 1px; }
.f-links { list-style: none; }
.f-links li { margin-bottom: 12px; }
.f-links a { color: #aaa; font-weight: 500; font-size: 15px; transition: color 0.2s; }
.f-links a:hover { color: var(--lime); }
.f-bottom { display: flex; justify-content: space-between; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 14px; font-weight: 600; text-transform: uppercase; }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .tb-grid { grid-template-columns: 1fr; }
}
@media(max-width: 900px) {
  .hero h1 { font-size: 64px; }
  .tech-banner { flex-direction: column; }
  .tb-img, .tb-content { width: 100%; }
  .tb-img { height: 400px; }
  .r-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 600px) {
  .nav-links { display: none; }
  .hero h1 { font-size: 48px; }
  .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
  .f-bottom { flex-direction: column; text-align: center; gap: 20px; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">
    <svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.83L19.5 19h-15L12 5.83zM12 10l-4 6h8l-4-6z"/></svg>
    TERRALINE
  </div>
  <ul class="nav-links">
    <li>Men</li>
    <li>Women</li>
    <li>Equipment</li>
    <li>Innovation</li>
    <li>Journal</li>
  </ul>
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <span class="hero-tag">New Arrivals FW26</span>
    <h1>Defy The Elements.<br>Master The Ascent.</h1>
    <p>Engineered for the extremes. Our new Alpha Series uses proprietary Gore-Tex PRO laminates to deliver unparalleled weather protection.</p>
    <button class="btn-primary">Shop Alpha Series <span>&rarr;</span></button>
  </div>
</section>

<div class="activities">
  <div class="activity-pill active">Alpinism</div>
  <div class="activity-pill">Rock Climbing</div>
  <div class="activity-pill">Trail Running</div>
  <div class="activity-pill">Ski & Snowboard</div>
  <div class="activity-pill">Hiking</div>
  <div class="activity-pill">Everyday</div>
</div>

<section class="products">
  <h2 class="section-title">Technical Equipment</h2>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-specs-overlay">
          <span class="spec-badge">Gore-Tex PRO</span>
          <span class="spec-badge">310g</span>
        </div>
        <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80" alt="Jacket" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-info">
        <div class="p-category">Men's Hardshell</div>
        <h3 class="p-title">Alpha SV Jacket</h3>
        <div class="p-price">$799.00</div>
        <button class="btn-outline">Add to Cart</button>
      </div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-specs-overlay">
          <span class="spec-badge">Vibram Megagrip</span>
        </div>
        <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80" alt="Boots" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-info">
        <div class="p-category">Footwear</div>
        <h3 class="p-title">Aerios FL Mid GTX</h3>
        <div class="p-price">$190.00</div>
        <button class="btn-outline">Add to Cart</button>
      </div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-specs-overlay">
          <span class="spec-badge">-20&deg;C Rating</span>
          <span class="spec-badge">850 Down</span>
        </div>
        <img src="https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&w=600&q=80" alt="Sleeping Bag" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-info">
        <div class="p-category">Equipment</div>
        <h3 class="p-title">Cerium LT Sleeping Bag</h3>
        <div class="p-price">$550.00</div>
        <button class="btn-outline">Add to Cart</button>
      </div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-specs-overlay">
          <span class="spec-badge">45L Capacity</span>
          <span class="spec-badge">Waterproof</span>
        </div>
        <img src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=600&q=80" alt="Backpack" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <div class="p-info">
        <div class="p-category">Packs</div>
        <h3 class="p-title">Bora AR 50 Backpack</h3>
        <div class="p-price">$350.00</div>
        <button class="btn-outline">Add to Cart</button>
      </div>
    </div>
  </div>
</section>

<section class="tech-banner">
  <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80" alt="Climbing" class="skeleton tb-img" onload="this.classList.remove(\'skeleton\')">
  <div class="tb-content">
    <h2>Material Innovation</h2>
    <div class="tb-grid">
      <div class="tb-item">
        <h3>N100p-X 3L GORE-TEX Pro</h3>
        <p>Our most durable face fabric. Highly abrasion resistant and breathable, designed for severe alpine conditions.</p>
      </div>
      <div class="tb-item">
        <h3>WaterTight&trade; Zippers</h3>
        <p>Highly water resistant polyurethane coated zippers with RS&trade; zipper sliders that self-seal when fully closed.</p>
      </div>
      <div class="tb-item">
        <h3>Coreloft&trade; Insulation</h3>
        <p>Synthetic insulation that retains warmth even when wet, strategically placed in areas prone to moisture.</p>
      </div>
      <div class="tb-item">
        <h3>Micro-Seam Allowance</h3>
        <p>Reduced 1.6 mm micro-seam allowance reduces bulk and weight while maintaining complete waterproofness.</p>
      </div>
    </div>
  </div>
</section>

<section class="reviews">
  <h2 class="section-title">Field Tested</h2>
  <div class="r-grid">
    <div class="r-card">
      <div class="r-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="r-text">"The Alpha SV is bombproof. I wore it through a 3-day blizzard on Denali and stayed completely dry. The mobility in the arms is unmatched."</div>
      <div class="r-author">
        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Author" class="skeleton" onload="this.classList.remove(\'skeleton\')">
        Alex R. &mdash; IFMGA Guide
      </div>
    </div>
    <div class="r-card">
      <div class="r-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="r-text">"I've dragged the Bora backpack across sandstone in Utah and granite in Yosemite. It refuses to tear. The suspension system makes 50lbs feel like 20."</div>
      <div class="r-author">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Author" class="skeleton" onload="this.classList.remove(\'skeleton\')">
        Sarah J. &mdash; Thru-Hiker
      </div>
    </div>
    <div class="r-card">
      <div class="r-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="r-text">"The grip on the Aerios boots on wet rock is confidence-inspiring. Lightweight like a trail runner but supportive enough for a heavy pack."</div>
      <div class="r-author">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Author" class="skeleton" onload="this.classList.remove(\'skeleton\')">
        Mike T. &mdash; Alpine Climber
      </div>
    </div>
  </div>
</section>

<section class="warranty">
  <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
  <h2>Practical Lifespan Warranty</h2>
  <p>We build our gear to last. If a product fails due to a manufacturing defect, we will repair or replace it. Damage from wear and tear will be repaired at a reasonable price.</p>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">
        <svg viewBox="0 0 24 24" style="width:32px; height:32px; fill:var(--lime); display:inline-block; vertical-align:middle; margin-right:8px;"><path d="M12 2L1 21h22L12 2zm0 3.83L19.5 19h-15L12 5.83zM12 10l-4 6h8l-4-6z"/></svg>
        TERRALINE
      </div>
      <p class="f-desc">Design driven by function. Engineered for the harshest environments on earth.</p>
    </div>
    <div>
      <h4 class="f-title">Products</h4>
      <ul class="f-links">
        <li><a href="#">Shell Jackets</a></li>
        <li><a href="#">Insulated Jackets</a></li>
        <li><a href="#">Pants</a></li>
        <li><a href="#">Footwear</a></li>
        <li><a href="#">Packs</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Activities</h4>
      <ul class="f-links">
        <li><a href="#">Alpinism & Climbing</a></li>
        <li><a href="#">Hiking & Trekking</a></li>
        <li><a href="#">Skiing & Snowboarding</a></li>
        <li><a href="#">Trail Running</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Support</h4>
      <ul class="f-links">
        <li><a href="#">Customer Service</a></li>
        <li><a href="#">Product Care</a></li>
        <li><a href="#">Warranty & Repair</a></li>
        <li><a href="#">Pro Program</a></li>
      </ul>
    </div>
  </div>
  <div class="f-bottom">
    <div>&copy; 2026 TERRALINE EQUIPMENT INC.</div>
    <div>
      <a href="#" style="margin-right:20px; color:#888;">Privacy Policy</a>
      <a href="#" style="color:#888;">Terms of Use</a>
    </div>
  </div>
</footer>

</body>
</html>`,
  "organic-food": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VERDANA | Organic & Natural Foods</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --forest: #2D4A2D;
  --cream: #FAF7F0;
  --gold: #E8C547;
  --sage: #E8F0E0;
  --text: #333333;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Poppins', sans-serif; background: var(--cream); color: var(--text); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .serif { font-family: 'Lora', serif; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 20px 60px; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.03); position: sticky; top: 0; z-index: 100; }
.brand { font-family: 'Lora', serif; font-size: 32px; font-weight: 700; color: var(--forest); display: flex; align-items: center; gap: 8px; }
.brand svg { width: 32px; height: 32px; fill: var(--forest); }
.nav-links { display: flex; gap: 40px; list-style: none; font-weight: 500; font-size: 15px; color: var(--forest); }
.nav-links li:hover { color: var(--gold); cursor: pointer; }
.header-actions { display: flex; gap: 24px; align-items: center; }
.header-actions svg { width: 22px; height: 22px; stroke: var(--forest); stroke-width: 2; cursor: pointer; }
.header-actions svg:hover { stroke: var(--gold); }

/* HERO */
.hero { height: 80vh; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(45, 74, 45, 0.4); z-index: -1; }
.hero-content { max-width: 800px; padding: 40px; background: rgba(255,255,255,0.9); border-radius: 20px; backdrop-filter: blur(10px); }
.hero-subtitle { font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--forest); margin-bottom: 16px; }
.hero-title { font-size: 64px; color: var(--forest); line-height: 1.2; margin-bottom: 24px; }
.hero-desc { font-size: 18px; color: #555; margin-bottom: 32px; }
.btn-primary { display: inline-block; background: var(--forest); color: #fff; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; cursor: pointer; transition: all 0.3s; border: none; }
.btn-primary:hover { background: var(--gold); color: var(--forest); }

/* CERTIFICATIONS */
.certs { display: flex; justify-content: center; gap: 60px; padding: 40px 20px; background: var(--sage); }
.cert-item { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--forest); font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
.cert-item svg { width: 48px; height: 48px; stroke: var(--forest); stroke-width: 1.5; fill: none; }

/* PRODUCTS */
.products { padding: 100px 60px; }
.section-header { text-align: center; margin-bottom: 60px; }
.section-title { font-size: 48px; color: var(--forest); margin-bottom: 16px; }
.section-desc { font-size: 18px; color: #666; max-width: 600px; margin: 0 auto; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.p-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; position: relative; text-align: center; padding-bottom: 24px; }
.p-card:hover { transform: translateY(-10px); }
.p-img-box { position: relative; height: 250px; margin-bottom: 20px; overflow: hidden; }
.p-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.p-card:hover .p-img-box img { transform: scale(1.05); }
.p-badge { position: absolute; top: 16px; left: 16px; background: var(--gold); color: var(--forest); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; }
.p-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 600; color: var(--forest); margin-bottom: 8px; }
.p-weight { font-size: 14px; color: #888; margin-bottom: 16px; }
.p-price { font-size: 24px; font-weight: 700; color: var(--forest); margin-bottom: 20px; }
.btn-add { background: var(--sage); color: var(--forest); padding: 12px 30px; border-radius: 50px; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-add:hover { background: var(--forest); color: #fff; }

/* STORY SPLIT */
.story { display: flex; background: var(--forest); color: #fff; }
.s-content { width: 50%; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; }
.s-subtitle { font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
.s-content h2 { font-size: 48px; margin-bottom: 30px; line-height: 1.2; }
.s-content p { font-size: 16px; line-height: 1.8; margin-bottom: 40px; color: rgba(255,255,255,0.8); }
.btn-outline { display: inline-block; border: 2px solid var(--gold); color: var(--gold); background: transparent; padding: 14px 40px; border-radius: 50px; font-weight: 600; transition: all 0.3s; cursor: pointer; }
.btn-outline:hover { background: var(--gold); color: var(--forest); }
.s-image { width: 50%; object-fit: cover; }

/* SUBSCRIPTION BOX */
.sub-box { padding: 100px 60px; background: var(--cream); text-align: center; }
.sub-container { background: #fff; border-radius: 30px; padding: 80px; box-shadow: 0 20px 50px rgba(45,74,45,0.08); max-width: 1000px; margin: 0 auto; display: flex; align-items: center; gap: 60px; }
.sub-box-img { width: 40%; border-radius: 20px; }
.sub-info { width: 60%; text-align: left; }
.sub-info h2 { font-size: 40px; color: var(--forest); margin-bottom: 20px; }
.sub-info p { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.6; }
.sub-features { list-style: none; margin-bottom: 40px; }
.sub-features li { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-weight: 500; color: var(--forest); }
.sub-features svg { width: 20px; height: 20px; stroke: var(--gold); stroke-width: 2; fill: none; }

/* TESTIMONIALS */
.testimonials { padding: 100px 60px; background: var(--sage); }
.t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.t-card { background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.t-stars { color: var(--gold); font-size: 20px; margin-bottom: 20px; }
.t-text { font-family: 'Lora', serif; font-size: 18px; color: var(--forest); font-style: italic; margin-bottom: 24px; line-height: 1.6; }
.t-author { font-weight: 600; color: var(--forest); font-size: 15px; }

/* FOOTER */
.footer { background: var(--forest); color: rgba(255,255,255,0.8); padding: 80px 60px 40px; }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 60px; }
.f-brand { font-family: 'Lora', serif; font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.f-brand svg { width: 32px; height: 32px; fill: var(--gold); }
.f-desc { font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
.f-socials { display: flex; gap: 16px; }
.f-socials svg { width: 24px; height: 24px; fill: currentColor; cursor: pointer; transition: color 0.3s; }
.f-socials svg:hover { color: var(--gold); }
.f-title { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 24px; }
.f-links { list-style: none; }
.f-links li { margin-bottom: 12px; }
.f-links a { color: inherit; transition: color 0.3s; }
.f-links a:hover { color: var(--gold); }
.n-form { display: flex; margin-top: 16px; }
.n-form input { flex: 1; padding: 12px 16px; border: none; border-radius: 5px 0 0 5px; outline: none; }
.n-form button { background: var(--gold); color: var(--forest); border: none; padding: 0 20px; border-radius: 0 5px 5px 0; font-weight: 600; cursor: pointer; }
.f-bottom { padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 14px; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .story { flex-direction: column; }
  .s-content, .s-image { width: 100%; }
  .s-image { height: 400px; }
  .sub-container { flex-direction: column; padding: 40px; }
  .sub-box-img, .sub-info { width: 100%; }
  .t-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .hero-title { font-size: 40px; }
  .certs { flex-wrap: wrap; gap: 30px; }
  .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">
    <svg viewBox="0 0 24 24"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-10h2v4h-2zm0 6h2v2h-2z"/></svg>
    VERDANA
  </div>
  <ul class="nav-links">
    <li>Fresh Produce</li>
    <li>Pantry</li>
    <li>Bakery</li>
    <li>Subscriptions</li>
    <li>Our Farm</li>
  </ul>
  <div class="header-actions">
    <svg fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    <svg fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
  </div>
</header>

<section class="hero">
  <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80" alt="Organic Farm" class="skeleton hero-bg" onload="this.classList.remove(\'skeleton\')">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-subtitle">Rooted in Nature</div>
    <h1 class="hero-title">Real Food, Grown with Purpose.</h1>
    <p class="hero-desc">Discover our seasonal harvest of 100% organic, non-GMO produce and pantry staples sourced directly from sustainable farms.</p>
    <button class="btn-primary">Shop the Harvest</button>
  </div>
</section>

<div class="certs">
  <div class="cert-item">
    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    USDA Organic
  </div>
  <div class="cert-item">
    <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    Non-GMO Project
  </div>
  <div class="cert-item">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    Fair Trade Certified
  </div>
</div>

<section class="products">
  <div class="section-header">
    <h2 class="section-title">Seasonal Bestsellers</h2>
    <p class="section-desc">Hand-picked and freshly harvested. Taste the difference of food grown the way nature intended.</p>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">Freshly Picked</span>
        <img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80" alt="Tomatoes" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Heirloom Tomatoes</h3>
      <div class="p-weight">1 lb / Organic</div>
      <div class="p-price">$6.99</div>
      <button class="btn-add">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">Pantry Staple</span>
        <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80" alt="Avocados" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Hass Avocados</h3>
      <div class="p-weight">Bag of 4 / Organic</div>
      <div class="p-price">$5.49</div>
      <button class="btn-add">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">Bestseller</span>
        <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80" alt="Oranges" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Valencia Oranges</h3>
      <div class="p-weight">3 lbs / Organic</div>
      <div class="p-price">$8.99</div>
      <button class="btn-add">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80" alt="Bread" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Sourdough Loaf</h3>
      <div class="p-weight">1 Loaf / Artisan Baked</div>
      <div class="p-price">$7.50</div>
      <button class="btn-add">Add to Cart</button>
    </div>
  </div>
</section>

<section class="story">
  <div class="s-content">
    <div class="s-subtitle">Our Philosophy</div>
    <h2>From Our Soil to Your Table</h2>
    <p>We believe that healthy soil creates healthy food. By partnering with regenerative farms across the country, we ensure that every product we sell not only nourishes you but also replenishes the earth.</p>
    <p>No synthetic pesticides. No artificial preservatives. Just pure, wholesome goodness.</p>
    <div>
      <button class="btn-outline">Read Our Story</button>
    </div>
  </div>
  <img src="https://images.unsplash.com/photo-1595856405298-6e792c3a52c3?auto=format&fit=crop&w=1000&q=80" alt="Farmer" class="skeleton s-image" onload="this.classList.remove(\'skeleton\')">
</section>

<section class="sub-box">
  <div class="sub-container">
    <img src="https://images.unsplash.com/photo-1591185843469-6d6342dd306e?auto=format&fit=crop&w=600&q=80" alt="Harvest Box" class="skeleton sub-box-img" onload="this.classList.remove(\'skeleton\')">
    <div class="sub-info">
      <h2>The Weekly Harvest Box</h2>
      <p>Get a curated box of the season's freshest organic produce delivered directly to your doorstep every week. Skip, pause, or cancel anytime.</p>
      <ul class="sub-features">
        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> 100% Certified Organic Produce</li>
        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Sourced from Local Farmers</li>
        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Customizable Weekly Selection</li>
        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Eco-friendly Compostable Packaging</li>
      </ul>
      <button class="btn-primary">Build Your Box</button>
    </div>
  </div>
</section>

<section class="testimonials">
  <div class="section-header">
    <h2 class="section-title">What Our Community Says</h2>
  </div>
  <div class="t-grid">
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"The quality of the produce is unmatched. The heirloom tomatoes actually taste like tomatoes! I'm completely hooked on the Harvest Box."</div>
      <div class="t-author">&mdash; Sarah Jenkins</div>
    </div>
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"As a busy mom, having healthy, organic snacks and pantry staples delivered saves me so much time. The customer service is also exceptional."</div>
      <div class="t-author">&mdash; Emily Chen</div>
    </div>
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"I love knowing exactly where my food comes from. Verdana's commitment to regenerative farming makes me feel good about every purchase."</div>
      <div class="t-author">&mdash; Michael Torres</div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">
        <svg viewBox="0 0 24 24"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-10h2v4h-2zm0 6h2v2h-2z"/></svg>
        VERDANA
      </div>
      <p class="f-desc">Cultivating health and sustainability through mindful sourcing and organic farming.</p>
      <div class="f-socials">
        <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </div>
    </div>
    <div>
      <h4 class="f-title">Shop</h4>
      <ul class="f-links">
        <li><a href="#">Fresh Produce</a></li>
        <li><a href="#">Meat & Seafood</a></li>
        <li><a href="#">Pantry Staples</a></li>
        <li><a href="#">Dairy & Eggs</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Company</h4>
      <ul class="f-links">
        <li><a href="#">About Us</a></li>
        <li><a href="#">Our Farmers</a></li>
        <li><a href="#">Sustainability</a></li>
        <li><a href="#">Careers</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Newsletter</h4>
      <p style="font-size:14px; margin-bottom:10px;">Get 10% off your first order and weekly recipe inspiration.</p>
      <div class="n-form">
        <input type="email" placeholder="Your email address">
        <button>SIGN UP</button>
      </div>
    </div>
  </div>
  <div class="f-bottom">
    &copy; 2026 VERDANA ORGANIC FOODS. ALL RIGHTS RESERVED.
  </div>
</footer>

</body>
</html>`,
  "fitness-supplements": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>APEX | Premium Sports Nutrition</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --black: #0A0A0A;
  --neon: #D4FF00;
  --charcoal: #1A1A1A;
  --white: #FFFFFF;
  --gray: #666666;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--black); color: var(--white); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .display-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: rgba(10,10,10,0.9); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; border-bottom: 2px solid var(--charcoal); }
.brand { font-family: 'Barlow Condensed', sans-serif; font-size: 40px; font-weight: 900; font-style: italic; color: var(--neon); letter-spacing: -1px; }
.nav-links { display: flex; gap: 40px; list-style: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
.nav-links li:hover { color: var(--neon); cursor: pointer; }
.header-actions { display: flex; gap: 20px; align-items: center; }
.header-actions svg { width: 24px; height: 24px; fill: var(--white); cursor: pointer; transition: fill 0.2s; }
.header-actions svg:hover { fill: var(--neon); }

/* HERO */
.hero { height: 90vh; position: relative; display: flex; align-items: center; padding: 0 40px; overflow: hidden; background: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80') center/cover; }
.hero::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.2) 100%); z-index: 1; }
.hero-content { position: relative; z-index: 2; max-width: 800px; }
.hero-subtitle { display: inline-block; background: var(--neon); color: var(--black); font-family: 'Barlow Condensed', sans-serif; font-size: 24px; font-weight: 800; font-style: italic; padding: 4px 16px; margin-bottom: 20px; transform: skewX(-10deg); }
.hero h1 { font-size: 120px; font-weight: 900; line-height: 0.85; margin-bottom: 30px; letter-spacing: -2px; }
.hero h1 span { color: var(--neon); }
.hero p { font-size: 20px; color: #ccc; margin-bottom: 40px; max-width: 500px; line-height: 1.5; font-weight: 500; }
.btn-primary { display: inline-block; background: var(--neon); color: var(--black); font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 900; font-style: italic; padding: 15px 50px; text-transform: uppercase; border: none; cursor: pointer; transform: skewX(-10deg); transition: transform 0.2s, background 0.2s; }
.btn-primary:hover { transform: skewX(-10deg) scale(1.05); background: #fff; }
.btn-primary span { display: inline-block; transform: skewX(10deg); }

/* COUNTDOWN */
.countdown-banner { display: flex; align-items: center; justify-content: center; gap: 40px; background: var(--neon); color: var(--black); padding: 20px; font-family: 'Barlow Condensed', sans-serif; }
.countdown-text { font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; }
.timer { display: flex; gap: 20px; }
.time-box { background: var(--black); color: var(--white); padding: 10px 20px; border-radius: 4px; text-align: center; min-width: 80px; }
.time-num { font-size: 32px; font-weight: 900; line-height: 1; }
.time-label { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--neon); margin-top: 4px; }

/* PRODUCTS */
.products { padding: 100px 40px; background: var(--charcoal); }
.section-header { text-align: center; margin-bottom: 60px; }
.section-title { font-size: 80px; font-weight: 900; color: var(--white); margin-bottom: 10px; }
.section-title span { color: var(--neon); }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.p-card { background: var(--black); border: 2px solid #222; padding: 30px; position: relative; transition: all 0.3s; text-align: center; }
.p-card:hover { border-color: var(--neon); transform: translateY(-10px); }
.p-img-box { height: 250px; margin-bottom: 20px; position: relative; }
.p-img-box img { max-height: 100%; max-width: 100%; object-fit: contain; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5)); transition: transform 0.3s; }
.p-card:hover .p-img-box img { transform: scale(1.1); }
.p-badge { position: absolute; top: 0; left: 0; background: var(--neon); color: var(--black); font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 800; padding: 4px 12px; transform: skewX(-10deg); }
.p-title { font-size: 32px; font-weight: 800; margin-bottom: 10px; font-family: 'Barlow Condensed', sans-serif; }
.p-flavors { font-size: 12px; color: var(--gray); font-weight: 700; text-transform: uppercase; margin-bottom: 15px; }
.p-price { font-size: 36px; font-weight: 900; color: var(--neon); margin-bottom: 20px; font-family: 'Barlow Condensed', sans-serif; }
.btn-outline { width: 100%; padding: 12px; background: transparent; border: 2px solid var(--neon); color: var(--neon); font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: all 0.2s; transform: skewX(-10deg); }
.btn-outline:hover { background: var(--neon); color: var(--black); }
.btn-outline span { display: inline-block; transform: skewX(10deg); }

/* INGREDIENTS */
.ingredients { display: flex; background: var(--black); border-top: 1px solid #222; border-bottom: 1px solid #222; }
.ing-img { width: 50%; object-fit: cover; filter: grayscale(100%) contrast(1.2); }
.ing-content { width: 50%; padding: 100px 80px; }
.ing-content h2 { font-size: 64px; margin-bottom: 40px; }
.macro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.macro-item { border-left: 4px solid var(--neon); padding-left: 20px; }
.m-num { font-family: 'Barlow Condensed', sans-serif; font-size: 48px; font-weight: 900; color: var(--white); line-height: 1; margin-bottom: 5px; }
.m-num span { font-size: 24px; color: var(--neon); }
.m-label { font-size: 14px; font-weight: 700; color: var(--gray); text-transform: uppercase; }

/* TESTIMONIALS */
.testimonials { padding: 100px 40px; background: var(--charcoal); }
.t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.t-card { background: var(--black); padding: 40px; border-top: 4px solid var(--neon); position: relative; }
.quote-icon { font-family: 'Barlow Condensed', sans-serif; font-size: 120px; color: #222; position: absolute; top: -30px; left: 20px; line-height: 1; }
.t-text { font-size: 18px; font-weight: 500; line-height: 1.6; margin-bottom: 30px; position: relative; z-index: 1; }
.t-author { display: flex; align-items: center; gap: 15px; }
.t-author img { width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--neon); object-fit: cover; }
.t-name { font-family: 'Barlow Condensed', sans-serif; font-size: 24px; font-weight: 800; text-transform: uppercase; }
.t-sport { font-size: 12px; color: var(--neon); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

/* FOOTER */
.footer { background: var(--black); padding: 80px 40px 40px; border-top: 10px solid var(--neon); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
.f-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 64px; font-weight: 900; font-style: italic; color: var(--white); margin-bottom: 20px; line-height: 1; letter-spacing: -2px; }
.f-desc { color: var(--gray); font-weight: 500; max-width: 300px; line-height: 1.6; margin-bottom: 30px; }
.f-socials { display: flex; gap: 15px; }
.f-socials div { width: 40px; height: 40px; background: #222; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; transition: background 0.3s; }
.f-socials div:hover { background: var(--neon); }
.f-socials svg { width: 20px; height: 20px; fill: var(--white); }
.f-socials div:hover svg { fill: var(--black); }
.f-title { font-family: 'Barlow Condensed', sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; color: var(--white); }
.f-links { list-style: none; }
.f-links li { margin-bottom: 15px; }
.f-links a { color: var(--gray); font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; transition: color 0.2s; }
.f-links a:hover { color: var(--neon); }
.f-bottom { text-align: center; padding-top: 40px; border-top: 1px solid #222; color: #444; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero h1 { font-size: 90px; }
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .ingredients { flex-direction: column; }
  .ing-img, .ing-content { width: 100%; }
  .ing-img { height: 400px; }
  .t-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .hero h1 { font-size: 60px; }
  .countdown-banner { flex-direction: column; text-align: center; gap: 20px; }
  .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">APEX</div>
  <ul class="nav-links">
    <li>Proteins</li>
    <li>Pre-Workout</li>
    <li>Recovery</li>
    <li>Apparel</li>
    <li>Athletes</li>
  </ul>
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
  </div>
</header>

<div class="countdown-banner">
  <div class="countdown-text">BFCM Mega Sale Ends In:</div>
  <div class="timer">
    <div class="time-box">
      <div class="time-num">02</div>
      <div class="time-label">Days</div>
    </div>
    <div class="time-box">
      <div class="time-num">14</div>
      <div class="time-label">Hours</div>
    </div>
    <div class="time-box">
      <div class="time-num">45</div>
      <div class="time-label">Mins</div>
    </div>
    <div class="time-box">
      <div class="time-num">12</div>
      <div class="time-label">Secs</div>
    </div>
  </div>
</div>

<section class="hero">
  <div class="hero-content">
    <div class="hero-subtitle"><span>New Flavor Drop</span></div>
    <h1>Push Past<br><span>Your Limits</span></h1>
    <p>Clinically dosed ingredients. Zero proprietary blends. The official fuel of IFBB Pros and elite powerlifters worldwide.</p>
    <button class="btn-primary"><span>Shop The Sale</span></button>
  </div>
</section>

<section class="products">
  <div class="section-header">
    <h2 class="section-title">Top <span>Performers</span></h2>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-badge"><span>Best Seller</span></div>
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80" alt="Whey Protein" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">100% Isolate</h3>
      <div class="p-flavors">Vanilla / Chocolate / Strawberry</div>
      <div class="p-price">$44.99</div>
      <button class="btn-outline"><span>Add To Cart</span></button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80" alt="Pre Workout" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Apex Pre</h3>
      <div class="p-flavors">Blue Raspberry / Fruit Punch</div>
      <div class="p-price">$39.99</div>
      <button class="btn-outline"><span>Add To Cart</span></button>
    </div>
    <div class="p-card">
      <div class="p-badge"><span>New</span></div>
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1611072337226-1d9f2c89d82d?auto=format&fit=crop&w=600&q=80" alt="Creatine" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Creatine HCl</h3>
      <div class="p-flavors">Unflavored</div>
      <div class="p-price">$24.99</div>
      <button class="btn-outline"><span>Add To Cart</span></button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80" alt="BCAA" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">BCAA + EAA</h3>
      <div class="p-flavors">Watermelon / Lemon Lime</div>
      <div class="p-price">$34.99</div>
      <button class="btn-outline"><span>Add To Cart</span></button>
    </div>
  </div>
</section>

<section class="ingredients">
  <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80" alt="Gym weights" class="skeleton ing-img" onload="this.classList.remove(\'skeleton\')">
  <div class="ing-content">
    <h2>Science <span>Backed.</span><br>Result <span>Driven.</span></h2>
    <div class="macro-grid">
      <div class="macro-item">
        <div class="m-num">25<span>g</span></div>
        <div class="m-label">Protein per scoop</div>
      </div>
      <div class="macro-item">
        <div class="m-num">0<span>g</span></div>
        <div class="m-label">Added Sugar</div>
      </div>
      <div class="macro-item">
        <div class="m-num">8<span>g</span></div>
        <div class="m-label">BCAAs</div>
      </div>
      <div class="macro-item">
        <div class="m-num">300<span>mg</span></div>
        <div class="m-label">Caffeine (Pre)</div>
      </div>
    </div>
  </div>
</section>

<section class="testimonials">
  <h2 class="section-title" style="text-align: center; margin-bottom: 60px;">Athlete <span>Approved</span></h2>
  <div class="t-grid">
    <div class="t-card">
      <div class="quote-icon">"</div>
      <div class="t-text">I've tried every pre-workout on the market. Apex Pre is the only one that gives me clean energy without the crash, letting me push through 2-hour heavy leg days.</div>
      <div class="t-author">
        <img src="https://images.unsplash.com/photo-1583465551918-0524cb51b2fc?auto=format&fit=crop&w=200&q=80" alt="Athlete" class="skeleton" onload="this.classList.remove(\'skeleton\')">
        <div>
          <div class="t-name">Marcus Cole</div>
          <div class="t-sport">IFBB Pro Bodybuilder</div>
        </div>
      </div>
    </div>
    <div class="t-card">
      <div class="quote-icon">"</div>
      <div class="t-text">The Isolate mixes perfectly and tastes incredible. It's become a staple in my daily routine whether I'm in prep or off-season. Completely digested in minutes.</div>
      <div class="t-author">
        <img src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=200&q=80" alt="Athlete" class="skeleton" onload="this.classList.remove(\'skeleton\')">
        <div>
          <div class="t-name">Sarah Jenkins</div>
          <div class="t-sport">Crossfit Games Athlete</div>
        </div>
      </div>
    </div>
    <div class="t-card">
      <div class="quote-icon">"</div>
      <div class="t-text">As a powerlifter, recovery is everything. Since switching to Apex BCAA + EAA during my workouts, my DOMS is practically nonexistent. Highly recommend.</div>
      <div class="t-author">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80" alt="Athlete" class="skeleton" onload="this.classList.remove(\'skeleton\')">
        <div>
          <div class="t-name">David Ross</div>
          <div class="t-sport">Elite Powerlifter</div>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">APEX</div>
      <p class="f-desc">Uncompromising formulas for those who demand the absolute best from themselves and their nutrition.</p>
      <div class="f-socials">
        <div><svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></div>
        <div><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div>
      </div>
    </div>
    <div>
      <h4 class="f-title">Shop</h4>
      <ul class="f-links">
        <li><a href="#">All Products</a></li>
        <li><a href="#">Protein</a></li>
        <li><a href="#">Pre-Workout</a></li>
        <li><a href="#">Merch</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Support</h4>
      <ul class="f-links">
        <li><a href="#">FAQ</a></li>
        <li><a href="#">Shipping Policy</a></li>
        <li><a href="#">Return Policy</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Company</h4>
      <ul class="f-links">
        <li><a href="#">About Us</a></li>
        <li><a href="#">Our Athletes</a></li>
        <li><a href="#">Wholesale</a></li>
        <li><a href="#">Careers</a></li>
      </ul>
    </div>
  </div>
  <div class="f-bottom">
    &copy; 2026 APEX NUTRITION INC. ALL RIGHTS RESERVED.
  </div>
</footer>
</body>
</html>`,
  "baby-apparel": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BLOOM | Premium Baby Clothing</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --blush: #F9E8E8;
  --cream: #FFF9F5;
  --mauve: #C4A0A0;
  --sage: #A8C4A0;
  --text: #5A4A4A;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Quicksand', sans-serif; background: var(--cream); color: var(--text); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .brand { font-family: 'Nunito', sans-serif; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 25px 60px; background: rgba(255, 249, 245, 0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
.brand { font-size: 32px; font-weight: 800; color: var(--mauve); letter-spacing: 2px; }
.nav-links { display: flex; gap: 40px; list-style: none; font-weight: 600; font-size: 15px; color: var(--text); }
.nav-links li:hover { color: var(--mauve); cursor: pointer; }
.header-actions { display: flex; gap: 24px; align-items: center; }
.header-actions svg { width: 22px; height: 22px; stroke: var(--text); stroke-width: 2; cursor: pointer; fill: none; }
.header-actions svg:hover { stroke: var(--mauve); }

/* HERO */
.hero { display: flex; height: 85vh; padding: 0 60px; align-items: center; gap: 60px; }
.hero-content { width: 50%; }
.hero-tag { display: inline-block; background: var(--blush); color: var(--mauve); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; border-radius: 50px; font-size: 12px; margin-bottom: 24px; }
.hero h1 { font-size: 64px; color: var(--text); line-height: 1.1; margin-bottom: 24px; font-weight: 800; }
.hero p { font-size: 18px; color: #7A6A6A; margin-bottom: 40px; line-height: 1.6; max-width: 500px; }
.btn-primary { display: inline-block; background: var(--mauve); color: #fff; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; font-family: 'Quicksand', sans-serif; cursor: pointer; transition: all 0.3s; border: none; box-shadow: 0 10px 20px rgba(196, 160, 160, 0.3); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 25px rgba(196, 160, 160, 0.4); }
.hero-image { width: 50%; height: 80%; border-radius: 40px 140px 40px 40px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
.hero-image img { width: 100%; height: 100%; object-fit: cover; }

/* AGE FILTER */
.age-filter { padding: 40px 60px; background: #fff; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
.age-pill { background: var(--cream); border: 2px solid transparent; padding: 12px 30px; border-radius: 50px; font-weight: 700; color: var(--text); cursor: pointer; transition: all 0.2s; }
.age-pill.active, .age-pill:hover { border-color: var(--mauve); background: var(--blush); color: var(--mauve); }

/* PRODUCTS */
.products { padding: 80px 60px; }
.section-header { text-align: center; margin-bottom: 60px; }
.section-title { font-size: 42px; color: var(--text); margin-bottom: 16px; font-weight: 800; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.p-card { background: #fff; border-radius: 30px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); transition: transform 0.3s; text-align: center; }
.p-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
.p-img-box { height: 280px; border-radius: 20px; overflow: hidden; margin-bottom: 20px; background: var(--cream); position: relative; }
.p-img-box img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; }
.p-badge { position: absolute; top: 16px; left: 16px; background: #fff; color: var(--mauve); font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
.p-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; font-family: 'Nunito', sans-serif; }
.p-price { font-size: 20px; font-weight: 700; color: var(--mauve); margin-bottom: 20px; }
.btn-outline { width: 100%; background: transparent; border: 2px solid var(--mauve); color: var(--mauve); padding: 12px; border-radius: 50px; font-weight: 700; cursor: pointer; transition: all 0.3s; font-family: 'Quicksand', sans-serif; }
.btn-outline:hover { background: var(--mauve); color: #fff; }

/* FEATURES SPLIT */
.features { display: flex; background: var(--blush); margin: 80px 60px; border-radius: 40px; overflow: hidden; }
.f-image { width: 50%; object-fit: cover; }
.f-content { width: 50%; padding: 80px; display: flex; flex-direction: column; justify-content: center; }
.f-content h2 { font-size: 42px; margin-bottom: 24px; color: var(--text); line-height: 1.2; }
.f-content p { font-size: 16px; line-height: 1.8; margin-bottom: 40px; color: #7A6A6A; }
.f-icon-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
.f-icon-item { display: flex; align-items: center; gap: 16px; font-weight: 700; color: var(--text); }
.f-icon-item svg { width: 40px; height: 40px; fill: var(--sage); }

/* TESTIMONIALS */
.testimonials { padding: 80px 60px; text-align: center; }
.t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
.t-card { background: #fff; padding: 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.t-stars { color: var(--mauve); font-size: 20px; margin-bottom: 20px; }
.t-text { font-size: 16px; line-height: 1.6; color: var(--text); margin-bottom: 24px; font-weight: 500; }
.t-author { font-weight: 700; color: var(--mauve); font-family: 'Nunito', sans-serif; }
.t-blog { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

/* GIFTING CTA */
.gifting { text-align: center; padding: 100px 60px; background: var(--sage); color: #fff; margin-top: 40px; }
.gifting h2 { font-size: 48px; margin-bottom: 20px; }
.gifting p { font-size: 18px; max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }
.btn-white { display: inline-block; background: #fff; color: var(--sage); padding: 16px 40px; border-radius: 50px; font-weight: 700; cursor: pointer; transition: transform 0.3s; }
.btn-white:hover { transform: translateY(-3px); }

/* FOOTER */
.footer { background: #fff; padding: 80px 60px 40px; }
.ft-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
.ft-brand { font-size: 32px; font-weight: 800; color: var(--mauve); margin-bottom: 20px; font-family: 'Nunito', sans-serif; }
.ft-desc { color: #7A6A6A; line-height: 1.6; font-size: 15px; max-width: 300px; }
.ft-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 24px; font-family: 'Nunito', sans-serif; }
.ft-links { list-style: none; }
.ft-links li { margin-bottom: 16px; }
.ft-links a { color: #7A6A6A; font-weight: 600; transition: color 0.2s; }
.ft-links a:hover { color: var(--mauve); }
.ft-bottom { text-align: center; padding-top: 40px; border-top: 2px solid var(--cream); color: #999; font-size: 14px; font-weight: 600; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero { flex-direction: column; height: auto; text-align: center; padding-top: 60px; }
  .hero-content, .hero-image { width: 100%; }
  .hero-image { height: 400px; border-radius: 40px; margin-top: 40px; }
  .hero p { margin: 0 auto 40px; }
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .features { flex-direction: column; margin: 40px; border-radius: 30px; }
  .f-image, .f-content { width: 100%; }
  .f-image { height: 300px; }
  .t-grid { grid-template-columns: 1fr; }
  .ft-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .hero h1 { font-size: 48px; }
  .p-grid { grid-template-columns: 1fr; }
  .f-content { padding: 40px; }
  .f-icon-grid { grid-template-columns: 1fr; }
  .ft-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">BLOOM.</div>
  <ul class="nav-links">
    <li>Newborn</li>
    <li>Baby Boy</li>
    <li>Baby Girl</li>
    <li>Accessories</li>
    <li>Gifts</li>
  </ul>
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <div class="hero-tag">SS26 Collection</div>
    <h1>Softness in every stitch.</h1>
    <p>Discover our new collection of exceptionally soft, 100% GOTS certified organic cotton clothing designed for your little one's delicate skin and biggest adventures.</p>
    <button class="btn-primary">Shop New Arrivals</button>
  </div>
  <div class="hero-image">
    <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80" alt="Cute baby smiling" class="skeleton" onload="this.classList.remove(\'skeleton\')">
  </div>
</section>

<div class="age-filter">
  <div class="age-pill active">0-3 Months</div>
  <div class="age-pill">3-6 Months</div>
  <div class="age-pill">6-12 Months</div>
  <div class="age-pill">1-2 Years</div>
  <div class="age-pill">2-4 Years</div>
</div>

<section class="products">
  <div class="section-header">
    <h2 class="section-title">The Essentials</h2>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">Organic</span>
        <img src="https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80" alt="Baby Onesie" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Ribbed Wrap Onesie</h3>
      <div class="p-price">$28.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">Bestseller</span>
        <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80" alt="Knit Sweater" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Chunky Knit Cardigan</h3>
      <div class="p-price">$45.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1471286174890-9c112ac6476b?auto=format&fit=crop&w=600&q=80" alt="Baby Pants" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Linen Bloomers</h3>
      <div class="p-price">$24.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">New</span>
        <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80" alt="Baby Socks" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Pointelle Sleepsuit</h3>
      <div class="p-price">$32.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
  </div>
</section>

<section class="features">
  <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80" alt="Baby toys" class="skeleton f-image" onload="this.classList.remove(\'skeleton\')">
  <div class="f-content">
    <h2>Kind to their skin.<br>Kind to the earth.</h2>
    <p>We believe baby clothes should be as pure as the babies who wear them. That's why we only use the finest organic materials, free from harmful chemicals, dyes, and pesticides.</p>
    <div class="f-icon-grid">
      <div class="f-icon-item">
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        100% Organic Cotton
      </div>
      <div class="f-icon-item">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        GOTS Certified
      </div>
      <div class="f-icon-item">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Hypoallergenic
      </div>
      <div class="f-icon-item">
        <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
        Ethically Made
      </div>
    </div>
    <div>
      <button class="btn-primary" style="padding: 12px 30px; font-size: 14px;">View Our Size Guide</button>
    </div>
  </div>
</section>

<section class="testimonials">
  <h2 class="section-title">Loved by Parents</h2>
  <div class="t-grid">
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"The quality of Bloom's onesies is unmatched. They stay incredibly soft even after dozens of washes, and the colors are just so beautiful and calming."</div>
      <div class="t-author">Jessica H.</div>
      <div class="t-blog">@jessandthetwins</div>
    </div>
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"I buy Bloom for all my baby shower gifts now. The packaging is gorgeous, and parents always ask me where I found such luxurious baby basics."</div>
      <div class="t-author">Amanda R.</div>
      <div class="t-blog">Mother of 3</div>
    </div>
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"My son has severe eczema, and Bloom is one of the only brands he can wear comfortably. The organic cotton breathes so well."</div>
      <div class="t-author">Michelle T.</div>
      <div class="t-blog">@mindfulmoments</div>
    </div>
  </div>
</section>

<section class="gifting">
  <h2>The Perfect Gift</h2>
  <p>Celebrate their arrival with our curated gift bundles. Beautifully packaged in our signature keepsake boxes and finished with a handwritten note.</p>
  <button class="btn-white">Shop Gift Bundles</button>
</section>

<footer class="footer">
  <div class="ft-grid">
    <div>
      <div class="ft-brand">BLOOM.</div>
      <p class="ft-desc">Crafting the softest, safest, and most beautiful beginnings for the newest members of your family.</p>
    </div>
    <div>
      <h4 class="ft-title">Shop</h4>
      <ul class="ft-links">
        <li><a href="#">New Arrivals</a></li>
        <li><a href="#">Best Sellers</a></li>
        <li><a href="#">Hospital Bag Bundles</a></li>
        <li><a href="#">Gift Cards</a></li>
      </ul>
    </div>
    <div>
      <h4 class="ft-title">About</h4>
      <ul class="ft-links">
        <li><a href="#">Our Story</a></li>
        <li><a href="#">Sustainability</a></li>
        <li><a href="#">Materials</a></li>
        <li><a href="#">Journal</a></li>
      </ul>
    </div>
    <div>
      <h4 class="ft-title">Support</h4>
      <ul class="ft-links">
        <li><a href="#">FAQ</a></li>
        <li><a href="#">Shipping & Returns</a></li>
        <li><a href="#">Size Guide</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bottom">
    &copy; 2026 BLOOM BABY APPAREL. ALL RIGHTS RESERVED.
  </div>
</footer>

</body>
</html>`,
  "coffee-roasters": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ORIGIN | Specialty Coffee Roasters</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --espresso: #1C0F08;
  --caramel: #C8813A;
  --cream: #FAF5EE;
  --tan: #F0E4D4;
  --gray: #6B6560;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--cream); color: var(--espresso); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .serif { font-family: 'Playfair Display', serif; }
.mono { font-family: 'DM Mono', monospace; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 25px 60px; background: transparent; position: absolute; top: 0; width: 100%; z-index: 100; color: #fff; }
.brand { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; }
.nav-links { display: flex; gap: 40px; list-style: none; font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
.nav-links li:hover { color: var(--caramel); cursor: pointer; transition: color 0.3s; }
.header-actions { display: flex; gap: 24px; align-items: center; }
.header-actions svg { width: 22px; height: 22px; stroke: #fff; stroke-width: 1.5; fill: none; cursor: pointer; transition: stroke 0.3s; }
.header-actions svg:hover { stroke: var(--caramel); }

/* HERO */
.hero { height: 100vh; position: relative; display: flex; align-items: center; padding: 0 10%; background: var(--espresso); }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; mix-blend-mode: multiply; z-index: 1; }
.hero-content { position: relative; z-index: 2; color: #fff; max-width: 600px; }
.hero-tag { font-family: 'DM Mono', monospace; font-size: 14px; letter-spacing: 3px; color: var(--caramel); margin-bottom: 20px; text-transform: uppercase; }
.hero h1 { font-size: 80px; line-height: 1.1; margin-bottom: 30px; font-weight: 400; }
.hero p { font-size: 18px; line-height: 1.6; color: #DCD5CD; margin-bottom: 40px; font-weight: 300; }
.btn-primary { display: inline-block; background: var(--caramel); color: #fff; font-family: 'DM Mono', monospace; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; padding: 18px 40px; border: none; cursor: pointer; transition: background 0.3s; }
.btn-primary:hover { background: #b07030; }

/* MAP SECTION */
.origin-map { display: flex; background: var(--tan); }
.om-text { width: 50%; padding: 100px 10%; display: flex; flex-direction: column; justify-content: center; }
.om-text h2 { font-size: 48px; margin-bottom: 30px; }
.om-text p { font-size: 16px; line-height: 1.8; color: var(--gray); margin-bottom: 40px; }
.om-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
.om-item { display: flex; align-items: center; gap: 15px; font-family: 'DM Mono', monospace; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
.om-item span { width: 30px; height: 1px; background: var(--caramel); }
.om-img { width: 50%; object-fit: cover; }

/* PRODUCTS */
.products { padding: 120px 10%; }
.section-header { text-align: center; margin-bottom: 80px; }
.section-tag { font-family: 'DM Mono', monospace; font-size: 13px; color: var(--caramel); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px; }
.section-title { font-size: 56px; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.p-card { display: flex; flex-direction: column; align-items: center; text-align: center; group; cursor: pointer; }
.p-img-box { width: 100%; height: 350px; background: #fff; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.05); position: relative; overflow: hidden; }
.p-img-box img { max-width: 80%; max-height: 80%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.5s; }
.p-card:hover .p-img-box img { transform: scale(1.05); }
.p-roast { position: absolute; top: 20px; left: 20px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; background: var(--tan); padding: 5px 10px; }
.p-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; margin-bottom: 10px; }
.p-notes { font-size: 14px; color: var(--gray); margin-bottom: 15px; }
.p-price { font-family: 'DM Mono', monospace; font-size: 16px; margin-bottom: 20px; }
.btn-outline { background: transparent; border: 1px solid var(--espresso); color: var(--espresso); font-family: 'DM Mono', monospace; font-size: 13px; text-transform: uppercase; padding: 12px 30px; letter-spacing: 1px; transition: all 0.3s; cursor: pointer; opacity: 0; transform: translateY(10px); }
.p-card:hover .btn-outline { opacity: 1; transform: translateY(0); }
.btn-outline:hover { background: var(--espresso); color: var(--cream); }

/* SUBSCRIPTION */
.sub-section { background: var(--espresso); color: #fff; display: flex; }
.sub-img { width: 50%; height: 600px; object-fit: cover; opacity: 0.8; }
.sub-content { width: 50%; padding: 100px 10%; display: flex; flex-direction: column; justify-content: center; }
.sub-content h2 { font-size: 56px; margin-bottom: 30px; }
.sub-content p { font-size: 16px; line-height: 1.8; color: #DCD5CD; margin-bottom: 40px; }
.sub-steps { display: flex; gap: 30px; margin-bottom: 50px; }
.step { flex: 1; }
.step-num { font-family: 'DM Mono', monospace; font-size: 14px; color: var(--caramel); margin-bottom: 10px; }
.step-text { font-family: 'Playfair Display', serif; font-size: 18px; }

/* REVIEWS */
.reviews { padding: 120px 10%; background: #fff; text-align: center; }
.r-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; margin-top: 60px; }
.r-card { padding: 40px; border: 1px solid var(--tan); }
.r-stars { color: var(--caramel); font-size: 24px; margin-bottom: 20px; }
.r-text { font-size: 16px; line-height: 1.8; color: var(--gray); margin-bottom: 30px; font-style: italic; }
.r-author { font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }

/* FOOTER */
.footer { background: var(--espresso); color: #DCD5CD; padding: 100px 10% 40px; }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 80px; }
.f-brand { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #fff; margin-bottom: 20px; }
.f-desc { font-size: 14px; line-height: 1.8; max-width: 300px; margin-bottom: 30px; }
.f-title { font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #fff; margin-bottom: 30px; }
.f-links { list-style: none; }
.f-links li { margin-bottom: 15px; }
.f-links a { font-size: 14px; transition: color 0.3s; }
.f-links a:hover { color: var(--caramel); }
.n-form { display: flex; border-bottom: 1px solid #DCD5CD; padding-bottom: 10px; margin-top: 20px; }
.n-form input { flex: 1; background: transparent; border: none; color: #fff; font-family: 'DM Mono', monospace; font-size: 13px; outline: none; }
.n-form input::placeholder { color: #888; }
.n-form button { background: transparent; border: none; color: var(--caramel); font-family: 'DM Mono', monospace; font-size: 13px; text-transform: uppercase; cursor: pointer; }
.f-bottom { text-align: center; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero h1 { font-size: 60px; }
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .origin-map, .sub-section { flex-direction: column; }
  .om-text, .om-img, .sub-img, .sub-content { width: 100%; }
  .om-img, .sub-img { height: 400px; }
  .r-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .header { padding: 20px; }
  .hero h1 { font-size: 48px; }
  .sub-steps { flex-direction: column; }
  .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">ORIGIN</div>
  <ul class="nav-links">
    <li>Shop Coffee</li>
    <li>Subscriptions</li>
    <li>Equipment</li>
    <li>Brew Guides</li>
    <li>Our Story</li>
  </ul>
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
  </div>
</header>

<section class="hero">
  <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=80" alt="Coffee Roasting" class="skeleton hero-bg" onload="this.classList.remove(\'skeleton\')">
  <div class="hero-content">
    <div class="hero-tag">Specialty Roasters</div>
    <h1>The pursuit of the perfect cup.</h1>
    <p>We source the top 1% of coffee beans from around the world and roast them to order in small batches to highlight their unique terroir.</p>
    <button class="btn-primary">Shop Our Roasts</button>
  </div>
</section>

<section class="origin-map">
  <div class="om-text">
    <div class="hero-tag" style="color:var(--espresso);">Direct Trade</div>
    <h2>Sourced with intention.</h2>
    <p>We travel to the coffee belt to build lasting relationships with farmers. By paying premium prices, we ensure sustainable practices and the highest quality beans.</p>
    <ul class="om-list">
      <li class="om-item"><span></span> Yirgacheffe, Ethiopia</li>
      <li class="om-item"><span></span> Huila, Colombia</li>
      <li class="om-item"><span></span> Minas Gerais, Brazil</li>
      <li class="om-item"><span></span> Antigua, Guatemala</li>
    </ul>
  </div>
  <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80" alt="Coffee Pour" class="skeleton om-img" onload="this.classList.remove(\'skeleton\')">
</section>

<section class="products">
  <div class="section-header">
    <div class="section-tag">Freshly Roasted</div>
    <h2 class="section-title">Single Origin</h2>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-roast">Light Roast</div>
        <img src="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80" alt="Ethiopia Yirgacheffe" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Ethiopia Yirgacheffe</h3>
      <div class="p-notes">Jasmine, Bergamot, Honey</div>
      <div class="p-price">$22.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-roast">Medium Roast</div>
        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" alt="Colombia Supremo" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Colombia Supremo</h3>
      <div class="p-notes">Caramel, Red Apple, Milk Chocolate</div>
      <div class="p-price">$20.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-roast">Dark Roast</div>
        <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80" alt="Brazil Santos" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Brazil Fazenda</h3>
      <div class="p-notes">Dark Cocoa, Hazelnut, Molasses</div>
      <div class="p-price">$19.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-roast">Espresso</div>
        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" alt="Signature Blend" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Signature Espresso</h3>
      <div class="p-notes">Dark Cherry, Toffee, Rich</div>
      <div class="p-price">$24.00</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
  </div>
</section>

<section class="sub-section">
  <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80" alt="Coffee Bags" class="skeleton sub-img" onload="this.classList.remove(\'skeleton\')">
  <div class="sub-content">
    <div class="hero-tag" style="color:var(--caramel);">Never Run Out</div>
    <h2>The Roaster's Subscription</h2>
    <p>Get freshly roasted coffee delivered on your schedule. Discover new single origins curated by our head roaster, or stick with your everyday favorites.</p>
    <div class="sub-steps">
      <div class="step">
        <div class="step-num">01 / Choose</div>
        <div class="step-text">Select your preferred roast profile or blend.</div>
      </div>
      <div class="step">
        <div class="step-num">02 / Grind</div>
        <div class="step-text">Whole bean or ground for your specific brewer.</div>
      </div>
      <div class="step">
        <div class="step-num">03 / Deliver</div>
        <div class="step-text">Roasted to order and shipped within 24 hours.</div>
      </div>
    </div>
    <div>
      <button class="btn-primary">Subscribe & Save 15%</button>
    </div>
  </div>
</section>

<section class="reviews">
  <div class="section-header" style="margin-bottom: 40px;">
    <div class="section-tag">Word of Mouth</div>
    <h2 class="section-title">Barista Approved</h2>
  </div>
  <div class="r-grid">
    <div class="r-card">
      <div class="r-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="r-text">"The Ethiopia Yirgacheffe is hands down the most floral and complex pour-over I've made at home. Absolutely stunning clarity."</div>
      <div class="r-author">James W.</div>
    </div>
    <div class="r-card">
      <div class="r-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="r-text">"As a former cafe owner, I'm extremely picky about my espresso blends. Origin's signature espresso pulls the thickest, richest crema."</div>
      <div class="r-author">Elena R.</div>
    </div>
    <div class="r-card">
      <div class="r-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="r-text">"The subscription is flawless. The beans always arrive precisely 3 days off-roast, right in the sweet spot for brewing."</div>
      <div class="r-author">Michael S.</div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">ORIGIN</div>
      <p class="f-desc">Elevating the morning ritual with ethically sourced, meticulously roasted specialty coffee.</p>
    </div>
    <div>
      <h4 class="f-title">Shop</h4>
      <ul class="f-links">
        <li><a href="#">All Coffee</a></li>
        <li><a href="#">Single Origin</a></li>
        <li><a href="#">Blends</a></li>
        <li><a href="#">Brew Gear</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Learn</h4>
      <ul class="f-links">
        <li><a href="#">Brewing Guides</a></li>
        <li><a href="#">Our Roastery</a></li>
        <li><a href="#">Sourcing</a></li>
        <li><a href="#">Wholesale</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Newsletter</h4>
      <p class="f-desc" style="margin-bottom: 0;">Sign up for exclusive releases and brewing tips.</p>
      <div class="n-form">
        <input type="email" placeholder="Email Address">
        <button>Submit</button>
      </div>
    </div>
  </div>
  <div class="f-bottom">
    &copy; 2026 ORIGIN COFFEE ROASTERS. ALL RIGHTS RESERVED.
  </div>
</footer>

</body>
</html>`,
  "beauty-cosmetics": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PURA | Clean Beauty</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --off-white: #FAF8F6;
  --blush: #F2D9D5;
  --dusty-rose: #C4887A;
  --espresso: #2C1B18;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: var(--off-white); color: var(--espresso); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .display-font { font-family: 'Italiana', serif; font-weight: 400; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 25px 60px; background: rgba(250, 248, 246, 0.9); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(44, 27, 24, 0.1); }
.brand { font-family: 'Italiana', serif; font-size: 36px; letter-spacing: 4px; color: var(--espresso); }
.nav-links { display: flex; gap: 40px; list-style: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; font-weight: 500; }
.nav-links li:hover { color: var(--dusty-rose); cursor: pointer; transition: color 0.3s; }
.header-actions { display: flex; gap: 24px; align-items: center; }
.header-actions svg { width: 20px; height: 20px; stroke: var(--espresso); stroke-width: 1.5; fill: none; cursor: pointer; transition: stroke 0.3s; }
.header-actions svg:hover { stroke: var(--dusty-rose); }

/* HERO */
.hero { display: flex; height: 85vh; padding: 0 60px 60px; gap: 60px; align-items: center; }
.hero-content { width: 45%; }
.hero-subtitle { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; color: var(--dusty-rose); font-weight: 600; }
.hero h1 { font-size: 80px; line-height: 1; margin-bottom: 30px; letter-spacing: -1px; }
.hero p { font-size: 18px; line-height: 1.6; margin-bottom: 40px; color: #555; max-width: 400px; }
.btn-primary { display: inline-block; background: var(--espresso); color: var(--off-white); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; padding: 18px 40px; border: none; cursor: pointer; transition: background 0.3s; }
.btn-primary:hover { background: var(--dusty-rose); }
.hero-image { width: 55%; height: 100%; position: relative; }
.hero-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 200px 200px 0 0; }

/* BADGES */
.badges { display: flex; justify-content: center; gap: 80px; padding: 60px; background: var(--blush); }
.badge-item { display: flex; flex-direction: column; align-items: center; gap: 15px; text-align: center; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
.badge-item svg { width: 40px; height: 40px; stroke: var(--espresso); stroke-width: 1.2; fill: none; }

/* PRODUCTS */
.products { padding: 100px 60px; }
.section-header { text-align: center; margin-bottom: 60px; }
.section-title { font-size: 56px; margin-bottom: 15px; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.p-card { text-align: center; cursor: pointer; group; }
.p-img-box { height: 350px; background: #fff; border-radius: 150px 150px 0 0; overflow: hidden; margin-bottom: 24px; position: relative; }
.p-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
.p-card:hover .p-img-box img { transform: scale(1.05); }
.p-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.9); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; font-weight: 600; }
.p-title { font-size: 20px; font-weight: 500; margin-bottom: 8px; font-family: 'Italiana', serif; }
.p-type { font-size: 13px; color: #777; margin-bottom: 12px; }
.p-price { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
.btn-outline { background: transparent; border: 1px solid var(--espresso); color: var(--espresso); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 12px 30px; border-radius: 50px; transition: all 0.3s; cursor: pointer; }
.btn-outline:hover { background: var(--espresso); color: var(--off-white); }

/* QUIZ CTA */
.quiz-section { background: var(--dusty-rose); display: flex; color: var(--off-white); }
.quiz-img { width: 50%; object-fit: cover; }
.quiz-content { width: 50%; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; }
.quiz-content h2 { font-size: 64px; margin-bottom: 24px; line-height: 1.1; }
.quiz-content p { font-size: 18px; line-height: 1.6; margin-bottom: 40px; max-width: 400px; }
.btn-white { display: inline-block; background: var(--off-white); color: var(--espresso); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; padding: 18px 40px; border: none; cursor: pointer; transition: opacity 0.3s; font-weight: 600; }
.btn-white:hover { opacity: 0.9; }

/* TESTIMONIALS / BEFORE AFTER */
.testimonials { padding: 100px 60px; text-align: center; }
.t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
.t-card { background: #fff; padding: 40px; border-radius: 20px; text-align: left; }
.t-stars { color: var(--dusty-rose); font-size: 18px; margin-bottom: 20px; letter-spacing: 2px; }
.t-text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; font-style: italic; color: #555; }
.t-author { font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }

/* STORY / REFILLABLE */
.story { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 100px 60px; background: var(--blush); margin: 0 60px 60px; border-radius: 40px; }
.story h2 { font-size: 48px; margin-bottom: 24px; }
.story p { font-size: 18px; max-width: 600px; line-height: 1.6; margin-bottom: 40px; color: #555; }
.story-image { width: 100%; max-width: 800px; height: 400px; object-fit: cover; border-radius: 20px; margin-top: 20px; }

/* FOOTER */
.footer { background: var(--espresso); color: rgba(250, 248, 246, 0.7); padding: 80px 60px 40px; }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 80px; }
.f-brand { font-family: 'Italiana', serif; font-size: 40px; letter-spacing: 4px; color: var(--off-white); margin-bottom: 24px; }
.f-desc { font-size: 14px; line-height: 1.6; max-width: 300px; }
.f-title { font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--off-white); margin-bottom: 30px; font-weight: 600; }
.f-links { list-style: none; }
.f-links li { margin-bottom: 16px; }
.f-links a { font-size: 14px; transition: color 0.3s; }
.f-links a:hover { color: var(--dusty-rose); }
.n-form { border-bottom: 1px solid rgba(250, 248, 246, 0.3); padding-bottom: 10px; display: flex; }
.n-form input { flex: 1; background: transparent; border: none; color: var(--off-white); font-size: 14px; outline: none; }
.n-form input::placeholder { color: rgba(250, 248, 246, 0.5); }
.n-form button { background: transparent; border: none; color: var(--dusty-rose); font-size: 13px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; font-weight: 600; }
.f-bottom { text-align: center; padding-top: 40px; border-top: 1px solid rgba(250, 248, 246, 0.1); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero { flex-direction: column; height: auto; text-align: center; }
  .hero-content, .hero-image { width: 100%; }
  .hero-image { height: 500px; border-radius: 100px 100px 0 0; }
  .hero p { margin: 0 auto 40px; }
  .badges { flex-wrap: wrap; gap: 40px; }
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .quiz-section { flex-direction: column; }
  .quiz-img, .quiz-content { width: 100%; }
  .quiz-img { height: 400px; }
  .story { margin: 0 20px 40px; padding: 60px 30px; }
  .t-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .header { padding: 20px; }
  .hero { padding: 0 20px 40px; }
  .hero h1 { font-size: 60px; }
  .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<header class="header">
  <div class="brand">PURA</div>
  <ul class="nav-links">
    <li>Skincare</li>
    <li>Makeup</li>
    <li>Sets</li>
    <li>About</li>
  </ul>
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <div class="hero-subtitle">The New Standard</div>
    <h1>Effortless glowing skin.</h1>
    <p>A curated collection of clean, effective beauty essentials designed to let your natural skin shine through.</p>
    <button class="btn-primary">Shop The Collection</button>
  </div>
  <div class="hero-image">
    <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80" alt="Model with glowing skin" class="skeleton" onload="this.classList.remove(\'skeleton\')">
  </div>
</section>

<div class="badges">
  <div class="badge-item">
    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    Cruelty Free
  </div>
  <div class="badge-item">
    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    100% Vegan
  </div>
  <div class="badge-item">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
    No Parabens
  </div>
  <div class="badge-item">
    <svg viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>
    Dermatologist Tested
  </div>
</div>

<section class="products">
  <div class="section-header">
    <h2 class="section-title">Daily Essentials</h2>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">Award Winner</span>
        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" alt="Dewy Serum" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">The Dewy Serum</h3>
      <div class="p-type">Hydration + Plumping</div>
      <div class="p-price">$48.00</div>
      <button class="btn-outline">Add to Bag</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1487700160041-babef9c3cb55?auto=format&fit=crop&w=600&q=80" alt="Milky Cleanser" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Milky Jelly Cleanser</h3>
      <div class="p-type">Gentle Daily Wash</div>
      <div class="p-price">$22.00</div>
      <button class="btn-outline">Add to Bag</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <span class="p-badge">New</span>
        <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" alt="Cloud Cream" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Cloud Barrier Cream</h3>
      <div class="p-type">Deep Moisture</div>
      <div class="p-price">$38.00</div>
      <button class="btn-outline">Add to Bag</button>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" alt="Lip Oil" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Peptide Lip Balm</h3>
      <div class="p-type">Nourish + Shine</div>
      <div class="p-price">$16.00</div>
      <button class="btn-outline">Add to Bag</button>
    </div>
  </div>
</section>

<section class="quiz-section">
  <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80" alt="Skincare Texture" class="skeleton quiz-img" onload="this.classList.remove(\'skeleton\')">
  <div class="quiz-content">
    <h2>Not sure where<br>to start?</h2>
    <p>Take our 2-minute skin consultation to build a personalized routine perfectly tailored to your unique skin type and goals.</p>
    <div>
      <button class="btn-white">Take The Quiz</button>
    </div>
  </div>
</section>

<section class="story">
  <h2>Beautiful on the outside.<br>Sustainable on the inside.</h2>
  <p>Our packaging is designed to be kept, not thrown away. Our new refill system reduces plastic waste by 90% while keeping your vanity looking beautiful.</p>
  <img src="https://images.unsplash.com/photo-1556228578-8d89b6acd8f1?auto=format&fit=crop&w=1200&q=80" alt="Sustainable Packaging" class="skeleton story-image" onload="this.classList.remove(\'skeleton\')">
</section>

<section class="testimonials">
  <h2 class="section-title">Real Results</h2>
  <div class="t-grid">
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"The Dewy Serum completely transformed my skin texture in just two weeks. I've never received so many compliments on my skin before."</div>
      <div class="t-author">Amanda S.</div>
    </div>
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"Finally a clean beauty brand that actually performs. The barrier cream is rich without breaking me out. Absolutely essential for winter."</div>
      <div class="t-author">Chloe T.</div>
    </div>
    <div class="t-card">
      <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div class="t-text">"I replaced my entire expensive 10-step routine with just the cleanser, serum, and cream from Pura. My skin has never looked better or felt calmer."</div>
      <div class="t-author">Rachel M.</div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">PURA</div>
      <p class="f-desc">Consciously crafted skincare for a radiant, effortless glow.</p>
    </div>
    <div>
      <h4 class="f-title">Shop</h4>
      <ul class="f-links">
        <li><a href="#">All Products</a></li>
        <li><a href="#">Skincare</a></li>
        <li><a href="#">Makeup</a></li>
        <li><a href="#">Refills</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Information</h4>
      <ul class="f-links">
        <li><a href="#">Our Story</a></li>
        <li><a href="#">Ingredients</a></li>
        <li><a href="#">Sustainability</a></li>
        <li><a href="#">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Join The Club</h4>
      <p class="f-desc" style="margin-bottom: 20px;">Subscribe to receive 15% off your first order.</p>
      <div class="n-form">
        <input type="email" placeholder="Your email address">
        <button>Subscribe</button>
      </div>
    </div>
  </div>
  <div class="f-bottom">
    &copy; 2026 PURA CLEAN BEAUTY. ALL RIGHTS RESERVED.
  </div>
</footer>

</body>
</html>`,
  "jewellery-heritage": \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MEENAKSHI | Heritage Bridal Jewellery</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --crimson: #8B1A2C;
  --rosegold: #C89B72;
  --ivory: #FDFAF5;
  --antiquegold: #BF9B46;
  --dark: #2A1518;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Cormorant Garamond', serif; background: var(--ivory); color: var(--dark); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .display-font { font-family: 'Cinzel Decorative', cursive; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header { display: flex; justify-content: space-between; align-items: center; padding: 25px 80px; background: rgba(253, 250, 245, 0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(191, 155, 70, 0.3); }
.brand { font-size: 32px; font-weight: 700; color: var(--crimson); letter-spacing: 4px; text-align: center; }
.brand span { display: block; font-family: 'Cormorant Garamond', serif; font-size: 11px; letter-spacing: 6px; text-transform: uppercase; color: var(--antiquegold); margin-top: 5px; }
.nav-links { display: flex; gap: 40px; list-style: none; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
.nav-links li { position: relative; cursor: pointer; transition: color 0.3s; }
.nav-links li:hover, .nav-links li.active { color: var(--crimson); }
.nav-links li.active::after { content: '♦'; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--antiquegold); }
.header-actions { display: flex; gap: 24px; align-items: center; }
.header-actions svg { width: 22px; height: 22px; fill: var(--dark); cursor: pointer; transition: fill 0.3s; }
.header-actions svg:hover { fill: var(--crimson); }

/* HERO */
.hero { height: 90vh; display: flex; align-items: center; position: relative; overflow: hidden; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; filter: brightness(0.7); }
.hero-content { position: relative; z-index: 2; width: 100%; text-align: center; color: #fff; padding: 0 20px; }
.hero-tag { font-family: 'Cormorant Garamond', serif; font-size: 14px; letter-spacing: 6px; text-transform: uppercase; color: var(--rosegold); margin-bottom: 20px; }
.hero h1 { font-size: 84px; line-height: 1.1; margin-bottom: 30px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.btn-primary { display: inline-block; background: var(--crimson); color: var(--ivory); font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; padding: 18px 48px; border: 1px solid var(--crimson); cursor: pointer; transition: all 0.4s; }
.btn-primary:hover { background: transparent; border-color: var(--ivory); }

/* OCCASION FILTERS */
.filters { display: flex; justify-content: center; gap: 40px; padding: 60px 20px; background: var(--ivory); border-bottom: 1px solid rgba(191, 155, 70, 0.2); }
.f-item { text-align: center; cursor: pointer; transition: transform 0.3s; }
.f-item:hover { transform: translateY(-5px); }
.f-img { width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--antiquegold); padding: 4px; margin-bottom: 15px; }
.f-img img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.f-title { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--dark); }

/* PRODUCTS */
.products { padding: 100px 80px; }
.section-header { text-align: center; margin-bottom: 80px; }
.section-title { font-size: 48px; color: var(--crimson); margin-bottom: 15px; }
.section-subtitle { font-size: 18px; color: #666; font-style: italic; }

.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.p-card { text-align: center; cursor: pointer; group; }
.p-img-box { height: 350px; background: #fff; padding: 20px; border: 1px solid rgba(191, 155, 70, 0.2); margin-bottom: 24px; position: relative; overflow: hidden; transition: border-color 0.4s; }
.p-card:hover .p-img-box { border-color: var(--antiquegold); }
.p-img-box img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.8s ease; }
.p-card:hover .p-img-box img { transform: scale(1.08); }
.p-badge { position: absolute; top: 15px; right: 15px; background: var(--crimson); color: var(--ivory); font-family: 'Cormorant Garamond', serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; padding: 6px 12px; }
.p-title { font-family: 'Cinzel Decorative', cursive; font-size: 20px; color: var(--dark); margin-bottom: 10px; }
.p-desc { font-size: 14px; color: #666; font-style: italic; margin-bottom: 15px; }
.p-price { font-size: 18px; font-weight: 600; color: var(--crimson); }
.btn-outline { width: 100%; background: transparent; border: 1px solid var(--antiquegold); color: var(--antiquegold); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; padding: 15px; margin-top: 20px; cursor: pointer; transition: all 0.4s; }
.btn-outline:hover { background: var(--antiquegold); color: var(--ivory); }

/* HERITAGE STORY */
.heritage { display: flex; padding: 120px 80px; background: var(--dark); color: var(--ivory); position: relative; }
.heritage::before { content: ''; position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1px solid rgba(200, 155, 114, 0.2); pointer-events: none; }
.h-content { width: 50%; padding-right: 80px; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; }
.h-icon { font-size: 40px; color: var(--antiquegold); margin-bottom: 20px; }
.h-title { font-size: 56px; margin-bottom: 30px; color: var(--rosegold); line-height: 1.1; }
.h-text { font-size: 18px; line-height: 1.8; margin-bottom: 40px; color: #ccc; }
.h-img-grid { width: 50%; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; position: relative; z-index: 2; }
.h-img { width: 100%; height: 300px; object-fit: cover; border: 4px solid var(--ivory); }
.h-img:nth-child(2) { transform: translateY(40px); }

/* REGIONAL COLLECTIONS */
.collections { padding: 100px 80px; text-align: center; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgxOTEsIDE1NSwgNzAsIDAuMikiLz48L3N2Zz4=') var(--ivory); }
.c-tabs { display: flex; justify-content: center; gap: 40px; margin-bottom: 60px; border-bottom: 1px solid rgba(191, 155, 70, 0.3); padding-bottom: 20px; }
.c-tab { font-family: 'Cinzel Decorative', cursive; font-size: 20px; color: #999; cursor: pointer; transition: color 0.3s; position: relative; }
.c-tab.active { color: var(--crimson); }
.c-tab.active::after { content: ''; position: absolute; bottom: -21px; left: 0; width: 100%; height: 2px; background: var(--crimson); }
.c-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; text-align: left; align-items: center; }
.c-showcase-img { width: 100%; height: 500px; object-fit: cover; border-radius: 200px 200px 0 0; border: 1px solid var(--antiquegold); padding: 10px; }
.c-showcase-content h3 { font-size: 40px; color: var(--crimson); margin-bottom: 20px; }
.c-showcase-content p { font-size: 18px; line-height: 1.6; color: #555; margin-bottom: 30px; }

/* TRUST & CERTIFICATIONS */
.trust { display: flex; justify-content: center; gap: 80px; padding: 60px 20px; border-top: 1px solid rgba(191, 155, 70, 0.2); background: #fff; }
.trust-item { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 200px; }
.trust-icon { width: 50px; height: 50px; border-radius: 50%; background: var(--ivory); display: flex; align-items: center; justify-content: center; border: 1px solid var(--antiquegold); margin-bottom: 15px; font-size: 20px; color: var(--crimson); }
.trust-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--dark); margin-bottom: 8px; }
.trust-desc { font-size: 12px; color: #777; font-style: italic; }

/* FOOTER */
.footer { background: var(--dark); color: var(--ivory); padding: 80px 80px 40px; text-align: center; }
.footer-logo { font-size: 48px; color: var(--antiquegold); margin-bottom: 30px; letter-spacing: 6px; }
.footer-links { display: flex; justify-content: center; gap: 40px; list-style: none; margin-bottom: 40px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
.footer-links a { transition: color 0.3s; }
.footer-links a:hover { color: var(--rosegold); }
.social-icons { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
.social-icons svg { width: 24px; height: 24px; fill: var(--ivory); transition: fill 0.3s; cursor: pointer; }
.social-icons svg:hover { fill: var(--antiquegold); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero h1 { font-size: 64px; }
  .p-grid { grid-template-columns: repeat(2, 1fr); }
  .heritage { flex-direction: column; padding: 60px 40px; }
  .h-content, .h-img-grid { width: 100%; padding: 0; }
  .h-img-grid { margin-top: 40px; }
  .c-grid { grid-template-columns: 1fr; }
  .c-showcase-img { height: 400px; }
  .trust { flex-wrap: wrap; gap: 40px; }
}
@media(max-width: 768px) {
  .header { padding: 20px; }
  .nav-links { display: none; }
  .hero h1 { font-size: 48px; }
  .filters { flex-wrap: wrap; gap: 20px; }
  .p-grid { grid-template-columns: 1fr; }
  .c-tabs { flex-wrap: wrap; }
  .footer-links { flex-wrap: wrap; gap: 20px; }
}
</style>
</head>
<body>

<header class="header">
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
  </div>
  <ul class="nav-links">
    <li>Bridal</li>
    <li class="active">Heritage</li>
    <li>Collections</li>
  </ul>
  <div class="brand display-font">
    Meenakshi
    <span>Since 1952</span>
  </div>
  <ul class="nav-links">
    <li>Our Story</li>
    <li>Boutiques</li>
  </ul>
  <div class="header-actions">
    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
  </div>
</header>

<section class="hero">
  <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=2000&q=80" alt="Bridal Jewellery Hero" class="skeleton hero-bg" onload="this.classList.remove(\'skeleton\')">
  <div class="hero-content">
    <div class="hero-tag">The Royal Trousseau</div>
    <h1 class="display-font">Elegance Woven<br>in Pure Gold</h1>
    <button class="btn-primary">Explore The Collection</button>
  </div>
</section>

<div class="filters">
  <div class="f-item">
    <div class="f-img"><img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=300&q=80" alt="Bridal" class="skeleton" onload="this.classList.remove(\'skeleton\')"></div>
    <div class="f-title">Bridal</div>
  </div>
  <div class="f-item">
    <div class="f-img"><img src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80" alt="Engagement" class="skeleton" onload="this.classList.remove(\'skeleton\')"></div>
    <div class="f-title">Engagement</div>
  </div>
  <div class="f-item">
    <div class="f-img"><img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=300&q=80" alt="Sangeet" class="skeleton" onload="this.classList.remove(\'skeleton\')"></div>
    <div class="f-title">Sangeet</div>
  </div>
  <div class="f-item">
    <div class="f-img"><img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80" alt="Festival" class="skeleton" onload="this.classList.remove(\'skeleton\')"></div>
    <div class="f-title">Festival</div>
  </div>
</div>

<section class="products">
  <div class="section-header">
    <h2 class="section-title display-font">The Heritage Masterpieces</h2>
    <p class="section-subtitle">Exquisite designs handcrafted by master artisans, preserving centuries of Indian tradition.</p>
  </div>
  
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-badge">Kundan</div>
        <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" alt="Necklace" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">The Rajwada Choker</h3>
      <p class="p-desc">22k Gold with Uncut Diamonds</p>
      <div class="p-price">Price on Request</div>
      <button class="btn-outline">Book Appointment</button>
    </div>
    
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80" alt="Earrings" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Jadau Chaandbaali</h3>
      <p class="p-desc">18k Gold with Polki & Pearls</p>
      <div class="p-price">$4,500</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80" alt="Bangles" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Meenakari Kadas</h3>
      <p class="p-desc">22k Antique Gold with Enamel</p>
      <div class="p-price">$3,200</div>
      <button class="btn-outline">Add to Cart</button>
    </div>
    
    <div class="p-card">
      <div class="p-img-box">
        <div class="p-badge">Temple</div>
        <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80" alt="Haaram" class="skeleton" onload="this.classList.remove(\'skeleton\')">
      </div>
      <h3 class="p-title">Lakshmi Haaram</h3>
      <p class="p-desc">22k Yellow Gold with Rubies</p>
      <div class="p-price">Price on Request</div>
      <button class="btn-outline">Book Appointment</button>
    </div>
  </div>
</section>

<section class="heritage">
  <div class="h-content">
    <div class="h-icon">&#10047;</div>
    <h2 class="h-title display-font">A Legacy of<br>Excellence</h2>
    <p class="h-text">Since 1952, Meenakshi Jewellers has been the custodian of India's finest jewellery-making traditions. What began as a small atelier in Jaipur has blossomed into a legendary house of design, trusted by generations of royal families and modern brides alike.</p>
    <p class="h-text">Every piece is painstakingly handcrafted by our master 'karigars' (artisans), some of whom have been with our family for over three generations. We blend the intricate artistry of the past with the refined aesthetics of the present.</p>
    <div>
      <button class="btn-primary" style="background: transparent; border-color: var(--antiquegold); color: var(--antiquegold);">Discover Our History</button>
    </div>
  </div>
  <div class="h-img-grid">
    <img src="https://images.unsplash.com/photo-1599643478514-4a4e0a4f5424?auto=format&fit=crop&w=600&q=80" alt="Artisan working" class="skeleton h-img" onload="this.classList.remove(\'skeleton\')">
    <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80" alt="Vintage Jewellery" class="skeleton h-img" onload="this.classList.remove(\'skeleton\')">
  </div>
</section>

<section class="collections">
  <div class="c-tabs">
    <div class="c-tab active">The Rajasthani Collection</div>
    <div class="c-tab">The Mughal Era</div>
    <div class="c-tab">Temple Architecture</div>
  </div>
  
  <div class="c-grid">
    <div class="c-showcase-img-box">
      <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" alt="Rajasthani Jewellery" class="skeleton c-showcase-img" onload="this.classList.remove(\'skeleton\')">
    </div>
    <div class="c-showcase-content">
      <h3 class="display-font">The Royal Courts of Rajputana</h3>
      <p>Inspired by the magnificent palaces of Jaipur and Jodhpur, this collection showcases the pinnacle of Kundan and Meenakari art. Featuring spectacular uncut diamonds (Polki) set in 24k gold foil, the reverse of each piece is adorned with vibrant enamel work.</p>
      <p>Designed for the bride who desires the regal grandeur of a bygone era.</p>
      <button class="btn-outline" style="width: auto; padding: 15px 40px; margin-top: 20px;">Explore Collection</button>
    </div>
  </div>
</section>

<div class="trust">
  <div class="trust-item">
    <div class="trust-icon">BIS</div>
    <div class="trust-title">100% Hallmarked</div>
    <div class="trust-desc">Certified purity of gold</div>
  </div>
  <div class="trust-item">
    <div class="trust-icon">&#9830;</div>
    <div class="trust-title">IGI Certified</div>
    <div class="trust-desc">Ethically sourced diamonds</div>
  </div>
  <div class="trust-item">
    <div class="trust-icon">&#9998;</div>
    <div class="trust-title">Handcrafted</div>
    <div class="trust-desc">By heritage artisans</div>
  </div>
  <div class="trust-item">
    <div class="trust-icon">&#10003;</div>
    <div class="trust-title">Lifetime Buyback</div>
    <div class="trust-desc">100% exchange value</div>
  </div>
</div>

<footer class="footer">
  <div class="footer-logo display-font">MEENAKSHI</div>
  <ul class="footer-links">
    <li><a href="#">Bridal Appointments</a></li>
    <li><a href="#">Boutique Locations</a></li>
    <li><a href="#">Jewellery Care</a></li>
    <li><a href="#">Bespoke Services</a></li>
    <li><a href="#">Contact Us</a></li>
  </ul>
  <div class="social-icons">
    <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
  </div>
  <div class="footer-bottom">
    &copy; 2026 MEENAKSHI HERITAGE JEWELLERS. ALL RIGHTS RESERVED.
  </div>
</footer>

</body>
</html>`,
};
