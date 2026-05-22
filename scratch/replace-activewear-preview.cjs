const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#111111; color:#FFFFFF; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#CCFF00; color:#111111; text-align:center; padding:10px; font-family:'Oswald', sans-serif; font-size:14px; font-weight:600; letter-spacing:1px; text-transform:uppercase; font-style:italic;">
    FREE SHIPPING ON ALL ORDERS OVER $75
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#111111; border-bottom:1px solid #222222;">
    <div style="font-family:'Oswald', sans-serif; font-size:32px; font-weight:700; font-style:italic; letter-spacing:2px; color:#FFFFFF;">A P E X</div>
    <div style="display:flex; gap:32px; font-family:'Oswald', sans-serif; font-size:16px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
      <span style="color:#CCFF00;">Men</span>
      <span>Women</span>
      <span>Accessories</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; min-height:80vh; display:flex; align-items:center; overflow:hidden;">
    <div style="position:absolute; inset:0; z-index:1;">
      <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80" style="width:100%; height:100%; object-fit:cover; opacity:0.4; mix-blend-mode:luminosity;">
      <div style="position:absolute; inset:0; background:linear-gradient(90deg, #111111 0%, rgba(17,17,17,0.7) 50%, transparent 100%);"></div>
    </div>
    
    <div style="position:absolute; top:0; right:10%; width:100px; height:200%; background:#CCFF00; transform:rotate(15deg) translateY(-25%); z-index:2; opacity:0.9; mix-blend-mode:screen;"></div>
    
    <div style="max-width:1440px; margin:0 auto; padding:0 40px; width:100%; position:relative; z-index:3;">
      <div style="max-width:700px;">
        <h1 style="font-family:'Oswald', sans-serif; font-size:100px; font-weight:700; font-style:italic; line-height:0.9; margin-bottom:24px; text-transform:uppercase; letter-spacing:-2px; text-shadow:4px 4px 0px rgba(204,255,0,0.5);">PUSH YOUR<br>LIMITS.</h1>
        <p style="font-size:18px; font-weight:500; line-height:1.6; margin-bottom:40px; max-width:480px;">Next-generation activewear engineered for peak performance. Do more. Be more.</p>
        <div style="display:inline-block; background:#CCFF00; color:#111111; font-family:'Oswald', sans-serif; font-size:18px; font-weight:700; font-style:italic; text-transform:uppercase; letter-spacing:1px; padding:18px 48px; transform:skewX(-10deg);">
          <span style="transform:skewX(10deg); display:block;">SHOP NEW ARRIVALS</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div style="background:#0A0A0A; padding:100px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <h2 style="font-family:'Oswald', sans-serif; font-size:64px; font-weight:700; font-style:italic; text-transform:uppercase; margin:0; line-height:1;">Built to Perform</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px;">
        <div style="background:#111111; padding:40px 32px; border-left:4px solid transparent;">
          <div style="font-family:'Oswald', sans-serif; font-size:48px; font-weight:700; color:#1A1A1A; margin-bottom:16px; -webkit-text-stroke:1px #333333;">01</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; font-style:italic; text-transform:uppercase; margin-bottom:12px;">AeroTech™</h3>
          <p style="color:#AAAAAA; margin:0;">Ultra-breathable fabric.</p>
        </div>
        <div style="background:#151515; padding:40px 32px; border-left:4px solid #CCFF00; transform:translateX(10px);">
          <div style="font-family:'Oswald', sans-serif; font-size:48px; font-weight:700; color:#CCFF00; margin-bottom:16px;">02</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; font-style:italic; text-transform:uppercase; margin-bottom:12px;">4-Way Stretch</h3>
          <p style="color:#AAAAAA; margin:0;">Moves with your body.</p>
        </div>
        <div style="background:#111111; padding:40px 32px; border-left:4px solid transparent;">
          <div style="font-family:'Oswald', sans-serif; font-size:48px; font-weight:700; color:#1A1A1A; margin-bottom:16px; -webkit-text-stroke:1px #333333;">03</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; font-style:italic; text-transform:uppercase; margin-bottom:12px;">Sweat Wicking</h3>
          <p style="color:#AAAAAA; margin:0;">Keeps you dry.</p>
        </div>
        <div style="background:#111111; padding:40px 32px; border-left:4px solid transparent;">
          <div style="font-family:'Oswald', sans-serif; font-size:48px; font-weight:700; color:#1A1A1A; margin-bottom:16px; -webkit-text-stroke:1px #333333;">04</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; font-style:italic; text-transform:uppercase; margin-bottom:12px;">Seamless</h3>
          <p style="color:#AAAAAA; margin:0;">Zero chafing.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Products -->
  <div style="background:#111111; padding:100px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <h2 style="font-family:'Oswald', sans-serif; font-size:64px; font-weight:700; font-style:italic; text-transform:uppercase; margin:0; line-height:1;">Latest Gear</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#1A1A1A; margin-bottom:20px; clip-path:polygon(0 0, 100% 0, 100% 95%, 0 100%);">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; margin-bottom:4px;">Men's Training</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:600; font-style:italic; text-transform:uppercase; margin:0;">Apex Pro Tee</h3>
        </div>
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#1A1A1A; margin-bottom:20px; clip-path:polygon(0 0, 100% 0, 100% 95%, 0 100%);">
            <img src="https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; top:16px; right:16px; background:#CCFF00; color:#111111; font-family:'Oswald', sans-serif; font-size:12px; font-weight:700; text-transform:uppercase; padding:6px 12px; transform:skewX(-10deg);">
              <span style="transform:skewX(10deg); display:block;">NEW</span>
            </div>
          </div>
          <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; margin-bottom:4px;">Women's Running</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:600; font-style:italic; text-transform:uppercase; margin:0;">Velocity Leggings</h3>
        </div>
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#1A1A1A; margin-bottom:20px; clip-path:polygon(0 0, 100% 0, 100% 95%, 0 100%);">
            <img src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; margin-bottom:4px;">Accessories</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:600; font-style:italic; text-transform:uppercase; margin:0;">Aero Cap</h3>
        </div>
        <div>
          <div style="position:relative; overflow:hidden; padding-bottom:125%; background:#1A1A1A; margin-bottom:20px; clip-path:polygon(0 0, 100% 0, 100% 95%, 0 100%);">
            <img src="https://images.unsplash.com/photo-1608248593842-8021c64e03f0?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-size:12px; font-weight:600; color:#888888; text-transform:uppercase; margin-bottom:4px;">Men's Running</div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:600; font-style:italic; text-transform:uppercase; margin:0;">Pace Shorts</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Banner -->
  <div style="background:#CCFF00; padding:120px 40px; position:relative; overflow:hidden;">
    <div style="position:absolute; top:0; bottom:0; left:50%; right:0; background:#111111; clip-path:polygon(10% 0, 100% 0, 100% 100%, 0 100%); z-index:1;"></div>
    <div style="max-width:1440px; margin:0 auto; position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; align-items:center;">
      <div style="padding-right:40px;">
        <h2 style="font-family:'Oswald', sans-serif; font-size:80px; font-weight:700; font-style:italic; color:#111111; margin-bottom:24px; text-transform:uppercase; line-height:1;">JOIN THE<br>MOVEMENT.</h2>
        <p style="font-size:18px; font-weight:600; color:#111111; margin-bottom:40px; max-width:400px;">Gear up and get ready to dominate your next workout.</p>
      </div>
      <div style="display:flex; justify-content:center; padding-left:40px;">
        <div style="display:inline-block; background:#FFFFFF; color:#111111; font-family:'Oswald', sans-serif; font-size:24px; font-weight:700; font-style:italic; text-transform:uppercase; padding:24px 64px; transform:skewX(-10deg); box-shadow:8px 8px 0px #CCFF00;">
          <span style="transform:skewX(10deg); display:block;">SHOP ALL GEAR</span>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"activewear":\s*`[\s\S]*?`/,
  `"activewear": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ACTIVEWEAR template updated.');
