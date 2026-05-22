const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FFFAF0; color:#5D4037; min-height:100vh; font-family:'Nunito', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#FFB6C1; color:#5D4037; text-align:center; padding:10px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
    Welcome little ones! Free shipping on orders over $50.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-bottom:1px solid #FFF0F5;">
    <div style="font-family:'Quicksand', sans-serif; font-size:28px; font-weight:700; color:#5D4037;">sprout & co.</div>
    <div style="display:flex; gap:32px; font-size:15px; font-weight:700;">
      <span style="color:#FFB6C1;">Shop</span>
      <span>About</span>
      <span>Gifting</span>
      <span>Journal</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; position:relative; overflow:hidden;">
    <div style="position:absolute; top:-10%; left:-5%; width:40%; height:60%; background:#FFF0F5; border-radius:50%; filter:blur(40px); z-index:1;"></div>
    <div style="position:absolute; bottom:-10%; right:-5%; width:50%; height:70%; background:#F0F8FF; border-radius:50%; filter:blur(50px); z-index:1;"></div>
    
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; position:relative; z-index:2;">
      <div style="padding-right:40px;">
        <div style="display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:700; padding:8px 20px; border-radius:30px; text-transform:uppercase; letter-spacing:2px; margin-bottom:24px; color:#5D4037; background:#FFFFFF; box-shadow:0 10px 20px rgba(93,64,55,0.05);">
          <span style="font-size:18px;">✨</span> NEW ARRIVALS
        </div>
        <div style="font-family:'Quicksand', sans-serif; font-size:72px; font-weight:700; line-height:1.1; margin-bottom:24px;">Soft, snuggly, and oh so sweet.</div>
        <div style="font-size:18px; color:#8D6E63; line-height:1.6; margin-bottom:40px;">Discover our new collection of 100% organic cotton essentials for your little sprout.</div>
        <div style="display:inline-flex; align-items:center; justify-content:center; background:#FFB6C1; color:#5D4037; font-family:'Quicksand', sans-serif; font-size:18px; font-weight:700; padding:18px 48px; border-radius:50px; box-shadow:0 10px 20px rgba(255,182,193,0.4);">SHOP THE COLLECTION</div>
      </div>
      <div style="position:relative;">
        <div style="position:absolute; inset:-20px; background:#FFFFFF; border-radius:40% 60% 70% 30% / 40% 50% 60% 50%; box-shadow:0 20px 40px rgba(93,64,55,0.08); z-index:1;"></div>
        <div style="position:relative; z-index:2; border-radius:30% 70% 50% 50% / 50% 40% 60% 50%; overflow:hidden; aspect-ratio:4/5;">
          <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="position:absolute; bottom:60px; right:-20px; background:#FFFFFF; padding:16px 24px; border-radius:24px; box-shadow:0 15px 30px rgba(93,64,55,0.1); z-index:3; display:flex; align-items:center; gap:16px;">
          <div style="width:48px; height:48px; background:#F0F8FF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px;">🌿</div>
          <div>
            <div style="font-family:'Quicksand', sans-serif; font-size:16px; font-weight:700; color:#5D4037;">100% Organic</div>
            <div style="font-size:12px; color:#8D6E63; font-weight:600;">Safe for baby</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Categories -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <div style="font-family:'Quicksand', sans-serif; font-size:48px; font-weight:700; margin-bottom:16px;">Shop by Size & Style</div>
        <div style="display:flex; justify-content:center; gap:8px;">
          <div style="width:8px; height:8px; background:#FFB6C1; border-radius:50%;"></div>
          <div style="width:8px; height:8px; background:#ADD8E6; border-radius:50%;"></div>
          <div style="width:8px; height:8px; background:#FFDAB9; border-radius:50%;"></div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px;">
        <div style="text-align:center;">
          <div style="position:relative; width:100%; padding-bottom:100%; border-radius:50%; overflow:hidden; margin-bottom:24px; background:#FFF0F5; border:8px solid #FFFAF0; box-shadow:0 15px 30px rgba(93,64,55,0.05);">
            <img src="https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Quicksand', sans-serif; font-size:22px; font-weight:700;">Newborn (0-6m)</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; width:100%; padding-bottom:100%; border-radius:50%; overflow:hidden; margin-bottom:24px; background:#FFF0F5; border:8px solid #FFFAF0; box-shadow:0 15px 30px rgba(93,64,55,0.05);">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Quicksand', sans-serif; font-size:22px; font-weight:700;">Baby (6-24m)</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; width:100%; padding-bottom:100%; border-radius:50%; overflow:hidden; margin-bottom:24px; background:#FFF0F5; border:8px solid #FFFAF0; box-shadow:0 15px 30px rgba(93,64,55,0.05);">
            <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Quicksand', sans-serif; font-size:22px; font-weight:700;">Toddler (2T-5T)</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; width:100%; padding-bottom:100%; border-radius:50%; overflow:hidden; margin-bottom:24px; background:#FFF0F5; border:8px solid #FFFAF0; box-shadow:0 15px 30px rgba(93,64,55,0.05);">
            <img src="https://images.unsplash.com/photo-1555252834-8c7c1fa18703?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Quicksand', sans-serif; font-size:22px; font-weight:700;">Accessories</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative;">
        <div style="position:absolute; top:-20px; left:-20px; width:100%; height:100%; background:#ADD8E6; border-radius:30% 70% 70% 30% / 30% 30% 70% 70%; opacity:0.3; z-index:1;"></div>
        <div style="position:relative; z-index:2; border-radius:40px; overflow:hidden; box-shadow:0 30px 60px rgba(93,64,55,0.08);">
          <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80" style="width:100%; height:auto; display:block;">
        </div>
        <div style="position:absolute; top:20%; right:-30px; background:#FFFFFF; padding:12px 20px; border-radius:30px; box-shadow:0 10px 20px rgba(93,64,55,0.05); z-index:3; display:flex; align-items:center; gap:12px; font-size:14px; font-weight:700;">
          <span style="font-size:20px;">🧸</span> Super Soft
        </div>
        <div style="position:absolute; bottom:20%; left:-30px; background:#FFFFFF; padding:12px 20px; border-radius:30px; box-shadow:0 10px 20px rgba(93,64,55,0.05); z-index:3; display:flex; align-items:center; gap:12px; font-size:14px; font-weight:700;">
          <span style="font-size:20px;">✨</span> Two-Way Zip
        </div>
      </div>
      <div>
        <div style="display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:700; padding:6px 16px; border-radius:30px; text-transform:uppercase; letter-spacing:2px; margin-bottom:16px; background:#FFF0F5;">THE EVERYDAY ESSENTIAL</div>
        <div style="font-family:'Quicksand', sans-serif; font-size:64px; font-weight:700; line-height:1.1; margin-bottom:24px;">The Signature Sleepsuit</div>
        <div style="font-size:18px; color:#8D6E63; line-height:1.6; margin-bottom:40px;">Designed for sweet dreams. Featuring a two-way zipper for easy midnight changes and fold-over mittens to protect tiny faces.</div>
        <div style="display:inline-flex; align-items:center; justify-content:center; background:#FFB6C1; color:#5D4037; font-family:'Quicksand', sans-serif; font-size:18px; font-weight:700; padding:18px 48px; border-radius:50px; box-shadow:0 10px 20px rgba(255,182,193,0.4);">SHOP SLEEPSUITS</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"baby-apparel":\s*`[\s\S]*?`/,
  `"baby-apparel": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('BABY APPAREL template updated.');
