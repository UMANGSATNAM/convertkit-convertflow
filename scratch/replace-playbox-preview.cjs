const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FDFDFD; min-height:100vh; font-family:'Nunito', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#FF6B6B; color:#FFFFFF; text-align:center; padding:12px; font-size:14px; font-weight:800; letter-spacing:1px; text-transform:uppercase;">
    🎉 FREE SHIPPING ON ORDERS OVER $50! 🎉
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center;">
    <div style="font-size:32px; font-weight:900; color:#1A1A1A; letter-spacing:-1px;">PlayBox</div>
    <div style="display:flex; gap:32px; font-size:16px; font-weight:800; color:#4A4A4A;">
      <span style="color:#FF6B6B;">Shop Toys</span>
      <span>Ages</span>
      <span>Brands</span>
      <span>Gifts</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:grid; grid-template-columns:1fr 1.1fr; gap:60px; padding:60px 40px; align-items:center; max-width:1440px; margin:0 auto; overflow:hidden;">
    <div style="padding-right:40px; position:relative; z-index:2;">
      <div style="display:inline-block; font-size:14px; font-weight:800; letter-spacing:2px; color:#FF6B6B; margin-bottom:24px; background:#FFF0F0; padding:8px 20px; border-radius:30px;">
        IMAGINATION UNLOCKED
      </div>
      <div style="font-size:72px; font-weight:900; line-height:1.1; color:#1A1A1A; margin-bottom:24px; letter-spacing:-1px;">Let the Magic Begin</div>
      <div style="font-size:20px; font-weight:600; color:#4A4A4A; line-height:1.6; margin-bottom:40px; max-width:480px;">Discover toys that inspire creativity, spark joy, and build big dreams for little hands.</div>
      <div style="display:flex; gap:20px;">
        <div style="background:#FF6B6B; color:#FFFFFF; padding:18px 40px; font-size:16px; font-weight:800; border-radius:30px; box-shadow:0 10px 20px rgba(255,107,107,0.3);">SHOP NEW ARRIVALS</div>
        <div style="border:3px solid #1A1A1A; color:#1A1A1A; padding:18px 40px; font-size:16px; font-weight:800; border-radius:30px;">FIND A GIFT</div>
      </div>
    </div>
    
    <div style="position:relative; height:500px; z-index:2; border-radius:200px 200px 40px 40px; border:8px solid #FFFFFF; box-shadow:0 30px 60px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="width:100%; height:100%; background:url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80') center/cover;"></div>
    </div>
  </div>

  <!-- Marquee -->
  <div style="background:#FFD166; padding:20px 0; overflow:hidden;">
    <div style="display:flex; gap:20px; white-space:nowrap; font-size:20px; font-weight:800; color:#1A1A1A; letter-spacing:1px;">
      <span>100% NON-TOXIC ✨ SUSTAINABLY MADE ✨ EDUCATIONAL FUN ✨ DURABLE DESIGN ✨</span>
      <span>100% NON-TOXIC ✨ SUSTAINABLY MADE ✨ EDUCATIONAL FUN ✨ DURABLE DESIGN ✨</span>
    </div>
  </div>

  <!-- Categories -->
  <div style="padding:100px 40px; max-width:1440px; margin:0 auto; text-align:center;">
    <div style="font-size:56px; font-weight:900; color:#1A1A1A; margin-bottom:16px; letter-spacing:-1px;">Explore by Play</div>
    <div style="font-size:18px; font-weight:600; color:#4A4A4A; margin-bottom:60px;">Find the perfect playtime adventure.</div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
      <div>
        <div style="aspect-ratio:1/1; border-radius:40px; background:#FFD166; padding:16px; margin-bottom:24px;">
          <div style="width:100%; height:100%; border-radius:24px; background:url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        </div>
        <div style="font-size:22px; font-weight:800; color:#1A1A1A;">Building Blocks</div>
      </div>
      <div>
        <div style="aspect-ratio:1/1; border-radius:40px; background:#06D6A0; padding:16px; margin-bottom:24px;">
          <div style="width:100%; height:100%; border-radius:24px; background:url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        </div>
        <div style="font-size:22px; font-weight:800; color:#1A1A1A;">Arts & Crafts</div>
      </div>
      <div>
        <div style="aspect-ratio:1/1; border-radius:40px; background:#118AB2; padding:16px; margin-bottom:24px;">
          <div style="width:100%; height:100%; border-radius:24px; background:url('https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        </div>
        <div style="font-size:22px; font-weight:800; color:#1A1A1A;">Pretend Play</div>
      </div>
      <div>
        <div style="aspect-ratio:1/1; border-radius:40px; background:#EF476F; padding:16px; margin-bottom:24px;">
          <div style="width:100%; height:100%; border-radius:24px; background:url('https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=400&q=80') center/cover;"></div>
        </div>
        <div style="font-size:22px; font-weight:800; color:#1A1A1A;">Puzzles</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"kids-toys":\s*`[\s\S]*?`/,
  `"kids-toys": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PLAYBOX KIDS template updated.');
