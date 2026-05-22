const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#E5E5E5; color:#000000; min-height:100vh; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#FF3300; color:#000000; text-align:center; padding:12px; font-family:'Space Grotesk', sans-serif; font-size:14px; font-weight:700; letter-spacing:2px; text-transform:uppercase; border-bottom:4px solid #000000;">
    WORLDWIDE SHIPPING // NO REFUNDS // NO RESTOCKS //
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-bottom:4px solid #000000;">
    <div style="font-family:'Space Grotesk', sans-serif; font-size:32px; font-weight:700; letter-spacing:-1px;">S Y N D I C A T E</div>
    <div style="display:flex; gap:32px; font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:700; text-transform:uppercase;">
      <span style="color:#FF3300; text-decoration:underline; text-decoration-thickness:2px;">Shop</span>
      <span>Archive</span>
      <span>About</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; min-height:80vh; display:grid; grid-template-columns:1fr 1fr; align-items:center; border-bottom:4px solid #000000;">
    <div style="position:absolute; inset:0; background-image:linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px); background-size:40px 40px; opacity:0.1; z-index:1;"></div>
    
    <div style="padding:40px; position:relative; z-index:2;">
      <div style="display:inline-block; background:#000000; color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:2px; padding:8px 16px; margin-bottom:24px; border:2px solid #000000;">LATEST DROP // COLLECTION 004</div>
      <h1 style="font-family:'Space Grotesk', sans-serif; font-size:100px; font-weight:700; line-height:0.85; margin-bottom:40px; text-transform:uppercase; letter-spacing:-4px;">SUBVERT<br>THE SYSTEM</h1>
      <div style="display:inline-block; background:#FF3300; color:#000000; font-family:'Space Grotesk', sans-serif; font-size:20px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:20px 40px; border:4px solid #000000; box-shadow:8px 8px 0px #000000;">ENTER NOW</div>
    </div>
    
    <div style="position:relative; height:600px; z-index:2;">
      <div style="position:absolute; top:10%; right:10%; width:70%; height:80%; border:4px solid #000000; background:#FFFFFF; z-index:1; transform:rotate(5deg);"></div>
      <div style="position:absolute; top:20%; left:10%; width:80%; height:70%; border:4px solid #000000; background:#FF3300; z-index:2; overflow:hidden;">
        <img src="https://images.unsplash.com/photo-1523398002811-999aa8d9f1ab?auto=format&fit=crop&w=1000&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:luminosity; opacity:0.8;">
      </div>
      <div style="position:absolute; bottom:10%; right:0; background:#000000; color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:48px; font-weight:700; padding:10px 20px; z-index:3; transform:rotate(-10deg);">XXX</div>
    </div>
  </div>

  <!-- Marquee -->
  <div style="background:#FF3300; padding:20px 0; overflow:hidden; border-bottom:4px solid #000000; white-space:nowrap;">
    <div style="display:inline-block; font-family:'Space Grotesk', sans-serif; font-size:32px; font-weight:700; text-transform:uppercase; letter-spacing:2px;">
      WARNING: HIGH VOLTAGE // PROCEED WITH CAUTION // WARNING: HIGH VOLTAGE // PROCEED WITH CAUTION //
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
        <h2 style="font-family:'Space Grotesk', sans-serif; font-size:80px; font-weight:700; margin:0; line-height:0.9; letter-spacing:-2px;">ARCHIVE</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div style="background:#FFFFFF; border:4px solid #000000; box-shadow:8px 8px 0px #000000;">
          <div style="position:relative; padding-bottom:120%; background:#E5E5E5; border-bottom:4px solid #000000;">
            <img src="https://images.unsplash.com/photo-1523398002811-999aa8d9f1ab?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply; filter:grayscale(20%);">
            <div style="position:absolute; bottom:0; right:0; background:#000000; color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:700; padding:12px 24px; border-top:4px solid #000000; border-left:4px solid #000000;">$120</div>
          </div>
          <div style="padding:24px;">
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px; text-transform:uppercase;">Heavyweight Hoodie</h3>
            <div style="font-size:14px; font-weight:500; color:#666666; text-transform:uppercase;">Color: Black</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:4px solid #000000; box-shadow:8px 8px 0px #000000;">
          <div style="position:relative; padding-bottom:120%; background:#E5E5E5; border-bottom:4px solid #000000;">
            <img src="https://images.unsplash.com/photo-1550614000-4b95dd012eee?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply; filter:grayscale(20%);">
            <div style="position:absolute; top:16px; left:16px; background:#FF3300; color:#000000; font-family:'Space Grotesk', sans-serif; font-size:14px; font-weight:700; padding:4px 12px; border:2px solid #000000; transform:rotate(-5deg);">DROP 004</div>
            <div style="position:absolute; bottom:0; right:0; background:#000000; color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:700; padding:12px 24px; border-top:4px solid #000000; border-left:4px solid #000000;">$85</div>
          </div>
          <div style="padding:24px;">
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px; text-transform:uppercase;">Cargo Pants</h3>
            <div style="font-size:14px; font-weight:500; color:#666666; text-transform:uppercase;">Color: Olive</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:4px solid #000000; box-shadow:8px 8px 0px #000000;">
          <div style="position:relative; padding-bottom:120%; background:#E5E5E5; border-bottom:4px solid #000000;">
            <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply; filter:grayscale(20%);">
            <div style="position:absolute; bottom:0; right:0; background:#000000; color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:700; padding:12px 24px; border-top:4px solid #000000; border-left:4px solid #000000;">$45</div>
          </div>
          <div style="padding:24px;">
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px; text-transform:uppercase;">Logo Tee</h3>
            <div style="font-size:14px; font-weight:500; color:#666666; text-transform:uppercase;">Color: White</div>
          </div>
        </div>
        <div style="background:#FFFFFF; border:4px solid #000000; box-shadow:8px 8px 0px #000000;">
          <div style="position:relative; padding-bottom:120%; background:#E5E5E5; border-bottom:4px solid #000000;">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply; filter:grayscale(20%);">
            <div style="position:absolute; bottom:0; right:0; background:#000000; color:#FFFFFF; font-family:'Space Grotesk', sans-serif; font-size:16px; font-weight:700; padding:12px 24px; border-top:4px solid #000000; border-left:4px solid #000000;">$220</div>
          </div>
          <div style="padding:24px;">
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px; text-transform:uppercase;">Utility Jacket</h3>
            <div style="font-size:14px; font-weight:500; color:#666666; text-transform:uppercase;">Color: Grey</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"streetwear":\s*`[\s\S]*?`/,
  `"streetwear": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('STREETWEAR template updated.');
