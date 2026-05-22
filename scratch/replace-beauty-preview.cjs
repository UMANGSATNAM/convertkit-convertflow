const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FFFFFF; color:#2F4F4F; min-height:100vh; font-family:'Montserrat', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#F0FFF0; color:#2F4F4F; text-align:center; padding:10px; font-size:11px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">
    Clean, vegan, and cruelty-free. Free shipping over $50.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-bottom:1px solid #F0FFF0;">
    <div style="font-family:'Cormorant Garamond', serif; font-size:28px; font-weight:400; letter-spacing:6px;">A U R A</div>
    <div style="display:flex; gap:32px; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:2px;">
      <span style="color:#8FBC8F;">Skincare</span>
      <span>Body</span>
      <span>About</span>
      <span>Journal</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; min-height:80vh; display:grid; grid-template-columns:1fr 1fr; align-items:center;">
    <div style="padding-right:60px;">
      <div style="font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:3px; color:#8FBC8F; margin-bottom:32px; display:flex; align-items:center; gap:16px;">
        <span style="width:30px; height:1px; background:#8FBC8F;"></span>
        NEW FORMULA
      </div>
      <div style="font-family:'Cormorant Garamond', serif; font-size:88px; font-weight:400; line-height:1.1; margin-bottom:32px;">Pure Radiance.</div>
      <div style="font-size:16px; font-weight:300; opacity:0.8; line-height:1.8; margin-bottom:48px; max-width:420px;">Discover skincare powered by nature and backed by science. For a healthy, luminous glow from within.</div>
      <div style="display:inline-block; background:#2F4F4F; color:#FFFFFF; font-size:13px; font-weight:500; text-transform:uppercase; letter-spacing:2px; padding:18px 48px;">SHOP SKINCARE</div>
    </div>
    <div style="position:relative; height:600px; display:flex; align-items:center; justify-content:center; background:#F0FFF0;">
      <div style="position:absolute; width:80%; padding-bottom:80%; background:#E0F5E0; border-radius:50%; z-index:1;"></div>
      <div style="position:relative; z-index:2; width:70%; height:80%; border-radius:100px 100px 0 0; overflow:hidden; box-shadow:0 30px 60px rgba(47,79,79,0.08);">
        <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="position:absolute; bottom:20%; left:5%; background:#FFFFFF; padding:16px 24px; box-shadow:0 15px 30px rgba(47,79,79,0.05); z-index:3; border-left:2px solid #8FBC8F;">
        <div style="font-family:'Cormorant Garamond', serif; font-size:18px; font-style:italic;">Clean & Vegan</div>
      </div>
    </div>
  </div>

  <!-- Ingredients -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <div style="font-family:'Cormorant Garamond', serif; font-size:48px; font-weight:400; margin-bottom:16px;">Powered by Nature</div>
        <div style="width:40px; height:1px; background:#8FBC8F; margin:0 auto;"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:60px;">
        <div style="text-align:center;">
          <div style="width:160px; height:160px; margin:0 auto 32px auto; overflow:hidden; border-radius:50%; background:#F0FFF0; padding:10px;">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
          </div>
          <div style="font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;">Botanical Squalane</div>
          <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-style:italic; opacity:0.8; max-width:280px; margin:0 auto;">Locks in weightless moisture.</div>
        </div>
        <div style="text-align:center;">
          <div style="width:160px; height:160px; margin:0 auto 32px auto; overflow:hidden; border-radius:50%; background:#F0FFF0; padding:10px;">
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
          </div>
          <div style="font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;">Rosehip Oil</div>
          <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-style:italic; opacity:0.8; max-width:280px; margin:0 auto;">Brightens and evens tone.</div>
        </div>
        <div style="text-align:center;">
          <div style="width:160px; height:160px; margin:0 auto 32px auto; overflow:hidden; border-radius:50%; background:#F0FFF0; padding:10px;">
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
          </div>
          <div style="font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;">Hyaluronic Acid</div>
          <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-style:italic; opacity:0.8; max-width:280px; margin:0 auto;">Plumps and deeply hydrates.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured Product -->
  <div style="background:#FFFFFF; padding:120px 40px; overflow:hidden;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative;">
        <div style="position:absolute; top:-10%; left:-10%; width:80%; padding-bottom:80%; background:#F0FFF0; border-radius:50%; z-index:1;"></div>
        <div style="position:relative; z-index:2; overflow:hidden; box-shadow:0 30px 60px rgba(47,79,79,0.08);">
          <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80" style="width:100%; display:block;">
        </div>
        <div style="position:absolute; bottom:10%; right:-10%; background:#FFFFFF; padding:32px; box-shadow:0 15px 40px rgba(47,79,79,0.05); z-index:3; text-align:center;">
          <div style="font-family:'Cormorant Garamond', serif; font-size:48px; line-height:1; margin-bottom:8px;">98<span style="font-size:24px;">%</span></div>
          <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:2px; color:#8FBC8F;">Saw brighter skin*</div>
        </div>
      </div>
      <div>
        <div style="font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:3px; color:#8FBC8F; margin-bottom:24px; display:flex; align-items:center; gap:16px;">
          <span style="width:30px; height:1px; background:#8FBC8F;"></span> AWARD WINNING
        </div>
        <div style="font-family:'Cormorant Garamond', serif; font-size:64px; line-height:1.1; margin-bottom:32px;">The Dew Drops Serum</div>
        <div style="font-size:16px; font-weight:300; opacity:0.8; line-height:1.8; margin-bottom:48px;">Our cult-favorite serum instantly hydrates and leaves skin with a glass-like finish. Formulated without silicones or synthetic fragrances.</div>
        <div style="display:inline-block; background:#2F4F4F; color:#FFFFFF; font-size:13px; font-weight:500; text-transform:uppercase; letter-spacing:2px; padding:18px 48px;">SHOP THE SERUM</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"beauty-cosmetics":\s*`[\s\S]*?`/,
  `"beauty-cosmetics": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('BEAUTY COSMETICS template updated.');
