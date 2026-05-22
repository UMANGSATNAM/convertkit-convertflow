const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `
<div style="background:#FFFAF0; min-height:100vh; font-family:'Poppins', sans-serif;">
  
  <!-- Announcement -->
  <div style="background:#E53E3E; color:#FFFFFF; text-align:center; padding:12px; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
    DELIVERING FRESH TO YOUR DOOR IN UNDER 30 MINUTES 🚴‍♂️
  </div>

  <!-- Header -->
  <div style="padding:24px 40px; display:flex; justify-content:space-between; align-items:center;">
    <div style="font-size:32px; font-weight:900; color:#2D3748; letter-spacing:-1px;">Veda Eats</div>
    <div style="display:flex; gap:32px; font-size:16px; font-weight:700; color:#4A5568;">
      <span style="color:#E53E3E;">Order Now</span>
      <span>Menu</span>
      <span>Offers</span>
      <span>Rewards</span>
    </div>
  </div>

  <!-- Hero -->
  <div style="position:relative; display:grid; grid-template-columns:1fr 1fr; gap:60px; padding:60px 40px; align-items:center; max-width:1440px; margin:0 auto;">
    <div style="padding-right:20px;">
      <div style="display:inline-block; font-size:14px; font-weight:700; letter-spacing:2px; color:#E53E3E; margin-bottom:24px; background:rgba(229,62,62,0.1); padding:8px 20px; border-radius:30px;">
        FRESH & FAST
      </div>
      <div style="font-size:76px; font-weight:800; line-height:1.1; color:#2D3748; margin-bottom:24px; letter-spacing:-1.5px;">Cravings, Cured.</div>
      <div style="font-size:20px; font-weight:400; color:#4A5568; line-height:1.6; margin-bottom:40px; max-width:480px;">Discover local flavors and chef-crafted meals delivered hot to your doorstep.</div>
      <div style="display:inline-block; background:#E53E3E; color:#FFFFFF; padding:18px 40px; font-size:16px; font-weight:700; letter-spacing:1px; border-radius:50px; box-shadow:0 10px 25px rgba(229,62,62,0.4);">ORDER NOW</div>
    </div>
    
    <div style="position:relative; height:500px;">
      <div style="position:absolute; width:80%; height:80%; background:#FEEBC8; border-radius:50%; top:10%; right:0;"></div>
      <div style="position:absolute; width:60%; height:60%; background:#FED7D7; border-radius:50%; bottom:0; left:10%;"></div>
      <div style="position:relative; z-index:2; width:90%; padding-bottom:90%; border-radius:50%; overflow:hidden; border:8px solid #FFFFFF; box-shadow:0 30px 60px rgba(0,0,0,0.1);">
        <div style="position:absolute; inset:0; width:100%; height:100%; background:url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80') center/cover;"></div>
      </div>
      
      <div style="position:absolute; top:20%; left:-5%; z-index:3; background:#FFFFFF; padding:12px 20px; border-radius:30px; box-shadow:0 10px 20px rgba(0,0,0,0.1); display:flex; align-items:center; gap:8px;">
        <span style="font-size:24px;">⭐</span>
        <span style="font-weight:700; color:#2D3748;">4.9/5 Rating</span>
      </div>
    </div>
  </div>

  <!-- Categories -->
  <div style="padding:100px 40px; background:#FFFFFF; text-align:center;">
    <div style="font-size:48px; font-weight:800; color:#2D3748; margin-bottom:60px; letter-spacing:-1px;">Explore the Menu</div>
    
    <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:20px; max-width:1440px; margin:0 auto;">
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 20px; background:#FFFAF0; border-radius:30px; border:2px solid transparent;">
        <div style="font-size:48px; margin-bottom:16px;">🍕</div>
        <div style="font-size:18px; font-weight:700; color:#2D3748;">Pizza</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 20px; background:#FFFFFF; border-radius:30px; border:2px solid #E53E3E; box-shadow:0 20px 40px rgba(229,62,62,0.1);">
        <div style="font-size:48px; margin-bottom:16px;">🍔</div>
        <div style="font-size:18px; font-weight:700; color:#2D3748;">Burgers</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 20px; background:#FFFAF0; border-radius:30px; border:2px solid transparent;">
        <div style="font-size:48px; margin-bottom:16px;">🥗</div>
        <div style="font-size:18px; font-weight:700; color:#2D3748;">Healthy</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 20px; background:#FFFAF0; border-radius:30px; border:2px solid transparent;">
        <div style="font-size:48px; margin-bottom:16px;">🍣</div>
        <div style="font-size:18px; font-weight:700; color:#2D3748;">Sushi</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 20px; background:#FFFAF0; border-radius:30px; border:2px solid transparent;">
        <div style="font-size:48px; margin-bottom:16px;">🍰</div>
        <div style="font-size:18px; font-weight:700; color:#2D3748;">Dessert</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 20px; background:#FFFAF0; border-radius:30px; border:2px solid transparent;">
        <div style="font-size:48px; margin-bottom:16px;">🥤</div>
        <div style="font-size:18px; font-weight:700; color:#2D3748;">Drinks</div>
      </div>
    </div>
  </div>

  <!-- Collection -->
  <div style="padding:100px 40px; max-width:1440px; margin:0 auto;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px;">
      <div style="font-size:48px; font-weight:800; color:#2D3748; letter-spacing:-1px;">Popular Near You</div>
      <div style="font-size:16px; font-weight:700; color:#E53E3E; padding:12px 24px; background:rgba(229,62,62,0.1); border-radius:30px;">VIEW MENU</div>
    </div>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:30px;">
      <div style="background:#FFFFFF; border-radius:30px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <div style="position:relative; padding-bottom:70%;">
          <div style="position:absolute; inset:0; width:100%; height:100%; background:url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="position:absolute; top:16px; left:16px; background:#E53E3E; color:#FFFFFF; font-size:12px; font-weight:700; padding:6px 12px; border-radius:20px; text-transform:uppercase;">Popular</div>
          <div style="position:absolute; top:16px; right:16px; background:#FFFFFF; font-size:12px; font-weight:700; color:#2D3748; padding:6px 12px; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"><span style="color:#F6AD55;">★</span> 4.8</div>
        </div>
        <div style="padding:24px;">
          <div style="font-size:20px; font-weight:700; color:#2D3748; margin-bottom:8px;">Classic Cheeseburger</div>
          <div style="font-size:14px; color:#718096; margin-bottom:24px; line-height:1.5;">Juicy beef patty, melted cheese, fresh lettuce, tomato, and our secret sauce.</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:24px; font-weight:800; color:#E53E3E;">$12.99</div>
            <div style="width:48px; height:48px; background:#2D3748; color:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold;">+</div>
          </div>
        </div>
      </div>
      <div style="background:#FFFFFF; border-radius:30px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <div style="position:relative; padding-bottom:70%;">
          <div style="position:absolute; inset:0; width:100%; height:100%; background:url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="position:absolute; top:16px; right:16px; background:#FFFFFF; font-size:12px; font-weight:700; color:#2D3748; padding:6px 12px; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"><span style="color:#F6AD55;">★</span> 4.9</div>
        </div>
        <div style="padding:24px;">
          <div style="font-size:20px; font-weight:700; color:#2D3748; margin-bottom:8px;">Margherita Pizza</div>
          <div style="font-size:14px; color:#718096; margin-bottom:24px; line-height:1.5;">Fresh mozzarella, sweet basil, and our house-made tomato sauce on thin crust.</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:24px; font-weight:800; color:#E53E3E;">$16.50</div>
            <div style="width:48px; height:48px; background:#2D3748; color:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold;">+</div>
          </div>
        </div>
      </div>
      <div style="background:#FFFFFF; border-radius:30px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <div style="position:relative; padding-bottom:70%;">
          <div style="position:absolute; inset:0; width:100%; height:100%; background:url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="position:absolute; top:16px; left:16px; background:#E53E3E; color:#FFFFFF; font-size:12px; font-weight:700; padding:6px 12px; border-radius:20px; text-transform:uppercase;">Popular</div>
          <div style="position:absolute; top:16px; right:16px; background:#FFFFFF; font-size:12px; font-weight:700; color:#2D3748; padding:6px 12px; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"><span style="color:#F6AD55;">★</span> 4.7</div>
        </div>
        <div style="padding:24px;">
          <div style="font-size:20px; font-weight:700; color:#2D3748; margin-bottom:8px;">Healthy Bowl</div>
          <div style="font-size:14px; color:#718096; margin-bottom:24px; line-height:1.5;">Quinoa, roasted sweet potatoes, avocado, and tahini dressing.</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:24px; font-weight:800; color:#E53E3E;">$14.00</div>
            <div style="width:48px; height:48px; background:#2D3748; color:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold;">+</div>
          </div>
        </div>
      </div>
      <div style="background:#FFFFFF; border-radius:30px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <div style="position:relative; padding-bottom:70%;">
          <div style="position:absolute; inset:0; width:100%; height:100%; background:url('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="position:absolute; top:16px; right:16px; background:#FFFFFF; font-size:12px; font-weight:700; color:#2D3748; padding:6px 12px; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"><span style="color:#F6AD55;">★</span> 4.9</div>
        </div>
        <div style="padding:24px;">
          <div style="font-size:20px; font-weight:700; color:#2D3748; margin-bottom:8px;">Sushi Roll Platter</div>
          <div style="font-size:14px; color:#718096; margin-bottom:24px; line-height:1.5;">Assorted fresh sashimi and rolls with wasabi and soy sauce.</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:24px; font-weight:800; color:#E53E3E;">$22.00</div>
            <div style="width:48px; height:48px; background:#2D3748; color:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold;">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`;

content = content.replace(
  /"food-delivery":\s*`[\s\S]*?`/,
  `"food-delivery": \`${newHtml}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('VEDA EATS template updated.');
