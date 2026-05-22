const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FAF6F0; color:#3E2723; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#3E2723; color:#FAF6F0; text-align:center; padding:10px; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">
    Freshly roasted in Portland. Free shipping on orders over $50.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(62,39,35,0.1);">
    <div style="font-family:'Georgia', serif; font-size:28px; font-weight:700; letter-spacing:2px;">TERROIR</div>
    <div style="display:flex; gap:32px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
      <span style="color:#D84315; border-bottom:2px solid #D84315; padding-bottom:4px;">Shop</span>
      <span>About</span>
      <span>Wholesale</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; overflow:hidden;">
    <div style="position:absolute; inset:0; background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E'); z-index:1; pointer-events:none;"></div>
    <div style="max-width:1400px; margin:0 auto; padding:80px 24px; display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; position:relative; z-index:2; min-height:80vh;">
      <div style="padding-right:40px;">
        <div style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:2px; color:#D84315; margin-bottom:24px; display:inline-flex; align-items:center; gap:12px;">
          <span style="width:30px; height:2px; background:#D84315;"></span>
          Small Batch Roastery
        </div>
        <h1 style="font-family:'Georgia', serif; font-size:80px; font-weight:400; margin:0 0 32px 0; line-height:1.1; letter-spacing:-1px;">Roasted with intention.</h1>
        <p style="font-size:20px; font-weight:400; color:rgba(62,39,35,0.8); line-height:1.6; margin:0 0 48px 0; max-width:480px;">Ethically sourced, carefully roasted, and delivered fresh to your door.</p>
        <div style="display:flex; gap:24px; align-items:center;">
          <div style="background:#3E2723; color:#FAF6F0; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:1px; padding:18px 40px; border-radius:4px;">SHOP COFFEE</div>
          <div style="font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#3E2723; border-bottom:2px solid #D84315; padding-bottom:4px;">Our Story</div>
        </div>
      </div>
      <div style="position:relative; height:100%; min-height:600px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:80%; height:80%; background:#EADCC8; border-radius:40% 60% 70% 30% / 40% 50% 60% 50%; z-index:1;"></div>
        <div style="position:relative; z-index:2; width:70%; aspect-ratio:3/4; border-radius:200px 200px 0 0; overflow:hidden; box-shadow:0 30px 60px rgba(62,39,35,0.15);">
          <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover; filter:sepia(20%) contrast(1.1);">
        </div>
        <div style="position:absolute; bottom:10%; right:10%; z-index:3; width:35%; aspect-ratio:1/1; border-radius:50%; overflow:hidden; border:8px solid #FAF6F0; box-shadow:0 20px 40px rgba(62,39,35,0.1);">
          <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>
    </div>
  </div>

  <!-- Roast Info -->
  <div style="background:#3E2723; color:#FAF6F0; padding:120px 24px; position:relative;">
    <div style="position:absolute; inset:0; background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E'); z-index:1; pointer-events:none;"></div>
    <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; position:relative; z-index:2;">
      <div style="position:relative;">
        <div style="aspect-ratio:4/5; overflow:hidden; border-radius:8px;">
          <img src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover; filter:sepia(30%) contrast(1.2);">
        </div>
        <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; border:2px solid #D84315; border-radius:50%; z-index:-1;"></div>
        <div style="position:absolute; bottom:-20px; left:-20px; width:80px; height:80px; background:#D84315; border-radius:50%; z-index:-1; opacity:0.8;"></div>
      </div>
      <div>
        <div style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:2px; color:#D84315; margin-bottom:24px;">Our Process</div>
        <h2 style="font-family:'Georgia', serif; font-size:56px; font-weight:400; margin:0 0 32px 0; line-height:1.2;">The Art of the Roast</h2>
        <p style="font-size:18px; font-weight:300; color:rgba(250,246,240,0.8); line-height:1.8; margin:0 0 40px 0;">We believe that every bean has a story to tell. Our light-roast philosophy highlights the natural terroir, resulting in a vibrant, complex cup.</p>
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="display:flex; align-items:flex-start; gap:16px;">
            <span style="color:#D84315; font-size:20px;">✓</span>
            <div>
              <div style="font-family:'Georgia', serif; font-size:20px; margin-bottom:8px;">Ethical Sourcing</div>
              <div style="font-size:15px; color:rgba(250,246,240,0.6); line-height:1.5;">We pay above Fair Trade prices to ensure farmers thrive.</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:16px;">
            <span style="color:#D84315; font-size:20px;">✓</span>
            <div>
              <div style="font-family:'Georgia', serif; font-size:20px; margin-bottom:8px;">Precision Roasting</div>
              <div style="font-size:15px; color:rgba(250,246,240,0.6); line-height:1.5;">Roasted on a vintage Probat, blending intuition with technology.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Products -->
  <div style="padding:120px 24px;">
    <div style="max-width:1400px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <div>
          <h2 style="font-family:'Georgia', serif; font-size:48px; font-weight:400; margin:0 0 16px 0;">Current Offerings</h2>
          <p style="font-size:16px; color:rgba(62,39,35,0.7); margin:0; max-width:400px;">Explore our current seasonal offerings, roasted to highlight their unique origin characteristics.</p>
        </div>
        <div style="font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#D84315; border-bottom:2px solid #D84315; padding-bottom:4px;">VIEW ALL COFFEE</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:32px;">
        <div style="display:flex; flex-direction:column;">
          <div style="position:relative; aspect-ratio:3/4; overflow:hidden; border-radius:8px; margin-bottom:24px; background:#F2EBE1;">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;">
            <div style="position:absolute; top:16px; left:16px; background:#D84315; color:#FAF6F0; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 8px; border-radius:2px;">Light Roast</div>
          </div>
          <h3 style="font-family:'Georgia', serif; font-size:24px; font-weight:400; margin:0 0 8px 0;">Ethiopia Yirgacheffe</h3>
          <div style="font-size:14px; color:rgba(62,39,35,0.6); margin-bottom:12px;">Jasmine, Peach, Black Tea</div>
          <div style="font-size:16px; font-weight:600;">$22.00</div>
        </div>
        <div style="display:flex; flex-direction:column;">
          <div style="position:relative; aspect-ratio:3/4; overflow:hidden; border-radius:8px; margin-bottom:24px; background:#F2EBE1;">
            <img src="https://images.unsplash.com/photo-1587049352847-81a56d773c1c?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;">
            <div style="position:absolute; top:16px; left:16px; background:#D84315; color:#FAF6F0; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 8px; border-radius:2px;">Medium Roast</div>
          </div>
          <h3 style="font-family:'Georgia', serif; font-size:24px; font-weight:400; margin:0 0 8px 0;">Colombia Supremo</h3>
          <div style="font-size:14px; color:rgba(62,39,35,0.6); margin-bottom:12px;">Chocolate, Caramel, Apple</div>
          <div style="font-size:16px; font-weight:600;">$20.00</div>
        </div>
        <div style="display:flex; flex-direction:column;">
          <div style="position:relative; aspect-ratio:3/4; overflow:hidden; border-radius:8px; margin-bottom:24px; background:#F2EBE1;">
            <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;">
            <div style="position:absolute; top:16px; left:16px; background:#D84315; color:#FAF6F0; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 8px; border-radius:2px;">Dark Roast</div>
          </div>
          <h3 style="font-family:'Georgia', serif; font-size:24px; font-weight:400; margin:0 0 8px 0;">Sumatra Mandheling</h3>
          <div style="font-size:14px; color:rgba(62,39,35,0.6); margin-bottom:12px;">Earthy, Cedar, Dark Chocolate</div>
          <div style="font-size:16px; font-weight:600;">$21.00</div>
        </div>
        <div style="display:flex; flex-direction:column;">
          <div style="position:relative; aspect-ratio:3/4; overflow:hidden; border-radius:8px; margin-bottom:24px; background:#F2EBE1;">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;">
            <div style="position:absolute; top:16px; left:16px; background:#D84315; color:#FAF6F0; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:4px 8px; border-radius:2px;">Espresso</div>
          </div>
          <h3 style="font-family:'Georgia', serif; font-size:24px; font-weight:400; margin:0 0 8px 0;">House Blend</h3>
          <div style="font-size:14px; color:rgba(62,39,35,0.6); margin-bottom:12px;">Balanced, Cocoa, Nutty</div>
          <div style="font-size:16px; font-weight:600;">$20.00</div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"artisan-coffee":\s*`[\s\S]*?`/,
  `"artisan-coffee": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ARTISAN COFFEE template updated.');
