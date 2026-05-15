import fs from 'fs';
import path from 'path';

// Read all templates from niches
const nichesDir = 'convertkit-convertflow/theme-niches';
const folders = fs.readdirSync(nichesDir);

let templatesHtmlContent = fs.readFileSync('app/templatesHtml.js', 'utf8');
let appIndexContent = fs.readFileSync('app/routes/app._index.jsx', 'utf8');

const removeOldInjection = (content) => {
  return content.replace(/<!-- SUPER THEME SECTIONS PREVIEW -->[\s\S]*?<\/div>\s*<\/body>/g, '</body>');
};

templatesHtmlContent = removeOldInjection(templatesHtmlContent);
appIndexContent = removeOldInjection(appIndexContent);

for (const folder of folders) {
  const settingsPath = path.join(nichesDir, folder, 'config', 'settings_data.json');
  let accent = "#000000";
  let bg = "#ffffff";
  let text = "#333333";
  let accentText = "#ffffff";

  if (fs.existsSync(settingsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (data.current) {
        accent = data.current.color_accent || accent;
        bg = data.current.color_bg || bg;
        text = data.current.color_text || text;
        accentText = data.current.color_accent_text || accentText;
      }
    } catch(e) {}
  }

  // Create the dynamic HTML block with these exact colors
  const injection = `
<!-- SUPER THEME SECTIONS PREVIEW -->
<div style="font-family: inherit; background: ${bg}; padding: 40px 0; border-top: 1px solid rgba(0,0,0,0.05); color: ${text};">
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="background: ${accent}; color: ${accentText}; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Super Theme Sections</span>
  </div>

  <!-- COUNTDOWN BANNER -->
  <div style="background:${accent}; color:${accentText}; text-align:center; padding:24px; margin: 40px 0;">
    <h2 style="font-size:24px; font-weight:700; margin-bottom:12px;">Flash Sale Ending Soon</h2>
    <div style="display:inline-flex; gap:16px;">
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">02</span><br><span style="font-size:11px; text-transform:uppercase;">Days</span></div>
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">14</span><br><span style="font-size:11px; text-transform:uppercase;">Hours</span></div>
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">45</span><br><span style="font-size:11px; text-transform:uppercase;">Mins</span></div>
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">12</span><br><span style="font-size:11px; text-transform:uppercase;">Secs</span></div>
    </div>
  </div>

  <!-- BEFORE/AFTER SLIDER -->
  <div style="max-width:800px; margin:60px auto; text-align:center;">
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: ${text};">Real Results</h2>
    <p style="opacity:0.7; margin-bottom:32px;">See the difference</p>
    <div style="position:relative; width:100%; height:400px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; inset:0; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover;"></div>
      <div style="position:absolute; inset:0; right:50%; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover; border-right:4px solid #fff; filter:grayscale(100%);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
    </div>
  </div>

  <!-- FREQUENTLY BOUGHT TOGETHER -->
  <div style="max-width:1000px; margin:60px auto; background:rgba(0,0,0,0.03); padding:40px; border-radius:12px; border: 1px solid rgba(0,0,0,0.05);">
    <h2 style="font-size:24px; font-weight:700; margin-bottom:24px; color: ${text};">Frequently Bought Together</h2>
    <div style="display:flex; gap:20px; align-items:center; margin-bottom:24px;">
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: ${text};">Main Item</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: ${text};">Add-on 1</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: ${text};">Add-on 2</div></div>
      <div style="margin-left:auto; text-align:right;">
        <div style="font-size:14px; opacity: 0.5; text-decoration:line-through;">$$150.00</div>
        <div style="font-size:24px; font-weight:800; color: ${accent};">$$135.00</div>
        <button style="background:${text}; color:${bg}; border:none; padding:12px 24px; border-radius:6px; font-weight:600; margin-top:12px; cursor:pointer;">Add Bundle to Cart</button>
      </div>
    </div>
  </div>

  <!-- SHOPPABLE IMAGE -->
  <div style="max-width:1200px; margin:60px auto; text-align:center;">
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: ${text};">Shop the Look</h2>
    <p style="opacity:0.7; margin-bottom:32px;">Tap the pins to view products</p>
    <div style="position:relative; width:100%; height:500px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; top:40%; left:50%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:${accent}; border-radius:50%;"></div>
      </div>
      <div style="position:absolute; top:60%; left:30%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:${accent}; border-radius:50%;"></div>
      </div>
    </div>
  </div>
</div>
</body>`;

  // Inject into templatesHtml.js
  // We look for \`"${folder}": \`...</body>\`
  // Since we removed the old injection, we just replace </body> in that specific template.
  const regex = new RegExp(`("\\s*${folder}\\s*":\\s*\`[\\s\\S]*?)<\\/body>`);
  templatesHtmlContent = templatesHtmlContent.replace(regex, `$1${injection}`);

  // For hardcoded templates in app._index.jsx (pilgrim, tanishq, caratlane)
  if (['pilgrim', 'tanishq', 'caratlane'].includes(folder)) {
    const varName = `${folder}PreviewHTML`;
    const regex2 = new RegExp(`(const \\s*${varName}\\s*=\\s*\`[\\s\\S]*?)<\\/body>`);
    appIndexContent = appIndexContent.replace(regex2, `$1${injection}`);
  }
}

fs.writeFileSync('app/templatesHtml.js', templatesHtmlContent);
fs.writeFileSync('app/routes/app._index.jsx', appIndexContent);

console.log("Injected dynamic styled previews!");
