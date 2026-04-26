import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = path.resolve('./extensions/convertkit-sections/sections');

const TEMPLATES = [
  { id: 'jewellery-heritage',  file: 'lp-jewellery-heritage.html',  label: 'Meenakshi Heritage Jewellers', accent: '#8B1A2C', bg: '#FAF0F0' },
  { id: 'fashion-clothing',    file: 'lp-fashion-clothing.html',    label: 'VÅŒLT Fashion',                 accent: '#0A0A0A', bg: '#F5F3EF' },
  { id: 'footwear',            file: 'lp-footwear.html',            label: 'Solera Footwear',              accent: '#C65D2A', bg: '#FBF0E8' },
  { id: 'ayurveda-wellness',   file: 'lp-ayurveda-wellness.html',   label: 'Ayurva Wellness',              accent: '#E07B2A', bg: '#F5FCF5' },
  { id: 'mobile-accessories',  file: 'lp-mobile-accessories.html',  label: 'STACKD Accessories',           accent: '#00F0C8', bg: '#0D0D12' },
  { id: 'kids-toys',           file: 'lp-kids-toys.html',           label: 'PlayBox Kids',                 accent: '#F9C22E', bg: '#EFF4FF' },
  { id: 'home-furniture',      file: 'lp-home-furniture.html',      label: 'Haven Furniture',              accent: '#B5834A', bg: '#F5EFE6' },
  { id: 'food-delivery',       file: 'lp-food-delivery.html',       label: 'Veda Eats',                    accent: '#FF5722', bg: '#FFF0E8' },
  { id: 'electronics',         file: 'lp-electronics.html',         label: 'Tech & Electronics',           accent: '#5735db', bg: '#e9e5f5' },
  { id: 'home-decor',          file: 'lp-home-decor.html',          label: 'Home Decor',                   accent: '#8B7355', bg: '#FAF5ED' },
  { id: 'pet-supplies',        file: 'lp-pet-supplies.html',        label: 'Pet Supplies',                 accent: '#D35400', bg: '#f9e0d1' },
  { id: 'luxury-watches',      file: 'lp-luxury-watches.html',      label: 'Luxury Watches',               accent: '#C5A028', bg: '#0a0a0a' },
  { id: 'outdoor-gear',        file: 'lp-outdoor-gear.html',        label: 'Outdoor Gear',                 accent: '#2A4B2A', bg: '#dbe8db' },
  { id: 'fitness-supplements', file: 'lp-fitness-supplements.html', label: 'Fitness Supplements',          accent: '#E2FE16', bg: '#050505' },
  { id: 'baby-apparel',        file: 'lp-baby-apparel.html',        label: 'Baby Apparel',                 accent: '#F6A8B6', bg: '#fcedef' },
  { id: 'coffee-roasters',     file: 'lp-coffee-roasters.html',     label: 'Coffee Roasters',              accent: '#3E2723', bg: '#efebe9' },
  { id: 'beauty-cosmetics',    file: 'lp-beauty-cosmetics.html',    label: 'Clean Cosmetics',              accent: '#D4BBA5', bg: '#f8f3f0' },
  { id: 'mens-grooming',       file: 'lp-mens-grooming.html',       label: 'BRUT Mens Grooming',           accent: '#B87333', bg: '#080808' },
];

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1].trim() : html;
}

function extractStyles(html) {
  const matches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  return matches.map(m => m[1]).join('\n').trim();
}

function getTopLevelElements(bodyHtml) {
  const elements = [];
  let i = 0;
  
  while (i < bodyHtml.length) {
    const nextTagStart = bodyHtml.indexOf('<', i);
    if (nextTagStart === -1) break;
    
    // Skip comments
    if (bodyHtml.startsWith('<!--', nextTagStart)) {
      i = bodyHtml.indexOf('-->', nextTagStart) + 3;
      continue;
    }
    
    const tagMatch = bodyHtml.substring(nextTagStart).match(/^<([a-zA-Z0-9]+)([^>]*)>/);
    if (!tagMatch) {
      i = nextTagStart + 1;
      continue;
    }
    
    const tagName = tagMatch[1].toLowerCase();
    
    // Void elements
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    if (voidElements.includes(tagName)) {
      i = nextTagStart + tagMatch[0].length;
      continue;
    }
    
    // Balance tags
    let openCount = 1;
    let j = nextTagStart + tagMatch[0].length;
    let innerText = '';
    
    while (j < bodyHtml.length && openCount > 0) {
      const nextOpen = bodyHtml.indexOf(`<${tagName}`, j);
      const nextClose = bodyHtml.indexOf(`</${tagName}>`, j);
      
      // We must make sure nextOpen is an exact tag match (e.g. <div or <div... not <divider)
      const validOpen = nextOpen !== -1 && /^[>\s]/.test(bodyHtml.charAt(nextOpen + tagName.length + 1));
      
      if (nextClose !== -1 && (!validOpen || nextClose < nextOpen)) {
        openCount--;
        j = nextClose + `</${tagName}>`.length;
      } else if (validOpen) {
        openCount++;
        j = nextOpen + tagName.length + 1;
      } else {
        break; // Malformed
      }
    }
    
    if (openCount === 0) {
      const outerHtml = bodyHtml.substring(nextTagStart, j);
      
      // Extract class for naming
      const classMatch = tagMatch[2].match(/class="([^"]+)"/);
      const className = classMatch ? classMatch[1].split(' ')[0] : tagName;
      
      elements.push({
        tagName,
        className,
        html: outerHtml
      });
      i = j;
    } else {
      i = nextTagStart + 1;
    }
  }
  return elements;
}

// Applies Liquid text/image replacement logic to a specific section's HTML
function applyLiquidToSection(html, tpl, sectionName) {
  let mod = html;
  
  // 1. Convert text to schema settings
  const textPattern = />([^<]+)(<\/[a-z1-6]+>)/g;
  let textIndex = 1;
  const settings = [];
  
  // We'll just do a few basic text replacements for h1, h2, h3, p
  const headingPattern = /<([hH][1-6])[^>]*>([\s\S]*?)<\/\1>/g;
  mod = mod.replace(headingPattern, (m, tag, inner) => {
    const clean = inner.replace(/<[^>]+>/g, '').trim();
    if (clean.length > 1) {
      const id = `text_${textIndex++}`;
      settings.push({ type: "text", id: id, label: `Heading ${textIndex}`, default: clean.substring(0,40) });
      return m.replace(inner, `{{ section.settings.${id} | default: '${clean}' }}`);
    }
    return m;
  });

  // Images
  const imgPattern = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let imgIndex = 1;
  mod = mod.replace(imgPattern, (m, src) => {
    const id = `img_${imgIndex++}`;
    settings.push({ type: "image_picker", id: id, label: `Image ${imgIndex}` });
    return `{% if section.settings.${id} != blank %}<img src="{{ section.settings.${id} | image_url: width: 800 }}" alt="" style="width:100%;height:100%;object-fit:cover;">{% else %}${m}{% endif %}`;
  });
  
  // Hero background images inline
  // If there's a background-image in inline style:
  
  // Create schema
  const schema = {
    name: `CF ${tpl.label} ${sectionName}`.substring(0,25).trimEnd(),
    settings: settings,
    presets: [{ name: `CF ${tpl.label} ${sectionName}`.substring(0,25).trimEnd() }]
  };
  
  return { html: mod, schema };
}

let routesConfig = {};

for (const tpl of TEMPLATES) {
  const htmlPath = path.resolve(`./${tpl.file}`);
  if (!fs.existsSync(htmlPath)) continue;
  
  const rawHtml = fs.readFileSync(htmlPath, 'utf-8');
  const styles = extractStyles(rawHtml);
  const bodyHtml = extractBody(rawHtml);
  
  const elements = getTopLevelElements(bodyHtml);
  const templateSections = [];
  
  let sectionIndex = 1;
  for (const el of elements) {
    if (el.html.trim().length < 50) continue; // Skip empty wrappers
    
    const sectionName = `${el.className || el.tagName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cleanName = sectionName || `section-${sectionIndex}`;
    const filename = `cf-${tpl.id}-${cleanName}.liquid`;
    
    // Apply liquid formatting
    const { html: liquidHtml, schema } = applyLiquidToSection(el.html, tpl, cleanName);
    
    const finalFileContent = `{% comment %}ConvertFlow: ${tpl.label} - ${cleanName}{% endcomment %}
<style>
${styles}
</style>
<div class="cf-${tpl.id}-wrap">
${liquidHtml}
</div>
{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;

    fs.writeFileSync(path.join(SECTIONS_DIR, filename), finalFileContent);
    templateSections.push({ key: cleanName, filename: filename.replace('.liquid',''), type: filename.replace('.liquid','') });
    sectionIndex++;
  }
  
  routesConfig[tpl.id] = templateSections;
  console.log(`✅ Processed ${tpl.id} into ${templateSections.length} sections`);
}

// Generate the code to be injected into api.inject-template.jsx
const configOutput = `
// Put this logic in api.inject-template.jsx
const customTemplateConfigs = ${JSON.stringify(routesConfig, null, 2)};

if (customTemplateConfigs[templateId]) {
  const sectionsConfig = customTemplateConfigs[templateId];
  landingJson.sections = {};
  landingJson.order = [];
  
  for (const sec of sectionsConfig) {
    try {
      const content = fs.readFileSync(path.join(SECTIONS_DIR, \`\${sec.filename}.liquid\`), 'utf-8');
      filesToUpsert.push({ filename: \`sections/\${sec.filename}.liquid\`, body: { type: 'TEXT', value: content } });
      
      landingJson.sections[sec.key] = {
        type: sec.type,
        settings: {}
      };
      landingJson.order.push(sec.key);
    } catch(e) {}
  }
}
`;

fs.writeFileSync('auto-split-routes.txt', configOutput);
console.log('Done! Config written to auto-split-routes.txt');
