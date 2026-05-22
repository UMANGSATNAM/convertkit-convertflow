const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FAFAFA; color:#333333; min-height:100vh; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#E8D5CC; color:#333333; text-align:center; padding:10px; font-size:12px; font-weight:500; letter-spacing:1px; text-transform:uppercase;">
    Clinically proven. Dermatologist tested. Free shipping on all orders.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #EEEEEE; background:#FAFAFA; position:sticky; top:0; z-index:50;">
    <div style="font-size:24px; font-weight:300; letter-spacing:4px;">A U R A</div>
    <div style="display:flex; gap:32px; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:2px;">
      <span style="color:#8C8C8C; border-bottom:1px solid #8C8C8C; padding-bottom:4px;">Shop All</span>
      <span>Regimens</span>
      <span>Science</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:60px; padding:80px 24px; max-width:1400px; margin:0 auto; min-height:80vh; align-items:center;">
    <div style="padding-right:40px;">
      <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:3px; color:#8C8C8C; margin-bottom:32px; display:inline-flex; align-items:center; gap:16px;">
        Clinical Formulation <span style="width:40px; height:1px; background:#D1DAC5;"></span>
      </div>
      <h1 style="font-size:72px; font-weight:300; letter-spacing:-1px; margin:0 0 32px 0; line-height:1.1;">Science meets skin.</h1>
      <p style="font-size:18px; color:#666666; line-height:1.7; margin:0 0 48px 0; max-width:440px;">Formulated with active ingredients at clinical concentrations for visible, lasting results.</p>
      <div style="display:flex; gap:24px; align-items:center;">
        <div style="background:#333333; color:#FAFAFA; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:2px; padding:16px 36px;">SHOP ROUTINES</div>
        <div style="font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid #333333; padding-bottom:4px;">Our Ingredients</div>
      </div>
    </div>
    <div style="position:relative; height:100%; min-height:600px; display:flex; justify-content:center; align-items:center;">
      <div style="position:absolute; width:80%; height:90%; background:#E8D5CC; border-radius:50% 50% 0 0; bottom:0; z-index:1; opacity:0.6;"></div>
      <div style="position:relative; z-index:2; width:85%; height:90%; overflow:hidden;">
        <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;">
      </div>
    </div>
  </div>

  <!-- Ingredients -->
  <div style="padding:120px 24px; border-top:1px solid #EEEEEE; background:#FFFFFF;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:3px; color:#8C8C8C; margin-bottom:16px;">Transparent Formulation</div>
        <h2 style="font-size:48px; font-weight:300; letter-spacing:-1px; margin:0 0 16px 0;">Clinical Efficacy</h2>
        <p style="font-size:18px; color:#666666; margin:0 auto; max-width:500px; line-height:1.6;">We use only what skin needs. No fillers, no compromises.</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:40px;">
        <div style="text-align:center; padding:40px; background:#FAFAFA;">
          <div style="width:80px; height:80px; background:#E8D5CC; border-radius:50%; margin:0 auto 24px auto;"></div>
          <h3 style="font-size:20px; font-weight:400; margin:0 0 12px 0;">Niacinamide 10%</h3>
          <p style="font-size:15px; color:#666666; line-height:1.6; margin:0;">Minimizes enlarged pores and improves uneven skin tone.</p>
        </div>
        <div style="text-align:center; padding:40px; background:#FAFAFA;">
          <div style="width:80px; height:80px; background:#D1DAC5; border-radius:50%; margin:0 auto 24px auto;"></div>
          <h3 style="font-size:20px; font-weight:400; margin:0 0 12px 0;">Hyaluronic Acid 2%</h3>
          <p style="font-size:15px; color:#666666; line-height:1.6; margin:0;">Delivers hydration to multiple layers, plumping and smoothing.</p>
        </div>
        <div style="text-align:center; padding:40px; background:#FAFAFA;">
          <div style="width:80px; height:80px; background:#E5E5E5; border-radius:50%; margin:0 auto 24px auto;"></div>
          <h3 style="font-size:20px; font-weight:400; margin:0 0 12px 0;">Squalane</h3>
          <p style="font-size:15px; color:#666666; line-height:1.6; margin:0;">Restores skin's suppleness without clogging pores.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Products -->
  <div style="padding:120px 24px; border-top:1px solid #EEEEEE;">
    <div style="max-width:1400px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:80px;">
        <div>
          <h2 style="font-size:48px; font-weight:300; letter-spacing:-1px; margin:0 0 16px 0;">The Core Regimen</h2>
          <p style="font-size:16px; color:#666666; margin:0;">Build your foundation for healthy skin.</p>
        </div>
        <div style="font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid #333333; padding-bottom:4px;">VIEW ALL PRODUCTS</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div>
          <div style="background:#FAFAFA; aspect-ratio:4/5; padding:40px; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:darken;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Vitamin C Serum</h3>
            <div style="font-size:16px;">$48</div>
          </div>
          <div style="font-size:14px; color:#8C8C8C;">Targeted Treatment</div>
        </div>
        <div>
          <div style="background:#FAFAFA; aspect-ratio:4/5; padding:40px; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:darken;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Gentle Cleanser</h3>
            <div style="font-size:16px;">$32</div>
          </div>
          <div style="font-size:14px; color:#8C8C8C;">Step 1: Cleanse</div>
        </div>
        <div>
          <div style="background:#FAFAFA; aspect-ratio:4/5; padding:40px; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:darken;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Daily Hydrator</h3>
            <div style="font-size:16px;">$42</div>
          </div>
          <div style="font-size:14px; color:#8C8C8C;">Step 3: Moisturize</div>
        </div>
        <div>
          <div style="background:#FAFAFA; aspect-ratio:4/5; padding:40px; margin-bottom:24px;">
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:darken;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Exfoliating Toner</h3>
            <div style="font-size:16px;">$36</div>
          </div>
          <div style="font-size:14px; color:#8C8C8C;">Step 2: Treat</div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"premium-skincare":\s*`[\s\S]*?`/,
  `"premium-skincare": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PREMIUM SKINCARE template updated.');
