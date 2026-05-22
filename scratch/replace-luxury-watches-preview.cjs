const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
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
`;

content = content.replace(
  /"luxury-watches":\s*`[\s\S]*?`/,
  `"luxury-watches": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('LUXURY WATCHES template updated.');
