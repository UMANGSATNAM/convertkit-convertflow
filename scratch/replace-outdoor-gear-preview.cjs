const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#F4F1EA; color:#2B2B2B; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#D97736; color:#FFFFFF; text-align:center; padding:10px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
    Gear up for summer. Free shipping on orders over $100.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#2B2B2B; color:#FFFFFF;">
    <div style="font-family:'Oswald', sans-serif; font-size:32px; font-weight:700; letter-spacing:2px;">ASCENT</div>
    <div style="display:flex; gap:32px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
      <span style="color:#D97736;">Mens</span>
      <span>Womens</span>
      <span>Equipment</span>
      <span>Our Story</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:flex; align-items:flex-end; min-height:85vh; padding-bottom:80px; overflow:hidden;">
    <div style="position:absolute; inset:0; z-index:1;">
      <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.7);">
      <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(43,43,43,1) 0%, rgba(43,43,43,0.3) 50%, rgba(43,43,43,0.1) 100%);"></div>
    </div>
    
    <div style="max-width:1440px; margin:0 auto; width:100%; padding:0 40px; position:relative; z-index:2; color:#FFFFFF;">
      <div style="max-width:800px;">
        <div style="display:inline-block; font-size:14px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#D97736; margin-bottom:16px; background:rgba(0,0,0,0.5); padding:6px 16px; border-radius:4px;">NEW EXPLORER SERIES</div>
        <div style="font-family:'Oswald', sans-serif; font-size:100px; font-weight:700; line-height:1; margin-bottom:24px; text-transform:uppercase;">Embrace the Wild.</div>
        <div style="font-size:18px; line-height:1.6; color:#E0E0E0; margin-bottom:40px; max-width:600px;">Purpose-built gear for those who seek the extraordinary. Tested in the harshest environments on earth.</div>
        <div style="display:inline-block; font-size:15px; font-weight:700; letter-spacing:1px; text-transform:uppercase; background:#D97736; padding:18px 40px; border-radius:4px;">SHOP THE SERIES</div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:120px 40px; background:#F4F1EA;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <div>
          <div style="font-family:'Oswald', sans-serif; font-size:48px; font-weight:700; text-transform:uppercase; margin-bottom:16px;">Essential Equipment</div>
          <div style="width:60px; height:4px; background:#D97736;"></div>
        </div>
        <div style="font-size:14px; font-weight:700; color:#D97736; text-transform:uppercase; letter-spacing:1px; border-bottom:2px solid #D97736; padding-bottom:4px;">VIEW ALL GEAR</div>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
        <div style="background:#FFFFFF; border:1px solid #E5E0D8;">
          <div style="position:relative; padding-bottom:120%; background:#F9F8F6;">
            <img src="https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:24px;">
            <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Apparel</div>
            <div style="font-family:'Oswald', sans-serif; font-size:22px; font-weight:500; text-transform:uppercase; margin-bottom:12px;">Alpine Shell Jacket</div>
            <div style="font-size:18px; font-weight:700;">$299.00</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E5E0D8;">
          <div style="position:relative; padding-bottom:120%; background:#F9F8F6;">
            <img src="https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:24px;">
            <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Footwear</div>
            <div style="font-family:'Oswald', sans-serif; font-size:22px; font-weight:500; text-transform:uppercase; margin-bottom:12px;">Approach Pro Boots</div>
            <div style="font-size:18px; font-weight:700;">$185.00</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E5E0D8;">
          <div style="position:relative; padding-bottom:120%; background:#F9F8F6;">
            <img src="https://images.unsplash.com/photo-1522204657746-fccce0824cfd?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:24px;">
            <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Equipment</div>
            <div style="font-family:'Oswald', sans-serif; font-size:22px; font-weight:500; text-transform:uppercase; margin-bottom:12px;">Titanium Carabiner</div>
            <div style="font-size:18px; font-weight:700;">$24.00</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E5E0D8;">
          <div style="position:relative; padding-bottom:120%; background:#F9F8F6;">
            <img src="https://images.unsplash.com/photo-1575200384814-74a48557d079?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:24px;">
            <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Accessories</div>
            <div style="font-family:'Oswald', sans-serif; font-size:22px; font-weight:500; text-transform:uppercase; margin-bottom:12px;">Merino Wool Beanie</div>
            <div style="font-size:18px; font-weight:700;">$35.00</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured Product -->
  <div style="background:#F4F1EA; padding:120px 40px; position:relative;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative; background:#FFFFFF; border:1px solid #E5E0D8; padding:20px;">
        <img src="https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=1000&q=80" style="width:100%; height:auto;">
        <div style="position:absolute; top:30%; left:20%; width:24px; height:24px; background:#D97736; border-radius:50%; border:4px solid #FFFFFF;"></div>
        <div style="position:absolute; top:55%; right:25%; width:24px; height:24px; background:#D97736; border-radius:50%; border:4px solid #FFFFFF;"></div>
      </div>
      <div>
        <div style="font-size:14px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#D97736; margin-bottom:16px;">GEAR OF THE YEAR</div>
        <div style="font-family:'Oswald', sans-serif; font-size:64px; font-weight:700; line-height:1.1; margin-bottom:24px; text-transform:uppercase;">The Summit Alpha Jacket</div>
        <div style="font-size:18px; line-height:1.6; color:#555555; margin-bottom:40px;">Our most advanced hardshell yet. Featuring micro-seam technology and dynamic ventilation for high-output alpine pursuits.</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:48px;">
          <div style="border-left:2px solid #D97736; padding-left:16px;">
            <div style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600;">310g</div>
            <div style="font-size:14px; color:#888888; text-transform:uppercase; letter-spacing:1px;">Weight</div>
          </div>
          <div style="border-left:2px solid #D97736; padding-left:16px;">
            <div style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600;">28,000mm</div>
            <div style="font-size:14px; color:#888888; text-transform:uppercase; letter-spacing:1px;">Waterproof Rating</div>
          </div>
        </div>
        <div style="display:inline-block; font-size:15px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#FFFFFF; background:#2B2B2B; padding:18px 40px; border-radius:4px;">EXPLORE THE JACKET</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"outdoor-gear":\s*`[\s\S]*?`/,
  `"outdoor-gear": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('OUTDOOR GEAR template updated.');
