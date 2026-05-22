const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../app/routes/app._index.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

const newTanishqHTML = `const tanishqPreviewHTML = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tanishq Store Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #FDFAF3; color: #1A0F0A; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; display: block; }
    
    /* SHIMMER STYLES */
    .shimmer-wrapper {
      position: relative;
      background: #F4E7C4;
      overflow: hidden;
    }
    .shimmer-wrapper::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(253, 250, 243, 0.4), transparent);
      animation: shimmer 2s infinite linear;
      z-index: 10;
    }
    @keyframes shimmer {
      100% { left: 200%; }
    }
    .img-loading {
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .img-loaded {
      opacity: 1;
    }
  </style>
</head>
<body>
  <!-- 1. Announcement Bar -->
  <div style="background:#8B1A2C; color:#FDFAF3; padding:12px; text-align:center; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">
    ✨ Making charges waived on select bridal collections. Shop now
  </div>

  <!-- 2. Header -->
  <div style="padding:24px; border-bottom:1px solid rgba(212, 175, 55, 0.3); background:#FDFAF3; position:sticky; top:0; z-index:100;">
    <div style="max-width:1320px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; gap:24px; font-size:12px; font-weight:500; letter-spacing:1px; text-transform:uppercase;">
        <span>Shop</span>
        <span>Gifting</span>
        <span>Golden Harvest</span>
      </div>
      <div style="font-family:'Cormorant Garamond', serif; font-size:32px; font-weight:700; color:#8B1A2C; letter-spacing:4px;">TANISHQ</div>
      <div style="display:flex; gap:24px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </div>
    </div>
  </div>

  <!-- 3. Hero -->
  <div style="position:relative; min-height:680px; background:#1A0F0A; display:flex; align-items:center; overflow:hidden; padding:80px 0;">
    <div style="position:absolute; inset:0; background:radial-gradient(circle at 80% 50%, rgba(139, 26, 44, 0.15) 0%, transparent 60%);"></div>
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; width:100%; display:grid; grid-template-columns:1.2fr 0.8fr; gap:64px; align-items:center; position:relative; z-index:2;">
      <div style="border-left:2px solid #D4AF37; padding-left:40px;">
        <span style="color:#D4AF37; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; display:block;">A TATA PRODUCT</span>
        <h1 style="font-family:'Cormorant Garamond', serif; font-size:64px; font-weight:600; line-height:1.05; color:#FDFAF3; margin-bottom:28px;">Draped in <span style="color:#D4AF37; font-style:italic;">Heritage</span> & Elegance</h1>
        <p style="font-size:16px; color:rgba(253, 250, 243, 0.7); margin-bottom:44px; max-width:540px; line-height:1.8;">Exquisite gold, diamond, and kundan jewelry handcrafted by India’s finest artisans. Celebrate life’s beautiful milestones with trust and luxury.</p>
        <div style="display:flex; gap:16px;">
          <a href="#" style="display:inline-flex; background:#D4AF37; color:#1A0F0A; padding:16px 36px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:2px; text-transform:uppercase;">Explore Collections</a>
          <a href="#" style="display:inline-flex; border:1px solid rgba(255,255,255,0.4); color:#FFF; padding:16px 36px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:2px; text-transform:uppercase;">Book Video Call</a>
        </div>
      </div>
      <div class="shimmer-wrapper" style="position:relative; width:100%; aspect-ratio:4/5; border:1px solid rgba(212, 175, 55, 0.3); padding:16px; margin:0 auto; max-width:500px;">
        <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" alt="Luxury Jewellery" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.9);" onload="this.classList.add('img-loaded')" class="img-loading">
        <div style="position:absolute; bottom:-20px; left:-20px; background:#FDFAF3; border:1px solid #D4AF37; padding:20px 24px; text-align:center;">
          <span style="font-size:24px; font-weight:700; color:#8B1A2C; display:block; font-family:'Cormorant Garamond', serif;">100%</span>
          <span style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#7D6B58;">BIS Certified</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Logo List -->
  <div style="padding:48px 0; border-bottom:1px solid rgba(212, 175, 55, 0.2); background:#FFFDFC;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">BIS Hallmarked</span>
      <span style="width:4px; height:4px; background:#D4AF37; border-radius:50%;"></span>
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">GIA Certified</span>
      <span style="width:4px; height:4px; background:#D4AF37; border-radius:50%;"></span>
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">100% Exchange</span>
      <span style="width:4px; height:4px; background:#D4AF37; border-radius:50%;"></span>
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">Insured Shipping</span>
    </div>
  </div>

  <!-- 5. Collections -->
  <div style="padding:100px 0; background:#FDFAF3;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:64px;">
        <span style="font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; display:block;">CURATED FOR YOU</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:16px; position:relative; display:inline-block; padding-bottom:12px;">Shop by Occasion<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:1px; background:#D4AF37;"></span></h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div class="shimmer-wrapper" style="aspect-ratio:3/4; border:1px solid rgba(212, 175, 55, 0.2); position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26, 15, 10, 0.85) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#FDFAF3; margin-bottom:6px;">Bridal Gold</h3>
          </div>
        </div>
        <div class="shimmer-wrapper" style="aspect-ratio:3/4; border:1px solid rgba(212, 175, 55, 0.2); position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26, 15, 10, 0.85) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#FDFAF3; margin-bottom:6px;">Diamond Solitaires</h3>
          </div>
        </div>
        <div class="shimmer-wrapper" style="aspect-ratio:3/4; border:1px solid rgba(212, 175, 55, 0.2); position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26, 15, 10, 0.85) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#FDFAF3; margin-bottom:6px;">Everyday Elegance</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Featured Products -->
  <div style="padding:100px 0; background:#FFFDFC; border-top:1px solid rgba(212, 175, 55, 0.25);">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:64px;">
        <span style="font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; display:block;">NEW ARRIVALS</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:16px; position:relative; display:inline-block; padding-bottom:12px;">Just In — Exquisite Pieces<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:1px; background:#D4AF37;"></span></h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Gold Sets</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Celestial Gold Necklace Set</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹1,24,999</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Diamond Sets</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Lumina Diamond Choker</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹3,45,000</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Bangles</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Heritage Gold Kadas (Pair)</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹85,500</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Earrings</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Polki Jhumkas</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹45,999</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 7. Bridal / Editorial -->
  <div style="padding:120px 0; background:#1A0F0A; color:#FDFAF3;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1fr 1.2fr; gap:80px; align-items:center;">
      <div class="shimmer-wrapper" style="border:1px solid #D4AF37; padding:16px;">
        <img src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80" style="width:100%; aspect-ratio:4/5; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
      </div>
      <div>
        <span style="color:#D4AF37; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; display:block;">BRIDAL COLLECTION</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:52px; line-height:1.15; margin-bottom:28px;">Begin Your <span style="color:#D4AF37; font-style:italic;">Forever</span> in Gold</h2>
        <p style="font-size:15px; line-height:1.9; color:rgba(253, 250, 243, 0.7); margin-bottom:44px; max-width:600px;">From temple jewellery to contemporary bridal sets — find the perfect pieces to make your special day unforgettable.</p>
        <a href="#" style="display:inline-flex; background:#D4AF37; color:#1A0F0A; padding:16px 36px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:2px; text-transform:uppercase;">Explore Bridal</a>
      </div>
    </div>
  </div>

  <!-- 8. Craft Stats -->
  <div style="padding:100px 0; background:#1A0F0A; color:#FDFAF3; text-align:center;">
    <div style="max-width:1000px; margin:0 auto; padding:0 24px;">
      <span style="color:#D4AF37; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; display:block;">LEGACY OF TRUST</span>
      <h2 style="font-family:'Cormorant Garamond', serif; font-size:52px; margin-bottom:28px;">80 Years of <span style="color:#D4AF37; font-style:italic;">Exquisite Craftsmanship</span></h2>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:32px; border-top:1px solid rgba(212, 175, 55, 0.2); padding-top:48px;">
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">80+</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Years of Trust</span>
        </div>
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">400+</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Stores</span>
        </div>
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">5000+</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Artisans</span>
        </div>
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">100%</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">BIS Hallmarked</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 9. Image with Text -->
  <div style="padding:120px 0; background:#FDFAF3;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">
      <div>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:24px;">The Tanishq Promise</h2>
        <p style="font-size:16px; color:#7D6B58; line-height:1.8; margin-bottom:32px;">Every diamond is ethically sourced and rigorously graded. Every ounce of gold is melted in-house to guarantee unmatched purity. We don't just sell jewellery; we build relationships grounded in absolute transparency.</p>
        <a href="#" style="color:#8B1A2C; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:underline; font-size:12px;">Read Our Ethics Policy</a>
      </div>
      <div class="shimmer-wrapper" style="aspect-ratio:4/3; border:1px solid rgba(212, 175, 55, 0.2);">
        <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
      </div>
    </div>
  </div>

  <!-- 10. Reviews -->
  <div style="padding:100px 0; background:#FFFDFC; border-top:1px solid rgba(212, 175, 55, 0.2);">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:64px;">
        <span style="font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; display:block;">CUSTOMER STORIES</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:16px; position:relative; display:inline-block; padding-bottom:12px;">Treasured by Millions<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:1px; background:#D4AF37;"></span></h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); padding:40px 32px; text-align:center;">
          <div style="color:#D4AF37; margin-bottom:24px; display:flex; justify-content:center; gap:4px;">
            ★★★★★
          </div>
          <p style="font-family:'Cormorant Garamond', serif; font-size:22px; font-style:italic; color:#1A0F0A; line-height:1.6; margin-bottom:32px;">"The craftsmanship is unmatched. My wedding necklace from Tanishq is the most beautiful piece I own."</p>
          <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1A0F0A; margin-bottom:4px;">Meera S.</div>
          <div style="font-size:11px; color:#7D6B58;">Chennai • Bridal Set</div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); padding:40px 32px; text-align:center;">
          <div style="color:#D4AF37; margin-bottom:24px; display:flex; justify-content:center; gap:4px;">
            ★★★★★
          </div>
          <p style="font-family:'Cormorant Garamond', serif; font-size:22px; font-style:italic; color:#1A0F0A; line-height:1.6; margin-bottom:32px;">"Bought diamond studs for my anniversary. The purity certificate and hallmark give me total confidence."</p>
          <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1A0F0A; margin-bottom:4px;">Rahul D.</div>
          <div style="font-size:11px; color:#7D6B58;">Pune • Diamond Studs</div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); padding:40px 32px; text-align:center;">
          <div style="color:#D4AF37; margin-bottom:24px; display:flex; justify-content:center; gap:4px;">
            ★★★★★
          </div>
          <p style="font-family:'Cormorant Garamond', serif; font-size:22px; font-style:italic; color:#1A0F0A; line-height:1.6; margin-bottom:32px;">"Their everyday gold bangles are so elegant. I get compliments every single day at work!"</p>
          <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1A0F0A; margin-bottom:4px;">Ananya R.</div>
          <div style="font-size:11px; color:#7D6B58;">Hyderabad • Gold Bangles</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 11. Footer -->
  <div style="background:#1A0F0A; color:#FDFAF3; padding:80px 0 40px; border-top:4px solid #8B1A2C;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:64px; margin-bottom:64px;">
        <div>
          <div style="font-family:'Cormorant Garamond', serif; font-size:32px; font-weight:700; color:#8B1A2C; letter-spacing:4px; margin-bottom:24px;">TANISHQ</div>
          <p style="font-size:14px; color:rgba(253, 250, 243, 0.7); line-height:1.8;">A TATA product representing the pinnacle of Indian craftsmanship and purity.</p>
        </div>
        <div>
          <h4 style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; color:#D4AF37;">Shop</h4>
          <ul style="list-style:none; line-height:2.4; font-size:14px; color:rgba(253, 250, 243, 0.7);">
            <li>Gold</li><li>Diamonds</li><li>Bridal</li><li>Gifting</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; color:#D4AF37;">Services</h4>
          <ul style="list-style:none; line-height:2.4; font-size:14px; color:rgba(253, 250, 243, 0.7);">
            <li>Book Appointment</li><li>Golden Harvest</li><li>Store Locator</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; color:#D4AF37;">Connect</h4>
          <ul style="list-style:none; line-height:2.4; font-size:14px; color:rgba(253, 250, 243, 0.7);">
            <li>Instagram</li><li>Facebook</li><li>YouTube</li>
          </ul>
        </div>
      </div>
      <div style="text-align:center; padding-top:40px; border-top:1px solid rgba(253, 250, 243, 0.1); font-size:12px; color:rgba(253, 250, 243, 0.5);">
        &copy; 2026 Tanishq. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>\`;`;

const startIndex = content.indexOf('const tanishqPreviewHTML = `<!DOCTYPE html>');
if (startIndex !== -1) {
  let endIndex = content.indexOf('`;', startIndex);
  if (endIndex !== -1) {
    endIndex += 2; // include `;\n
    const newContent = content.substring(0, startIndex) + newTanishqHTML + content.substring(endIndex);
    fs.writeFileSync(targetPath, newContent, 'utf8');
    console.log('Successfully updated tanishqPreviewHTML in app._index.jsx');
  } else {
    console.log('Could not find end of tanishqPreviewHTML');
  }
} else {
  console.log('Could not find tanishqPreviewHTML in app._index.jsx');
}
