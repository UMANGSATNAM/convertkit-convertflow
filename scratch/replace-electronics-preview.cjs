const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#0F0F0F; color:#FFFFFF; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#3B82F6; color:#FFFFFF; text-align:center; padding:12px; font-family:'Space Grotesk', sans-serif; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">
    INTRODUCING THE ALL-NEW X-SERIES. PRE-ORDER NOW.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05); background:#0F0F0F;">
    <div style="font-family:'Space Grotesk', sans-serif; font-size:24px; font-weight:700; letter-spacing:2px;">TECHNOVA</div>
    <div style="display:flex; gap:32px; font-size:14px; font-weight:500; color:#9CA3AF;">
      <span style="color:#FFFFFF;">Store</span>
      <span>Mac</span>
      <span>iPad</span>
      <span>iPhone</span>
      <span>Watch</span>
      <span>Vision</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:flex; flex-direction:column; align-items:center; text-align:center; padding:100px 40px; background:#0F0F0F; overflow:hidden;">
    <div style="position:absolute; top:-20%; left:-10%; width:50vw; height:50vw; background:radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,15,15,0) 70%); z-index:1;"></div>
    
    <div style="position:relative; z-index:2;">
      <div style="font-family:'Space Grotesk', sans-serif; font-size:12px; font-weight:600; letter-spacing:4px; color:#3B82F6; margin-bottom:24px; background:rgba(59,130,246,0.1); padding:8px 24px; border-radius:30px; display:inline-block; border:1px solid rgba(59,130,246,0.2);">
        NEXT GENERATION
      </div>
      <div style="font-family:'Space Grotesk', sans-serif; font-size:96px; font-weight:700; line-height:1; color:#FFFFFF; margin-bottom:24px; letter-spacing:-2px; text-shadow:0 0 40px rgba(255,255,255,0.1);">Beyond Reality</div>
      <div style="font-size:24px; font-weight:300; color:#9CA3AF; line-height:1.6; margin-bottom:48px; max-width:600px; margin-left:auto; margin-right:auto;">Experience the future with our most advanced spatial computing headset yet.</div>
      
      <div style="display:flex; gap:20px; justify-content:center; margin-bottom:80px;">
        <div style="background:#FFFFFF; color:#0F0F0F; font-family:'Space Grotesk', sans-serif; font-size:14px; font-weight:600; letter-spacing:1px; padding:18px 40px; border-radius:30px;">PRE-ORDER NOW</div>
        <div style="border:1px solid rgba(255,255,255,0.2); color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:14px; font-weight:600; letter-spacing:1px; padding:18px 40px; border-radius:30px; display:flex; align-items:center; gap:8px;">
          <span>▶</span> WATCH FILM
        </div>
      </div>
    </div>
    
    <div style="position:relative; width:100%; max-width:800px; z-index:2;">
      <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80" alt="VR" style="width:100%; filter:drop-shadow(0 20px 40px rgba(59,130,246,0.2));">
    </div>
  </div>

  <!-- Specs Grid -->
  <div style="background:#000000; padding:100px 40px; border-top:1px solid rgba(255,255,255,0.05);">
    <div style="font-family:'Space Grotesk', sans-serif; font-size:48px; font-weight:700; text-align:center; margin-bottom:80px; letter-spacing:-1px;">Technical Specifications</div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1px; background:rgba(255,255,255,0.05); max-width:1440px; margin:0 auto;">
      <div style="background:#0F0F0F; padding:40px; text-align:center;">
        <div style="font-size:32px; margin-bottom:24px;">🖥️</div>
        <div style="font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:600; margin-bottom:8px; text-transform:uppercase;">Display</div>
        <div style="color:#9CA3AF;">Micro-OLED 4K per eye</div>
      </div>
      <div style="background:#0F0F0F; padding:40px; text-align:center;">
        <div style="font-size:32px; margin-bottom:24px;">⚡</div>
        <div style="font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:600; margin-bottom:8px; text-transform:uppercase;">Processor</div>
        <div style="color:#9CA3AF;">M3 Silicon Neural Engine</div>
      </div>
      <div style="background:#0F0F0F; padding:40px; text-align:center;">
        <div style="font-size:32px; margin-bottom:24px;">🔊</div>
        <div style="font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:600; margin-bottom:8px; text-transform:uppercase;">Audio</div>
        <div style="color:#9CA3AF;">Spatial Audio System</div>
      </div>
      <div style="background:#0F0F0F; padding:40px; text-align:center;">
        <div style="font-size:32px; margin-bottom:24px;">⚖️</div>
        <div style="font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:600; margin-bottom:8px; text-transform:uppercase;">Weight</div>
        <div style="color:#9CA3AF;">Ultra-light 350g</div>
      </div>
    </div>
  </div>

  <!-- Featured Collection -->
  <div style="padding:120px 40px; background:#000000;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <div style="font-family:'Space Grotesk', sans-serif; font-size:48px; font-weight:700; letter-spacing:-1px;">Featured Devices</div>
        <div style="font-family:'Space Grotesk', sans-serif; font-size:14px; font-weight:600; color:#3B82F6; letter-spacing:1px;">VIEW ALL ↗</div>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
        <div style="background:#0F0F0F; border:1px solid rgba(255,255,255,0.05); border-radius:12px; overflow:hidden;">
          <div style="position:relative; padding-bottom:100%; background:#1A1A1A;">
            <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.9);">
            <div style="position:absolute; top:12px; left:12px; background:#3B82F6; font-family:'Space Grotesk', sans-serif; font-size:10px; font-weight:700; padding:4px 8px; border-radius:4px; letter-spacing:1px;">NEW</div>
          </div>
          <div style="padding:24px;">
            <div style="font-family:'Space Grotesk', sans-serif; font-size:12px; color:#3B82F6; margin-bottom:8px; letter-spacing:1px;">AUDIO</div>
            <div style="font-size:18px; font-weight:500; margin-bottom:16px;">Proxima Wireless Headphones</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-family:'Space Grotesk', sans-serif; font-size:18px; font-weight:600;">$299.00</div>
              <div style="width:36px; height:36px; border:1px solid rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">+</div>
            </div>
          </div>
        </div>
        <div style="background:#0F0F0F; border:1px solid rgba(255,255,255,0.05); border-radius:12px; overflow:hidden;">
          <div style="position:relative; padding-bottom:100%; background:#1A1A1A;">
            <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.9);">
          </div>
          <div style="padding:24px;">
            <div style="font-family:'Space Grotesk', sans-serif; font-size:12px; color:#3B82F6; margin-bottom:8px; letter-spacing:1px;">WEARABLES</div>
            <div style="font-size:18px; font-weight:500; margin-bottom:16px;">Titan Smartwatch Series 7</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-family:'Space Grotesk', sans-serif; font-size:18px; font-weight:600;">$449.00</div>
              <div style="width:36px; height:36px; border:1px solid rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">+</div>
            </div>
          </div>
        </div>
        <div style="background:#0F0F0F; border:1px solid rgba(255,255,255,0.05); border-radius:12px; overflow:hidden;">
          <div style="position:relative; padding-bottom:100%; background:#1A1A1A;">
            <img src="https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.9);">
          </div>
          <div style="padding:24px;">
            <div style="font-family:'Space Grotesk', sans-serif; font-size:12px; color:#3B82F6; margin-bottom:8px; letter-spacing:1px;">SMART HOME</div>
            <div style="font-size:18px; font-weight:500; margin-bottom:16px;">Nexus Home Assistant</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-family:'Space Grotesk', sans-serif; font-size:18px; font-weight:600;">$129.00</div>
              <div style="width:36px; height:36px; border:1px solid rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">+</div>
            </div>
          </div>
        </div>
        <div style="background:#0F0F0F; border:1px solid rgba(255,255,255,0.05); border-radius:12px; overflow:hidden;">
          <div style="position:relative; padding-bottom:100%; background:#1A1A1A;">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.9);">
          </div>
          <div style="padding:24px;">
            <div style="font-family:'Space Grotesk', sans-serif; font-size:12px; color:#3B82F6; margin-bottom:8px; letter-spacing:1px;">ACCESSORIES</div>
            <div style="font-size:18px; font-weight:500; margin-bottom:16px;">Aura Soundbar Pro</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-family:'Space Grotesk', sans-serif; font-size:18px; font-weight:600;">$199.00</div>
              <div style="width:36px; height:36px; border:1px solid rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"electronics":\s*`[\s\S]*?`/,
  `"electronics": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('TECH & ELECTRONICS template updated.');
