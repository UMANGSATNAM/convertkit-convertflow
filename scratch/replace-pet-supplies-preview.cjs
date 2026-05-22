const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FFF9E6; color:#333333; min-height:100vh; font-family:'Quicksand', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#FF6B6B; color:#FFFFFF; text-align:center; padding:12px; font-size:14px; font-weight:800; font-family:'Nunito', sans-serif; letter-spacing:1px; text-transform:uppercase;">
    🐾 FREE shipping on orders over $50! 🐾
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-bottom:4px solid #FFEDD5;">
    <div style="font-family:'Nunito', sans-serif; font-size:28px; font-weight:900; color:#FF6B6B; letter-spacing:1px;">PAWS & PLAY</div>
    <div style="display:flex; gap:32px; font-size:16px; font-weight:700; font-family:'Nunito', sans-serif; color:#555555;">
      <span style="color:#FF6B6B;">Dogs</span>
      <span>Cats</span>
      <span>Small Pets</span>
      <span>Toys</span>
      <span>Treats</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:flex; align-items:center; min-height:80vh; background:#FFF9E6; overflow:hidden;">
    <div style="width:50%; padding:0 80px; position:relative; z-index:2;">
      <div style="display:inline-flex; align-items:center; gap:8px; background:#FFEDD5; color:#EA580C; font-family:'Nunito', sans-serif; font-size:14px; font-weight:800; padding:8px 20px; border-radius:30px; text-transform:uppercase; letter-spacing:1px; margin-bottom:24px;">
        🦴 SPOIL YOUR FURRY FRIENDS
      </div>
      <div style="font-family:'Nunito', sans-serif; font-size:72px; font-weight:900; line-height:1.1; margin-bottom:24px;">Only the Best for Your Best Friend.</div>
      <div style="font-size:20px; font-weight:500; color:#555555; line-height:1.6; margin-bottom:40px;">Premium toys, organic treats, and cozy beds designed for happy, healthy pets.</div>
      <div style="display:inline-block; background:#FF6B6B; color:#FFFFFF; font-family:'Nunito', sans-serif; font-size:18px; font-weight:800; padding:18px 48px; border-radius:50px; box-shadow:0 10px 20px rgba(255,107,107,0.3);">SHOP NOW</div>
    </div>
    <div style="width:50%; position:relative; z-index:1; display:flex; justify-content:center; align-items:center;">
      <div style="position:absolute; width:600px; height:600px; background:#FFD166; border-radius:40% 60% 70% 30% / 40% 50% 60% 50%; z-index:1;"></div>
      <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80" style="position:relative; z-index:2; width:500px; height:500px; object-fit:cover; border-radius:30px; border:8px solid #FFFFFF; box-shadow:0 20px 40px rgba(0,0,0,0.1); transform:rotate(3deg);">
    </div>
  </div>

  <!-- Categories -->
  <div style="padding:100px 40px; background:#FFFFFF; text-align:center;">
    <div style="font-family:'Nunito', sans-serif; font-size:48px; font-weight:900; margin-bottom:16px;">Shop by Pet</div>
    <div style="width:60px; height:6px; background:#FF6B6B; border-radius:3px; margin:0 auto 80px auto;"></div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:40px; max-width:1440px; margin:0 auto;">
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1552728089-571ebd49e5d4?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">For Dogs</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">For Cats</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">Small Pets</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:240px; height:240px; border-radius:50%; background:#FFEDD5; padding:8px; margin-bottom:24px;">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%; border:4px solid #FFFFFF;">
        </div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; color:#333333;">For Birds</div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div style="padding:100px 40px; background:#FF6B6B; text-align:center;">
    <div style="font-family:'Nunito', sans-serif; font-size:48px; font-weight:900; color:#FFFFFF; margin-bottom:80px;">Why Pet Parents Love Us</div>
    
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:30px; max-width:1440px; margin:0 auto;">
      <div style="background:#FFFFFF; padding:40px; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#FFF9E6; display:flex; align-items:center; justify-content:center; margin:0 auto 24px auto; font-size:40px;">🩺</div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; margin-bottom:16px;">Vet Approved</div>
        <div style="font-size:16px; font-weight:500; color:#555555; line-height:1.6;">All products are tested and approved by certified veterinarians.</div>
      </div>
      <div style="background:#FFFFFF; padding:40px; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#FFF9E6; display:flex; align-items:center; justify-content:center; margin:0 auto 24px auto; font-size:40px;">🌿</div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; margin-bottom:16px;">Organic Ingredients</div>
        <div style="font-size:16px; font-weight:500; color:#555555; line-height:1.6;">Natural, healthy treats with no artificial additives.</div>
      </div>
      <div style="background:#FFFFFF; padding:40px; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#FFF9E6; display:flex; align-items:center; justify-content:center; margin:0 auto 24px auto; font-size:40px;">🚚</div>
        <div style="font-family:'Nunito', sans-serif; font-size:24px; font-weight:800; margin-bottom:16px;">Fast Delivery</div>
        <div style="font-size:16px; font-weight:500; color:#555555; line-height:1.6;">Same-day dispatch because your pet can't wait!</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"pet-supplies":\s*`[\s\S]*?`/,
  `"pet-supplies": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PET SUPPLIES template updated.');
