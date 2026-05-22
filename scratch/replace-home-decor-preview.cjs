const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
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
`;

content = content.replace(
  /"home-decor":\s*`[\s\S]*?`/,
  `"home-decor": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('HOME DECOR template updated.');
