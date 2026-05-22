const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const fwHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SOLERA | Performance Footwear</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
}

:root {
  --bg: #0f172a;
  --surface: #1e293b;
  --text: #f8fafc;
  --muted: #94a3b8;
  --accent: #38bdf8;
  --accent-glow: rgba(56, 189, 248, 0.4);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header-top { background: var(--accent); color: var(--bg); text-align: center; padding: 12px; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
.header { background: rgba(15,23,42,0.9); backdrop-filter: blur(10px); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.1); }
.brand { font-size: 32px; font-weight: 900; letter-spacing: -2px; color: var(--text); display: flex; align-items: center; gap: 8px; }
.brand svg { width: 32px; height: 32px; fill: var(--accent); }
.nav-links { display: flex; gap: 40px; list-style: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.nav-links li { cursor: pointer; transition: color 0.3s; }
.nav-links li:hover { color: var(--accent); }
.header-icons { display: flex; gap: 24px; }
.header-icons svg { width: 24px; height: 24px; fill: var(--text); cursor: pointer; transition: fill 0.3s; }
.header-icons svg:hover { fill: var(--accent); }

/* HERO */
.hero { position: relative; min-height: 85vh; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; z-index: 1; }
.hero-bg img { width: 100%; height: 100%; object-fit: cover; opacity: 0.4; }
.hero-bg-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(15,23,42,1) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.2) 100%); }
.hero-content { position: relative; z-index: 2; padding: 40px 60px; max-width: 800px; }
.eyebrow { display: inline-block; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; position: relative; }
.eyebrow::before { content: ''; display: inline-block; width: 40px; height: 2px; background: var(--accent); vertical-align: middle; margin-right: 12px; box-shadow: 0 0 10px var(--accent-glow); }
.hero h1 { font-size: 120px; font-weight: 900; line-height: 0.9; letter-spacing: -2px; margin: 0 0 24px 0; text-transform: uppercase; text-shadow: 0 0 40px rgba(56,189,248,0.2); }
.hero p { font-size: 20px; font-weight: 500; color: #cbd5e1; line-height: 1.6; margin: 0 0 40px 0; max-width: 480px; }
.hero-actions { display: flex; gap: 16px; align-items: center; }
.btn-primary { background: var(--accent); color: var(--bg); font-size: 15px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 18px 40px; border-radius: 4px; box-shadow: 0 0 20px var(--accent-glow); cursor: pointer; border: none; transition: all 0.3s; }
.btn-primary:hover { background: var(--text); box-shadow: 0 0 30px rgba(248,250,252,0.6); transform: translateY(-2px); }
.btn-secondary { background: transparent; color: var(--text); font-size: 15px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 18px 40px; border: 2px solid rgba(248,250,252,0.2); border-radius: 4px; cursor: pointer; transition: all 0.3s; }
.btn-secondary:hover { border-color: var(--text); background: rgba(248,250,252,0.1); transform: translateY(-2px); }

/* MARQUEE */
.marquee { background: var(--accent); padding: 12px 0; overflow: hidden; display: flex; white-space: nowrap; }
.marquee-track { display: inline-block; animation: marquee 15s linear infinite; }
.marquee-text { font-size: 16px; font-weight: 900; color: var(--bg); text-transform: uppercase; padding-right: 24px; letter-spacing: 1px; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* CATEGORIES */
.categories { padding: 100px 40px; position: relative; }
.section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.section-header h2 { font-size: 64px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -1px; text-transform: uppercase; text-shadow: 0 0 20px rgba(56,189,248,0.2); }
.section-header .sub { font-size: 14px; font-weight: 800; color: var(--accent); letter-spacing: 2px; }
.c-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.c-card { position: relative; overflow: hidden; padding-bottom: 140%; border-radius: 12px; background: var(--surface); cursor: pointer; }
.c-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0.8; }
.c-card:hover img { transform: scale(1.08); opacity: 1; }
.c-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 50%, rgba(15,23,42,0.1) 100%); }
.c-title { position: absolute; bottom: 24px; left: 24px; z-index: 2; }
.c-title h3 { font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px; transition: transform 0.3s, color 0.3s; }
.c-title .explore { font-size: 12px; font-weight: 800; color: var(--accent); margin-bottom: 8px; letter-spacing: 2px; transform: translateY(10px); opacity: 0; transition: all 0.3s; }
.c-card:hover .c-title h3 { transform: translateY(-4px); color: var(--accent); }
.c-card:hover .c-title .explore { transform: translateY(0); opacity: 1; }
.c-accent { position: absolute; top: 0; right: 0; width: 40px; height: 40px; fill: var(--accent); opacity: 0; transition: opacity 0.3s; z-index: 2; }
.c-card:hover .c-accent { opacity: 1; }

/* TECHNOLOGY */
.tech { padding: 120px 40px; position: relative; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 2; }
.tech-visual { position: relative; min-height: 500px; display: flex; align-items: center; justify-content: center; }
.tech-shoe { width: 100%; max-width: 600px; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5)); transform: rotate(-15deg); position: relative; z-index: 10; animation: float 6s ease-in-out infinite; }
@keyframes float { 0% { transform: translateY(0) rotate(-15deg); } 50% { transform: translateY(-20px) rotate(-12deg); } 100% { transform: translateY(0) rotate(-15deg); } }
.tech-ring-1 { position: absolute; width: 400px; height: 400px; border-radius: 50%; border: 1px solid rgba(56,189,248,0.3); animation: pulse 4s infinite; }
.tech-ring-2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; border: 1px dashed rgba(56,189,248,0.5); animation: spin 20s linear infinite; }
@keyframes pulse { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 0.2; } 100% { transform: scale(0.95); opacity: 0.5; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.tech-content h2 { font-size: 64px; font-weight: 900; line-height: 1; letter-spacing: -1px; margin: 0 0 32px 0; text-transform: uppercase; }
.tech-content p { font-size: 18px; font-weight: 500; line-height: 1.6; color: var(--muted); margin-bottom: 40px; }
.tech-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; }
.tech-stat-val { font-size: 32px; font-weight: 900; color: var(--accent); }
.tech-stat-lbl { font-size: 12px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

/* PRODUCTS */
.products { padding: 100px 40px; }
.link-accent { font-size: 14px; font-weight: 800; color: var(--accent); text-transform: uppercase; display: flex; align-items: center; gap: 8px; transition: text-shadow 0.3s; }
.link-accent:hover { text-shadow: 0 0 10px var(--accent-glow); }
.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.p-card { background: var(--surface); border-radius: 8px; padding: 20px; transition: transform 0.3s, box-shadow 0.3s; }
.p-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.3); }
.p-img-box { background: var(--bg); border-radius: 8px; padding: 30px; position: relative; display: flex; align-items: center; justify-content: center; aspect-ratio: 1/1; margin-bottom: 20px; overflow: hidden; }
.p-img-box img { width: 100%; height: auto; object-fit: contain; transform: rotate(-15deg); transition: transform 0.5s; }
.p-card:hover .p-img-box img { transform: rotate(0deg) scale(1.1); }
.p-tag { position: absolute; top: 12px; left: 12px; background: rgba(15,23,42,0.8); color: var(--accent); font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.3); backdrop-filter: blur(4px); text-transform: uppercase; }
.p-info { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.p-title { font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase; }
.p-price { font-size: 18px; font-weight: 800; color: var(--accent); }
.p-desc { font-size: 14px; font-weight: 500; color: var(--muted); margin-bottom: 16px; }

/* REVIEWS */
.reviews { padding: 100px 40px; background: var(--surface); }
.r-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.r-card { background: var(--bg); padding: 40px; border-radius: 8px; border: 1px solid rgba(56,189,248,0.1); transition: transform 0.3s; }
.r-card:hover { transform: translateY(-5px); border-color: rgba(56,189,248,0.5); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.r-stars { display: flex; gap: 4px; margin-bottom: 24px; }
.r-stars svg { width: 20px; height: 20px; fill: var(--accent); }
.r-text { font-size: 18px; font-weight: 500; line-height: 1.6; margin-bottom: 32px; }
.r-author { display: flex; align-items: center; gap: 16px; }
.r-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--bg); }
.r-name { font-size: 14px; font-weight: 800; text-transform: uppercase; }
.r-title { font-size: 12px; font-weight: 500; color: var(--muted); }

/* FOOTER */
.footer { padding: 80px 40px 40px; border-top: 1px solid rgba(255,255,255,0.05); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 80px; }
.f-brand { font-size: 48px; font-weight: 900; letter-spacing: -2px; margin-bottom: 24px; line-height: 1; display: flex; align-items: center; gap: 12px; }
.f-brand svg { width: 40px; height: 40px; fill: var(--accent); }
.f-desc { font-size: 14px; font-weight: 500; color: var(--muted); max-width: 300px; line-height: 1.6; }
.f-title { font-size: 14px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; color: var(--accent); }
.f-links { list-style: none; }
.f-links li { margin-bottom: 12px; }
.f-links a { font-size: 14px; font-weight: 500; color: var(--muted); transition: color 0.3s; }
.f-links a:hover { color: var(--text); }
.n-form { display: flex; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 12px; margin-top: 24px; transition: border-color 0.3s; }
.n-form:focus-within { border-color: var(--accent); }
.n-form input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text); }
.n-form button { background: transparent; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 900; color: var(--accent); cursor: pointer; text-transform: uppercase; }

@media(max-width: 1024px) {
  .hero h1 { font-size: 80px; }
  .c-grid, .p-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: 1fr; }
  .r-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .hero-content { padding: 40px 20px; }
  .hero h1 { font-size: 60px; }
  .hero-actions { flex-direction: column; width: 100%; align-items: stretch; }
  .btn-primary, .btn-secondary { width: 100%; }
  .c-grid, .p-grid, .f-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<div class="header-top">FREE SHIPPING ON ORDERS OVER $100. GET 10% OFF YOUR FIRST PAIR.</div>
<header class="header">
  <div class="brand">
    <svg viewBox="0 0 24 24"><path d="M21.3,10.08l-4.14-5.32c-0.27-0.34-0.68-0.54-1.12-0.54H7.96C7.52,4.22,7.1,4.42,6.84,4.76L2.7,10.08 c-0.19,0.24-0.27,0.55-0.2,0.85c0.06,0.3,0.25,0.56,0.52,0.71l8.5,4.86c0.14,0.08,0.31,0.12,0.48,0.12s0.34-0.04,0.48-0.12 l8.5-4.86c0.26-0.15,0.45-0.41,0.52-0.71C21.57,10.63,21.49,10.33,21.3,10.08z M12,14.61L4.85,10.5l3.22-4.14h7.87l3.22,4.14 L12,14.61z M12,16c-0.18,0-0.35,0.04-0.48,0.12l-8.5,4.86C2.75,21.13,2.56,21.39,2.5,21.69c-0.06,0.3,0.01,0.61,0.2,0.85 c0.26,0.34,0.68,0.54,1.12,0.54h8.18c0.44,0,0.86-0.2,1.12-0.54l4.14-5.32c0.19-0.24,0.27-0.55,0.2-0.85 c-0.06-0.3-0.25-0.56-0.52-0.71L12.48,16.12C12.35,16.04,12.18,16,12,16z"/></svg>
    SOLERA
  </div>
  <ul class="nav-links">
    <li>New Arrivals</li>
    <li>Men</li>
    <li>Women</li>
    <li>Collections</li>
    <li>Technology</li>
  </ul>
  <div class="header-icons">
    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
  </div>
</header>

<div class="hero">
  <div class="hero-bg">
    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80" alt="Hero Background" class="skeleton" onload="this.classList.remove('skeleton')">
    <div class="hero-bg-overlay"></div>
  </div>
  <div class="hero-content">
    <div class="eyebrow">NEXT GEN PERFORMANCE</div>
    <h1>DEFT 2.0</h1>
    <p>Engineered for explosive speed and unprecedented energy return.</p>
    <div class="hero-actions">
      <button class="btn-primary">SHOP DEFT 2.0</button>
      <button class="btn-secondary">EXPLORE TECH</button>
    </div>
  </div>
</div>

<div class="marquee">
  <div class="marquee-track">
    <span class="marquee-text">BREAK YOUR RECORDS // MAXIMUM CUSHIONING // ELITE PERFORMANCE //</span>
    <span class="marquee-text">BREAK YOUR RECORDS // MAXIMUM CUSHIONING // ELITE PERFORMANCE //</span>
    <span class="marquee-text">BREAK YOUR RECORDS // MAXIMUM CUSHIONING // ELITE PERFORMANCE //</span>
  </div>
</div>

<section class="categories">
  <div class="section-header">
    <h2>Shop By Sport</h2>
    <div class="sub">[SELECT YOUR ARENA]</div>
  </div>
  <div class="c-grid">
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <svg class="c-accent" viewBox="0 0 100 100"><polygon points="100,0 100,100 0,0" /></svg>
      <div class="c-title">
        <div class="explore">EXPLORE</div>
        <h3>Running</h3>
      </div>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <svg class="c-accent" viewBox="0 0 100 100"><polygon points="100,0 100,100 0,0" /></svg>
      <div class="c-title">
        <div class="explore">EXPLORE</div>
        <h3>Training</h3>
      </div>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <svg class="c-accent" viewBox="0 0 100 100"><polygon points="100,0 100,100 0,0" /></svg>
      <div class="c-title">
        <div class="explore">EXPLORE</div>
        <h3>Lifestyle</h3>
      </div>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80" alt="Category" class="skeleton" onload="this.classList.remove('skeleton')">
      <svg class="c-accent" viewBox="0 0 100 100"><polygon points="100,0 100,100 0,0" /></svg>
      <div class="c-title">
        <div class="explore">EXPLORE</div>
        <h3>Trail</h3>
      </div>
    </div>
  </div>
</section>

<section class="tech">
  <div class="tech-grid">
    <div class="tech-visual">
      <div class="tech-ring-1"></div>
      <div class="tech-ring-2"></div>
      <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80" alt="Tech Shoe" class="tech-shoe skeleton" onload="this.classList.remove('skeleton')">
    </div>
    <div class="tech-content">
      <div class="eyebrow">SOLERA INNOVATION</div>
      <h2>AeroFoam™ Technology</h2>
      <p>Our proprietary midsole compound returns 85% of energy with every step, while the carbon-fiber plate propels you forward. Lightweight. Responsive. Unstoppable.</p>
      <div class="tech-stats">
        <div>
          <div class="tech-stat-val">85%</div>
          <div class="tech-stat-lbl">Energy Return</div>
        </div>
        <div>
          <div class="tech-stat-val">195g</div>
          <div class="tech-stat-lbl">Ultra Lightweight</div>
        </div>
      </div>
      <button class="btn-secondary" style="border-color:rgba(56,189,248,0.5); color:var(--accent);">LEARN MORE</button>
    </div>
  </div>
</section>

<section class="products">
  <div class="section-header">
    <div>
      <div class="eyebrow">LATEST DROPS</div>
      <h2>New Arrivals</h2>
    </div>
    <a href="#" class="link-accent">SHOP NEW RELEASES <svg style="width:20px; height:20px; fill:currentColor;" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="square" fill="none"/></svg></a>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Shoe" class="skeleton" onload="this.classList.remove('skeleton')">
        <div class="p-tag">NEW COLORWAY</div>
      </div>
      <div class="p-info">
        <h3 class="p-title">DEFT 2.0 / CRIMSON</h3>
        <div class="p-price">$180</div>
      </div>
      <div class="p-desc">Men's Running Shoe</div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80" alt="Shoe" class="skeleton" onload="this.classList.remove('skeleton')">
      </div>
      <div class="p-info">
        <h3 class="p-title">AERO ELITE</h3>
        <div class="p-price">$220</div>
      </div>
      <div class="p-desc">Men's Training Shoe</div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" alt="Shoe" class="skeleton" onload="this.classList.remove('skeleton')">
      </div>
      <div class="p-info">
        <h3 class="p-title">TRAIL BLAZER X</h3>
        <div class="p-price">$160</div>
      </div>
      <div class="p-desc">Trail Running Shoe</div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=600&q=80" alt="Shoe" class="skeleton" onload="this.classList.remove('skeleton')">
      </div>
      <div class="p-info">
        <h3 class="p-title">VELOCITY FLY</h3>
        <div class="p-price">$150</div>
      </div>
      <div class="p-desc">Unisex Racing Shoe</div>
    </div>
  </div>
</section>

<section class="reviews">
  <div style="text-align:center; margin-bottom:60px;">
    <h2 style="font-size: 48px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -1px; text-transform: uppercase;">ATHLETE FEEDBACK</h2>
  </div>
  <div class="r-grid">
    <div class="r-card">
      <div class="r-stars">
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <p class="r-text">"The energy return on the DEFT 2.0 shaved 30 seconds off my 5K PR. Unbelievable shoe."</p>
      <div class="r-author">
        <div class="r-avatar">S</div>
        <div>
          <div class="r-name">SARAH JENKINS</div>
          <div class="r-title">Marathoner</div>
        </div>
      </div>
    </div>
    <div class="r-card">
      <div class="r-stars">
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <p class="r-text">"Most durable training shoe I've used. Handles heavy lifts and sprints with ease."</p>
      <div class="r-author">
        <div class="r-avatar">M</div>
        <div>
          <div class="r-name">MARCUS T.</div>
          <div class="r-title">CrossFit Coach</div>
        </div>
      </div>
    </div>
    <div class="r-card">
      <div class="r-stars">
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <p class="r-text">"Finally a trail shoe that doesn't feel clunky. Grip is insane on wet rocks."</p>
      <div class="r-author">
        <div class="r-avatar">A</div>
        <div>
          <div class="r-name">ALEX CHEN</div>
          <div class="r-title">Trail Runner</div>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">
        <svg viewBox="0 0 24 24"><path d="M21.3,10.08l-4.14-5.32c-0.27-0.34-0.68-0.54-1.12-0.54H7.96C7.52,4.22,7.1,4.42,6.84,4.76L2.7,10.08 c-0.19,0.24-0.27,0.55-0.2,0.85c0.06,0.3,0.25,0.56,0.52,0.71l8.5,4.86c0.14,0.08,0.31,0.12,0.48,0.12s0.34-0.04,0.48-0.12 l8.5-4.86c0.26-0.15,0.45-0.41,0.52-0.71C21.57,10.63,21.49,10.33,21.3,10.08z M12,14.61L4.85,10.5l3.22-4.14h7.87l3.22,4.14 L12,14.61z M12,16c-0.18,0-0.35,0.04-0.48,0.12l-8.5,4.86C2.75,21.13,2.56,21.39,2.5,21.69c-0.06,0.3,0.01,0.61,0.2,0.85 c0.26,0.34,0.68,0.54,1.12,0.54h8.18c0.44,0,0.86-0.2,1.12-0.54l4.14-5.32c0.19-0.24,0.27-0.55,0.2-0.85 c-0.06-0.3-0.25-0.56-0.52-0.71L12.48,16.12C12.35,16.04,12.18,16,12,16z"/></svg>
        SOLERA
      </div>
      <p class="f-desc">Next generation athletic footwear engineered for explosive speed and unprecedented energy return.</p>
    </div>
    <div>
      <h4 class="f-title">Shop</h4>
      <ul class="f-links">
        <li><a href="#">Running</a></li>
        <li><a href="#">Training</a></li>
        <li><a href="#">Lifestyle</a></li>
        <li><a href="#">Trail</a></li>
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
      <h4 class="f-title">Join the Solera Club</h4>
      <p class="f-desc" style="margin-bottom:10px;">Get 10% off your first order, free shipping, and early access to drops.</p>
      <div class="n-form">
        <input type="email" placeholder="Email Address">
        <button>Submit</button>
      </div>
    </div>
  </div>
</footer>

</body>
</html>`;

const regex = /("footwear":\s*)`[\s\S]*?`/;
const updatedContent = content.replace(regex, `$1\`${fwHtml}\``);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('FOOTWEAR template updated.');
