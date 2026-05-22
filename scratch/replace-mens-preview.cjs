const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#111111; color:#F5F5F5; min-height:100vh; font-family:'Roboto', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#B8860B; color:#111111; text-align:center; padding:10px; font-family:'Oswald', sans-serif; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">
    Premium grooming essentials. Free shipping on orders over $60.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#111111; border-bottom:1px solid #333333;">
    <div style="font-family:'Oswald', sans-serif; font-size:28px; font-weight:700; letter-spacing:4px; text-transform:uppercase;">I R O N & O A K</div>
    <div style="display:flex; gap:32px; font-family:'Oswald', sans-serif; font-size:14px; font-weight:500; text-transform:uppercase; letter-spacing:2px;">
      <span style="color:#B8860B;">Shop All</span>
      <span>Beard</span>
      <span>Face</span>
      <span>Body</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; min-height:80vh; display:grid; grid-template-columns:1fr 1fr; align-items:center; position:relative;">
    <div style="position:absolute; inset:0; background:radial-gradient(circle at 70% 30%, #1A1A1A 0%, #111111 70%); z-index:1;"></div>
    
    <div style="padding-right:60px; position:relative; z-index:2;">
      <div style="font-family:'Oswald', sans-serif; font-size:14px; font-weight:500; text-transform:uppercase; letter-spacing:4px; color:#B8860B; margin-bottom:24px; display:flex; align-items:center; gap:16px;">
        <span style="width:40px; height:2px; background:#B8860B;"></span>
        ELEVATE YOUR ROUTINE
      </div>
      <div style="font-family:'Oswald', sans-serif; font-size:96px; font-weight:700; line-height:1; margin-bottom:32px; text-transform:uppercase;">Command Your Day.</div>
      <div style="font-size:18px; font-weight:300; color:#CCCCCC; line-height:1.6; margin-bottom:48px; max-width:480px;">Barber-grade grooming products engineered for the modern man. No nonsense, just results.</div>
      <div style="display:inline-block; background:#B8860B; color:#111111; font-family:'Oswald', sans-serif; font-size:16px; font-weight:600; text-transform:uppercase; letter-spacing:2px; padding:20px 48px;">SHOP THE COLLECTION</div>
    </div>
    
    <div style="position:relative; height:600px; z-index:2;">
      <div style="position:absolute; inset:0; background:#111111; clip-path:polygon(0 0, 15% 0, 0 100%); z-index:2;"></div>
      <img src="https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=1200&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:luminosity; opacity:0.8;">
      <div style="position:absolute; top:0; bottom:0; left:15%; width:2px; background:#B8860B; z-index:3;"></div>
    </div>
  </div>

  <!-- Categories -->
  <div style="background:#1A1A1A; padding:120px 40px; position:relative;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="margin-bottom:60px;">
        <div style="font-family:'Oswald', sans-serif; font-size:56px; font-weight:700; margin-bottom:16px; text-transform:uppercase;">Grooming Arsenal</div>
        <div style="width:60px; height:4px; background:#B8860B;"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
        <div style="position:relative; overflow:hidden; padding-bottom:130%; background:#111111; border:1px solid #333333;">
          <img src="https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:luminosity; opacity:0.6;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 80%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px;">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:8px;">
              <div style="width:24px; height:2px; background:#B8860B;"></div>
              <div style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Beard Care</div>
            </div>
          </div>
        </div>
        <div style="position:relative; overflow:hidden; padding-bottom:130%; background:#111111; border:1px solid #333333;">
          <img src="https://images.unsplash.com/photo-1512496015851-a1dcdb311094?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:luminosity; opacity:0.6;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 80%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px;">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:8px;">
              <div style="width:24px; height:2px; background:#B8860B;"></div>
              <div style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Face Care</div>
            </div>
          </div>
        </div>
        <div style="position:relative; overflow:hidden; padding-bottom:130%; background:#111111; border:1px solid #333333;">
          <img src="https://images.unsplash.com/photo-1585242502847-f55a1ee59811?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:luminosity; opacity:0.6;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 80%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px;">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:8px;">
              <div style="width:24px; height:2px; background:#B8860B;"></div>
              <div style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Body & Hair</div>
            </div>
          </div>
        </div>
        <div style="position:relative; overflow:hidden; padding-bottom:130%; background:#111111; border:1px solid #333333;">
          <img src="https://images.unsplash.com/photo-1593702288056-ccde0661eb1a?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:luminosity; opacity:0.6;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, #111111 0%, transparent 80%);"></div>
          <div style="position:absolute; bottom:0; left:0; width:100%; padding:32px;">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:8px;">
              <div style="width:24px; height:2px; background:#B8860B;"></div>
              <div style="font-family:'Oswald', sans-serif; font-size:24px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Shave</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured Product -->
  <div style="background:#111111; padding:0; overflow:hidden;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; align-items:stretch;">
      <div style="padding:120px 80px 120px 40px; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:2;">
        <div style="font-family:'Oswald', sans-serif; font-size:14px; font-weight:500; text-transform:uppercase; letter-spacing:4px; color:#B8860B; margin-bottom:24px; display:flex; align-items:center; gap:16px;">
          <span style="width:40px; height:2px; background:#B8860B;"></span> THE ULTIMATE ARSENAL
        </div>
        <div style="font-family:'Oswald', sans-serif; font-size:64px; font-weight:700; line-height:1; margin-bottom:24px; text-transform:uppercase;">The Master Grooming Kit</div>
        <div style="font-size:18px; font-weight:300; color:#CCCCCC; line-height:1.6; margin-bottom:48px;">Everything you need to look and feel your best. Includes our signature beard oil, face wash, daily moisturizer, and a solid cologne.</div>
        <div style="display:inline-block; border:2px solid #B8860B; color:#B8860B; font-family:'Oswald', sans-serif; font-size:16px; font-weight:600; text-transform:uppercase; letter-spacing:2px; padding:18px 48px; text-align:center;">SHOP THE KIT</div>
      </div>
      <div style="position:relative; min-height:600px;">
        <div style="position:absolute; inset:0; background:#1A1A1A; clip-path:polygon(15% 0, 100% 0, 100% 100%, 0 100%); z-index:1;"></div>
        <img src="https://images.unsplash.com/photo-1585242502847-f55a1ee59811?auto=format&fit=crop&w=1000&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:2; mix-blend-mode:luminosity; opacity:0.8;">
        <div style="position:absolute; bottom:40px; left:20%; width:100px; height:100px; border:2px solid #B8860B; z-index:3; opacity:0.5;"></div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"mens-grooming":\s*`[\s\S]*?`/,
  `"mens-grooming": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('MENS GROOMING template updated.');
