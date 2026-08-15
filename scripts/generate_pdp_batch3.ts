import fs from "fs";
import path from "path";

const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");

const nichesBatch3 = [
  { key: "kids", name: "Kids", bg: "#fef3c7", accent: "#d97706", text: "#78350f", features: "BPA Free • Safety Certified • STEM Approved" },
  { key: "coffee", name: "Coffee", bg: "#fffbe6", accent: "#78350f", text: "#451a03", features: "Roast Profile Radar • Grind Selector • Roast Date Freshness" },
  { key: "gaming", name: "Gaming", bg: "#1e1b4b", accent: "#c084fc", text: "#f472b6", features: "Polling Rate Specs • RGB Swatches • Twitch Endorsed" },
  { key: "eco", name: "Eco", bg: "#f0fdf4", accent: "#15803d", text: "#14532d", features: "Plastic-Free Packaging • Carbon Saved Counter • 1 Tree Planted" },
  { key: "artisan", name: "Artisan", bg: "#fff8f0", accent: "#a8a29e", text: "#44403c", features: "Artisan Maker Bio • Limited Edition Stamp • Provenance Certificate" }
];

nichesBatch3.forEach(niche => {
  for (let v = 1; v <= 10; v++) {
    const filename = `pdp-${niche.key}-v${v}.liquid`;
    const schemaName = `PDP ${niche.name} V${v}`; // strictly <= 25 chars
    
    const content = `<div class="pdp-sec-${niche.key}-v${v}" style="background: ${niche.bg}; color: ${niche.text}; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-start;">
    
    <!-- Left Column: Product Gallery & Badges -->
    <div style="flex: 1.2; min-width: 320px;">
      <div style="background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative;">
        <span style="position: absolute; top: 15px; left: 15px; background: ${niche.accent}; color: #fff; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">${niche.name} Crafted V${v}</span>
        <div style="width: 100%; height: 320px; background: rgba(0,0,0,0.04); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 20px;">🎁</div>
        <div style="font-size: 12px; font-weight: 700; opacity: 0.85;">${niche.features}</div>
      </div>
    </div>

    <!-- Right Column: High-Converting PDP Content -->
    <div style="flex: 1; min-width: 320px;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f59e0b; margin-bottom: 6px;">
        <span>★★★★★</span>
        <strong style="color: ${niche.text};">4.92/5.0 (290+ Customer Reviews)</strong>
      </div>
      <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 10px; line-height: 1.2;">{{ section.settings.title }}</h1>
      
      <!-- Price & BNPL Callout -->
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 15px;">
        <span style="font-size: 26px; font-weight: 900; color: ${niche.accent};">$49.00</span>
        <span style="font-size: 16px; text-decoration: line-through; opacity: 0.5;">$68.00</span>
        <span style="background: #ef4444; color: #fff; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">SPECIAL OFFER</span>
      </div>
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 20px;">or 4 interest-free payments of <strong>$12.25</strong> at checkout</div>

      <!-- Variant Swatches -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 8px;">
          <span>CHOOSE VARIATION</span>
          <a href="#" onclick="alert('Specifications Opened'); return false;" style="color: ${niche.accent}; text-decoration: underline;">View Specs 📐</a>
        </div>
        <div style="display: flex; gap: 10px;">
          <button style="border: 2px solid ${niche.accent}; background: #fff; color: #000; padding: 8px 16px; border-radius: 6px; font-weight: 800; cursor: pointer;">Edition A</button>
          <button style="border: 1px solid #ccc; background: #fff; color: #666; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Edition B</button>
          <button style="border: 1px solid #ccc; background: #fff; color: #666; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Edition C</button>
        </div>
      </div>

      <!-- Urgency Stock Counter -->
      <div style="background: rgba(234,179,8,0.15); border: 1px solid rgba(234,179,8,0.4); color: #b45309; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px;">
        🌟 POPULAR SELECTION: High demand item! Fast shipping available.
      </div>

      <!-- Add To Cart & Express Checkout -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
        <button style="background: ${niche.accent}; color: #fff; border: none; padding: 16px; border-radius: 8px; font-weight: 900; font-size: 15px; text-transform: uppercase; cursor: pointer; letter-spacing: 1px; width: 100%;">Add To Cart - $49.00</button>
        <button style="background: #111; color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; width: 100%;">Instant Buy Now ⚡</button>
      </div>

      <!-- Trust Strip Badges -->
      <div style="display: flex; justify-content: space-around; font-size: 11px; font-weight: 700; opacity: 0.85; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 15px;">
        <span>✅ Guaranteed Quality</span>
        <span>📦 Fast Dispatch</span>
        <span>↺ Easy Exchange</span>
      </div>

      <!-- Accordion Specifications -->
      <div style="margin-top: 25px; border-top: 1px solid rgba(0,0,0,0.1);">
        <details style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.1); cursor: pointer;">
          <summary style="font-weight: 800; font-size: 13px;">${niche.name} Care & Details</summary>
          <p style="font-size: 12px; opacity: 0.8; margin-top: 8px; line-height: 1.5;">Handpicked and crafted specifically for ${niche.name} enthusiasts. Complete satisfaction guaranteed.</p>
        </details>
        <details style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.1); cursor: pointer;">
          <summary style="font-weight: 800; font-size: 13px;">Shipping & Guarantee</summary>
          <p style="font-size: 12px; opacity: 0.8; margin-top: 8px; line-height: 1.5;">Fast insured delivery with full tracking code sent to your email.</p>
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
      "default": "Special ${niche.name} Edition V${v}"
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

console.log("Batch 3 PDP Sections (Kids, Coffee, Gaming, Eco, Artisan) successfully generated!");
