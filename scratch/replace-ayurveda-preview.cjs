const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FAF6F0; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#8B9A84; color:#FAF6F0; text-align:center; padding:8px; font-size:11px; letter-spacing:2px; font-weight:600; text-transform:uppercase;">
    COMPLIMENTARY SHIPPING ON WELLNESS ORDERS OVER $75
  </div>

  <!-- Header -->
  <div style="padding:20px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(44,62,45,0.1);">
    <div style="font-family:'Georgia', serif; font-size:24px; color:#2C3E2D; letter-spacing:2px;">AYURVA</div>
    <div style="display:flex; gap:32px; font-size:13px; font-weight:500; color:#2C3E2D; letter-spacing:1px; text-transform:uppercase;">
      <span>Shop</span>
      <span>Rituals</span>
      <span>Journal</span>
      <span>About</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:60px; padding:60px 40px; align-items:center; max-width:1440px; margin:0 auto;">
    <div style="padding-right:40px;">
      <div style="font-size:12px; font-weight:600; letter-spacing:3px; color:#8B9A84; margin-bottom:24px;">ANCIENT WISDOM, MODERN WELLNESS</div>
      <div style="font-family:'Georgia', serif; font-size:64px; color:#2C3E2D; line-height:1.1; margin-bottom:24px;">Return to Balance</div>
      <div style="font-size:18px; color:#4a5c4b; line-height:1.8; margin-bottom:40px; max-width:480px;">Holistic Ayurvedic formulations crafted from wild-harvested botanicals to harmonize mind, body, and spirit.</div>
      <div style="display:flex; gap:20px;">
        <div style="background:#2C3E2D; color:#FAF6F0; padding:16px 40px; font-size:13px; font-weight:500; letter-spacing:2px;">SHOP THE APOTHECARY</div>
        <div style="border:1px solid #2C3E2D; color:#2C3E2D; padding:16px 40px; font-size:13px; font-weight:500; letter-spacing:2px;">DISCOVER YOUR DOSHA</div>
      </div>
    </div>
    <div style="position:relative; aspect-ratio:4/5; border-radius:200px 200px 0 0; overflow:hidden; background:#e8e1d7;">
      <div style="width:100%; height:100%; background:url('https://images.unsplash.com/photo-1598440947619-2ce65f90fff1?auto=format&fit=crop&w=800&q=80') center/cover; filter:sepia(10%);"></div>
    </div>
  </div>

  <!-- Ingredients -->
  <div style="background:#2C3E2D; padding:100px 40px; text-align:center; color:#FAF6F0;">
    <div style="font-size:12px; font-weight:600; letter-spacing:3px; color:#8B9A84; margin-bottom:24px;">WILD HARVESTED</div>
    <div style="font-family:'Georgia', serif; font-size:48px; margin-bottom:80px;">Potent Botanicals</div>
    
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:40px; max-width:1200px; margin:0 auto;">
      <div>
        <div style="width:160px; height:160px; border-radius:50%; border:2px solid #8B9A84; margin:0 auto 24px auto; background:url('https://images.unsplash.com/photo-1515585868285-1d480e6113b2?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        <div style="font-family:'Georgia', serif; font-size:24px; margin-bottom:16px;">Ashwagandha</div>
      </div>
      <div>
        <div style="width:160px; height:160px; border-radius:50%; border:2px solid #8B9A84; margin:0 auto 24px auto; background:url('https://images.unsplash.com/photo-1611078512217-1510e9f16802?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        <div style="font-family:'Georgia', serif; font-size:24px; margin-bottom:16px;">Turmeric Root</div>
      </div>
      <div>
        <div style="width:160px; height:160px; border-radius:50%; border:2px solid #8B9A84; margin:0 auto 24px auto; background:url('https://images.unsplash.com/photo-1596541571168-98f5b497edfe?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        <div style="font-family:'Georgia', serif; font-size:24px; margin-bottom:16px;">Gotu Kola</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"ayurveda-wellness":\s*`[\s\S]*?`/,
  `"ayurveda-wellness": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('AYURVEDA WELLNESS template updated.');
