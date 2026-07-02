import fs from "fs";
import path from "path";

export async function runThemeIntegrityTest(themeDir: string) {
  console.log(`\n==============================================`);
  console.log(`[StoreForge] Theme Integrity Test v1`);
  console.log(`==============================================`);

  let headerCount = 0;
  let footerCount = 0;
  let heroCount = 0;
  let productExists = false;
  let collectionExists = false;
  let searchExists = false;

  let errors: string[] = [];
  let warnings: string[] = [];

  // 1. Check layout/theme.liquid for global wrappers
  const themeLiquidPath = path.join(themeDir, "layout", "theme.liquid");
  if (fs.existsSync(themeLiquidPath)) {
    const themeContent = fs.readFileSync(themeLiquidPath, "utf-8");
    // Just count mentions of header-group or footer-group
    if (themeContent.includes("{% sections 'header-group' %}")) {
      headerCount++;
    }
    if (themeContent.includes("{% sections 'footer-group' %}")) {
      footerCount++;
    }
  } else {
    errors.push("Missing layout/theme.liquid");
  }

  // 2. Check sections injected in index.json (or via template scanning)
  const templatesDir = path.join(themeDir, "templates");
  const indexJsonPath = path.join(templatesDir, "index.json");
  
  if (fs.existsSync(indexJsonPath)) {
    try {
      const indexJson = JSON.parse(fs.readFileSync(indexJsonPath, "utf-8"));
      const sections = indexJson.sections || {};
      for (const [id, section] of Object.entries(sections)) {
        if ((section as any).type === "header") headerCount++;
        if ((section as any).type === "footer") footerCount++;
        if (typeof (section as any).type === 'string' && (section as any).type.includes("hero")) heroCount++;
      }
    } catch (e) {
      errors.push("Invalid index.json JSON format");
    }
  }

  // 3. Check for mandatory templates
  productExists = fs.existsSync(path.join(themeDir, "templates", "product.json")) || fs.existsSync(path.join(themeDir, "templates", "product.liquid")) || fs.existsSync(path.join(themeDir, "sections", "main-product.liquid"));
  collectionExists = fs.existsSync(path.join(themeDir, "templates", "collection.json")) || fs.existsSync(path.join(themeDir, "templates", "collection.liquid")) || fs.existsSync(path.join(themeDir, "sections", "main-collection.liquid"));
  searchExists = fs.existsSync(path.join(themeDir, "templates", "search.json")) || fs.existsSync(path.join(themeDir, "templates", "search.liquid")) || fs.existsSync(path.join(themeDir, "sections", "main-search.liquid"));

  if (!productExists) errors.push("Missing product template (main-product.liquid or product.json)");
  if (!collectionExists) errors.push("Missing collection template (main-collection.liquid or collection.json)");
  if (!searchExists) errors.push("Missing search template (main-search.liquid or search.json)");

  // Output Results
  console.log(`\n--- Verification Results ---`);
  console.log(`Header Count: ${headerCount} ${headerCount === 1 ? "✅" : "❌"}`);
  console.log(`Footer Count: ${footerCount} ${footerCount === 1 ? "✅" : "❌"}`);
  console.log(`Hero Count:   ${heroCount} ${heroCount === 1 ? "✅" : "❌"}`);
  console.log(`PDP Exists:   ${productExists ? "✅" : "❌"}`);
  console.log(`PLP Exists:   ${collectionExists ? "✅" : "❌"}`);
  console.log(`Search Exists:${searchExists ? "✅" : "❌"}`);

  if (headerCount !== 1) errors.push(`Invalid header count: ${headerCount}. Must be exactly 1.`);
  if (footerCount !== 1) errors.push(`Invalid footer count: ${footerCount}. Must be exactly 1.`);
  if (heroCount !== 1) errors.push(`Invalid hero count: ${heroCount}. Must be exactly 1.`);

  // 4. Check snippets & assets (Stub for v1, will be powered by Dependency Engine v1)
  console.log(`Dependencies: ⚠️ Pending Validator v2`);

  if (errors.length > 0) {
    console.log(`\n❌ Integrity Check Failed`);
    errors.forEach(e => console.log(`  - ${e}`));
    return false;
  } else {
    console.log(`\n✅ Integrity Check Passed!`);
    return true;
  }
}

// Allow running from CLI directly
const targetDir = process.argv[2] || path.join(process.cwd(), "app/data/templates/theme-engine/core");
runThemeIntegrityTest(targetDir);
