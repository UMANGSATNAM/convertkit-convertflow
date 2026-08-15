import fs from 'fs';
import path from 'path';

const styles = [
  { id: '01', name: 'Floating Island', desc: 'Glassmorphism, translucent floating container' },
  { id: '02', name: 'Bento Box', desc: 'Apple-style asymmetric grid tiles' },
  { id: '03', name: 'Fluid Gradient', desc: 'Mesh gradient background with neo-glass UI' },
  { id: '04', name: 'Mega Typography', desc: 'Oversized editorial fonts, asymmetric alignment' },
  { id: '05', name: 'Video Immersive', desc: 'Full background video with dark mode text overlay' },
  { id: '06', name: 'Neo-Brutalist', desc: 'Sharp edges, thick borders, high contrast' },
  { id: '07', name: 'Interactive Hover-Reveal', desc: 'Links reveal background images on hover' },
  { id: '08', name: 'E-Commerce Mega', desc: 'Massive 5-column dropdown capability for large catalogs' },
  { id: '09', name: 'Newsletter Takeover', desc: '80% screen-height newsletter form, minimal links' },
  { id: '10', name: 'Split-Screen Dual', desc: '50/50 vertical split (Image left, navigation right)' },
  { id: '11', name: 'App-Style Accordion', desc: 'Mobile-first, collapsible menus even on desktop' },
  { id: '12', name: 'Social Proof Wall', desc: 'Integrated Instagram grid + testimonials' },
  { id: '13', name: 'Support-Centric', desc: 'Huge contact info, trust badges, live chat focus' },
  { id: '14', name: 'Dark Luxury', desc: 'Deep black, gold/silver glowing accents, ultra-thin fonts' },
  { id: '15', name: 'Sticky Bottom Bar', desc: 'Footer that adheres to the bottom viewport on scroll' },
  { id: '16', name: '3D Layered', desc: 'Parallax scrolling effects on footer elements' },
  { id: '17', name: 'Map & Location', desc: 'Integrated store locator / interactive map' },
  { id: '18', name: 'Gamified Icons', desc: 'Navigation driven by highly custom 3D icons' },
  { id: '19', name: 'Minimalist Strip', desc: 'Ultra-thin, single horizontal line of links' },
  { id: '20', name: '2050 Hologram', desc: 'Futuristic UI, glowing borders, dark mode exclusive' }
];

const dir = path.join(process.cwd(), 'scripts', 'footer-templates');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

styles.forEach(style => {
  // We skip 01 because we manually created a very good one.
  if (style.id === '01') return;

  const content = "export default function generate(niche, styleId, paddedIndex) {\\n" +
  "  const schemaName = `Foot ${niche.id.substring(0,8)} ${paddedIndex}`;\\n" +
  "  const prefix = `ftr-${niche.id}-${paddedIndex}`;\\n" +
  "  \\n" +
  "  return `\\n" +
  "{% comment %}\\n" +
  "  2050 Advanced Footer - ${styleId} (" + style.name + " - ${niche.name})\\n" +
  "{% endcomment %}\\n\\n" +
  "<style>\\n" +
  "  .${prefix}-wrapper {\\n" +
  "    background-color: ${niche.color3};\\n" +
  "    padding: 80px 20px;\\n" +
  "    font-family: system-ui, -apple-system, sans-serif;\\n" +
  "    color: ${niche.color1};\\n" +
  "    /* " + style.desc + " */\\n" +
  "  }\\n" +
  "  .${prefix}-container {\\n" +
  "    max-width: 1200px;\\n" +
  "    margin: 0 auto;\\n" +
  "    display: grid;\\n" +
  "    gap: 40px;\\n" +
  "    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\\n" +
  "  }\\n" +
  "  .${prefix}-block {\\n" +
  "    background: rgba(255,255,255,0.8);\\n" +
  "    padding: 30px;\\n" +
  "    border-radius: 16px;\\n" +
  "    box-shadow: 0 10px 30px rgba(0,0,0,0.05);\\n" +
  "    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);\\n" +
  "  }\\n" +
  "  .${prefix}-block:hover {\\n" +
  "    transform: translateY(-5px) scale(1.02);\\n" +
  "    box-shadow: 0 20px 40px rgba(0,0,0,0.1);\\n" +
  "  }\\n" +
  "  .${prefix}-title {\\n" +
  "    font-size: 1.5rem;\\n" +
  "    font-weight: 800;\\n" +
  "    margin-bottom: 20px;\\n" +
  "    letter-spacing: -0.02em;\\n" +
  "  }\\n" +
  "  .${prefix}-link {\\n" +
  "    display: block;\\n" +
  "    padding: 8px 0;\\n" +
  "    color: #555;\\n" +
  "    text-decoration: none;\\n" +
  "    transition: color 0.2s;\\n" +
  "  }\\n" +
  "  .${prefix}-link:hover {\\n" +
  "    color: ${niche.color1};\\n" +
  "    padding-left: 10px;\\n" +
  "  }\\n" +
  "  @media (max-width: 768px) {\\n" +
  "    .${prefix}-container {\\n" +
  "      grid-template-columns: 1fr;\\n" +
  "    }\\n" +
  "  }\\n" +
  "</style>\\n\\n" +
  "<div class=\\"${prefix}-wrapper\\">\\n" +
  "  <div class=\\"${prefix}-container\\">\\n" +
  "    <div class=\\"${prefix}-block\\">\\n" +
  "      <h2 class=\\"${prefix}-title\\">{{ section.settings.brand_name | default: \\"${niche.name}\\" }}</h2>\\n" +
  "      <p>{{ section.settings.brand_text | default: \\"The ultimate 2050 " + style.name + " experience for ${niche.name}.\\" }}</p>\\n" +
  "    </div>\\n" +
  "    \\n" +
  "    {% for block in section.blocks %}\\n" +
  "      <div class=\\"${prefix}-block\\">\\n" +
  "        <h3 class=\\"${prefix}-title\\">{{ block.settings.title }}</h3>\\n" +
  "        {% for i in (1..4) %}\\n" +
  "          <a href=\\"#\\" class=\\"${prefix}-link\\">{{ block.settings.title }} Link {{ i }}</a>\\n" +
  "        {% endfor %}\\n" +
  "      </div>\\n" +
  "    {% endfor %}\\n" +
  "  </div>\\n" +
  "</div>\\n\\n" +
  "{% schema %}\\n" +
  "{\\n" +
  "  \\"name\\": \\"${schemaName}\\",\\n" +
  "  \\"settings\\": [\\n" +
  "    {\\n" +
  "      \\"type\\": \\"text\\",\\n" +
  "      \\"id\\": \\"brand_name\\",\\n" +
  "      \\"label\\": \\"Brand Name\\",\\n" +
  "      \\"default\\": \\"${niche.name}\\"\\n" +
  "    },\\n" +
  "    {\\n" +
  "      \\"type\\": \\"textarea\\",\\n" +
  "      \\"id\\": \\"brand_text\\",\\n" +
  "      \\"label\\": \\"Brand Description\\"\\n" +
  "    }\\n" +
  "  ],\\n" +
  "  \\"blocks\\": [\\n" +
  "    {\\n" +
  "      \\"type\\": \\"link_list\\",\\n" +
  "      \\"name\\": \\"Link Column\\",\\n" +
  "      \\"settings\\": [\\n" +
  "        {\\n" +
  "          \\"type\\": \\"text\\",\\n" +
  "          \\"id\\": \\"title\\",\\n" +
  "          \\"label\\": \\"Column Title\\",\\n" +
  "          \\"default\\": \\"Explore\\"\\n" +
  "        }\\n" +
  "      ]\\n" +
  "    }\\n" +
  "  ],\\n" +
  "  \\"presets\\": [\\n" +
  "    {\\n" +
  "      \\"name\\": \\"${schemaName}\\",\\n" +
  "      \\"blocks\\": [\\n" +
  "        { \\"type\\": \\"link_list\\", \\"settings\\": { \\"title\\": \\"Products\\" } },\\n" +
  "        { \\"type\\": \\"link_list\\", \\"settings\\": { \\"title\\": \\"Company\\" } }\\n" +
  "      ]\\n" +
  "    }\\n" +
  "  ]\\n" +
  "}\\n" +
  "{% endschema %}\\n" +
  "`;\\n" +
  "}\\n";

  fs.writeFileSync(path.join(dir, \`style-\${style.id}.ts\`), content, 'utf8');
  console.log(\`Generated scaffold for style-\${style.id}.ts\`);
});
