const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const voltHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VŌLT | Fashion & Apparel</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
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
  --bg: #F0EDE8;
  --text: #1a1a1a;
  --accent: #1a1a1a;
  --muted: #888888;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header-top { background: var(--text); color: var(--bg); text-align: center; padding: 12px; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
.header { background: var(--bg); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; border-bottom: 2px solid var(--text); }
.brand { font-size: 36px; font-weight: 900; letter-spacing: -2px; color: var(--text); }
.nav-links { display: flex; gap: 40px; list-style: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.nav-links li { cursor: pointer; position: relative; }
.nav-links li::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 2px; background: var(--text); transform: scaleX(0); transition: transform 0.3s; transform-origin: left; }
.nav-links li:hover::after { transform: scaleX(1); }
.header-icons { display: flex; gap: 24px; }
.header-icons svg { width: 24px; height: 24px; fill: var(--text); cursor: pointer; }

/* HERO */
.hero { padding-bottom: 80px; }
.hero-container { display: flex; flex-direction: column; min-height: 85vh; padding: 24px; }
.hero-visual { flex: 1; position: relative; overflow: hidden; border: 2px solid var(--text); min-height: 60vh; }
.hero-visual img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
.hero-content { padding-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
.hero h1 { font-size: 120px; font-weight: 900; letter-spacing: -4px; line-height: 0.9; margin: 0 0 24px 0; text-transform: uppercase; max-width: 800px; }
.hero p { font-size: 16px; font-weight: 500; max-width: 400px; margin: 0; }
.hero-actions { display: flex; gap: 16px; }
.btn-primary { padding: 20px 40px; background: var(--text); color: var(--bg); font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; border: 2px solid var(--text); cursor: pointer; transition: all 0.3s; }
.btn-primary:hover { background: transparent; color: var(--text); }
.btn-secondary { padding: 20px 40px; background: transparent; color: var(--text); font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; border: 2px solid var(--text); cursor: pointer; transition: all 0.3s; }
.btn-secondary:hover { background: var(--text); color: var(--bg); }

/* MARQUEE */
.marquee { background: var(--text); padding: 16px 0; overflow: hidden; display: flex; white-space: nowrap; }
.marquee-track { display: inline-block; animation: marquee 20s linear infinite; }
.marquee-text { font-size: 24px; font-weight: 900; color: var(--bg); text-transform: uppercase; padding-right: 40px; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* SECTION HEADER */
.section-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 4px solid var(--text); padding-bottom: 16px; margin-bottom: 40px; }
.section-header h2 { font-size: 64px; font-weight: 900; line-height: 1; letter-spacing: -2px; margin: 0; text-transform: uppercase; }

/* CATEGORIES */
.categories { padding: 80px 24px; }
.c-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.c-card { position: relative; padding-bottom: 120%; border: 2px solid var(--text); overflow: hidden; cursor: pointer; }
.c-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; filter: grayscale(30%); }
.c-card:hover img { transform: scale(1.05); filter: grayscale(0%); }
.c-card::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.3); transition: background 0.3s; }
.c-card:hover::after { background: rgba(0,0,0,0.1); }
.c-card h3 { position: absolute; bottom: 20px; left: 20px; font-size: 32px; font-weight: 900; color: var(--bg); margin: 0; text-transform: uppercase; letter-spacing: -1px; z-index: 2; }

/* LOOKBOOK */
.lookbook { background: var(--text); padding: 100px 24px; color: var(--bg); }
.lookbook .section-header { border-bottom-color: var(--bg); }
.lookbook h2 { color: var(--bg); }
.lb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.lb-main { grid-column: span 2; position: relative; border: 2px solid var(--bg); min-height: 600px; overflow: hidden; }
.lb-side { display: grid; grid-template-rows: repeat(2, 1fr); gap: 20px; }
.lb-item { position: relative; border: 2px solid var(--bg); min-height: 290px; overflow: hidden; }
.lb-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(20%); }
.lb-tag { position: absolute; top: 20px; left: 20px; background: var(--bg); color: var(--text); font-size: 14px; font-weight: 900; padding: 4px 12px; }
.link-light { font-size: 14px; font-weight: 800; color: var(--bg); text-transform: uppercase; display: flex; align-items: center; gap: 8px; }

/* PRODUCTS */
.products { padding: 100px 24px; }
.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.p-card { margin-bottom: 20px; }
.p-img-box { position: relative; padding-bottom: 130%; border: 2px solid var(--text); margin-bottom: 16px; overflow: hidden; background: #e6e3dd; cursor: pointer; }
.p-img-box img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(20%); transition: transform 0.5s; }
.p-img-box:hover img { transform: scale(1.05); filter: grayscale(0%); }
.p-tag { position: absolute; top: 12px; right: 12px; background: var(--text); color: var(--bg); font-size: 12px; font-weight: 900; padding: 4px 8px; }
.p-info { display: flex; justify-content: space-between; align-items: flex-start; }
.p-title { font-size: 16px; font-weight: 900; margin: 0 0 4px 0; text-transform: uppercase; }
.p-desc { font-size: 14px; font-weight: 500; color: var(--muted); }
.p-price { font-size: 16px; font-weight: 900; }
.link-dark { font-size: 14px; font-weight: 800; color: var(--text); text-transform: uppercase; display: flex; align-items: center; gap: 8px; }

/* STORY */
.story { background: var(--text); padding: 120px 24px; color: var(--bg); }
.story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.story-img { position: relative; border: 2px solid var(--bg); min-height: 600px; overflow: hidden; }
.story-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(30%); }
.story-img .lb-tag { right: 20px; left: auto; bottom: 20px; top: auto; }
.story-content h2 { font-size: 80px; font-weight: 900; line-height: 1; letter-spacing: -2px; margin: 0 0 40px 0; text-transform: uppercase; }
.story-content p { font-size: 18px; font-weight: 500; line-height: 1.6; color: #a09e9a; margin-bottom: 40px; max-width: 500px; }

/* REVIEWS */
.reviews { padding: 100px 24px; border-top: 4px solid var(--text); }
.r-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.r-card { background: var(--text); color: var(--bg); padding: 40px; border: 2px solid var(--text); position: relative; }
.r-quote-mark { position: absolute; top: 20px; right: 20px; font-size: 64px; font-weight: 900; color: rgba(240, 237, 232, 0.2); line-height: 1; }
.r-stars { display: flex; gap: 4px; margin-bottom: 32px; }
.r-stars svg { width: 20px; height: 20px; fill: var(--bg); }
.r-text { font-size: 18px; font-weight: 500; line-height: 1.6; margin-bottom: 40px; position: relative; z-index: 2; }
.r-author { border-top: 2px solid rgba(240, 237, 232, 0.2); padding-top: 20px; font-size: 14px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }

/* FOOTER */
.footer { background: var(--text); color: var(--bg); padding: 80px 40px 40px; border-top: 4px solid var(--bg); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 80px; }
.f-brand { font-size: 48px; font-weight: 900; letter-spacing: -2px; margin-bottom: 24px; line-height: 1; }
.f-desc { font-size: 14px; font-weight: 500; color: #a09e9a; max-width: 300px; line-height: 1.6; }
.f-title { font-size: 14px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; }
.f-links { list-style: none; }
.f-links li { margin-bottom: 12px; }
.f-links a { font-size: 14px; font-weight: 500; color: #a09e9a; transition: color 0.3s; }
.f-links a:hover { color: var(--bg); }
.n-form { display: flex; border-bottom: 2px solid var(--bg); padding-bottom: 12px; margin-top: 24px; }
.n-form input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 800; color: var(--bg); text-transform: uppercase; }
.n-form button { background: transparent; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 900; color: var(--bg); cursor: pointer; }
.f-bottom { display: flex; justify-content: space-between; border-top: 2px solid rgba(240, 237, 232, 0.2); padding-top: 30px; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #a09e9a; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero h1 { font-size: 80px; }
  .c-grid, .lb-grid, .p-grid, .r-grid { grid-template-columns: repeat(2, 1fr); }
  .lb-main { grid-column: span 1; min-height: 400px; }
  .lb-side { grid-template-columns: repeat(2, 1fr); grid-template-rows: 1fr; }
  .story-grid { grid-template-columns: 1fr; gap: 40px; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .hero-content { flex-direction: column; align-items: flex-start; gap: 40px; }
  .hero h1 { font-size: 48px; }
  .hero-actions { flex-direction: column; width: 100%; }
  .section-header h2 { font-size: 40px; }
  .c-grid, .lb-grid, .p-grid, .r-grid, .f-grid { grid-template-columns: 1fr; }
  .lb-side { grid-template-columns: 1fr; }
  .f-bottom { flex-direction: column; gap: 20px; }
}
</style>
</head>
<body>

<div class="header-top">FW26 COLLECTION DROPPING NOW. FREE SHIPPING ON ALL GLOBAL ORDERS.</div>
<header class="header">
  <div class="brand">VŌLT</div>
  <ul class="nav-links">
    <li>Shop All</li>
    <li>Outerwear</li>
    <li>Essentials</li>
    <li>Lookbook</li>
    <li>Manifesto</li>
  </ul>
  <div class="header-icons">
    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg>
  </div>
</header>

<div class="hero">
  <div class="hero-container">
    <div class="hero-visual">
      <img src="https://images.unsplash.com/photo-1523398002811-999aa8d9512e?auto=format&fit=crop&w=1600&q=80" alt="Campaign" class="skeleton" onload="this.classList.remove('skeleton')">
    </div>
    <div class="hero-content">
      <div>
        <h1>Redefine the Metropolis.</h1>
        <p>Streetwear engineered for the modern dystopian landscape.</p>
      </div>
      <div class="hero-actions">
        <button class="btn-primary">Shop SS26</button>
        <button class="btn-secondary">View Lookbook</button>
      </div>
    </div>
  </div>
</div>

<div class="marquee">
  <div class="marquee-track">
    <span class="marquee-text">VŌLT WORLDWIDE / FW26 COLLECTION / TOKYO / LONDON / NEW YORK / PARIS /</span>
    <span class="marquee-text">VŌLT WORLDWIDE / FW26 COLLECTION / TOKYO / LONDON / NEW YORK / PARIS /</span>
    <span class="marquee-text">VŌLT WORLDWIDE / FW26 COLLECTION / TOKYO / LONDON / NEW YORK / PARIS /</span>
  </div>
</div>

<section class="categories">
  <div class="section-header">
    <h2>Categories</h2>
  </div>
  <div class="c-grid">
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1550614000-4b95d4ebf949?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <h3>Outerwear</h3>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <h3>Knitwear</h3>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <h3>Bottoms</h3>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <h3>Accessories</h3>
    </div>
  </div>
</section>

<section class="lookbook">
  <div class="section-header">
    <h2>The Lookbook</h2>
    <a href="#" class="link-light">Explore Archives <svg style="width:20px; height:20px; fill:currentColor;" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="square" fill="none"/></svg></a>
  </div>
  <div class="lb-grid">
    <div class="lb-main">
      <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" alt="Look" class="lb-img skeleton" onload="this.classList.remove('skeleton')">
      <div class="lb-tag">LOOK 01</div>
    </div>
    <div class="lb-side">
      <div class="lb-item">
        <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80" alt="Look" class="lb-img skeleton" onload="this.classList.remove('skeleton')">
        <div class="lb-tag">LOOK 02</div>
      </div>
      <div class="lb-item">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt="Look" class="lb-img skeleton" onload="this.classList.remove('skeleton')">
        <div class="lb-tag">LOOK 03</div>
      </div>
    </div>
  </div>
</section>

<section class="products">
  <div class="section-header">
    <h2>Latest Drops</h2>
    <a href="#" class="link-dark">View New Arrivals <svg style="width:20px; height:20px; fill:currentColor;" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="square" fill="none"/></svg></a>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1550614000-4b95d4ebf949?auto=format&fit=crop&w=600&q=80" alt="Product" class="skeleton" onload="this.classList.remove('skeleton')">
        <div class="p-tag">NEW</div>
      </div>
      <div class="p-info">
        <div>
          <h3 class="p-title">01. Technical Shell</h3>
          <div class="p-desc">FW26 / 100% NYLON</div>
        </div>
        <div class="p-price">$350</div>
      </div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80" alt="Product" class="skeleton" onload="this.classList.remove('skeleton')">
      </div>
      <div class="p-info">
        <div>
          <h3 class="p-title">02. Cargo Pant</h3>
          <div class="p-desc">FW26 / HEAVY COTTON</div>
        </div>
        <div class="p-price">$220</div>
      </div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" alt="Product" class="skeleton" onload="this.classList.remove('skeleton')">
      </div>
      <div class="p-info">
        <div>
          <h3 class="p-title">03. Knit Sweater</h3>
          <div class="p-desc">FW26 / MERINO BLEND</div>
        </div>
        <div class="p-price">$280</div>
      </div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=600&q=80" alt="Product" class="skeleton" onload="this.classList.remove('skeleton')">
      </div>
      <div class="p-info">
        <div>
          <h3 class="p-title">04. Util Vest</h3>
          <div class="p-desc">FW26 / CORDURA</div>
        </div>
        <div class="p-price">$190</div>
      </div>
    </div>
  </div>
</section>

<section class="story">
  <div class="story-grid">
    <div class="story-img">
      <img src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=800&q=80" alt="Story" class="skeleton" onload="this.classList.remove('skeleton')">
      <div class="lb-tag">ARCHIVE_01</div>
    </div>
    <div class="story-content">
      <h2>System of Dress.</h2>
      <p>VŌLT is an ongoing study in utilitarian design. We strip away the unnecessary to focus on silhouette, fabric performance, and uncompromising construction.</p>
      <a href="#" class="link-light" style="border-bottom: 2px solid var(--bg); padding-bottom: 4px; display: inline-flex;">Read the Manifesto <svg style="width:20px; height:20px; fill:currentColor;" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="square" fill="none"/></svg></a>
    </div>
  </div>
</section>

<section class="reviews">
  <div class="section-header">
    <h2>Transmissions</h2>
  </div>
  <div class="r-grid">
    <div class="r-card">
      <div class="r-quote-mark">"</div>
      <div class="r-stars">
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div class="r-text">Impeccable cut. The jacket drapes exactly how it looks in the lookbook.</div>
      <div class="r-author">HAYDEN K. / VERIFIED BUYER</div>
    </div>
    <div class="r-card">
      <div class="r-quote-mark">"</div>
      <div class="r-stars">
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div class="r-text">Materials are insane. Heavyweight cotton but still breathable.</div>
      <div class="r-author">ALEX M. / VERIFIED BUYER</div>
    </div>
    <div class="r-card">
      <div class="r-quote-mark">"</div>
      <div class="r-stars">
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div class="r-text">Next level construction. Best technical pants I own.</div>
      <div class="r-author">JORDAN T. / VERIFIED BUYER</div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">VŌLT</div>
      <p class="f-desc">Utilitarian design engineered for the modern metropolis.</p>
    </div>
    <div>
      <h4 class="f-title">Categories</h4>
      <ul class="f-links">
        <li><a href="#">Outerwear</a></li>
        <li><a href="#">Knitwear</a></li>
        <li><a href="#">Bottoms</a></li>
        <li><a href="#">Accessories</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Support</h4>
      <ul class="f-links">
        <li><a href="#">Track Order</a></li>
        <li><a href="#">Shipping</a></li>
        <li><a href="#">Returns</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Join the Syndicate</h4>
      <p class="f-desc" style="margin-bottom:10px;">Early access to drops. Private sales. No spam.</p>
      <div class="n-form">
        <input type="email" placeholder="Enter Email">
        <button>Submit</button>
      </div>
    </div>
  </div>
  <div class="f-bottom">
    <div>&copy; 2026 VŌLT WORLDWIDE.</div>
    <div style="display:flex; gap:20px;">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>
</footer>

</body>
</html>`;

const regex = /("fashion-clothing":\s*)`[\s\S]*?`/;
const updatedContent = content.replace(regex, `$1\`${voltHtml}\``);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('VOLT template updated.');
