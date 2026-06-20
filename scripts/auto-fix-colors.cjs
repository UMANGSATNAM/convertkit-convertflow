const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, '../theme-template/sections');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.liquid')) {
      callback(dirPath);
    }
  });
}

function autoFixStyleContent(styleContent) {
  let fixed = styleContent;

  // Replace whites
  fixed = fixed.replace(/#ffffff\b/gi, 'var(--color-background)');
  fixed = fixed.replace(/#fff\b/gi, 'var(--color-background)');
  
  // Replace blacks / darks
  fixed = fixed.replace(/#000000\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#000\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#111111\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#111\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#1a1a1a\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#333333\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#333\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#555555\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#555\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#999999\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#999\b/gi, 'var(--color-text-secondary)');

  // Replace grays / surfaces
  fixed = fixed.replace(/#f4f4f4\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#f5f5f5\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#e5e5e5\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#e2e8f0\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#eee\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#f4f4f0\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#fdfdfd\b/gi, 'var(--color-background)');
  fixed = fixed.replace(/#f0f0f0\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#666666\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#666\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#eaeaea\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#fcfcfc\b/gi, 'var(--color-background)');
  fixed = fixed.replace(/#888888\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#888\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#f7f7f7\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#0f1115\b/gi, 'var(--color-background)');
  fixed = fixed.replace(/#181a20\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#20222a\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#cccccc\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#ccc\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#e6f4ea\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#fce8e6\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#fafafa\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#dddddd\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#ddd\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#f5f5f0\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#222222\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#222\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#12141a\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#e4e4e7\b/gi, 'var(--color-border)');
  fixed = fixed.replace(/#aaaaaa\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#aaa\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#f9f9f9\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#e8f5e9\b/gi, 'var(--color-surface)');
  
  // Replace accent colors (rough heuristics based on some of the earlier files)
  fixed = fixed.replace(/#d93025\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#3b82f6\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#B8923F\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#ff0000\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#f5c518\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#137333\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#d4af37\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#0a0a0a\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#0C0B0A\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#141210\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#1A1713\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#1e1509\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#0f0d0a\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#1a1510\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#0a0908\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#050505\b/gi, 'var(--color-text)');
  fixed = fixed.replace(/#444444\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#444\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#a1a1aa\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#71717a\b/gi, 'var(--color-text-secondary)');
  fixed = fixed.replace(/#C9A84C\b/gi, 'var(--color-accent)');
  fixed = fixed.replace(/#E8CC7A\b/gi, 'var(--color-accent-secondary)');
  fixed = fixed.replace(/#9A7A2E\b/gi, 'var(--color-accent-secondary)');
  fixed = fixed.replace(/#F5EDD8\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#FAFAF8\b/gi, 'var(--color-surface)');
  fixed = fixed.replace(/#888580\b/gi, 'var(--color-text-secondary)');

  // Fix Invalid CSS Variables
  fixed = fixed.replace(/var\(--lux-bg\)/g, 'var(--color-background)');
  fixed = fixed.replace(/var\(--lux-gold\)/g, 'var(--color-accent)');
  fixed = fixed.replace(/var\(--lux-gold-dk\)/g, 'var(--color-accent)');
  fixed = fixed.replace(/var\(--lux-gold-lt\)/g, 'var(--color-accent-secondary)');
  fixed = fixed.replace(/var\(--ease-lux\)/g, 'var(--transition-base)');
  fixed = fixed.replace(/var\(--ease-gold\)/g, 'var(--transition-base)');
  fixed = fixed.replace(/var\(--font-serif\)/g, 'var(--font-heading)');
  fixed = fixed.replace(/var\(--lux-cream\)/g, 'var(--color-surface)');
  fixed = fixed.replace(/var\(--lux-white\)/g, 'var(--color-background)');
  fixed = fixed.replace(/var\(--lux-border\)/g, 'var(--color-border)');
  fixed = fixed.replace(/var\(--font-sans\)/g, 'var(--font-body)');
  fixed = fixed.replace(/var\(--text-color\)/g, 'var(--color-text)');
  fixed = fixed.replace(/var\(--bg-scrolled\)/g, 'var(--color-surface)');
  fixed = fixed.replace(/var\(--text-scrolled\)/g, 'var(--color-text)');
  fixed = fixed.replace(/--fontHeading/g, '--font-heading');
  fixed = fixed.replace(/--fontBody/g, '--font-body');
  fixed = fixed.replace(/--radius/g, '--radius-card');
  fixed = fixed.replace(/var\(--lux-bg-mid\)/g, 'var(--color-surface)');
  fixed = fixed.replace(/var\(--lux-grey\)/g, 'var(--color-text-secondary)');
  fixed = fixed.replace(/var\(--lux-bg-card\)/g, 'var(--color-surface)');

  // Replace rgba for black shadows/overlays
  fixed = fixed.replace(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([0-9.]+)\s*\)/gi, (match, opacity) => {
    return `color-mix(in srgb, var(--color-text) ${parseFloat(opacity) * 100}%, transparent)`;
  });

  // Replace rgba for white overlays
  fixed = fixed.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)/gi, (match, opacity) => {
    return `color-mix(in srgb, var(--color-background) ${parseFloat(opacity) * 100}%, transparent)`;
  });

  // Replace other specific rbga codes from the report
  fixed = fixed.replace(/rgba\(\s*10\s*,\s*9\s*,\s*8\s*,\s*([0-9.]+)\s*\)/gi, (match, opacity) => {
    return `color-mix(in srgb, var(--color-text) ${parseFloat(opacity) * 100}%, transparent)`;
  });
  fixed = fixed.replace(/rgba\(\s*245\s*,\s*237\s*,\s*216\s*,\s*([0-9.]+)\s*\)/gi, (match, opacity) => {
    return `color-mix(in srgb, var(--color-surface) ${parseFloat(opacity) * 100}%, transparent)`;
  });
  fixed = fixed.replace(/rgba\(\s*201\s*,\s*168\s*,\s*76\s*,\s*([0-9.]+)\s*\)/gi, (match, opacity) => {
    return `color-mix(in srgb, var(--color-accent) ${parseFloat(opacity) * 100}%, transparent)`;
  });
  fixed = fixed.replace(/rgba\(\s*136\s*,\s*133\s*,\s*128\s*,\s*([0-9.]+)\s*\)/gi, (match, opacity) => {
    return `color-mix(in srgb, var(--color-border) ${parseFloat(opacity) * 100}%, transparent)`;
  });
  
  // Replace liquid-injected rgba
  fixed = fixed.replace(/rgba\(0,0,0,\{\{\s*section\.settings\.overlay_opacity\s*\|\s*divided_by:\s*100\.0\s*\}\}\)/gi, 'color-mix(in srgb, var(--color-text) {{ section.settings.overlay_opacity }}%, transparent)');

  // Common box-shadows replacements
  fixed = fixed.replace(/box-shadow:\s*0\s+10px\s+20px\s+rgba\(0,0,0,0\.1\);/gi, 'box-shadow: var(--shadow-hover);');
  fixed = fixed.replace(/box-shadow:\s*0\s+4px\s+12px\s+rgba\(0,0,0,0\.1\);/gi, 'box-shadow: var(--shadow-card);');

  return fixed;
}

function autoFixClassContent(classContent) {
  let fixed = classContent;
  
  // Replace arbitrary tailwind var() with fallbacks
  fixed = fixed.replace(/\[var\(--color-bg,\s*#[a-fA-F0-9]+\)\]/g, '[var(--color-background)]');
  fixed = fixed.replace(/\[var\(--color-surface,\s*#[a-fA-F0-9]+\)\]/g, '[var(--color-surface)]');
  fixed = fixed.replace(/\[var\(--color-text,\s*#[a-fA-F0-9]+\)\]/g, '[var(--color-text)]');
  fixed = fixed.replace(/\[var\(--color-primary,\s*#[a-fA-F0-9]+\)\]/g, '[var(--color-text)]');
  fixed = fixed.replace(/\[var\(--color-border,\s*#[a-fA-F0-9]+\)\]/g, '[var(--color-border)]');
  
  // Replace direct arbitrary hexes
  fixed = fixed.replace(/\[#FFD700\]/gi, '[var(--color-accent)]');
  fixed = fixed.replace(/\[#000000\]|\[#000\]/gi, '[var(--color-text)]');
  fixed = fixed.replace(/\[#ffffff\]|\[#fff\]/gi, '[var(--color-background)]');
  fixed = fixed.replace(/\[#111111\]|\[#111\]/gi, '[var(--color-text)]');
  
  // Replace invalid css variables inside classes
  fixed = fixed.replace(/--fontHeading/g, '--font-heading');
  fixed = fixed.replace(/--fontBody/g, '--font-body');
  fixed = fixed.replace(/--radius/g, '--radius-card');

  // Replace Tailwind standard colors that violate the token contract
  fixed = fixed.replace(/\btext-black\b/g, 'text-[var(--color-text)]');
  fixed = fixed.replace(/\bbg-black\b/g, 'bg-[var(--color-text)]');
  fixed = fixed.replace(/\btext-white\b/g, 'text-[var(--color-background)]');
  fixed = fixed.replace(/\bbg-white\b/g, 'bg-[var(--color-background)]');
  fixed = fixed.replace(/\btext-gray-[0-9]{3}\b/g, 'text-[var(--color-text-secondary)]');
  fixed = fixed.replace(/\bbg-gray-100\b|\bbg-gray-50\b/g, 'bg-[var(--color-surface)]');
  fixed = fixed.replace(/\bbg-gray-[2-4]00\b/g, 'bg-[var(--color-border)]');
  fixed = fixed.replace(/\bborder-gray-[0-9]{3}\b/g, 'border-[var(--color-border)]');
  fixed = fixed.replace(/\btext-green-[0-9]{3}\b/g, 'text-[var(--color-accent)]');
  fixed = fixed.replace(/\btext-blue-[0-9]{3}\b/g, 'text-[var(--color-accent)]');
  fixed = fixed.replace(/\btext-red-[0-9]{3}\b/g, 'text-[var(--color-accent)]');
  
  return fixed;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix inside <style> tags
  content = content.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (match, startTag, styleContent, endTag) => {
    return startTag + autoFixStyleContent(styleContent) + endTag;
  });

  // Fix style="..." attributes (naively, might miss some edge cases, but covers 95%)
  content = content.replace(/(style=(["']))(.*?)\2/gi, (match, startAttr, quote, styleContent) => {
    return startAttr + autoFixStyleContent(styleContent) + quote;
  });

  // Fix class="..." attributes (for Tailwind)
  content = content.replace(/(class=(["']))(.*?)\2/gi, (match, startAttr, quote, classContent) => {
    return startAttr + autoFixClassContent(classContent) + quote;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed colors in ${path.relative(SECTIONS_DIR, filePath)}`);
  }
}

function run() {
  const args = process.argv.slice(2);
  let targetFiles = [];
  
  if (args.length > 0) {
    targetFiles = args.map(arg => path.resolve(arg));
  } else {
    walkDir(SECTIONS_DIR, (filePath) => targetFiles.push(filePath));
  }

  targetFiles.forEach(processFile);
  console.log('Auto-fix complete.');
}

run();
