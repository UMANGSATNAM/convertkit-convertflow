#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const targetFile = process.argv[2];
if (!targetFile) {
  console.error("❌ Please provide a path to a catalog.json file.");
  process.exit(1);
}

const fullPath = path.resolve(targetFile);
if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

console.log(`\n📦 Validating Catalog: ${fullPath}`);

let errors = 0;
function reportError(msg) {
  console.error(`❌ ${msg}`);
  errors++;
}

try {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const catalog = JSON.parse(content);

  if (!Array.isArray(catalog)) {
    reportError("Catalog must be a JSON array of products.");
  } else {
    catalog.forEach((product, i) => {
      const pStr = product.title || `Product at index ${i}`;
      
      if (!product.title) reportError(`${pStr}: Missing 'title'`);
      if (!product.handle) reportError(`${pStr}: Missing 'handle'`);
      if (!product.vendor) reportError(`${pStr}: Missing 'vendor'`);
      if (!product.product_type) reportError(`${pStr}: Missing 'product_type'`);
      if (!product.tags || !Array.isArray(product.tags)) reportError(`${pStr}: Missing or invalid 'tags'`);
      
      // SEO
      if (!product.seo_title) reportError(`${pStr}: Missing 'seo_title'`);
      if (!product.seo_description) reportError(`${pStr}: Missing 'seo_description'`);

      // Variants
      if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
        reportError(`${pStr}: Must have at least one variant`);
      } else {
        product.variants.forEach((v, vi) => {
          if (!v.title) reportError(`${pStr} Variant ${vi}: Missing 'title'`);
          if (!v.price) reportError(`${pStr} Variant ${vi}: Missing 'price'`);
          if (!v.sku) reportError(`${pStr} Variant ${vi}: Missing 'sku'`);
        });
      }

      // Images
      if (!product.images || !Array.isArray(product.images)) {
        reportError(`${pStr}: Missing or invalid 'images'`);
      } else {
        product.images.forEach((img, ii) => {
          if (!img.src) reportError(`${pStr} Image ${ii}: Missing 'src'`);
        });
      }
    });
  }

} catch (e) {
  reportError(`Failed to parse JSON: ${e.message}`);
}

if (errors > 0) {
  console.error(`\n❌ Validation Failed: ${errors} errors found.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ Catalog Validation Passed! 0 errors.\n`);
}
