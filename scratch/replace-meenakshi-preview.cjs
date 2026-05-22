const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const meenakshiHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MEENAKSHI | Heritage Bridal Jewellery</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
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
  --dark-crimson: #681120;
  --rose-gold: #C89B72;
  --ivory: #F9EEF0;
  --dark: #1a0508;
  --text: #555555;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Lato', sans-serif; background: var(--ivory); color: var(--text); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, .serif { font-family: 'Cinzel', serif; }
a { text-decoration: none; color: inherit; }

/* HEADER */
.header-top { background: var(--crimson); color: var(--ivory); text-align: center; padding: 10px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
.header { background: var(--ivory); padding: 20px 60px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(200, 155, 114, 0.3); }
.brand { font-family: 'Cinzel', serif; font-size: 32px; font-weight: 600; color: var(--crimson); letter-spacing: 4px; }
.nav-links { display: flex; gap: 40px; list-style: none; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--crimson); }
.nav-links li { cursor: pointer; position: relative; }
.nav-links li:hover { color: var(--rose-gold); }
.header-icons { display: flex; gap: 24px; color: var(--crimson); }
.header-icons svg { width: 22px; height: 22px; fill: currentColor; cursor: pointer; }

/* HERO */
.hero { display: flex; min-height: 85vh; background: var(--ivory); }
.hero-content { width: 50%; padding: 80px; display: flex; flex-direction: column; justify-content: center; position: relative; }
.hero-content::before { content: ''; position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1px solid rgba(200, 155, 114, 0.3); pointer-events: none; }
.hero-eyebrow { font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose-gold); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
.hero-eyebrow::before { content: ''; width: 30px; height: 1px; background: var(--rose-gold); }
.hero h1 { font-size: 64px; font-weight: 400; color: var(--crimson); line-height: 1.15; margin-bottom: 24px; }
.hero h1 i { font-style: italic; color: var(--rose-gold); }
.hero p { font-size: 16px; line-height: 1.8; color: var(--text); max-width: 480px; margin-bottom: 48px; }
.hero-actions { display: flex; gap: 20px; }
.btn-primary { background: var(--crimson); color: var(--ivory); padding: 16px 36px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border: 1px solid var(--crimson); cursor: pointer; transition: all 0.3s; }
.btn-primary:hover { background: var(--dark-crimson); border-color: var(--dark-crimson); }
.btn-secondary { background: transparent; color: var(--crimson); padding: 16px 36px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border: 1px solid var(--rose-gold); cursor: pointer; transition: all 0.3s; }
.btn-secondary:hover { background: rgba(200, 155, 114, 0.1); }
.hero-image { width: 50%; position: relative; }
.hero-image img { width: 100%; height: 100%; object-fit: cover; }

/* CATEGORIES */
.categories { background: var(--dark); padding: 80px 60px; }
.section-header { text-align: center; margin-bottom: 60px; }
.section-eyebrow { font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose-gold); margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 16px; }
.section-eyebrow::before, .section-eyebrow::after { content: ''; width: 40px; height: 1px; background: var(--rose-gold); }
.section-header h2 { font-size: 48px; font-weight: 400; color: var(--ivory); margin-bottom: 16px; }
.section-header.light h2 { color: var(--crimson); }
.c-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.c-card { position: relative; padding-bottom: 120%; border: 1px solid rgba(200, 155, 114, 0.2); overflow: hidden; cursor: pointer; group }
.c-card img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
.c-card:hover img { transform: scale(1.05); }
.c-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,5,8,0.9) 0%, rgba(26,5,8,0) 50%); }
.c-info { position: absolute; bottom: 0; left: 0; width: 100%; padding: 24px; z-index: 2; text-align: center; }
.c-title { font-family: 'Cinzel', serif; font-size: 18px; color: var(--ivory); margin-bottom: 4px; }
.c-subtitle { font-size: 12px; color: var(--rose-gold); letter-spacing: 1px; text-transform: uppercase; }

/* COLLECTION */
.collection { padding: 100px 60px; background: var(--ivory); }
.p-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.p-card { text-align: center; cursor: pointer; }
.p-img-box { position: relative; padding-bottom: 120%; background: #fff; border: 1px solid rgba(200, 155, 114, 0.15); margin-bottom: 20px; overflow: hidden; }
.p-img-box img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 20px; transition: transform 0.5s; }
.p-card:hover .p-img-box img { transform: scale(1.05); }
.quick-view { position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: rgba(255,255,255,0.9); border-top: 1px solid rgba(200,155,114,0.2); transform: translateY(100%); transition: transform 0.3s; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--crimson); }
.p-card:hover .quick-view { transform: translateY(0); }
.p-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--crimson); margin-bottom: 8px; }
.p-price { font-size: 15px; color: var(--text); margin-bottom: 12px; }
.p-meta { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--rose-gold); }

/* CRAFT / STORY */
.craft { background: var(--dark); padding: 120px 60px; display: flex; align-items: center; gap: 80px; }
.craft-img { flex: 1; position: relative; min-height: 600px; }
.craft-img::before { content: ''; position: absolute; inset: 20px -20px -20px 20px; border: 1px solid rgba(200, 155, 114, 0.4); z-index: 1; }
.craft-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 2; border: 1px solid rgba(200, 155, 114, 0.2); }
.craft-content { flex: 1; }
.craft-content h2 { font-size: 56px; color: var(--ivory); margin: 0 0 32px 0; line-height: 1.15; }
.craft-content p { font-size: 16px; color: #A89B9E; line-height: 1.8; margin-bottom: 40px; max-width: 500px; }
.link-gold { display: inline-flex; align-items: center; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--rose-gold); border-bottom: 1px solid var(--rose-gold); padding-bottom: 6px; }

/* BRIDAL BANNER */
.bridal { background: var(--crimson); padding: 120px 60px; position: relative; text-align: center; overflow: hidden; }
.bridal::before { content: ''; position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=2000&q=80') center/cover; opacity: 0.1; mix-blend-mode: luminosity; }
.bridal-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }
.bridal h2 { font-size: 64px; color: var(--ivory); margin: 0 0 24px 0; }
.bridal p { font-size: 18px; color: var(--ivory); opacity: 0.8; line-height: 1.6; margin-bottom: 48px; }
.btn-gold { display: inline-block; padding: 18px 48px; background: var(--rose-gold); color: var(--dark); font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border: none; cursor: pointer; }

/* FOOTER */
.footer { background: var(--ivory); padding: 80px 60px 40px; border-top: 1px solid rgba(200, 155, 114, 0.2); }
.f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 60px; }
.f-brand { font-family: 'Cinzel', serif; font-size: 28px; color: var(--crimson); letter-spacing: 4px; margin-bottom: 20px; }
.f-desc { font-size: 14px; line-height: 1.6; color: var(--text); max-width: 300px; }
.f-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--crimson); margin-bottom: 24px; }
.f-links { list-style: none; }
.f-links li { margin-bottom: 12px; }
.f-links a { font-size: 14px; color: var(--text); transition: color 0.3s; }
.f-links a:hover { color: var(--rose-gold); }
.n-form { display: flex; border-bottom: 1px solid var(--crimson); padding-bottom: 10px; margin-top: 20px; }
.n-form input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Lato', sans-serif; font-size: 14px; color: var(--crimson); }
.n-form button { background: transparent; border: none; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--crimson); cursor: pointer; }
.f-bottom { text-align: center; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--text); border-top: 1px solid rgba(200, 155, 114, 0.2); padding-top: 30px; }

/* RESPONSIVE */
@media(max-width: 1024px) {
  .hero { flex-direction: column; }
  .hero-content, .hero-image { width: 100%; }
  .hero-image { height: 500px; }
  .c-grid, .p-grid { grid-template-columns: repeat(2, 1fr); }
  .craft { flex-direction: column; padding: 80px 40px; gap: 40px; }
  .craft-img { width: 100%; min-height: 400px; }
  .f-grid { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .nav-links { display: none; }
  .header { padding: 20px; }
  .hero h1 { font-size: 48px; }
  .c-grid, .p-grid { grid-template-columns: 1fr; }
  .f-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<div class="header-top">Celebrate Akshaya Tritiya with 25% off on making charges of Gold Jewellery</div>
<header class="header">
  <div class="brand">MEENAKSHI</div>
  <ul class="nav-links">
    <li>Bridal</li>
    <li>Collections</li>
    <li>High Jewellery</li>
    <li>Gifting</li>
    <li>Our Legacy</li>
  </ul>
  <div class="header-icons">
    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>
    <svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <div class="hero-eyebrow">The Royal Collection</div>
    <h1>Crafted for <i>Generations</i></h1>
    <p>Discover heirloom pieces that carry the legacy of Indian craftsmanship. Every design tells a story of royal heritage.</p>
    <div class="hero-actions">
      <button class="btn-primary">Explore Collection</button>
      <button class="btn-secondary">Book Consultation</button>
    </div>
  </div>
  <div class="hero-image">
    <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=80" alt="Bridal Jewellery" class="skeleton" onload="this.classList.remove('skeleton')">
  </div>
</section>

<section class="categories">
  <div class="section-header">
    <div class="section-eyebrow">Curated Masterpieces</div>
    <h2>Shop by Occasion</h2>
  </div>
  <div class="c-grid">
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1599643478514-4a420410d8dc?auto=format&fit=crop&w=600&q=80" alt="Bridal" class="skeleton" onload="this.classList.remove('skeleton')">
      <div class="c-info">
        <div class="c-title">Bridal Trousseau</div>
        <div class="c-subtitle">Kundan & Polki</div>
      </div>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80" alt="Festive" class="skeleton" onload="this.classList.remove('skeleton')">
      <div class="c-info">
        <div class="c-title">Festive Wear</div>
        <div class="c-subtitle">Antique Gold</div>
      </div>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1515562141207-7a8efbfc3473?auto=format&fit=crop&w=600&q=80" alt="Temple" class="skeleton" onload="this.classList.remove('skeleton')">
      <div class="c-info">
        <div class="c-title">Temple Jewellery</div>
        <div class="c-subtitle">Divine Heritage</div>
      </div>
    </div>
    <div class="c-card">
      <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" alt="Everyday" class="skeleton" onload="this.classList.remove('skeleton')">
      <div class="c-info">
        <div class="c-title">Everyday Elegance</div>
        <div class="c-subtitle">Modern Classics</div>
      </div>
    </div>
  </div>
</section>

<section class="collection">
  <div class="section-header light">
    <div class="section-eyebrow">Signature Pieces</div>
    <h2>The Heritage Collection</h2>
  </div>
  <div class="p-grid">
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1599643478514-4a420410d8dc?auto=format&fit=crop&w=600&q=80" alt="Jewellery" class="skeleton" onload="this.classList.remove('skeleton')">
        <div class="quick-view">Quick View</div>
      </div>
      <div class="p-title">Polki Diamond Choker</div>
      <div class="p-price">₹ 1,45,000</div>
      <div class="p-meta">22K Gold &bull; Handcrafted</div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80" alt="Jewellery" class="skeleton" onload="this.classList.remove('skeleton')">
        <div class="quick-view">Quick View</div>
      </div>
      <div class="p-title">Kundan Bridal Set</div>
      <div class="p-price">₹ 2,80,000</div>
      <div class="p-meta">22K Gold &bull; Handcrafted</div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1515562141207-7a8efbfc3473?auto=format&fit=crop&w=600&q=80" alt="Jewellery" class="skeleton" onload="this.classList.remove('skeleton')">
        <div class="quick-view">Quick View</div>
      </div>
      <div class="p-title">Antique Gold Jhumkas</div>
      <div class="p-price">₹ 85,000</div>
      <div class="p-meta">22K Gold &bull; Handcrafted</div>
    </div>
    <div class="p-card">
      <div class="p-img-box">
        <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" alt="Jewellery" class="skeleton" onload="this.classList.remove('skeleton')">
        <div class="quick-view">Quick View</div>
      </div>
      <div class="p-title">Temple Pendant</div>
      <div class="p-price">₹ 1,15,000</div>
      <div class="p-meta">22K Gold &bull; Handcrafted</div>
    </div>
  </div>
  <div style="text-align:center; margin-top:40px;">
    <button class="btn-secondary">View Entire Collection</button>
  </div>
</section>

<section class="craft">
  <div class="craft-img">
    <img src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80" alt="Craftsmanship" class="skeleton" onload="this.classList.remove('skeleton')">
  </div>
  <div class="craft-content">
    <div class="hero-eyebrow">Our Legacy</div>
    <h2>Six Decades of Purity & Trust</h2>
    <p>Since 1964, Meenakshi Jewellers has been the custodian of traditional Indian jewelry making. Our master karigars spend hundreds of hours on a single piece, using techniques passed down through generations.</p>
    <a href="#" class="link-gold">Read Our Story <svg style="width:16px; height:16px; margin-left:8px; fill:currentColor;" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></a>
  </div>
</section>

<section class="bridal">
  <div class="bridal-content">
    <div class="section-eyebrow" style="color:var(--ivory);">Personalized Service</div>
    <h2>Bridal Consultation</h2>
    <p>Your wedding day deserves jewellery as unique as your love story. Book a one-on-one session with our bridal stylists to curate your dream trousseau.</p>
    <button class="btn-gold">Book an Appointment</button>
  </div>
</section>

<footer class="footer">
  <div class="f-grid">
    <div>
      <div class="f-brand">MEENAKSHI</div>
      <p class="f-desc">Preserving the royal heritage of Indian jewellery making through exceptional craftsmanship since 1964.</p>
    </div>
    <div>
      <h4 class="f-title">Categories</h4>
      <ul class="f-links">
        <li><a href="#">Bridal Trousseau</a></li>
        <li><a href="#">Kundan & Polki</a></li>
        <li><a href="#">Temple Jewellery</a></li>
        <li><a href="#">Gold Coins</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Customer Care</h4>
      <ul class="f-links">
        <li><a href="#">Track Order</a></li>
        <li><a href="#">Jewellery Care</a></li>
        <li><a href="#">Returns & Exchanges</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
    </div>
    <div>
      <h4 class="f-title">Newsletter</h4>
      <p class="f-desc" style="margin-bottom:10px;">Subscribe for updates on new collections and exclusive offers.</p>
      <div class="n-form">
        <input type="email" placeholder="Email Address">
        <button>Subscribe</button>
      </div>
    </div>
  </div>
  <div class="f-bottom">
    &copy; 2026 MEENAKSHI HERITAGE JEWELLERS. ALL RIGHTS RESERVED.
  </div>
</footer>

</body>
</html>`;

const regex = /("jewellery-heritage":\s*)`[\s\S]*?`/;
const updatedContent = content.replace(regex, `$1\`${meenakshiHtml}\``);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Meenakshi template updated.');
