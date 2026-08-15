import fs from "fs";
import path from "path";

const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");

const nichesBatch1 = [
  { key: "beauty", name: "Beauty", bg: "#fdf2f8", accent: "#db2777", text: "#831843", features: "Routine Steps • Botanical Ingredients • Dermatologist Approved" },
  { key: "fashion", name: "Fashion", bg: "#fafaf9", accent: "#1c1917", text: "#292524", features: "Fit Predictor • Model Stats (S) • Complete The Look Bundle" },
  { key: "tech", name: "Tech", bg: "#0f172a", accent: "#38bdf8", text: "#f8fafc", features: "360° Specs • EMI Calculator • 2-Year Warranty Included" },
  { key: "health", name: "Health", bg: "#f0fdf4", accent: "#16a34a", text: "#14532d", features: "Supplement Facts • Doctor Endorsed • Subscribe & Save 20%" },
  { key: "fmcg", name: "FMCG", bg: "#fefce8", accent: "#ca8a04", text: "#713f12", features: "Nutrition Label • 100% Organic • Pantry Bulk Discounts" }
];

nichesBatch1.forEach(niche => {
  for (let v = 1; v <= 10; v++) {
    const filename = `pdp-${niche.key}-v${v}.liquid`;
    const schemaName = `PDP ${niche.name} V${v}`; // strictly <= 25 chars
    
    const content = `<div class="pdp-sec-${niche.key}-v${v}" style="background: ${niche.bg}; color: ${niche.text}; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-start;">
    
    <!-- Left Column: Product Gallery & Badges -->
    <div style="flex: 1.2; min-width: 320px;">
      <div style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative;">
        <span style="position: absolute; top: 15px; left: 15px; background: ${niche.accent}; color: #fff; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">${niche.name} Special V${v}</span>
        <div style="width: 100%; height: 320px; background: rgba(0,0,0,0.04); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 20px;">🛍️</div>
        <div style="font-size: 12px; font-weight: 700; opacity: 0.8;">${niche.features}</div>
      </div>
    </div>

    <!-- Right Column: High-Converting PDP Content -->
    <div style="flex: 1; min-width: 320px;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f59e0b; margin-bottom: 6px;">
        <span>★★★★★</span>
        <strong style="color: ${niche.text};">4.9/5.0 (340+ Verified Reviews)</strong>
      </div>
      <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 10px; line-height: 1.2;">{{ section.settings.title }}</h1>
      
      <!-- Price & BNPL Callout -->
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 15px;">
        <span style="font-size: 26px; font-weight: 900; color: ${niche.accent};">$79.00</span>
        <span style="font-size: 16px; text-decoration: line-through; opacity: 0.5;">$110.00</span>
        <span style="background: #ef4444; color: #fff; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">SAVE 28%</span>
      </div>
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 20px;">or 4 interest-free payments of <strong>$19.75</strong> with <b>Klarna / Afterpay</b></div>

      <!-- Variant Swatches -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 8px;">
          <span>SELECT OPTION / SIZE</span>
          <a href="#" onclick="alert('Size & Fit Guide Opened'); return false;" style="color: ${niche.accent}; text-decoration: underline;">Size & Spec Guide 📐</a>
        </div>
        <div style="display: flex; gap: 10px;">
          <button style="border: 2px solid ${niche.accent}; background: #fff; color: #000; padding: 8px 16px; border-radius: 6px; font-weight: 800; cursor: pointer;">Option A</button>
          <button style="border: 1px solid #ccc; background: #fff; color: #666; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Option B</button>
          <button style="border: 1px solid #ccc; background: #fff; color: #666; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Option C</button>
        </div>
      </div>

      <!-- Urgency Stock Counter -->
      <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #dc2626; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; gap: 6px;">
        <span>🔥 LOW STOCK:</span> Only 7 units remaining in stock! Order within 02h 15m.
      </div>

      <!-- Add To Cart & Express Checkout -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
        <button style="background: ${niche.accent}; color: #fff; border: none; padding: 16px; border-radius: 8px; font-weight: 900; font-size: 15px; text-transform: uppercase; cursor: pointer; letter-spacing: 1px; width: 100%;">Add To Cart - $79.00</button>
        <button style="background: #ffb703; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; width: 100%;">Buy Now with Shop Pay ⚡</button>
      </div>

      <!-- Trust Strip Badges -->
      <div style="display: flex; justify-content: space-around; font-size: 11px; font-weight: 700; opacity: 0.85; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 15px;">
        <span>🔒 Secure Checkout</span>
        <span>🚚 Ships in 24h</span>
        <span>↺ 30-Day Returns</span>
      </div>

      <!-- Accordion Specifications -->
      <div style="margin-top: 25px; border-top: 1px solid rgba(0,0,0,0.1);">
        <details style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.1); cursor: pointer;">
          <summary style="font-weight: 800; font-size: 13px;">Product Details & Niche Specifications</summary>
          <p style="font-size: 12px; opacity: 0.8; margin-top: 8px; line-height: 1.5;">Designed specifically for ${niche.name}. Premium materials, tested durability, and full satisfaction guarantee.</p>
        </details>
        <details style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.1); cursor: pointer;">
          <summary style="font-weight: 800; font-size: 13px;">Shipping, Delivery & Returns</summary>
          <p style="font-size: 12px; opacity: 0.8; margin-top: 8px; line-height: 1.5;">Free express shipping on orders over $50. Hassle-free 30-day return policy.</p>
        </details>
      </div>
    </div>
  </div>
</div>

<!-- Mobile Sticky Add To Cart Bar -->
<div style="position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #ccc; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 99; box-shadow: 0 -4px 12px rgba(0,0,0,0.1);">
  <div>
    <div style="font-size: 12px; font-weight: 800; color: #111;">{{ section.settings.title }}</div>
    <div style="font-size: 14px; font-weight: 900; color: ${niche.accent};">$79.00</div>
  </div>
  <button style="background: ${niche.accent}; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 900; font-size: 12px; text-transform: uppercase;">Add To Cart</button>
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
      "default": "Premium ${niche.name} Signature Edition V${v}"
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

console.log("Batch 1 PDP Sections (Beauty, Fashion, Tech, Health, FMCG) successfully generated!");
