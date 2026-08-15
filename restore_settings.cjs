const fs = require('fs');
const paths = [
  'dev-theme-peri/config/settings_schema.json',
  'app/data/templates/theme-engine/base-theme/config/settings_schema.json'
];

const blocks = [
  {
    "name": "Social Links",
    "settings": [
      { "type": "text", "id": "social_twitter_link", "label": "Twitter Link" },
      { "type": "text", "id": "social_facebook_link", "label": "Facebook Link" },
      { "type": "text", "id": "social_instagram_link", "label": "Instagram Link" },
      { "type": "text", "id": "social_tiktok_link", "label": "TikTok Link" },
      { "type": "text", "id": "social_pinterest_link", "label": "Pinterest Link" },
      { "type": "text", "id": "social_youtube_link", "label": "YouTube Link" },
      { "type": "text", "id": "social_logo_link", "label": "Organization Logo URL" }
    ]
  },
  {
    "name": "Favicon",
    "settings": [
      { "type": "image_picker", "id": "favicon", "label": "Favicon Image" }
    ]
  },
  {
    "name": "India-first Commerce",
    "settings": [
      { "type": "checkbox", "id": "enable_cod_badge", "label": "Enable COD Badge", "default": true },
      { "type": "text", "id": "cod_note", "label": "COD Note", "default": "Cash on Delivery available" },
      { "type": "checkbox", "id": "enable_upi_badges", "label": "Enable UPI Badges", "default": true },
      { "type": "checkbox", "id": "enable_whatsapp_cta", "label": "Enable WhatsApp CTA", "default": false },
      { "type": "text", "id": "whatsapp_number", "label": "WhatsApp Number", "info": "With country code, e.g. 91XXXXXXXXXX" },
      { "type": "checkbox", "id": "enable_pincode_checker", "label": "Enable Pincode Checker", "default": false },
      { "type": "checkbox", "id": "enable_gst_note", "label": "Show GST Note", "default": true },
      { "type": "text", "id": "gst_note_text", "label": "GST Note Text", "default": "Inclusive of all taxes" },
      { "type": "checkbox", "id": "enable_trust_strip", "label": "Enable Trust Strip", "default": true }
    ]
  }
];

paths.forEach(p => {
  let data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const existingNames = new Set(data.map(g => g.name));
  blocks.forEach(b => {
    if (!existingNames.has(b.name)) {
      data.push(b);
    }
  });
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
});
console.log("Restored missing blocks to schemas.");
