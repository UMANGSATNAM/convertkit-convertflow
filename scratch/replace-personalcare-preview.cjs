const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FAF7F2; color:#4A4A4A; min-height:100vh; font-family:'Nunito', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#D3C1B5; color:#4A4A4A; text-align:center; padding:10px; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">
    100% Natural. Free shipping on your first order.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF;">
    <div style="font-family:'Lora', serif; font-size:28px; font-weight:500; letter-spacing:2px; color:#4A4A4A;">B O T A N I Q</div>
    <div style="display:flex; gap:32px; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
      <span style="color:#8B7355; border-bottom:1px solid #D3C1B5;">Shop</span>
      <span>About</span>
      <span>Journal</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; min-height:80vh; display:grid; grid-template-columns:1fr 1fr; align-items:center; position:relative; overflow:hidden;">
    <div style="position:absolute; top:-10%; left:-5%; width:40%; padding-bottom:40%; background:#D3C1B5; border-radius:40% 60% 70% 30% / 40% 50% 60% 50%; opacity:0.15; filter:blur(40px); z-index:1;"></div>
    
    <div style="padding-right:60px; position:relative; z-index:2;">
      <h1 style="font-family:'Lora', serif; font-size:72px; font-weight:400; line-height:1.15; margin-bottom:24px; color:#4A4A4A;">Nurture Your True Nature.</h1>
      <p style="font-size:18px; font-weight:300; line-height:1.7; color:#8B7355; margin-bottom:48px; max-width:480px;">Plant-based personal care designed to restore balance and harmony to your daily routine.</p>
      <div style="display:inline-block; background:#4A4A4A; color:#FAF7F2; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:2px; padding:18px 40px; border-radius:30px; box-shadow:0 10px 20px rgba(74,74,74,0.1);">SHOP ESSENTIALS</div>
    </div>
    
    <div style="position:relative; z-index:2;">
      <div style="position:relative; width:85%; margin:0 auto; padding-bottom:110%; overflow:hidden; border-radius:200px 200px 0 0; background:#EAE4D9; box-shadow:0 20px 40px rgba(139,115,85,0.08);">
        <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="position:absolute; bottom:10%; right:0; background:#FFFFFF; padding:24px 32px; border-radius:16px; box-shadow:0 15px 30px rgba(139,115,85,0.1); display:flex; align-items:center; gap:16px;">
        <div style="width:40px; height:40px; background:#F0EBE1; border-radius:50%; display:flex; align-items:center; justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B7355" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div>
          <div style="font-family:'Lora', serif; font-size:16px; font-weight:500; color:#4A4A4A;">100% Natural</div>
          <div style="font-size:12px; color:#8B7355;">Plant-based ingredients</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <h2 style="font-family:'Lora', serif; font-size:48px; font-weight:400; color:#4A4A4A; margin-bottom:16px;">Pure. Simple. Effective.</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:40px;">
        <div style="text-align:center; padding:40px 24px; background:#FAF7F2; border-radius:120px 120px 24px 24px;">
          <div style="width:80px; height:80px; margin:0 auto 24px auto; background:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(139,115,85,0.05);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B7355" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 style="font-family:'Lora', serif; font-size:22px; font-weight:500; margin-bottom:12px;">100% Vegan</h3>
          <p style="color:#8B7355; font-size:15px; font-weight:300;">Plant-derived ingredients only.</p>
        </div>
        <div style="text-align:center; padding:40px 24px; background:#FAF7F2; border-radius:120px 120px 24px 24px;">
          <div style="width:80px; height:80px; margin:0 auto 24px auto; background:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(139,115,85,0.05);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B7355" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </div>
          <h3 style="font-family:'Lora', serif; font-size:22px; font-weight:500; margin-bottom:12px;">Cruelty-Free</h3>
          <p style="color:#8B7355; font-size:15px; font-weight:300;">Never tested on animals.</p>
        </div>
        <div style="text-align:center; padding:40px 24px; background:#FAF7F2; border-radius:120px 120px 24px 24px;">
          <div style="width:80px; height:80px; margin:0 auto 24px auto; background:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(139,115,85,0.05);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B7355" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h3 style="font-family:'Lora', serif; font-size:22px; font-weight:500; margin-bottom:12px;">Eco-Friendly</h3>
          <p style="color:#8B7355; font-size:15px; font-weight:300;">Sustainable packaging.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="background:#FAF7F2; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:80px;">
        <h2 style="font-family:'Lora', serif; font-size:56px; font-weight:400; margin:0;">Everyday Essentials</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#F0EBE1; border-radius:120px 120px 0 0; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Lora', serif; font-size:20px; font-weight:500; margin-bottom:8px;">Nourishing Body Wash</h3>
            <div style="font-size:14px; color:#8B7355;">$32.00</div>
          </div>
        </div>
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#F0EBE1; border-radius:120px 120px 0 0; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; top:20px; right:20px; background:#FFFFFF; color:#8B7355; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:6px 16px; border-radius:20px;">Best Seller</div>
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Lora', serif; font-size:20px; font-weight:500; margin-bottom:8px;">Botanical Deodorant</h3>
            <div style="font-size:14px; color:#8B7355;">$28.00</div>
          </div>
        </div>
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#F0EBE1; border-radius:120px 120px 0 0; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1615397323628-912563f8859f?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Lora', serif; font-size:20px; font-weight:500; margin-bottom:8px;">Hydrating Lotion</h3>
            <div style="font-size:14px; color:#8B7355;">$45.00</div>
          </div>
        </div>
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#F0EBE1; border-radius:120px 120px 0 0; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="text-align:center;">
            <h3 style="font-family:'Lora', serif; font-size:20px; font-weight:500; margin-bottom:8px;">Hand Cream</h3>
            <div style="font-size:14px; color:#8B7355;">$24.00</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"personal-care":\s*`[\s\S]*?`/,
  `"personal-care": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PERSONAL CARE template updated.');
