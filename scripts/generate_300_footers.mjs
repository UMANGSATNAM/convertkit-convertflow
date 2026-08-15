import fs from 'fs';
import path from 'path';
import * as templates from './footer_templates.mjs';

// Niche Definitions
const niches = [
  { id: 'fashion', name: 'Fashion & Apparel', color1: '#000000', color2: '#ffffff', color3: '#f4f4f4' },
  { id: 'beauty', name: 'Beauty & Cosmetics', color1: '#ffc0cb', color2: '#ffffff', color3: '#fcf1f1' },
  { id: 'health', name: 'Health & Supplements', color1: '#2e8b57', color2: '#ffffff', color3: '#f0fdf4' },
  { id: 'home', name: 'Home & Decor', color1: '#8b4513', color2: '#ffffff', color3: '#fdf8f5' },
  { id: 'tech', name: 'Tech & Gadgets', color1: '#0f172a', color2: '#ffffff', color3: '#1e293b' },
  { id: 'food', name: 'Food & Beverage', color1: '#d97706', color2: '#ffffff', color3: '#fffbeb' },
  { id: 'jewelry', name: 'Jewelry & Accessories', color1: '#d4af37', color2: '#ffffff', color3: '#fcfbf6' },
  { id: 'pet', name: 'Pet Supplies', color1: '#0284c7', color2: '#ffffff', color3: '#f0f9ff' },
  { id: 'sports', name: 'Sports & Outdoors', color1: '#dc2626', color2: '#ffffff', color3: '#fef2f2' },
  { id: 'kids', name: 'Kids & Baby', color1: '#ec4899', color2: '#ffffff', color3: '#fdf2f8' },
  { id: 'auto', name: 'Auto & Tools', color1: '#475569', color2: '#ffffff', color3: '#f8fafc' },
  { id: 'art', name: 'Art & Stationery', color1: '#8b5cf6', color2: '#ffffff', color3: '#f5f3ff' },
  { id: 'travel', name: 'Travel & Experiences', color1: '#0ea5e9', color2: '#ffffff', color3: '#f0f9ff' },
  { id: 'b2b', name: 'B2B & Wholesale', color1: '#1e3a8a', color2: '#ffffff', color3: '#eff6ff' },
  { id: 'digital', name: 'Digital Products', color1: '#6366f1', color2: '#ffffff', color3: '#eef2ff' }
];

async function generateAll() {
  const outputDir = path.join(process.cwd(), 'dev-theme-peri', 'sections');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const niche of niches) {
    for (let i = 1; i <= 20; i++) {
      const paddedIndex = String(i).padStart(2, '0');
      // Schema name limited to 25 chars.
      // e.g., Footer fashion-01 (16 chars)
      const schemaName = 'Footer ' + niche.id + '-' + paddedIndex;
      const prefix = 'ft-' + niche.id + '-' + paddedIndex;
      
      let functionName = 'style' + i;
      let generator = templates[functionName];
      if (!generator) {
        functionName = 'style' + paddedIndex;
        generator = templates[functionName];
      }
      
      if (!generator) {
        console.error('Missing function: style' + i + ' and ' + 'style' + paddedIndex);
        continue;
      }
      
      const content = generator(niche, prefix, schemaName);
      
      const filename = 'footer-' + niche.id + '-' + paddedIndex + '.liquid';
      fs.writeFileSync(path.join(outputDir, filename), content, 'utf8');
      console.log('Generated ' + filename);
    }
  }
}

generateAll().catch(console.error);
