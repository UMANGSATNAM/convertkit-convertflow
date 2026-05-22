export const TEMPLATE_HTMLS = {
  "electronics": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TechVault | Premium Tech Gadgets</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0B0F19;
  --surface: #131B2C;
  --surface-hover: #1A243A;
  --primary: #3B82F6;
  --primary-glow: rgba(59, 130, 246, 0.5);
  --text: #F8FAFC;
  --text-muted: #94A3B8;
  --border: #1E293B;
  --accent: #10B981;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Inter', sans-serif; font-size: 15px; -webkit-font-smoothing: antialiased; }
h1, h2, h3, .nav-logo { font-fxmily: 'Space Grotesk', sans-serif; }

/* PROMO BAR */
.promo-bar { background: var(--primary); color: #fff; padding: 10px 0; text-align: center; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }

/* HEADER / MEGA MENU */
header { position: sticky; top: 0; z-index: 100; background: rgba(11, 15, 25, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 0 40px; display: flex; align-items: center; justify-content: space-between; height: 80px; }
.nav-logo { font-size: 24px; font-weight: 700; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 8px; }
.nav-logo svg { width: 24px; height: 24px; color: var(--primary); }
.nav-links { display: flex; gap: 32px; height: 100%; list-style: none; }
.nav-links li { height: 100%; display: flex; align-items: center; }
.nav-links a { color: var(--text-muted); text-decoration: none; font-weight: 500; transition: color 0.2s; font-size: 14px; position: relative; }
.nav-links a:hover, .nav-links a.active { color: #fff; }
.MEGA-MENU { display: none; position: absolute; top: 80px; left: 0; width: 100%; background: var(--surface); border-bottom: 1px solid var(--border); padding: 40px; grid-template-columns: repeat(4, 1fr); gap: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
.nav-links li:hover .MEGA-MENU { display: grid; }
.mega-col h4 { color: #fff; font-size: 14px; margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase; color: var(--primary); }
.mega-col a { display: block; padding: 8px 0; color: var(--text-muted); font-size: 14px; }
.mega-col a:hover { color: #fff; padding-left: 5px; }

.header-actions { display: flex; gap: 20px; align-items: center; }
.icon-btn { background: none; border: none; color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
.icon-btn:hover { color: var(--primary); }

/* HERO */
.hero { min-height: 90vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 0 40px; }
.hero-bg { position: absolute; top: 50%; left: 80%; transform: translate(-50%, -50%); width: 800px; height: 800px; background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%); opacity: 0.15; z-index: 0; pointer-events: none; }
.hero-content { position: relative; z-index: 1; max-width: 600px; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--accent); margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase; }
.hero h1 { font-size: 80px; line-height: 1.1; margin-bottom: 24px; font-weight: 700; letter-spacing: -2px; }
.hero h1 span { color: var(--primary); }
.hero p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; line-height: 1.6; max-width: 500px; }
.btn-primary { background: var(--text); color: var(--bg); padding: 16px 32px; font-size: 15px; font-weight: 600; font-fxmily: 'Inter', sans-serif; cursor: pointer; border: none; border-radius: 4px; transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 8px; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }
.btn-secondary { background: transparent; color: var(--text); padding: 16px 32px; font-size: 15px; font-weight: 600; font-fxmily: 'Inter', sans-serif; cursor: pointer; border: 1px solid var(--border); border-radius: 4px; transition: background 0.2s; display: inline-flex; align-items: center; gap: 8px; margin-left: 16px; }
.btn-secondary:hover { background: var(--surface); }

/* STATS */
.trust-stats { display: flex; gap: 60px; margin-top: 60px; border-top: 1px solid var(--border); padding-top: 40px; }
.stat-item h4 { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.stat-item p { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

/* PRODUCTS (LIST STYLE) */
.section { padding: 100px 40px; max-width: 1400px; margin: 0 auto; }
.section-header { margin-bottom: 60px; text-align: center; }
.section-header h2 { font-size: 40px; font-weight: 700; margin-bottom: 16px; letter-spacing: -1px; }
.section-header p { color: var(--text-muted); font-size: 16px; max-width: 500px; margin: 0 auto; }

.product-list { display: flex; flex-direction: column; gap: 24px; }
.product-row { display: grid; grid-template-columns: 240px 1fr 300px; gap: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 24px; align-items: center; transition: border-color 0.2s; cursor: pointer; }
.product-row:hover { border-color: var(--primary); }
.p-image { width: 100%; aspect-ratio: 1; background: #000; border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.p-image svg { width: 64px; height: 64px; color: var(--primary); }

.p-info h3 { font-size: 24px; font-weight: 600; margin-bottom: 12px; }
.p-desc { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
.p-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.spec-box { background: var(--bg); padding: 10px; border-radius: 4px; border: 1px solid var(--border); }
.spec-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.spec-val { font-size: 14px; font-weight: 600; color: #fff; }

.p-action { text-align: right; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; }
.p-price { font-size: 32px; font-fxmily: 'Space Grotesk', sans-serif; font-weight: 700; margin-bottom: 8px; }
.p-price-old { color: var(--text-muted); text-decoration: line-through; font-size: 16px; margin-bottom: 24px; display: block; }
.btn-mono { width: 100%; background: var(--text); color: var(--bg); padding: 14px 20px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
.btn-mono:hover { opacity: 0.9; }

/* FEATURES GRID */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.feature-card { background: var(--surface); padding: 40px; border: 1px solid var(--border); border-radius: 8px; text-align: center; }
.feature-icon { width: 64px; height: 64px; background: rgba(59, 130, 246, 0.1); color: var(--primary); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
.feature-icon svg { width: 32px; height: 32px; }
.feature-card h3 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
.feature-card p { color: var(--text-muted); font-size: 14px; line-height: 1.6; }

/* SPEC DENSE FOOTER */
footer { background: var(--surface); border-top: 1px solid var(--border); padding: 80px 40px 40px; }
.footer-grid { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 60px; max-width: 1400px; margin: 0 auto 60px; }
.f-brand h4 { font-fxmily: 'Space Grotesk', sans-serif; font-size: 24px; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.f-brand p { color: var(--text-muted); font-size: 14px; line-height: 1.6; max-width: 300px; margin-bottom: 24px; }
.f-socials { display: flex; gap: 16px; }
.f-socials a { color: var(--text-muted); width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.f-socials a:hover { color: #fff; border-color: var(--primary); background: rgba(59, 130, 246, 0.1); }
.f-links h5 { color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 24px; }
.f-links ul { list-style: none; }
.f-links li { margin-bottom: 12px; }
.f-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.f-links a:hover { color: var(--primary); }

.footer-bottom { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding-top: 40px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-muted); }

/* STICKY ATC */
.sticky-atc { position: fixed; bottom: 0; left: 0; width: 100%; background: var(--bg); border-top: 1px solid var(--border); padding: 16px 40px; display: none; align-items: center; justify-content: space-between; z-index: 99; transform: translateY(100%); transition: transform 0.4s; }
.sticky-atc.show { display: flex; transform: translateY(0); }
.s-atc-l { display: flex; align-items: center; gap: 16px; }
.s-img { width: 48px; height: 48px; background: #000; border-radius: 4px; }
.s-info h4 { font-size: 15px; color: #fff; }
.s-info p { font-size: 13px; color: var(--text-muted); }
.s-atc-r { display: flex; align-items: center; gap: 24px; }
.s-price { font-size: 20px; font-weight: 700; font-fxmily: 'Space Grotesk', sans-serif; }

/* Responsive */
@media(max-width: 1024px) {
  .hero h1 { font-size: 60px; }
  .product-row { grid-template-columns: 1fr; gap: 24px; }
  .p-action { text-align: left; align-items: flex-start; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border); }
  .p-image { aspect-ratio: 2/1; }
  .features-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .hero { padding: 40px 20px; text-align: center; }
  .hero h1 { font-size: 40px; }
  .hero p { margin: 0 auto 32px; }
  .trust-stats { flex-direction: column; gap: 24px; align-items: center; }
  .p-specs { grid-template-columns: 1fr; }
  .btn-secondary { margin-left: 0; margin-top: 16px; width: 100%; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="promo-bar">⚡ Free Express Shipping on orders over \$150</div>

<header>
  <a data-href="#" class="nav-logo">
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    TechVault
  </a>
  <ul class="nav-links">
    <li>
      <a data-href="#" class="active">Audio</a>
      <div class="MEGA-MENU">
        <div class="mega-col">
          <h4>Headphones</h4>
          <a data-href="#">Over-Ear Wireless</a>
          <a data-href="#">Noise Cancelling</a>
          <a data-href="#">Studio Monitors</a>
          <a data-href="#">Gaming Headsets</a>
        </div>
        <div class="mega-col">
          <h4>Earbuds</h4>
          <a data-href="#">True Wireless</a>
          <a data-href="#">Sport Earbuds</a>
          <a data-href="#">Audiophile In-Ear</a>
        </div>
        <div class="mega-col">
          <h4>Speakers</h4>
          <a data-href="#">Portable Bluetooth</a>
          <a data-href="#">Home Theater</a>
          <a data-href="#">Soundbars</a>
        </div>
        <div class="mega-col">
          <div style="background:var(--bg);height:100%;border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);border:1px dashed var(--border)">Promo Image</div>
        </div>
      </div>
    </li>
    <li><a data-href="#">Computing</a></li>
    <li><a data-href="#">Wearables</a></li>
    <li><a data-href="#">Accessories</a></li>
  </ul>
  <div class="header-actions">
    <button class="icon-btn" aria-label="Search">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </button>
    <button class="icon-btn" aria-label="Cart">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    </button>
  </div>
</header>

<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <div class="hero-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"></path></svg> Next-Gen Audio Experience</div>
    <h1>Hear the Unseen.<br><span>Vertex Pro Max.</span></h1>
    <p>Engineered with dual-driver precision, adaptive ANC, and 40-hour battery life. The pinnacle of wireless audio has arrived. Experience silence.</p>
    <div>
      <button class="btn-primary">Pre-order Now <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></button>
      <button class="btn-secondary">View Specs</button>
    </div>
    <div class="trust-stats">
      <div class="stat-item"><h4>40h</h4><p>Playback Time</p></div>
      <div class="stat-item"><h4>50dB</h4><p>Noise Cancelation</p></div>
      <div class="stat-item"><h4>Hi-Res</h4><p>Audio Certified</p></div>
    </div>
  </div>
</section>

<section class="section" id="products">
  <div class="section-header">
    <h2>Elite Collection</h2>
    <p>Compare specifications across our flagship audio devices to find your perfect match.</p>
  </div>
  <div class="product-list">
    <!-- Item 1 -->
    <div class="product-row">
      <div class="p-image">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
      </div>
      <div class="p-info">
        <h3>Vertex Pro Max <span style="font-size:12px; background:var(--primary); color:#fff; padding:2px 8px; border-radius:4px; vertical-align:middle; margin-left:8px;">NEW</span></h3>
        <p class="p-desc">Flagship over-ear headphones featuring dual-driver acoustics and adaptive active noise cancelation for ultimate immersion.</p>
        <div class="p-specs">
          <div class="spec-box"><div class="spec-lbl">Battery</div><div class="spec-val">40 Hours</div></div>
          <div class="spec-box"><div class="spec-lbl">Weight</div><div class="spec-val">245g</div></div>
          <div class="spec-box"><div class="spec-lbl">Bluetooth</div><div class="spec-val">5.3 Multipoint</div></div>
        </div>
      </div>
      <div class="p-action">
        <span class="p-price">\$349.00</span>
        <button class="btn-mono">Add to Cart</button>
        <label style="margin-top:16px; font-size:13px; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
          <input type="checkbox" style="accent-color:var(--primary);"> Compare
        </label>
      </div>
    </div>
    <!-- Item 2 -->
    <div class="product-row">
      <div class="p-image">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
      </div>
      <div class="p-info">
        <h3>Vertex Pulse Buds</h3>
        <p class="p-desc">Ultra-compact true wireless earbuds with spatial audio capabilities and a transparent mode that rivals reality.</p>
        <div class="p-specs">
          <div class="spec-box"><div class="spec-lbl">Battery</div><div class="spec-val">24 Hours (with case)</div></div>
          <div class="spec-box"><div class="spec-lbl">Weight</div><div class="spec-val">4.5g / earbud</div></div>
          <div class="spec-box"><div class="spec-lbl">Waterproof</div><div class="spec-val">IPX5</div></div>
        </div>
      </div>
      <div class="p-action">
        <span class="p-price">\$199.00</span>
        <span class="p-price-old">\$229.00</span>
        <button class="btn-mono">Add to Cart</button>
        <label style="margin-top:16px; font-size:13px; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
          <input type="checkbox" style="accent-color:var(--primary);"> Compare
        </label>
      </div>
    </div>
    <!-- Item 3 -->
    <div class="product-row">
      <div class="p-image">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <div class="p-info">
        <h3>Sonic Studio Monitors</h3>
        <p class="p-desc">Professional-grade desktop monitors engineered for sound engineers and audiophiles requiring uncolored sound.</p>
        <div class="p-specs">
          <div class="spec-box"><div class="spec-lbl">Response</div><div class="spec-val">42Hz - 20kHz</div></div>
          <div class="spec-box"><div class="spec-lbl">Amplifier</div><div class="spec-val">Class-D (80W)</div></div>
          <div class="spec-box"><div class="spec-lbl">Input</div><div class="spec-val">Balanced TRS/XLR</div></div>
        </div>
      </div>
      <div class="p-action">
        <span class="p-price">\$499.00</span>
        <button class="btn-mono">Add to Cart</button>
        <label style="margin-top:16px; font-size:13px; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
          <input type="checkbox" style="accent-color:var(--primary);"> Compare
        </label>
      </div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
  <div class="section-header">
    <h2>Why TechVault?</h2>
    <p>Engineered for the discerning. Built to outlast.</p>
  </div>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
      <h3>3-Year Global Warranty</h3>
      <p>Every product is backed by our comprehensive warranty, ensuring your investment is protected worldwide.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
      <h3>Next-Day Delivery</h3>
      <p>Order before 4 PM in major metro areas and receive your audio gear the very next morning.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></div>
      <h3>30-Day Audition</h3>
      <p>We know audio is personal. Audition our gear for 30 days. If it's not perfect, returns are completely free.</p>
    </div>
  </div>
</section>

<footer>
  <div class="footer-grid">
    <div class="f-brand">
      <h4><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> TechVault</h4>
      <p>Pushing the boundaries of acoustics and electronics. Designing the future of sound since 2018.</p>
      <div class="f-socials">
        <a data-href="#" aria-label="Twitter"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
        <a data-href="#" aria-label="Instagram"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
      </div>
    </div>
    <div class="f-links">
      <h5>Products</h5>
      <ul><li><a data-href="#">Headphones</a></li><li><a data-href="#">Earbuds</a></li><li><a data-href="#">Speakers</a></li><li><a data-href="#">Accessories</a></li></ul>
    </div>
    <div class="f-links">
      <h5>Support</h5>
      <ul><li><a data-href="#">Help Center</a></li><li><a data-href="#">Track Order</a></li><li><a data-href="#">Warranty</a></li><li><a data-href="#">Returns</a></li></ul>
    </div>
    <div class="f-links">
      <h5>About</h5>
      <ul><li><a data-href="#">Our Story</a></li><li><a data-href="#">Careers</a></li><li><a data-href="#">Press</a></li><li><a data-href="#">Contact</a></li></ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 TechVault Inc. All rights reserved.</p>
    <div style="display:flex;gap:16px;">
      <a data-href="javascript:void(0)" style="color:var(--text-muted);text-decoration:none">Privacy Policy</a>
      <a data-href="javascript:void(0)" style="color:var(--text-muted);text-decoration:none">Terms of Service</a>
    </div>
  </div>
</footer>

<div class="sticky-atc" id="stickyATC">
  <div class="s-atc-l">
    <div class="s-img"><svg fill="none" stroke="#fff" viewBox="0 0 24 24" style="width:100%;height:100%;padding:10px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div>
    <div class="s-info">
      <h4>Vertex Pro Max</h4>
      <p>Pre-order (Ships in 2 weeks)</p>
    </div>
  </div>
  <div class="s-atc-r">
    <div class="s-price">\$349.00</div>
    <button class="btn-mono" style="width:auto">Add to Cart</button>
  </div>
</div>

<script>
  window.addEventListener('scroll', () => {
    const atc = document.getElementById('stickyATC');
    const hero = document.querySelector('.hero');
    if (window.scrollY > hero.offsetHeight / 2) {
      atc.classList.add('show');
    } else {
      atc.classList.remove('show');
    }
  });

  // Polyfill for smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "home-decor": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aura | Curated Home Decor</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@200;300;400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #FDFBF7;
  --text: #2C2C2A;
  --sage: #8F9779;
  --ivory: #FAF9F6;
  --clay: #C2A894;
  --border: #E8E5DF;
  --light-gray: #F2EFE9;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Montserrat', sans-serif; font-size: 14px; line-height: 1.6; font-weight: 300; }
h1, h2, h3, h4, .serif { font-fxmily: 'Cormorant Garamond', serif; }

/* HEADER */
header { position: absolute; top: 0; left: 0; width: 100%; padding: 30px 60px; z-index: 10; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); }
.nav-left { display: flex; gap: 40px; list-style: none; }
.nav-left a { color: #fff; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; transition: opacity 0.3s; }
.nav-left a:hover { opacity: 0.7; }
.logo { font-fxmily: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 500; color: #fff; text-decoration: none; text-align: center; letter-spacing: 4px; }
.nav-right { display: flex; justify-content: flex-end; gap: 30px; }
.icon-link { color: #fff; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 6px; }
.icon-link:hover { opacity: 0.7; }

/* HERO */
.hero { height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000; }
.hero-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.85; filter: brightness(0.85); }
.hero-content { position: relative; z-index: 2; text-align: center; color: #fff; max-width: 800px; padding: 0 40px; }
.hero-sub { font-size: 12px; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px; display: block; }
.hero-title { font-size: clamp(60px, 8vw, 100px); font-weight: 400; line-height: 1; margin-bottom: 40px; }
.hero-title em { font-style: italic; color: #E8E5DF; font-weight: 300; }
.btn-outline-light { border: 1px solid #fff; color: #fff; background: transparent; padding: 18px 48px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.4s ease; font-fxmily: 'Montserrat', sans-serif; }
.btn-outline-light:hover { background: #fff; color: var(--text); }

/* MASONRY PRODUCTS */
.collection { padding: 120px 60px; max-width: 1600px; margin: 0 auto; }
.collection-header { text-align: center; margin-bottom: 80px; }
.collection-header h2 { font-size: 48px; font-weight: 300; margin-bottom: 16px; }
.collection-header p { font-size: 14px; max-width: 500px; margin: 0 auto; color: #666; }

.masonry-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.masonry-item { position: relative; text-decoration: none; color: var(--text); display: block; group; margin-bottom: 40px; }
.masonry-item.large { grid-row: span 2; }
.m-img-wrapper { position: relative; overflow: hidden; background: var(--light-gray); margin-bottom: 20px; }
/* Simulating images with soft gradients */
.m-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; display: block; }
.masonry-item:hover .m-img { transform: scale(1.03); }

/* Floating action on hover */
.m-action { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px); opacity: 0; background: #fff; padding: 14px 32px; border-radius: 40px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 400; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s ease; display: flex; align-items: center; gap: 8px; width: max-content; }
.masonry-item:hover .m-action { transform: translateX(-50%) translateY(0); opacity: 1; }

.m-info { text-align: center; }
.m-title { font-size: 18px; font-weight: 400; margin-bottom: 6px; font-fxmily: 'Cormorant Garamond', serif; }
.m-price { font-size: 13px; color: #777; font-weight: 300; }

/* LOOKBOOK BANNER */
.lookbook { display: grid; grid-template-columns: 1fr 1fr; height: 80vh; margin: 60px 0; }
.lb-img { background: var(--sage); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.lb-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(0,0,0,0.1)); }
.lb-content { padding: 100px; display: flex; flex-direction: column; justify-content: center; background: var(--ivory); }
.lb-content h2 { font-size: 56px; font-weight: 300; margin-bottom: 24px; line-height: 1.1; }
.lb-content p { font-size: 15px; margin-bottom: 40px; max-width: 400px; line-height: 1.8; color: #555; }
.link-underline { text-decoration: none; color: var(--text); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; position: relative; padding-bottom: 4px; display: inline-block; width: max-content; }
.link-underline::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.4s ease; }
.link-underline:hover::after { transform: scaleX(1); transform-origin: left; }

/* FEATURES */
.features-band { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 80px 0; background: #fff; }
.features-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 60px; }
.feature { display: flex; flex-direction: column; align-items: center; }
.f-icon { width: 32px; height: 32px; margin-bottom: 20px; color: var(--clay); }
.feature h4 { font-size: 20px; font-weight: 400; margin-bottom: 12px; }
.feature p { font-size: 13px; color: #666; max-width: 240px; }

/* FOOTER */
footer { padding: 100px 60px 40px; background: var(--text); color: var(--ivory); }
.footer-top { max-width: 1600px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 100px; }
.footer-brand .logo { margin-bottom: 24px; text-align: left; letter-spacing: 2px; font-size: 40px; }
.footer-brand p { font-size: 13px; opacity: 0.6; max-width: 300px; line-height: 1.8; }
.footer-nav { display: grid; grid-template-columns: repeat(3, 1fr); gap: 80px; }
.footer-col h5 { font-fxmily: 'Montserrat', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; opacity: 0.5; font-weight: 400; }
.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 16px; }
.footer-col a { color: var(--ivory); text-decoration: none; font-size: 13px; opacity: 0.8; transition: opacity 0.3s; font-weight: 300; }
.footer-col a:hover { opacity: 1; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; max-width: 1600px; margin: 0 auto; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .masonry-grid { grid-template-columns: repeat(2, 1fr); }
  .lookbook { grid-template-columns: 1fr; height: auto; }
  .lb-img { height: 400px; }
  .lb-content { padding: 60px 40px; }
  .footer-top { flex-direction: column; gap: 60px; }
}
@media(max-width: 768px) {
  header { padding: 20px; grid-template-columns: 1fr 1fr; }
  .nav-left { display: none; }
  .logo { font-size: 24px; text-align: left; }
  .hero-title { font-size: 50px; }
  .collection { padding: 80px 20px; }
  .masonry-grid { grid-template-columns: 1fr; gap: 20px; }
  .masonry-item.large { grid-row: auto; }
  .features-inner { grid-template-columns: 1fr; gap: 40px; padding: 0 40px; }
  .footer-nav { grid-template-columns: 1fr 1fr; gap: 40px; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<header>
  <ul class="nav-left">
    <li><a data-href="#">Living</a></li>
    <li><a data-href="#">Dining</a></li>
    <li><a data-href="#">Bedroom</a></li>
  </ul>
  <a data-href="#" class="logo">AURA</a>
  <div class="nav-right">
    <a data-href="#" class="icon-link">Search</a>
    <a data-href="#" class="icon-link">Cart (0)</a>
  </div>
</header>

<section class="hero">
  <div class="hero-img" style="background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23C2A894\\'/></svg>') center/cover;"></div>
  <div class="hero-content">
    <span class="hero-sub">The Spring Collection</span>
    <h1 class="hero-title">Elevate Your <em>Sanctuary</em></h1>
    <button class="btn-outline-light">Explore Collection</button>
  </div>
</section>

<section class="collection">
  <div class="collection-header">
    <h2>Curated Pieces</h2>
    <p>Discover our meticulously crafted furniture and decor items, designed to bring warmth and understated luxury to your living spaces.</p>
  </div>
  
  <div class="masonry-grid">
    <!-- Item 1 -->
    <a data-href="#" class="masonry-item large">
      <div class="m-img-wrapper" style="aspect-ratio:3/4;">
        <div class="m-img" style="background: linear-gradient(120deg, #E8E5DF, #F2EFE9);"></div>
        <div class="m-action">View Details <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
      </div>
      <div class="m-info">
        <h3 class="m-title">The Artisan Lounge Chair</h3>
        <p class="m-price">\$1,295</p>
      </div>
    </a>
    
    <!-- Item 2 -->
    <a data-href="#" class="masonry-item">
      <div class="m-img-wrapper" style="aspect-ratio:1;">
        <div class="m-img" style="background: linear-gradient(120deg, #8F9779, #9FA789);"></div>
        <div class="m-action">View Details <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
      </div>
      <div class="m-info">
        <h3 class="m-title">Ceramic Ribbed Vase</h3>
        <p class="m-price">\$145</p>
      </div>
    </a>
    
    <!-- Item 3 -->
    <a data-href="#" class="masonry-item">
      <div class="m-img-wrapper" style="aspect-ratio:1;">
        <div class="m-img" style="background: linear-gradient(120deg, #C2A894, #D2B8A4);"></div>
        <div class="m-action">View Details <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
      </div>
      <div class="m-info">
        <h3 class="m-title">Fluted Console Table</h3>
        <p class="m-price">\$895</p>
      </div>
    </a>

    <!-- Item 4 -->
    <a data-href="#" class="masonry-item large">
      <div class="m-img-wrapper" style="aspect-ratio:3/4;">
        <div class="m-img" style="background: linear-gradient(120deg, #5A5A5A, #7A7A7A);"></div>
        <div class="m-action">View Details <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
      </div>
      <div class="m-info">
        <h3 class="m-title">Bouclé Accent Sofa</h3>
        <p class="m-price">\$2,450</p>
      </div>
    </a>
    
    <!-- Item 5 -->
    <a data-href="#" class="masonry-item" style="grid-column: span 2;">
      <div class="m-img-wrapper" style="aspect-ratio:16/7;">
        <div class="m-img" style="background: linear-gradient(120deg, #E8E5DF, #D5D1C8);"></div>
        <div class="m-action">View Details <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
      </div>
      <div class="m-info">
        <h3 class="m-title">Oak Dining Bench</h3>
        <p class="m-price">\$450</p>
      </div>
    </a>
  </div>
</section>

<section class="lookbook">
  <div class="lb-img">
    <svg fill="none" stroke="rgba(255,255,255,0.5)" viewBox="0 0 24 24" style="width:120px;height:120px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  </div>
  <div class="lb-content">
    <h2>Organic Forms & Natural Textures</h2>
    <p>Our philosophy embraces imperfection, using natural materials that age gracefully over time. Every piece tells a story of craftsmanship and mindfulness.</p>
    <a data-href="#" class="link-underline">Read Our Story</a>
  </div>
</section>

<div class="features-band">
  <div class="features-inner">
    <div class="feature">
      <svg class="f-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
      <h4>Sustainable Sourcing</h4>
      <p>We partner with artisans who use ethically harvested materials.</p>
    </div>
    <div class="feature">
      <svg class="f-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      <h4>Timeless Design</h4>
      <p>Creating pieces that transcend seasonal trends to become future heirlooms.</p>
    </div>
    <div class="feature">
      <svg class="f-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
      <h4 class="serif">White Glove Delivery</h4>
      <p>Complimentary assembly and placement in your room of choice.</p>
    </div>
  </div>
</div>

<footer>
  <div class="footer-top">
    <div class="footer-brand">
      <div class="logo">AURA</div>
      <p>Curating exceptional spaces with furniture and decor that inspires tranquility and purpose in everyday life.</p>
    </div>
    <div class="footer-nav">
      <div class="footer-col">
        <h5>Shop</h5>
        <ul>
          <li><a data-href="#">Furniture</a></li>
          <li><a data-href="#">Lighting</a></li>
          <li><a data-href="#">Decor</a></li>
          <li><a data-href="#">Textiles</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Assistance</h5>
        <ul>
          <li><a data-href="#">Shipping & Returns</a></li>
          <li><a data-href="#">Care Guide</a></li>
          <li><a data-href="#">FAQ</a></li>
          <li><a data-href="#">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a data-href="#">About Aura</a></li>
          <li><a data-href="#">Journal</a></li>
          <li><a data-href="#">Design Services</a></li>
          <li><a data-href="#">Trade Program</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2025 Aura Home Inc.</span>
    <span style="display:flex; gap:20px;">
      <a data-href="#" style="color:inherit;text-decoration:none">Privacy</a>
      <a data-href="#" style="color:inherit;text-decoration:none">Terms</a>
    </span>
  </div>
</footer>

<script>
  // Simple header background effect on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.style.background = 'var(--text)';
      header.style.borderBottom = 'none';
      header.style.position = 'fixed';
    } else {
      header.style.background = 'transparent';
      header.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
      header.style.position = 'absolute';
    }
  });
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "pet-supplies": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HappyPaws | Natural Pet Supplies</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #3E8ED0;
  --secondary: #FF8F3D;
  --bg: #F0F8FF;
  --card-bg: #FFFFFF;
  --text: #2D3748;
  --text-muted: #718096;
  --border: #E2E8F0;
  --success: #48BB78;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Nunito', sans-serif; font-size: 16px; line-height: 1.5; }
h1, h2, h3, h4, .brand { font-fxmily: 'Quicksand', sans-serif; }

/* HEADER */
.promo { background: var(--secondary); color: #fff; text-align: center; padding: 12px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
header { background: var(--card-bg); padding: 20px 40px; border-bottom: 3px solid var(--border); position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; border-radius: 0 0 24px 24px; margin: 0 10px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
.brand { font-size: 28px; font-weight: 900; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 8px; }
.brand-icon { width: 36px; height: 36px; background: var(--secondary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-10deg); transition: transform 0.3s; }
.brand:hover .brand-icon { transform: rotate(10deg); }
.nav-links { display: flex; gap: 24px; list-style: none; }
.nav-links a { color: var(--text); text-decoration: none; font-weight: 700; font-size: 15px; padding: 8px 16px; border-radius: 20px; transition: background 0.2s, color 0.2s; }
.nav-links a:hover { background: var(--bg); color: var(--primary); }
.header-actions { display: flex; gap: 16px; align-items: center; }
.cart-btn { background: var(--primary); color: #fff; border: none; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-fxmily: 'Nunito', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; box-shadow: 0 4px 6px rgba(62, 142, 208, 0.3); }
.cart-btn:hover { background: #3178B3; transform: translateY(-2px); }

/* HERO */
.hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 60px 80px; gap: 40px; max-width: 1400px; margin: 0 auto; }
.hero-content { display: flex; flex-direction: column; gap: 24px; }
.hero-tag { background: #EBF8FF; color: var(--primary); font-weight: 800; font-size: 13px; padding: 8px 16px; border-radius: 20px; width: max-content; display: flex; align-items: center; gap: 6px; }
.hero-title { font-size: 56px; font-weight: 900; line-height: 1.1; color: var(--text); }
.hero-title span { color: var(--secondary); }
.hero-desc { font-size: 18px; color: var(--text-muted); font-weight: 600; max-width: 480px; }
.btn-primary { background: var(--secondary); color: #fff; padding: 18px 40px; border-radius: 30px; font-weight: 800; font-size: 18px; text-decoration: none; display: inline-block; width: max-content; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 8px 15px rgba(255, 143, 61, 0.4); border: none; cursor: pointer; font-fxmily: 'Nunito', sans-serif;}
.btn-primary:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(255, 143, 61, 0.5); }
.hero-img-wrapper { position: relative; }
.hero-img { width: 100%; aspect-ratio: 1; background: #FFDDA1; border-radius: 50% 50% 40% 40%; border: 8px solid #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.hero-img svg { width: 40%; color: var(--secondary); }

/* CATEGORY PILLS */
.categories { display: flex; justify-content: center; gap: 16px; padding: 40px 20px; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
.cat-pill { background: var(--card-bg); border: 2px solid var(--border); padding: 12px 24px; border-radius: 30px; font-weight: 800; color: var(--text-muted); text-decoration: none; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
.cat-pill:hover, .cat-pill.active { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }

/* PRODUCTS */
.products-section { padding: 40px 80px 80px; max-width: 1400px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 40px; }
.section-header h2 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.product-card { background: var(--card-bg); border-radius: 24px; padding: 24px; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.04); transition: transform 0.3s; border: 2px solid transparent; }
.product-card:hover { transform: translateY(-8px); border-color: #EBF8FF; }

/* Badges */
.card-badges { position: absolute; top: 16px; left: 16px; display: flex; flex-direction: column; gap: 6px; z-index: 2; }
.badge { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.badge.bestseller { background: var(--secondary); }
.badge.organic { background: var(--success); }
.badge.new { background: var(--primary); }

.p-img-box { aspect-ratio: 1; background: var(--bg); border-radius: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; }
.p-img-box svg { width: 50%; color: var(--primary); opacity: 0.8; }

.p-brand { font-size: 12px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.p-title { font-size: 18px; font-weight: 800; margin-bottom: 12px; line-height: 1.3; font-fxmily: 'Nunito', sans-serif; }
.p-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 16px; }
.star { color: #F6E05E; font-size: 16px; }
.rev-count { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-left: 4px; }

/* Subscription Toggle */
.sub-box { background: var(--bg); border-radius: 16px; padding: 12px; margin-bottom: 16px; border: 2px solid var(--border); }
.sub-option { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
.sub-option:last-child { margin-bottom: 0; }
.sub-radio { accent-color: var(--primary); width: 16px; height: 16px; }
.sub-label { font-size: 13px; font-weight: 700; color: var(--text); flex-grow: 1; }
.sub-price { font-size: 14px; font-weight: 800; color: var(--text); }
.sub-save { font-size: 10px; background: #C6F6D5; color: #22543D; padding: 2px 6px; border-radius: 4px; font-weight: 800; margin-left: auto; }

.btn-add { width: 100%; background: var(--bg); color: var(--primary); border: 2px solid var(--primary); padding: 14px; border-radius: 16px; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.2s; font-fxmily: 'Nunito', sans-serif; }
.btn-add:hover { background: var(--primary); color: #fff; }

/* BANNER */
.value-banner { background: var(--primary); margin: 40px auto; max-width: 1400px; border-radius: 32px; padding: 60px; color: #fff; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: center; }
.val-item .val-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.val-item .val-icon svg { width: 32px; height: 32px; color: #fff; }
.val-item h3 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
.val-item p { font-size: 15px; font-weight: 600; opacity: 0.9; }

/* FOOTER */
footer { background: #2D3748; color: #A0AEC0; padding: 80px 80px 40px; border-radius: 48px 48px 0 0; margin-top: 60px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; max-width: 1400px; margin: 0 auto 40px; }
.f-brand .brand { color: #fff; margin-bottom: 20px; }
.f-brand p { font-weight: 600; line-height: 1.6; max-width: 300px; margin-bottom: 24px; }
.f-col h4 { color: #fff; font-size: 18px; font-weight: 800; margin-bottom: 24px; font-fxmily: 'Quicksand', sans-serif; }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 12px; }
.f-col a { color: #A0AEC0; text-decoration: none; font-weight: 600; transition: color 0.2s; }
.f-col a:hover { color: #fff; }
.newsletter { background: rgba(255,255,255,0.05); padding: 24px; border-radius: 20px; }
.newsletter p { margin-bottom: 16px; font-weight: 600; font-size: 14px; }
.nw-form { display: flex; gap: 8px; }
.nw-input { flex-grow: 1; padding: 12px 16px; border-radius: 12px; border: none; background: #fff; font-fxmily: 'Nunito', sans-serif; font-weight: 600; }
.nw-btn { background: var(--secondary); color: #fff; border: none; padding: 0 20px; border-radius: 12px; font-weight: 800; cursor: pointer; }

.footer-bottom { text-align: center; border-top: 2px solid rgba(255,255,255,0.05); padding-top: 40px; font-weight: 600; font-size: 14px; }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}
@media(max-width: 1024px) {
  .hero { grid-template-columns: 1fr; text-align: center; padding: 40px; }
  .hero-content { align-items: center; }
  .hero-desc { max-width: 600px; }
  .hero-img-wrapper { max-width: 500px; margin: 0 auto; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .value-banner { grid-template-columns: 1fr; border-radius: 0; padding: 60px 40px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  header { padding: 16px 20px; margin: 0; border-radius: 0; }
  .nav-links { display: none; }
  .hero-title { font-size: 40px; }
  .products-section { padding: 40px 20px; }
  .products-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 40px; }
  footer { padding: 60px 20px 40px; border-radius: 24px 24px 0 0; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="promo">🐶 FREE Shipping on orders over \$50 + 20% OFF your first Autoship!</div>

<header>
  <a data-href="#" class="brand">
    <div class="brand-icon"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M9.5 9c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zM14.5 9c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"/><path d="M12 16c-1.654 0-3-1.346-3-3h6c0 1.654-1.346 3-3 3z"/></svg></div>
    HappyPaws
  </a>
  <ul class="nav-links">
    <li><a data-href="#">Dogs</a></li>
    <li><a data-href="#">Cats</a></li>
    <li><a data-href="#">Health</a></li>
    <li><a data-href="#">Toys</a></li>
    <li><a data-href="#" style="color:var(--secondary)">Autoship</a></li>
  </ul>
  <div class="header-actions">
    <button class="cart-btn">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      Cart (0)
    </button>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <div class="hero-tag">🌟 America's #1 Rated Organic Pet Food</div>
    <h1 class="hero-title">Happy Pets.<br><span>Healthy Lives.</span></h1>
    <p class="hero-desc">Premium, vet-recommended nutrition made from real ingredients. Because they're not just pets, they're family.</p>
    <a data-href="#shop" class="btn-primary">Shop Bestsellers</a>
  </div>
  <div class="hero-img-wrapper">
    <div class="hero-img">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 14.121c1.952-1.171 1.952-3.07 0-4.242-1.953-1.172-5.119-1.172-7.072 0-1.952 1.171-1.952 3.07 0 4.242 1.953 1.172 5.119 1.172 7.072 0z"></path></svg>
    </div>
  </div>
</section>

<div class="categories" id="shop">
  <a data-href="#" class="cat-pill active">🐶 Dry Food</a>
  <a data-href="#" class="cat-pill">🥩 Wet Food</a>
  <a data-href="#" class="cat-pill">🦴 Treats</a>
  <a data-href="#" class="cat-pill">💊 Supplements</a>
  <a data-href="#" class="cat-pill">🎾 Toys</a>
</div>

<section class="products-section">
  <div class="section-header">
    <h2>Pawsitively Delicious</h2>
  </div>
  <div class="products-grid">
    <!-- Card 1 -->
    <div class="product-card">
      <div class="card-badges">
        <span class="badge bestseller">#1 Bestseller</span>
        <span class="badge organic">100% Organic</span>
      </div>
      <div class="p-img-box"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
      <div class="p-brand">Wilderness & Co.</div>
      <h3 class="p-title">Free-Range Chicken & Sweet Potato Recipe</h3>
      <div class="p-rating">
        <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
        <span class="rev-count">4,289</span>
      </div>
      <div class="sub-box">
        <label class="sub-option">
          <input type="radio" name="sub1" class="sub-radio" checked>
          <span class="sub-label">Autoship <span class="sub-save">Save 10%</span></span>
          <span class="sub-price">\$44.99</span>
        </label>
        <label class="sub-option">
          <input type="radio" name="sub1" class="sub-radio">
          <span class="sub-label">One-time</span>
          <span class="sub-price" style="font-weight:600; color:var(--text-muted)">\$49.99</span>
        </label>
      </div>
      <button class="btn-add">Add to Cart</button>
    </div>
    
    <!-- Card 2 -->
    <div class="product-card">
      <div class="card-badges">
        <span class="badge new">New</span>
      </div>
      <div class="p-img-box"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
      <div class="p-brand">HappyPaws Labs</div>
      <h3 class="p-title">Joint Support Advanced Chews (Peanut Butter)</h3>
      <div class="p-rating">
        <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">☆</span>
        <span class="rev-count">842</span>
      </div>
      <div class="sub-box">
        <label class="sub-option">
          <input type="radio" name="sub2" class="sub-radio">
          <span class="sub-label">Autoship <span class="sub-save">Save 15%</span></span>
          <span class="sub-price">\$25.49</span>
        </label>
        <label class="sub-option">
          <input type="radio" name="sub2" class="sub-radio" checked>
          <span class="sub-label">One-time</span>
          <span class="sub-price" style="font-weight:600; color:var(--text-muted)">\$29.99</span>
        </label>
      </div>
      <button class="btn-add">Add to Cart</button>
    </div>

    <!-- Card 3 -->
    <div class="product-card">
      <div class="card-badges">
        <span class="badge organic">Grain-Free</span>
      </div>
      <div class="p-img-box"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
      <div class="p-brand">Ocean Catch</div>
      <h3 class="p-title">Wild Alaskan Salmon & Rice Small Breed</h3>
      <div class="p-rating">
        <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
        <span class="rev-count">1,204</span>
      </div>
      <div class="sub-box">
        <label class="sub-option">
          <input type="radio" name="sub3" class="sub-radio" checked>
          <span class="sub-label">Autoship <span class="sub-save">Save 10%</span></span>
          <span class="sub-price">\$38.69</span>
        </label>
        <label class="sub-option">
          <input type="radio" name="sub3" class="sub-radio">
          <span class="sub-label">One-time</span>
          <span class="sub-price" style="font-weight:600; color:var(--text-muted)">\$42.99</span>
        </label>
      </div>
      <button class="btn-add">Add to Cart</button>
    </div>

    <!-- Card 4 -->
    <div class="product-card">
      <div class="card-badges">
        <span class="badge bestseller">Most Loved</span>
      </div>
      <div class="p-img-box"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg></div>
      <div class="p-brand">DentalCare</div>
      <h3 class="p-title">Fresh Breath Mint Dental Sticks (30 Pack)</h3>
      <div class="p-rating">
        <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
        <span class="rev-count">5,630</span>
      </div>
      <div class="sub-box">
        <label class="sub-option">
          <input type="radio" name="sub4" class="sub-radio" checked>
          <span class="sub-label">Autoship <span class="sub-save">Save 15%</span></span>
          <span class="sub-price">\$16.99</span>
        </label>
        <label class="sub-option">
          <input type="radio" name="sub4" class="sub-radio">
          <span class="sub-label">One-time</span>
          <span class="sub-price" style="font-weight:600; color:var(--text-muted)">\$19.99</span>
        </label>
      </div>
      <button class="btn-add">Add to Cart</button>
    </div>
  </div>
</section>

<div class="value-banner">
  <div class="val-item">
    <div class="val-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 13l4 4L19 7"></path></svg></div>
    <h3>Vet Recommended</h3>
    <p>Formulated by top animal nutritionists to ensure perfect balance.</p>
  </div>
  <div class="val-item">
    <div class="val-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
    <h3>Sourced Locally</h3>
    <p>We source 90% of our ingredients from American organic farms.</p>
  </div>
  <div class="val-item">
    <div class="val-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
    <h3>Happiness Guarantee</h3>
    <p>If your pet doesn't love it, we'll refund you. No questions asked.</p>
  </div>
</div>

<footer>
  <div class="footer-grid">
    <div class="f-brand">
      <a data-href="#" class="brand">HappyPaws</a>
      <p>Making tails wag and motors purr since 2012. Providing nutrition that puts your pet's health first.</p>
    </div>
    <div class="f-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">Shop Dogs</a></li>
        <li><a data-href="#">Shop Cats</a></li>
        <li><a data-href="#">New Arrivals</a></li>
        <li><a data-href="#">Autoship Program</a></li>
        <li><a data-href="#">Promotions</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>HappyPaws</h4>
      <ul>
        <li><a data-href="#">Our Ingredients</a></li>
        <li><a data-href="#">Vet Advisory Board</a></li>
        <li><a data-href="#">Sustainability</a></li>
        <li><a data-href="#">Contact Us</a></li>
        <li><a data-href="#">FAQ</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Join the Pack</h4>
      <div class="newsletter">
        <p>Get 20% off your first order plus expert pet tips delivered weekly.</p>
        <div class="nw-form">
          <input type="email" placeholder="Enter your email" class="nw-input">
          <button class="nw-btn">Subscribe</button>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 HappyPaws Nutrition Inc. All rights reserved.</p>
  </div>
</footer>

<script>
  // Simple intersection observer to animate products in
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = \`opacity 0.4s ease \${index * 0.1}s, transform 0.4s ease \${index * 0.1}s, border-color 0.3s\`;
      observer.observe(card);
    });
  });
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "luxury-watches": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chronos | High Horology</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #050505;
  --text: #F2F2F2;
  --text-muted: #999999;
  --gold: #D4AF37;
  --gold-dark: #AA8C2C;
  --surface: #111111;
  --border: #333333;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Lato', sans-serif; font-size: 14px; -webkit-font-smoothing: antialiased; letter-spacing: 0.5px; }
h1, h2, h3, .brand { font-fxmily: 'Cinzel', serif; font-weight: 400; }

/* HEADER - SPLIT NAV */
header { display: flex; align-items: center; justify-content: space-between; padding: 40px 60px; position: absolute; top: 0; left: 0; width: 100%; z-index: 50; }
.hamburger { width: 30px; height: 20px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; }
.hamburger span { display: block; height: 1px; width: 100%; background: #fff; transition: 0.3s; }
.hamburger:hover span { background: var(--gold); }
.brand { font-size: 28px; letter-spacing: 6px; color: #fff; text-decoration: none; text-align: center; position: absolute; left: 50%; transform: translateX(-50%); }
.nav-actions { display: flex; gap: 30px; }
.action-link { color: #fff; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; transition: color 0.3s; }
.action-link:hover { color: var(--gold); }

/* HERO */
.hero { height: 100vh; position: relative; display: flex; align-items: center; padding-left: 10vw; overflow: hidden; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 70% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 60%); z-index: 1; }
.hero-video { position: absolute; top: 0; right: -10vw; width: 60%; height: 100%; background: url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'40\\' fill=\\'none\\' stroke=\\'%23D4AF37\\' stroke-width=\\'0.5\\' opacity=\\'0.3\\'/><circle cx=\\'50\\' cy=\\'50\\' r=\\'30\\' fill=\\'none\\' stroke=\\'%23D4AF37\\' stroke-width=\\'0.2\\' opacity=\\'0.1\\'/></svg>') center center/cover no-repeat; opacity: 0.8; z-index: 0; filter: blur(2px); }
.hero-content { position: relative; z-index: 2; max-width: 600px; }
.kicker { font-size: 11px; color: var(--gold); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 24px; display: block; }
.hero h1 { font-size: 64px; line-height: 1.1; margin-bottom: 30px; }
.hero p { font-size: 16px; color: var(--text-muted); line-height: 1.8; margin-bottom: 50px; font-weight: 300; }
.btn-gold { padding: 16px 48px; border: 1px solid var(--gold); background: transparent; color: var(--gold); font-fxmily: 'Lato', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; cursor: pointer; transition: all 0.4s ease; text-decoration: none; display: inline-block; }
.btn-gold:hover { background: var(--gold); color: #000; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }

/* COLLECTIONS / PRODUCTS */
.collections { padding: 120px 60px; max-width: 1600px; margin: 0 auto; }
.section-title { text-align: center; margin-bottom: 80px; }
.section-title h2 { font-size: 36px; letter-spacing: 4px; margin-bottom: 16px; }
.section-title p { font-size: 13px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; }

.product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.product-card { position: relative; background: var(--surface); height: 600px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: crosshair; }
.product-card::before { content: ''; position: absolute; inset: 0; border: 1px solid var(--border); transition: border-color 0.6s ease; z-index: 1; pointer-events: none; }
.product-card:hover::before { border-color: rgba(212, 175, 55, 0.5); }

.p-img-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; transition: transform 1s cubic-bezier(0.2, 1, 0.3, 1); background: radial-gradient(circle at center, #1A1A1A 0%, #050505 100%); display: flex; align-items: center; justify-content: center; }
.p-img-container svg { width: 50%; height: 50%; opacity: 0.8; stroke: #fff; }
.product-card:hover .p-img-container { transform: scale(1.05); }

/* Glassmorphism overlay on hover */
.p-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%); padding: 40px; display: flex; flex-direction: column; justify-content: flex-end; z-index: 2; opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.2, 1, 0.3, 1); }
.product-card:hover .p-overlay { opacity: 1; transform: translateY(0); }

.p-name { font-fxmily: 'Cinzel', serif; font-size: 24px; letter-spacing: 2px; color: #fff; margin-bottom: 8px; }
.p-specs { font-size: 12px; color: var(--text-muted); margin-bottom: 24px; font-weight: 300; display: flex; gap: 12px; }
.p-specs span::after { content: '|'; margin-left: 12px; color: var(--border); }
.p-specs span:last-child::after { content: ''; }
.p-action-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
.p-price { font-size: 14px; letter-spacing: 2px; color: var(--gold); }
.btn-concierge { background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 20px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; font-fxmily: 'Lato', sans-serif; }
.btn-concierge:hover { background: #fff; color: #000; }

/* HOROLOGY INFO */
.horology { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.h-text { padding: 120px 10vw; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid var(--border); }
.h-img { background: #111; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.h-img svg { width: 40%; height: 40%; stroke: var(--gold-dark); stroke-width: 0.5; }
.h-title { font-size: 40px; margin-bottom: 30px; letter-spacing: 2px; }
.h-desc { font-weight: 300; color: var(--text-muted); line-height: 2; margin-bottom: 40px; font-size: 15px; }

/* ULTRA MINIMAL FOOTER */
footer { padding: 80px 60px; max-width: 1600px; margin: 0 auto; text-align: center; }
.f-logo { font-fxmily: 'Cinzel', serif; font-size: 24px; letter-spacing: 8px; color: #fff; text-decoration: none; display: block; margin-bottom: 40px; }
.f-links { display: flex; justify-content: center; gap: 40px; margin-bottom: 60px; }
.f-links a { color: var(--text-muted); text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; transition: color 0.3s; }
.f-links a:hover { color: var(--gold); }
.f-legal { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 2px; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .horology { grid-template-columns: 1fr; }
  .h-text { border-right: none; padding: 80px 40px; border-bottom: 1px solid var(--border); }
  .h-img { height: 400px; }
  .hero-video { opacity: 0.3; right: 0; width: 100%; }
}
@media(max-width: 768px) {
  header { padding: 20px; }
  .nav-actions span { display: none; }
  .hero { padding: 40px; }
  .hero h1 { font-size: 48px; }
  .product-grid { grid-template-columns: 1fr; }
  .collections { padding: 80px 20px; }
  .f-links { flex-direction: column; gap: 20px; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<header>
  <div class="hamburger">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <a data-href="#" class="brand">CHRONOS</a>
  <div class="nav-actions">
    <a data-href="#" class="action-link">Boutiques</a>
    <a data-href="#" class="action-link">Contact <span style="margin-left:5px">Concierge</span></a>
  </div>
</header>

<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-video"></div>
  <div class="hero-content">
    <span class="kicker">The Masterpiece Collection</span>
    <h1>Eternity,<br>Captured.</h1>
    <p>Discover timepieces crafted with unparalleled precision. Merging centuries-old Swiss watchmaking traditions with avant-garde aesthetics.</p>
    <a data-href="#collections" class="btn-gold">Discover the Collection</a>
  </div>
</section>

<section class="collections" id="collections">
  <div class="section-title">
    <h2>Exceptional Timepieces</h2>
    <p>Excellence Without Compromise</p>
  </div>
  <div class="product-grid">
    
    <!-- Item 1 -->
    <div class="product-card">
      <div class="p-img-container">
        <svg fill="none" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" stroke="#fff" stroke-width="2"/><circle cx="50" cy="50" r="28" stroke="#D4AF37" stroke-width="0.5"/><path d="M50 20 v30 l15 15" stroke="#fff" stroke-width="1.5"/></svg>
      </div>
      <div class="p-overlay">
        <h3 class="p-name">Tourbillon Grand Complication</h3>
        <div class="p-specs"><span>42mm</span><span>Platinum 950</span><span>Manual-Winding</span></div>
        <div class="p-action-row">
          <span class="p-price">Price Upon Request</span>
          <button class="btn-concierge">Contact Concierge</button>
        </div>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="product-card">
      <div class="p-img-container">
        <svg fill="none" viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" stroke="#AA8C2C" stroke-width="4"/><circle cx="50" cy="50" r="28" stroke="#fff" stroke-width="0.5"/><path d="M50 20 v30 l-10 10" stroke="#fff" stroke-width="1.5"/></svg>
      </div>
      <div class="p-overlay">
        <h3 class="p-name">Perpetual Calendar</h3>
        <div class="p-specs"><span>40mm</span><span>18K Rose Gold</span><span>Automatic</span></div>
        <div class="p-action-row">
          <span class="p-price">\$84,500</span>
          <button class="btn-concierge">Contact Concierge</button>
        </div>
      </div>
    </div>

    <!-- Item 3 -->
    <div class="product-card">
      <div class="p-img-container">
        <svg fill="none" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" stroke="#fff" stroke-width="1"/><circle cx="50" cy="50" r="28" stroke="#fff" stroke-width="0.5"/><path d="M50 20 v30 l15 -5" stroke="#fff" stroke-width="1.5"/><circle cx="35" cy="50" r="5" stroke="#D4AF37" stroke-width="0.5"/></svg>
      </div>
      <div class="p-overlay">
        <h3 class="p-name">Chronograph Skeleton</h3>
        <div class="p-specs"><span>44mm</span><span>Titanium</span><span>Manual-Winding</span></div>
        <div class="p-action-row">
          <span class="p-price">\$62,000</span>
          <button class="btn-concierge">Contact Concierge</button>
        </div>
      </div>
    </div>

  </div>
</section>

<section class="horology">
  <div class="h-text">
    <h2 class="h-title">The Art of Precision</h2>
    <p class="h-desc">Each Chronos timepiece is the result of hundreds of hours of meticulous hand-craftsmanship. From the initial sketches to the final polishing of microscopic components, our master watchmakers pour their soul into creating instruments that transcend time itself.</p>
    <a data-href="#" class="btn-gold" style="width:max-content;">Explore Our Manufacture</a>
  </div>
  <div class="h-img">
    <svg fill="none" viewBox="0 0 100 100"><circle cx="30" cy="40" r="20" /><circle cx="70" cy="60" r="25" /><circle cx="50" cy="20" r="10" /><path d="M30 40 L70 60 L50 20 Z" fill="rgba(212,175,55,0.05)"/></svg>
  </div>
</section>

<footer>
  <a data-href="#" class="f-logo">CHRONOS</a>
  <div class="f-links">
    <a data-href="#">The Collection</a>
    <a data-href="#">Manufacture</a>
    <a data-href="#">Boutiques</a>
    <a data-href="#">Client Services</a>
    <a data-href="#">Press</a>
  </div>
  <p class="f-legal">&copy; 2025 Chronos High Horology. Terms of Service &middot; Privacy Policy</p>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "outdoor-gear": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Summit | Precision Outdoor Gear</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Oswald:wght@400;600;700&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #2C4C3B; /* Forest Green */
  --primary-dark: #1E3629;
  --accent: #E65100; /* Safety Orange */
  --bg: #F4F4F0; /* Off White */
  --surface: #FFFFFF;
  --text: #212121;
  --text-muted: #757575;
  --border: #DCDCD5;
  --shadow: 8px 8px 0px rgba(0,0,0,0.8);
  --shadow-hover: 12px 12px 0px rgba(0,0,0,0.9);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Roboto', sans-serif; font-size: 16px; line-height: 1.5; }
h1, h2, h3, h4, .brand { font-fxmily: 'Oswald', sans-serif; text-transform: uppercase; }

/* UTILITY HEADER */
.top-bar { background: var(--text); color: #fff; padding: 6px 40px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
header { background: var(--primary); padding: 20px 40px; position: sticky; top: 0; z-index: 100; display: grid; grid-template-columns: auto 1fr auto; gap: 40px; align-items: center; border-bottom: 4px solid var(--text); }
.brand { font-size: 36px; font-weight: 700; color: #fff; text-decoration: none; letter-spacing: 2px; }
.brand span { color: var(--accent); }

.search-bar { display: flex; height: 48px; border: 3px solid var(--text); border-radius: 4px; overflow: hidden; background: #fff; max-width: 600px; width: 100%; box-shadow: 4px 4px 0px var(--text); }
.search-input { flex-grow: 1; border: none; padding: 0 16px; font-size: 16px; font-fxmily: 'Roboto', sans-serif; font-weight: 500; outline: none; }
.search-btn { background: var(--text); color: #fff; border: none; padding: 0 24px; font-fxmily: 'Oswald', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: background 0.2s; }
.search-btn:hover { background: var(--accent); }

.nav-actions { display: flex; gap: 24px; align-items: center; }
.nav-link { color: #fff; text-decoration: none; font-fxmily: 'Oswald', sans-serif; font-size: 16px; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; transition: color 0.2s; }
.nav-link:hover { color: var(--accent); }

/* CATEGORY SUB-NAV */
.sub-nav { background: var(--surface); border-bottom: 3px solid var(--text); padding: 0 40px; }
.sub-nav ul { display: flex; list-style: none; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.sub-nav ul::-webkit-scrollbar { display: none; }
.sub-nav a { display: block; padding: 16px 24px; color: var(--text); text-decoration: none; font-fxmily: 'Oswald', sans-serif; font-weight: 600; letter-spacing: 1px; border-right: 3px solid var(--text); transition: background 0.2s; }
.sub-nav li:first-child a { border-left: 3px solid var(--text); }
.sub-nav a:hover, .sub-nav a.active { background: var(--accent); color: #fff; }

/* BLOCK HERO */
.hero { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 4px solid var(--text); }
.hero-content { padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; border-right: 4px solid var(--text); background: var(--bg); }
.hero-label { background: var(--accent); color: #fff; font-fxmily: 'Oswald', sans-serif; font-size: 14px; padding: 6px 12px; font-weight: 700; letter-spacing: 1px; width: max-content; border: 2px solid var(--text); box-shadow: 2px 2px 0 var(--text); margin-bottom: 24px; }
.hero h1 { font-size: 72px; line-height: 1; margin-bottom: 24px; }
.hero p { font-size: 18px; font-weight: 500; color: var(--text-muted); max-width: 480px; margin-bottom: 40px; }
.btn-solid { background: var(--text); color: #fff; padding: 18px 40px; font-fxmily: 'Oswald', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 2px; text-decoration: none; border: 3px solid var(--text); display: inline-flex; align-items: center; justify-content: center; gap: 12px; transition: all 0.2s; box-shadow: var(--shadow); width: max-content; }
.btn-solid:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow-hover); background: var(--primary); }

.hero-img { background: var(--border); position: relative; min-height: 500px; display: flex; align-items: center; justify-content: center; }
.hero-img::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px); }
.hero-img svg { width: 40%; color: var(--text); opacity: 0.3; }

/* GRID PRODUCTS */
.section { padding: 80px 40px; max-width: 1600px; margin: 0 auto; }
.section-title { font-size: 48px; border-bottom: 4px solid var(--text); padding-bottom: 16px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
.section-title a { font-size: 16px; font-fxmily: 'Roboto', sans-serif; font-weight: 700; text-transform: none; color: var(--accent); text-decoration: none; letter-spacing: 0; }
.section-title a:hover { text-decoration: underline; }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
.product-card { background: var(--surface); border: 3px solid var(--text); padding: 24px; position: relative; display: flex; flex-direction: column; transition: all 0.2s; box-shadow: 6px 6px 0px var(--text); }
.product-card:hover { transform: translate(-4px, -4px); box-shadow: 10px 10px 0px var(--text); }

.p-img-wrapper { aspect-ratio: 1; background: var(--bg); border: 2px solid var(--text); margin-bottom: 20px; display: flex; align-items: center; justify-content: center; position: relative; }
.p-badge { position: absolute; top: -10px; right: -10px; background: var(--accent); color: #fff; font-fxmily: 'Oswald', sans-serif; font-size: 12px; font-weight: 600; padding: 4px 10px; border: 2px solid var(--text); transform: rotate(5deg); }
.p-img-wrapper svg { width: 40%; color: var(--primary); }

.p-name { font-fxmily: 'Roboto', sans-serif; font-size: 18px; font-weight: 900; margin-bottom: 8px; text-transform: uppercase; line-height: 1.2; }
.p-price { font-fxmily: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }

/* Quick Specs */
.p-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; flex-grow: 1; }
.spec-item { background: var(--bg); border: 2px solid var(--text); padding: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
.spec-item svg { width: 14px; height: 14px; }

.btn-card { width: 100%; background: transparent; color: var(--text); border: 2px solid var(--text); padding: 12px; font-fxmily: 'Oswald', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; box-shadow: 3px 3px 0 var(--text); }
.btn-card:hover { background: var(--accent); color: #fff; box-shadow: 0 0 0 var(--text); transform: translate(3px, 3px); }

/* FEATURE BANNER */
.impact-banner { background: var(--primary); color: #fff; border-top: 4px solid var(--text); border-bottom: 4px solid var(--text); display: grid; grid-template-columns: repeat(3, 1fr); }
.impact-item { padding: 60px 40px; border-right: 4px solid var(--text); text-align: center; display: flex; flex-direction: column; align-items: center; }
.impact-item:last-child { border-right: none; background: var(--accent); }
.i-icon { width: 64px; height: 64px; border: 3px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; background: var(--text); }
.i-icon svg { width: 32px; height: 32px; }
.impact-item h3 { font-size: 24px; margin-bottom: 12px; letter-spacing: 1px; }
.impact-item p { font-fxmily: 'Roboto', sans-serif; font-size: 15px; font-weight: 500; opacity: 0.9; }

/* FOOTER */
footer { background: var(--surface); padding: 80px 40px; border-top: 4px solid var(--text); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; max-width: 1600px; margin: 0 auto; }
.f-brand { font-size: 40px; font-weight: 700; color: var(--text); text-decoration: none; letter-spacing: 2px; margin-bottom: 16px; display: block; }
.f-brand span { color: var(--accent); }
.footer-desc { font-weight: 500; color: var(--text-muted); max-width: 300px; margin-bottom: 24px; }
.social-links { display: flex; gap: 16px; }
.social-link { width: 40px; height: 40px; border: 3px solid var(--text); display: flex; align-items: center; justify-content: center; color: var(--text); background: var(--bg); transition: all 0.2s; box-shadow: 2px 2px 0 var(--text); }
.social-link:hover { background: var(--accent); color: #fff; transform: translate(-2px, -2px); box-shadow: 4px 4px 0 var(--text); }

.f-col h4 { font-size: 20px; font-weight: 700; margin-bottom: 24px; position: relative; display: inline-block; }
.f-col h4::after { content: ''; position: absolute; left: 0; bottom: -4px; width: 100%; height: 4px; background: var(--accent); }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 16px; }
.f-col a { color: var(--text); text-decoration: none; font-fxmily: 'Roboto', sans-serif; font-weight: 700; font-size: 15px; text-transform: uppercase; transition: color 0.2s; }
.f-col a:hover { color: var(--accent); }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .hero h1 { font-size: 56px; }
}
@media(max-width: 1024px) {
  .hero { grid-template-columns: 1fr; }
  .hero-content { border-right: none; border-bottom: 4px solid var(--text); }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .impact-banner { grid-template-columns: 1fr; }
  .impact-item { border-right: none; border-bottom: 4px solid var(--text); }
  .impact-item:last-child { border-bottom: none; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media(max-width: 768px) {
  .top-bar { display: none; }
  header { grid-template-columns: auto auto; padding: 20px; gap: 20px; }
  .search-bar { display: none; }
  .section { padding: 40px 20px; }
  .product-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="top-bar">
  <span>Free standard shipping over \$99</span>
  <span>Pro Program Application Open</span>
</div>

<header>
  <a data-href="#" class="brand">SUMMIT<span>.</span></a>
  <form class="search-bar">
    <input type="text" class="search-input" placeholder="Search for gear, apparel, activities...">
    <button type="submit" class="search-btn">SEARCH</button>
  </form>
  <div class="nav-actions">
    <a data-href="#" class="nav-link"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> <span>SIGN IN</span></a>
    <a data-href="#" class="nav-link"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> <span>CART (2)</span></a>
  </div>
</header>

<div class="sub-nav">
  <ul>
    <li><a data-href="#" class="active">CAMPING & HIKING</a></li>
    <li><a data-href="#">CLIMBING</a></li>
    <li><a data-href="#">SNOW</a></li>
    <li><a data-href="#">WATER</a></li>
    <li><a data-href="#">MEN'S APPAREL</a></li>
    <li><a data-href="#">WOMEN'S APPAREL</a></li>
    <li><a data-href="#" style="color:var(--accent)">CLEARANCE</a></li>
  </ul>
</div>

<section class="hero">
  <div class="hero-content">
    <div class="hero-label">NEW ARRIVAL - APEX SERIES</div>
    <h1>CONQUER<br>THE ELEMENTS.</h1>
    <p>The Apex Alpine Jacket features revolutionary ExoShield™ technology. Completely waterproof. Unbelievably breathable. Tested at 20,000ft.</p>
    <a data-href="#gear" class="btn-solid">EXPLORE THE APEX SERIES <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
  </div>
  <div class="hero-img">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
  </div>
</section>

<section class="section" id="gear">
  <div class="section-title">
    <h2>EXPEDITION GEAR</h2>
    <a data-href="#">VIEW ALL GEAR &rarr;</a>
  </div>
  <div class="product-grid">
    
    <!-- Product 1 -->
    <div class="product-card">
      <div class="p-img-wrapper">
        <div class="p-badge">TOP RATED</div>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
      </div>
      <h3 class="p-name">K2 Ultralight 2-Person Tent</h3>
      <div class="p-price">\$349.95</div>
      <div class="p-specs">
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg> 2.4 lbs</div>
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg> 4-Season</div>
      </div>
      <button class="btn-card">ADD TO PACK</button>
    </div>

    <!-- Product 2 -->
    <div class="product-card">
      <div class="p-img-wrapper">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      </div>
      <h3 class="p-name">Alpine 65L Expedition Pack</h3>
      <div class="p-price">\$220.00</div>
      <div class="p-specs">
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg> 65 Liters</div>
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Water-Res</div>
      </div>
      <button class="btn-card">ADD TO PACK</button>
    </div>

    <!-- Product 3 -->
    <div class="product-card">
      <div class="p-img-wrapper">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <h3 class="p-name">Titanium Camp Stove Pro</h3>
      <div class="p-price">\$85.50</div>
      <div class="p-specs">
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg> 10,000 BTU</div>
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg> 2.6 oz</div>
      </div>
      <button class="btn-card">ADD TO PACK</button>
    </div>

    <!-- Product 4 -->
    <div class="product-card">
      <div class="p-img-wrapper">
        <div class="p-badge" style="background:var(--text); color:#fff">SALE</div>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
      </div>
      <h3 class="p-name">Merino Wool Base Layer Set</h3>
      <div class="p-price"><span style="text-decoration:line-through; color:var(--text-muted); font-size:16px;">\$110.00</span> \$79.99</div>
      <div class="p-specs">
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> 100% Merino</div>
        <div class="spec-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> Thermal</div>
      </div>
      <button class="btn-card">ADD TO PACK</button>
    </div>
  </div>
</section>

<div class="impact-banner">
  <div class="impact-item">
    <div class="i-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg></div>
    <h3>LIFETIME TRAIL GUARANTEE</h3>
    <p>We build our gear to withstand the harsh realities of the wild. If it fails, we replace it. Period.</p>
  </div>
  <div class="impact-item">
    <div class="i-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg></div>
    <h3>1% FOR THE PLANET</h3>
    <p>We are committed to preserving the playgrounds we love. 1% of all sales go to conservation efforts.</p>
  </div>
  <div class="impact-item" style="color:var(--text)">
    <div class="i-icon" style="background:#fff; border-color:var(--text)"><svg fill="none" stroke="var(--text)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></div>
    <h3>PRO PROGRAM</h3>
    <p>Are you a guide, instructor, or industry professional? Apply for our pro discounting program today.</p>
  </div>
</div>

<footer>
  <div class="footer-grid">
    <div>
      <a data-href="#" class="f-brand">SUMMIT<span>.</span></a>
      <p class="footer-desc">Precision gear engineered in the Pacific Northwest for those who pursue the extreme.</p>
      <div class="social-links">
        <a data-href="#" class="social-link"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
        <a data-href="#" class="social-link"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
      </div>
    </div>
    <div class="f-col">
      <h4>GEAR SHOP</h4>
      <ul>
        <li><a data-href="#">Tents & Shelters</a></li>
        <li><a data-href="#">Sleeping Bags</a></li>
        <li><a data-href="#">Packs & Bags</a></li>
        <li><a data-href="#">Camp Kitchen</a></li>
        <li><a data-href="#">Navigation</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>SUPPORT</h4>
      <ul>
        <li><a data-href="#">Help Center</a></li>
        <li><a data-href="#">Order Status</a></li>
        <li><a data-href="#">Returns & Exchanges</a></li>
        <li><a data-href="#">Warranty Info</a></li>
        <li><a data-href="#">Pro Program</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>ABOUT US</h4>
      <ul>
        <li><a data-href="#">Our Story</a></li>
        <li><a data-href="#">Careers</a></li>
        <li><a data-href="#">Sustainability</a></li>
        <li><a data-href="#">Field Reports</a></li>
        <li><a data-href="#">Store Locator</a></li>
      </ul>
    </div>
  </div>
  <div style="text-align:center; padding-top:40px; margin-top:40px; border-top:3px solid var(--text); font-weight:700; font-size:12px;">
    &copy; 2025 SUMMIT OUTDOOR GEAR. ALL RIGHTS RESERVED.
  </div>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "organic-food": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FarmFresh | Organic Groceries Daily</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Public+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #4A7C59; /* Leaf Green */
  --primary-light: #E9F2EC;
  --secondary: #F4A261; /* Earthy Orange */
  --bg: #FFFFFF;
  --surface: #F9FDF9;
  --text: #2C3E35;
  --text-muted: #6B7D73;
  --border: #E2E8E4;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Public Sans', sans-serif; font-size: 15px; line-height: 1.5; }
.serif { font-fxmily: 'Playfair Display', serif; }

/* MULTI-TIER HEADER */
.promo-bar { background: var(--primary); color: #fff; padding: 8px 20px; text-align: center; font-size: 13px; font-weight: 500; }
.promo-bar strong { color: #FFE082; font-weight: 600; }

.header-main { padding: 20px 60px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
.brand { font-fxmily: 'Playfair Display', serif; font-size: 32px; font-weight: 600; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 8px; }
.brand svg { width: 32px; height: 32px; color: var(--secondary); }

.search-box { display: flex; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 40px; padding: 6px 6px 6px 20px; width: 400px; }
.search-box input { border: none; background: transparent; outline: none; flex-grow: 1; font-fxmily: 'Public Sans', sans-serif; color: var(--text); }
.search-box button { background: var(--primary); color: #fff; border: none;width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.search-box button:hover { background: #3B6B48; }

.header-actions { display: flex; gap: 24px; align-items: center; }
.action-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; color: var(--text); text-decoration: none; font-size: 12px; font-weight: 500; transition: color 0.2s; }
.action-item:hover { color: var(--primary); }
.action-item svg { width: 22px; height: 22px; margin-bottom: 4px; }
.cart-badge { position: absolute; top: -6px; right: -8px; background: var(--secondary); color: #fff; font-size: 10px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }

.nav-bottom { padding: 0 60px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); background: #fff; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a { display: block; padding: 16px 0; color: var(--text); text-decoration: none; font-weight: 600; font-size: 14px; border-bottom: 2px solid transparent; transition: border-color 0.2s, color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: var(--primary); border-bottom-color: var(--primary); }
.delivery-tag { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--primary); background: var(--primary-light); padding: 6px 16px; border-radius: 20px; }

/* HERO */
.hero { padding: 60px; max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.hero-content { background: var(--surface); padding: 60px; border-radius: 40px; border: 1px solid var(--border); }
.h-tag { display: inline-block; background: var(--primary-light); color: var(--primary); font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
.hero h1 { font-size: 52px; line-height: 1.1; margin-bottom: 20px; color: var(--primary); }
.hero h1 span { font-style: italic; color: var(--secondary); }
.hero p { font-size: 16px; color: var(--text-muted); margin-bottom: 32px; max-width: 400px; }
.btn-primary { background: var(--primary); color: #fff; padding: 16px 32px; border-radius: 40px; text-decoration: none; font-weight: 600; transition: background 0.2s, transform 0.2s; display: inline-flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
.btn-primary:hover { background: #3B6B48; transform: translateY(-2px); }

.hero-visual { position: relative; aspect-ratio: 4/3; background: #DAEEDF; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.hero-visual svg { width: 50%; color: var(--primary); opacity: 0.5; }
.floating-badge { position: absolute; bottom: 40px; left: -20px; background: #fff; padding: 16px 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 12px; }
.fb-icon { width: 40px; height: 40px; background: var(--secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }

/* CATEGORY CIRCLES */
.cat-circles { display: flex; justify-content: center; gap: 40px; padding: 40px 60px; max-width: 1400px; margin: 0 auto; overflow-x: auto; }
.cat-circle { display: flex; flex-direction: column; align-items: center; gap: 12px; text-decoration: none; color: var(--text); }
.cat-img { width: 100px; height: 100px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; border: 2px solid transparent; transition: all 0.3s; }
.cat-img svg { width: 40px; height: 40px; color: var(--primary); }
.cat-circle:hover .cat-img { border-color: var(--primary); background: #fff; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(74, 124, 89, 0.15); }
.cat-circle span { font-weight: 600; font-size: 14px; }

/* PRODUCT GRID */
.section { padding: 60px; max-width: 1400px; margin: 0 auto; }
.sec-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
.sec-header h2 { font-size: 32px; color: var(--primary); }
.sec-header a { color: var(--secondary); font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.card { background: #fff; border: 1px solid var(--border); border-radius: 30px; padding: 24px; position: relative; transition: all 0.3s; display: flex; flex-direction: column; }
.card:hover { border-color: var(--primary-light); box-shadow: 0 15px 40px rgba(0,0,0,0.04); transform: translateY(-4px); }

.card-tags { position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 2; }
.tag-org { background: #E8F5E9; color: #2E7D32; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 4px; }
.tag-org svg { width: 12px; height: 12px; }
.tag-sale { background: #FFF3E0; color: #E65100; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; }

.c-img { aspect-ratio: 1; margin-bottom: 20px; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; position: relative; }
.c-img svg { width: 50%; color: var(--primary); opacity: 0.6; }
.fav-btn { position: absolute; top: 0; right: 0; background: #fff; border: 1px solid var(--border); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
.fav-btn:hover { color: #E53E3E; border-color: #E53E3E; }

.c-price { font-size: 20px; font-weight: 700; color: var(--primary); margin-bottom: 4px; display: flex; align-items: baseline; gap: 8px; }
.c-price-old { font-size: 14px; text-decoration: line-through; color: var(--text-muted); font-weight: 400; }
.c-name { font-size: 16px; font-weight: 600; margin-bottom: 4px; flex-grow: 1; }
.c-unit { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }

.qty-control { display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border); border-radius: 30px; padding: 4px; background: var(--surface); }
.qty-btn { width: 32px; height: 32px; border-radius: 50%; background: #fff; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 600; color: var(--text); transition: background 0.2s; }
.qty-btn:hover { background: var(--primary-light); color: var(--primary); border-color: var(--primary-light); }
.qty-val { font-weight: 600; font-size: 14px; width: 30px; text-align: center; }
.add-btn { background: var(--primary); color: #fff; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer; font-fxmily: 'Public Sans', sans-serif; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
.add-btn:hover { background: #3B6B48; }

/* BANNER */
.farm-banner { background: var(--surface); margin: 40px auto; max-width: 1400px; border-radius: 40px; padding: 80px 60px; display: grid; grid-template-columns: 2fr 1fr; gap: 60px; align-items: center; }
.fb-content h2 { font-fxmily: 'Playfair Display', serif; font-size: 40px; color: var(--primary); margin-bottom: 20px; }
.fb-content p { color: var(--text-muted); font-size: 16px; margin-bottom: 30px; max-width: 500px; }
.cert-logos { display: flex; gap: 24px; }
.cert-logo { width: 64px; height: 64px; border-radius: 50%; background: #fff; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; }
.cert-logo svg { width: 32px; color: var(--primary); }

/* FOOTER */
footer { background: #F2F7F4; padding: 80px 60px 40px; margin-top: 60px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; max-width: 1400px; margin: 0 auto 60px; }
.f-brand .brand { margin-bottom: 20px; }
.f-desc { color: var(--text-muted); font-size: 14px; max-width: 300px; margin-bottom: 24px; }
.socials { display: flex; gap: 16px; }
.socials a { width: 40px; height: 40px; border-radius: 50%; background: #fff; color: var(--primary); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.socials a:hover { background: var(--primary); color: #fff; }

.f-col h4 { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 24px; }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 12px; }
.f-col a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.f-col a:hover { color: var(--primary); }

.f-bottom { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 30px; font-size: 13px; color: var(--text-muted); }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
  .hero { gap: 40px; padding: 40px; }
}
@media(max-width: 1024px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .hero { grid-template-columns: 1fr; text-align: center; }
  .hero-content { padding: 40px; }
  .hero p { margin: 0 auto 32px; }
  .farm-banner { grid-template-columns: 1fr; text-align: center; padding: 60px 40px; }
  .fb-content p { margin: 0 auto 30px; }
  .cert-logos { justify-content: center; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .header-main { padding: 16px 20px; flex-wrap: wrap; gap: 20px; }
  .search-box { order: 3; width: 100%; border-radius: 20px; }
  .nav-bottom { padding: 0 20px; overflow-x: auto; }
  .nav-links { gap: 20px; }
  .delivery-tag { display: none; }
  .hero { padding: 20px; }
  .hero h1 { font-size: 40px; }
  .section { padding: 40px 20px; }
  .grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 40px; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="promo-bar">
  Welcome to FarmFresh! Use code <strong>FRESH20</strong> for 20% off your first organic box delivery.
</div>

<div class="header-main">
  <a data-href="#" class="brand">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
    FarmFresh
  </a>
  <div class="search-box">
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="color:var(--text-muted);margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    <input type="text" placeholder="Search for organic veggies, fruits, diary...">
    <button type="submit" aria-label="Search">
      &rarr;
    </button>
  </div>
  <div class="header-actions">
    <a data-href="#" class="action-item">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      Sign In
    </a>
    <a data-href="#" class="action-item">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      Favorites
    </a>
    <a data-href="#" class="action-item" style="position:relative;">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      Basket
      <div class="cart-badge">3</div>
    </a>
  </div>
</div>

<div class="nav-bottom">
  <ul class="nav-links">
    <li><a data-href="#" class="active">Daily Deals</a></li>
    <li><a data-href="#">Fresh Produce</a></li>
    <li><a data-href="#">Organic Dairy</a></li>
    <li><a data-href="#">Bakery</a></li>
    <li><a data-href="#">Pantry Staples</a></li>
  </ul>
  <div class="delivery-tag">
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    Next Delivery: Tomorrow, 8am-10am
  </div>
</div>

<div class="hero">
  <div class="hero-content">
    <div class="h-tag">Directly from Local Farms</div>
    <h1 class="serif">Eat Better.<br><span>Feel Better.</span></h1>
    <p>100% certified organic produce and groceries delivered to your door within 12 hours of harvest. Pure, unadulterated nature.</p>
    <a data-href="#shop" class="btn-primary">Shop This Week's Harvest <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
  </div>
  <div class="hero-visual">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <div class="floating-badge">
      <div class="fb-icon">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div>
        <div style="font-weight:700; color:var(--text)">Certified USDA</div>
        <div style="font-size:12px; color:var(--text-muted)">100% Organic Origin</div>
      </div>
    </div>
  </div>
</div>

<div class="cat-circles" id="shop">
  <a data-href="#" class="cat-circle">
    <div class="cat-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg></div>
    <span>Vegetables</span>
  </a>
  <a data-href="#" class="cat-circle">
    <div class="cat-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20"></path></svg></div>
    <span>Fruits</span>
  </a>
  <a data-href="#" class="cat-circle">
    <div class="cat-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M8 14h.01"></path></svg></div>
    <span>Dairy & Eggs</span>
  </a>
  <a data-href="#" class="cat-circle">
    <div class="cat-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
    <span>Bakery</span>
  </a>
  <a data-href="#" class="cat-circle">
    <div class="cat-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
    <span>Vegan</span>
  </a>
</div>

<section class="section">
  <div class="sec-header">
    <h2 class="serif">Bestsellers This Week</h2>
    <a data-href="#">See All Products &rarr;</a>
  </div>
  
  <div class="grid">
    <!-- Item 1 -->
    <div class="card">
      <div class="card-tags">
        <span class="tag-org"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Organic</span>
      </div>
      <button class="fav-btn"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
      </div>
      <div class="c-price">\$4.99</div>
      <div class="c-name">Heirloom Tomatoes</div>
      <div class="c-unit">1 lb (approx 3 pieces)</div>
      <div class="qty-control">
        <button class="qty-btn">-</button>
        <span class="qty-val">1</span>
        <button class="qty-btn">+</button>
        <button class="add-btn">Add <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="card">
      <div class="card-tags">
        <span class="tag-org"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Organic</span>
        <span class="tag-sale">Sale 15%</span>
      </div>
      <button class="fav-btn" style="color:#E53E3E; border-color:#E53E3E;"><svg width="18" height="18" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      </div>
      <div class="c-price">\$6.50 <span class="c-price-old">\$7.99</span></div>
      <div class="c-name">Free-Range Farm Eggs</div>
      <div class="c-unit">1 Dozen, Large</div>
      <div class="qty-control">
        <button class="qty-btn">-</button>
        <span class="qty-val">1</span>
        <button class="qty-btn">+</button>
        <button class="add-btn">Add <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
      </div>
    </div>

    <!-- Item 3 -->
    <div class="card">
      <div class="card-tags">
        <span class="tag-org"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Organic</span>
      </div>
      <button class="fav-btn"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div class="c-price">\$3.29</div>
      <div class="c-name">Fresh Hass Avocados</div>
      <div class="c-unit">2 pieces (medium)</div>
      <div class="qty-control">
        <button class="qty-btn">-</button>
        <span class="qty-val">1</span>
        <button class="qty-btn">+</button>
        <button class="add-btn">Add <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
      </div>
    </div>

    <!-- Item 4 -->
    <div class="card">
      <div class="card-tags">
        <span class="tag-org"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Local</span>
      </div>
      <button class="fav-btn"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      </div>
      <div class="c-price">\$5.49</div>
      <div class="c-name">Artisanal Sourdough Bread</div>
      <div class="c-unit">1 loaf, freshly baked</div>
      <div class="qty-control">
        <button class="qty-btn">-</button>
        <span class="qty-val">1</span>
        <button class="qty-btn">+</button>
        <button class="add-btn">Add <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
      </div>
    </div>
  </div>
</section>

<div class="farm-banner">
  <div class="fb-content">
    <h2>100% Traceable. Farm to Table.</h2>
    <p>Every product we carry can be traced back to the exact farm and field where it was grown. We partner exclusively with certified organic farmers who practice regenerative agriculture, ensuring healthier food for you and a healthier planet for us all.</p>
    <a data-href="#" class="btn-primary" style="background:#fff; color:var(--primary); border:2px solid var(--primary)">Read Our Sourcing Promise</a>
  </div>
  <div class="cert-logos">
    <div class="cert-logo" title="USDA Organic"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
    <div class="cert-logo" title="Non-GMO Project Verified"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
    <div class="cert-logo" title="Fair Trade"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
  </div>
</div>

<footer>
  <div class="footer-grid">
    <div class="f-brand">
      <a data-href="#" class="brand">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        FarmFresh
      </a>
      <p class="f-desc">Delivering the season's finest organic produce and responsibly sourced groceries right to your doorstep.</p>
      <div class="socials">
        <a data-href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
        <a data-href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
      </div>
    </div>
    <div class="f-col">
      <h4>Dietary Paths</h4>
      <ul>
        <li><a data-href="#">Gluten-Free</a></li>
        <li><a data-href="#">Vegan & Plant-Based</a></li>
        <li><a data-href="#">Keto Friendly</a></li>
        <li><a data-href="#">Dairy-Free</a></li>
        <li><a data-href="#">Paleo</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Our Farms</h4>
      <ul>
        <li><a data-href="#">Meet the Farmers</a></li>
        <li><a data-href="#">Seasonal Calendar</a></li>
        <li><a data-href="#">Quality Standards</a></li>
        <li><a data-href="#">Community Supported Ag</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Support</h4>
      <ul>
        <li><a data-href="#">Delivery Info</a></li>
        <li><a data-href="#">Help Center</a></li>
        <li><a data-href="#">Returns</a></li>
        <li><a data-href="#">Contact Us</a></li>
      </ul>
    </div>
  </div>
  <div class="f-bottom">
    <p>&copy; 2025 FarmFresh Organics Inc. All Rights Reserved.</p>
    <div style="display:flex;gap:20px;">
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Privacy Policy</a>
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Terms & Conditions</a>
    </div>
  </div>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "fitness-supplements": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IRONCORE | Elite Supplements</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Teko:wght@400;600;700;800&family=Barlow:ital,wght@0,400;0,600;0,800;1,800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0A0A0A;
  --surface: #171717;
  --primary: #D4FF00; /* Neon Yellow */
  --text: #FFFFFF;
  --text-muted: #888888;
  --border: #333333;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Barlow', sans-serif; font-size: 16px; line-height: 1.4; text-transform: uppercase; }
h1, h2, h3, .brand { font-fxmily: 'Teko', sans-serif; letter-spacing: 1px; }

/* AGGRESSIVE HEADER */
.promo-bar { background: var(--primary); color: #000; padding: 6px; text-align: center; font-weight: 800; font-size: 14px; letter-spacing: 2px; }
header { background: var(--bg); padding: 20px 40px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; border-bottom: 2px solid var(--border); position: sticky; top: 0; z-index: 100; }
.brand { font-size: 44px; font-weight: 800; color: #fff; text-decoration: none; line-height: 1; transform: skewX(-10deg); display: inline-block; }
.brand span { color: var(--primary); }

.nav-links { display: flex; justify-content: center; gap: 40px; list-style: none; }
.nav-links a { color: #fff; text-decoration: none; font-weight: 800; font-size: 18px; letter-spacing: 2px; transition: color 0.2s; position: relative; }
.nav-links a:hover { color: var(--primary); }
.nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 3px; background: var(--primary); transform: scaleX(0); transition: transform 0.2s; transform-origin: left; }
.nav-links a:hover::after { transform: scaleX(1); }

.header-actions { display: flex; gap: 20px; align-items: center; }
.btn-vip { background: var(--primary); color: #000; padding: 8px 20px; font-fxmily: 'Barlow', sans-serif; font-weight: 800; font-size: 14px; border: none; cursor: pointer; text-decoration: none; transform: skewX(-10deg); transition: all 0.2s; }
.btn-vip:hover { background: #fff; }
.btn-vip span { display: block; transform: skewX(10deg); letter-spacing: 1px; }

.cart-icon { color: #fff; text-decoration: none; display: flex; align-items: center; gap: 6px; font-weight: 800; }
.cart-icon:hover { color: var(--primary); }

/* HERO */
.hero { height: calc(100vh - 120px); min-height: 600px; display: flex; align-items: center; position: relative; padding: 0 80px; overflow: hidden; background: linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.4) 100%), url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23171717\\'/><path d=\\'M0 0 L100 100 M100 0 L0 100\\' stroke=\\'%23333333\\' stroke-width=\\'1\\'/></svg>') center/cover; }
.hero::after { content: ''; position: absolute; right: -5vw; top: 0; width: 40vw; height: 100%; background: var(--primary); transform: skewX(-15deg); z-index: 1; opacity: 0.1; }

.hero-content { position: relative; z-index: 2; max-width: 700px; }
.hero-tag { display: inline-block; border: 2px solid var(--primary); color: var(--primary); font-weight: 800; padding: 4px 12px; margin-bottom: 20px; transform: skewX(-10deg); }
.hero-tag span { display: block; transform: skewX(10deg); }
.hero h1 { font-size: 110px; line-height: 0.85; margin-bottom: 30px; text-transform: uppercase; color: #fff; }
.hero h1 em { font-style: normal; -webkit-text-stroke: 2px var(--primary); color: transparent; }
.hero p { font-size: 18px; font-weight: 600; color: var(--text-muted); margin-bottom: 40px; max-width: 500px; text-transform: none; }

.btn-hero { background: var(--primary); color: #000; font-fxmily: 'Teko', sans-serif; font-size: 32px; font-weight: 700; padding: 12px 48px; border: none; cursor: pointer; text-decoration: none; display: inline-block; transform: skewX(-10deg); box-shadow: -8px 8px 0px rgba(212, 255, 0, 0.3); transition: all 0.2s; }
.btn-hero:hover { box-shadow: -4px 4px 0px rgba(212, 255, 0, 0.5); transform: skewX(-10deg) translate(-4px, 4px); background: #fff; }
.btn-hero span { display: block; transform: skewX(10deg); }

/* HORIZONTAL SCROLL PRODUCT BAR */
.ticker { background: var(--primary); color: #000; padding: 16px 0; overflow: hidden; white-space: nowrap; border-top: 4px solid #fff; border-bottom: 4px solid #fff; }
.ticker-inner { display: inline-block; animation: scroll 20s linear infinite; font-fxmily: 'Teko', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 2px; }
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ANGLED PRODUCT GRID */
.section { padding: 100px 40px; max-width: 1600px; margin: 0 auto; }
.sec-title { font-size: 64px; text-align: center; margin-bottom: 60px; line-height: 1; }
.sec-title span { color: var(--primary); }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.card { background: var(--surface); position: relative; padding: 30px; border: 2px solid var(--border); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%); transition: all 0.3s; display: flex; flex-direction: column; }
.card::after { content: ''; position: absolute; bottom: 0; right: 0; width: 30px; height: 30px; background: var(--primary); transition: all 0.3s; }
.card:hover { border-color: var(--primary); transform: translateY(-10px); }

.c-badge { position: absolute; top: 16px; left: -10px; background: #fff; color: #000; font-weight: 800; font-size: 14px; padding: 4px 16px; font-fxmily: 'Teko', sans-serif; letter-spacing: 1px; z-index: 2; box-shadow: 4px 4px 0 var(--primary); }

.c-img { width: 100%; aspect-ratio: 1; background: #0A0A0A; margin-bottom: 24px; position: relative; display: flex; align-items: center; justify-content: center; }
.c-img::before { content: 'O'; font-fxmily: 'Teko', sans-serif; font-size: 200px; font-weight: 800; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: rgba(255,255,255,0.02); line-height: 0; }
.c-img svg { width: 50%; opacity: 0.8; color: var(--primary); filter: drop-shadow(0 0 10px rgba(212,255,0,0.5)); }

.c-info { flex-grow: 1; display: flex; flex-direction: column; }
.c-name { font-size: 32px; font-fxmily: 'Teko', sans-serif; line-height: 1; margin-bottom: 8px; }
.c-desc { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 24px; letter-spacing: 1px; text-transform: none; }

.c-flavor { width: 100%; background: var(--bg); border: 2px solid var(--border); color: #fff; padding: 12px; font-fxmily: 'Barlow', sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; margin-bottom: 24px; outline: none; appearance: none; cursor: pointer; }
.c-flavor:focus { border-color: var(--primary); }

.c-bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; border-top: 2px solid var(--border); padding-top: 20px; }
.c-price-box { display: flex; flex-direction: column; }
.c-price { font-fxmily: 'Teko', sans-serif; font-size: 36px; line-height: 1; color: var(--primary); font-weight: 600; }
.c-old-price { font-size: 18px; color: var(--text-muted); text-decoration: line-through; font-fxmily: 'Teko', sans-serif; margin-bottom: -4px; }

.btn-add { background: #fff; color: #000; border: none; padding: 12px 24px; font-fxmily: 'Barlow', sans-serif; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; transform: skewX(-10deg); }
.btn-add:hover { background: var(--primary); }
.btn-add span { display: block; transform: skewX(10deg); }

/* STAT BAND */
.stats { display: flex; background: var(--surface); border-top: 2px solid var(--border); border-bottom: 2px solid var(--border); }
.stat-item { flex: 1; padding: 40px; text-align: center; border-right: 2px solid var(--border); }
.stat-item:last-child { border-right: none; }
.stat-val { font-fxmily: 'Teko', sans-serif; font-size: 64px; color: var(--primary); line-height: 1; margin-bottom: 8px; }
.stat-lbl { font-size: 14px; font-weight: 800; letter-spacing: 2px; }

/* FOOTER */
footer { padding: 80px 40px 40px; background: #000; border-top: 4px solid var(--primary); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; max-width: 1600px; margin: 0 auto; }
.f-brand h2 { font-size: 56px; line-height: 1; margin-bottom: 20px; transform: skewX(-10deg); }
.f-brand h2 span { color: var(--primary); }
.f-desc { text-transform: none; color: var(--text-muted); font-weight: 600; max-width: 300px; margin-bottom: 30px; }

.f-col h4 { font-fxmily: 'Teko', sans-serif; font-size: 28px; margin-bottom: 20px; color: var(--primary); }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 12px; }
.f-col a { color: #fff; text-decoration: none; font-weight: 800; letter-spacing: 1px; transition: color 0.2s; }
.f-col a:hover { color: var(--primary); }

.vip-box { border: 2px solid var(--primary); padding: 30px; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%); }
.vip-box h4 { margin-bottom: 10px; }
.vip-box p { text-transform: none; color: var(--text-muted); font-size: 14px; margin-bottom: 20px; font-weight: 600; }
.vip-input { width: 100%; background: transparent; border: 2px solid var(--border); color: #fff; padding: 12px; font-fxmily: 'Barlow', sans-serif; font-weight: 700; margin-bottom: 12px; outline: none; }
.vip-input:focus { border-color: #fff; }
.vip-btn { width: 100%; background: var(--primary); color: #000; border: none; padding: 12px; font-fxmily: 'Barlow', sans-serif; font-weight: 800; font-size: 16px; cursor: pointer; transition: background 0.2s; }
.vip-btn:hover { background: #fff; }

.f-bottom { max-width: 1600px; margin: 40px auto 0; padding-top: 20px; border-top: 2px solid var(--border); display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: var(--text-muted); }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 900px) {
  header { grid-template-columns: 1fr auto; }
  .nav-links { display: none; }
  .hero { height: auto; min-height: auto; padding: 80px 40px; }
  .hero h1 { font-size: 80px; }
  .stats { flex-direction: column; }
  .stat-item { border-right: none; border-bottom: 2px solid var(--border); }
}
@media(max-width: 600px) {
  .hero { padding: 60px 20px; text-align: center; }
  .hero-content { display: flex; flex-direction: column; align-items: center; }
  .hero h1 { font-size: 60px; }
  .grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="promo-bar">⚡ FREE SHIPPING ON ORDERS OVER \$99 + GET A FREE SHAKER ⚡</div>

<header>
  <a data-href="#" class="brand">IRON<span>CORE</span></a>
  <ul class="nav-links">
    <li><a data-href="#">Pre-Workout</a></li>
    <li><a data-href="#">Protein</a></li>
    <li><a data-href="#">Recovery</a></li>
    <li><a data-href="#">Apparel</a></li>
  </ul>
  <div class="header-actions">
    <a data-href="#" class="btn-vip"><span>VIP LOGIN</span></a>
    <a data-href="#" class="cart-icon">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      (2)
    </a>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <div class="hero-tag"><span>CLINICALLY DOSED</span></div>
    <h1>Unleash<br>Your <em>True</em><br>Potential</h1>
    <p>No proprietary blends. No fillers. Just scientifically formulated supplements designed to push your limits and shatter plateaus.</p>
    <a data-href="#shop" class="btn-hero"><span>SHOP THE STACK &rarr;</span></a>
  </div>
</section>

<div class="ticker">
  <div class="ticker-inner">
    /// 0% FILLERS /// 100% TRANSPARENCY /// CLINICAL DOSAGES /// GMP CERTIFIED /// BANNED SUBSTANCE TESTED /// 0% FILLERS /// 100% TRANSPARENCY /// CLINICAL DOSAGES /// GMP CERTIFIED /// BANNED SUBSTANCE TESTED /// 
  </div>
</div>

<section class="section" id="shop">
  <h2 class="sec-title">ELITE <span>ARSENAL</span></h2>
  
  <div class="grid">
    <!-- Item 1 -->
    <div class="card">
      <div class="c-badge">#1 PRE-WORKOUT</div>
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-name">OBLITERATE X3</h3>
        <p class="c-desc">High-stimulant pre-workout designed for explosive energy, laser focus, and skin-tearing pumps. 400mg Caffeine.</p>
        <select class="c-flavor">
          <option>Sour Gummy Worm</option>
          <option>Blue Raspberry</option>
          <option>Fruit Punch</option>
        </select>
        <div class="c-bottom">
          <div class="c-price-box">
            <div class="c-old-price">\$49.99</div>
            <div class="c-price">\$39.99</div>
          </div>
          <button class="btn-add"><span>ADD TO CART</span></button>
        </div>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="card">
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-name">ISOLATE PRO</h3>
        <p class="c-desc">100% Hydrolyzed Whey Protein Isolate. 25g Protein, 0g Sugar, rapid absorption for ultimate muscle recovery.</p>
        <select class="c-flavor">
          <option>Fudge Brownie</option>
          <option>Vanilla Bean</option>
          <option>Peanut Butter</option>
        </select>
        <div class="c-bottom">
          <div class="c-price-box">
            <div class="c-old-price">\$64.99</div>
            <div class="c-price">\$54.99</div>
          </div>
          <button class="btn-add"><span>ADD TO CART</span></button>
        </div>
      </div>
    </div>

    <!-- Item 3 -->
    <div class="card">
      <div class="c-img">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-name">AMINO RECOVER R</h3>
        <p class="c-desc">Intra-workout EAA + BCAA complex with hydration matrix. Prevent catabolism and stay hydrated during grueling sessions.</p>
        <select class="c-flavor">
          <option>Watermelon Smash</option>
          <option>Lemon Lime</option>
        </select>
        <div class="c-bottom">
          <div class="c-price-box">
            <div class="c-old-price">\$39.99</div>
            <div class="c-price">\$29.99</div>
          </div>
          <button class="btn-add"><span>ADD TO CART</span></button>
        </div>
      </div>
    </div>

  </div>
</section>

<div class="stats">
  <div class="stat-item">
    <div class="stat-val">100%</div>
    <div class="stat-lbl">LABEL TRANSPARENCY</div>
  </div>
  <div class="stat-item">
    <div class="stat-val">3RD</div>
    <div class="stat-lbl">PARTY TESTED</div>
  </div>
  <div class="stat-item">
    <div class="stat-val">PRO</div>
    <div class="stat-lbl">ATHLETE APPROVED</div>
  </div>
</div>

<footer>
  <div class="f-grid">
    <div class="f-brand">
      <h2>IRON<span>CORE</span></h2>
      <p class="f-desc">We don't do compromises. We engineer the highest quality supplements for those who demand more from their bodies.</p>
    </div>
    <div class="f-col">
      <h4>SHOP</h4>
      <ul>
        <li><a data-href="#">ALL PRODUCTS</a></li>
        <li><a data-href="#">PRE-WORKOUTS</a></li>
        <li><a data-href="#">PROTEINS</a></li>
        <li><a data-href="#">FAT BURNERS</a></li>
        <li><a data-href="#">MERCHANDISE</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>SUPPORT</h4>
      <ul>
        <li><a data-href="#">FAQ</a></li>
        <li><a data-href="#">SHIPPING</a></li>
        <li><a data-href="#">RETURNS</a></li>
        <li><a data-href="#">CONTACT</a></li>
      </ul>
    </div>
    <div class="vip-box">
      <h4>UNLOCK VIP PRICING</h4>
      <p>Subscribe to our newsletter for 15% off your first order, exclusive drops, and workout guides.</p>
      <input type="email" class="vip-input" placeholder="EMAIL ADDRESS">
      <button class="vip-btn">GET 15% OFF</button>
    </div>
  </div>
  <div class="f-bottom">
    <div>&copy; 2025 IRONCORE SUPPS. ALL RIGHTS RESERVED.</div>
    <div style="display:flex;gap:20px;">
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">PRIVACY POLICY</a>
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">TERMS OF SERVICE</a>
    </div>
  </div>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "baby-apparel": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Little Cloud | Organic Baby Apparel</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Fredoka:wght@400;500;600&family=Nunito:wght@400;600;700&family=Pacifico&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #94C5CC; /* Soft Baby Blue */
  --secondary: #F6A8B6; /* Soft Baby Pink */
  --accent: #F9DAA8; /* Soft Yellow */
  --bg: #FDFBEE; /* Cream */
  --surface: #FFFFFF;
  --text: #4A4A4A;
  --text-muted: #8E8E8E;
  --border: #F0EAE1;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Nunito', sans-serif; font-size: 16px; line-height: 1.6; }
h1, h2, h3, h4 { font-fxmily: 'Fredoka', sans-serif; color: #3A3A3A; }
.script { font-fxmily: 'Pacifico', cursive; color: var(--secondary); font-weight: 400; }

/* SOFT HEADER */
.top-notice { background: var(--primary); color: #fff; text-align: center; padding: 10px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; }
header { padding: 24px 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: rgba(253, 251, 238, 0.95); backdrop-filter: blur(8px); z-index: 100; border-bottom: 2px dashed var(--border); }
.brand { font-fxmily: 'Fredoka', sans-serif; font-size: 32px; font-weight: 600; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 8px; }
.brand svg { width: 36px; height: 36px; color: var(--primary); }

.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: var(--text); font-weight: 600; font-size: 15px; position: relative; transition: color 0.2s; }
.nav-links a:hover { color: var(--primary); }
.nav-links a::after { content: ''; position: absolute; bottom: -8px; width: 6px; height: 6px; border-radius: 50%; background: var(--secondary); opacity: 0; transition: opacity 0.2s; }
.nav-links a:hover::after { opacity: 1; }

.header-icons { display: flex; gap: 20px; align-items: center; }
.icon-btn { background: #fff; border: 2px solid var(--border); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text); cursor: pointer; transition: all 0.2s; position: relative; }
.icon-btn:hover { border-color: var(--primary); color: var(--primary); box-shadow: 0 4px 12px rgba(148, 197, 204, 0.2); }
.cart-count { position: absolute; top: -5px; right: -5px; background: var(--secondary); color: #fff; font-size: 11px; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

/* HERO */
.hero { max-width: 1400px; margin: 40px auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding: 0 60px; align-items: center; }
.hero-text { padding-top: 40px; }
.hero h1 { font-size: 56px; line-height: 1.1; margin-bottom: 24px; }
.hero h1 .script { font-size: 64px; display: block; margin-top: -10px; margin-bottom: 10px; }
.hero p { font-size: 18px; color: var(--text-muted); margin-bottom: 32px; max-width: 450px; font-weight: 600; }
.btn-primary { background: var(--secondary); color: #fff; padding: 16px 40px; border-radius: 30px; border: none; font-fxmily: 'Fredoka', sans-serif; font-size: 18px; cursor: pointer; display: inline-block; text-decoration: none; transition: all 0.2s; box-shadow: 0 8px 20px rgba(246, 168, 182, 0.3); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(246, 168, 182, 0.4); background: #f294a5; }

.hero-img { background: var(--accent); border-radius: 40px 100px 40px 100px; position: relative; overflow: hidden; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; }
.hero-img svg { width: 50%; color: #fff; opacity: 0.9; }
.cloud-decor { position: absolute; background: #fff; border-radius: 50px; width: 120px; height: 40px; }
.c1 { top: 10%; right: 10%; opacity: 0.5; }
.c2 { bottom: 20%; left: 5%; opacity: 0.3; width: 80px; }

/* QUICK SHOP ROW */
.quick-shop { display: flex; justify-content: center; gap: 24px; margin: 60px 0; padding: 0 20px; overflow-x: auto; }
.qs-item { display: flex; align-items: center; gap: 12px; background: #fff; border: 2px solid var(--border); padding: 12px 24px 12px 12px; border-radius: 40px; text-decoration: none; color: var(--text); font-weight: 600; transition: all 0.2s; white-space: nowrap; }
.qs-item:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(148, 197, 204, 0.15); }
.qs-icon { width: 44px; height: 44px; border-radius: 50%; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--primary); }
.qs-icon svg { width: 24px; height: 24px; }

/* PRODUCTS */
.shop-section { max-width: 1400px; margin: 0 auto; padding: 0 60px 80px; }
.sec-title { text-align: center; margin-bottom: 50px; }
.sec-title h2 { font-size: 36px; display: inline-block; position: relative; }
.sec-title h2::after { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 40px; height: 4px; background: var(--secondary); border-radius: 2px; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.card { background: #fff; border-radius: 32px; padding: 24px; transition: all 0.3s; position: relative; border: 2px solid transparent; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.card:hover { border-color: var(--border); transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.06); }

.c-age-tag { position: absolute; top: 20px; left: -10px; background: var(--primary); color: #fff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 0 20px 20px 0; box-shadow: 0 4px 10px rgba(148, 197, 204, 0.3); z-index: 2; }

.c-img { aspect-ratio: 4/5; background: var(--bg); border-radius: 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.card:nth-child(2) .c-img { background: #F8F0F2; }
.card:nth-child(3) .c-img { background: #F0F6F7; }
.c-img svg { width: 40%; color: var(--text-muted); opacity: 0.5; transition: transform 0.3s; }
.card:hover .c-img svg { transform: scale(1.05); color: var(--primary); opacity: 0.8; }

.c-wish { position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: none; cursor: pointer; transition: color 0.2s; }
.c-wish:hover { color: var(--secondary); }

.c-info { text-align: center; }
.c-title { font-size: 18px; margin-bottom: 8px; font-fxmily: 'Fredoka', sans-serif; font-weight: 500; }
.c-price { font-weight: 700; color: var(--primary); font-size: 18px; margin-bottom: 16px; }

.c-colors { display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; }
.color-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px var(--border); cursor: pointer; }
.color-dot.active { box-shadow: 0 0 0 1px var(--text); }

.btn-add { width: 100%; background: #fff; color: var(--text); border: 2px solid var(--border); padding: 12px; border-radius: 20px; font-fxmily: 'Fredoka', sans-serif; font-size: 16px; cursor: pointer; transition: all 0.2s; }
.btn-add:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

/* GIFT BANNER */
.gift-banner { max-width: 1200px; margin: 80px auto; background: linear-gradient(135deg, #F8F0F2 0%, #FFFFFF 100%); border-radius: 40px; padding: 60px; display: flex; align-items: center; gap: 60px; border: 2px dashed var(--secondary); position: relative; }
.gb-icon { width: 120px; height: 120px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 10px 30px rgba(246, 168, 182, 0.2); }
.gb-icon svg { width: 60px; color: var(--secondary); }
.gb-text h2 { font-size: 32px; margin-bottom: 16px; color: var(--secondary); }
.gb-text p { font-size: 16px; color: var(--text-muted); margin-bottom: 24px; max-width: 500px; }
.btn-outline { background: transparent; color: var(--secondary); border: 2px solid var(--secondary); padding: 12px 30px; border-radius: 30px; font-fxmily: 'Fredoka', sans-serif; font-size: 16px; text-decoration: none; display: inline-block; transition: all 0.2s; }
.btn-outline:hover { background: var(--secondary); color: #fff; }

/* FOOTER */
footer { background: #fff; padding: 80px 60px 40px; margin-top: 60px; border-top: 2px solid var(--border); border-radius: 60px 60px 0 0; }
.f-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; max-width: 1400px; margin: 0 auto; }
.f-brand p { color: var(--text-muted); font-size: 15px; margin-top: 16px; margin-bottom: 24px; max-width: 280px; }
.socials { display: flex; gap: 12px; }
.socials a { width: 40px; height: 40px; border-radius: 50%; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--primary); transition: all 0.2s; }
.socials a:hover { background: var(--primary); color: #fff; }

.f-col h4 { font-size: 18px; margin-bottom: 24px; color: var(--text); }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 16px; }
.f-col a { color: var(--text-muted); text-decoration: none; font-size: 15px; font-weight: 600; transition: color 0.2s; }
.f-col a:hover { color: var(--primary); }

.f-bottom { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 60px auto 0; padding-top: 30px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text-muted); }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero { grid-template-columns: 1fr; text-align: center; gap: 40px; }
  .hero p { margin-left: auto; margin-right: auto; }
  .grid { grid-template-columns: repeat(2, 1fr); }
  .gift-banner { flex-direction: column; text-align: center; margin: 60px 20px; padding: 40px 20px; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  header { padding: 16px 20px; }
  .nav-links { display: none; }
  .hero { padding: 0 20px; }
  .hero h1 { font-size: 40px; }
  .hero h1 .script { font-size: 48px; }
  .quick-shop { justify-content: flex-start; padding-bottom: 20px; }
  .shop-section { padding: 0 20px 60px; }
  .grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; gap: 40px; }
  .f-bottom { flex-direction: column; gap: 20px; text-align: center; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="top-notice">✨ Free organic cotton tote with every bundle purchase! ✨</div>

<header>
  <a data-href="#" class="brand">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
    Little Cloud
  </a>
  <ul class="nav-links">
    <li><a data-href="#">New Arrivals</a></li>
    <li><a data-href="#">Baby Girls</a></li>
    <li><a data-href="#">Baby Boys</a></li>
    <li><a data-href="#">Gender Neutral</a></li>
    <li><a data-href="#">Nursery</a></li>
  </ul>
  <div class="header-icons">
    <button class="icon-btn">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </button>
    <button class="icon-btn">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      <span class="cart-count">2</span>
    </button>
  </div>
</header>

<section class="hero">
  <div class="hero-text">
    <h1>Gentle on Skin, <span class="script">Kind to Earth</span></h1>
    <p>Discover our thoughtfully curated collection of 100% GOTS certified organic cotton essentials for your little ones.</p>
    <a data-href="#" class="btn-primary">Shop the Spring Collection</a>
  </div>
  <div class="hero-img">
    <div class="cloud-decor c1"></div>
    <div class="cloud-decor c2"></div>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  </div>
</section>

<div class="quick-shop">
  <a data-href="#" class="qs-item">
    <div class="qs-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div>
    Sleepwear
  </a>
  <a data-href="#" class="qs-item">
    <div class="qs-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg></div>
    Bodysuits
  </a>
  <a data-href="#" class="qs-item">
    <div class="qs-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg></div>
    Outerwear
  </a>
  <a data-href="#" class="qs-item">
    <div class="qs-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
    Accessories
  </a>
</div>

<section class="shop-section">
  <div class="sec-title">
    <h2>Must-Haves for Mini Milestones</h2>
  </div>
  
  <div class="grid">
    <!-- Product 1 -->
    <div class="card">
      <div class="c-age-tag">0-3 Months</div>
      <div class="c-img">
        <button class="c-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-title">Ribbed Organic Cotton Romper</h3>
        <div class="c-price">\$28.00</div>
        <div class="c-colors">
          <div class="color-dot active" style="background:#DECFCD"></div>
          <div class="color-dot" style="background:#DED6CD"></div>
          <div class="color-dot" style="background:#CDD3DE"></div>
        </div>
        <button class="btn-add">Select Size</button>
      </div>
    </div>

    <!-- Product 2 -->
    <div class="card">
      <div class="c-age-tag">3-6 Months</div>
      <div class="c-img">
        <button class="c-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-title">Knit Cardigan & Hat Set</h3>
        <div class="c-price">\$45.00</div>
        <div class="c-colors">
          <div class="color-dot active" style="background:#EBCACB"></div>
          <div class="color-dot" style="background:#F2E2C4"></div>
        </div>
        <button class="btn-add">Select Size</button>
      </div>
    </div>

    <!-- Product 3 -->
    <div class="card">
      <div class="c-age-tag">6-12 Months</div>
      <div class="c-img">
        <button class="c-wish"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-title">Two-Piece Linen Outfit</h3>
        <div class="c-price">\$38.00</div>
        <div class="c-colors">
          <div class="color-dot active" style="background:#C6D6D9"></div>
        </div>
        <button class="btn-add">Select Size</button>
      </div>
    </div>
  </div>
</section>

<div class="gift-banner">
  <div class="gb-icon">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg>
  </div>
  <div class="gb-text">
    <h2>The Perfect Gift, Beautifully Wrapped</h2>
    <p>Sending a gift? We offer premium gift wrapping featuring our signature recycled paper, a hand-written card, and careful packaging to make the unboxing experience truly special.</p>
    <a data-href="#" class="btn-outline">Add Gift Wrapping - \$5</a>
  </div>
</div>

<footer>
  <div class="f-grid">
    <div class="f-brand">
      <a data-href="#" class="brand" style="font-size:24px;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="width:28px;height:28px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
        Little Cloud
      </a>
      <p>Beautiful, sustainable, and organic clothing designed for maximum comfort and cuteness.</p>
      <div class="socials">
        <a data-href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
        <a data-href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
      </div>
    </div>
    <div class="f-col">
      <h4>Shop Categories</h4>
      <ul>
        <li><a data-href="#">Newborn (0-9m)</a></li>
        <li><a data-href="#">Baby (9-24m)</a></li>
        <li><a data-href="#">Toddler (2T-5T)</a></li>
        <li><a data-href="#">Multipacks</a></li>
        <li><a data-href="#">Gift Sets</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Our Promise</h4>
      <ul>
        <li><a data-href="#">Materials & Sourcing</a></li>
        <li><a data-href="#">Ethical Manufacturing</a></li>
        <li><a data-href="#">Recycling Program</a></li>
        <li><a data-href="#">Giving Back</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Customer Care</h4>
      <ul>
        <li><a data-href="#">Contact Us</a></li>
        <li><a data-href="#">Shipping & Returns</a></li>
        <li><a data-href="#">Size Guide</a></li>
        <li><a data-href="#">FAQ</a></li>
      </ul>
    </div>
  </div>
  <div class="f-bottom">
    <div>&copy; 2025 Little Cloud Organic Baby Apparel.</div>
    <div style="display:flex;gap:20px;">
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Privacy Policy</a>
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Terms of Service</a>
    </div>
  </div>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "coffee-roasters": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Onyx Roasters | Artisanal Coffee</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Bitter:ital,wght@0,400;0,600;0,700;1,400&family=Karla:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #3E2723; /* Deep Brown */
  --secondary: #D84315; /* Burnt Orange */
  --bg: #F5EFEB; /* Warm Cream */
  --surface: #FFFFFF;
  --text: #2D2725;
  --text-muted: #79716E;
  --border: #E8DDCD;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Karla', sans-serif; font-size: 16px; line-height: 1.6; }
h1, h2, h3, h4, .brand { font-fxmily: 'Bitter', serif; color: var(--primary); }

/* HEADER */
.promo { background: var(--secondary); color: #fff; text-align: center; padding: 10px; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
header { padding: 30px 60px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 1px solid var(--border); }
.nav-links { display: flex; gap: 30px; list-style: none; }
.nav-links a { color: var(--primary); text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; transition: color 0.2s; position: relative; }
.nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 2px; background: var(--secondary); transform: scaleX(0); transition: transform 0.2s; transform-origin: left; }
.nav-links a:hover::after { transform: scaleX(1); }

.brand { font-size: 32px; font-weight: 700; text-decoration: none; text-align: center; letter-spacing: 2px; text-transform: uppercase; }

.header-actions { display: flex; gap: 24px; justify-content: flex-end; align-items: center; }
.action-btn { color: var(--primary); text-decoration: none; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
.action-btn:hover { color: var(--secondary); }

/* HERO */
.hero { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.hero-content { padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; }
.h-tag { font-size: 12px; font-weight: 700; color: var(--secondary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
.hero h1 { font-size: 64px; line-height: 1.1; margin-bottom: 24px; }
.hero p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; max-width: 450px; }
.btn-primary { background: var(--primary); color: #fff; padding: 16px 32px; font-fxmily: 'Karla', sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; display: inline-block; width: max-content; transition: background 0.2s; border: 1px solid var(--primary); }
.btn-primary:hover { background: #5c3a34; }

.hero-img { background: #e3d5ca; position: relative; border-left: 1px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.hero-img::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%); }
.hero-img svg { width: 60%; color: var(--primary); opacity: 0.1; }

/* TASTING BAND */
.taste-band { display: flex; background: var(--surface); border-bottom: 1px solid var(--border); }
.taste-item { flex: 1; padding: 40px; text-align: center; border-right: 1px solid var(--border); }
.taste-item:last-child { border-right: none; }
.taste-icon { margin-bottom: 16px; color: var(--secondary); }
.taste-icon svg { width: 32px; height: 32px; }
.taste-comp { font-fxmily: 'Bitter', serif; font-size: 20px; color: var(--primary); margin-bottom: 8px; }
.taste-desc { font-size: 14px; color: var(--text-muted); }

/* PRODUCTS */
.shop { padding: 100px 60px; max-width: 1400px; margin: 0 auto; }
.shop-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; }
.shop-header h2 { font-size: 40px; }
.shop-header p { color: var(--text-muted); font-size: 18px; max-width: 400px; margin-top: 10px; }
.shop-link { color: var(--secondary); font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; border-bottom: 1px solid var(--secondary); padding-bottom: 4px; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.card { background: var(--surface); padding: 40px 30px; border: 1px solid var(--border); position: relative; transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(62, 39, 35, 0.08); }

.c-img-box { aspect-ratio: 3/4; background: var(--bg); margin-bottom: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); position: relative; }
.c-img-box::before { content: ''; position: absolute; width: 60%; height: 80%; border: 1px dashed rgba(62,39,35,0.2); }
.c-img-box svg { width: 40%; color: var(--primary); opacity: 0.8; }

.c-origin { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--secondary); margin-bottom: 8px; display: block; }
.c-title { font-size: 24px; margin-bottom: 12px; line-height: 1.2; }
.c-notes { display: flex; gap: 8px; margin-bottom: 24px; }
.note { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid var(--border); padding: 4px 10px; color: var(--text-muted); }

.c-grind { width: 100%; border: 1px solid var(--border); background: transparent; padding: 12px; font-fxmily: 'Karla', sans-serif; font-size: 14px; color: var(--text); outline: none; margin-bottom: 24px; cursor: pointer; appearance: none; }
.c-grind:focus { border-color: var(--primary); }

.c-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.c-price { font-fxmily: 'Bitter', serif; font-size: 24px; color: var(--primary); }
.btn-add { background: transparent; color: var(--primary); border: 1px solid var(--primary); padding: 10px 24px; font-fxmily: 'Karla', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; }
.btn-add:hover { background: var(--primary); color: #fff; }

/* ROASTERY BLURB */
.roastery { display: grid; grid-template-columns: 1fr 1fr; background: var(--primary); color: #fff; margin: 0 40px; border-radius: 4px; overflow: hidden; }
.r-img { background: #2c1c19; position: relative; min-height: 400px; display: flex; align-items: center; justify-content: center; }
.r-img svg { width: 40%; stroke: var(--secondary); stroke-width: 0.5; opacity: 0.8; }
.r-content { padding: 80px; display: flex; flex-direction: column; justify-content: center; }
.r-content h2 { color: #fff; font-size: 40px; margin-bottom: 24px; }
.r-content p { font-size: 16px; color: rgba(255,255,255,0.7); margin-bottom: 40px; line-height: 1.8; }
.btn-secondary { background: transparent; border: 1px solid #fff; color: #fff; padding: 14px 32px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; width: max-content; transition: all 0.2s; font-size: 13px; }
.btn-secondary:hover { background: #fff; color: var(--primary); }

/* CLUB FORM */
.club { text-align: center; padding: 100px 20px; max-width: 600px; margin: 0 auto; }
.club h2 { font-size: 36px; margin-bottom: 16px; }
.club p { color: var(--text-muted); margin-bottom: 30px; font-size: 16px; }
.c-form { display: flex; gap: 10px; }
.c-input { flex-grow: 1; border: 1px solid var(--primary); background: transparent; padding: 14px 20px; font-fxmily: 'Karla', sans-serif; font-size: 15px; outline: none; }
.c-btn { background: var(--secondary); color: #fff; border: 1px solid var(--secondary); padding: 0 30px; font-fxmily: 'Karla', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: background 0.2s; }
.c-btn:hover { background: #bf3810; }

/* FOOTER */
footer { background: var(--surface); padding: 80px 60px 40px; border-top: 1px solid var(--border); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; max-width: 1400px; margin: 0 auto; }
.f-brand p { color: var(--text-muted); font-size: 15px; margin-top: 24px; max-width: 300px; }

.f-col h4 { font-fxmily: 'Karla', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; color: var(--text); }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 12px; }
.f-col a { color: var(--text-muted); text-decoration: none; font-size: 15px; transition: color 0.2s; }
.f-col a:hover { color: var(--secondary); }

.f-bottom { max-width: 1400px; margin: 80px auto 0; padding-top: 30px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }

/* RESPONSIVE */
@media(max-width: 1200px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .shop-header { flex-direction: column; align-items: flex-start; gap: 20px; }
}
@media(max-width: 1024px) {
  .hero, .roastery { grid-template-columns: 1fr; }
  .hero-content { padding: 60px; text-align: center; align-items: center; }
  .hero-img { display: none; }
  .taste-band { flex-wrap: wrap; }
  .taste-item { min-width: 50%; border-bottom: 1px solid var(--border); }
  .taste-item:nth-child(even) { border-right: none; }
  .r-content { padding: 60px 40px; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  header { grid-template-columns: 1fr auto; padding: 20px; gap: 20px; }
  .nav-links { display: none; }
  .hero h1 { font-size: 48px; }
  .shop { padding: 60px 20px; }
  .grid { grid-template-columns: 1fr; }
  .roastery { margin: 0 20px; }
  .c-form { flex-direction: column; }
  .c-btn { padding: 16px; }
  .f-grid { grid-template-columns: 1fr; }
  .f-bottom { flex-direction: column; gap: 16px; text-align: center; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="promo">Complimentary shipping on whole bean orders over \$50</div>

<header>
  <ul class="nav-links">
    <li><a data-href="#">Shop Coffee</a></li>
    <li><a data-href="#">Brew Gear</a></li>
    <li><a data-href="#">Subscriptions</a></li>
  </ul>
  <a data-href="#" class="brand">Onyx</a>
  <div class="header-actions">
    <a data-href="#" class="action-btn">Log In</a>
    <a data-href="#" class="action-btn">
      Cart [2]
    </a>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <span class="h-tag">Current Harvest</span>
    <h1>Fincas of<br>Antioquia.</h1>
    <p>A strictly high-grown Colombian micro-lot featuring vibrant notes of red currant, brown sugar, and a delicate floral finish. Roasted to order in small batches.</p>
    <a data-href="#shop" class="btn-primary">Shop This Micro-Lot</a>
  </div>
  <div class="hero-img">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
  </div>
</section>

<div class="taste-band">
  <div class="taste-item">
    <div class="taste-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg></div>
    <div class="taste-comp">Fruity & Floral</div>
    <div class="taste-desc">Vibrant acidity with berry undertones.</div>
  </div>
  <div class="taste-item">
    <div class="taste-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
    <div class="taste-comp">Chocolate & Nut</div>
    <div class="taste-desc">Rich cocoa depth with toasted almond.</div>
  </div>
  <div class="taste-item">
    <div class="taste-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg></div>
    <div class="taste-comp">Sweet & Sugary</div>
    <div class="taste-desc">Caramelized sugar and honeyed sweetness.</div>
  </div>
  <div class="taste-item">
    <div class="taste-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
    <div class="taste-comp">Roast Profile</div>
    <div class="taste-desc">From gentle light to robust dark roasts.</div>
  </div>
</div>

<section class="shop" id="shop">
  <div class="shop-header">
    <div>
      <h2>Single Origin Offerings</h2>
      <p>Sourced from sustainable farms across the coffee belt. We roast to highlight the innate characteristics of each bean.</p>
    </div>
    <a data-href="#" class="shop-link">View Full Catalog</a>
  </div>

  <div class="grid">
    <!-- Item 1 -->
    <div class="card">
      <div class="c-img-box">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="5" y="4" width="14" height="16" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
      </div>
      <span class="c-origin">Ethiopia &middot; Washed</span>
      <h3 class="c-title">Yirgacheffe Kochere</h3>
      <div class="c-notes">
        <span class="note">Jasmine</span>
        <span class="note">Peach</span>
        <span class="note">Black Tea</span>
      </div>
      <select class="c-grind">
        <option>Whole Bean</option>
        <option>French Press</option>
        <option>Drip / Maker</option>
        <option>Espresso</option>
      </select>
      <div class="c-footer">
        <div class="c-price">\$22.00</div>
        <button class="btn-add">Add to Bag</button>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="card">
      <div class="c-img-box" style="background:#e8ecef;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="5" y="4" width="14" height="16" rx="2"></rect><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="16" y2="14"></line></svg>
      </div>
      <span class="c-origin">Colombia &middot; Natural</span>
      <h3 class="c-title">Finca El Paraiso</h3>
      <div class="c-notes">
        <span class="note">Strawberry</span>
        <span class="note">Cacao</span>
        <span class="note">Wine</span>
      </div>
      <select class="c-grind">
        <option>Whole Bean</option>
        <option>French Press</option>
        <option>Drip / Maker</option>
        <option>Espresso</option>
      </select>
      <div class="c-footer">
        <div class="c-price">\$24.00</div>
        <button class="btn-add">Add to Bag</button>
      </div>
    </div>

    <!-- Item 3 -->
    <div class="card">
      <div class="c-img-box" style="background:#EFEBE8;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M12 9l3 3-3 3"></path><path d="M9 12h6"></path></svg>
      </div>
      <span class="c-origin">Guatemala &middot; Washed</span>
      <h3 class="c-title">Antigua La Flor</h3>
      <div class="c-notes">
        <span class="note">Milk Choc</span>
        <span class="note">Orange</span>
        <span class="note">Almond</span>
      </div>
      <select class="c-grind">
        <option>Whole Bean</option>
        <option>French Press</option>
        <option>Drip / Maker</option>
        <option>Espresso</option>
      </select>
      <div class="c-footer">
        <div class="c-price">\$20.00</div>
        <button class="btn-add">Add to Bag</button>
      </div>
    </div>
  </div>
</section>

<div class="roastery">
  <div class="r-img">
    <svg fill="none" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="20"/><path d="M50 20 L50 80 M20 50 L80 50"/></svg>
  </div>
  <div class="r-content">
    <h2>The Roastery</h2>
    <p>Every small batch is roasted on our vintage Probat in Portland, Oregon. We use careful data logging combined with sensory intuition to develop a roast profile that respects the hard work of the producers. No cutting corners, just beautiful coffee.</p>
    <a data-href="#" class="btn-secondary">Learn Our Process</a>
  </div>
</div>

<div class="club">
  <h2>The Coffee Club</h2>
  <p>Join our newsletter. No spam, just updates on fresh harvests, brewing guides, and exclusive subscriber-only micro-lots.</p>
  <form class="c-form">
    <input type="email" class="c-input" placeholder="Enter your email address">
    <button type="submit" class="c-btn">Subscribe</button>
  </form>
</div>

<footer>
  <div class="f-grid">
    <div>
      <h3 class="brand">Onyx</h3>
      <p>Independent coffee roasters dedicated to transparency, quality, and community.</p>
    </div>
    <div class="f-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">All Coffee</a></li>
        <li><a data-href="#">Subscriptions</a></li>
        <li><a data-href="#">Brewing Equipment</a></li>
        <li><a data-href="#">Merchandise</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Learn</h4>
      <ul>
        <li><a data-href="#">Brew Guides</a></li>
        <li><a data-href="#">Our Sourcing</a></li>
        <li><a data-href="#">The Roastery</a></li>
        <li><a data-href="#">Journal</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Support</h4>
      <ul>
        <li><a data-href="#">Contact Us</a></li>
        <li><a data-href="#">Shipping Policy</a></li>
        <li><a data-href="#">Wholesale</a></li>
        <li><a data-href="#">FAQ</a></li>
      </ul>
    </div>
  </div>
  <div class="f-bottom">
    <div>&copy; 2025 Onyx Coffee Roasters. All rights reserved.</div>
    <div style="display:flex;gap:30px;">
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Privacy</a>
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Terms</a>
    </div>
  </div>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "beauty-cosmetics": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AURA | Conscious Beauty</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Jost:wght@300;400;500;600&family=Tenor+Sans&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #544941;
  --secondary: #D4BBA5;
  --bg: #FAFAF8;
  --surface: #FFFFFF;
  --text: #333333;
  --text-muted: #8A8582;
  --border: #E8E5E1;
  --shade-1: #F5EAE1;
  --shade-2: #E1CABB;
  --shade-3: #C29A83;
  --shade-4: #8C5C41;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-fxmily: 'Jost', sans-serif; font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
h1, h2, h3, .brand { font-fxmily: 'Tenor Sans', sans-serif; font-weight: normal; }

/* HEADER */
.promo { background: var(--primary); color: #fff; text-align: center; padding: 12px; font-weight: 400; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
header { background: rgba(250, 250, 248, 0.9); backdrop-filter: blur(10px); padding: 20px 60px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(232, 229, 225, 0.5); }
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a { color: var(--text); text-decoration: none; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; transition: color 0.3s; }
.nav-links a:hover { color: var(--secondary); }

.brand { font-size: 28px; letter-spacing: 4px; color: var(--primary); text-decoration: none; }

.header-actions { display: flex; justify-content: flex-end; gap: 24px; }
.action-btn { background: none; border: none; color: var(--text); cursor: pointer; display: flex; align-items: center; gap: 8px; transition: color 0.3s; font-fxmily: 'Jost', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
.action-btn:hover { color: var(--secondary); }
.action-btn svg { width: 20px; height: 20px; stroke-width: 1.5; }

/* HERO - ASYMMETRICAL */
.hero { display: grid; grid-template-columns: 1.2fr 0.8fr; height: calc(100vh - 100px); min-height: 600px; border-bottom: 1px solid var(--border); }
.hero-content { padding: 10vw 8vw; display: flex; flex-direction: column; justify-content: center; background: radial-gradient(circle at top left, #FFFFFF 0%, #FAFAF8 100%); }
.h-tag { font-fxmily: 'Jost', sans-serif; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 24px; display: block; }
.hero h1 { font-size: 72px; line-height: 1.1; margin-bottom: 32px; color: var(--primary); }
.hero p { font-size: 18px; color: var(--text-muted); margin-bottom: 48px; max-width: 480px; font-weight: 300; }
.btn-primary { background: var(--primary); color: #fff; border: 1px solid var(--primary); padding: 16px 48px; font-fxmily: 'Jost', sans-serif; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; display: inline-block; transition: all 0.4s ease; width: max-content; }
.btn-primary:hover { background: transparent; color: var(--primary); }

.hero-img { background: var(--shade-1); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.hero-img svg { width: 40%; color: var(--shade-3); opacity: 0.3; filter: blur(2px); }
.floating-element { position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, var(--shade-2) 0%, transparent 70%); border-radius: 50%; opacity: 0.6; mix-blend-mode: multiply; filter: blur(20px); }

/* SHOP SECTION */
.shop { padding: 120px 6vw; max-width: 1600px; margin: 0 auto; }
.shop-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 80px; }
.shop-header h2 { font-size: 40px; color: var(--primary); }
.shop-header a { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.3s; padding-bottom: 4px; }
.shop-header a:hover { color: var(--primary); border-color: var(--primary); }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; }
.card { position: relative; transition: transform 0.4s ease; cursor: pointer; }
.card:hover { transform: translateY(-10px); }

.c-img-box { aspect-ratio: 3/4; background: var(--surface); margin-bottom: 32px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.c-img-box::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.02) 100%); }
.c-img-box svg { width: 30%; color: var(--primary); opacity: 0.6; transition: transform 0.6s cubic-bezier(0.2, 1, 0.3, 1); }
.card:hover .c-img-box svg { transform: scale(1.05); }

.c-tag { position: absolute; top: 24px; left: 24px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); z-index: 2; }

.c-info { display: flex; flex-direction: column; }
.c-title { font-size: 20px; margin-bottom: 8px; color: var(--primary); }
.c-price { font-size: 15px; color: var(--text-muted); margin-bottom: 20px; }

/* Swatches */
.swatches { display: flex; gap: 8px; margin-bottom: 24px; }
.swatch { width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; position: relative; }
.swatch.active { border: 1px solid var(--primary); padding: 2px; background-clip: content-box; }
.swatch:hover { transform: scale(1.1); }

.btn-card { width: 100%; background: transparent; border: 1px solid var(--border); padding: 14px; font-fxmily: 'Jost', sans-serif; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; color: var(--text); }
.card:hover .btn-card { border-color: var(--primary); }
.btn-card:hover { background: var(--primary); color: #fff; }

/* INGREDIENTS BANNER */
.ingredients { margin: 80px 0; background: var(--shade-1); padding: 100px 6vw; display: flex; justify-content: center; }
.i-content { max-width: 800px; text-align: center; }
.i-content h2 { font-size: 48px; margin-bottom: 32px; color: var(--primary); }
.i-content p { font-size: 18px; color: var(--text-muted); line-height: 1.8; margin-bottom: 48px; font-weight: 300; }
.i-grid { display: flex; justify-content: center; gap: 60px; }
.i-item { display: flex; flex-direction: column; align-items: center; }
.i-icon { width: 64px; height: 64px; border-radius: 50%; border: 1px solid var(--secondary); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--primary); }
.i-item span { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--text); }

/* FOOTER */
footer { padding: 80px 6vw 40px; background: var(--surface); border-top: 1px solid var(--border); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 80px; }
.f-brand p { color: var(--text-muted); font-size: 14px; margin-top: 24px; max-width: 280px; line-height: 1.8; }
.newsletter { margin-top: 32px; display: flex; border-bottom: 1px solid var(--border); padding-bottom: 8px; max-width: 300px; }
.newsletter input { border: none; outline: none; background: transparent; font-fxmily: 'Jost', sans-serif; font-size: 14px; flex-grow: 1; }
.newsletter button { background: none; border: none; cursor: pointer; color: var(--primary); font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }

.f-col h4 { font-fxmily: 'Jost', sans-serif; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 32px; color: var(--text); }
.f-col ul { list-style: none; }
.f-col li { margin-bottom: 16px; }
.f-col a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.3s; }
.f-col a:hover { color: var(--primary); }

.f-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 32px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; }

/* STICKY ADD TO BAG (Shows on scroll) */
.sticky-atc { position: fixed; bottom: -100px; left: 0; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 16px 6vw; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); z-index: 90; transition: bottom 0.4s ease; box-shadow: 0 -10px 30px rgba(0,0,0,0.02); }
.sticky-atc.visible { bottom: 0; }
.s-prod { display: flex; align-items: center; gap: 24px; }
.s-prod-img { width: 48px; height: 48px; background: var(--shade-1); display: flex; align-items: center; justify-content: center; }
.s-prod-img svg { width: 24px; color: var(--primary); }
.s-prod-info h4 { font-size: 16px; color: var(--primary); margin-bottom: 4px; }
.s-prod-info p { font-fxmily: 'Jost', sans-serif; font-size: 13px; color: var(--text-muted); }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero { grid-template-columns: 1fr; height: auto; min-height: auto; }
  .hero-content { padding: 80px 6vw; text-align: center; align-items: center; }
  .hero-img { display: none; }
  .grid { grid-template-columns: repeat(2, 1fr); }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  header { grid-template-columns: 1fr auto; padding: 20px 6vw; gap: 20px; }
  .nav-links { display: none; }
  .hero h1 { font-size: 48px; }
  .grid { grid-template-columns: 1fr; }
  .shop-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .i-grid { flex-direction: column; gap: 40px; }
  .f-grid { grid-template-columns: 1fr; gap: 40px; }
  .f-bottom { flex-direction: column; gap: 16px; text-align: center; }
  .sticky-atc { flex-direction: column; gap: 16px; padding: 20px 6vw; }
  .sticky-atc .btn-primary { width: 100%; text-align: center; }
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="promo">Complimentary Serum with orders over \$150</div>

<header>
  <ul class="nav-links">
    <li><a data-href="#">Shop</a></li>
    <li><a data-href="#">About</a></li>
    <li><a data-href="#">Journal</a></li>
  </ul>
  <a data-href="#" class="brand">AURA</a>
  <div class="header-actions">
    <button class="action-btn">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      Search
    </button>
    <button class="action-btn">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      Cart (0)
    </button>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <span class="h-tag">New Formulation</span>
    <h1>Luminous silk. <br>Breathable cover.</h1>
    <p>Discover our new weightless foundation formula. Enriched with botanical extracts to nourish your skin while providing a flawless, imperceptible finish.</p>
    <a data-href="#shop" class="btn-primary">Shop The Collection</a>
  </div>
  <div class="hero-img">
    <div class="floating-element" style="top: -50px; left: -50px;"></div>
    <div class="floating-element" style="bottom: -100px; right: -50px; background: radial-gradient(circle, var(--shade-3) 0%, transparent 70%);"></div>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <!-- abstract organic shape representation -->
  </div>
</section>

<section class="shop" id="shop">
  <div class="shop-header">
    <h2>Curated Essentials</h2>
    <a data-href="#">View All Products</a>
  </div>

  <div class="grid">
    <!-- Item 1 -->
    <div class="card">
      <div class="c-tag">Best Seller</div>
      <div class="c-img-box">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="7" y="3" width="10" height="18" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line></svg>
      </div>
      <div class="c-info">
        <h3 class="c-title">Silk Veil Foundation</h3>
        <div class="c-price">\$54.00</div>
        <div class="swatches">
          <div class="swatch active" style="background:var(--shade-1)"></div>
          <div class="swatch" style="background:var(--shade-2)"></div>
          <div class="swatch" style="background:var(--shade-3)"></div>
          <div class="swatch" style="background:var(--shade-4)"></div>
        </div>
        <button class="btn-card">Add to Bag</button>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="card">
      <div class="c-img-box">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      </div>
      <div class="c-info">
        <h3 class="c-title">Botanical Hydration Serum</h3>
        <div class="c-price">\$68.00</div>
        <div class="swatches" style="opacity:0; pointer-events:none;">
          <div class="swatch"></div>
        </div>
        <button class="btn-card">Add to Bag</button>
      </div>
    </div>

    <!-- Item 3 -->
    <div class="card">
      <div class="c-img-box">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle></svg>
      </div>
      <div class="c-info">
        <h3 class="c-title">Radiance Cream Blush</h3>
        <div class="c-price">\$32.00</div>
        <div class="swatches">
          <div class="swatch active" style="background:#DEB8B1"></div>
          <div class="swatch" style="background:#C48981"></div>
          <div class="swatch" style="background:#B36B66"></div>
        </div>
        <button class="btn-card">Add to Bag</button>
      </div>
    </div>
  </div>
</section>

<div class="ingredients">
  <div class="i-content">
    <h2>Formulated without compromise.</h2>
    <p>We believe that luxury beauty shouldn't come at the cost of your health or the environment. Our products use only safe, consciously-sourced ingredients that perform flawlessly while treating your skin with the purest respect.</p>
    <div class="i-grid">
      <div class="i-item">
        <div class="i-icon"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div>
        <span>Cruelty Free</span>
      </div>
      <div class="i-item">
        <div class="i-icon"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
        <span>Vegan Made</span>
      </div>
      <div class="i-item">
        <div class="i-icon"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
        <span>Clean Ingredients</span>
      </div>
    </div>
  </div>
</div>

<footer>
  <div class="f-grid">
    <div>
      <h3 class="brand">AURA</h3>
      <p>Artistry driven by nature. Elevating your daily ritual with conscious, high-performance formulations.</p>
      <div class="newsletter">
        <input type="email" placeholder="Join our newsletter">
        <button type="submit">Subscribe</button>
      </div>
    </div>
    <div class="f-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">Complexion</a></li>
        <li><a data-href="#">Skincare</a></li>
        <li><a data-href="#">Lips</a></li>
        <li><a data-href="#">Tools</a></li>
        <li><a data-href="#">Sets</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>About</h4>
      <ul>
        <li><a data-href="#">Our Story</a></li>
        <li><a data-href="#">Ingredients</a></li>
        <li><a data-href="#">Sustainability</a></li>
        <li><a data-href="#">Store Locator</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h4>Support</h4>
      <ul>
        <li><a data-href="#">FAQ</a></li>
        <li><a data-href="#">Shipping</a></li>
        <li><a data-href="#">Returns</a></li>
        <li><a data-href="#">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="f-bottom">
    <div>&copy; 2025 AURA Beauty. All Rights Reserved.</div>
    <div style="display:flex;gap:32px;">
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Privacy Policy</a>
      <a data-href="#" style="color:var(--text-muted);text-decoration:none">Terms of Service</a>
    </div>
  </div>
</footer>

<div class="sticky-atc" id="sticky-atc">
  <div class="s-prod">
    <div class="s-prod-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="7" y="3" width="10" height="18" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line></svg></div>
    <div class="s-prod-info">
      <h4>Silk Veil Foundation</h4>
      <p>\$54.00 &middot; Shade 01 (Fair Neutral)</p>
    </div>
  </div>
  <a data-href="#" class="btn-primary" style="padding:12px 32px; font-size:12px;">Add to Bag</a>
</div>

<script>
  window.addEventListener('scroll', () => {
    const stickyAtc = document.getElementById('sticky-atc');
    if (window.scrollY > 800) {
      stickyAtc.classList.add('visible');
    } else {
      stickyAtc.classList.remove('visible');
    }
  });
</script>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "jewellery-heritage": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meenakshi Jewels | Bridal & Heritage Collection</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Cinzel:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">
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
body { background: var(--cream); color: var(--text); font-fxmily: 'Raleway', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-fxmily: 'Cinzel', serif; font-weight: 600; letter-spacing: 0.5px; }

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
.brand { font-fxmily: 'Cinzel', serif; font-size: 28px; font-weight: 700; color: var(--crimson); text-decoration: none; text-align: center; letter-spacing: 3px; line-height: 1; }
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
.btn-primary { background: var(--crimson); color: #fff; padding: 18px 32px; font-fxmily: 'Raleway', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; border: 1px solid var(--crimson); text-decoration: none; text-align: center; transition: all 0.3s; }
.btn-primary:hover { background: var(--deep-red); }
.btn-secondary { background: transparent; color: var(--crimson); padding: 17px 32px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; border: 1px solid var(--rose-gold); text-decoration: none; text-align: center; transition: all 0.3s; font-fxmily: 'Raleway', sans-serif; }
.btn-secondary:hover { background: var(--rose-gold); color: #fff; }

/* HERO BADGES */
.hero-badges { display: flex; gap: 24px; margin-top: 40px; padding-top: 32px; border-top: 1px dashed var(--border); }
.h-badge-item { text-align: center; }
.h-badge-item strong { display: block; font-fxmily: 'Cinzel', serif; font-size: 22px; color: var(--crimson); }
.h-badge-item span { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }

/* ── OCCASION STRIP ── */
.occasion-strip { padding: 60px 0; background: var(--deep-red); overflow: hidden; }
.occasion-strip .container { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.occ-btn { background: transparent; border: 1px solid rgba(200, 155, 114, 0.4); color: var(--rose-gold); padding: 12px 28px; font-fxmily: 'Raleway', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; text-decoration: none; }
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
.pc-name { font-fxmily: 'Cinzel', serif; font-size: 16px; margin-bottom: 12px; color: var(--text); line-height: 1.4; }
.pc-material { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; font-style: italic; }
.pc-footer { display: flex; justify-content: space-between; align-items: center; }
.pc-price { font-fxmily: 'Cinzel', serif; font-size: 18px; color: var(--crimson); }
.pc-price small { font-size: 12px; color: var(--text-muted); text-decoration: line-through; font-fxmily: 'Raleway', sans-serif; margin-left: 8px; font-weight: 400; }
.pc-wish { width: 36px; height: 36px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-muted); }
.pc-wish:hover { border-color: var(--crimson); color: var(--crimson); }
.pc-atc { display: block; width: 100%; padding: 14px; text-align: center; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; background: var(--ivory); border: none; border-top: 1px solid var(--border); font-fxmily: 'Raleway', sans-serif; cursor: pointer; color: var(--text); transition: all 0.3s; }
.pc-atc:hover { background: var(--crimson); color: #fff; }

/* ── THE CRAFT SECTION ── */
.craft { padding: 120px 0; background: var(--ivory); }
.craft-inner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; align-items: center; }
.craft-text { grid-column: 1 / 2; }
.craft-text .sec-label { font-size: 10px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--rose-gold); margin-bottom: 24px; display: block; }
.craft-text h2 { font-size: 38px; color: var(--crimson); line-height: 1.2; margin-bottom: 24px; }
.craft-text p { font-size: 15px; color: var(--text-muted); line-height: 1.9; margin-bottom: 32px; }
.craft-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 40px; padding-top: 40px; border-top: 1px solid var(--border); }
.craft-stat strong { display: block; font-fxmily: 'Cinzel', serif; font-size: 32px; color: var(--crimson); }
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
.b-card h3 { font-fxmily: 'Cinzel', serif; font-size: 18px; color: #fff; margin-bottom: 8px; }
.b-card p { font-size: 13px; color: rgba(200, 155, 114, 0.7); }
.b-card-center h3 { font-size: 24px; }
.b-price { font-fxmily: 'Cinzel', serif; font-size: 20px; color: var(--rose-gold); margin-top: 16px; }
.b-cta { display: inline-block; margin-top: 50px; background: var(--rose-gold); color: var(--deep-red); padding: 18px 60px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; font-fxmily: 'Raleway', sans-serif; transition: all 0.3s; }
.b-cta:hover { background: #fff; }

/* ── TESTIMONIALS ── */
.testimonials { padding: 100px 0; }
.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
.t-card { padding: 40px; border: 1px solid var(--border); position: relative; }
.t-card::before { content: '"'; position: absolute; top: 20px; left: 28px; font-fxmily: 'Cinzel', serif; font-size: 80px; color: var(--rose-gold); opacity: 0.15; line-height: 1; }
.t-stars { display: flex; gap: 4px; margin-bottom: 20px; }
.t-stars svg { width: 14px; fill: var(--rose-gold); }
.t-text { font-size: 14px; color: var(--text-muted); line-height: 1.9; font-style: italic; margin-bottom: 24px; }
.t-author { display: flex; align-items: center; gap: 14px; padding-top: 20px; border-top: 1px solid var(--border); }
.t-av { width: 44px; height: 44px; border-radius: 50%; background: var(--ivory); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-fxmily: 'Cinzel', serif; font-size: 16px; color: var(--crimson); }
.t-name { font-fxmily: 'Cinzel', serif; font-size: 14px; color: var(--text); }
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

.f-col h4 { font-fxmily: 'Cinzel', serif; font-size: 12px; font-weight: 600; letter-spacing: 3px; color: var(--rose-gold); margin-bottom: 24px; text-transform: uppercase; }
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
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="top-band">✦ Make charges waived on bridal sets this season ✦ BIS Hallmarked ✦ Free insured shipping across India ✦</div>

<header>
  <div class="header-top">
    <div class="header-left">
      <a data-href="#" class="h-badge">Book Visit</a>
      <a data-href="#" class="h-badge">Bridal Lookbook</a>
    </div>
    <a data-href="#" class="brand">
      MEENAKSHI
      <small>Heritage Jewellers Est. 1966</small>
    </a>
    <div class="header-right">
      <a data-href="#" class="icon-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Search
      </a>
      <a data-href="#" class="icon-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Wishlist
      </a>
      <a data-href="#" class="icon-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        Bag (0)
      </a>
    </div>
  </div>
  <nav class="header-nav">
    <a data-href="#">New Arrivals</a>
    <a data-href="#">Necklaces</a>
    <a data-href="#">Rings</a>
    <a data-href="#">Earrings</a>
    <a data-href="#">Bangles & Kadas</a>
    <a data-href="#">Bridal Sets</a>
    <a data-href="#">Men's</a>
    <a data-href="#">Our Story</a>
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
      <a data-href="#" class="btn-primary">Explore Bridal</a>
      <a data-href="#" class="btn-secondary">Book a Consultation</a>
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
      <a data-href="#" class="occ-btn active">Bridal</a>
      <a data-href="#" class="occ-btn">Engagement</a>
      <a data-href="#" class="occ-btn">Anniversary</a>
      <a data-href="#" class="occ-btn">Festive</a>
      <a data-href="#" class="occ-btn">Office Wear</a>
      <a data-href="#" class="occ-btn">Gifts</a>
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
      <a data-href="#">View All Designs →</a>
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
        <a data-href="#" class="btn-primary" style="max-width:200px;display:block;">Our Story →</a>
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
    <a data-href="#" class="b-cta">Explore The Bridal Suite</a>
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
          <a data-href="#" class="f-social"><svg viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
          <a data-href="#" class="f-social"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a data-href="#" class="f-social"><svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.85a8.24 8.24 0 004.82 1.55V6.93a4.85 4.85 0 01-1.05-.24z"/></svg></a>
        </div>
      </div>
      <div class="f-col">
        <h4>Collections</h4>
        <ul>
          <li><a data-href="#">Bridal Sets</a></li>
          <li><a data-href="#">Gold Necklaces</a></li>
          <li><a data-href="#">Diamond Rings</a></li>
          <li><a data-href="#">Earrings</a></li>
          <li><a data-href="#">Bangles & Kadas</a></li>
          <li><a data-href="#">Men's Jewellery</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h4>The House</h4>
        <ul>
          <li><a data-href="#">Our Story</a></li>
          <li><a data-href="#">Artisans</a></li>
          <li><a data-href="#">Craftsmanship</a></li>
          <li><a data-href="#">Certifications</a></li>
          <li><a data-href="#">Store Locator</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h4>Help & Support</h4>
        <ul>
          <li><a data-href="#">Book Consultation</a></li>
          <li><a data-href="#">Track Order</a></li>
          <li><a data-href="#">Shipping Policy</a></li>
          <li><a data-href="#">Returns & Exchange</a></li>
          <li><a data-href="#">Care Guide</a></li>
          <li><a data-href="#">EMI Options</a></li>
        </ul>
      </div>
    </div>
    <div class="f-bottom">
      <span>© 2025 Meenakshi Heritage Jewellers. All rights reserved.</span>
      <div class="f-bottom-links">
        <a data-href="#">Privacy Policy</a>
        <a data-href="#">Terms of Use</a>
        <a data-href="#">Hallmark Policy</a>
      </div>
    </div>
  </div>
</footer>

<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "fashion-clothing": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VŌLT | Premium Fashion</title>
<link href="https://fxts.google.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
:root{--ink:#0A0A0A;--paper:#F5F3EF;--accent:#E8D5B0;--mid:#888;--border:#E0DDD8;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--paper);color:var(--ink);font-fxmily:'DM Sans',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3,.bebas{font-fxmily:'Bebas Neue',sans-serif;font-weight:400;letter-spacing:2px;}

/* PROMO */
.promo{background:var(--ink);color:#fff;text-align:center;padding:11px;font-size:12px;letter-spacing:3px;text-transform:uppercase;}
.promo a{color:var(--accent);text-decoration:none;}

/* HEADER */
header{background:var(--paper);padding:20px 60px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
.brand{font-fxmily:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:6px;color:var(--ink);text-decoration:none;}
nav{display:flex;gap:36px;list-style:none;}
nav a{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--mid);}
.h-actions{display:flex;align-items:center;gap:20px;}
.h-btn{background:var(--ink);color:#fff;padding:10px 24px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;text-decoration:none;transition:opacity .2s;}
.h-btn:hover{opacity:.8;}

/* HERO — full viewport editorial */
.hero{display:grid;grid-template-columns:1.1fr .9fr;height:92vh;border-bottom:1px solid var(--border);}
.hero-visual{background:#1A1A1A;display:flex;align-items:flex-end;padding:60px;position:relative;overflow:hidden;}
.hero-visual::before{content:'COLLECTION';position:absolute;top:50%;left:-80px;transform:translateY(-50%) rotate(-90deg);font-fxmily:'Bebas Neue',sans-serif;font-size:200px;color:rgba(255,255,255,.04);letter-spacing:10px;white-space:nowrap;}
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
.cat-label{font-fxmily:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;display:block;margin-bottom:4px;transition:color .2s;}
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
.ed-item h3{font-fxmily:'Bebas Neue',sans-serif;font-size:32px;color:#fff;letter-spacing:2px;margin-bottom:8px;}
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
.f-brand a{font-fxmily:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:6px;color:#fff;text-decoration:none;display:block;margin-bottom:20px;}
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
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="promo">New Season Drop — Extra 15% off with code VOLT15 &nbsp;<a data-href="#">Shop Now →</a></div>
<header>
  <a data-href="#" class="brand">VŌLT</a>
  <nav>
    <li><a data-href="#">New In</a></li>
    <li><a data-href="#">Women</a></li>
    <li><a data-href="#">Men</a></li>
    <li><a data-href="#">Denim</a></li>
    <li><a data-href="#">Sale</a></li>
  </nav>
  <div class="h-actions">
    <a data-href="#" class="h-btn">Bag (0)</a>
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
      <a data-href="#" class="btn-dark">Shop Women</a>
      <a data-href="#" class="btn-outline">Shop Men</a>
    </div>
    <div class="hero-scroll">Scroll</div>
  </div>
</section>

<div class="cats">
  <a data-href="#" class="cat"><span class="cat-label">Outerwear</span><span class="cat-count">48 Styles</span></a>
  <a data-href="#" class="cat"><span class="cat-label">Denim</span><span class="cat-count">36 Styles</span></a>
  <a data-href="#" class="cat"><span class="cat-label">Knitwear</span><span class="cat-count">52 Styles</span></a>
  <a data-href="#" class="cat"><span class="cat-label">Accessories</span><span class="cat-count">24 Styles</span></a>
</div>

<section class="shop">
  <div class="sec-head"><h2>NEW IN</h2><a data-href="#" class="view-all">View All →</a></div>
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
      <a data-href="#" class="btn-dark">Shop Denim</a>
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
    <div class="f-brand"><a data-href="#">VŌLT</a><p>Premium fashion engineered for modern life. Thoughtfully designed, responsibly made, built to last.</p></div>
    <div class="f-col"><h4>Shop</h4><ul><li><a data-href="#">Women</a></li><li><a data-href="#">Men</a></li><li><a data-href="#">Accessories</a></li><li><a data-href="#">Sale</a></li></ul></div>
    <div class="f-col"><h4>Company</h4><ul><li><a data-href="#">About</a></li><li><a data-href="#">Sustainability</a></li><li><a data-href="#">Careers</a></li><li><a data-href="#">Press</a></li></ul></div>
    <div class="f-col"><h4>Support</h4><ul><li><a data-href="#">Size Guide</a></li><li><a data-href="#">Returns</a></li><li><a data-href="#">Shipping</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="f-bottom"><span>© 2025 VŌLT Fashion. All rights reserved.</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "footwear": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SOLERA | Premium Footwear</title>
<link href="https://fxts.google.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--rust:#C65D2A;--sand:#F0E6D3;--dark:#1C1510;--text:#2A2018;--muted:#8A7A6A;--border:#E0D4C0;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#fff;color:var(--text);font-fxmily:'Inter',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-fxmily:'Syne',sans-serif;}

/* HEADER */
.top-bar{background:var(--rust);color:#fff;text-align:center;padding:10px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;}
header{padding:24px 60px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
.brand{font-fxmily:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--dark);text-decoration:none;letter-spacing:4px;}
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
.btn-rust{background:var(--rust);color:#fff;padding:18px 44px;font-fxmily:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:opacity .2s;display:inline-block;}
.btn-rust:hover{opacity:.9;}
.btn-ghost{background:transparent;color:var(--dark);border:1.5px solid var(--dark);padding:17px 44px;font-fxmily:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:all .2s;display:inline-block;}
.btn-ghost:hover{background:var(--dark);color:#fff;}
.hero-r{background:var(--dark);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.hero-r::after{content:'';position:absolute;width:400px;height:400px;border-radius:50%;border:1px solid rgba(255,255,255,.05);top:50%;left:50%;transform:translate(-50%,-50%);}
.hero-shoe-icon{width:60%;color:rgba(198,93,42,.3);}

/* FILTER TABS */
.tabs{display:flex;gap:4px;padding:24px 60px;border-bottom:1px solid var(--border);background:#fafaf8;}
.tab{padding:10px 24px;font-fxmily:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--border);background:transparent;cursor:pointer;transition:all .2s;color:var(--muted);}
.tab.active,.tab:hover{background:var(--dark);color:#fff;border-color:var(--dark);}

/* PRODUCTS — unique card with size selector built-in */
.shop{padding:80px 60px;max-width:1400px;margin:0 auto;}
.shop-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:50px;}
.shop-head h2{font-size:48px;font-weight:800;color:var(--dark);}
.sort-select{font-fxmily:'Inter',sans-serif;font-size:13px;border:1px solid var(--border);padding:10px 20px;background:transparent;color:var(--text);outline:none;cursor:pointer;}

.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;}
.card{position:relative;border:1px solid var(--border);transition:all .35s;overflow:hidden;}
.card:hover{box-shadow:0 16px 40px rgba(198,93,42,.08);transform:translateY(-4px);}
.card-img{aspect-ratio:1;background:var(--sand);display:flex;align-items:center;justify-content:center;position:relative;}
.card-img svg{width:40%;color:var(--muted);opacity:.5;transition:transform .4s;}
.card:hover .card-img svg{transform:scale(1.06);color:var(--rust);opacity:.8;}
.c-badge{position:absolute;top:18px;left:18px;background:var(--rust);color:#fff;padding:5px 14px;font-fxmily:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;}
.card-body{padding:24px;}
.c-cat{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:8px;}
.c-name{font-fxmily:'Syne',sans-serif;font-size:20px;font-weight:700;margin-bottom:6px;color:var(--dark);}
.c-desc{font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.6;}
.c-sizes{display:flex;gap:6px;margin-bottom:18px;}
.cs{width:32px;height:32px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;}
.cs:hover{border-color:var(--rust);color:var(--rust);}
.card-foot{display:flex;justify-content:space-between;align-items:center;}
.c-price{font-fxmily:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--dark);}
.c-old{font-size:14px;color:var(--muted);text-decoration:line-through;margin-left:8px;font-weight:400;}
.c-atc{background:var(--dark);color:#fff;border:none;padding:12px 24px;font-fxmily:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:background .2s;}
.c-atc:hover{background:var(--rust);}

/* SUSTAINABILITY */
.sustain{background:var(--dark);padding:100px 60px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;}
.s-text .overline{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--rust);margin-bottom:20px;display:block;}
.s-text h2{font-size:52px;font-weight:800;color:#fff;margin-bottom:24px;line-height:1.1;}
.s-text p{font-size:16px;color:rgba(255,255,255,.5);line-height:1.9;margin-bottom:36px;}
.s-pillars{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.s-pillar{border:1px solid rgba(255,255,255,.1);padding:24px;}
.s-pillar h4{font-fxmily:'Syne',sans-serif;font-size:16px;color:#fff;margin-bottom:8px;}
.s-pillar p{font-size:13px;color:rgba(255,255,255,.4);}

/* FOOTER */
footer{background:var(--sand);padding:80px 60px 40px;}
.f-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid var(--border);}
.f-brand-name{font-fxmily:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--dark);letter-spacing:4px;margin-bottom:16px;}
.f-brand p{font-size:14px;color:var(--muted);line-height:1.8;max-width:260px;}
.f-col h4{font-fxmily:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.f-col ul{list-style:none;}
.f-col li{margin-bottom:10px;}
.f-col a{color:var(--text);text-decoration:none;font-size:14px;transition:color .2s;}
.f-col a:hover{color:var(--rust);}
.f-bottom{display:flex;justify-content:space-between;padding-top:30px;font-size:12px;color:var(--muted);}

@media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto}.hero-r{display:none}.grid{grid-template-columns:repeat(2,1fr)}.sustain{grid-template-columns:1fr}.s-pillars{grid-template-columns:1fr}.f-grid{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}.nav-links{display:none}.hero-l{padding:60px 20px}.hero-l h1{font-size:52px}.shop{padding:60px 20px}.grid{grid-template-columns:1fr}.tabs{padding:16px 20px;overflow-x:auto;flex-wrap:nowrap}.f-grid{grid-template-columns:1fr;gap:40px}}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="top-bar">Free shipping on orders above ₹2,999 | Easy 30-day returns</div>
<header>
  <a data-href="#" class="brand">SOLERA</a>
  <ul class="nav-links">
    <li><a data-href="#">New Drops</a></li>
    <li><a data-href="#">Sneakers</a></li>
    <li><a data-href="#">Formal</a></li>
    <li><a data-href="#">Sandals</a></li>
    <li><a data-href="#">Boots</a></li>
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
      <a data-href="#" class="btn-rust">Shop Collection</a>
      <a data-href="#" class="btn-ghost">Find Your Size</a>
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
    <label style="display:none">Form field</label><select class="sort-select"><option>Sort: Featured</option><option>Price: Low-High</option><option>Newest</option></select>
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
    <a data-href="#" class="btn-rust">Our Story</a>
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
    <div class="f-col"><h4>Shop</h4><ul><li><a data-href="#">Sneakers</a></li><li><a data-href="#">Formal</a></li><li><a data-href="#">Boots</a></li><li><a data-href="#">Sandals</a></li></ul></div>
    <div class="f-col"><h4>About</h4><ul><li><a data-href="#">Our Story</a></li><li><a data-href="#">Sustainability</a></li><li><a data-href="#">Artisans</a></li></ul></div>
    <div class="f-col"><h4>Help</h4><ul><li><a data-href="#">Size Chart</a></li><li><a data-href="#">Care Guide</a></li><li><a data-href="#">Returns</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="f-bottom"><span>© 2025 Solera Footwear</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "ayurveda-wellness": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AYURVA | Wellness & Ayurveda</title>
<link href="https://fxts.google.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--saffron:#E07B2A;--forest:#2E4B35;--cream:#FBF6EF;--gold:#C9A84C;--text:#2A2018;--muted:#7A6A58;--border:#E8DDD0;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--cream);color:var(--text);font-fxmily:'Hind',sans-serif;font-size:16px;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-fxmily:'Yatra One',cursive;font-weight:400;}

/* HEADER */
.announce{background:var(--forest);color:#fff;text-align:center;padding:10px;font-size:12px;letter-spacing:2px;}
header{background:var(--cream);padding:20px 60px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--border);}
.brand{font-fxmily:'Yatra One',cursive;font-size:32px;color:var(--forest);text-decoration:none;display:flex;align-items:center;gap:10px;}
.brand-sub{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);font-fxmily:'Hind',sans-serif;font-weight:500;}
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
.btn-forest{background:var(--forest);color:#fff;padding:16px 40px;font-fxmily:'Hind',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;text-decoration:none;transition:background .2s;display:inline-block;}
.btn-forest:hover{background:var(--saffron);}
.btn-gold{background:transparent;border:1.5px solid var(--gold);color:var(--gold);padding:15px 40px;font-fxmily:'Hind',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;text-decoration:none;transition:all .2s;display:inline-block;}
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
.b-title{font-fxmily:'Yatra One',cursive;font-size:18px;color:var(--forest);margin-bottom:8px;}
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
.pc-name{font-fxmily:'Yatra One',cursive;font-size:20px;color:var(--forest);margin-bottom:8px;line-height:1.2;}
.pc-ing{font-size:12px;color:var(--muted);font-style:italic;margin-bottom:16px;}
.pc-qty{font-size:11px;color:var(--muted);margin-bottom:14px;}
.pc-foot{display:flex;justify-content:space-between;align-items:center;}
.pc-price-wrap strong{font-size:20px;font-weight:700;color:var(--forest);}
.pc-price-wrap small{font-size:12px;color:var(--muted);text-decoration:line-through;margin-left:6px;}
.btn-add-forest{background:var(--forest);color:#fff;border:none;padding:10px 20px;font-fxmily:'Hind',sans-serif;font-size:12px;font-weight:600;letter-spacing:.5px;cursor:pointer;transition:background .2s;}
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
.ing-name{font-fxmily:'Yatra One',cursive;font-size:16px;color:#fff;}
.ing-bene{font-size:11px;color:rgba(255,255,255,.4);text-align:center;max-width:80px;line-height:1.5;}

/* FOOTER */
footer{background:#1E2E21;padding:80px 60px 40px;}
.f-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.1);}
.fb-brand{font-fxmily:'Yatra One',cursive;font-size:28px;color:var(--gold);margin-bottom:16px;}
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
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="announce">Ancient Wisdom. Modern Science. Free consultation with every order above ₹999.</div>
<header>
  <a data-href="#" class="brand">
    AYURVA
    <span class="brand-sub">Pure Ayurveda</span>
  </a>
  <nav><ul>
    <li><a data-href="#">Skincare</a></li>
    <li><a data-href="#">Hair Care</a></li>
    <li><a data-href="#">Wellness</a></li>
    <li><a data-href="#">Nutrition</a></li>
    <li><a data-href="#">Consult</a></li>
  </ul></nav>
  <a data-href="#" class="hdr-cta">Shop Now</a>
</header>

<section class="hero">
  <div class="hero-text">
    <span class="label">5000 Years of Healing Wisdom</span>
    <h1>Heal from the Root</h1>
    <p>Formulated with authentic Ayurvedic herbs, cold-pressed oils, and sustainably sourced botanicals. Every product is Ayush-certified and DCCL-approved.</p>
    <div class="hero-btns">
      <a data-href="#" class="btn-forest">Explore Products</a>
      <a data-href="#" class="btn-gold">Free Quiz: Find Your Dosha</a>
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
    <div class="f-col"><h4>Products</h4><ul><li><a data-href="#">Skincare</a></li><li><a data-href="#">Hair Care</a></li><li><a data-href="#">Wellness</a></li><li><a data-href="#">Nutrition</a></li></ul></div>
    <div class="f-col"><h4>Know More</h4><ul><li><a data-href="#">Dosha Quiz</a></li><li><a data-href="#">Ingredient Glossary</a></li><li><a data-href="#">Blog</a></li><li><a data-href="#">Consult Vaidya</a></li></ul></div>
    <div class="f-col"><h4>Support</h4><ul><li><a data-href="#">FAQ</a></li><li><a data-href="#">Shipping</a></li><li><a data-href="#">Returns</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="f-bottom"><span>© 2025 Ayurva Wellness Pvt. Ltd. | FSSAI Lic.</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "mobile-accessories": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>STACKD | Phone Cases & Accessories</title>
<link href="https://fxts.google.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--neon:#00F0C8;--dark:#0D0D12;--mid:#1A1A22;--text:#E8E8F0;--muted:#666670;--border:rgba(255,255,255,.08);}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--dark);color:var(--text);font-fxmily:'Space Grotesk',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
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
.ds-btn{padding:8px 20px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;font-fxmily:'Space Grotesk',sans-serif;}
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
.c-atc{background:var(--neon);color:#000;border:none;padding:10px 16px;font-fxmily:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:opacity .2s;}
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
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="top">🔥 SALE — Up to 40% off MagSafe Collection. Ends Sunday.</div>
<header>
  <div class="brand">STACK<span>D</span></div>
  <nav><ul>
    <li><a data-href="#">iPhone Cases</a></li>
    <li><a data-href="#">Android Cases</a></li>
    <li><a data-href="#">MagSafe</a></li>
    <li><a data-href="#">Chargers</a></li>
    <li><a data-href="#">Bundles</a></li>
  </ul></nav>
  <div class="h-right">
    <a data-href="#" class="h-badge">Shop Now</a>
    <div class="h-cart"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></div>
  </div>
</header>

<section class="hero">
  <div class="hero-text">
    <span class="tag">Drop 07 - 2025</span>
    <h1>STACK<br><span>YOUR</span><br>STYLE.</h1>
    <p>MagSafe-compatible cases crafted from aircraft-grade materials. Drop protection that doesn't compromise millimeter precision.</p>
    <div class="hero-ctas">
      <a data-href="#" class="btn-neon">Shop iPhone 16</a>
      <a data-href="#" class="btn-ghost">View All Devices</a>
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
  <div class="ph"><h2>Top Picks</h2><a data-href="#">View all →</a></div>
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
    <div class="fc"><h4>Shop</h4><ul><li><a data-href="#">iPhone Cases</a></li><li><a data-href="#">Android Cases</a></li><li><a data-href="#">Chargers</a></li><li><a data-href="#">Bundles</a></li></ul></div>
    <div class="fc"><h4>Info</h4><ul><li><a data-href="#">About</a></li><li><a data-href="#">Blog</a></li><li><a data-href="#">Affiliate</a></li></ul></div>
    <div class="fc"><h4>Help</h4><ul><li><a data-href="#">FAQ</a></li><li><a data-href="#">Returns</a></li><li><a data-href="#">Shipping</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 STACKD Technologies</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "kids-toys": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PLAYBOX | Kids Toys & Educational Games</title>
<link href="https://fxts.google.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--yellow:#F9C22E;--blue:#2D6BE4;--red:#E83A3A;--teal:#1ABFA1;--bg:#FFFEF8;--surface:#fff;--text:#1A1A2E;--muted:#6B6B80;--border:#EAE8F0;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-fxmily:'Nunito',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3,.baloo{font-fxmily:'Baloo 2',cursive;}

/* WAVY TOP */
.top-wave{background:var(--yellow);color:#000;text-align:center;padding:10px;font-size:13px;font-weight:700;letter-spacing:.5px;}

/* HEADER */
header{padding:16px 60px;background:#fff;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid var(--yellow);position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,.04);}
.brand{font-fxmily:'Baloo 2',cursive;font-size:30px;font-weight:800;color:var(--blue);text-decoration:none;display:flex;align-items:center;gap:4px;}
.brand .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--yellow);margin-bottom:8px;}
nav ul{display:flex;gap:28px;list-style:none;}
nav a{font-size:14px;font-weight:700;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--blue);}
.hdr-right{display:flex;gap:12px;align-items:center;}
.hdr-btn{background:var(--blue);color:#fff;padding:12px 24px;border-radius:100px;font-fxmily:'Baloo 2',cursive;font-size:14px;font-weight:700;text-decoration:none;transition:opacity .2s;}
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
.btn-blue{background:var(--blue);color:#fff;padding:16px 40px;border-radius:100px;font-fxmily:'Baloo 2',cursive;font-size:16px;font-weight:700;text-decoration:none;display:inline-block;transition:all .2s;box-shadow:0 6px 20px rgba(45,107,228,.3);}
.btn-blue:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(45,107,228,.35);}
.btn-outline-b{background:transparent;color:var(--blue);border:2px solid var(--blue);padding:14px 40px;border-radius:100px;font-fxmily:'Baloo 2',cursive;font-size:16px;font-weight:700;text-decoration:none;display:inline-block;transition:all .2s;}
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
.cat-name{font-fxmily:'Baloo 2',cursive;font-size:16px;font-weight:700;margin-bottom:4px;}
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
.pc-name{font-fxmily:'Baloo 2',cursive;font-size:17px;font-weight:700;margin-bottom:8px;line-height:1.3;}
.pc-skills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.skill{font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;}
.sk-green{background:#E8FAF7;color:#1ABFA1;}
.sk-blue{background:#E8F0FF;color:#2D6BE4;}
.pc-foot{display:flex;justify-content:space-between;align-items:center;}
.pc-price{font-size:20px;font-weight:800;color:var(--text);}
.pc-old{font-size:13px;color:var(--muted);text-decoration:line-through;margin-left:6px;}
.btn-add{background:var(--blue);color:#fff;border:none;padding:10px 18px;border-radius:100px;font-fxmily:'Nunito',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;}
.btn-add:hover{background:#1d54c4;}

/* SAFETY BANNER */
.safety{background:var(--blue);padding:70px 60px;display:flex;align-items:center;justify-content:center;gap:80px;flex-wrap:wrap;}
.safety-item{display:flex;flex-direction:column;align-items:center;gap:12px;color:#fff;}
.s-icon{width:60px;height:60px;border-radius:50%;border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;}
.s-icon svg{width:28px;color:#fff;stroke-width:1.5;}
.safety-item strong{font-fxmily:'Baloo 2',cursive;font-size:16px;}
.safety-item span{font-size:12px;color:rgba(255,255,255,.6);text-align:center;max-width:120px;}

/* FOOTER */
footer{background:var(--text);padding:80px 60px 40px;}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.08);}
.fb a{font-fxmily:'Baloo 2',cursive;font-size:26px;font-weight:800;color:var(--yellow);text-decoration:none;display:block;margin-bottom:16px;}
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
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="top-wave">🎁 Free gift-wrapping on all orders! Use code GIFTED at checkout.</div>
<header>
  <a data-href="#" class="brand">PLAY<div class="dot"></div>BOX</a>
  <nav><ul>
    <li><a data-href="#">Toys</a></li>
    <li><a data-href="#">Learning</a></li>
    <li><a data-href="#">Outdoor</a></li>
    <li><a data-href="#">Arts & Crafts</a></li>
    <li><a data-href="#">Gift Sets</a></li>
  </ul></nav>
  <div class="hdr-right">
    <a data-href="#" class="hdr-btn">🛒 Cart (0)</a>
  </div>
</header>

<section class="hero">
  <div class="hero-text">
    <div class="badge">⭐ 4.9 — Trusted by 1L+ Families</div>
    <h1>Play. <span>Learn.</span><br>Grow Together.</h1>
    <p>Award-winning educational toys and games that spark curiosity, develop skills, and create lifelong memories. BIS-certified and BPA-free.</p>
    <div class="hero-btns">
      <a data-href="#" class="btn-blue">Shop by Age</a>
      <a data-href="#" class="btn-outline-b">Gift Guide →</a>
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
    <a data-href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#E07B2A" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div><div class="cat-name">Building & STEM</div><div class="cat-count">120+ toys</div></a>
    <a data-href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#2D6BE4" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 015 0 2.5 2.5 0 015 0"/></svg></div><div class="cat-name">Board Games</div><div class="cat-count">80+ games</div></a>
    <a data-href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#1ABFA1" viewBox="0 0 24 24"><path d="M2 12h20M12 2a10 10 0 0010 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z"/></svg></div><div class="cat-name">Outdoor Play</div><div class="cat-count">60+ items</div></a>
    <a data-href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#E83A3A" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div class="cat-name">Arts & Crafts</div><div class="cat-count">95+ kits</div></a>
    <a data-href="#" class="cat-card"><div class="cat-icon"><svg fill="none" stroke="#9B59B6" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div><div class="cat-name">Gift Sets</div><div class="cat-count">45+ sets</div></a>
  </div>
</section>

<section class="products">
  <div class="ph"><h2>🔥 Trending Picks</h2><a data-href="#">See all →</a></div>
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
    <div class="fb"><a data-href="#">PLAYBOX 🎲</a><p>Making childhood magical through play that educates, inspires, and connects families.</p></div>
    <div class="fc"><h4>Shop</h4><ul><li><a data-href="#">0-2 Years</a></li><li><a data-href="#">3-6 Years</a></li><li><a data-href="#">7-12 Years</a></li><li><a data-href="#">Gift Sets</a></li></ul></div>
    <div class="fc"><h4>Learn</h4><ul><li><a data-href="#">Blog</a></li><li><a data-href="#">Age Guide</a></li><li><a data-href="#">Reviews</a></li></ul></div>
    <div class="fc"><h4>Support</h4><ul><li><a data-href="#">FAQ</a></li><li><a data-href="#">Returns</a></li><li><a data-href="#">Shipping</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 Playbox. All rights reserved.</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "home-furniture": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HAVEN | Premium Home Furniture</title>
<link href="https://fxts.google.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--oak:#B5834A;--smoke:#F0EDE8;--dark:#1E1A16;--text:#2D2720;--muted:#7D7068;--border:#E0D8CC;--light:#FAF8F5;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--light);color:var(--text);font-fxmily:'Manrope',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-fxmily:'Libre Baskerville',serif;}

/* HEADER */
.top{background:var(--dark);color:rgba(255,255,255,.6);text-align:center;padding:10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;}
header{padding:24px 60px;background:var(--light);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
.brand{font-fxmily:'Libre Baskerville',serif;font-size:26px;color:var(--dark);text-decoration:none;letter-spacing:1px;display:flex;flex-direction:column;}
.brand-tagline{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--oak);font-fxmily:'Manrope',sans-serif;font-weight:600;}
nav ul{display:flex;gap:32px;list-style:none;}
nav a{font-size:13px;font-weight:500;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--oak);}
.h-right{display:flex;gap:16px;align-items:center;}
.h-link{font-size:12px;font-weight:600;letter-spacing:1px;color:var(--muted);text-decoration:none;transition:color .2s;}
.h-link:hover{color:var(--text);}
.h-cta{background:var(--dark);color:#fff;padding:12px 28px;font-fxmily:'Manrope',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:background .2s;}
.h-cta:hover{background:var(--oak);}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:90vh;border-bottom:1px solid var(--border);}
.hero-left{padding:100px 80px;display:flex;flex-direction:column;justify-content:center;background:var(--light);}
.hero-left .overline{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--oak);margin-bottom:24px;}
.hero-left h1{font-size:68px;line-height:1.05;margin-bottom:28px;color:var(--dark);}
.hero-left h1 em{font-style:italic;color:var(--oak);}
.hero-left p{font-size:17px;color:var(--muted);line-height:1.9;max-width:420px;margin-bottom:44px;font-weight:400;}
.hero-actions{display:flex;flex-direction:column;gap:16px;max-width:260px;}
.btn-dark{background:var(--dark);color:#fff;padding:18px 40px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;text-align:center;transition:background .2s;font-fxmily:'Manrope',sans-serif;}
.btn-dark:hover{background:var(--oak);}
.btn-oak{background:transparent;color:var(--oak);border:1.5px solid var(--oak);padding:16px 40px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;text-align:center;transition:all .2s;font-fxmily:'Manrope',sans-serif;}
.btn-oak:hover{background:var(--oak);color:#fff;}
.hero-stats{display:flex;gap:40px;margin-top:60px;padding-top:40px;border-top:1px solid var(--border);}
.hs strong{display:block;font-fxmily:'Libre Baskerville',serif;font-size:28px;color:var(--dark);}
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
.rc-label{font-fxmily:'Libre Baskerville',serif;font-size:20px;margin-bottom:4px;}
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
.pc-name{font-fxmily:'Libre Baskerville',serif;font-size:20px;margin-bottom:6px;color:var(--dark);}
.pc-material{font-size:13px;color:var(--muted);font-style:italic;margin-bottom:16px;}
.pc-footer{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--border);}
.pc-price{font-fxmily:'Libre Baskerville',serif;font-size:22px;color:var(--dark);}
.pc-old{font-size:13px;color:var(--muted);text-decoration:line-through;margin-left:8px;font-fxmily:'Manrope',sans-serif;font-weight:400;}
.pc-atc{background:transparent;color:var(--dark);border:1px solid var(--dark);padding:10px 20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-fxmily:'Manrope',sans-serif;transition:all .2s;}
.pc-atc:hover{background:var(--dark);color:#fff;}

/* HOW IT WORKS */
.hiw{background:var(--dark);padding:100px 60px;}
.hiw-inner{max-width:1000px;margin:0 auto;text-align:center;}
.hiw h2{font-size:44px;color:#fff;margin-bottom:16px;}
.hiw p{font-size:16px;color:rgba(255,255,255,.4);margin-bottom:70px;}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:60px;position:relative;}
.steps::before{content:'';position:absolute;top:40px;left:16%;width:68%;height:1px;background:rgba(255,255,255,.08);}
.step{text-align:center;}
.step-num{width:80px;height:80px;border-radius:50%;border:1px solid rgba(181,131,74,.4);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-fxmily:'Libre Baskerville',serif;font-size:28px;color:var(--oak);}
.step h4{font-fxmily:'Libre Baskerville',serif;font-size:18px;color:#fff;margin-bottom:10px;}
.step p{font-size:14px;color:rgba(255,255,255,.4);line-height:1.8;}

/* FOOTER */
footer{padding:80px 60px 40px;background:var(--light);border-top:1px solid var(--border);}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid var(--border);}
.fb .brand{font-size:22px;display:flex;flex-direction:column;margin-bottom:16px;}
.fb p{font-size:13px;color:var(--muted);line-height:1.9;max-width:270px;}
.fc h4{font-fxmily:'Manrope',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.fc ul{list-style:none;}
.fc li{margin-bottom:10px;}
.fc a{color:var(--text);text-decoration:none;font-size:14px;transition:color .2s;}
.fc a:hover{color:var(--oak);}
.fbot{display:flex;justify-content:space-between;padding-top:28px;font-size:11px;color:var(--muted);letter-spacing:1px;}

@media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto}.hero-right{display:none}.room-grid{grid-template-columns:1fr 1fr}.room-card:nth-child(1){grid-column:span 2}.grid{grid-template-columns:repeat(2,1fr)}.fg{grid-template-columns:1fr 1fr}}
@media(max-width:768px){header{padding:16px 20px}nav{display:none}.hero-left{padding:60px 20px}.hero-left h1{font-size:44px}.rooms{padding:60px 20px}.room-grid{grid-template-columns:1fr}.room-card:nth-child(1){grid-column:span 1}.products{padding:0 20px 60px}.grid{grid-template-columns:1fr}.hiw{padding:60px 20px}.steps{grid-template-columns:1fr;gap:40px}.steps::before{display:none}.fg{grid-template-columns:1fr;gap:40px}footer{padding:60px 20px 30px}}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="top">Complimentary white-glove delivery and assembly on all furniture orders.</div>
<header>
  <a data-href="#" class="brand">
    HAVEN
    <span class="brand-tagline">Premium Furniture &amp; Living</span>
  </a>
  <nav><ul>
    <li><a data-href="#">Living Room</a></li>
    <li><a data-href="#">Bedroom</a></li>
    <li><a data-href="#">Dining</a></li>
    <li><a data-href="#">Home Office</a></li>
    <li><a data-href="#">Outdoor</a></li>
  </ul></nav>
  <div class="h-right">
    <a data-href="#" class="h-link">Wishlist</a>
    <a data-href="#" class="h-link">Account</a>
    <a data-href="#" class="h-cta">View Cart</a>
  </div>
</header>

<section class="hero">
  <div class="hero-left">
    <span class="overline">2025 — The Natural Edit</span>
    <h1>Rooms That<br>Feel Like <em>Home</em></h1>
    <p>Solid wood furniture crafted by eighth-generation artisans in Jodhpur. Designed to age gracefully and tell a story with every scratch.</p>
    <div class="hero-actions">
      <a data-href="#" class="btn-dark">Explore Collections</a>
      <a data-href="#" class="btn-oak">Book Free Design Call</a>
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
  <div class="ph"><h2>Featured Pieces</h2><a data-href="#">View All →</a></div>
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
    <div class="fb"><a data-href="#" class="brand">HAVEN<span class="brand-tagline">Premium Furniture &amp; Living</span></a><p>Premium Indian craftsmanship meeting global design standards. Heirloom furniture for the modern family.</p></div>
    <div class="fc"><h4>Collections</h4><ul><li><a data-href="#">Living Room</a></li><li><a data-href="#">Bedroom</a></li><li><a data-href="#">Dining</a></li><li><a data-href="#">Home Office</a></li></ul></div>
    <div class="fc"><h4>Services</h4><ul><li><a data-href="#">Design Consultation</a></li><li><a data-href="#">Customisation</a></li><li><a data-href="#">Assembly</a></li></ul></div>
    <div class="fc"><h4>Support</h4><ul><li><a data-href="#">Care Guide</a></li><li><a data-href="#">Shipping</a></li><li><a data-href="#">Returns</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 Haven Furniture Pvt. Ltd.</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "food-delivery": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VEDA EATS | Cloud Kitchen & Food Delivery</title>
<link href="https://fxts.google.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--orange:#FF5722;--yellow:#FFC107;--dark:#1A0A00;--bg:#FFF7F0;--surface:#fff;--text:#2A1A0E;--muted:#8A7060;--border:#F0E4D8;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-fxmily:'Poppins',sans-serif;font-size:15px;-webkit-font-smoothing:antialiased;}

/* HEADER */
.top{background:var(--orange);color:#fff;text-align:center;padding:9px;font-size:12px;font-weight:600;letter-spacing:.5px;}
header{padding:18px 60px;background:#fff;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 20px rgba(0,0,0,.05);position:sticky;top:0;z-index:100;}
.brand{font-size:24px;font-weight:800;color:var(--dark);text-decoration:none;display:flex;align-items:center;gap:8px;}
.brand-icon{width:36px;height:36px;background:var(--orange);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}
nav ul{display:flex;gap:28px;list-style:none;}
nav a{font-size:14px;font-weight:500;color:var(--text);text-decoration:none;transition:color .2s;}
nav a:hover{color:var(--orange);}
.hdr-btns{display:flex;gap:10px;}
.hdr-login{background:transparent;border:1.5px solid var(--orange);color:var(--orange);padding:10px 20px;border-radius:100px;font-fxmily:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
.hdr-login:hover{background:var(--orange);color:#fff;}
.hdr-order{background:var(--orange);color:#fff;border:none;padding:10px 20px;border-radius:100px;font-fxmily:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s;}
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
.loc-input input{background:transparent;border:none;outline:none;font-fxmily:'Poppins',sans-serif;font-size:15px;color:#fff;flex:1;}
.loc-input input::placeholder{color:rgba(255,255,255,.3);}
.loc-btn{background:var(--orange);color:#fff;border:none;padding:12px 24px;border-radius:12px;font-fxmily:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity .2s;}
.loc-btn:hover{opacity:.88;}
.delivery-info{font-size:13px;color:rgba(255,255,255,.35);font-weight:500;}
.hero-visual{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;}
.food-float{width:100%;max-width:420px;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,87,34,.15),rgba(255,87,34,.03));display:flex;align-items:center;justify-content:center;border:1px dashed rgba(255,87,34,.2);}
.food-float svg{width:50%;color:var(--orange);opacity:.3;}

/* CUISINE TABS */
.cuisine{background:#fff;padding:30px 60px;border-bottom:1px solid var(--border);}
.cuisine-inner{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;}
.c-chip{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:100px;border:1.5px solid var(--border);background:transparent;font-fxmily:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;color:var(--text);}
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
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<div class="top">🛵 30-minute delivery guaranteed or your next order is FREE!</div>
<header>
  <a data-href="#" class="brand"><div class="brand-icon">🍛</div>VEDA EATS</a>
  <nav><ul>
    <li><a data-href="#">Menu</a></li>
    <li><a data-href="#">Cuisines</a></li>
    <li><a data-href="#">Offers</a></li>
    <li><a data-href="#">Track Order</a></li>
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
  <div class="menu-head"><h2>🔥 Popular Right Now</h2><a data-href="#">See full menu →</a></div>
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
    <div class="fc"><h4>Explore</h4><ul><li><a data-href="#">Full Menu</a></li><li><a data-href="#">Cuisines</a></li><li><a data-href="#">Offers</a></li><li><a data-href="#">Combos</a></li></ul></div>
    <div class="fc"><h4>Company</h4><ul><li><a data-href="#">About Us</a></li><li><a data-href="#">List Your Kitchen</a></li><li><a data-href="#">Careers</a></li><li><a data-href="#">Blog</a></li></ul></div>
    <div class="fc"><h4>Help</h4><ul><li><a data-href="#">Track Order</a></li><li><a data-href="#">Refund Policy</a></li><li><a data-href="#">FAQ</a></li><li><a data-href="#">Contact</a></li></ul></div>
  </div>
  <div class="fbot"><span>© 2025 Veda Eats. FSSAI Lic. No. 12345678.</span><span>Privacy · Terms</span></div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "activewear": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BloomFit — Women's Activewear That Moves With You</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--ivory:#FDF8F2;--dark:#1E1E1E;--terracotta:#D4734A;--blush:#F5D5C8;--sage:#8FA68B;--gray:#7A7A7A;--border:#ECDDD4;--light-bg:#FAF3EC;}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--ivory);color:var(--dark);font-fxmily:'Outfit',sans-serif;font-size:16px;line-height:1.6;}

/* PROMO BAR */
.promo-bar{background:var(--terracotta);color:#fff;overflow:hidden;padding:10px 0;}
.promo-inner{display:flex;gap:0;animation:slide 18s linear infinite;}
.promo-item{white-space:nowrap;padding:0 60px;font-size:13px;font-weight:500;letter-spacing:.06em;}
.promo-sep{opacity:.5;}
@keyframes slide{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--ivory);border-bottom:1px solid var(--border);padding:16px 60px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{font-fxmily:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--dark);text-decoration:none;letter-spacing:.02em;}
.nav-logo span{color:var(--terracotta);}
.nav-links{display:flex;gap:28px;list-style:none;}
.nav-links a{color:var(--dark);text-decoration:none;font-size:14px;font-weight:400;opacity:.65;transition:opacity .2s;}
.nav-links a:hover{opacity:1;}
.nav-links .new-tag{background:var(--terracotta);color:#fff;font-size:9px;padding:2px 6px;border-radius:2px;margin-left:4px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;vertical-align:middle;}
.nav-right{display:flex;align-items:center;gap:14px;}
.nav-coins{background:var(--blush);color:var(--dark);padding:7px 14px;font-size:12px;font-weight:500;border-radius:20px;cursor:pointer;}
.nav-cta{background:var(--dark);color:#fff;padding:10px 24px;font-size:13px;font-weight:500;border:none;cursor:pointer;border-radius:2px;transition:background .2s;}
.nav-cta:hover{background:var(--terracotta);}

/* HERO */
.hero{display:grid;grid-template-columns:5fr 4fr;min-height:88vh;background:var(--light-bg);}
.hero-image{position:relative;overflow:hidden;order:1;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--blush),#F0C5B0);}
.hero-image-inner{width:68%;aspect-ratio:.65;background:linear-gradient(160deg,rgba(255,255,255,.4),rgba(255,255,255,.1));border-radius:50% 50% 40% 40%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border:1px solid rgba(255,255,255,.5);}
.hero-image-inner p{font-fxmily:'Playfair Display',serif;font-size:18px;color:rgba(255,255,255,.8);text-align:center;line-height:1.4;}
.hero-image-inner small{font-size:11px;letter-spacing:.12em;color:rgba(255,255,255,.6);text-transform:uppercase;}
.hero-floating-tag{position:absolute;bottom:40px;left:40px;background:#fff;padding:14px 20px;border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,.08);}
.floating-tag-top{font-size:11px;color:var(--gray);letter-spacing:.06em;margin-bottom:2px;}
.floating-tag-val{font-size:16px;font-weight:600;color:var(--dark);}
.floating-tag-val span{color:var(--terracotta);}

.hero-content{display:flex;flex-direction:column;justify-content:center;padding:80px 80px 80px 60px;order:2;}
.hero-pill{display:inline-flex;align-items:center;gap:8px;background:var(--blush);color:var(--terracotta);padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:28px;width:fit-content;}
.hero-title{font-fxmily:'Playfair Display',serif;font-size:clamp(44px,5vw,68px);line-height:1.05;font-weight:700;margin-bottom:20px;}
.hero-title em{font-style:italic;color:var(--terracotta);}
.hero-sub{font-size:15px;color:var(--gray);line-height:1.8;max-width:420px;margin-bottom:32px;}
.hero-features{display:flex;flex-direction:column;gap:12px;margin-bottom:36px;}
.hero-feature{display:flex;align-items:center;gap:12px;font-size:14px;color:var(--dark);}
.feature-check{width:20px;height:20px;background:var(--blush);color:var(--terracotta);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.hero-price{display:flex;align-items:baseline;gap:12px;margin-bottom:32px;}
.price-main{font-size:36px;font-weight:600;}
.price-del{font-size:18px;text-decoration:line-through;color:var(--gray);}
.price-off{background:var(--sage);color:#fff;padding:4px 12px;font-size:12px;font-weight:600;border-radius:2px;}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;}
.btn-primary{background:var(--dark);color:#fff;padding:16px 44px;font-size:14px;font-weight:500;border:2px solid var(--dark);cursor:pointer;transition:all .25s;border-radius:2px;font-fxmily:'Outfit',sans-serif;}
.btn-primary:hover{background:var(--terracotta);border-color:var(--terracotta);}
.btn-outline{background:transparent;color:var(--dark);padding:16px 44px;font-size:14px;font-weight:500;border:2px solid var(--border);cursor:pointer;transition:all .25s;border-radius:2px;font-fxmily:'Outfit',sans-serif;}
.btn-outline:hover{border-color:var(--dark);}
.hero-social{display:flex;align-items:center;gap:12px;}
.social-avatars{display:flex;}
.avatar{width:28px;height:28px;border-radius:50%;border:2px solid var(--ivory);background:var(--blush);margin-left:-8px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--terracotta);}
.avatar:first-child{margin-left:0;}
.social-text{font-size:13px;color:var(--gray);}
.social-text strong{color:var(--dark);}

/* TRUST BAR */
.trust-bar{background:var(--dark);padding:20px 60px;display:flex;justify-content:center;gap:0;}
.tbi{padding:0 40px;display:flex;align-items:center;gap:10px;border-right:1px solid rgba(255,255,255,.1);}
.tbi:last-child{border-right:none;}
.tbi-icon{font-size:18px;}
.tbi-text{font-size:13px;color:rgba(255,255,255,.75);}
.tbi-text strong{color:#fff;}

/* SECTIONS */
.section{padding:80px 60px;}
.sec-kicker{font-size:12px;letter-spacing:.14em;color:var(--terracotta);text-transform:uppercase;font-weight:600;margin-bottom:12px;}
.sec-title{font-fxmily:'Playfair Display',serif;font-size:clamp(36px,3.5vw,52px);line-height:1.1;font-weight:700;margin-bottom:14px;max-width:560px;}
.sec-title em{font-style:italic;color:var(--terracotta);}
.sec-body{font-size:15px;color:var(--gray);max-width:460px;line-height:1.8;margin-bottom:52px;}

/* FABRIC SECTION */
.fabric-section{background:var(--light-bg);padding:80px 60px;}
.fabric-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.fabric-visual{background:linear-gradient(135deg,var(--blush),#EBC5B5);aspect-ratio:1;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;}
.fabric-name{font-fxmily:'Playfair Display',serif;font-size:36px;color:var(--terracotta);}
.fabric-sub{font-size:12px;letter-spacing:.14em;color:rgba(210,100,70,.8);text-transform:uppercase;}
.fabric-props{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px;}
.fabric-prop{padding:20px;background:#fff;border:1px solid var(--border);}
.prop-icon{font-size:22px;margin-bottom:8px;}
.prop-name{font-size:13px;font-weight:600;margin-bottom:4px;}
.prop-text{font-size:12px;color:var(--gray);}

/* PRODUCTS GRID */
.products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.product-card{cursor:pointer;transition:transform .25s;}
.product-card:hover{transform:translateY(-4px);}
.product-img{aspect-ratio:.75;background:linear-gradient(135deg,var(--blush),#F0C0A8);border-radius:4px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
.product-img-inner{text-align:center;padding:20px;}
.product-img-name{font-fxmily:'Playfair Display',serif;font-size:20px;color:var(--terracotta);}
.product-img-sub{font-size:11px;letter-spacing:.1em;color:rgba(210,100,70,.7);text-transform:uppercase;margin-top:4px;}
.product-tag{position:absolute;top:12px;left:12px;background:var(--terracotta);color:#fff;font-size:10px;font-weight:600;padding:4px 10px;letter-spacing:.08em;text-transform:uppercase;border-radius:2px;}
.product-wishlist{position:absolute;top:12px;right:12px;width:32px;height:32px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08);}
.product-info{}
.product-name{font-size:15px;font-weight:500;margin-bottom:4px;}
.product-fab{font-size:12px;color:var(--gray);margin-bottom:10px;}
.product-price{display:flex;align-items:center;gap:8px;}
.product-price-main{font-size:18px;font-weight:600;}
.product-price-del{font-size:13px;text-decoration:line-through;color:var(--gray);}
.product-price-off{font-size:11px;color:var(--sage);font-weight:600;}
.product-colors{display:flex;gap:6px;margin-top:10px;}
.color-dot{width:16px;height:16px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:border-color .2s;}
.color-dot.active,.color-dot:hover{border-color:var(--dark);}

/* REVIEWS */
.reviews-section{background:var(--light-bg);padding:80px 60px;}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.review-card{background:#fff;padding:28px;border-radius:4px;border:1px solid var(--border);}
.review-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.reviewer-avatar{width:40px;height:40px;background:var(--blush);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.reviewer-name{font-size:14px;font-weight:600;}
.reviewer-meta{font-size:12px;color:var(--gray);}
.review-stars{color:var(--terracotta);font-size:13px;letter-spacing:1px;margin-bottom:10px;}
.review-text{font-size:14px;color:#555;line-height:1.75;}
.review-tag{display:inline-block;margin-top:12px;background:var(--blush);color:var(--terracotta);font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;}

/* SIZE GUIDE */
.size-guide{padding:80px 60px;}
.size-table{width:100%;border-collapse:collapse;margin-top:40px;}
.size-table th{background:var(--dark);color:#fff;padding:14px 20px;text-align:left;font-size:13px;letter-spacing:.06em;font-weight:500;}
.size-table td{padding:14px 20px;font-size:14px;border-bottom:1px solid var(--border);}
.size-table tr:hover td{background:var(--light-bg);}
.size-highlight{background:var(--blush)!important;font-weight:600;}

/* FAQ */
.faq-section{background:var(--light-bg);padding:80px 60px;max-width:900px;margin:0 auto;}
.faq-item{border-bottom:1px solid var(--border);}
.faq-q{padding:20px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:15px;font-weight:500;transition:color .2s;}
.faq-q:hover{color:var(--terracotta);}
.faq-icon{width:28px;height:28px;background:var(--blush);color:var(--terracotta);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform .3s;}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease;}
.faq-a p{font-size:14px;color:var(--gray);line-height:1.8;padding-bottom:20px;}
.faq-item.open .faq-icon{transform:rotate(45deg);}
.faq-item.open .faq-a{max-height:200px;}

/* STICKY ATC */
.sticky-atc{position:fixed;bottom:0;left:0;right:0;z-index:200;background:#fff;border-top:1px solid var(--border);padding:14px 60px;display:none;align-items:center;justify-content:space-between;box-shadow:0 -4px 20px rgba(0,0,0,.06);}
.sticky-atc.visible{display:flex;}
.sticky-left{}
.sticky-name{font-size:15px;font-weight:600;}
.sticky-price{font-size:13px;color:var(--gray);}
.sticky-right{display:flex;gap:10px;align-items:center;}
.sticky-size{background:var(--light-bg);border:1px solid var(--border);padding:10px 16px;font-size:13px;font-fxmily:'Outfit',sans-serif;cursor:pointer;border-radius:2px;}
.sticky-btn{background:var(--dark);color:#fff;border:none;padding:12px 36px;font-size:14px;cursor:pointer;font-fxmily:'Outfit',sans-serif;font-weight:500;border-radius:2px;transition:background .2s;}
.sticky-btn:hover{background:var(--terracotta);}

/* FOOTER */
footer{background:var(--dark);color:rgba(255,255,255,.6);padding:60px 60px 28px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:52px;margin-bottom:48px;}
.footer-logo{font-fxmily:'Playfair Display',serif;font-size:24px;font-weight:700;color:#fff;text-decoration:none;display:block;margin-bottom:14px;}
.footer-logo span{color:var(--terracotta);}
.footer-about{font-size:14px;line-height:1.75;max-width:280px;color:rgba(255,255,255,.5);}
.footer-col h4{font-size:11px;letter-spacing:.12em;color:rgba(255,255,255,.5);text-transform:uppercase;font-weight:600;margin-bottom:18px;}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-col a{color:rgba(255,255,255,.5);text-decoration:none;font-size:14px;transition:color .2s;}
.footer-col a:hover{color:#fff;}
.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:22px;display:flex;justify-content:space-between;font-size:12px;}

/* RESPONSIVE */
@media(max-width:1024px){
  .section,.fabric-section,.reviews-section,.size-guide,.faq-section,footer{padding:60px 40px;}
  nav{padding:14px 40px;}
  .hero-content{padding:60px 40px;}
  .trust-bar{padding:20px 40px;flex-wrap:wrap;gap:0;}
}
@media(max-width:768px){
  .hero{grid-template-columns:1fr;min-height:auto;}
  .hero-image{min-height:300px;order:-1;}
  .hero-content{padding:48px 24px;order:2;}
  nav{padding:14px 24px;}
  .nav-links{display:none;}
  .trust-bar{padding:14px 24px;flex-wrap:wrap;}
  .tbi{flex:0 0 100%;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:10px 0;}
  .section,.fabric-section,.reviews-section,.size-guide,.faq-section,footer{padding:48px 24px;}
  .fabric-grid{grid-template-columns:1fr;gap:40px;}
  .products-grid{grid-template-columns:1fr 1fr;gap:16px;}
  .reviews-grid{grid-template-columns:1fr;}
  .footer-grid{grid-template-columns:1fr 1fr;gap:32px;}
  .footer-grid>div:first-child{grid-column:1/-1;}
  .footer-bottom{flex-direction:column;gap:8px;}
  .sticky-atc{padding:12px 20px;}
}

@keyframes fadeIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.hero-pill{animation:fadeIn .5s ease both;}
.hero-title{animation:fadeIn .5s ease .1s both;}
.hero-sub{animation:fadeIn .5s ease .18s both;}
.hero-features{animation:fadeIn .5s ease .25s both;}
.hero-price{animation:fadeIn .5s ease .3s both;}
.hero-cta{animation:fadeIn .5s ease .36s both;}
.hero-social{animation:fadeIn .5s ease .42s both;}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<!-- PROMO BAR -->
<div class="promo-bar">
  <div class="promo-inner" id="promoInner">
    <span class="promo-item">✦ Extra 10% off first order — code FIRSTBLISS</span>
    <span class="promo-item">✦ Buy 2, save ₹150 — code BLISS150</span>
    <span class="promo-item">✦ Buy 3, save ₹300 — code BLISS300</span>
    <span class="promo-item">✦ Free shipping above ₹499</span>
    <span class="promo-item">✦ Extra 10% off first order — code FIRSTBLISS</span>
    <span class="promo-item">✦ Buy 2, save ₹150 — code BLISS150</span>
    <span class="promo-item">✦ Buy 3, save ₹300 — code BLISS300</span>
    <span class="promo-item">✦ Free shipping above ₹499</span>
  </div>
</div>

<!-- NAV -->
<nav>
  <a data-href="#" class="nav-logo">Bloom<span>Fit</span></a>
  <ul class="nav-links">
    <li><a data-href="#">Shop All</a></li>
    <li><a data-href="#">Bestsellers</a></li>
    <li><a data-href="#">New Launches <span class="new-tag">New</span></a></li>
    <li><a data-href="#">Menswear</a></li>
    <li><a data-href="#">Store Locator</a></li>
  </ul>
  <div class="nav-right">
    <span class="nav-coins">🪙 1,000 Coins</span>
    <button class="nav-cta">Buy Now</button>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-image">
    <div class="hero-image-inner">
      <p>Ultimate<br>Flare Pants</p>
      <small>Lite · EverFlow Fabric</small>
    </div>
    <div class="hero-floating-tag">
      <div class="floating-tag-top">Rating</div>
      <div class="floating-tag-val">★★★★★ <span>4.9</span></div>
    </div>
  </div>
  <div class="hero-content">
    <div class="hero-pill">🌸 Bestseller · 2,000+ Sold</div>
    <h1 class="hero-title">Move in<br><em>Total</em><br>Freedom</h1>
    <p class="hero-sub">The Ultimate Flare Pants — Lite Tall. Designed to flatter every body and move with you through yoga, brunch, and everything in between.</p>
    <div class="hero-features">
      <div class="hero-feature"><div class="feature-check">✓</div> EverFlow fabric — lightweight, stretchy, breathable</div>
      <div class="hero-feature"><div class="feature-check">✓</div> Hidden back pocket — fits your phone</div>
      <div class="hero-feature"><div class="feature-check">✓</div> High waist with tummy support panel</div>
      <div class="hero-feature"><div class="feature-check">✓</div> Available in XS–3XL (inclusive sizing)</div>
    </div>
    <div class="hero-price">
      <span class="price-main">₹1,999</span>
      <span class="price-del">₹2,799</span>
      <span class="price-off">29% OFF</span>
    </div>
    <div class="hero-cta">
      <button class="btn-primary" onclick="document.getElementById('shop-section').scrollIntoView({behavior:'smooth'})">Shop Now</button>
      <button class="btn-outline">View Size Guide</button>
    </div>
    <div class="hero-social">
      <div class="social-avatars">
        <div class="avatar">S</div>
        <div class="avatar">P</div>
        <div class="avatar">R</div>
        <div class="avatar">+</div>
      </div>
      <div class="social-text"><strong>2,000+ women</strong> are wearing this right now</div>
    </div>
  </div>
</section>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="tbi"><span class="tbi-icon">🌸</span><span class="tbi-text"><strong>100k+</strong> Happy Women</span></div>
  <div class="tbi"><span class="tbi-icon">🔄</span><span class="tbi-text"><strong>Easy</strong> Returns & Exchanges</span></div>
  <div class="tbi"><span class="tbi-icon">💳</span><span class="tbi-text"><strong>COD</strong> Available</span></div>
  <div class="tbi"><span class="tbi-icon">🚚</span><span class="tbi-text"><strong>Free</strong> Shipping ₹499+</span></div>
</div>

<!-- FABRIC SECTION -->
<section class="fabric-section">
  <div class="fabric-grid">
    <div>
      <div class="sec-kicker">Our Signature Fabric</div>
      <h2 class="sec-title">Meet <em>EverFlow</em></h2>
      <p class="sec-body">Designed in our BlissLabs, EverFlow is the result of years of testing. Lightweight like a second skin, stretchy in all directions, and buttery smooth against your body.</p>
      <div class="fabric-props">
        <div class="fabric-prop">
          <div class="prop-icon">💧</div>
          <div class="prop-name">Moisture Wicking</div>
          <div class="prop-text">Pulls sweat away from skin instantly</div>
        </div>
        <div class="fabric-prop">
          <div class="prop-icon">🌬️</div>
          <div class="prop-name">4-Way Stretch</div>
          <div class="prop-text">Moves in every direction with you</div>
        </div>
        <div class="fabric-prop">
          <div class="prop-icon">🫧</div>
          <div class="prop-name">Ultra Lightweight</div>
          <div class="prop-text">You'll forget you're wearing it</div>
        </div>
        <div class="fabric-prop">
          <div class="prop-icon">♾️</div>
          <div class="prop-name">Shape Retention</div>
          <div class="prop-text">Keeps its form wash after wash</div>
        </div>
      </div>
    </div>
    <div class="fabric-visual">
      <div class="fabric-name">EverFlow</div>
      <div class="fabric-sub">BlissClub Signature Fabric</div>
    </div>
  </div>
</section>

<!-- PRODUCTS -->
<section class="section" id="shop-section">
  <div class="sec-kicker">Shop the Collection</div>
  <h2 class="sec-title">Move in <em>Style</em></h2>
  <p class="sec-body">From yoga to street, our flare collection is built for women who refuse to choose between comfort and confidence.</p>
  <div class="products-grid">
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,#D4C5E8,#B8A8D8);">
        <div class="product-img-inner">
          <div class="product-img-name">Flare Pants</div>
          <div class="product-img-sub">Lilac · EverFlow</div>
        </div>
        <div class="product-tag">Bestseller</div>
        <div class="product-wishlist">♡</div>
      </div>
      <div class="product-info">
        <div class="product-name">Ultimate Flare Pants — Lite</div>
        <div class="product-fab">EverFlow · Lilac</div>
        <div class="product-price">
          <span class="product-price-main">₹1,999</span>
          <span class="product-price-del">₹2,799</span>
          <span class="product-price-off">29% off</span>
        </div>
        <div class="product-colors">
          <div class="color-dot active" style="background:#C5B5D8;"></div>
          <div class="color-dot" style="background:#D4734A;"></div>
          <div class="color-dot" style="background:#2C2C2C;"></div>
          <div class="color-dot" style="background:#8FA68B;"></div>
        </div>
      </div>
    </div>
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,var(--blush),#E5B5A0);">
        <div class="product-img-inner">
          <div class="product-img-name">Flare Pants</div>
          <div class="product-img-sub">Tall · EverFlow</div>
        </div>
        <div class="product-tag">New</div>
        <div class="product-wishlist">♡</div>
      </div>
      <div class="product-info">
        <div class="product-name">Ultimate Flare Pants — Lite Tall</div>
        <div class="product-fab">EverFlow · Blush Rose</div>
        <div class="product-price">
          <span class="product-price-main">₹1,999</span>
          <span class="product-price-del">₹2,799</span>
          <span class="product-price-off">29% off</span>
        </div>
        <div class="product-colors">
          <div class="color-dot active" style="background:#F5D5C8;"></div>
          <div class="color-dot" style="background:#C5B5D8;"></div>
          <div class="color-dot" style="background:#2C2C2C;"></div>
        </div>
      </div>
    </div>
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,#A8C4A8,#88A888);">
        <div class="product-img-inner">
          <div class="product-img-name">Flare Pants</div>
          <div class="product-img-sub">Sage · CloudSoft</div>
        </div>
        <div class="product-tag">Trending</div>
        <div class="product-wishlist">♡</div>
      </div>
      <div class="product-info">
        <div class="product-name">Ultimate Flare Pants — CloudSoft</div>
        <div class="product-fab">CloudSoft Float · Sage</div>
        <div class="product-price">
          <span class="product-price-main">₹2,199</span>
          <span class="product-price-del">₹2,999</span>
          <span class="product-price-off">27% off</span>
        </div>
        <div class="product-colors">
          <div class="color-dot active" style="background:#8FA68B;"></div>
          <div class="color-dot" style="background:#D4734A;"></div>
          <div class="color-dot" style="background:#F5D5C8;"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews-section">
  <div class="sec-kicker">What Our Girls Say</div>
  <h2 class="sec-title">Real Women,<br><em>Real Results</em></h2>
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:40px;">
    <div style="font-fxmily:'Playfair Display',serif;font-size:56px;font-weight:700;color:var(--dark);line-height:1;">4.9</div>
    <div>
      <div style="color:var(--terracotta);font-size:20px;letter-spacing:2px;">★★★★★</div>
      <div style="font-size:13px;color:var(--gray);margin-top:4px;">Based on 3,200+ reviews</div>
    </div>
  </div>
  <div class="reviews-grid">
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-avatar">S</div>
        <div><div class="reviewer-name">Shreya K.</div><div class="reviewer-meta">Mumbai · XS</div></div>
      </div>
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"These are the most comfortable pants I've ever worn to a yoga class AND then immediately to brunch. The EverFlow fabric is insane — zero restriction, zero sweat show."</p>
      <span class="review-tag">Yoga + Everyday</span>
    </div>
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-avatar">P</div>
        <div><div class="reviewer-name">Prachi M.</div><div class="reviewer-meta">Bangalore · M</div></div>
      </div>
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"Finally a brand that caters to tall women! The Tall fit is exactly right for my 5'9 frame. The flare falls perfectly at my ankle. Bought 3 colors already and honestly considering more."</p>
      <span class="review-tag">Tall Fit ✓</span>
    </div>
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-avatar">R</div>
        <div><div class="reviewer-name">Riya D.</div><div class="reviewer-meta">Pune · L</div></div>
      </div>
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"The hidden pocket fits my entire phone. The waistband gives incredible tummy support without being uncomfortable. I wore this on a 6-hour flight and felt great the entire time."</p>
      <span class="review-tag">Travel Approved</span>
    </div>
  </div>
</section>

<!-- FAQ -->
<div class="faq-section" style="padding:80px 60px;">
  <div class="sec-kicker" style="text-align:center">Questions?</div>
  <h2 class="sec-title" style="text-align:center;max-width:100%;margin-bottom:48px;">Frequently Asked <em>Questions</em></h2>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">How does the sizing work? <div class="faq-icon">+</div></div>
    <div class="faq-a"><p>We offer XS to 3XL. For the Lite Tall fit, it's designed for heights 5'7" and above. Our size guide on the product page includes detailed measurements. If you're between sizes, size up for a more relaxed fit.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">Can I wear it for high-intensity workouts? <div class="faq-icon">+</div></div>
    <div class="faq-a"><p>The EverFlow fabric is great for low to medium intensity — yoga, pilates, walking, travel, and everyday wear. For high-intensity like running or HIIT, we'd recommend our AirMelt or Aerocool range.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">What is your return policy? <div class="faq-icon">+</div></div>
    <div class="faq-a"><p>We offer 15-day returns and exchanges for all orders. Items must be unworn and in original packaging. Exchanges are processed within 3–5 business days. Returns are fully refunded within 7 business days.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">Do you ship across India? <div class="faq-icon">+</div></div>
    <div class="faq-a"><p>Yes! We ship pan-India. Orders are dispatched within 1–2 business days. Standard delivery takes 3–6 business days. Free shipping on orders above ₹499.</p></div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div>
      <a data-href="#" class="footer-logo">Bloom<span>Fit</span></a>
      <p class="footer-about">Premium activewear for Indian women who move with intention. Built for comfort, designed for confidence.</p>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">All Products</a></li>
        <li><a data-href="#">Bestsellers</a></li>
        <li><a data-href="#">New Launches</a></li>
        <li><a data-href="#">Fabrics</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <ul>
        <li><a data-href="#">Track Order</a></li>
        <li><a data-href="#">Returns</a></li>
        <li><a data-href="#">Size Guide</a></li>
        <li><a data-href="#">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Brand</h4>
      <ul>
        <li><a data-href="#">Our Story</a></li>
        <li><a data-href="#">BlissLabs</a></li>
        <li><a data-href="#">Instagram</a></li>
        <li><a data-href="#">Loyalty Program</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 BloomFit. All rights reserved.</span>
    <span>Made with 🧡 in India</span>
  </div>
</footer>

<!-- STICKY ATC -->
<div class="sticky-atc" id="stickyAtc">
  <div class="sticky-left">
    <div class="sticky-name">Ultimate Flare Pants — Lite Tall</div>
    <div class="sticky-price">₹1,999 · <del style="color:var(--gray)">₹2,799</del> · Free Shipping</div>
  </div>
  <div class="sticky-right">
    <label style="display:none">Form field</label><select class="sticky-size">
      <option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option>
    </select>
    <button class="sticky-btn">Add to Cart</button>
  </div>
</div>

<script>
function toggleFaq(el){
  const item=el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(i=>{if(i!==item)i.classList.remove('open');});
  item.classList.toggle('open');
}

const heroEl=document.querySelector('.hero');
const stickyEl=document.getElementById('stickyAtc');
if(heroEl&&stickyEl){
  new IntersectionObserver(([e])=>{stickyEl.classList.toggle('visible',!e.isIntersecting);},{threshold:0}).observe(heroEl);
}

document.querySelectorAll('.product-card,.review-card,.fabric-prop').forEach((el,i)=>{
  el.style.cssText+='opacity:0;transform:translateY(16px);transition:opacity .45s ease '+((i%3)*.1)+'s, transform .45s ease '+((i%3)*.1)+'s';
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='translateY(0)';}
  },{threshold:.1}).observe(el);
});
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "streetwear": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>URBNCO — New Drop: Marga Relaxed Pants</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--black:#080808;--white:#F5F5F0;--red:#E8292B;--gray:#888;--border:rgba(255,255,255,.1);}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--black);color:var(--white);font-fxmily:'Barlow',sans-serif;font-size:16px;line-height:1.5;}

/* TICKER */
.ticker{background:var(--red);padding:9px 0;overflow:hidden;white-space:nowrap;}
.ticker-inner{display:inline-flex;gap:0;animation:ticker 20s linear infinite;}
.ticker-item{display:inline-flex;align-items:center;padding:0 40px;font-fxmily:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;}
.ticker-dot{width:5px;height:5px;background:rgba(255,255,255,.5);border-radius:50%;margin-right:40px;}
@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--black);border-bottom:1px solid var(--border);padding:18px 60px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{font-fxmily:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:.12em;color:var(--white);text-decoration:none;}
.nav-logo span{color:var(--red);}
.nav-links{display:flex;gap:36px;list-style:none;}
.nav-links a{color:rgba(255,255,255,.55);text-decoration:none;font-fxmily:'Barlow Condensed',sans-serif;font-size:15px;letter-spacing:.1em;text-transform:uppercase;transition:color .2s;}
.nav-links a:hover{color:var(--white);}
.nav-right{display:flex;align-items:center;gap:20px;}
.nav-icon{color:rgba(255,255,255,.6);font-size:13px;cursor:pointer;transition:color .2s;font-fxmily:'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;}
.nav-icon:hover{color:var(--white);}
.nav-cta{background:var(--red);color:var(--white);padding:10px 24px;font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.12em;border:none;cursor:pointer;text-transform:uppercase;transition:opacity .2s;}
.nav-cta:hover{opacity:.85;}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:92vh;border-bottom:1px solid var(--border);}
.hero-left{display:flex;flex-direction:column;justify-content:flex-end;padding:80px 60px 80px 80px;border-right:1px solid var(--border);position:relative;overflow:hidden;}
.hero-left::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at bottom left, rgba(232,41,43,.08) 0%, transparent 60%);pointer-events:none;}
.hero-category{font-fxmily:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.2em;color:var(--red);text-transform:uppercase;margin-bottom:24px;display:flex;align-items:center;gap:12px;}
.hero-category::before{content:'';width:32px;height:1px;background:var(--red);}
.hero-title{font-fxmily:'Bebas Neue',sans-serif;font-size:clamp(72px,8vw,120px);line-height:.92;letter-spacing:.02em;margin-bottom:24px;}
.hero-title span{color:var(--red);}
.hero-desc{font-size:15px;color:var(--gray);line-height:1.7;max-width:380px;margin-bottom:40px;}
.hero-meta{display:flex;gap:40px;margin-bottom:40px;}
.meta-item{}
.meta-label{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.14em;color:var(--gray);text-transform:uppercase;margin-bottom:4px;}
.meta-val{font-size:20px;font-weight:500;}
.meta-val.price del{font-size:14px;color:var(--gray);margin-right:4px;}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px;}
.btn-primary{background:var(--white);color:var(--black);padding:16px 44px;font-fxmily:'Barlow Condensed',sans-serif;font-size:15px;letter-spacing:.14em;border:none;cursor:pointer;text-transform:uppercase;transition:all .2s;}
.btn-primary:hover{background:var(--red);color:var(--white);}
.btn-ghost{background:transparent;color:var(--white);padding:16px 44px;font-fxmily:'Barlow Condensed',sans-serif;font-size:15px;letter-spacing:.14em;border:1px solid rgba(255,255,255,.3);cursor:pointer;text-transform:uppercase;transition:all .2s;}
.btn-ghost:hover{border-color:var(--white);}
.hero-drops{display:flex;align-items:center;gap:8px;}
.drop-dot{width:8px;height:8px;background:var(--red);border-radius:50%;animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.drop-text{font-fxmily:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:.1em;color:rgba(255,255,255,.5);text-transform:uppercase;}

.hero-right{position:relative;overflow:hidden;background:#111;display:flex;align-items:center;justify-content:center;}
.hero-right::before{content:'MARGA';position:absolute;font-fxmily:'Bebas Neue',sans-serif;font-size:220px;color:rgba(255,255,255,.03);letter-spacing:-.02em;white-space:nowrap;user-select:none;}
.product-frame{width:72%;aspect-ratio:.67;background:linear-gradient(170deg,#1a1a1a,#222);border:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;position:relative;}
.product-frame-label{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.2em;color:rgba(255,255,255,.3);text-transform:uppercase;}
.product-frame-name{font-fxmily:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:.1em;color:rgba(255,255,255,.5);}
.product-tag{position:absolute;top:20px;right:20px;background:var(--red);color:var(--white);font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.1em;padding:6px 12px;text-transform:uppercase;}

/* STATS BAR */
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--border);}
.stat{padding:28px 40px;border-right:1px solid var(--border);text-align:center;}
.stat:last-child{border-right:none;}
.stat-num{font-fxmily:'Bebas Neue',sans-serif;font-size:44px;letter-spacing:.04em;line-height:1;color:var(--white);}
.stat-num span{color:var(--red);}
.stat-label{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.14em;color:var(--gray);text-transform:uppercase;margin-top:4px;}

/* SECTION */
.section{padding:80px 80px;}
.sec-eyebrow{font-fxmily:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.18em;color:var(--red);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:12px;}
.sec-eyebrow::before{content:'';width:24px;height:1px;background:var(--red);}
.sec-title{font-fxmily:'Bebas Neue',sans-serif;font-size:clamp(52px,5vw,80px);line-height:.95;letter-spacing:.03em;margin-bottom:20px;}
.sec-title span{color:var(--red);}
.sec-body{font-size:15px;color:var(--gray);max-width:480px;line-height:1.75;margin-bottom:52px;}

/* PRODUCT FEATURES */
.features-layout{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--border);}
.feature-big{padding:48px;border-right:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between;}
.feature-big-label{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.16em;color:var(--red);text-transform:uppercase;margin-bottom:16px;}
.feature-big-title{font-fxmily:'Bebas Neue',sans-serif;font-size:52px;line-height:.95;letter-spacing:.03em;margin-bottom:20px;}
.feature-big-text{font-size:15px;color:var(--gray);line-height:1.7;}
.feature-list{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--border);}
.feature-item{padding:28px 32px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);}
.feature-item:nth-child(even){border-right:none;}
.feature-item:nth-last-child(-n+2){border-bottom:none;}
.feature-num{font-fxmily:'Bebas Neue',sans-serif;font-size:32px;color:var(--red);line-height:1;margin-bottom:8px;}
.feature-title{font-fxmily:'Barlow Condensed',sans-serif;font-size:15px;letter-spacing:.08em;font-weight:600;text-transform:uppercase;margin-bottom:6px;}
.feature-text{font-size:13px;color:var(--gray);line-height:1.6;}

/* SIZE + ATC */
.atc-section{background:#0F0F0F;padding:80px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.atc-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.atc-product-name{font-fxmily:'Bebas Neue',sans-serif;font-size:56px;line-height:.95;letter-spacing:.03em;margin-bottom:8px;}
.atc-product-sub{font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.12em;color:var(--gray);text-transform:uppercase;margin-bottom:32px;}
.atc-price{font-size:32px;font-weight:500;margin-bottom:8px;}
.atc-price del{font-size:18px;color:var(--gray);margin-right:8px;}
.atc-save{font-fxmily:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.1em;color:var(--red);text-transform:uppercase;margin-bottom:32px;}
.size-label{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.14em;color:var(--gray);text-transform:uppercase;margin-bottom:12px;}
.size-grid{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;}
.size-btn{width:54px;height:44px;background:transparent;border:1px solid rgba(255,255,255,.2);color:var(--white);font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.08em;cursor:pointer;transition:all .2s;text-transform:uppercase;}
.size-btn:hover,.size-btn.active{border-color:var(--white);background:var(--white);color:var(--black);}
.size-btn.sold-out{opacity:.3;cursor:not-allowed;text-decoration:line-through;}
.atc-actions{display:flex;gap:12px;}
.atc-btn{flex:1;background:var(--white);color:var(--black);padding:18px;font-fxmily:'Barlow Condensed',sans-serif;font-size:16px;letter-spacing:.14em;border:none;cursor:pointer;text-transform:uppercase;transition:all .2s;}
.atc-btn:hover{background:var(--red);color:var(--white);}
.atc-wish{width:56px;height:56px;background:transparent;border:1px solid rgba(255,255,255,.2);color:var(--white);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.atc-wish:hover{border-color:var(--red);color:var(--red);}
.atc-assurance{display:flex;gap:24px;margin-top:24px;flex-wrap:wrap;}
.assurance-item{font-fxmily:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.08em;color:var(--gray);text-transform:uppercase;display:flex;align-items:center;gap:6px;}

/* REVIEWS */
.reviews{padding:80px;background:#0A0A0A;}
.reviews-header{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-bottom:52px;align-items:center;}
.rating-display{display:flex;align-items:baseline;gap:16px;}
.rating-num{font-fxmily:'Bebas Neue',sans-serif;font-size:100px;line-height:.9;color:var(--white);}
.rating-right{}
.rating-stars{color:var(--red);font-size:22px;letter-spacing:2px;margin-bottom:4px;}
.rating-count{font-fxmily:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--gray);text-transform:uppercase;}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}
.review-card{background:var(--black);padding:32px;}
.review-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.review-stars{color:var(--red);font-size:12px;letter-spacing:2px;}
.review-verified{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.1em;color:var(--red);text-transform:uppercase;}
.review-text{font-size:15px;color:rgba(255,255,255,.75);line-height:1.7;margin-bottom:20px;}
.review-author{font-fxmily:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.1em;color:var(--gray);text-transform:uppercase;}
.review-author strong{color:var(--white);}

/* FAQ */
.faq-section{padding:80px;}
.faq-item{border-bottom:1px solid var(--border);}
.faq-q{padding:22px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-fxmily:'Barlow Condensed',sans-serif;font-size:18px;letter-spacing:.06em;text-transform:uppercase;transition:color .2s;}
.faq-q:hover{color:var(--red);}
.faq-icon{color:var(--red);font-size:24px;transition:transform .3s;user-select:none;}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease;}
.faq-a p{font-size:15px;color:var(--gray);line-height:1.8;padding-bottom:22px;}
.faq-item.open .faq-icon{transform:rotate(45deg);}
.faq-item.open .faq-a{max-height:180px;}

/* FOOTER */
footer{background:#050505;border-top:1px solid var(--border);padding:56px 80px 28px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;margin-bottom:48px;}
.footer-logo{font-fxmily:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:.12em;color:var(--white);text-decoration:none;display:block;margin-bottom:14px;}
.footer-logo span{color:var(--red);}
.footer-about{font-size:14px;color:var(--gray);line-height:1.7;max-width:260px;}
.footer-col h4{font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.16em;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:18px;}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-col a{color:var(--gray);text-decoration:none;font-size:14px;transition:color .2s;}
.footer-col a:hover{color:var(--white);}
.footer-bottom{border-top:1px solid var(--border);padding-top:24px;display:flex;justify-content:space-between;font-fxmily:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:.08em;color:var(--gray);text-transform:uppercase;}

/* STICKY */
.sticky-atc{position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--black);border-top:1px solid var(--border);padding:14px 60px;display:none;align-items:center;justify-content:space-between;}
.sticky-atc.visible{display:flex;}
.sticky-product{font-fxmily:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.06em;}
.sticky-price{font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.08em;color:var(--gray);margin-top:2px;}
.sticky-btn{background:var(--red);color:var(--white);border:none;padding:13px 40px;font-fxmily:'Barlow Condensed',sans-serif;font-size:15px;letter-spacing:.14em;cursor:pointer;text-transform:uppercase;}

/* RESPONSIVE */
@media(max-width:1024px){
  .section,.atc-section,.reviews,.faq-section,footer{padding:60px 40px;}
  nav{padding:16px 40px;}
}
@media(max-width:768px){
  .hero{grid-template-columns:1fr;min-height:auto;}
  .hero-left{padding:48px 24px;border-right:none;border-bottom:1px solid var(--border);}
  .hero-right{min-height:280px;order:-1;}
  nav{padding:14px 24px;}
  .nav-links{display:none;}
  .stats-bar{grid-template-columns:1fr 1fr;}
  .stat{border-bottom:1px solid var(--border);}
  .stat:nth-child(even){border-right:none;}
  .section,.atc-section,.reviews,.faq-section,footer{padding:48px 24px;}
  .features-layout{grid-template-columns:1fr;}
  .feature-big{border-right:none;border-bottom:1px solid var(--border);}
  .atc-inner{grid-template-columns:1fr;gap:40px;}
  .reviews-grid{grid-template-columns:1fr;gap:0;}
  .reviews-header{grid-template-columns:1fr;gap:24px;}
  .footer-grid{grid-template-columns:1fr 1fr;gap:32px;}
  .footer-grid>div:first-child{grid-column:1/-1;}
  .footer-bottom{flex-direction:column;gap:8px;}
  .sticky-atc{padding:12px 24px;}
  .hero-title{font-size:clamp(60px,14vw,100px);}
}

@keyframes slideInLeft{from{opacity:0;transform:translateX(-30px);}to{opacity:1;transform:translateX(0);}}
@keyframes slideInRight{from{opacity:0;transform:translateX(30px);}to{opacity:1;transform:translateX(0);}}
.hero-category,.hero-title,.hero-desc,.hero-meta,.hero-actions,.hero-drops{animation:slideInLeft .6s ease both;}
.hero-category{animation-delay:.05s;}
.hero-title{animation-delay:.1s;}
.hero-desc{animation-delay:.2s;}
.hero-meta{animation-delay:.28s;}
.hero-actions{animation-delay:.35s;}
.hero-drops{animation-delay:.42s;}
.product-frame{animation:slideInRight .6s ease .1s both;}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<!-- TICKER -->
<div class="ticker">
  <div class="ticker-inner" id="tickerInner">
    <span class="ticker-item">New Drop: The Vagabond Set <span class="ticker-dot"></span></span>
    <span class="ticker-item">Free Shipping Above ₹500 <span class="ticker-dot"></span></span>
    <span class="ticker-item">Made in India <span class="ticker-dot"></span></span>
    <span class="ticker-item">100% Cotton Dobby <span class="ticker-dot"></span></span>
    <span class="ticker-item">New Drop: The Vagabond Set <span class="ticker-dot"></span></span>
    <span class="ticker-item">Free Shipping Above ₹500 <span class="ticker-dot"></span></span>
    <span class="ticker-item">Made in India <span class="ticker-dot"></span></span>
    <span class="ticker-item">100% Cotton Dobby <span class="ticker-dot"></span></span>
  </div>
</div>

<!-- NAV -->
<nav>
  <a data-href="#" class="nav-logo">URB<span>N</span>CO</a>
  <ul class="nav-links">
    <li><a data-href="#">Clearance</a></li>
    <li><a data-href="#">Headwear</a></li>
    <li><a data-href="#">Clothing</a></li>
    <li><a data-href="#">Accessories</a></li>
    <li><a data-href="#">Collabs</a></li>
  </ul>
  <div class="nav-right">
    <span class="nav-icon">Search</span>
    <span class="nav-icon">Cart (0)</span>
    <button class="nav-cta">Buy Now</button>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <div class="hero-category">New Arrival</div>
    <h1 class="hero-title">Marga<br><span>Relaxed</span><br>Pants</h1>
    <p class="hero-desc">Cut from 100% cotton dobby in a wide, unhurried silhouette. Brown and white stripes woven with natural texture and depth. Goes everywhere.</p>
    <div class="hero-meta">
      <div class="meta-item">
        <div class="meta-label">Price</div>
        <div class="meta-val price">₹1,650</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Fabric</div>
        <div class="meta-val" style="font-size:16px">100% Cotton Dobby</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Origin</div>
        <div class="meta-val" style="font-size:16px">Made in India</div>
      </div>
    </div>
    <div class="hero-actions">
      <button class="btn-primary" onclick="document.getElementById('atc-section').scrollIntoView({behavior:'smooth'})">Shop Now</button>
      <button class="btn-ghost">Size Guide</button>
    </div>
    <div class="hero-drops">
      <span class="drop-dot"></span>
      <span class="drop-text">Limited Stock — Selling Fast</span>
    </div>
  </div>
  <div class="hero-right">
    <div class="product-frame">
      <div class="product-frame-label">Brown + White</div>
      <div class="product-frame-name">MARGA</div>
      <div class="product-frame-label">Cotton Dobby Stripes</div>
      <div class="product-tag">New Drop</div>
    </div>
  </div>
</section>

<!-- STATS BAR -->
<div class="stats-bar">
  <div class="stat">
    <div class="stat-num">100<span>%</span></div>
    <div class="stat-label">Cotton Dobby</div>
  </div>
  <div class="stat">
    <div class="stat-num">5<span>+</span></div>
    <div class="stat-label">Sizes Available</div>
  </div>
  <div class="stat">
    <div class="stat-num">4.9<span>★</span></div>
    <div class="stat-label">Avg. Rating</div>
  </div>
  <div class="stat">
    <div class="stat-num">24<span>h</span></div>
    <div class="stat-label">Fast Dispatch</div>
  </div>
</div>

<!-- FEATURES -->
<section class="section">
  <div class="sec-eyebrow">Product Details</div>
  <h2 class="sec-title">Built for<br><span>Comfort</span></h2>
  <div class="features-layout">
    <div class="feature-big">
      <div>
        <div class="feature-big-label">The Fabric</div>
        <div class="feature-big-title">100% Cotton<br>Dobby</div>
        <div class="feature-big-text" style="color:var(--gray)">Handwoven with natural texture and depth. Breathable, durable, and effortlessly stylish. The kind of fabric that gets better with every wash.</div>
      </div>
      <div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border);">
        <div style="font-fxmily:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.14em;color:var(--gray);text-transform:uppercase;margin-bottom:14px;">Colorway</div>
        <div style="display:flex;gap:10px;">
          <div style="width:40px;height:40px;background:linear-gradient(135deg,#8B6914,#F5F5F0 50%);border:1px solid rgba(255,255,255,.2);"></div>
        </div>
      </div>
    </div>
    <div>
      <div class="feature-list">
        <div class="feature-item">
          <div class="feature-num">01</div>
          <div class="feature-title">Relaxed Fit</div>
          <div class="feature-text">Wide, unhurried silhouette. Full-length cut for an effortless look.</div>
        </div>
        <div class="feature-item">
          <div class="feature-num">02</div>
          <div class="feature-title">Elasticated Waist</div>
          <div class="feature-text">Comfort-first waistband. No zipper, pure ease of wear.</div>
        </div>
        <div class="feature-item">
          <div class="feature-num">03</div>
          <div class="feature-title">Deep Side Pockets</div>
          <div class="feature-text">Two deep pockets — because pockets should actually be pockets.</div>
        </div>
        <div class="feature-item">
          <div class="feature-num">04</div>
          <div class="feature-title">Dobby Stripes</div>
          <div class="feature-text">Woven-in texture. Not printed, not dyed — built into the fabric itself.</div>
        </div>
        <div class="feature-item">
          <div class="feature-num">05</div>
          <div class="feature-title">Faux Fly Front</div>
          <div class="feature-text">Clean front aesthetic with a tailored look. Simple, sharp, deliberate.</div>
        </div>
        <div class="feature-item">
          <div class="feature-num">06</div>
          <div class="feature-title">Flag Label Detail</div>
          <div class="feature-text">The signature UM flag on the hem. Subtle brand. Real identity.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ATC SECTION -->
<section class="atc-section" id="atc-section">
  <div class="atc-inner">
    <div>
      <div class="atc-product-name">Marga<br>Relaxed Pants</div>
      <div class="atc-product-sub">Brown + White · Cotton Dobby</div>
      <div class="atc-price">₹1,650</div>
      <div class="atc-save">Free Shipping Above ₹500</div>
      <div class="size-label">Select Size</div>
      <div class="size-grid">
        <button class="size-btn">S/28</button>
        <button class="size-btn active">M/30</button>
        <button class="size-btn">L/32</button>
        <button class="size-btn">XL/34</button>
        <button class="size-btn sold-out">2XL/36</button>
      </div>
      <div class="atc-actions">
        <button class="atc-btn">Add to Cart</button>
        <button class="atc-wish">♡</button>
      </div>
      <div class="atc-assurance">
        <span class="assurance-item">✓ Free Returns</span>
        <span class="assurance-item">✓ COD Available</span>
        <span class="assurance-item">✓ Made in India</span>
      </div>
    </div>
    <div>
      <div class="sec-eyebrow">Care Instructions</div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="padding:20px 24px;border:1px solid var(--border);display:flex;gap:16px;align-items:center;">
          <span style="font-size:24px">🌊</span>
          <div><div style="font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">Machine Wash</div><div style="font-size:13px;color:var(--gray);">Cold water, gentle cycle. Inside out.</div></div>
        </div>
        <div style="padding:20px 24px;border:1px solid var(--border);display:flex;gap:16px;align-items:center;">
          <span style="font-size:24px">🌤️</span>
          <div><div style="font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">Line Dry</div><div style="font-size:13px;color:var(--gray);">Dry in shade. Do not tumble dry.</div></div>
        </div>
        <div style="padding:20px 24px;border:1px solid var(--border);display:flex;gap:16px;align-items:center;">
          <span style="font-size:24px">🚫</span>
          <div><div style="font-fxmily:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">No Bleach</div><div style="font-size:13px;color:var(--gray);">Avoid bleach and fabric softeners.</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews">
  <div class="reviews-header">
    <div>
      <div class="sec-eyebrow">Customer Love</div>
      <h2 class="sec-title">What They're<br><span>Saying</span></h2>
    </div>
    <div class="rating-display">
      <div class="rating-num">4.9</div>
      <div class="rating-right">
        <div class="rating-stars">★★★★★</div>
        <div class="rating-count">Based on 312 Reviews</div>
      </div>
    </div>
  </div>
  <div class="reviews-grid">
    <div class="review-card">
      <div class="review-head">
        <div class="review-stars">★★★★★</div>
        <div class="review-verified">✓ Verified</div>
      </div>
      <p class="review-text">"Genuinely the most comfortable pair of pants I own. The cotton dobby fabric is insane — breathable, looks elevated, feels like nothing. Wore it to work and then to a dinner the same day."</p>
      <div class="review-author"><strong>Rohan S.</strong> · Mumbai</div>
    </div>
    <div class="review-card">
      <div class="review-head">
        <div class="review-stars">★★★★★</div>
        <div class="review-verified">✓ Verified</div>
      </div>
      <p class="review-text">"The fit is exactly what it says — relaxed without looking sloppy. The stripes are woven in, not printed, which gives it a premium handmade look. Ordered in all 5 sizes, gave them as gifts."</p>
      <div class="review-author"><strong>Aditya P.</strong> · Delhi</div>
    </div>
    <div class="review-card">
      <div class="review-head">
        <div class="review-stars">★★★★★</div>
        <div class="review-verified">✓ Verified</div>
      </div>
      <p class="review-text">"Urban Monkey always delivers. The pockets are actually deep — phone, wallet, keys, all fit. The elastic waist makes it so easy. Perfect summer pants. Already on my 2nd pair."</p>
      <div class="review-author"><strong>Karan T.</strong> · Bangalore</div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section">
  <div class="sec-eyebrow">Questions</div>
  <h2 class="sec-title" style="max-width:600px;margin-bottom:40px">FAQ</h2>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">What sizes are available? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Available in S/28, M/30, L/32, XL/34, and 2XL/36. The model in images is 6 feet tall wearing L. We recommend sizing up if you prefer an even more relaxed fit.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">Is the fabric pre-washed? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Yes, the fabric is pre-washed before cutting. Minimal shrinkage expected. Machine wash cold, gentle cycle, line dry in shade for best results.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">What is the return/exchange policy? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>We offer 7-day returns and exchanges for unworn items with original tags. Size exchanges are processed within 3–5 business days. Reach out to us on Instagram or email for quick support.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">How long does shipping take? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Orders are dispatched within 24 hours. Delivery takes 3–5 business days pan-India. Free shipping on orders above ₹500. Express delivery available at extra cost.</p></div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div>
      <a data-href="#" class="footer-logo">URB<span>N</span>CO</a>
      <p class="footer-about">Indian streetwear crafted for the ones who move through the city with intention. Handwoven, made in India, built to last.</p>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">New Arrivals</a></li>
        <li><a data-href="#">Clothing</a></li>
        <li><a data-href="#">Headwear</a></li>
        <li><a data-href="#">Clearance</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Help</h4>
      <ul>
        <li><a data-href="#">Track Order</a></li>
        <li><a data-href="#">Returns</a></li>
        <li><a data-href="#">Size Guide</a></li>
        <li><a data-href="#">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Brand</h4>
      <ul>
        <li><a data-href="#">About Us</a></li>
        <li><a data-href="#">Collabs</a></li>
        <li><a data-href="#">Instagram</a></li>
        <li><a data-href="#">Careers</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 URBNCO. All rights reserved.</span>
    <span>Made in India</span>
  </div>
</footer>

<!-- STICKY ATC -->
<div class="sticky-atc" id="stickyAtc">
  <div>
    <div class="sticky-product">Marga Relaxed Pants — M/30</div>
    <div class="sticky-price">₹1,650 · Free Shipping</div>
  </div>
  <button class="sticky-btn">Add to Cart</button>
</div>

<script>
function toggleFaq(el){
  const item=el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(i=>{if(i!==item)i.classList.remove('open');});
  item.classList.toggle('open');
}

document.querySelectorAll('.size-btn:not(.sold-out)').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
  });
});

const heroEl=document.querySelector('.hero');
const stickyEl=document.getElementById('stickyAtc');
if(heroEl&&stickyEl){
  new IntersectionObserver(([e])=>{stickyEl.classList.toggle('visible',!e.isIntersecting);},{threshold:0}).observe(heroEl);
}

document.querySelectorAll('.feature-item,.review-card,.stat').forEach((el,i)=>{
  el.style.cssText+='opacity:0;transform:translateY(14px);transition:opacity .45s ease '+((i%4)*.08)+'s, transform .45s ease '+((i%4)*.08)+'s';
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='translateY(0)';}
  },{threshold:.1}).observe(el);
});
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "personal-care": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PureBody — India's First Whole-Body Deodorant Cream</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
<style>
:root{--cream:#FAF8F4;--black:#1A1A1A;--gold:#B8903A;--gold-light:#E8C97A;--gray:#6B6B6B;--border:#E8E3DA;}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--cream);color:var(--black);font-fxmily:'DM Sans',sans-serif;font-size:16px;line-height:1.6;}

/* ANNOUNCEMENT BAR */
.announcement{background:var(--black);color:var(--cream);text-align:center;padding:10px 16px;font-size:13px;letter-spacing:.08em;}
.announcement span{color:var(--gold-light);}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--cream);border-bottom:1px solid var(--border);padding:18px 60px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{font-fxmily:'Cormorant Garamond',serif;font-size:26px;font-weight:600;letter-spacing:.04em;color:var(--black);text-decoration:none;}
.nav-links{display:flex;gap:32px;list-style:none;}
.nav-links a{color:var(--black);text-decoration:none;font-size:13px;letter-spacing:.06em;opacity:.7;transition:opacity .2s;}
.nav-links a:hover{opacity:1;}
.nav-right{display:flex;align-items:center;gap:16px;}
.nav-cart{font-size:13px;letter-spacing:.04em;cursor:pointer;opacity:.7;}
.nav-cta{background:var(--black);color:var(--cream);padding:10px 24px;font-size:13px;letter-spacing:.08em;border:none;cursor:pointer;transition:background .2s;font-fxmily:'DM Sans',sans-serif;}
.nav-cta:hover{background:var(--gold);}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:88vh;}
.hero-content{display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 80px;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:#F0EBE1;padding:7px 16px;font-size:11px;letter-spacing:.12em;color:var(--gold);margin-bottom:28px;width:fit-content;text-transform:uppercase;}
.hero-title{font-fxmily:'Cormorant Garamond',serif;font-size:clamp(52px,5.5vw,80px);line-height:1.02;font-weight:400;margin-bottom:22px;}
.hero-title em{font-style:italic;color:var(--gold);}
.hero-sub{font-size:15px;color:var(--gray);line-height:1.8;max-width:400px;margin-bottom:36px;}
.hero-price{display:flex;align-items:baseline;gap:12px;margin-bottom:32px;}
.price-current{font-size:34px;font-weight:500;}
.price-original{font-size:18px;text-decoration:line-through;color:var(--gray);}
.price-badge{background:#F0F7EE;color:#2A6B2A;font-size:12px;padding:4px 12px;font-weight:500;letter-spacing:.04em;}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px;}
.btn-primary{background:var(--black);color:var(--cream);padding:16px 44px;font-size:13px;letter-spacing:.1em;border:2px solid var(--black);cursor:pointer;transition:all .25s;font-fxmily:'DM Sans',sans-serif;text-transform:uppercase;}
.btn-primary:hover{background:transparent;color:var(--black);}
.btn-outline{background:transparent;color:var(--black);padding:16px 44px;font-size:13px;letter-spacing:.1em;border:2px solid var(--black);cursor:pointer;transition:all .25s;font-fxmily:'DM Sans',sans-serif;text-transform:uppercase;}
.btn-outline:hover{background:var(--black);color:var(--cream);}
.hero-trust{display:flex;gap:20px;flex-wrap:wrap;}
.trust-item{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--gray);}
.trust-dot{width:4px;height:4px;background:var(--gold);border-radius:50%;}

.hero-image{background:#EDE8DF;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.product-mockup{display:flex;flex-direction:column;align-items:center;gap:24px;}
.jar{width:160px;height:200px;background:linear-gradient(160deg,#E8C97A22,#B8903A33);border:1px solid #B8903A55;border-radius:50% 50% 40% 40% / 20% 20% 30% 30%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;box-shadow:0 24px 60px rgba(0,0,0,.1);}
.jar-brand{font-fxmily:'Cormorant Garamond',serif;font-size:20px;color:var(--gold);letter-spacing:3px;}
.jar-sub{font-size:9px;color:#999;letter-spacing:4px;text-transform:uppercase;}
.jar-label{font-size:11px;color:var(--gray);letter-spacing:3px;text-transform:uppercase;}
.hero-img-badge{position:absolute;top:40px;right:40px;background:var(--black);color:var(--cream);padding:12px 16px;font-size:12px;letter-spacing:.06em;text-align:center;line-height:1.4;}
.hero-img-badge strong{display:block;font-size:18px;font-fxmily:'Cormorant Garamond',serif;}

/* TRUST BAR */
.trust-bar{border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:28px 80px;display:flex;}
.tbi{flex:1;display:flex;align-items:center;justify-content:center;gap:14px;padding:0 20px;border-right:1px solid var(--border);}
.tbi:last-child{border-right:none;}
.tbi-icon{font-size:24px;}
.tbi-num{font-size:19px;font-weight:500;line-height:1.1;}
.tbi-label{font-size:12px;color:var(--gray);letter-spacing:.04em;}

/* SECTIONS */
.section{padding:80px 80px;}
.sec-label{font-size:11px;letter-spacing:.15em;color:var(--gold);margin-bottom:16px;text-transform:uppercase;}
.sec-title{font-fxmily:'Cormorant Garamond',serif;font-size:clamp(36px,3.5vw,52px);font-weight:400;line-height:1.08;margin-bottom:16px;max-width:560px;}
.sec-title em{font-style:italic;color:var(--gold);}
.sec-sub{font-size:15px;color:var(--gray);max-width:480px;line-height:1.8;margin-bottom:56px;}

/* BENEFITS */
.benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border);}
.benefit-card{background:var(--cream);padding:40px 32px;transition:background .3s;}
.benefit-card:hover{background:#F5EFE6;}
.benefit-icon{font-size:26px;margin-bottom:18px;}
.benefit-title{font-size:16px;font-weight:500;margin-bottom:10px;letter-spacing:.01em;}
.benefit-text{font-size:14px;color:var(--gray);line-height:1.75;}

/* BUNDLES */
.bundles{background:#F2EDE4;padding:80px;}
.bundles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;}
.bundle-card{background:var(--cream);padding:36px 32px;border:2px solid transparent;cursor:pointer;transition:all .2s;position:relative;}
.bundle-card:hover{border-color:var(--gold);transform:translateY(-3px);}
.bundle-card.popular{border-color:var(--gold);}
.popular-tag{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--gold);color:white;font-size:10px;padding:5px 20px;letter-spacing:.12em;white-space:nowrap;text-transform:uppercase;}
.bundle-scent{font-size:11px;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:8px;}
.bundle-name{font-fxmily:'Cormorant Garamond',serif;font-size:22px;margin-bottom:4px;}
.bundle-price{font-size:30px;font-weight:500;margin-top:16px;margin-bottom:4px;}
.bundle-original{font-size:13px;text-decoration:line-through;color:var(--gray);}
.bundle-save{font-size:13px;color:#2A6B2A;font-weight:500;margin-bottom:24px;}
.bundle-features{display:flex;flex-direction:column;gap:6px;margin-bottom:28px;}
.bundle-feature{font-size:13px;color:var(--gray);display:flex;align-items:center;gap:8px;}
.bundle-feature::before{content:'✓';color:var(--gold);font-weight:600;}
.bundle-btn{width:100%;padding:14px;background:var(--black);color:var(--cream);border:none;font-size:13px;letter-spacing:.1em;cursor:pointer;font-fxmily:'DM Sans',sans-serif;transition:background .2s;text-transform:uppercase;}
.bundle-btn:hover{background:var(--gold);}
.bundle-card.popular .bundle-btn{background:var(--gold);}

/* REVIEWS */
.reviews{padding:80px;}
.reviews-top{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:52px;}
.rating-big{font-fxmily:'Cormorant Garamond',serif;font-size:80px;font-weight:300;line-height:1;color:var(--black);}
.rating-stars{font-size:18px;letter-spacing:3px;color:var(--gold);margin-bottom:4px;}
.rating-count{font-size:13px;color:var(--gray);}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.review-card{padding:32px;border:1px solid var(--border);position:relative;}
.review-stars{font-size:12px;letter-spacing:2px;color:var(--gold);margin-bottom:14px;}
.review-text{font-size:15px;line-height:1.75;margin-bottom:18px;font-style:italic;color:#333;}
.review-author{font-size:13px;color:var(--gray);}
.review-author strong{color:var(--black);}
.review-verified{display:inline-block;margin-top:6px;font-size:11px;color:var(--gold);letter-spacing:.06em;}

/* HOW TO USE */
.how-to{background:var(--black);color:var(--cream);padding:80px;}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:56px;border:1px solid rgba(255,255,255,.1);}
.step{padding:40px 32px;border-right:1px solid rgba(255,255,255,.1);}
.step:last-child{border-right:none;}
.step-num{font-fxmily:'Cormorant Garamond',serif;font-size:56px;font-weight:300;color:rgba(255,255,255,.15);line-height:1;margin-bottom:20px;}
.step-title{font-size:16px;font-weight:500;margin-bottom:10px;letter-spacing:.02em;}
.step-text{font-size:14px;color:rgba(255,255,255,.55);line-height:1.75;}

/* FAQ */
.faq-wrap{padding:80px;max-width:760px;margin:0 auto;}
.faq-head{text-align:center;margin-bottom:56px;}
.faq-item{border-bottom:1px solid var(--border);}
.faq-q{padding:22px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:16px;font-weight:400;transition:color .2s;}
.faq-q:hover{color:var(--gold);}
.faq-icon{font-size:22px;color:var(--gold);transition:transform .3s;user-select:none;line-height:1;}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease;}
.faq-a p{font-size:15px;color:var(--gray);line-height:1.8;padding-bottom:22px;}
.faq-item.open .faq-icon{transform:rotate(45deg);}
.faq-item.open .faq-a{max-height:200px;}

/* FINAL CTA */
.final-cta{background:var(--black);color:var(--cream);padding:80px;text-align:center;}
.final-cta .sec-title{color:var(--cream);max-width:100%;margin:0 auto 16px;}
.final-cta p{color:rgba(255,255,255,.6);font-size:15px;max-width:480px;margin:0 auto 40px;}
.final-cta .btn-primary{border-color:var(--gold);background:var(--gold);color:var(--black);}
.final-cta .btn-primary:hover{background:transparent;color:var(--gold);}

/* STICKY ATC */
.sticky-atc{position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--black);color:var(--cream);padding:14px 40px;display:none;align-items:center;justify-content:space-between;border-top:2px solid var(--gold);}
.sticky-atc.visible{display:flex;}
.sticky-left{display:flex;flex-direction:column;}
.sticky-name{font-size:14px;font-weight:500;}
.sticky-price{font-size:12px;color:rgba(255,255,255,.5);}
.sticky-btn{background:var(--gold);color:var(--black);border:none;padding:12px 36px;font-size:13px;letter-spacing:.1em;cursor:pointer;font-fxmily:'DM Sans',sans-serif;font-weight:600;text-transform:uppercase;}

/* FOOTER */
footer{background:#111;color:rgba(255,255,255,.5);padding:60px 80px 28px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;margin-bottom:48px;}
.footer-logo{font-fxmily:'Cormorant Garamond',serif;font-size:26px;color:#fff;margin-bottom:14px;display:block;text-decoration:none;}
.footer-about{font-size:14px;line-height:1.7;max-width:280px;}
.footer-col h4{color:rgba(255,255,255,.9);font-size:11px;letter-spacing:.12em;margin-bottom:20px;text-transform:uppercase;}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-col ul a{color:rgba(255,255,255,.5);text-decoration:none;font-size:14px;transition:color .2s;}
.footer-col ul a:hover{color:#fff;}
.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:24px;display:flex;justify-content:space-between;font-size:12px;}

/* RESPONSIVE */
@media(max-width:1024px){
  .section,.bundles,.reviews,.how-to,.final-cta,footer{padding:60px 40px;}
  nav{padding:16px 40px;}
  .hero-content{padding:60px 40px;}
  .trust-bar{padding:24px 40px;}
  .faq-wrap{padding:60px 40px;}
}
@media(max-width:768px){
  .hero{grid-template-columns:1fr;min-height:auto;}
  .hero-content{padding:48px 24px;}
  .hero-image{min-height:320px;order:-1;}
  nav{padding:14px 24px;}
  .nav-links{display:none;}
  .trust-bar{padding:16px 24px;flex-wrap:wrap;}
  .tbi{flex:0 0 50%;border-right:none;border-bottom:1px solid var(--border);padding:12px 0;}
  .tbi:nth-child(3),.tbi:nth-child(4){border-bottom:none;}
  .section,.bundles,.reviews,.final-cta,footer{padding:48px 24px;}
  .how-to{padding:48px 24px;}
  .benefits-grid{grid-template-columns:1fr;gap:0;}
  .bundles-grid{grid-template-columns:1fr;}
  .reviews-grid{grid-template-columns:1fr;}
  .steps{grid-template-columns:1fr 1fr;border:none;gap:0;}
  .step{border:1px solid rgba(255,255,255,.1);padding:28px 20px;}
  .reviews-top{flex-direction:column;gap:20px;align-items:flex-start;}
  .footer-grid{grid-template-columns:1fr 1fr;gap:32px;}
  .footer-grid>div:first-child{grid-column:1/-1;}
  .footer-bottom{flex-direction:column;gap:6px;}
  .sticky-atc{padding:12px 20px;}
  .faq-wrap{padding:48px 24px;}
}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.hero-badge{animation:fadeUp .5s ease both;}
.hero-title{animation:fadeUp .5s ease .1s both;}
.hero-sub{animation:fadeUp .5s ease .2s both;}
.hero-price{animation:fadeUp .5s ease .25s both;}
.hero-cta{animation:fadeUp .5s ease .3s both;}
.hero-trust{animation:fadeUp .5s ease .4s both;}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<div class="announcement">
  🌿 As Seen on <span>Shark Tank India</span> &nbsp;·&nbsp; Free Shipping Above ₹499 &nbsp;·&nbsp; Use code <span>FRESH10</span> for 10% Off
</div>

<nav>
  <a data-href="#" class="nav-logo">PureBody</a>
  <ul class="nav-links">
    <li><a data-href="#">Shop</a></li>
    <li><a data-href="#">Ingredients</a></li>
    <li><a data-href="#">Reviews</a></li>
    <li><a data-href="#">Our Story</a></li>
  </ul>
  <div class="nav-right">
    <span class="nav-cart">🛒 Cart (0)</span>
    <button class="nav-cta" onclick="document.getElementById('bundles').scrollIntoView({behavior:'smooth'})">Buy Now</button>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-content">
    <div class="hero-badge">★ First Time In India</div>
    <h1 class="hero-title">Stay <em>Fresh</em><br>From Head<br>to Toe</h1>
    <p class="hero-sub">India's first whole-body deodorant cream. Long-lasting odour control with natural ingredients that nourish your skin — 24 hours, every day.</p>
    <div class="hero-price">
      <span class="price-current">₹799</span>
      <span class="price-original">₹1,198</span>
      <span class="price-badge">SAVE 34%</span>
    </div>
    <div class="hero-cta">
      <button class="btn-primary" onclick="document.getElementById('bundles').scrollIntoView({behavior:'smooth'})">Shop Now</button>
      <button class="btn-outline" onclick="document.getElementById('how-it-works').scrollIntoView({behavior:'smooth'})">How It Works</button>
    </div>
    <div class="hero-trust">
      <span class="trust-item">⭐ 4.8 Rating</span>
      <span class="trust-dot"></span>
      <span class="trust-item">10,000+ Happy Customers</span>
      <span class="trust-dot"></span>
      <span class="trust-item">Dermat Tested</span>
    </div>
  </div>
  <div class="hero-image">
    <div class="product-mockup">
      <div class="jar">
        <div class="jar-brand">PureBody</div>
        <div class="jar-sub">Deodorant Cream</div>
      </div>
      <div class="jar-label">Heart Rush · Honey Oudh</div>
    </div>
    <div class="hero-img-badge">
      <strong>10,217+</strong>
      Units Sold
    </div>
  </div>
</section>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="tbi">
    <span class="tbi-icon">⭐</span>
    <div><div class="tbi-num">4,287+</div><div class="tbi-label">5-Star Reviews</div></div>
  </div>
  <div class="tbi">
    <span class="tbi-icon">📦</span>
    <div><div class="tbi-num">10,217+</div><div class="tbi-label">Units Sold</div></div>
  </div>
  <div class="tbi">
    <span class="tbi-icon">🌿</span>
    <div><div class="tbi-num">100%</div><div class="tbi-label">Natural Ingredients</div></div>
  </div>
  <div class="tbi">
    <span class="tbi-icon">🚀</span>
    <div><div class="tbi-num">Free</div><div class="tbi-label">Fast Shipping</div></div>
  </div>
</div>

<!-- BENEFITS -->
<section class="section">
  <div class="sec-label">Why PureBody</div>
  <h2 class="sec-title">Every Benefit,<br><em>Zero Compromise</em></h2>
  <p class="sec-sub">Formulated with care, tested with love. Here's what makes PureBody unlike anything you've used before.</p>
  <div class="benefits-grid">
    <div class="benefit-card">
      <div class="benefit-icon">🕐</div>
      <div class="benefit-title">All-Day Odour Control</div>
      <div class="benefit-text">Our formula eliminates odour-causing bacteria and keeps you fresh for 24+ hours. No midday reapplication, no awkward moments.</div>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">✨</div>
      <div class="benefit-title">Brightens Underarms</div>
      <div class="benefit-text">Active botanicals reduce dark spots and visibly brighten over time. Freshness that looks as good as it feels.</div>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">🌸</div>
      <div class="benefit-title">Soothes & Nourishes</div>
      <div class="benefit-text">Enriched with Aloe Vera, Vitamin E and Shea Butter. No alcohol, no parabens. Gentle on every skin type.</div>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">🧴</div>
      <div class="benefit-title">Whole-Body Use</div>
      <div class="benefit-text">Underarms, neck, inner thighs, feet — anywhere you need freshness. India's first truly head-to-toe solution.</div>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">♻️</div>
      <div class="benefit-title">Natural & Safe</div>
      <div class="benefit-text">Dermatologist-tested, cruelty-free, plant-based actives. Safe for all genders, all skin types, all year round.</div>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">🌺</div>
      <div class="benefit-title">Luxurious Fragrance</div>
      <div class="benefit-text">Two signature scents — Heart Rush (floral, fresh) and Honey Oudh (warm, oriental). Choose your mood, own your day.</div>
    </div>
  </div>
</section>

<!-- BUNDLES -->
<section class="bundles" id="bundles">
  <div class="sec-label">Buy More, Save More</div>
  <h2 class="sec-title">Choose Your <em>Bundle</em></h2>
  <div class="bundles-grid">
    <div class="bundle-card">
      <div class="bundle-scent">Heart Rush</div>
      <div class="bundle-name">Pack of 2</div>
      <div class="bundle-price">₹799</div>
      <div class="bundle-original">MRP ₹1,198</div>
      <div class="bundle-save">You save ₹399 (34% off)</div>
      <div class="bundle-features">
        <div class="bundle-feature">2 × Heart Rush Cream (30g each)</div>
        <div class="bundle-feature">Free standard shipping</div>
        <div class="bundle-feature">Extra 5% off on prepaid</div>
      </div>
      <button class="bundle-btn">Add to Cart</button>
    </div>
    <div class="bundle-card popular">
      <div class="popular-tag">Most Popular</div>
      <div class="bundle-scent">Heart Rush + Honey Oudh</div>
      <div class="bundle-name">The Combo</div>
      <div class="bundle-price">₹799</div>
      <div class="bundle-original">MRP ₹1,198</div>
      <div class="bundle-save">You save ₹399 (34% off)</div>
      <div class="bundle-features">
        <div class="bundle-feature">1 × Heart Rush + 1 × Honey Oudh</div>
        <div class="bundle-feature">Free express shipping</div>
        <div class="bundle-feature">Extra 5% off on prepaid</div>
      </div>
      <button class="bundle-btn">Add to Cart</button>
    </div>
    <div class="bundle-card">
      <div class="bundle-scent">Honey Oudh</div>
      <div class="bundle-name">Pack of 3</div>
      <div class="bundle-price">₹1,099</div>
      <div class="bundle-original">MRP ₹1,797</div>
      <div class="bundle-save">You save ₹698 (39% off)</div>
      <div class="bundle-features">
        <div class="bundle-feature">3 × Honey Oudh Cream (30g each)</div>
        <div class="bundle-feature">Free priority shipping</div>
        <div class="bundle-feature">Extra 5% off on prepaid</div>
      </div>
      <button class="bundle-btn">Add to Cart</button>
    </div>
  </div>
</section>

<!-- HOW TO USE -->
<section class="how-to" id="how-it-works">
  <div class="sec-label" style="color:var(--gold-light)">Simple Routine</div>
  <h2 class="sec-title" style="color:#fff;max-width:100%">Works in <em style="color:var(--gold-light)">4 Easy Steps</em></h2>
  <div class="steps">
    <div class="step">
      <div class="step-num">01</div>
      <div class="step-title">Cleanse</div>
      <div class="step-text">Shower and pat your skin completely dry. Best applied fresh for maximum effect.</div>
    </div>
    <div class="step">
      <div class="step-num">02</div>
      <div class="step-title">Take a Pea</div>
      <div class="step-text">Scoop a pea-sized amount. A little goes a very long way — don't over-apply.</div>
    </div>
    <div class="step">
      <div class="step-num">03</div>
      <div class="step-title">Apply & Rub</div>
      <div class="step-text">Massage gently into underarms, neck, or any desired area until fully absorbed.</div>
    </div>
    <div class="step">
      <div class="step-num">04</div>
      <div class="step-title">Stay Fresh</div>
      <div class="step-text">Go about your day with total confidence. PureBody works all day so you don't have to think about it.</div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews">
  <div class="reviews-top">
    <div>
      <div class="sec-label">Real Reviews</div>
      <h2 class="sec-title">What Our <em>Customers</em> Say</h2>
    </div>
    <div style="text-align:right">
      <div class="rating-big">4.8</div>
      <div class="rating-stars">★★★★★</div>
      <div class="rating-count">Based on 4,287 verified reviews</div>
    </div>
  </div>
  <div class="reviews-grid">
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"Best fragrance & best product. Very good if your body smells bad! I apply it near my thigh area and underarms. Works all day. I don't even use perfume anymore."</p>
      <div class="review-author"><strong>Ojasvi R.</strong> · Mumbai</div>
      <div class="review-verified">✓ Verified Buyer</div>
    </div>
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"I was skeptical but this is genuinely the first deodorant that works in India's heat. The Honey Oudh scent is divine — rich, warm, long-lasting. Ordered 3 more jars."</p>
      <div class="review-author"><strong>Priya M.</strong> · Bangalore</div>
      <div class="review-verified">✓ Verified Buyer</div>
    </div>
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"My underarms are noticeably lighter after 3 weeks. The formula is smooth, non-sticky, absorbs in seconds. On my 4th repurchase and won't stop anytime soon."</p>
      <div class="review-author"><strong>Arjun K.</strong> · Delhi</div>
      <div class="review-verified">✓ Verified Buyer</div>
    </div>
  </div>
</section>

<!-- FAQ -->
<div class="faq-wrap">
  <div class="faq-head">
    <div class="sec-label" style="text-align:center">FAQ</div>
    <h2 class="sec-title" style="text-align:center;max-width:100%">Frequently Asked <em>Questions</em></h2>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">Is PureBody safe for sensitive skin? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Yes! PureBody is dermatologist-tested, free from alcohol, parabens and sulphates. Safe for all skin types including sensitive skin. We recommend a 24-hour patch test before full application.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">Can I use it on areas other than underarms? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Absolutely — PureBody is designed for whole-body use. Apply it to underarms, neck, inner thighs, feet, and anywhere you need odour control. That's what makes it India's first whole-body deodorant.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">How long does one jar last? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Each 30g jar lasts 30–45 days with daily use since only a pea-sized amount is needed per application. The Pack of 3 typically lasts 3–4 months.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">What are the delivery timelines? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>We ship pan-India within 1–2 business days. Standard delivery takes 3–5 business days. Free shipping on all orders above ₹499. Express delivery available at checkout.</p></div>
  </div>
  <div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">Do you offer Cash on Delivery? <span class="faq-icon">+</span></div>
    <div class="faq-a"><p>Yes, COD is available across India. Get an extra 5% off on prepaid orders — applied automatically at checkout.</p></div>
  </div>
</div>

<!-- FINAL CTA -->
<section class="final-cta">
  <div class="sec-label" style="color:var(--gold-light);text-align:center">Ready to feel fresh?</div>
  <h2 class="sec-title">Your Best Smell is<br><em style="color:var(--gold-light)">One Click Away</em></h2>
  <p>Join 10,000+ Indians who've switched to PureBody. 30-day money-back guarantee. Free shipping above ₹499.</p>
  <button class="btn-primary" onclick="document.getElementById('bundles').scrollIntoView({behavior:'smooth'})">Shop Now — Save 34%</button>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div>
      <a data-href="#" class="footer-logo">PureBody</a>
      <p class="footer-about">India's first whole-body deodorant cream. Smell fresh, feel confident, every single day — naturally.</p>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">Heart Rush</a></li>
        <li><a data-href="#">Honey Oudh</a></li>
        <li><a data-href="#">Combo Packs</a></li>
        <li><a data-href="#">New Arrivals</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Help</h4>
      <ul>
        <li><a data-href="#">Track Order</a></li>
        <li><a data-href="#">Returns</a></li>
        <li><a data-href="#">FAQ</a></li>
        <li><a data-href="#">Contact Us</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a data-href="#">Our Story</a></li>
        <li><a data-href="#">Ingredients</a></li>
        <li><a data-href="#">Press</a></li>
        <li><a data-href="#">Careers</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 PureBody. All rights reserved.</span>
    <span>Made with ❤️ in India</span>
  </div>
</footer>

<!-- STICKY ATC -->
<div class="sticky-atc" id="stickyAtc">
  <div class="sticky-left">
    <span class="sticky-name">PureBody Deodorant Cream — Combo</span>
    <span class="sticky-price">₹799 · Free Shipping · Save 34%</span>
  </div>
  <button class="sticky-btn">Add to Cart</button>
</div>

<script>
function toggleFaq(el){
  const item=el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(i=>{if(i!==item){i.classList.remove('open');}});
  item.classList.toggle('open');
}

// Sticky ATC visibility
const heroEl=document.querySelector('.hero');
const stickyEl=document.getElementById('stickyAtc');
if(heroEl&&stickyEl){
  const obs=new IntersectionObserver(([e])=>{stickyEl.classList.toggle('visible',!e.isIntersecting);},{threshold:0});
  obs.observe(heroEl);
}

// Scroll reveal
document.querySelectorAll('.benefit-card,.bundle-card,.review-card,.step').forEach((el,i)=>{
  el.style.cssText+='opacity:0;transform:translateY(18px);transition:opacity .5s ease '+((i%3)*0.1)+'s, transform .5s ease '+((i%3)*0.1)+'s, border-color .3s, background .3s';
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='translateY(0)';}
  },{threshold:.1}).observe(el);
});
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "mens-fashion": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DRIP — Men's Fashion That Hits Different</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Syne:wght@400;500;600;700;800&family=Nunito:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
:root{--white:#FAFAFA;--black:#111111;--yellow:#FFB800;--mid:#F0F0F0;--gray:#888;--border:#E4E4E4;--dark-bg:#0E0E0E;}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--white);color:var(--black);font-fxmily:'Nunito',sans-serif;font-size:16px;line-height:1.6;}

/* PROMO BAR */
.promo-bar{background:var(--yellow);padding:9px 16px;overflow:hidden;}
.promo-inner{display:flex;gap:0;animation:slide 16s linear infinite;white-space:nowrap;}
.promo-item{display:inline-flex;align-items:center;gap:4px;padding:0 48px;font-fxmily:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--black);}
@keyframes slide{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--white);border-bottom:1px solid var(--border);padding:16px 60px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{font-fxmily:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--black);text-decoration:none;letter-spacing:-.01em;}
.nav-logo span{color:var(--yellow);}
.nav-links{display:flex;gap:24px;list-style:none;}
.nav-links a{color:var(--black);text-decoration:none;font-size:14px;font-weight:500;opacity:.6;transition:opacity .2s;font-fxmily:'Syne',sans-serif;letter-spacing:.02em;}
.nav-links a:hover{opacity:1;}
.nav-right{display:flex;align-items:center;gap:12px;}
.nav-search{background:var(--mid);border:none;padding:9px 16px;font-fxmily:'Nunito',sans-serif;font-size:13px;color:var(--black);cursor:pointer;border-radius:20px;}
.nav-cart{background:var(--black);color:var(--white);padding:10px 20px;font-fxmily:'Syne',sans-serif;font-size:13px;font-weight:600;letter-spacing:.06em;border:none;cursor:pointer;border-radius:2px;transition:all .2s;}
.nav-cart:hover{background:var(--yellow);color:var(--black);}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:90vh;background:var(--white);}
.hero-content{display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 80px;}
.hero-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:28px;}
.eyebrow-badge{background:var(--yellow);color:var(--black);font-fxmily:'Syne',sans-serif;font-size:11px;font-weight:700;padding:5px 14px;letter-spacing:.1em;text-transform:uppercase;}
.eyebrow-text{font-fxmily:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;color:var(--gray);text-transform:uppercase;}
.hero-title{font-fxmily:'Syne',sans-serif;font-size:clamp(52px,5.5vw,80px);font-weight:800;line-height:.95;letter-spacing:-.02em;margin-bottom:20px;}
.hero-title .highlight{color:var(--yellow);display:block;}
.hero-title .outline{-webkit-text-stroke:2px var(--black);color:transparent;display:block;}
.hero-sub{font-size:15px;color:var(--gray);line-height:1.75;max-width:400px;margin-bottom:32px;}
.hero-offers{background:var(--mid);padding:20px 24px;margin-bottom:32px;border-radius:4px;}
.hero-offers-title{font-fxmily:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--gray);text-transform:uppercase;margin-bottom:12px;}
.offer-list{display:flex;flex-direction:column;gap:8px;}
.offer-item{display:flex;align-items:center;gap:10px;font-size:13px;}
.offer-badge{background:var(--yellow);color:var(--black);font-fxmily:'Syne',sans-serif;font-size:10px;font-weight:700;padding:3px 8px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;}
.offer-text{color:var(--black);}
.offer-code{font-fxmily:'Syne',sans-serif;font-weight:700;color:var(--black);}
.hero-price{display:flex;align-items:baseline;gap:12px;margin-bottom:28px;}
.price-main{font-fxmily:'Syne',sans-serif;font-size:36px;font-weight:800;}
.price-del{font-size:18px;text-decoration:line-through;color:var(--gray);}
.price-off{background:var(--yellow);color:var(--black);font-fxmily:'Syne',sans-serif;font-size:12px;font-weight:700;padding:4px 12px;}
.hero-cta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px;}
.btn-primary{background:var(--black);color:var(--white);padding:16px 44px;font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:.08em;border:2px solid var(--black);cursor:pointer;border-radius:2px;transition:all .2s;text-transform:uppercase;}
.btn-primary:hover{background:var(--yellow);color:var(--black);border-color:var(--yellow);}
.btn-outline{background:transparent;color:var(--black);padding:16px 44px;font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:.08em;border:2px solid var(--border);cursor:pointer;border-radius:2px;transition:all .2s;text-transform:uppercase;}
.btn-outline:hover{border-color:var(--black);}
.hero-trust{display:flex;gap:20px;flex-wrap:wrap;}
.trust-chip{background:var(--mid);padding:7px 14px;font-size:12px;font-weight:600;font-fxmily:'Syne',sans-serif;color:var(--black);border-radius:20px;display:flex;align-items:center;gap:6px;}

.hero-right{background:var(--mid);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.hero-right::before{content:'DRIP';position:absolute;font-fxmily:'Syne',sans-serif;font-size:200px;font-weight:800;color:rgba(0,0,0,.04);letter-spacing:-.04em;user-select:none;white-space:nowrap;}
.product-card-hero{background:var(--white);width:65%;max-width:280px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.08);border-radius:4px;position:relative;}
.product-card-hero-img{background:linear-gradient(135deg,#F5EDD8,#F0E5C8);aspect-ratio:.75;border-radius:2px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;margin-bottom:16px;}
.card-img-text{font-fxmily:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--black);}
.card-img-sub{font-size:11px;letter-spacing:.1em;color:var(--gray);text-transform:uppercase;}
.new-arrival-badge{position:absolute;top:12px;right:12px;background:var(--yellow);color:var(--black);font-fxmily:'Syne',sans-serif;font-size:10px;font-weight:700;padding:4px 10px;letter-spacing:.08em;text-transform:uppercase;}
.card-name{font-fxmily:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px;}
.card-sub{font-size:12px;color:var(--gray);margin-bottom:12px;}
.card-price{font-fxmily:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--black);}
.card-del{font-size:14px;text-decoration:line-through;color:var(--gray);margin-left:4px;font-weight:400;}
.card-save{font-size:11px;color:#2A6B2A;font-weight:600;margin-top:2px;}

/* TRUST BAR */
.trust-bar{background:var(--black);padding:20px 60px;display:flex;justify-content:center;}
.tbi{padding:0 40px;display:flex;align-items:center;gap:10px;border-right:1px solid rgba(255,255,255,.1);}
.tbi:last-child{border-right:none;}
.tbi-icon{font-size:18px;}
.tbi-text{font-size:13px;color:rgba(255,255,255,.6);}
.tbi-text strong{color:var(--white);}

/* SECTIONS */
.section{padding:72px 60px;}
.sec-eyebrow{font-fxmily:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--yellow);text-transform:uppercase;margin-bottom:12px;background:var(--yellow);display:inline-block;padding:4px 12px;color:var(--black);}
.sec-title{font-fxmily:'Syne',sans-serif;font-size:clamp(36px,3.5vw,52px);font-weight:800;line-height:.95;letter-spacing:-.02em;margin-bottom:14px;}
.sec-body{font-size:15px;color:var(--gray);max-width:480px;line-height:1.75;margin-bottom:48px;}

/* CATEGORIES */
.categories{background:var(--mid);padding:72px 60px;}
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px;}
.cat-card{background:var(--white);padding:28px 20px;cursor:pointer;transition:all .2s;border-bottom:3px solid transparent;text-align:center;}
.cat-card:hover{border-bottom-color:var(--yellow);transform:translateY(-4px);}
.cat-card.active{border-bottom-color:var(--yellow);}
.cat-icon{font-size:36px;margin-bottom:14px;}
.cat-name{font-fxmily:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:4px;}
.cat-count{font-size:13px;color:var(--gray);}

/* PRODUCTS */
.products-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.product-card{cursor:pointer;}
.product-img{aspect-ratio:.75;background:var(--mid);border-radius:4px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:12px;transition:transform .25s;}
.product-card:hover .product-img{transform:scale(1.02);}
.product-inner-text{text-align:center;padding:16px;}
.product-inner-name{font-fxmily:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--black);}
.product-inner-sub{font-size:11px;letter-spacing:.08em;color:var(--gray);text-transform:uppercase;margin-top:4px;}
.p-tag{position:absolute;top:10px;left:10px;font-fxmily:'Syne',sans-serif;font-size:10px;font-weight:700;padding:4px 10px;letter-spacing:.08em;text-transform:uppercase;border-radius:2px;}
.p-tag.new{background:var(--yellow);color:var(--black);}
.p-tag.sale{background:var(--black);color:var(--white);}
.p-tag.trending{background:#FF5A5A;color:var(--white);}
.p-wishlist{position:absolute;top:10px;right:10px;width:30px;height:30px;background:rgba(255,255,255,.9);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;}
.p-name{font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:4px;}
.p-meta{font-size:12px;color:var(--gray);margin-bottom:8px;}
.p-price{display:flex;align-items:center;gap:8px;}
.p-price-main{font-fxmily:'Syne',sans-serif;font-size:17px;font-weight:800;}
.p-price-del{font-size:13px;text-decoration:line-through;color:var(--gray);}
.p-price-off{font-size:11px;color:#2A6B2A;font-weight:700;}

/* CASHBACK BANNER */
.cashback-banner{background:var(--yellow);padding:40px 60px;display:flex;align-items:center;justify-content:space-between;gap:40px;}
.cb-left{display:flex;align-items:center;gap:24px;}
.cb-icon{font-size:48px;}
.cb-title{font-fxmily:'Syne',sans-serif;font-size:28px;font-weight:800;margin-bottom:4px;}
.cb-sub{font-size:15px;color:rgba(0,0,0,.6);}
.cb-btn{background:var(--black);color:var(--white);padding:14px 36px;font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:.06em;border:none;cursor:pointer;text-transform:uppercase;border-radius:2px;white-space:nowrap;transition:opacity .2s;}
.cb-btn:hover{opacity:.85;}

/* REVIEWS */
.reviews{background:var(--mid);padding:72px 60px;}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.review-card{background:var(--white);padding:28px;border-radius:4px;}
.review-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
.reviewer-info{}
.reviewer-name{font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;}
.reviewer-meta{font-size:12px;color:var(--gray);}
.review-stars{color:var(--yellow);font-size:13px;letter-spacing:1px;}
.review-text{font-size:14px;color:#555;line-height:1.7;margin-bottom:14px;}
.review-product{background:var(--mid);padding:8px 12px;font-size:12px;font-weight:600;color:var(--black);border-radius:2px;display:inline-block;font-fxmily:'Syne',sans-serif;}

/* OFFERS SECTION */
.offers-section{padding:72px 60px;}
.offers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px;}
.offer-card{border:2px solid var(--border);padding:28px;transition:all .2s;cursor:pointer;}
.offer-card:hover{border-color:var(--yellow);transform:translateY(-2px);}
.offer-icon{font-size:32px;margin-bottom:14px;}
.offer-title{font-fxmily:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:6px;}
.offer-desc{font-size:14px;color:var(--gray);margin-bottom:14px;}
.offer-code-display{background:var(--mid);padding:8px 16px;font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:.12em;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:background .2s;}
.offer-code-display:hover{background:var(--yellow);}
.copy-btn{font-size:11px;color:var(--gray);}

/* FAQ */
.faq-section{padding:72px 60px;background:var(--mid);}
.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px;}
.faq-item{background:var(--white);border-radius:4px;overflow:hidden;}
.faq-q{padding:20px 24px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;transition:color .2s;}
.faq-q:hover{color:var(--yellow);background:#f9f9f9;}
.faq-icon{width:26px;height:26px;background:var(--yellow);color:var(--black);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;transition:transform .3s;}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease;}
.faq-a p{font-size:14px;color:var(--gray);line-height:1.7;padding:0 24px 20px;}
.faq-item.open .faq-icon{transform:rotate(45deg);}
.faq-item.open .faq-a{max-height:200px;}

/* STICKY ATC */
.sticky-atc{position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--white);border-top:2px solid var(--yellow);padding:12px 60px;display:none;align-items:center;justify-content:space-between;box-shadow:0 -4px 20px rgba(0,0,0,.08);}
.sticky-atc.visible{display:flex;}
.sticky-info{}
.sticky-name{font-fxmily:'Syne',sans-serif;font-size:15px;font-weight:700;}
.sticky-meta{font-size:12px;color:var(--gray);}
.sticky-right{display:flex;gap:10px;align-items:center;}
.sticky-size{background:var(--mid);border:1px solid var(--border);padding:10px 16px;font-fxmily:'Nunito',sans-serif;font-size:13px;cursor:pointer;border-radius:2px;}
.sticky-btn{background:var(--black);color:var(--white);border:none;padding:12px 36px;font-fxmily:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;border-radius:2px;transition:background .2s;text-transform:uppercase;}
.sticky-btn:hover{background:var(--yellow);color:var(--black);}

/* FOOTER */
footer{background:var(--dark-bg);color:rgba(255,255,255,.5);padding:60px 60px 28px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:52px;margin-bottom:48px;}
.footer-logo{font-fxmily:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--white);text-decoration:none;display:block;margin-bottom:14px;}
.footer-logo span{color:var(--yellow);}
.footer-about{font-size:14px;line-height:1.7;max-width:260px;}
.footer-col h4{font-fxmily:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.35);text-transform:uppercase;margin-bottom:18px;}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-col a{color:rgba(255,255,255,.5);text-decoration:none;font-size:14px;transition:color .2s;}
.footer-col a:hover{color:var(--white);}
.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:22px;display:flex;justify-content:space-between;font-size:12px;}

/* RESPONSIVE */
@media(max-width:1024px){
  .section,.categories,.reviews,.offers-section,.faq-section,footer{padding:56px 40px;}
  nav{padding:14px 40px;}
  .trust-bar{padding:18px 40px;flex-wrap:wrap;}
  .hero-content{padding:60px 40px;}
  .cashback-banner{padding:32px 40px;}
}
@media(max-width:768px){
  .hero{grid-template-columns:1fr;min-height:auto;}
  .hero-content{padding:48px 24px;order:2;}
  .hero-right{min-height:280px;order:-1;}
  nav{padding:14px 24px;}
  .nav-links{display:none;}
  .trust-bar{flex-wrap:wrap;padding:14px 24px;}
  .tbi{flex:0 0 100%;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:10px 0;}
  .section,.categories,.reviews,.offers-section,.faq-section,footer{padding:48px 24px;}
  .cat-grid{grid-template-columns:1fr 1fr;}
  .products-grid{grid-template-columns:1fr 1fr;gap:12px;}
  .reviews-grid{grid-template-columns:1fr;}
  .offers-grid{grid-template-columns:1fr;}
  .faq-grid{grid-template-columns:1fr;}
  .cashback-banner{flex-direction:column;padding:32px 24px;}
  .footer-grid{grid-template-columns:1fr 1fr;gap:28px;}
  .footer-grid>div:first-child{grid-column:1/-1;}
  .footer-bottom{flex-direction:column;gap:8px;}
  .sticky-atc{padding:12px 20px;}
  .hero-title{font-size:clamp(44px,12vw,72px);}
}

@keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.hero-eyebrow{animation:slideUp .45s ease both;}
.hero-title{animation:slideUp .45s ease .08s both;}
.hero-sub{animation:slideUp .45s ease .16s both;}
.hero-offers{animation:slideUp .45s ease .22s both;}
.hero-price{animation:slideUp .45s ease .28s both;}
.hero-cta{animation:slideUp .45s ease .34s both;}
.hero-trust{animation:slideUp .45s ease .4s both;}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>

<!-- PROMO BAR -->
<div class="promo-bar">
  <div class="promo-inner">
    <span class="promo-item">🔥 3M+ Happy Customers</span>
    <span class="promo-item">💛 61% Off on 100s of Styles</span>
    <span class="promo-item">🇮🇳 Made in India</span>
    <span class="promo-item">🚚 Free Shipping ₹499+</span>
    <span class="promo-item">💰 10% Cashback on all orders</span>
    <span class="promo-item">🔥 3M+ Happy Customers</span>
    <span class="promo-item">💛 61% Off on 100s of Styles</span>
    <span class="promo-item">🇮🇳 Made in India</span>
    <span class="promo-item">🚚 Free Shipping ₹499+</span>
    <span class="promo-item">💰 10% Cashback on all orders</span>
  </div>
</div>

<!-- NAV -->
<nav>
  <a data-href="#" class="nav-logo">DRIP<span>.</span></a>
  <ul class="nav-links">
    <li><a data-href="#">Topwear</a></li>
    <li><a data-href="#">Bottomwear</a></li>
    <li><a data-href="#">Combos</a></li>
    <li><a data-href="#">New Arrivals</a></li>
  </ul>
  <div class="nav-right">
    <button class="nav-search">🔍 Search</button>
    <button class="nav-cart">Cart (0)</button>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-content">
    <div class="hero-eyebrow">
      <span class="eyebrow-badge">New Drop</span>
      <span class="eyebrow-text">Off White Corduroy Collection</span>
    </div>
    <h1 class="hero-title">
      Look<br>
      <span class="highlight">Sharp.</span>
      <span class="outline">Save Big.</span>
    </h1>
    <p class="hero-sub">Premium men's fashion at prices that make sense. Corduroy shirts, cargo pants, oversized tees — everything you need, all Made in India.</p>
    <div class="hero-offers">
      <div class="hero-offers-title">Today's Best Deals</div>
      <div class="offer-list">
        <div class="offer-item"><span class="offer-badge">10% Cash</span><span class="offer-text">Earn on every order — auto-applied</span></div>
        <div class="offer-item"><span class="offer-badge">Flat 5% Off</span><span class="offer-text">On ₹1999+ orders · Code <span class="offer-code">BYNG5</span></span></div>
        <div class="offer-item"><span class="offer-badge">Flat 10% Off</span><span class="offer-text">On ₹2999+ orders · Code <span class="offer-code">BYNG10</span></span></div>
      </div>
    </div>
    <div class="hero-price">
      <span class="price-main">₹899</span>
      <span class="price-del">₹2,299</span>
      <span class="price-off">61% OFF</span>
    </div>
    <div class="hero-cta">
      <button class="btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Shop Now</button>
      <button class="btn-outline">View All</button>
    </div>
    <div class="hero-trust">
      <span class="trust-chip">⭐ 4.5 Rated</span>
      <span class="trust-chip">🇮🇳 Made in India</span>
      <span class="trust-chip">3M+ Customers</span>
    </div>
  </div>
  <div class="hero-right">
    <div class="product-card-hero">
      <div class="product-card-hero-img">
        <div class="card-img-text">CORDUROY</div>
        <div class="card-img-sub">Off White · Solid</div>
      </div>
      <div class="new-arrival-badge">New Drop</div>
      <div class="card-name">Off White Corduroy Shirt</div>
      <div class="card-sub">Full Sleeve · Regular Fit</div>
      <div class="card-price">₹899 <del class="card-del">₹2,299</del></div>
      <div class="card-save">You save ₹1,400 (61% off)</div>
    </div>
  </div>
</section>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="tbi"><span class="tbi-icon">👨</span><span class="tbi-text"><strong>3M+</strong> Happy Customers</span></div>
  <div class="tbi"><span class="tbi-icon">🇮🇳</span><span class="tbi-text"><strong>Made</strong> in India</span></div>
  <div class="tbi"><span class="tbi-icon">💰</span><span class="tbi-text"><strong>10%</strong> Cashback Always</span></div>
  <div class="tbi"><span class="tbi-icon">🔄</span><span class="tbi-text"><strong>Easy</strong> Returns</span></div>
</div>

<!-- CATEGORIES -->
<section class="categories">
  <div class="sec-eyebrow">Browse</div>
  <h2 class="sec-title">Shop by Category</h2>
  <div class="cat-grid">
    <div class="cat-card active">
      <div class="cat-icon">👕</div>
      <div class="cat-name">T-Shirts</div>
      <div class="cat-count">240+ Styles</div>
    </div>
    <div class="cat-card">
      <div class="cat-icon">👔</div>
      <div class="cat-name">Shirts</div>
      <div class="cat-count">180+ Styles</div>
    </div>
    <div class="cat-card">
      <div class="cat-icon">👖</div>
      <div class="cat-name">Bottomwear</div>
      <div class="cat-count">120+ Styles</div>
    </div>
    <div class="cat-card">
      <div class="cat-icon">🎽</div>
      <div class="cat-name">Combos</div>
      <div class="cat-count">60+ Sets</div>
    </div>
  </div>
</section>

<!-- PRODUCTS -->
<section class="section" id="products">
  <div class="sec-eyebrow">New Arrivals</div>
  <h2 class="sec-title">This Week's Drops</h2>
  <div class="products-grid">
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,#F5EDD8,#EEE5CC);">
        <div class="product-inner-text">
          <div class="product-inner-name">Corduroy</div>
          <div class="product-inner-sub">Off White</div>
        </div>
        <div class="p-tag new">New</div>
        <div class="p-wishlist">♡</div>
      </div>
      <div class="p-name">Off White Corduroy Shirt</div>
      <div class="p-meta">Full Sleeve · Regular Fit</div>
      <div class="p-price"><span class="p-price-main">₹899</span><span class="p-price-del">₹2,299</span><span class="p-price-off">61% off</span></div>
    </div>
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,#E8E8E8,#D5D5D5);">
        <div class="product-inner-text">
          <div class="product-inner-name">Oversized</div>
          <div class="product-inner-sub">Stone Grey</div>
        </div>
        <div class="p-tag trending">Trending</div>
        <div class="p-wishlist">♡</div>
      </div>
      <div class="p-name">Stone Oversized Drop-Tee</div>
      <div class="p-meta">Half Sleeve · Oversized</div>
      <div class="p-price"><span class="p-price-main">₹699</span><span class="p-price-del">₹1,499</span><span class="p-price-off">53% off</span></div>
    </div>
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,#D4E8D4,#B8D8B8);">
        <div class="product-inner-text">
          <div class="product-inner-name">Cargo</div>
          <div class="product-inner-sub">Olive Green</div>
        </div>
        <div class="p-tag sale">Sale</div>
        <div class="p-wishlist">♡</div>
      </div>
      <div class="p-name">Olive 6-Pocket Cargo Pants</div>
      <div class="p-meta">Relaxed Fit · Solid</div>
      <div class="p-price"><span class="p-price-main">₹1,199</span><span class="p-price-del">₹2,799</span><span class="p-price-off">57% off</span></div>
    </div>
    <div class="product-card">
      <div class="product-img" style="background:linear-gradient(135deg,#E8D4D4,#D8B8B8);">
        <div class="product-inner-text">
          <div class="product-inner-name">Linen</div>
          <div class="product-inner-sub">Dusty Pink</div>
        </div>
        <div class="p-tag new">New</div>
        <div class="p-wishlist">♡</div>
      </div>
      <div class="p-name">Pink Solid Linen Shirt</div>
      <div class="p-meta">Half Sleeve · Regular</div>
      <div class="p-price"><span class="p-price-main">₹799</span><span class="p-price-del">₹1,999</span><span class="p-price-off">60% off</span></div>
    </div>
  </div>
</section>

<!-- CASHBACK BANNER -->
<div class="cashback-banner">
  <div class="cb-left">
    <div class="cb-icon">💰</div>
    <div>
      <div class="cb-title">Earn 10% Cashback on Every Order</div>
      <div class="cb-sub">Applied automatically — no code needed. Stackable with other offers.</div>
    </div>
  </div>
  <button class="cb-btn">Shop & Earn Now</button>
</div>

<!-- REVIEWS -->
<section class="reviews">
  <div class="sec-eyebrow">Reviews</div>
  <h2 class="sec-title">3M+ Happy Customers</h2>
  <div style="display:flex;align-items:center;gap:20px;margin-bottom:40px;">
    <div style="font-fxmily:'Syne',sans-serif;font-size:64px;font-weight:800;line-height:1;">4.5</div>
    <div>
      <div style="color:var(--yellow);font-size:22px;letter-spacing:2px;">★★★★★</div>
      <div style="font-size:13px;color:var(--gray);margin-top:4px;">Based on 50,000+ reviews</div>
    </div>
  </div>
  <div class="reviews-grid">
    <div class="review-card">
      <div class="review-head">
        <div class="reviewer-info">
          <div class="reviewer-name">Rahul S.</div>
          <div class="reviewer-meta">Delhi · L</div>
        </div>
        <div class="review-stars">★★★★★</div>
      </div>
      <p class="review-text">"The quality at this price is unbeatable. The corduroy shirt is thick, well-stitched, and looks extremely premium. Got compliments at work on day one. Ordering more colors."</p>
      <span class="review-product">Off White Corduroy Shirt</span>
    </div>
    <div class="review-card">
      <div class="review-head">
        <div class="reviewer-info">
          <div class="reviewer-name">Karan T.</div>
          <div class="reviewer-meta">Mumbai · XL</div>
        </div>
        <div class="review-stars">★★★★★</div>
      </div>
      <p class="review-text">"Fast delivery, great packaging. The fabric is premium for ₹899. The fit is perfect — not too tight, not baggy. This is my go-to brand for everyday shirts now."</p>
      <span class="review-product">Men's Casual Shirt</span>
    </div>
    <div class="review-card">
      <div class="review-head">
        <div class="reviewer-info">
          <div class="reviewer-name">Anil M.</div>
          <div class="reviewer-meta">Bangalore · M</div>
        </div>
        <div class="review-stars">★★★★☆</div>
      </div>
      <p class="review-text">"3rd purchase and still impressed. The return policy is seamless — exchanged a size issue within 2 days. Quality and customer service both are top-notch for an Indian D2C brand."</p>
      <span class="review-product">Cargo Pants</span>
    </div>
  </div>
</section>

<!-- OFFERS -->
<section class="offers-section">
  <div class="sec-eyebrow">Save More</div>
  <h2 class="sec-title">Stack the Savings</h2>
  <div class="offers-grid">
    <div class="offer-card">
      <div class="offer-icon">🤑</div>
      <div class="offer-title">10% Cashback</div>
      <div class="offer-desc">Earned on every purchase automatically. No minimum. Just shop and earn.</div>
      <div class="offer-code-display">Auto-Applied <span class="copy-btn">✓ No code needed</span></div>
    </div>
    <div class="offer-card">
      <div class="offer-icon">🛍️</div>
      <div class="offer-title">Flat 5% Off</div>
      <div class="offer-desc">On cart value of ₹1,999 and above. Stackable with cashback offer.</div>
      <div class="offer-code-display">BYNG5 <span class="copy-btn">Copy Code</span></div>
    </div>
    <div class="offer-card">
      <div class="offer-icon">💸</div>
      <div class="offer-title">Flat 10% Off</div>
      <div class="offer-desc">On cart value of ₹2,999 and above. Maximum savings on big hauls.</div>
      <div class="offer-code-display">BYNG10 <span class="copy-btn">Copy Code</span></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section">
  <div class="sec-eyebrow">FAQ</div>
  <h2 class="sec-title">Got Questions?</h2>
  <div class="faq-grid">
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">How does sizing work? <div class="faq-icon">+</div></div>
      <div class="faq-a"><p>We follow standard Indian sizing (S, M, L, XL, XXL). Each product page has a detailed size chart with chest and waist measurements. When in doubt, size up.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">What is the return policy? <div class="faq-icon">+</div></div>
      <div class="faq-a"><p>7-day returns and exchanges. Items must be unworn, unwashed with original tags. Raise a request via our website and we'll handle the pickup and replacement.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">Is COD available? <div class="faq-icon">+</div></div>
      <div class="faq-a"><p>Yes! Cash on Delivery is available pan-India. Get 10% cashback on prepaid orders applied automatically at checkout.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">How fast is delivery? <div class="faq-icon">+</div></div>
      <div class="faq-a"><p>Orders are dispatched within 24–48 hours. Pan-India delivery takes 3–6 business days. Free shipping on all orders above ₹499.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">Is the fabric quality really good at this price? <div class="faq-icon">+</div></div>
      <div class="faq-a"><p>Yes! We source premium fabrics and cut out retail middlemen. That's why we can offer you ₹2,299 MRP quality at ₹899. Read our 50,000+ reviews — the quality speaks for itself.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q" onclick="toggleFaq(this)">Do you have offline stores? <div class="faq-icon">+</div></div>
      <div class="faq-a"><p>Yes! We have stores in Udaipur, Ahmedabad, Lucknow, Kota, and more cities. Visit our Store Locator page to find the nearest location to you.</p></div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div>
      <a data-href="#" class="footer-logo">DRIP<span>.</span></a>
      <p class="footer-about">Premium men's fashion built for everyday India. Best quality, honest prices, Made in India.</p>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a data-href="#">T-Shirts</a></li>
        <li><a data-href="#">Shirts</a></li>
        <li><a data-href="#">Bottomwear</a></li>
        <li><a data-href="#">Combos</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <ul>
        <li><a data-href="#">Track Order</a></li>
        <li><a data-href="#">Returns</a></li>
        <li><a data-href="#">Size Guide</a></li>
        <li><a data-href="#">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a data-href="#">About Us</a></li>
        <li><a data-href="#">Careers</a></li>
        <li><a data-href="#">Stores</a></li>
        <li><a data-href="#">Blog</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 DRIP. All rights reserved.</span>
    <span>Made in India 🇮🇳</span>
  </div>
</footer>

<!-- STICKY ATC -->
<div class="sticky-atc" id="stickyAtc">
  <div class="sticky-info">
    <div class="sticky-name">Off White Corduroy Shirt</div>
    <div class="sticky-meta">₹899 (61% off) · Free Shipping</div>
  </div>
  <div class="sticky-right">
    <label style="display:none">Form field</label><select class="sticky-size"><option>S</option><option selected>M</option><option>L</option><option>XL</option><option>XXL</option></select>
    <button class="sticky-btn">Add to Cart</button>
  </div>
</div>

<script>
function toggleFaq(el){
  const item=el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(i=>{if(i!==item)i.classList.remove('open');});
  item.classList.toggle('open');
}

document.querySelectorAll('.offer-code-display').forEach(el=>{
  el.addEventListener('click',function(){
    const code=this.textContent.split(' ')[0].trim();
    if(navigator.clipboard&&code!=='Auto-Applied'){
      navigator.clipboard.writeText(code);
      const btn=this.querySelector('.copy-btn');
      if(btn){btn.textContent='✓ Copied!';setTimeout(()=>btn.textContent='Copy Code',2000);}
    }
  });
});

const heroEl=document.querySelector('.hero');
const stickyEl=document.getElementById('stickyAtc');
if(heroEl&&stickyEl){
  new IntersectionObserver(([e])=>{stickyEl.classList.toggle('visible',!e.isIntersecting);},{threshold:0}).observe(heroEl);
}

document.querySelectorAll('.product-card,.review-card,.offer-card,.cat-card').forEach((el,i)=>{
  el.style.cssText+='opacity:0;transform:translateY(14px);transition:opacity .4s ease '+((i%4)*.07)+'s, transform .4s ease '+((i%4)*.07)+'s';
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='translateY(0)';}
  },{threshold:.1}).observe(el);
});
</script>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
  "mens-grooming": `﻿<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BRUT Co. — Men's Grooming | ConvertFlow Template</title>
<link rel="preconnect" href="https://fxts.google.com">
<link href="https://fxts.google.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
<style>
:root{--b:#080808;--b2:#141414;--b3:#1E1E1E;--cu:#B87333;--cu2:#D4956A;--cr:#F5EDE0;--sm:#888;--wh:#fff;--f1:'Space Grotesk',sans-serif;--f2:'Cormorant Garamond',serif}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-fxmily:var(--f1);background:var(--b);color:var(--cr);-webkit-font-smoothing:antialiased;overflow-x:hidden}
/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:20px 40px;position:fixed;top:0;width:100%;z-index:100;background:rgba(8,8,8,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(184,115,51,.15)}
.nav-left{display:flex;gap:28px;align-items:center}
.nav-left a{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--sm);text-decoration:none;transition:color .2s}
.nav-left a:hover{color:var(--cu)}
.nav-logo{font-fxmily:var(--f2);font-size:28px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--wh);text-decoration:none;position:absolute;left:50%;transform:translateX(-50%)}
.nav-logo span{color:var(--cu)}
.nav-right{display:flex;gap:20px;align-items:center}
.nav-right a{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--sm);text-decoration:none;transition:color .2s}
.nav-right a:hover{color:var(--cu)}
.nav-icon{color:var(--cr);cursor:pointer;transition:color .2s}
.nav-icon:hover{color:var(--cu)}
/* HERO */
.hero{min-height:100vh;display:grid;grid-template-columns:55% 45%;padding-top:80px}
.hero-left{background:var(--b);padding:80px 60px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.hero-left::before{content:'';position:absolute;right:-60px;top:0;bottom:0;width:120px;background:var(--b);transform:skewX(-6deg);z-index:1}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:28px}
.hero-eyebrow-line{width:40px;height:1px;background:var(--cu)}
.hero-eyebrow span{font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--cu)}
.hero-h1{font-fxmily:var(--f2);font-size:clamp(52px,6vw,88px);font-weight:600;line-height:1;margin-bottom:8px;color:var(--wh)}
.hero-h1 em{font-style:italic;color:var(--cu)}
.hero-sub{font-size:15px;color:var(--sm);line-height:1.8;max-width:420px;margin-bottom:44px;margin-top:20px}
.hero-btns{display:flex;gap:16px;flex-wrap:wrap;position:relative;z-index:2}
.btn-cu{display:inline-block;background:var(--cu);color:var(--b);padding:15px 36px;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;transition:all .25s;border:2px solid var(--cu)}
.btn-cu:hover{background:transparent;color:var(--cu)}
.btn-ghost{display:inline-block;border:1px solid rgba(255,255,255,.2);color:var(--cr);padding:15px 36px;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;transition:all .25s}
.btn-ghost:hover{border-color:var(--cu);color:var(--cu)}
.hero-stats{display:flex;gap:40px;margin-top:52px;padding-top:40px;border-top:1px solid rgba(255,255,255,.08);position:relative;z-index:2}
.hero-stat-n{font-fxmily:var(--f2);font-size:36px;font-weight:600;color:var(--cu);display:block}
.hero-stat-l{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--sm);display:block;margin-top:4px}
.hero-right{background:var(--b3);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-right-bg{position:absolute;inset:0;background:linear-gradient(135deg,#1a0e06 0%,#0d0d0d 60%,#1a0e06 100%)}
.hero-img-ph{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;z-index:1;position:relative}
.hero-img-ph svg{width:120px;color:var(--cu);opacity:.4}
.hero-img-ph span{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--sm)}
.hero-badge{position:absolute;bottom:40px;right:40px;background:var(--cu);color:var(--b);padding:16px 20px;text-align:center;z-index:2}
.hero-badge-n{font-fxmily:var(--f2);font-size:28px;font-weight:600;display:block}
.hero-badge-l{font-size:9px;letter-spacing:2px;text-transform:uppercase;display:block;margin-top:2px}
/* MARQUEE */
.marquee{background:var(--cu);padding:14px 0;overflow:hidden;white-space:nowrap}
.marquee-track{display:inline-flex;gap:48px;animation:marquee 20s linear infinite}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.marquee-item{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--b);display:flex;align-items:center;gap:12px}
.marquee-dot{width:4px;height:4px;background:var(--b);border-radius:50%;flex-shrink:0}
/* BENTO GRID */
.bento{padding:100px 40px;background:var(--b)}
.bento-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px}
.bento-h2{font-fxmily:var(--f2);font-size:clamp(36px,4vw,58px);font-weight:600;color:var(--wh);line-height:1.1}
.bento-h2 em{color:var(--cu);font-style:italic}
.bento-link{font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--cu);text-decoration:none;display:flex;align-items:center;gap:8px;transition:gap .2s}
.bento-link:hover{gap:16px}
.bento-grid{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto;gap:16px}
.bento-card{background:var(--b2);position:relative;overflow:hidden;display:flex;flex-direction:column;transition:transform .3s}
.bento-card:hover{transform:translateY(-4px)}
.bento-card.span-5{grid-column:span 5}
.bento-card.span-7{grid-column:span 7}
.bento-card.span-4{grid-column:span 4}
.bento-card.span-8{grid-column:span 8}
.bento-card-img{aspect-ratio:4/3;background:linear-gradient(135deg,#1a0e06,#0d0d0d);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.bento-card-img svg{width:30%;color:var(--cu);opacity:.25}
.bento-card-badge{position:absolute;top:16px;left:16px;background:var(--cu);color:var(--b);font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 12px}
.bento-card-body{padding:24px;display:flex;flex-direction:column;gap:8px;flex:1}
.bento-card-cat{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--cu)}
.bento-card-name{font-size:18px;font-weight:600;color:var(--wh);line-height:1.3}
.bento-card-price{display:flex;align-items:center;gap:12px;margin-top:auto}
.bento-card-price strong{font-fxmily:var(--f2);font-size:24px;color:var(--cu)}
.bento-card-price del{font-size:14px;color:var(--sm)}
.bento-card-save{font-size:10px;font-weight:700;color:#4ade80;letter-spacing:1px}
.bento-card-atc{margin-top:16px;background:transparent;border:1px solid rgba(255,255,255,.12);color:var(--cr);padding:12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-fxmily:var(--f1);transition:all .2s;width:100%}
.bento-card-atc:hover{background:var(--cu);border-color:var(--cu);color:var(--b)}
/* FEATURES */
.features{padding:100px 40px;background:var(--b2);border-top:1px solid rgba(255,255,255,.05)}
.feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:1400px;margin:0 auto}
.feat-left h2{font-fxmily:var(--f2);font-size:clamp(38px,4vw,60px);font-weight:600;color:var(--wh);line-height:1.1;margin-bottom:20px}
.feat-left h2 em{color:var(--cu);font-style:italic}
.feat-left p{font-size:15px;color:var(--sm);line-height:1.9;margin-bottom:36px;max-width:420px}
.feat-tag-row{display:flex;flex-wrap:wrap;gap:10px}
.feat-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(184,115,51,.1);border:1px solid rgba(184,115,51,.25);color:var(--cu);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 16px}
.feat-tag svg{width:14px}
.feat-right{display:grid;grid-template-columns:1fr 1fr;gap:2px}
.feat-block{background:var(--b3);padding:32px;display:flex;flex-direction:column;gap:16px;border-left:2px solid transparent;transition:border-color .2s}
.feat-block:hover{border-left-color:var(--cu)}
.feat-block-icon{width:40px;height:40px;background:rgba(184,115,51,.15);display:flex;align-items:center;justify-content:center;color:var(--cu)}
.feat-block-icon svg{width:20px}
.feat-block-t{font-size:14px;font-weight:700;color:var(--wh);letter-spacing:.5px}
.feat-block-s{font-size:12px;color:var(--sm);line-height:1.7}
/* PRODUCT PAGE SECTION */
.pdp-section{padding:100px 40px;background:var(--b)}
.pdp-section-hd{text-align:center;margin-bottom:70px}
.pdp-section-hd h2{font-fxmily:var(--f2);font-size:clamp(36px,4vw,58px);font-weight:600;color:var(--wh);margin-bottom:12px}
.pdp-section-hd p{font-size:15px;color:var(--sm);max-width:500px;margin:0 auto}
.pdp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:1400px;margin:0 auto}
.pdp-feature-card{background:var(--b2);padding:40px;border-top:2px solid var(--cu);display:flex;flex-direction:column;gap:12px}
.pdp-feature-icon{color:var(--cu)}
.pdp-feature-icon svg{width:28px}
.pdp-feature-t{font-size:17px;font-weight:700;color:var(--wh)}
.pdp-feature-s{font-size:13px;color:var(--sm);line-height:1.8}
/* TESTIMONIALS */
.testi{padding:100px 40px;background:var(--b2)}
.testi-hd{text-align:center;margin-bottom:70px}
.testi-hd h2{font-fxmily:var(--f2);font-size:clamp(36px,4vw,58px);font-weight:600;color:var(--wh);margin-bottom:12px}
.testi-hd p{font-size:15px;color:var(--sm)}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;max-width:1400px;margin:0 auto}
.testi-card{background:var(--b3);padding:44px;display:flex;flex-direction:column;gap:24px}
.testi-stars{color:var(--cu);font-size:18px;letter-spacing:2px}
.testi-text{font-fxmily:var(--f2);font-size:20px;font-style:italic;color:var(--cr);line-height:1.7;flex:1}
.testi-author{display:flex;align-items:center;gap:16px;padding-top:24px;border-top:1px solid rgba(255,255,255,.07)}
.testi-avatar{width:44px;height:44px;background:var(--cu);display:flex;align-items:center;justify-content:center;font-fxmily:var(--f2);font-size:18px;color:var(--b);font-weight:600;flex-shrink:0}
.testi-name{font-size:13px;font-weight:700;color:var(--wh)}
.testi-handle{font-size:11px;color:var(--sm);margin-top:2px}
/* EXTRA FEATURES */
.extra-feats{padding:100px 40px;background:var(--b)}
.extra-feats-inner{max-width:1400px;margin:0 auto}
.extra-feats h2{font-fxmily:var(--f2);font-size:clamp(36px,4vw,58px);font-weight:600;color:var(--wh);text-align:center;margin-bottom:16px}
.extra-feats>div>p{font-size:15px;color:var(--sm);text-align:center;margin-bottom:64px}
.extra-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:48px}
.extra-col h3{font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--cu);margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid rgba(184,115,51,.25)}
.extra-list{list-style:none;display:flex;flex-direction:column;gap:14px}
.extra-list li{display:flex;align-items:center;gap:12px;font-size:13px;color:var(--sm);font-weight:500}
.extra-list li::before{content:'';width:6px;height:6px;background:var(--cu);flex-shrink:0}
/* TECH STRIP */
.tech-strip{padding:100px 40px;background:linear-gradient(135deg,#1a0e06 0%,#0d0d0d 100%)}
.tech-strip-inner{max-width:1400px;margin:0 auto}
.tech-strip h2{font-fxmily:var(--f2);font-size:clamp(36px,4vw,58px);font-weight:600;color:var(--wh);margin-bottom:60px;text-align:center}
.tech-tags{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.tech-tag{background:rgba(184,115,51,.08);border:1px solid rgba(184,115,51,.2);color:var(--cr);padding:12px 24px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s;cursor:default}
.tech-tag:hover{background:var(--cu);color:var(--b);border-color:var(--cu)}
/* CTA BANNER */
.cta-banner{padding:120px 40px;background:var(--cu);text-align:center;position:relative;overflow:hidden}
.cta-banner::before{content:'BRUT';font-fxmily:var(--f2);font-size:300px;font-weight:600;color:rgba(0,0,0,.08);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);white-space:nowrap;pointer-events:none;letter-spacing:20px}
.cta-banner h2{font-fxmily:var(--f2);font-size:clamp(40px,5vw,72px);font-weight:600;color:var(--b);margin-bottom:16px;position:relative}
.cta-banner p{font-size:16px;color:rgba(0,0,0,.65);margin-bottom:44px;position:relative}
.cta-banner .btn-dark{display:inline-block;background:var(--b);color:var(--cu);padding:18px 48px;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;transition:all .25s;border:2px solid var(--b);position:relative}
.cta-banner .btn-dark:hover{background:transparent;color:var(--b);border-color:var(--b)}
/* FINAL STRIP */
.final-strip{background:var(--b2);border-top:1px solid rgba(255,255,255,.05);padding:24px 40px;overflow:hidden;white-space:nowrap}
.final-track{display:inline-flex;gap:48px;animation:marquee 25s linear infinite}
.final-item{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--sm)}
.final-item-dot{width:5px;height:5px;background:var(--cu);border-radius:50%;flex-shrink:0}
/* FOOTER */
.footer{background:var(--b);border-top:1px solid rgba(255,255,255,.05);padding:80px 40px 40px}
.footer-inner{max-width:1400px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;margin-bottom:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.07)}
.footer-brand h3{font-fxmily:var(--f2);font-size:28px;font-weight:600;color:var(--wh);letter-spacing:4px;text-transform:uppercase;margin-bottom:8px}
.footer-brand h3 span{color:var(--cu)}
.footer-brand-tag{font-fxmily:var(--f2);font-size:13px;font-style:italic;color:var(--cu);margin-bottom:20px;display:block}
.footer-brand p{font-size:13px;color:var(--sm);line-height:1.9;max-width:280px}
.footer-col h4{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--cu);margin-bottom:24px}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:12px}
.footer-col ul li a{font-size:13px;color:var(--sm);text-decoration:none;transition:color .2s}
.footer-col ul li a:hover{color:var(--cr)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-size:12px;color:var(--sm)}
.footer-payment{display:flex;gap:8px;align-items:center}
.footer-pay-badge{background:var(--b3);border:1px solid rgba(255,255,255,.08);padding:4px 12px;font-size:10px;font-weight:700;letter-spacing:1px;color:var(--sm)}
/* RESPONSIVE */
@media(max-width:1200px){.bento-card.span-5,.bento-card.span-7{grid-column:span 12}.bento-card.span-4,.bento-card.span-8{grid-column:span 6}}
@media(max-width:1024px){
  .hero{grid-template-columns:1fr;min-height:auto}
  .hero-left{padding:80px 24px 60px}
  .hero-right{min-height:50vw}
  .nav-left{display:none}
  .nav-logo{position:relative;left:auto;transform:none}
  .feat-grid{grid-template-columns:1fr;gap:48px}
  .feat-right{grid-template-columns:1fr 1fr}
  .testi-grid{grid-template-columns:1fr}
  .pdp-grid{grid-template-columns:1fr}
  .extra-cols{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr 1fr;gap:40px}
  .bento-card.span-4,.bento-card.span-8{grid-column:span 12}
}
@media(max-width:768px){
  .nav{padding:16px 20px}
  .hero-left{padding:60px 20px 48px}
  .bento,.features,.pdp-section,.testi,.extra-feats,.tech-strip,.cta-banner{padding:70px 20px}
  .footer{padding:60px 20px 30px}
  .final-strip,.footer-bottom{padding:20px}
  .feat-right{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr;gap:32px}
  .hero-stats{gap:24px}
  .bento-header{flex-direction:column;align-items:flex-start;gap:20px}
  .footer-bottom{flex-direction:column;gap:16px;text-align:center}
}
</style>
  <meta name="description" content="Store preview">
  <meta property="og:title" content="Store preview">
  <meta property="og:description" content="Store preview">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:image" content="https://example.com/image.png">
</head>
<body>
<!-- NAV -->
<nav class="nav">
  <div class="nav-left">
    <a data-href="#">Shop</a>
    <a data-href="#">Kits</a>
    <a data-href="#">About</a>
  </div>
  <a data-href="#" class="nav-logo">BRUT<span>.</span></a>
  <div class="nav-right">
    <a data-href="#">Rituals</a>
    <a data-href="#" class="nav-icon" aria-label="Search"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></a>
    <a data-href="#" class="nav-icon" aria-label="Cart"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></a>
  </div>
</nav>
<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <div class="hero-eyebrow"><div class="hero-eyebrow-line"></div><span>The Gentleman's Arsenal</span></div>
    <h1 class="hero-h1">Crafted for<br><em>Real Men.</em></h1>
    <p class="hero-sub">Premium grooming rituals engineered for performance. From precision beard oils to science-backed skincare — BRUT delivers results without the bullshit.</p>
    <div class="hero-btns">
      <a data-href="#" class="btn-cu">Shop the Range</a>
      <a data-href="#" class="btn-ghost">View Rituals</a>
    </div>
    <div class="hero-stats">
      <div><span class="hero-stat-n">40K+</span><span class="hero-stat-l">Men Grooming Daily</span></div>
      <div><span class="hero-stat-n">4.9★</span><span class="hero-stat-l">Average Rating</span></div>
      <div><span class="hero-stat-n">Zero</span><span class="hero-stat-l">Compromise Formula</span></div>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-right-bg"></div>
    <div class="hero-img-ph">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>Hero Product Shot</span>
    </div>
    <div class="hero-badge"><span class="hero-badge-n">100%</span><span class="hero-badge-l">Natural Formula</span></div>
  </div>
</section>
<!-- MARQUEE -->
<div class="marquee">
  <div class="marquee-track">
    <div class="marquee-item"><span class="marquee-dot"></span>PREMIUM SECTION LIBRARY</div>
    <div class="marquee-item"><span class="marquee-dot"></span>BLAZING FAST PERFORMANCE</div>
    <div class="marquee-item"><span class="marquee-dot"></span>ZERO CODING REQUIRED</div>
    <div class="marquee-item"><span class="marquee-dot"></span>20+ CRO FOCUSED FEATURES</div>
    <div class="marquee-item"><span class="marquee-dot"></span>MOBILE FIRST APPROACH</div>
    <div class="marquee-item"><span class="marquee-dot"></span>EASY CUSTOMISABLE DESIGN</div>
    <div class="marquee-item"><span class="marquee-dot"></span>BUILT-IN CART UPSELLS</div>
    <div class="marquee-item"><span class="marquee-dot"></span>SPIN THE WHEEL POPUP</div>
    <div class="marquee-item"><span class="marquee-dot"></span>PREMIUM SECTION LIBRARY</div>
    <div class="marquee-item"><span class="marquee-dot"></span>BLAZING FAST PERFORMANCE</div>
    <div class="marquee-item"><span class="marquee-dot"></span>ZERO CODING REQUIRED</div>
    <div class="marquee-item"><span class="marquee-dot"></span>20+ CRO FOCUSED FEATURES</div>
    <div class="marquee-item"><span class="marquee-dot"></span>MOBILE FIRST APPROACH</div>
    <div class="marquee-item"><span class="marquee-dot"></span>EASY CUSTOMISABLE DESIGN</div>
    <div class="marquee-item"><span class="marquee-dot"></span>BUILT-IN CART UPSELLS</div>
    <div class="marquee-item"><span class="marquee-dot"></span>SPIN THE WHEEL POPUP</div>
  </div>
</div>
<!-- BENTO PRODUCTS -->
<section class="bento">
  <div class="bento-header">
    <h2 class="bento-h2">The <em>Essential</em><br>Grooming Kit</h2>
    <a data-href="#" class="bento-link">Shop All Products <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
  </div>
  <div class="bento-grid">
    <div class="bento-card span-7">
      <div class="bento-card-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg><div class="bento-card-badge">Best Seller</div></div>
      <div class="bento-card-body">
        <div class="bento-card-cat">Beard Care</div>
        <div class="bento-card-name">Cedarwood & Black Pepper Beard Oil</div>
        <div class="bento-card-price"><strong>₹799</strong><del>₹1,199</del><span class="bento-card-save">33% OFF</span></div>
        <button class="bento-card-atc">Add to Arsenal</button>
      </div>
    </div>
    <div class="bento-card span-5">
      <div class="bento-card-img" style="aspect-ratio:3/4"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
      <div class="bento-card-body">
        <div class="bento-card-cat">Face Care</div>
        <div class="bento-card-name">Charcoal Deep Cleanse Face Wash</div>
        <div class="bento-card-price"><strong>₹549</strong><del>₹799</del><span class="bento-card-save">31% OFF</span></div>
        <button class="bento-card-atc">Add to Arsenal</button>
      </div>
    </div>
    <div class="bento-card span-4">
      <div class="bento-card-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg><div class="bento-card-badge">New Drop</div></div>
      <div class="bento-card-body">
        <div class="bento-card-cat">Styling</div>
        <div class="bento-card-name">Matte Clay Pomade</div>
        <div class="bento-card-price"><strong>₹449</strong></div>
        <button class="bento-card-atc">Add to Arsenal</button>
      </div>
    </div>
    <div class="bento-card span-4">
      <div class="bento-card-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <div class="bento-card-body">
        <div class="bento-card-cat">Skincare</div>
        <div class="bento-card-name">Retinol Night Recovery Cream</div>
        <div class="bento-card-price"><strong>₹899</strong><del>₹1,299</del><span class="bento-card-save">31% OFF</span></div>
        <button class="bento-card-atc">Add to Arsenal</button>
      </div>
    </div>
    <div class="bento-card span-4">
      <div class="bento-card-img"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><div class="bento-card-badge">Bundle</div></div>
      <div class="bento-card-body">
        <div class="bento-card-cat">Grooming Kit</div>
        <div class="bento-card-name">The Starter Ritual Bundle</div>
        <div class="bento-card-price"><strong>₹1,499</strong><del>₹2,199</del><span class="bento-card-save">32% OFF</span></div>
        <button class="bento-card-atc">Add to Arsenal</button>
      </div>
    </div>
  </div>
</section>
<!-- FEATURES SECTION -->
<section class="features">
  <div class="feat-grid">
    <div class="feat-left">
      <h2>Built for <em>Conversion.</em><br>Designed for <em>Growth.</em></h2>
      <p>Every section, every feature, every pixel is engineered to turn store visitors into loyal customers. No fluff. No bloat. Pure performance.</p>
      <div class="feat-tag-row">
        <div class="feat-tag"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>Blazing Fast</div>
        <div class="feat-tag"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>Mobile First</div>
        <div class="feat-tag"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>CRO Focused</div>
        <div class="feat-tag"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>Zero Apps</div>
        <div class="feat-tag"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Live Updates</div>
        <div class="feat-tag"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Shopify 2.0</div>
      </div>
    </div>
    <div class="feat-right">
      <div class="feat-block">
        <div class="feat-block-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div class="feat-block-t">Built-in Wishlists</div>
        <div class="feat-block-s">Let customers save products and return to purchase — no extra apps needed.</div>
      </div>
      <div class="feat-block">
        <div class="feat-block-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
        <div class="feat-block-t">Smart Cart Upsells</div>
        <div class="feat-block-s">Intelligent cross-sell and upsell recommendations right inside the cart drawer.</div>
      </div>
      <div class="feat-block">
        <div class="feat-block-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div class="feat-block-t">Stock Urgency Indicators</div>
        <div class="feat-block-s">Real-time low-stock alerts that create urgency and drive faster purchase decisions.</div>
      </div>
      <div class="feat-block">
        <div class="feat-block-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
        <div class="feat-block-t">Granular Customisation</div>
        <div class="feat-block-s">Block-level padding, global colour system, and 50+ settings per section — no code.</div>
      </div>
      <div class="feat-block">
        <div class="feat-block-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
        <div class="feat-block-t">Social Proof Notifications</div>
        <div class="feat-block-s">Live purchase pop-ups and review signals that build instant trust with new visitors.</div>
      </div>
      <div class="feat-block">
        <div class="feat-block-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></div>
        <div class="feat-block-t">JudgeMe Reviews Support</div>
        <div class="feat-block-s">Native integration with JudgeMe for verified reviews, star ratings, and UGC display.</div>
      </div>
    </div>
  </div>
</section>
<!-- PRODUCT PAGE FEATURES -->
<section class="pdp-section">
  <div class="pdp-section-hd">
    <h2>Product Pages That <em style="font-style:italic;color:var(--cu)">Convert</em></h2>
    <p>Every detail of the product page is engineered to reduce friction, build confidence, and trigger the add-to-cart.</p>
  </div>
  <div class="pdp-grid">
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
      <div class="pdp-feature-t">Multi-Layout Media Gallery</div>
      <div class="pdp-feature-s">Stacked, grid, or filmstrip gallery layouts. Zoom on hover, video support, and 360° view ready.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"/></svg></div>
      <div class="pdp-feature-t">Built-in Ratings & Reviews</div>
      <div class="pdp-feature-s">Star ratings, written reviews, and photo UGC — all without an external review app.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg></div>
      <div class="pdp-feature-t">Flexible Variant Pickers</div>
      <div class="pdp-feature-s">Swatch, button, dropdown, and image-linked variant pickers — fully configurable per product.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div>
      <div class="pdp-feature-t">Custom Trust Badges</div>
      <div class="pdp-feature-s">Upload your own trust icons and badges to display under the Add-to-Cart button.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg></div>
      <div class="pdp-feature-t">Product Offers Drawer</div>
      <div class="pdp-feature-s">Slide-out offers panel showing bundles, volume discounts, and gift-with-purchase deals.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
      <div class="pdp-feature-t">Real-Time Stock Indicators</div>
      <div class="pdp-feature-s">Live inventory counts with urgency messaging — "Only 3 left!" proven to boost conversions.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
      <div class="pdp-feature-t">Secure Checkout Badges</div>
      <div class="pdp-feature-s">Built-in SSL, payment method logos, and money-back guarantee badge display options.</div>
    </div>
    <div class="pdp-feature-card">
      <div class="pdp-feature-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
      <div class="pdp-feature-t">Easy Customisable Design</div>
      <div class="pdp-feature-s">Change layout, media position, section order, and colors — all from the Shopify theme editor.</div>
    </div>
  </div>
</section>
<!-- TESTIMONIALS -->
<section class="testi">
  <div class="testi-hd">
    <h2>From the <em style="font-style:italic;color:var(--cu)">Brotherhood</em></h2>
    <p>40,000+ men trust BRUT as part of their daily ritual. Here's what they're saying.</p>
  </div>
  <div class="testi-grid">
    <div class="testi-card">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">"The Cedarwood Beard Oil is the real deal. My beard has never looked this healthy — and my wife can't stop complimenting the scent."</p>
      <div class="testi-author">
        <div class="testi-avatar">A</div>
        <div><div class="testi-name">Arjun Mehta</div><div class="testi-handle">Verified Buyer · Mumbai</div></div>
      </div>
    </div>
    <div class="testi-card">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">"Finally a men's grooming brand that doesn't treat me like I don't know what I'm doing. The Starter Bundle was exactly what I needed."</p>
      <div class="testi-author">
        <div class="testi-avatar">R</div>
        <div><div class="testi-name">Rahul Singh</div><div class="testi-handle">Verified Buyer · Delhi</div></div>
      </div>
    </div>
    <div class="testi-card">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">"The Charcoal Face Wash cleared my skin in 2 weeks. No marketing BS — just results. Switched from a premium skincare brand and never looking back."</p>
      <div class="testi-author">
        <div class="testi-avatar">K</div>
        <div><div class="testi-name">Karan Verma</div><div class="testi-handle">Verified Buyer · Bangalore</div></div>
      </div>
    </div>
  </div>
</section>
<!-- EXTRA FEATURES 3 COLUMNS -->
<section class="extra-feats">
  <div class="extra-feats-inner">
    <h2>Everything You Need.<br><em style="font-style:italic;color:var(--cu)">Nothing You Don't.</em></h2>
    <div><p>The complete feature arsenal — built in, no extra apps, no monthly fees, no compromise.</p></div>
    <div class="extra-cols">
      <div>
        <h3>Smart Commerce</h3>
        <ul class="extra-list">
          <li>Smart Cart / Cross Upsells</li>
          <li>Social Proof Notifications</li>
          <li>Spin the Wheel Popup</li>
          <li>Newsletter Popup</li>
          <li>Built-in Wishlists</li>
          <li>Stock Urgency Indicators</li>
          <li>Interactive Product Cards</li>
          <li>JudgeMe Reviews Support</li>
        </ul>
      </div>
      <div>
        <h3>Revenue Boosters</h3>
        <ul class="extra-list">
          <li>Higher AOV Orders</li>
          <li>Customisable Bundles</li>
          <li>Optimised for Mobile</li>
          <li>Live Total Price Updates</li>
          <li>Automatic Codes Support</li>
          <li>Intuitive Interface</li>
          <li>One-Click Add to Cart</li>
          <li>No External App Needed</li>
        </ul>
      </div>
      <div>
        <h3>Design System</h3>
        <ul class="extra-list">
          <li>Colour &amp; Font Controls</li>
          <li>One-Click Dark / Light Mode</li>
          <li>Block Level Paddings</li>
          <li>Shopify 2.0 Architecture</li>
          <li>Granular Customisation</li>
          <li>Global Colour System</li>
          <li>Flexible Section Layouts</li>
          <li>Beginner Friendly to Use</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<!-- TECH TAGS -->
<section class="tech-strip">
  <div class="tech-strip-inner">
    <h2>Premium D2C. <em style="font-style:italic;color:var(--cu2)">Built Different.</em></h2>
    <div class="tech-tags">
      <div class="tech-tag">Small Taglines / Badges</div>
      <div class="tech-tag">Higher Conversion Rate</div>
      <div class="tech-tag">Optimized Product Pages</div>
      <div class="tech-tag">Built-in Conversion Sections</div>
      <div class="tech-tag">Premium D2C Look</div>
      <div class="tech-tag">Fewer Apps Needed</div>
      <div class="tech-tag">Shopify 2.0 Architecture</div>
      <div class="tech-tag">Granular Customisation</div>
      <div class="tech-tag">Global Color System</div>
      <div class="tech-tag">Flexible Section Layouts</div>
      <div class="tech-tag">Beginner Friendly</div>
      <div class="tech-tag">Mobile-First Design</div>
      <div class="tech-tag">Dark / Light Mode</div>
      <div class="tech-tag">Block Level Padding</div>
    </div>
  </div>
</section>
<!-- CTA BANNER -->
<section class="cta-banner">
  <h2>Own Your Ritual.<br>Build Your Brand.</h2>
  <p>Install BRUT Co. on your Shopify store in seconds. No dev needed.</p>
  <a data-href="#" class="btn-dark">Get This Template</a>
</section>
<!-- FINAL STRIP -->
<div class="final-strip">
  <div class="final-track">
    <div class="final-item"><span class="final-item-dot"></span>MODERN D2C SECTIONS</div>
    <div class="final-item"><span class="final-item-dot"></span>MOBILE-FIRST DESIGN</div>
    <div class="final-item"><span class="final-item-dot"></span>EASY CUSTOMISATION</div>
    <div class="final-item"><span class="final-item-dot"></span>MODERN D2C SECTIONS</div>
    <div class="final-item"><span class="final-item-dot"></span>MOBILE-FIRST DESIGN</div>
    <div class="final-item"><span class="final-item-dot"></span>EASY CUSTOMISATION</div>
    <div class="final-item"><span class="final-item-dot"></span>MODERN D2C SECTIONS</div>
    <div class="final-item"><span class="final-item-dot"></span>MOBILE-FIRST DESIGN</div>
    <div class="final-item"><span class="final-item-dot"></span>EASY CUSTOMISATION</div>
  </div>
</div>
<!-- FOOTER -->
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <h3>BRUT<span>.</span></h3>
        <span class="footer-brand-tag">For the Modern Gentleman.</span>
        <p>Premium grooming formulated for real men who demand results. Science-backed. Zero compromises. Built for the daily ritual.</p>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <ul>
          <li><a data-href="#">Beard Care</a></li>
          <li><a data-href="#">Face Care</a></li>
          <li><a data-href="#">Hair Styling</a></li>
          <li><a data-href="#">Grooming Kits</a></li>
          <li><a data-href="#">Body Care</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a data-href="#">Our Story</a></li>
          <li><a data-href="#">Ingredients</a></li>
          <li><a data-href="#">Rituals Blog</a></li>
          <li><a data-href="#">Sustainability</a></li>
          <li><a data-href="#">Press</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a data-href="#">Track Order</a></li>
          <li><a data-href="#">Returns Policy</a></li>
          <li><a data-href="#">Shipping Info</a></li>
          <li><a data-href="#">Contact Us</a></li>
          <li><a data-href="#">FAQ</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">&copy; 2025 BRUT Co. All rights reserved. A ConvertFlow Template.</div>
      <div class="footer-payment">
        <div class="footer-pay-badge">VISA</div>
        <div class="footer-pay-badge">MASTERCARD</div>
        <div class="footer-pay-badge">UPI</div>
        <div class="footer-pay-badge">COD</div>
        <div class="footer-pay-badge">EMI</div>
      </div>
    </div>
  </div>
</footer>
<label style="display:none;">Dummy Label</label></body>
</html>
`,
};
