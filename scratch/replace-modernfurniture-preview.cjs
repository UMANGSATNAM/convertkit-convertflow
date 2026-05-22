const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#F5F5F0; color:#222222; min-height:100vh; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#8C7A6B; color:#FFFFFF; text-align:center; padding:10px; font-size:12px; font-weight:500; letter-spacing:1px; text-transform:uppercase;">
    Complimentary white-glove delivery on all seating.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#F5F5F0; position:sticky; top:0; z-index:50;">
    <div style="font-family:'Montserrat', 'Futura', sans-serif; font-size:24px; font-weight:400; letter-spacing:4px;">S P A T I A L</div>
    <div style="display:flex; gap:32px; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:2px; font-family:'Montserrat', 'Futura', sans-serif;">
      <span style="color:#8C7A6B; border-bottom:1px solid #8C7A6B; padding-bottom:4px;">Collections</span>
      <span>Design Studio</span>
      <span>About</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; max-width:1600px; margin:0 auto; min-height:85vh; display:flex; flex-direction:column; justify-content:center;">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative; z-index:3;">
        <h1 style="font-family:'Montserrat', 'Futura', sans-serif; font-size:88px; font-weight:400; text-transform:uppercase; letter-spacing:-2px; margin:0 0 32px 0; line-height:0.95;">Form follows<br>function.</h1>
        <p style="font-size:18px; font-weight:300; color:#555555; line-height:1.7; margin:0 0 48px 0; max-width:400px; letter-spacing:0.5px;">Curated objects for the modern home. Pieces designed with intention and crafted to last generations.</p>
        <div style="display:inline-flex; align-items:center; gap:16px; font-family:'Montserrat', 'Futura', sans-serif; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:3px;">
          EXPLORE THE COLLECTION <span style="width:40px; height:1px; background:#222222;"></span>
        </div>
      </div>
      <div style="position:relative; height:100%; min-height:600px;">
        <div style="position:absolute; inset:0; background:#E5E5DF; transform:translate(-40px, 40px); z-index:1;"></div>
        <div style="position:relative; z-index:2; height:100%; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>
    </div>
  </div>

  <!-- Featured -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1600px; margin:0 auto; display:grid; grid-template-columns:5fr 7fr; gap:80px; align-items:center;">
      <div>
        <h2 style="font-family:'Montserrat', 'Futura', sans-serif; font-size:48px; font-weight:400; text-transform:uppercase; letter-spacing:-1px; margin:0 0 24px 0; line-height:1.1;">Architectural Living</h2>
        <p style="font-size:18px; font-weight:300; color:#555555; line-height:1.7; margin:0 0 40px 0; max-width:400px;">Spaces defined by light, volume, and material. Our core collection brings architectural rigor to everyday objects.</p>
        <div style="display:inline-block; font-family:'Montserrat', 'Futura', sans-serif; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:3px; border-bottom:1px solid #222222; padding-bottom:8px;">Shop Living Room</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <div style="padding-top:40px;">
          <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" style="width:100%; aspect-ratio:3/4; object-fit:cover;">
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=600&q=80" style="width:100%; aspect-ratio:3/4; object-fit:cover;">
        </div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:160px 40px;">
    <div style="max-width:1600px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:80px;">
        <h2 style="font-family:'Montserrat', 'Futura', sans-serif; font-size:40px; font-weight:400; text-transform:uppercase; letter-spacing:-1px; margin:0;">New Arrivals</h2>
        <div style="font-family:'Montserrat', 'Futura', sans-serif; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:3px; border-bottom:1px solid #222222; padding-bottom:8px;">SHOP ALL</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div style="display:flex; flex-direction:column;">
          <div style="background:#E5E5DF; aspect-ratio:4/5; margin-bottom:24px; position:relative; overflow:hidden;">
            <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Lounge Chair</h3>
            <div style="font-size:16px;">$1,250</div>
          </div>
          <div style="font-size:14px; color:#555555;">Walnut / Linen</div>
        </div>
        <div style="display:flex; flex-direction:column;">
          <div style="background:#E5E5DF; aspect-ratio:4/5; margin-bottom:24px; position:relative; overflow:hidden;">
            <img src="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Side Table</h3>
            <div style="font-size:16px;">$450</div>
          </div>
          <div style="font-size:14px; color:#555555;">Black Marble</div>
        </div>
        <div style="display:flex; flex-direction:column;">
          <div style="background:#E5E5DF; aspect-ratio:4/5; margin-bottom:24px; position:relative; overflow:hidden;">
            <img src="https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Stool</h3>
            <div style="font-size:16px;">$320</div>
          </div>
          <div style="font-size:14px; color:#555555;">Oak</div>
        </div>
        <div style="display:flex; flex-direction:column;">
          <div style="background:#E5E5DF; aspect-ratio:4/5; margin-bottom:24px; position:relative; overflow:hidden;">
            <img src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h3 style="font-size:16px; font-weight:400; margin:0;">Pendant Light</h3>
            <div style="font-size:16px;">$890</div>
          </div>
          <div style="font-size:14px; color:#555555;">Brass</div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"modern-furniture":\s*`[\s\S]*?`/,
  `"modern-furniture": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('MODERN FURNITURE template updated.');
