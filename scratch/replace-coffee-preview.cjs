const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FAF0E6; color:#3E2723; min-height:100vh; font-family:'Lato', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#3E2723; color:#FAF0E6; text-align:center; padding:10px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
    Freshly roasted to order. Free shipping on 2+ bags.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FAF0E6; border-bottom:1px solid #EAE0D5;">
    <div style="font-family:'Playfair Display', serif; font-size:24px; font-weight:700; letter-spacing:4px; font-style:italic;">C R A F T R O A S T</div>
    <div style="display:flex; gap:32px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:2px;">
      <span style="color:#8B4513;">Shop</span>
      <span>Origins</span>
      <span>Process</span>
      <span>Brew Guides</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; min-height:80vh; display:grid; grid-template-columns:1fr 1fr; align-items:center;">
    <div style="padding-right:60px;">
      <div style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:4px; color:#8B4513; margin-bottom:24px; display:flex; align-items:center; gap:16px;">
        <span style="width:40px; height:1px; background:#8B4513;"></span>
        ROASTED THIS MORNING
      </div>
      <div style="font-family:'Playfair Display', serif; font-size:80px; font-weight:700; font-style:italic; line-height:1.05; margin-bottom:32px;">Awaken Your Senses</div>
      <div style="font-size:18px; color:#5D4037; line-height:1.8; margin-bottom:48px;">Artisanal, small-batch coffee roasted with precision and passion. Taste the difference in every cup.</div>
      <div style="display:inline-block; background:#3E2723; color:#FAF0E6; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:2px; padding:20px 48px;">SHOP COFFEE</div>
    </div>
    <div style="position:relative; height:600px;">
      <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80" style="width:100%; height:100%; object-fit:cover;">
    </div>
  </div>

  <!-- Origins -->
  <div style="background:#F5F5DC; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <div style="font-family:'Playfair Display', serif; font-size:48px; font-weight:700; margin-bottom:16px;">Explore by Category</div>
        <div style="width:60px; height:2px; background:#8B4513; margin:0 auto;"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
        <div style="position:relative; overflow:hidden; padding-bottom:140%; background:#3E2723;">
          <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.8;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(62,39,35,0.9) 0%, rgba(62,39,35,0.2) 50%, transparent 100%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px; text-align:center;">
            <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:700; color:#FAF0E6; margin-bottom:8px; font-style:italic;">Single Origin</div>
            <div style="font-size:14px; color:#D2B48C; letter-spacing:1px; text-transform:uppercase;">Distinct regional profiles</div>
          </div>
        </div>
        <div style="position:relative; overflow:hidden; padding-bottom:140%; background:#3E2723;">
          <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.8;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(62,39,35,0.9) 0%, rgba(62,39,35,0.2) 50%, transparent 100%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px; text-align:center;">
            <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:700; color:#FAF0E6; margin-bottom:8px; font-style:italic;">House Blends</div>
            <div style="font-size:14px; color:#D2B48C; letter-spacing:1px; text-transform:uppercase;">Balanced & consistent</div>
          </div>
        </div>
        <div style="position:relative; overflow:hidden; padding-bottom:140%; background:#3E2723;">
          <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.8;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(62,39,35,0.9) 0%, rgba(62,39,35,0.2) 50%, transparent 100%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px; text-align:center;">
            <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:700; color:#FAF0E6; margin-bottom:8px; font-style:italic;">Espresso</div>
            <div style="font-size:14px; color:#D2B48C; letter-spacing:1px; text-transform:uppercase;">Rich & syrupy</div>
          </div>
        </div>
        <div style="position:relative; overflow:hidden; padding-bottom:140%; background:#3E2723;">
          <img src="https://images.unsplash.com/photo-1495474472205-51f7b11c08d9?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.8;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(62,39,35,0.9) 0%, rgba(62,39,35,0.2) 50%, transparent 100%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px; text-align:center;">
            <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:700; color:#FAF0E6; margin-bottom:8px; font-style:italic;">Decaf</div>
            <div style="font-size:14px; color:#D2B48C; letter-spacing:1px; text-transform:uppercase;">All flavor, no buzz</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured -->
  <div style="background:#3E2723; padding:0; overflow:hidden;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; align-items:stretch;">
      <div style="position:relative; min-height:600px;">
        <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=1000&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.8;">
      </div>
      <div style="padding:120px 80px 120px 40px; color:#FAF0E6;">
        <div style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:4px; color:#D2B48C; margin-bottom:24px; display:flex; align-items:center; gap:16px;">
          <span style="width:40px; height:1px; background:#D2B48C;"></span> NEVER RUN OUT
        </div>
        <div style="font-family:'Playfair Display', serif; font-size:56px; font-weight:700; margin-bottom:24px; font-style:italic;">The Roaster's Choice Subscription</div>
        <div style="font-size:18px; color:#D2B48C; line-height:1.8; margin-bottom:48px;">Let our head roaster select a new, exciting single origin for you every month. Freshly roasted and delivered to your door.</div>
        <div style="display:inline-block; background:#FAF0E6; color:#3E2723; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:2px; padding:20px 48px;">SUBSCRIBE & SAVE</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"coffee-roasters":\s*`[\s\S]*?`/,
  `"coffee-roasters": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('COFFEE ROASTERS template updated.');
