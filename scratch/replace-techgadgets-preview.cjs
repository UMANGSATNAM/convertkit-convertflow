const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#000000; color:#FFFFFF; min-height:100vh; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#007AFF; color:#FFFFFF; text-align:center; padding:10px; font-size:14px; font-weight:500;">
    The future is here. Pre-order the new Quantum series now.
  </div>

  <!-- Header -->
  <div style="padding:20px 40px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); position:sticky; top:0; z-index:50; border-bottom:1px solid rgba(255,255,255,0.1);">
    <div style="font-size:24px; font-weight:700; letter-spacing:1px;">NEXUS</div>
    <div style="display:flex; gap:32px; font-size:14px; font-weight:500;">
      <span style="color:#A1A1A6;">Mac</span>
      <span style="color:#A1A1A6;">iPad</span>
      <span style="color:#FFFFFF;">iPhone</span>
      <span style="color:#A1A1A6;">Watch</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:120px 24px; overflow:hidden;">
    <div style="position:absolute; inset:0; background:radial-gradient(circle at 50% 50%, rgba(0,122,255,0.15) 0%, rgba(0,0,0,1) 60%); z-index:1;"></div>
    <div style="max-width:1000px; margin:0 auto; text-align:center; position:relative; z-index:3;">
      <div style="display:inline-block; font-family:monospace; font-size:12px; color:#007AFF; letter-spacing:2px; margin-bottom:24px; border:1px solid rgba(0,122,255,0.3); padding:8px 16px; border-radius:20px; background:rgba(0,122,255,0.05);">INTRODUCING THE NEXT GENERATION</div>
      <h1 style="font-size:96px; font-weight:700; letter-spacing:-2px; margin-bottom:24px; background:linear-gradient(180deg, #FFFFFF 0%, #888888 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1.1;">Power. Redefined.</h1>
      <p style="font-size:24px; color:#A1A1A6; line-height:1.5; margin-bottom:48px; max-width:640px; margin-left:auto; margin-right:auto;">Experience the next generation of performance with our revolutionary new chip architecture.</p>
      <div style="display:flex; gap:24px; justify-content:center;">
        <div style="background:#007AFF; color:#FFFFFF; font-weight:500; padding:16px 32px; border-radius:30px;">PRE-ORDER NOW</div>
        <div style="background:rgba(255,255,255,0.1); color:#FFFFFF; font-weight:500; padding:16px 32px; border-radius:30px;">Watch the film</div>
      </div>
    </div>
    <div style="position:relative; z-index:2; width:100%; max-width:1000px; margin-top:80px;">
      <div style="position:relative; padding-bottom:50%;">
        <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 30px 60px rgba(0,122,255,0.3));">
      </div>
    </div>
  </div>

  <!-- Features Bento -->
  <div style="padding:120px 40px; background:#000000;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <h2 style="font-size:56px; font-weight:700; letter-spacing:-1px; margin:0;">Engineered for excellence.</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(12, 1fr); grid-template-rows:repeat(2, 400px); gap:24px;">
        <div style="grid-column:1 / 8; grid-row:1 / 2; background:#111111; border-radius:32px; padding:48px; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
          <div style="position:relative; z-index:2;">
            <h3 style="font-size:32px; font-weight:700; margin-bottom:16px;">M2 Architecture</h3>
            <p style="font-size:18px; color:#A1A1A6; margin:0; max-width:300px;">18% faster CPU. 35% faster GPU. Unbelievable efficiency.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" style="position:absolute; bottom:-10%; right:-10%; width:70%; height:auto; opacity:0.8; filter:hue-rotate(200deg) brightness(1.5);">
        </div>
        <div style="grid-column:8 / 13; grid-row:1 / 2; background:#111111; border-radius:32px; padding:48px; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:32px; font-weight:700; margin-bottom:16px;">All-Day Battery</h3>
          <p style="font-size:18px; color:#A1A1A6; margin:0;">Up to 24 hours of playback.</p>
          <div style="position:absolute; bottom:40px; right:40px; font-family:monospace; font-size:64px; font-weight:700; color:#007AFF;">24h</div>
        </div>
        <div style="grid-column:1 / 6; grid-row:2 / 3; background:#111111; border-radius:32px; padding:48px; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:32px; font-weight:700; margin-bottom:16px;">Retina Display</h3>
          <p style="font-size:18px; color:#A1A1A6; margin:0;">P3 wide color. 500 nits.</p>
          <div style="position:absolute; inset:0; background:linear-gradient(45deg, rgba(0,122,255,0.1), transparent); z-index:1;"></div>
        </div>
        <div style="grid-column:6 / 13; grid-row:2 / 3; background:#111111; border-radius:32px; padding:48px; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:32px; font-weight:700; margin-bottom:16px;">Connectivity</h3>
          <p style="font-size:18px; color:#A1A1A6; margin:0; max-width:300px;">Wi-Fi 6E. Bluetooth 5.3. Thunderbolt 4.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:120px 40px; border-top:1px solid rgba(255,255,255,0.1);">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <h2 style="font-size:56px; font-weight:700; margin-bottom:16px; letter-spacing:-1px;">The Lineup</h2>
        <div style="font-size:16px; font-weight:500; color:#007AFF;">COMPARE MODELS &rsaquo;</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
        <div style="background:#111111; border-radius:24px; padding:32px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:24px; font-weight:700; margin-bottom:8px;">Watch Series 8</h3>
          <div style="font-size:16px; color:#A1A1A6; margin-bottom:24px;">From $399</div>
          <div style="position:relative; padding-bottom:100%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
          </div>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button style="background:#007AFF; color:#FFFFFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Buy</button>
            <button style="background:rgba(255,255,255,0.1); color:#007AFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Learn more</button>
          </div>
        </div>
        <div style="background:#111111; border-radius:24px; padding:32px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:24px; font-weight:700; margin-bottom:8px;">Desktop Pro</h3>
          <div style="font-size:16px; color:#A1A1A6; margin-bottom:24px;">From $1299</div>
          <div style="position:relative; padding-bottom:100%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1606220588913-b3eea8f51200?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
          </div>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button style="background:#007AFF; color:#FFFFFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Buy</button>
            <button style="background:rgba(255,255,255,0.1); color:#007AFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Learn more</button>
          </div>
        </div>
        <div style="background:#111111; border-radius:24px; padding:32px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:24px; font-weight:700; margin-bottom:8px;">Wireless Earbuds</h3>
          <div style="font-size:16px; color:#A1A1A6; margin-bottom:24px;">From $249</div>
          <div style="position:relative; padding-bottom:100%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
          </div>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button style="background:#007AFF; color:#FFFFFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Buy</button>
            <button style="background:rgba(255,255,255,0.1); color:#007AFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Learn more</button>
          </div>
        </div>
        <div style="background:#111111; border-radius:24px; padding:32px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
          <h3 style="font-size:24px; font-weight:700; margin-bottom:8px;">Laptop M2</h3>
          <div style="font-size:16px; color:#A1A1A6; margin-bottom:24px;">From $999</div>
          <div style="position:relative; padding-bottom:100%; margin-bottom:32px;">
            <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;">
          </div>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button style="background:#007AFF; color:#FFFFFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Buy</button>
            <button style="background:rgba(255,255,255,0.1); color:#007AFF; border:none; padding:10px 24px; border-radius:20px; font-weight:500;">Learn more</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"tech-gadgets":\s*`[\s\S]*?`/,
  `"tech-gadgets": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('TECH GADGETS template updated.');
