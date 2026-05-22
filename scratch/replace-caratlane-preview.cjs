const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../app/routes/app._index.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

const newCaratLaneHTML = `const caratlanePreviewHTML = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CaratLane Store Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #333; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; display: block; }
    
    /* SHIMMER STYLES */
    .shimmer-wrapper {
      position: relative;
      background: #f5f5f5;
      overflow: hidden;
    }
    .shimmer-wrapper::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shimmer 2s infinite linear;
      z-index: 10;
    }
    @keyframes shimmer {
      100% { left: 200%; }
    }
    .img-loading { opacity: 0; transition: opacity 0.5s ease; }
    .img-loaded { opacity: 1; }
  </style>
</head>
<body>
  <!-- 1. Announcement Bar -->
  <div style="background:#f1e9ff; color:#493161; padding:10px; text-align:center; font-size:12px; font-weight:600; letter-spacing:1px;">
    ✨ Extra 20% off on Diamond Making Charges. Use code: SHINE20
  </div>

  <!-- 2. Header -->
  <div style="padding:20px 40px; border-bottom:1px solid #eee; background:#fff; position:sticky; top:0; z-index:100; display:flex; justify-content:space-between; align-items:center;">
    <div style="display:flex; gap:24px; font-size:13px; font-weight:500;">
      <span style="color:#493161; font-weight:600;">NEW ARRIVALS</span>
      <span>RINGS</span>
      <span>EARRINGS</span>
      <span>NECKLACES</span>
    </div>
    <div style="font-family:'Playfair Display', serif; font-size:32px; font-weight:700; color:#493161; letter-spacing:1px;">CaratLane</div>
    <div style="display:flex; gap:24px; color:#493161;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    </div>
  </div>

  <!-- 3. Hero -->
  <div style="background:linear-gradient(135deg,#fdfbfb,#ebedee); position:relative; overflow:hidden;">
    <div style="max-width:1320px; margin:0 auto; padding:60px 24px; display:grid; grid-template-columns:1fr 1fr; min-height:560px; align-items:center; gap:40px;">
      <div style="z-index:2;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:16px; display:block;">A TANISHQ PARTNERSHIP</span>
        <h1 style="font-family:'Playfair Display', serif; font-size:64px; font-weight:700; color:#493161; line-height:1.1; margin-bottom:24px;">Diamonds for Every Day, <i style="font-style:italic; color:#885bb5;">Every You</i></h1>
        <p style="font-size:16px; line-height:1.6; color:#555; max-width:480px; margin-bottom:40px;">Discover lightweight, everyday fine jewellery designed for the modern Indian woman. Try at home, buy with confidence.</p>
        <div style="display:flex; gap:16px;">
          <a href="#" style="display:inline-flex; align-items:center; justify-content:center; background:#493161; color:#fff; padding:14px 32px; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px; box-shadow:0 4px 12px rgba(73, 49, 97, 0.2);">Shop New Arrivals</a>
          <a href="#" style="display:inline-flex; align-items:center; justify-content:center; background:#fff; color:#493161; padding:14px 32px; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px; border:1px solid #493161;">Try at Home</a>
        </div>
      </div>
      <div style="position:relative; z-index:1;">
        <div style="position:absolute; inset:10% 0 -10% 10%; background:linear-gradient(135deg, #e0c3fc, #8ec5fc); border-radius:24px; opacity:0.3; filter:blur(40px);"></div>
        <div style="position:relative; background:#fff; border-radius:16px; padding:12px; box-shadow:0 20px 40px rgba(73, 49, 97, 0.1); transform:rotate(2deg);">
          <div class="shimmer-wrapper" style="width:100%; aspect-ratio:4/5; border-radius:8px;">
            <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="position:absolute; top:30px; left:-30px; background:#fff; padding:16px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; align-items:center; gap:12px; transform:rotate(-4deg);">
            <div style="width:40px; height:40px; background:#F6EFFB; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <div style="font-size:12px; font-weight:700; color:#493161;">Try at Home</div>
              <div style="font-size:10px; color:#666;">Free Service</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Trust Badges -->
  <div style="background:#fff; padding:40px 0; border-bottom:1px solid #eee;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">BIS Hallmarked</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">100% certified purity</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Lifetime Exchange</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">Full value exchange policy</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">15-Day Returns</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">No questions asked</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Try at Home</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">Free trial before you buy</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. Collections (Occasions) -->
  <div style="background:#fafafa; padding:80px 0;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:48px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:12px; display:block;">SHOP BY OCCASION</span>
        <h2 style="font-family:'Playfair Display', serif; font-size:40px; font-weight:700; color:#493161; margin-bottom:12px;">For Every Moment</h2>
        <p style="font-size:15px; color:#666; max-width:500px; margin:0 auto;">Find the perfect piece for work, weekends, or celebrations</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px;">
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Everyday Wear</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">200+ designs</span>
          </div>
        </div>
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Office Chic</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">120+ designs</span>
          </div>
        </div>
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Wedding Guest</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">80+ designs</span>
          </div>
        </div>
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Gifting</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">150+ designs</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Bestsellers -->
  <div style="background:#fff; padding:80px 0;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px;">
        <div>
          <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:12px; display:block;">TRENDING NOW</span>
          <h2 style="font-family:'Playfair Display', serif; font-size:36px; font-weight:700; color:#493161; margin-bottom:8px;">Bestselling Designs</h2>
          <p style="font-size:14px; color:#666;">Most loved pieces by our community</p>
        </div>
        <a href="#" style="display:inline-flex; align-items:center; gap:8px; color:#493161; font-size:14px; font-weight:600; text-decoration:none; padding-bottom:4px; border-bottom:2px solid #493161;">
          View All Bestsellers
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Elegant Diamond Ring</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹24,999</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Solitaire Stud Earrings</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹35,500</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Rose Gold Mangalsutra</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹18,999</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Classic Diamond Bracelet</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹45,000</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 7. Try at Home -->
  <div style="background:#F6EFFB; margin:40px 24px; border-radius:24px; overflow:hidden;">
    <div style="max-width:1320px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; align-items:center;">
      <div style="padding:80px 64px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:16px; display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          FREE SERVICE
        </span>
        <h2 style="font-family:'Playfair Display', serif; font-size:48px; font-weight:700; color:#493161; line-height:1.2; margin-bottom:24px;">Try at Home, Buy with Confidence</h2>
        <p style="font-size:16px; line-height:1.6; color:#555; margin-bottom:40px; max-width:480px;">Select up to 3 designs, try them in the comfort of your home, and only pay for what you love. Free delivery, free returns.</p>
        <a href="#" style="display:inline-flex; align-items:center; justify-content:center; background:#493161; color:#fff; padding:16px 36px; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px; box-shadow:0 4px 12px rgba(73, 49, 97, 0.2);">Book Free Trial</a>
      </div>
      <div class="shimmer-wrapper" style="height:100%; min-height:400px; position:relative;">
        <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;" onload="this.classList.add('img-loaded')" class="img-loading">
      </div>
    </div>
  </div>

  <!-- 8. Reviews -->
  <div style="background:#fff; padding:80px 0; border-top:1px solid #eee;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:48px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:12px; display:block;">HAPPY CUSTOMERS</span>
        <h2 style="font-family:'Playfair Display', serif; font-size:40px; font-weight:700; color:#493161; margin-bottom:12px;">What Our Community Says</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div style="background:#F6EFFB; border-radius:12px; padding:32px; display:flex; flex-direction:column;">
          <div style="color:#d1c4e9; margin-bottom:20px; display:flex; gap:4px;">★★★★★</div>
          <p style="font-size:15px; color:#493161; line-height:1.6; margin-bottom:24px; flex-grow:1;">"The Try at Home service was amazing! I could compare 3 designs side by side before choosing my dream ring."</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Aditi S.</div>
              <div style="font-size:12px; color:#885bb5;">Mumbai • Solitaire Ring</div>
            </div>
          </div>
        </div>
        <div style="background:#F6EFFB; border-radius:12px; padding:32px; display:flex; flex-direction:column;">
          <div style="color:#d1c4e9; margin-bottom:20px; display:flex; gap:4px;">★★★★★</div>
          <p style="font-size:15px; color:#493161; line-height:1.6; margin-bottom:24px; flex-grow:1;">"Perfect everyday earrings. So lightweight I forget I'm wearing them, yet I get compliments daily!"</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Riya M.</div>
              <div style="font-size:12px; color:#885bb5;">Bangalore • Diamond Hoops</div>
            </div>
          </div>
        </div>
        <div style="background:#F6EFFB; border-radius:12px; padding:32px; display:flex; flex-direction:column;">
          <div style="color:#d1c4e9; margin-bottom:20px; display:flex; gap:4px;">★★★★★</div>
          <p style="font-size:15px; color:#493161; line-height:1.6; margin-bottom:24px; flex-grow:1;">"Gifted the mangalsutra to my wife — the modern design blew her away. CaratLane nailed it."</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Vikram P.</div>
              <div style="font-size:12px; color:#885bb5;">Pune • Diamond Mangalsutra</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 9. Footer -->
  <div style="background:#493161; color:#fff; padding:60px 0 30px;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px;">
        <div>
          <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:700; color:#fff; letter-spacing:1px; margin-bottom:16px;">CaratLane</div>
          <p style="font-size:14px; color:rgba(255,255,255,0.7); line-height:1.6;">A Tanishq Partnership. Fine jewellery designed for everyday wear.</p>
        </div>
        <div>
          <h4 style="font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:16px; color:#d1c4e9;">Shop</h4>
          <ul style="list-style:none; line-height:2.2; font-size:14px; color:rgba(255,255,255,0.8);">
            <li>Rings</li><li>Earrings</li><li>Bracelets</li><li>Solitaires</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:16px; color:#d1c4e9;">Services</h4>
          <ul style="list-style:none; line-height:2.2; font-size:14px; color:rgba(255,255,255,0.8);">
            <li>Try at Home</li><li>Store Locator</li><li>Digital Gold</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:16px; color:#d1c4e9;">Support</h4>
          <ul style="list-style:none; line-height:2.2; font-size:14px; color:rgba(255,255,255,0.8);">
            <li>Contact Us</li><li>Return Policy</li><li>Track Order</li>
          </ul>
        </div>
      </div>
      <div style="text-align:center; padding-top:30px; border-top:1px solid rgba(255,255,255,0.1); font-size:13px; color:rgba(255,255,255,0.5);">
        &copy; 2026 CaratLane. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>\`;`;

const startIndex = content.indexOf('const caratlanePreviewHTML = `<!DOCTYPE html>');
if (startIndex !== -1) {
  let endIndex = content.indexOf('`;', startIndex);
  if (endIndex !== -1) {
    endIndex += 2; // include `;\n
    const newContent = content.substring(0, startIndex) + newCaratLaneHTML + content.substring(endIndex);
    fs.writeFileSync(targetPath, newContent, 'utf8');
    console.log('Successfully updated caratlanePreviewHTML in app._index.jsx');
  } else {
    console.log('Could not find end of caratlanePreviewHTML');
  }
} else {
  console.log('Could not find caratlanePreviewHTML in app._index.jsx');
}
