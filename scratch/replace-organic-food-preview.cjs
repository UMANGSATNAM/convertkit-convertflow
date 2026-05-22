const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#F9FAF8; color:#2C3E2D; min-height:100vh; font-family:'Outfit', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#6B8E23; color:#FFFFFF; text-align:center; padding:12px; font-size:13px; font-weight:500; letter-spacing:1px;">
    Fresh harvest just arrived! Free local delivery over $60.
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-bottom:1px solid #EBF2EA;">
    <div style="font-family:'Lora', serif; font-size:28px; font-weight:500; letter-spacing:1px; color:#2C3E2D;">EARTH & VINE</div>
    <div style="display:flex; gap:32px; font-size:14px; font-weight:500;">
      <span style="color:#6B8E23;">Shop</span>
      <span>Our Farm</span>
      <span>Recipes</span>
      <span>Journal</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="padding:80px 40px; position:relative; overflow:hidden;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;">
      <div style="padding-right:40px;">
        <div style="display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:600; padding:8px 16px; border-radius:30px; text-transform:uppercase; letter-spacing:2px; margin-bottom:24px; color:#6B8E23; border:1px solid #6B8E23;">
          <span style="display:inline-block; width:8px; height:8px; background:#6B8E23; border-radius:50%;"></span>
          FARM TO TABLE
        </div>
        <div style="font-family:'Lora', serif; font-size:72px; font-weight:400; line-height:1.1; margin-bottom:24px;">Wholesome, purely organic goodness.</div>
        <div style="font-size:18px; font-weight:300; color:#4A5D4E; line-height:1.6; margin-bottom:40px;">Nourish your body with seasonal produce sourced directly from local, sustainable farms.</div>
        <div style="display:inline-flex; align-items:center; justify-content:center; background:#6B8E23; color:#FFFFFF; font-size:16px; font-weight:500; padding:18px 40px; border-radius:50px;">SHOP THE HARVEST</div>
        
        <div style="display:flex; align-items:center; gap:24px; margin-top:48px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; background:#EBF2EA; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#6B8E23;">🌿</div>
            <div style="font-size:14px; font-weight:500;">100% Organic</div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; background:#EBF2EA; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#6B8E23;">🚜</div>
            <div style="font-size:14px; font-weight:500;">Locally Grown</div>
          </div>
        </div>
      </div>
      <div style="position:relative;">
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:100%; height:100%; background:#EBF2EA; border-radius:50% 50% 30% 70% / 60% 40% 60% 40%; z-index:1;"></div>
        <div style="position:relative; z-index:2; border-radius:30% 70% 70% 30% / 30% 30% 70% 70%; overflow:hidden; border:8px solid #FFFFFF; box-shadow:0 20px 40px rgba(44,62,45,0.08); aspect-ratio:4/5;">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>
    </div>
  </div>

  <!-- Categories -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:80px;">
        <div style="font-family:'Lora', serif; font-size:48px; font-weight:400; margin-bottom:16px;">Shop by Aisle</div>
        <div style="width:40px; height:2px; background:#6B8E23; margin:0 auto;"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:100%; border-radius:50% 50% 16px 16px; overflow:hidden; margin-bottom:24px; background:#F9FAF8;">
            <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Lora', serif; font-size:24px; font-weight:400;">Fresh Produce</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:100%; border-radius:50% 50% 16px 16px; overflow:hidden; margin-bottom:24px; background:#F9FAF8;">
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Lora', serif; font-size:24px; font-weight:400;">Pantry Staples</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:100%; border-radius:50% 50% 16px 16px; overflow:hidden; margin-bottom:24px; background:#F9FAF8;">
            <img src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Lora', serif; font-size:24px; font-weight:400;">Dairy & Eggs</div>
        </div>
        <div style="text-align:center;">
          <div style="position:relative; padding-bottom:100%; border-radius:50% 50% 16px 16px; overflow:hidden; margin-bottom:24px; background:#F9FAF8;">
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="font-family:'Lora', serif; font-size:24px; font-weight:400;">Artisan Bakery</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Featured -->
  <div style="background:#FFFFFF; padding:120px 40px;">
    <div style="max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;">
      <div style="position:relative;">
        <div style="position:absolute; top:-20px; left:-20px; width:100%; height:100%; background:#EBF2EA; border-radius:40% 60% 70% 30% / 40% 50% 60% 50%; z-index:1;"></div>
        <div style="position:relative; z-index:2; border-radius:24px; overflow:hidden; box-shadow:0 30px 60px rgba(44,62,45,0.08);">
          <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80" style="width:100%; height:auto; display:block;">
        </div>
        <div style="position:absolute; bottom:-30px; right:40px; background:#6B8E23; color:#FFFFFF; width:120px; height:120px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:3; text-align:center;">
          <div style="font-family:'Lora', serif; font-size:28px; font-weight:600; line-height:1; margin-bottom:4px;">$45</div>
          <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Per Box</div>
        </div>
      </div>
      <div>
        <div style="font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#6B8E23; margin-bottom:16px;">WEEKLY SPECIAL</div>
        <div style="font-family:'Lora', serif; font-size:56px; font-weight:400; line-height:1.2; margin-bottom:24px;">The Seasonal Harvest Box</div>
        <div style="font-size:18px; font-weight:300; line-height:1.6; color:#4A5D4E; margin-bottom:40px;">A curated selection of the week's best organic vegetables, fruits, and fresh herbs, delivered right to your door.</div>
        <div style="display:inline-flex; align-items:center; justify-content:center; background:#6B8E23; color:#FFFFFF; font-size:16px; font-weight:500; padding:18px 40px; border-radius:50px;">SUBSCRIBE & SAVE</div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"organic-food":\s*`[\s\S]*?`/,
  `"organic-food": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ORGANIC FOOD template updated.');
