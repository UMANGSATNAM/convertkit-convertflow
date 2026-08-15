import fs from "fs";
import path from "path";

const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");

const nichesBatch2 = [
  { key: "jewelry", name: "Jewelry", bg: "#0f172a", accent: "#eab308", text: "#f8fafc", features: "Certificate of Authenticity • Ring Sizer • Lifetime Warranty" },
  { key: "pet", name: "Pet", bg: "#f0f9ff", accent: "#0284c7", text: "#0c4a6e", features: "Weight Breed Selector • Auto-Ship 15% • Vet Recommended" },
  { key: "home", name: "Home", bg: "#fafaf9", accent: "#78716c", text: "#292524", features: "Room Scale Diagram • Wood Swatches • White-Glove Delivery" },
  { key: "fitness", name: "Fitness", bg: "#f8fafc", accent: "#ea580c", text: "#0f172a", features: "Resistance Level • Sweat-Proof Guarantee • Workout App Access" },
  { key: "auto", name: "Auto", bg: "#18181b", accent: "#facc15", text: "#f4f4f5", features: "Fitment Checker • OEM Part Match • Installation Video Guide" }
];

nichesBatch2.forEach(niche => {
  for (let v = 1; v <= 10; v++) {
    const filename = `pdp-${niche.key}-v${v}.liquid`;
    const schemaName = `PDP ${niche.name} V${v}`; // strictly <= 25 chars
    
    const content = `<div class="pdp-sec-${niche.key}-v${v}" style="background: ${niche.bg}; color: ${niche.text}; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-start;">
    
    <!-- Left Column: Product Gallery & Badges -->
    <div style="flex: 1.2; min-width: 320px;">
      <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative;">
        <span style="position: absolute; top: 15px; left: 15px; background: ${niche.accent}; color: #000; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">${niche.name} Master V${v}</span>
        <div style="width: 100%; height: 320px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 20px;">📦</div>
        <div style="font-size: 12px; font-weight: 700; opacity: 0.85;">${niche.features}</div>
      </div>
    </div>

    <!-- Right Column: High-Converting PDP Content -->
    <div style="flex: 1; min-width: 320px;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f59e0b; margin-bottom: 6px;">
        <span>★★★★★</span>
        <strong style="color: ${niche.text};">4.95/5.0 (480+ Verified Reviews)</strong>
      </div>
      <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 10px; line-height: 1.2;">{{ section.settings.title }}</h1>
      
      <!-- Price & BNPL Callout -->
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 15px;">
        <span style="font-size: 26px; font-weight: 900; color: ${niche.accent};">$149.00</span>
        <span style="font-size: 16px; text-decoration: line-through; opacity: 0.5;">$199.00</span>
        <span style="background: #ef4444; color: #fff; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">SAVE $50</span>
      </div>
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 20px;">or 4 interest-free payments of <strong>$37.25</strong> with <b>Shop Pay / Affirm</b></div>

      <!-- Variant Swatches -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 8px;">
          <span>SELECT VARIANTS</span>
          <a href="#" onclick="alert('Fitment & Sizing Chart Opened'); return false;" style="color: ${niche.accent}; text-decoration: underline;">Sizing Chart 📐</a>
        </div>
        <div style="display: flex; gap: 10px;">
          <button style="border: 2px solid ${niche.accent}; background: #fff; color: #000; padding: 8px 16px; border-radius: 6px; font-weight: 800; cursor: pointer;">Variant 1</button>
          <button style="border: 1px solid #ccc; background: #fff; color: #666; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Variant 2</button>
          <button style="border: 1px solid #ccc; background: #fff; color: #666; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Variant 3</button>
        </div>
      </div>

      <!-- Urgency Stock Counter -->
      <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #b45309; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px;">
        ⚡ IN DEMAND: 14 people are viewing this product right now!
      </div>

      <!-- Add To Cart & Express Checkout -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
        <button style="background: ${niche.accent}; color: #000; border: none; padding: 16px; border-radius: 8px; font-weight: 900; font-size: 15px; text-transform: uppercase; cursor: pointer; letter-spacing: 1px; width: 100%;">Add To Cart - $149.00</button>
        <button style="background: #fff; color: #000; border: 1px solid #ccc; padding: 14px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; width: 100%;">Express Checkout ⚡</button>
      </div>

      <!-- Trust Strip Badges -->
      <div style="display: flex; justify-content: space-around; font-size: 11px; font-weight: 700; opacity: 0.85; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 15px;">
        <span>🛡️ Authentic Guarantee</span>
        <span>✈️ Insured Delivery</span>
        <span>↺ Easy Returns</span>
      </div>

      <!-- Accordion Specifications -->
      <div style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.15);">
        <details style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.15); cursor: pointer;">
          <summary style="font-weight: 800; font-size: 13px;">${niche.name} Specs & Materials</summary>
          <p style="font-size: 12px; opacity: 0.8; margin-top: 8px; line-height: 1.5;">Built to exact industry standards for ${niche.name}. Full warranty and support included.</p>
        </details>
        <details style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.15); cursor: pointer;">
          <summary style="font-weight: 800; font-size: 13px;">Shipping & Warranty Info</summary>
          <p style="font-size: 12px; opacity: 0.8; margin-top: 8px; line-height: 1.5;">Tracked express dispatch. 1-year manufacturer warranty included.</p>
        </details>
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "${schemaName}",
  "tag": "section",
  "class": "section-pdp-${niche.key}-v${v}",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Product Title",
      "default": "Pro ${niche.name} Executive Edition V${v}"
    }
  ],
  "presets": [
    {
      "name": "${schemaName}"
    }
  ]
}
{% endschema %}
`;

    fs.writeFileSync(path.join(sectionsDir, filename), content);
  }
});

console.log("Batch 2 PDP Sections (Jewelry, Pet, Home, Fitness, Auto) successfully generated!");
