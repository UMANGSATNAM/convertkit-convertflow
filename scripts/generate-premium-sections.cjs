const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../app/data/templates');

// Map of directory names to their specific prefix and premium colors
const templates = {
  'fitness-power': { prefix: 'fp', color: '#ff4500' },
  'fresh-bites': { prefix: 'fb', color: '#4caf50' },
  'grooming-studio': { prefix: 'gs', color: '#8b4513' },
  'home-decor': { prefix: 'hd', color: '#d2b48c' },
  'jewel-luxe': { prefix: 'jl', color: '#d4af37' },
  'kids-wonder': { prefix: 'kw', color: '#ff69b4' },
  'minimal-fashion': { prefix: 'mf', color: '#000000' },
  'organic-beauty': { prefix: 'ob', color: '#8fbc8f' },
  'pets-joy': { prefix: 'pj', color: '#ffa500' },
  'tech-gadgets': { prefix: 'tg', color: '#00ffff' },
};

const newSections = [
  {
    name: 'bento-grid',
    title: 'Premium Bento Grid',
    content: (p, c) => `<style>
  .${p}-bento {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(200px, auto);
    gap: 20px;
    padding: 60px 40px;
    max-width: 1440px;
    margin: 0 auto;
    font-family: var(--${p}-font-sans, 'Inter', sans-serif);
  }
  .${p}-bento-item {
    background: #111;
    border-radius: 24px;
    padding: 40px;
    position: relative;
    overflow: hidden;
    color: #fff;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .${p}-bento-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    border-color: ${c};
  }
  .${p}-bento-item--large { grid-column: span 8; grid-row: span 2; }
  .${p}-bento-item--medium { grid-column: span 4; grid-row: span 2; }
  .${p}-bento-item--small { grid-column: span 4; grid-row: span 1; }
  
  .${p}-bento-title {
    font-size: clamp(24px, 3vw, 42px);
    font-weight: 700;
    margin-bottom: 15px;
    z-index: 2;
    position: relative;
    letter-spacing: -1px;
  }
  .${p}-bento-text {
    font-size: 16px;
    opacity: 0.8;
    z-index: 2;
    position: relative;
    max-width: 80%;
  }
  .${p}-bento-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.4;
    transition: transform 0.6s;
  }
  .${p}-bento-item:hover .${p}-bento-bg {
    transform: scale(1.05);
  }
  @media (max-width: 900px) {
    .${p}-bento-item { grid-column: span 12 !important; grid-row: auto !important; min-height: 300px; }
  }
</style>

<section class="${p}-bento">
  <div class="${p}-bento-item ${p}-bento-item--large">
    <img src="https://images.unsplash.com/photo-1618220179428-22790b46a015?w=1000&q=80" class="${p}-bento-bg" alt="Hero Feature">
    <h3 class="${p}-bento-title">{{ section.settings.title_1 | default: 'Next-Gen Performance' }}</h3>
    <p class="${p}-bento-text">{{ section.settings.text_1 | default: 'Experience unparalleled power and seamless integration in one beautiful package.' }}</p>
  </div>
  <div class="${p}-bento-item ${p}-bento-item--medium">
    <h3 class="${p}-bento-title" style="color: ${c};">{{ section.settings.title_2 | default: 'Eco-Friendly' }}</h3>
    <p class="${p}-bento-text">{{ section.settings.text_2 | default: 'Built with sustainable materials without compromising quality.' }}</p>
  </div>
  <div class="${p}-bento-item ${p}-bento-item--small">
    <h3 class="${p}-bento-title">{{ section.settings.title_3 | default: '24/7 Support' }}</h3>
  </div>
  <div class="${p}-bento-item ${p}-bento-item--small" style="background: ${c}; color: #000;">
    <h3 class="${p}-bento-title" style="color: #000;">{{ section.settings.title_4 | default: 'Free Shipping' }}</h3>
  </div>
</section>

{% schema %}
{
  "name": "Premium Bento Grid",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "title_1", "label": "Block 1 Title" },
    { "type": "textarea", "id": "text_1", "label": "Block 1 Text" }
  ],
  "presets": [{ "name": "Premium Bento Grid" }]
}
{% endschema %}
`
  },
  {
    name: 'mega-marquee',
    title: 'Mega Marquee',
    content: (p, c) => `<style>
  .${p}-marquee-wrapper {
    overflow: hidden;
    padding: 80px 0;
    background: var(--${p}-color-bg, #0a0a0a);
    color: var(--${p}-color-text, #fff);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .${p}-marquee {
    display: flex;
    white-space: nowrap;
    animation: ${p}-marquee-scroll 30s linear infinite;
  }
  .${p}-marquee:hover {
    animation-play-state: paused;
  }
  .${p}-marquee-text {
    font-family: var(--${p}-font-sans, sans-serif);
    font-size: clamp(60px, 8vw, 120px);
    font-weight: 900;
    text-transform: uppercase;
    padding: 0 40px;
    letter-spacing: -2px;
    -webkit-text-stroke: 1px rgba(255,255,255,0.2);
    color: transparent;
    transition: all 0.3s ease;
    cursor: default;
  }
  .${p}-marquee-text:hover {
    color: ${c};
    -webkit-text-stroke: 0;
    text-shadow: 0 0 40px ${c}80;
  }
  @keyframes ${p}-marquee-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
</style>

<div class="${p}-marquee-wrapper">
  <div class="${p}-marquee">
    <div class="${p}-marquee-text">{{ section.settings.text | default: 'UNCOMPROMISING QUALITY • INNOVATIVE DESIGN • EXCEPTIONAL EXPERIENCE •' }}</div>
    <div class="${p}-marquee-text">{{ section.settings.text | default: 'UNCOMPROMISING QUALITY • INNOVATIVE DESIGN • EXCEPTIONAL EXPERIENCE •' }}</div>
  </div>
</div>

{% schema %}
{
  "name": "Mega Marquee",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "text", "label": "Marquee Text" }
  ],
  "presets": [{ "name": "Mega Marquee" }]
}
{% endschema %}
`
  },
  {
    name: 'interactive-hotspots',
    title: 'Interactive Hotspots',
    content: (p, c) => `<style>
  .${p}-hotspots-section {
    padding: 80px 20px;
    display: flex;
    justify-content: center;
  }
  .${p}-hotspots-container {
    position: relative;
    max-width: 1000px;
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
  }
  .${p}-hotspots-img {
    width: 100%;
    height: auto;
    display: block;
  }
  .${p}-hotspot {
    position: absolute;
    width: 24px;
    height: 24px;
    background: ${c};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    box-shadow: 0 0 0 0 ${c}80;
    animation: ${p}-pulse 2s infinite;
  }
  .${p}-hotspot:hover {
    animation: none;
    transform: translate(-50%, -50%) scale(1.2);
  }
  .${p}-hotspot-tooltip {
    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.9);
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: var(--${p}-font-sans, sans-serif);
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    pointer-events: none;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
  }
  .${p}-hotspot:hover .${p}-hotspot-tooltip {
    opacity: 1;
    visibility: visible;
    bottom: 150%;
  }
  @keyframes ${p}-pulse {
    0% { box-shadow: 0 0 0 0 ${c}80; }
    70% { box-shadow: 0 0 0 15px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }
</style>

<section class="${p}-hotspots-section">
  <div class="${p}-hotspots-container">
    <img src="{{ section.settings.image | img_url: 'master' | default: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=1200&q=80' }}" class="${p}-hotspots-img" alt="Product Hotspots">
    
    <div class="${p}-hotspot" style="top: 40%; left: 30%;">
      <div class="${p}-hotspot-tooltip">{{ section.settings.hotspot_1 | default: 'Premium Aluminum Chassis' }}</div>
    </div>
    <div class="${p}-hotspot" style="top: 60%; left: 70%;">
      <div class="${p}-hotspot-tooltip">{{ section.settings.hotspot_2 | default: 'Advanced Cooling System' }}</div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Interactive Hotspots",
  "tag": "section",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Base Image" },
    { "type": "text", "id": "hotspot_1", "label": "Hotspot 1 Text" },
    { "type": "text", "id": "hotspot_2", "label": "Hotspot 2 Text" }
  ],
  "presets": [{ "name": "Interactive Hotspots" }]
}
{% endschema %}
`
  },
  {
    name: 'parallax-video',
    title: 'Parallax Video',
    content: (p, c) => `<style>
  .${p}-parallax-sec {
    position: relative;
    height: 80vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    clip-path: inset(0);
  }
  .${p}-parallax-vid {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    z-index: -1;
    pointer-events: none;
  }
  .${p}-parallax-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
  }
  .${p}-parallax-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #fff;
    font-family: var(--${p}-font-sans, sans-serif);
  }
  .${p}-parallax-title {
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 800;
    margin-bottom: 20px;
    letter-spacing: -2px;
  }
  .${p}-parallax-btn {
    display: inline-block;
    padding: 16px 40px;
    background: ${c};
    color: #000;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 1px;
    border-radius: 4px;
    transition: transform 0.3s;
  }
  .${p}-parallax-btn:hover {
    transform: scale(1.05);
  }
</style>

<section class="${p}-parallax-sec">
  <video class="${p}-parallax-vid" autoplay muted loop playsinline>
    <source src="{{ section.settings.video_url | default: 'https://cdn.shopify.com/videos/c/o/v/02d0ec7849e742c3809cbceb7405e5d3.mp4' }}" type="video/mp4">
  </video>
  <div class="${p}-parallax-overlay"></div>
  <div class="${p}-parallax-content">
    <h2 class="${p}-parallax-title">{{ section.settings.title | default: 'Feel the Motion' }}</h2>
    <a href="#" class="${p}-parallax-btn">{{ section.settings.btn | default: 'Discover More' }}</a>
  </div>
</section>

{% schema %}
{
  "name": "Parallax Video",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "video_url", "label": "Video URL" },
    { "type": "text", "id": "title", "label": "Heading" }
  ],
  "presets": [{ "name": "Parallax Video" }]
}
{% endschema %}
`
  }
];

function generateSections() {
  for (const [dir, config] of Object.entries(templates)) {
    const sectionsDir = path.join(templatesDir, dir, 'sections');
    const manifestPath = path.join(templatesDir, dir, 'manifest.json');
    
    if (!fs.existsSync(sectionsDir)) {
      console.log('Skipping ' + dir + ', sections not found');
      continue;
    }
    
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (e) {
      console.error('Failed to read manifest for ' + dir);
      continue;
    }

    const newManifestSections = [];

    newSections.forEach(section => {
      const fileName = config.prefix + '-' + section.name + '.liquid';
      const filePath = path.join(sectionsDir, fileName);
      
      fs.writeFileSync(filePath, section.content(config.prefix, config.color));
      console.log('Created ' + filePath);
      
      const manifestEntry = 'sections/' + fileName;
      if (!manifest.sections.includes(manifestEntry)) {
         manifest.sections.push(manifestEntry);
      }
    });

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Updated manifest for ' + dir);
  }
}

generateSections();
