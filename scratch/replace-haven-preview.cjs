const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#F7F5F0; min-height:100vh; font-family:'Inter', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#B89B72; color:#FFFFFF; text-align:center; padding:10px; font-size:11px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">
    COMPLIMENTARY WHITE GLOVE DELIVERY ON ALL SEATING
  </div>

  <!-- Header -->
  <div style="padding:32px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(0,0,0,0.05);">
    <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:400; color:#2C2C2C; letter-spacing:2px;">HAVEN</div>
    <div style="display:flex; gap:40px; font-size:12px; font-weight:500; color:#2C2C2C; letter-spacing:1px; text-transform:uppercase;">
      <span>Furniture</span>
      <span>Lighting</span>
      <span>Decor</span>
      <span>Design Services</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; height:80vh; min-height:600px; display:flex; align-items:center;">
    <div style="position:absolute; inset:0; z-index:1;">
      <div style="width:100%; height:100%; background:url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80') center/cover;"></div>
      <div style="position:absolute; inset:0; background:linear-gradient(to right, rgba(247,245,240,0.9) 0%, rgba(247,245,240,0.4) 50%, rgba(247,245,240,0) 100%);"></div>
    </div>
    
    <div style="position:relative; z-index:2; max-width:1440px; width:100%; margin:0 auto; padding:0 40px;">
      <div style="max-width:600px;">
        <div style="font-size:12px; font-weight:500; letter-spacing:3px; color:#B89B72; margin-bottom:24px;">HAVEN EXCLUSIVE</div>
        <div style="font-family:'Playfair Display', serif; font-size:72px; font-weight:400; color:#2C2C2C; line-height:1.1; margin-bottom:24px;">The Art of Living</div>
        <div style="font-size:16px; font-weight:300; color:#4A4A4A; line-height:1.6; margin-bottom:48px;">Curated pieces that transform your space into a sanctuary of modern elegance.</div>
        <div style="display:inline-block; background:#2C2C2C; color:#FFFFFF; padding:18px 40px; font-size:12px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">EXPLORE COLLECTION</div>
      </div>
    </div>
  </div>

  <!-- Categories -->
  <div style="padding:120px 40px; background:#FFFFFF; text-align:center;">
    <div style="font-family:'Playfair Display', serif; font-size:40px; font-weight:400; color:#2C2C2C; margin-bottom:16px;">Shop by Room</div>
    <div style="width:40px; height:2px; background:#B89B72; margin:0 auto 80px auto;"></div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px; max-width:1440px; margin:0 auto;">
      <div style="position:relative; padding-bottom:120%;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80') center/cover;"></div>
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.2);"></div>
        <div style="position:absolute; bottom:30px; left:0; width:100%; color:#FFFFFF; font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">LIVING ROOM</div>
      </div>
      <div style="position:relative; padding-bottom:120%;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80') center/cover;"></div>
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.2);"></div>
        <div style="position:absolute; bottom:30px; left:0; width:100%; color:#FFFFFF; font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">BEDROOM</div>
      </div>
      <div style="position:relative; padding-bottom:120%;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80') center/cover;"></div>
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.2);"></div>
        <div style="position:absolute; bottom:30px; left:0; width:100%; color:#FFFFFF; font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">DINING</div>
      </div>
      <div style="position:relative; padding-bottom:120%;">
        <div style="position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80') center/cover;"></div>
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.2);"></div>
        <div style="position:absolute; bottom:30px; left:0; width:100%; color:#FFFFFF; font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">OFFICE</div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:120px 40px; max-width:1440px; margin:0 auto;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:80px;">
      <div>
        <div style="font-family:'Playfair Display', serif; font-size:40px; font-weight:400; color:#2C2C2C; margin-bottom:16px;">Signature Pieces</div>
        <div style="width:40px; height:2px; background:#B89B72;"></div>
      </div>
      <div style="font-size:12px; font-weight:500; color:#2C2C2C; letter-spacing:2px; text-transform:uppercase; border-bottom:1px solid #B89B72; padding-bottom:4px;">VIEW ALL</div>
    </div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
      <div style="text-align:center;">
        <div style="padding-bottom:120%; background:url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80') center/cover; margin-bottom:24px;"></div>
        <div style="font-size:11px; color:#888888; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">SEATING</div>
        <div style="font-family:'Playfair Display', serif; font-size:18px; color:#2C2C2C; margin-bottom:8px;">The Monaco Sofa</div>
        <div style="font-size:14px; font-weight:300; color:#4A4A4A;">$3,200</div>
      </div>
      <div style="text-align:center;">
        <div style="padding-bottom:120%; background:url('https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80') center/cover; margin-bottom:24px;"></div>
        <div style="font-size:11px; color:#888888; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">TABLES</div>
        <div style="font-family:'Playfair Display', serif; font-size:18px; color:#2C2C2C; margin-bottom:8px;">Oak Dining Table</div>
        <div style="font-size:14px; font-weight:300; color:#4A4A4A;">$1,850</div>
      </div>
      <div style="text-align:center;">
        <div style="padding-bottom:120%; background:url('https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=600&q=80') center/cover; margin-bottom:24px;"></div>
        <div style="font-size:11px; color:#888888; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">STORAGE</div>
        <div style="font-family:'Playfair Display', serif; font-size:18px; color:#2C2C2C; margin-bottom:8px;">Walnut Sideboard</div>
        <div style="font-size:14px; font-weight:300; color:#4A4A4A;">$2,400</div>
      </div>
      <div style="text-align:center;">
        <div style="padding-bottom:120%; background:url('https://images.unsplash.com/photo-1540574163026-643ea20d56b8?auto=format&fit=crop&w=600&q=80') center/cover; margin-bottom:24px;"></div>
        <div style="font-size:11px; color:#888888; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">LIGHTING</div>
        <div style="font-family:'Playfair Display', serif; font-size:18px; color:#2C2C2C; margin-bottom:8px;">Brass Pendant</div>
        <div style="font-size:14px; font-weight:300; color:#4A4A4A;">$450</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"home-furniture":\s*`[\s\S]*?`/,
  `"home-furniture": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('HAVEN FURNITURE template updated.');
