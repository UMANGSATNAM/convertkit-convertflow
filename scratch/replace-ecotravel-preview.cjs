const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#F5F7F2; color:#2C3E2D; min-height:100vh; font-family:'DM Sans', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#2C3E2D; color:#FFFFFF; text-align:center; padding:10px; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">
    1% of all sales go to environmental conservation.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#F5F7F2; border-bottom:1px solid #D9D9D9;">
    <div style="font-family:'Oswald', sans-serif; font-size:28px; font-weight:700; letter-spacing:1px;">NOMADIC ECO.</div>
    <div style="display:flex; gap:32px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">
      <span style="color:#D96A42; border-bottom:2px solid #D96A42; padding-bottom:4px;">Gear</span>
      <span>Impact</span>
      <span>Field Notes</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; min-height:80vh; display:flex; align-items:center; background:#2C3E2D; overflow:hidden; padding:120px 40px;">
    <div style="position:absolute; inset:0; z-index:1;">
      <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80" style="width:100%; height:100%; object-fit:cover; opacity:0.6; mix-blend-mode:luminosity;">
      <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(44,62,45,0.9) 0%, rgba(44,62,45,0.4) 50%, rgba(44,62,45,0.1) 100%);"></div>
    </div>
    <div style="position:relative; z-index:2; max-width:720px; margin:0 auto; text-align:center;">
      <div style="display:inline-flex; align-items:center; gap:12px; background:rgba(217,106,66,0.9); color:#FFFFFF; padding:8px 16px; border-radius:4px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:32px;">
        New Arrival: The Alpine Series
      </div>
      <h1 style="font-family:'Oswald', sans-serif; font-size:80px; font-weight:700; color:#FFFFFF; line-height:1; margin-bottom:24px; text-transform:uppercase; letter-spacing:-1px;">Explore Responsibly.</h1>
      <p style="font-size:22px; color:#F5F7F2; line-height:1.6; margin-bottom:48px;">Sustainable travel gear designed for the modern adventurer. Leave nothing but footprints.</p>
      <div style="display:flex; gap:20px; justify-content:center;">
        <div style="background:#D96A42; color:#FFFFFF; font-weight:700; text-transform:uppercase; letter-spacing:2px; padding:20px 48px; border-radius:4px;">SHOP GEAR</div>
        <div style="background:transparent; color:#FFFFFF; border:2px solid #FFFFFF; font-weight:700; text-transform:uppercase; letter-spacing:2px; padding:20px 48px; border-radius:4px;">OUR IMPACT</div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div style="padding:120px 40px; background:#F5F7F2; border-bottom:1px solid #D9D9D9;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:80px;">
        <h2 style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; margin:0; text-transform:uppercase; max-width:600px; line-height:1.1;">Built for the Journey</h2>
        <p style="font-size:18px; color:#5A6B5B; max-width:400px; margin:0; line-height:1.6;">Every detail is engineered for performance, durability, and minimal environmental impact.</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:40px;">
        <div style="padding:48px 32px; background:#FFFFFF; border-left:4px solid #D96A42; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
          <div style="margin-bottom:24px; color:#2C3E2D;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:500; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px;">Recycled Materials</h3>
          <p style="color:#5A6B5B; margin:0; line-height:1.6;">Made from ocean-bound plastics.</p>
        </div>
        <div style="padding:48px 32px; background:#FFFFFF; border-left:4px solid #D96A42; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
          <div style="margin-bottom:24px; color:#2C3E2D;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:500; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px;">Carbon Neutral</h3>
          <p style="color:#5A6B5B; margin:0; line-height:1.6;">We offset 100% of our emissions.</p>
        </div>
        <div style="padding:48px 32px; background:#FFFFFF; border-left:4px solid #D96A42; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
          <div style="margin-bottom:24px; color:#2C3E2D;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:500; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px;">Lifetime Warranty</h3>
          <p style="color:#5A6B5B; margin:0; line-height:1.6;">Repair over replace. Always.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:120px 40px; background:#F5F7F2;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:80px;">
        <h2 style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; margin:0; text-transform:uppercase;">Essential Gear</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div style="background:#FFFFFF; border:1px solid #D9D9D9;">
          <div style="position:relative; padding-bottom:120%; background:#EAEAEA;">
            <img src="https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:24px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:500; margin:0; text-transform:uppercase;">The Explorer Backpack</h3>
              <div style="font-weight:700; color:#D96A42;">$145</div>
            </div>
            <div style="font-size:14px; color:#5A6B5B;">2 Colors</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #D9D9D9;">
          <div style="position:relative; padding-bottom:120%; background:#EAEAEA;">
            <img src="https://images.unsplash.com/photo-1542223616-9404625eb94e?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; top:16px; left:16px; background:#2C3E2D; color:#FFFFFF; font-size:11px; font-weight:700; text-transform:uppercase; padding:6px 12px; border-radius:2px;">Recycled</div>
          </div>
          <div style="padding:24px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:500; margin:0; text-transform:uppercase;">Camp Mug 12oz</h3>
              <div style="font-weight:700; color:#D96A42;">$24</div>
            </div>
            <div style="font-size:14px; color:#5A6B5B;">1 Color</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #D9D9D9;">
          <div style="position:relative; padding-bottom:120%; background:#EAEAEA;">
            <img src="https://images.unsplash.com/photo-1502224562085-6dfe2f2e4c42?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:24px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:500; margin:0; text-transform:uppercase;">Merino Base Layer</h3>
              <div style="font-weight:700; color:#D96A42;">$85</div>
            </div>
            <div style="font-size:14px; color:#5A6B5B;">3 Colors</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #D9D9D9;">
          <div style="position:relative; padding-bottom:120%; background:#EAEAEA;">
            <img src="https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; top:16px; left:16px; background:#2C3E2D; color:#FFFFFF; font-size:11px; font-weight:700; text-transform:uppercase; padding:6px 12px; border-radius:2px;">Core</div>
          </div>
          <div style="padding:24px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <h3 style="font-family:'Oswald', sans-serif; font-size:20px; font-weight:500; margin:0; text-transform:uppercase;">Trail Hat</h3>
              <div style="font-weight:700; color:#D96A42;">$35</div>
            </div>
            <div style="font-size:14px; color:#5A6B5B;">4 Colors</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Impact -->
  <div style="background:#2C3E2D; padding:120px 40px; color:#FFFFFF;">
    <div style="max-width:1440px; margin:0 auto; display:flex; gap:80px; align-items:center;">
      <div style="flex:1;">
        <h2 style="font-family:'Oswald', sans-serif; font-size:72px; font-weight:700; margin-bottom:24px; text-transform:uppercase; line-height:1.1;">Our Impact</h2>
        <p style="font-size:20px; color:#F5F7F2; margin-bottom:40px; line-height:1.6; opacity:0.9;">Transparency in every step of our supply chain.</p>
      </div>
      <div style="flex:1.5; display:grid; grid-template-columns:repeat(2, 1fr); gap:40px;">
        <div style="border-top:2px solid rgba(255,255,255,0.2); padding-top:24px;">
          <div style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; color:#D96A42; margin-bottom:8px; line-height:1;">1.2M</div>
          <div style="font-size:16px; font-weight:700; text-transform:uppercase; margin-bottom:8px;">Bottles Recycled</div>
        </div>
        <div style="border-top:2px solid rgba(255,255,255,0.2); padding-top:24px;">
          <div style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; color:#D96A42; margin-bottom:8px; line-height:1;">100%</div>
          <div style="font-size:16px; font-weight:700; text-transform:uppercase; margin-bottom:8px;">Carbon Neutral</div>
        </div>
        <div style="border-top:2px solid rgba(255,255,255,0.2); padding-top:24px;">
          <div style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; color:#D96A42; margin-bottom:8px; line-height:1;">50K</div>
          <div style="font-size:16px; font-weight:700; text-transform:uppercase; margin-bottom:8px;">Trees Planted</div>
        </div>
        <div style="border-top:2px solid rgba(255,255,255,0.2); padding-top:24px;">
          <div style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; color:#D96A42; margin-bottom:8px; line-height:1;">B-Corp</div>
          <div style="font-size:16px; font-weight:700; text-transform:uppercase; margin-bottom:8px;">Certified</div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"eco-travel":\s*`[\s\S]*?`/,
  `"eco-travel": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ECO TRAVEL template updated.');
