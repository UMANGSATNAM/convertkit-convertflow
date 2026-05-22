const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#0F1115; color:#FFFFFF; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#3B82F6; color:#FFFFFF; text-align:center; padding:8px; font-size:11px; letter-spacing:2px; font-weight:700; text-transform:uppercase;">
    FREE EXPEDITED SHIPPING ON ORDERS OVER $50
  </div>

  <!-- Header -->
  <div style="padding:20px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05);">
    <div style="font-size:24px; font-weight:800; letter-spacing:1px;">STACKD</div>
    <div style="display:flex; gap:32px; font-size:13px; font-weight:600; color:#9CA3AF; letter-spacing:1px; text-transform:uppercase;">
      <span style="color:#FFFFFF;">Ecosystem</span>
      <span>Power</span>
      <span>Protection</span>
      <span>Support</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:grid; grid-template-columns:1fr 1.2fr; gap:60px; padding:80px 40px; align-items:center; max-width:1440px; margin:0 auto; overflow:hidden;">
    <div style="position:absolute; inset:0; opacity:0.05; background-image:linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px); background-size:50px 50px; z-index:0;"></div>
    
    <div style="padding-right:40px; position:relative; z-index:2;">
      <div style="display:inline-flex; align-items:center; gap:12px; font-size:12px; font-weight:700; letter-spacing:3px; color:#3B82F6; margin-bottom:24px; background:rgba(59,130,246,0.1); padding:8px 16px; border-radius:4px; border:1px solid rgba(59,130,246,0.2);">
        <div style="width:6px; height:6px; background:#3B82F6; border-radius:50%; box-shadow:0 0 10px #3B82F6;"></div>
        NEXT-GEN PROTECTION
      </div>
      <div style="font-size:64px; font-weight:800; line-height:1.05; letter-spacing:-1px; margin-bottom:24px;">Engineered for the Extraordinary</div>
      <div style="font-size:18px; color:#9CA3AF; line-height:1.6; margin-bottom:40px; max-width:480px;">Military-grade materials meet minimalist design. Elevate your device with premium accessories built for the modern ecosystem.</div>
      <div style="display:flex; gap:16px;">
        <div style="background:#3B82F6; color:#FFFFFF; padding:18px 40px; font-size:14px; font-weight:600; letter-spacing:1px; border-radius:4px;">SHOP NEW ARRIVALS</div>
        <div style="border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05); padding:18px 40px; font-size:14px; font-weight:600; letter-spacing:1px; border-radius:4px;">EXPLORE ECOSYSTEM</div>
      </div>
    </div>
    
    <div style="position:relative; z-index:2; height:500px; display:flex; justify-content:center; align-items:center;">
      <div style="position:absolute; width:60%; height:60%; background:#3B82F6; filter:blur(100px); opacity:0.2;"></div>
      <div style="width:80%; height:80%; background:url('https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80') center/contain no-repeat; filter:drop-shadow(0 30px 40px rgba(0,0,0,0.5)); position:relative; z-index:3;"></div>
    </div>
  </div>

  <!-- Marquee -->
  <div style="border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); padding:24px 0; font-size:14px; font-weight:700; letter-spacing:2px; color:#9CA3AF; overflow:hidden;">
    <div style="display:flex; gap:40px; white-space:nowrap;">
      <span>MAGSAFE COMPATIBLE /// MIL-STD-810G DROP TESTED /// AEROSPACE-GRADE ALUMINUM /// 2-YEAR WARRANTY ///</span>
      <span>MAGSAFE COMPATIBLE /// MIL-STD-810G DROP TESTED /// AEROSPACE-GRADE ALUMINUM /// 2-YEAR WARRANTY ///</span>
    </div>
  </div>

  <!-- Grid Highlights -->
  <div style="padding:100px 40px; max-width:1440px; margin:0 auto;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:24px;">
      <div style="font-size:48px; font-weight:800; letter-spacing:-1px;">Ecosystem</div>
      <div style="font-size:13px; font-weight:600; color:#3B82F6; letter-spacing:2px; text-transform:uppercase;">Explore All</div>
    </div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
      <div style="aspect-ratio:4/5; background:#1A1D24; border:1px solid rgba(255,255,255,0.05); border-radius:8px; position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=400&q=80') center/cover; opacity:0.6;"></div>
        <div style="position:absolute; bottom:24px; left:24px; font-size:18px; font-weight:700;">Cases & Protection</div>
      </div>
      <div style="aspect-ratio:4/5; background:#1A1D24; border:1px solid rgba(255,255,255,0.05); border-radius:8px; position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80') center/cover; opacity:0.6;"></div>
        <div style="position:absolute; bottom:24px; left:24px; font-size:18px; font-weight:700;">Power & Charging</div>
      </div>
      <div style="aspect-ratio:4/5; background:#1A1D24; border:1px solid rgba(255,255,255,0.05); border-radius:8px; position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80') center/cover; opacity:0.6;"></div>
        <div style="position:absolute; bottom:24px; left:24px; font-size:18px; font-weight:700;">Audio & Hubs</div>
      </div>
      <div style="aspect-ratio:4/5; background:#1A1D24; border:1px solid rgba(255,255,255,0.05); border-radius:8px; position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&w=400&q=80') center/cover; opacity:0.6;"></div>
        <div style="position:absolute; bottom:24px; left:24px; font-size:18px; font-weight:700;">Stands & Mounts</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"mobile-accessories":\s*`[\s\S]*?`/,
  `"mobile-accessories": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('MOBILE ACCESSORIES template updated.');
