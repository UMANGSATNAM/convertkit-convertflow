const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#0A0A0A; color:#FFFFFF; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#FF3366; color:#FFFFFF; text-align:center; padding:10px; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">
    DOMINATE YOUR WORKOUT. FREE SHIPPING ON ORDERS OVER $75.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#111111; border-bottom:1px solid #222222;">
    <div style="font-family:'Teko', sans-serif; font-size:36px; font-weight:600; letter-spacing:1px; line-height:1; color:#FFFFFF;">APEX NUTRITION</div>
    <div style="display:flex; gap:32px; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
      <span style="color:#FF3366;">Shop All</span>
      <span>By Goal</span>
      <span>Science</span>
      <span>Athletes</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; min-height:80vh; display:flex; align-items:center;">
    <div style="position:absolute; inset:0; z-index:1;">
      <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80" style="width:100%; height:100%; object-fit:cover; filter:grayscale(100%) contrast(1.2) brightness(0.4);">
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.5) 50%, rgba(255,51,102,0.1) 100%);"></div>
    </div>
    
    <div style="max-width:1440px; margin:0 auto; width:100%; padding:0 40px; position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;">
      <div>
        <div style="font-family:'Teko', sans-serif; font-size:24px; font-weight:600; letter-spacing:2px; color:#FF3366; margin-bottom:16px; border-left:4px solid #FF3366; padding-left:12px; line-height:1;">UNLEASH YOUR POTENTIAL</div>
        <div style="font-family:'Teko', sans-serif; font-size:120px; font-weight:700; line-height:0.85; margin-bottom:24px; text-transform:uppercase; text-shadow:0 0 20px rgba(255,51,102,0.3);">FUEL THE<br>MACHINE</div>
        <div style="font-size:18px; color:#CCCCCC; line-height:1.6; margin-bottom:48px; max-width:500px;">Clinically dosed formulas designed for elite performance and maximum recovery.</div>
        <div style="display:inline-flex; align-items:center; justify-content:center; background:#FF3366; color:#FFFFFF; font-family:'Teko', sans-serif; font-size:24px; font-weight:600; letter-spacing:2px; padding:16px 48px; transform:skewX(-10deg); box-shadow:0 0 20px rgba(255,51,102,0.4);">
          <span style="transform:skewX(10deg);">SHOP SUPPLEMENTS</span>
        </div>
      </div>
      <div style="position:relative; display:flex; justify-content:center; align-items:center;">
        <div style="position:absolute; width:400px; height:400px; background:radial-gradient(circle, rgba(255,51,102,0.3) 0%, rgba(10,10,10,0) 70%); z-index:1;"></div>
        <div style="position:relative; z-index:2; width:300px; height:400px; background:linear-gradient(to bottom, #1A1A1A, #0A0A0A); border:2px solid #FF3366; border-radius:12px; box-shadow:0 0 30px rgba(255,51,102,0.2); display:flex; align-items:center; justify-content:center; transform:rotate(5deg);">
          <div style="font-family:'Teko', sans-serif; font-size:48px; color:#333333; transform:rotate(-90deg);">PRODUCT RENDER</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Categories -->
  <div style="background:#111111; padding:120px 40px; border-top:1px solid #222222;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <div style="font-family:'Teko', sans-serif; font-size:64px; font-weight:600; margin-bottom:16px; line-height:1;">SHOP BY GOAL</div>
        <div style="width:80px; height:4px; background:#FF3366; margin:0 auto; transform:skewX(-20deg);"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
        <div style="position:relative; background:#1A1A1A; border:1px solid #333333; height:300px; display:flex; align-items:flex-end; padding:32px; transform:skewX(-5deg);">
          <div style="position:absolute; inset:0; z-index:1; transform:skewX(5deg) scale(1.1);">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover; filter:grayscale(100%) opacity(0.3);">
            <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 100%);"></div>
          </div>
          <div style="position:relative; z-index:3; transform:skewX(5deg); width:100%; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-family:'Teko', sans-serif; font-size:40px; font-weight:600; line-height:1;">Muscle Building</div>
          </div>
        </div>
        <div style="position:relative; background:#1A1A1A; border:1px solid #333333; height:300px; display:flex; align-items:flex-end; padding:32px; transform:skewX(-5deg);">
          <div style="position:absolute; inset:0; z-index:1; transform:skewX(5deg) scale(1.1);">
            <img src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover; filter:grayscale(100%) opacity(0.3);">
            <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 100%);"></div>
          </div>
          <div style="position:relative; z-index:3; transform:skewX(5deg); width:100%; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-family:'Teko', sans-serif; font-size:40px; font-weight:600; line-height:1;">Energy & Focus</div>
          </div>
        </div>
        <div style="position:relative; background:#1A1A1A; border:1px solid #333333; height:300px; display:flex; align-items:flex-end; padding:32px; transform:skewX(-5deg);">
          <div style="position:absolute; inset:0; z-index:1; transform:skewX(5deg) scale(1.1);">
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover; filter:grayscale(100%) opacity(0.3);">
            <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 100%);"></div>
          </div>
          <div style="position:relative; z-index:3; transform:skewX(5deg); width:100%; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-family:'Teko', sans-serif; font-size:40px; font-weight:600; line-height:1;">Weight Loss</div>
          </div>
        </div>
        <div style="position:relative; background:#1A1A1A; border:1px solid #333333; height:300px; display:flex; align-items:flex-end; padding:32px; transform:skewX(-5deg);">
          <div style="position:absolute; inset:0; z-index:1; transform:skewX(5deg) scale(1.1);">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover; filter:grayscale(100%) opacity(0.3);">
            <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 100%);"></div>
          </div>
          <div style="position:relative; z-index:3; transform:skewX(5deg); width:100%; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-family:'Teko', sans-serif; font-size:40px; font-weight:600; line-height:1;">Recovery & Health</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured -->
  <div style="background:#0A0A0A; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative; display:flex; justify-content:center; align-items:center; min-height:500px;">
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:80%; height:80%; background:#FF3366; opacity:0.1; filter:blur(60px); border-radius:50%; z-index:1;"></div>
        <div style="position:absolute; inset:0; border:2px solid #222222; transform:skewX(-5deg); z-index:2;"></div>
        <div style="position:relative; z-index:3; width:300px; height:400px; background:linear-gradient(to bottom, #1A1A1A, #0A0A0A); border:1px solid #333333; display:flex; align-items:center; justify-content:center; flex-direction:column; box-shadow:0 0 50px rgba(0,0,0,0.8); transform:rotate(-5deg);">
          <div style="font-family:'Teko', sans-serif; font-size:40px; color:#555555;">Tub Render</div>
        </div>
      </div>
      <div>
        <div style="font-family:'Teko', sans-serif; font-size:24px; font-weight:600; letter-spacing:2px; color:#00E5FF; margin-bottom:16px; border-left:4px solid #00E5FF; padding-left:12px; line-height:1;">THE ULTIMATE PRE-WORKOUT</div>
        <div style="font-family:'Teko', sans-serif; font-size:80px; font-weight:700; line-height:0.9; margin-bottom:24px; text-shadow:0 0 20px rgba(255,51,102,0.3);">IGNITE V2.0</div>
        <div style="font-size:18px; color:#CCCCCC; line-height:1.6; margin-bottom:40px; max-width:500px;">Experience skin-tearing pumps, laser focus, and endless energy without the crash.</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:48px;">
          <div style="background:#111111; border:1px solid #222222; padding:20px; transform:skewX(-5deg);">
            <div style="transform:skewX(5deg);">
              <div style="font-family:'Teko', sans-serif; font-size:40px; font-weight:600; color:#FF3366; line-height:1;">350MG</div>
              <div style="font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Caffeine Matrix</div>
            </div>
          </div>
          <div style="background:#111111; border:1px solid #222222; padding:20px; transform:skewX(-5deg);">
            <div style="transform:skewX(5deg);">
              <div style="font-family:'Teko', sans-serif; font-size:40px; font-weight:600; color:#00E5FF; line-height:1;">8000MG</div>
              <div style="font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">L-Citrulline</div>
            </div>
          </div>
        </div>
        <div style="display:inline-flex; align-items:center; justify-content:center; background:transparent; border:2px solid #FF3366; font-family:'Teko', sans-serif; font-size:24px; font-weight:600; letter-spacing:2px; padding:16px 48px; transform:skewX(-10deg);">
          <span style="transform:skewX(10deg);">GET IGNITE NOW</span>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"fitness-supplements":\s*`[\s\S]*?`/,
  `"fitness-supplements": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('FITNESS SUPPLEMENTS template updated.');
