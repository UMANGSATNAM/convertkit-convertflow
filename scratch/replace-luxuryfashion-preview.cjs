const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#0A0A0A; color:#FFFFFF; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#0A0A0A; color:#FFFFFF; text-align:center; padding:10px; font-size:10px; font-weight:400; letter-spacing:2px; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,0.1);">
    Complimentary global shipping and returns.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#0A0A0A; border-bottom:1px solid rgba(255,255,255,0.1);">
    <div style="font-family:'Playfair Display', serif; font-size:24px; font-weight:400; letter-spacing:4px;">M A I S O N</div>
    <div style="display:flex; gap:32px; font-size:11px; font-weight:400; text-transform:uppercase; letter-spacing:2px;">
      <span style="color:#D4AF37; border-bottom:1px solid #D4AF37; padding-bottom:4px;">Collections</span>
      <span>Atelier</span>
      <span>Journal</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; min-height:90vh; display:flex; align-items:center; overflow:hidden;">
    <div style="max-width:1600px; margin:0 auto; width:100%; display:flex; position:relative; z-index:2;">
      <!-- Image -->
      <div style="flex:1; position:relative; height:100vh;">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.1) brightness(0.8);">
      </div>
      <!-- Content -->
      <div style="flex:1; display:flex; align-items:center; padding:80px; position:relative;">
        <div style="position:absolute; top:15%; bottom:15%; left:-10%; right:10%; background:#0A0A0A; z-index:-1; border:1px solid rgba(212,175,55,0.2);"></div>
        <div style="position:relative; z-index:2;">
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:4px; color:#D4AF37; margin-bottom:32px; display:flex; align-items:center; gap:16px;">
            <span style="width:40px; height:1px; background:#D4AF37;"></span>Spring/Summer 2026
          </div>
          <h1 style="font-family:'Playfair Display', serif; font-size:88px; font-weight:400; font-style:italic; line-height:1; margin-bottom:40px; letter-spacing:-1px;">L'Élégance Redéfinie.</h1>
          <p style="font-size:16px; font-weight:300; line-height:1.8; color:rgba(255,255,255,0.7); max-width:400px; margin-bottom:56px;">Discover the Spring/Summer Collection. A study in modern tailoring.</p>
          <div style="display:inline-block; font-size:12px; text-transform:uppercase; letter-spacing:2px; color:#FFFFFF; padding-bottom:8px; border-bottom:1px solid #D4AF37;">EXPLORE THE CAMPAIGN</div>
        </div>
      </div>
    </div>
    <!-- Ambient glowing element -->
    <div style="position:absolute; top:20%; right:10%; width:300px; height:300px; background:radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(10,10,10,0) 70%); z-index:1;"></div>
  </div>

  <!-- Collection -->
  <div style="padding:160px 40px; background:#0A0A0A;">
    <div style="max-width:1600px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:100px;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:4px; color:#D4AF37; margin-bottom:16px;">The New Standard</div>
          <h2 style="font-family:'Playfair Display', serif; font-size:56px; font-weight:400; margin:0; font-style:italic;">Curated Selection</h2>
        </div>
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:2px; display:inline-flex; align-items:center; gap:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.2);">
          VIEW ALL <span style="width:24px; height:1px; background:#FFFFFF;"></span>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:2px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.1);">
        <!-- Cards -->
        <div style="background:#0A0A0A; padding:40px; display:flex; flex-direction:column;">
          <div style="position:relative; padding-bottom:140%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(80%);">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Playfair Display', serif; font-size:18px; font-weight:400; margin-bottom:12px; letter-spacing:1px;">Silk Organza Blouse</h3>
            <div style="font-size:12px; font-weight:300; color:rgba(255,255,255,0.6);">$890</div>
          </div>
        </div>
        <div style="background:#0A0A0A; padding:40px; display:flex; flex-direction:column;">
          <div style="position:relative; padding-bottom:140%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1550614000-4b95dd012eee?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(80%);">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Playfair Display', serif; font-size:18px; font-weight:400; margin-bottom:12px; letter-spacing:1px;">Tailored Wool Coat</h3>
            <div style="font-size:12px; font-weight:300; color:rgba(255,255,255,0.6);">$2,450</div>
          </div>
        </div>
        <div style="background:#0A0A0A; padding:40px; display:flex; flex-direction:column;">
          <div style="position:relative; padding-bottom:140%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(80%);">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Playfair Display', serif; font-size:18px; font-weight:400; margin-bottom:12px; letter-spacing:1px;">Leather Envelope Clutch</h3>
            <div style="font-size:12px; font-weight:300; color:rgba(255,255,255,0.6);">$1,200</div>
          </div>
        </div>
        <div style="background:#0A0A0A; padding:40px; display:flex; flex-direction:column;">
          <div style="position:relative; padding-bottom:140%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(80%);">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Playfair Display', serif; font-size:18px; font-weight:400; margin-bottom:12px; letter-spacing:1px;">Structured Crepe Trousers</h3>
            <div style="font-size:12px; font-weight:300; color:rgba(255,255,255,0.6);">$950</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Editorial -->
  <div style="padding:160px 40px; border-top:1px solid rgba(255,255,255,0.1);">
    <div style="max-width:1600px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative;">
        <div style="position:relative; padding-bottom:120%; border:1px solid rgba(212,175,55,0.3);">
          <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(30%);">
        </div>
        <div style="position:absolute; bottom:-40px; right:-40px; background:#FFFFFF; color:#0A0A0A; padding:40px; max-width:300px; box-shadow:0 20px 40px rgba(0,0,0,0.5);">
          <div style="font-size:40px; color:#D4AF37; line-height:1; margin-bottom:16px;">"</div>
          <p style="font-family:'Playfair Display', serif; font-size:18px; font-style:italic; line-height:1.6; margin:0;">True luxury is the marriage of exceptional materials and meticulous execution.</p>
        </div>
      </div>
      <div style="padding-left:40px;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:4px; color:#D4AF37; margin-bottom:24px;">Atelier</div>
        <h2 style="font-family:'Playfair Display', serif; font-size:64px; font-weight:400; margin-bottom:40px; line-height:1.1; letter-spacing:-1px;">The Art of Craft</h2>
        <p style="font-size:16px; font-weight:300; line-height:1.8; color:rgba(255,255,255,0.7); max-width:480px; margin-bottom:48px;">Every piece is constructed with uncompromising attention to detail, honoring traditional techniques while embracing contemporary silhouettes.</p>
        <div style="display:inline-flex; align-items:center; gap:16px; font-size:11px; text-transform:uppercase; letter-spacing:2px;">
          <span style="width:40px; height:1px; background:#D4AF37;"></span> DISCOVER THE PROCESS
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"luxury-fashion":\s*`[\s\S]*?`/,
  `"luxury-fashion": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('LUXURY FASHION template updated.');
