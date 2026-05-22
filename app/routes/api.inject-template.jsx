import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "node:fs";
import path from "node:path";

// Use process.cwd() — reliable in both dev (project root) and production (Docker WORKDIR /app)
const PROJECT_ROOT = process.cwd();
const THEME_BASE_DIR = path.resolve(PROJECT_ROOT, "theme-base");
const THEME_NICHES_DIR = path.resolve(PROJECT_ROOT, "theme-niches");

const TEMPLATES = {
  pilgrim:              { label: "Pilgrim Beauty" },
  tanishq:              { label: "Tanishq Jewellery" },
  caratlane:            { label: "CaratLane" },
  "jewellery-heritage": { label: "Jewellery Heritage" },
  "fashion-clothing":   { label: "Urban Fashion" },
  footwear:             { label: "Solera Footwear" },
  "ayurveda-wellness":  { label: "AyurVeda Wellness" },
  "mobile-accessories": { label: "TechShield" },
  "kids-toys":          { label: "PlayWorld" },
  "home-furniture":     { label: "UrbanNest" },
  "food-delivery":      { label: "SpiceRoute" },
  electronics:          { label: "VoltZone" },
  "home-decor":         { label: "Artisano" },
  "pet-supplies":       { label: "PawParadise" },
  "luxury-watches":     { label: "Chrono Prestige" },
  "outdoor-gear":       { label: "TrailBlaze" },
  "organic-food":       { label: "GreenHarvest" },
  "fitness-supplements":{ label: "IronFuel" },
  "baby-apparel":       { label: "TinyTots" },
  "coffee-roasters":    { label: "BlackBrew" },
  "beauty-cosmetics":   { label: "GlowLab" },
  "mens-grooming":      { label: "BladeCode" },
  activewear:           { label: "BloomFit" },
  streetwear:           { label: "URBNCO" },
  "personal-care":      { label: "PureBody" },
};

/** Recursively collect all files in a directory */
function walkDir(dir, base = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base));
    } else {
      // Normalize Windows backslashes → forward slashes for Shopify API
      results.push({ full, rel: path.relative(base, full).split(path.sep).join('/') });
    }
  }
  return results;
}

/** Upload files in 50-file chunks, throw on any userError */
async function upsertChunked(admin, themeId, files, label) {
  const CHUNK = 50;
  for (let i = 0; i < files.length; i += CHUNK) {
    const chunk = files.slice(i, i + CHUNK);
    const res = await admin.graphql(`
      mutation Upsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
        themeFilesUpsert(themeId: $themeId, files: $files) {
          upsertedThemeFiles { filename }
          userErrors { field message }
        }
      }
    `, { variables: { themeId, files: chunk } });

    const { data } = await res.json();
    const errs = data?.themeFilesUpsert?.userErrors ?? [];
    if (errs.length > 0) {
      throw new Error(`${label} upload failed: ${errs.map(e => e.message).join(', ')}`);
    }
    console.log(`[theme-create] ${label} ${i+1}-${i+chunk.length}: ${data?.themeFilesUpsert?.upsertedThemeFiles?.length} files OK`);
  }
}

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    const formData = await request.formData();
    const templateId = formData.get("template") || "footwear";
    const tplConfig = TEMPLATES[templateId];

    if (!tplConfig) {
      return json({ success: false, error: `Unknown template: ${templateId}` }, { status: 400 });
    }

    // ── Step 1: Find the active (MAIN) theme & check theme limit ──────────
    const themesRes = await admin.graphql(`
      query { themes(first: 50) { nodes { id name role } } }
    `);
    const { data: themesData } = await themesRes.json();
    const allThemes = themesData?.themes?.nodes || [];
    
    if (allThemes.length >= 20) {
      return json({ 
        success: false, 
        error: `Your store already has ${allThemes.length} themes, which reaches/exceeds Shopify's 20-theme limit. Please delete an unused theme in your Shopify Admin before duplicating.` 
      }, { status: 400 });
    }

    const mainTheme = allThemes.find((t) => t.role === "MAIN" || (typeof t.role === 'string' && t.role.toLowerCase() === "main"));
    if (!mainTheme) {
      return json({ success: false, error: "No active MAIN theme found on this store." }, { status: 400 });
    }

    // ── Step 1b: Duplicate the active theme to a preview draft ────────────
    console.log(`[theme-inject] Duplicating active theme "${mainTheme.name}" (${mainTheme.id})`);
    const duplicateRes = await admin.graphql(`
      mutation ThemeDuplicate($id: ID!, $name: String!) {
        themeDuplicate(id: $id, name: $name) {
          newTheme {
            id
            name
            role
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        id: mainTheme.id,
        name: `OmniBuilder - ${tplConfig.label} Draft`
      }
    });

    const duplicateResult = await duplicateRes.json();
    if (duplicateResult.errors && duplicateResult.errors.length > 0) {
      return json({ 
        success: false, 
        error: `Shopify GraphQL Error: ${duplicateResult.errors.map(e => e.message).join(', ')}` 
      }, { status: 400 });
    }

    const duplicateErrors = duplicateResult.data?.themeDuplicate?.userErrors || [];
    if (duplicateErrors.length > 0) {
      return json({ 
        success: false, 
        error: `Failed to duplicate theme: ${duplicateErrors.map(e => e.message).join(', ')}` 
      }, { status: 400 });
    }

    const theme = duplicateResult.data?.themeDuplicate?.newTheme;
    if (!theme) {
      return json({ success: false, error: "Failed to duplicate active theme. Theme object was not returned." }, { status: 500 });
    }

    console.log(`[theme-inject] Injecting template "${templateId}" into draft theme: ${theme.name} (${theme.id})`);
    console.log(`[theme-inject] PROJECT_ROOT: ${PROJECT_ROOT}`);
    console.log(`[theme-inject] THEME_BASE_DIR exists: ${fs.existsSync(THEME_BASE_DIR)} (${THEME_BASE_DIR})`);
    console.log(`[theme-inject] THEME_NICHES_DIR exists: ${fs.existsSync(THEME_NICHES_DIR)} (${THEME_NICHES_DIR})`);

    // ── Step 2: Collect base theme files ──────────────────────────────────
    const baseFiles = walkDir(THEME_BASE_DIR);
    if (baseFiles.length === 0) {
      console.error(`[theme-inject] CRITICAL: theme-base directory is empty or missing!`);
      return json({ success: false, error: "Theme base files not found on server. Check deployment." }, { status: 500 });
    }
    const filesToUpsert = baseFiles.map(({ full, rel }) => ({
      filename: rel,
      body: { type: 'TEXT', value: fs.readFileSync(full, 'utf8') },
    }));

    // ── Step 3: Overlay niche-specific files (settings_data.json etc.) ────
    const nicheDir = path.join(THEME_NICHES_DIR, templateId);
    if (fs.existsSync(nicheDir)) {
      const nicheFiles = walkDir(nicheDir);
      for (const { full, rel } of nicheFiles) {
        const idx = filesToUpsert.findIndex(f => f.filename === rel);
        const entry = { filename: rel, body: { type: 'TEXT', value: fs.readFileSync(full, 'utf8') } };
        if (idx >= 0) filesToUpsert[idx] = entry;  // override
        else filesToUpsert.push(entry);
      }
    }

    console.log(`[theme-create] Total files to upload: ${filesToUpsert.length}`);
    console.log(`[theme-create] Sample filenames:`, filesToUpsert.slice(0, 5).map(f => f.filename));

    // ── Step 4: Two-phase upload ───────────────────────────────────────────
    const liquidFiles = filesToUpsert.filter(f =>
      f.filename.startsWith('layout/') ||
      f.filename.startsWith('sections/') ||
      f.filename.startsWith('snippets/') ||
      f.filename.startsWith('assets/') ||
      f.filename.startsWith('locales/') ||
      f.filename.endsWith('.liquid')
    );
    const jsonFiles = filesToUpsert.filter(f =>
      f.filename.startsWith('templates/') ||
      f.filename.startsWith('config/')
    );

    console.log(`[theme-create] Phase 1 (Liquid+Assets): ${liquidFiles.length} files`);
    console.log(`[theme-create] Phase 2 (Templates+Config): ${jsonFiles.length} files`);

    // Safety: catch files that slipped through both filters
    const uncategorized = filesToUpsert.filter(f =>
      !liquidFiles.includes(f) && !jsonFiles.includes(f)
    );
    if (uncategorized.length > 0) {
      console.warn(`[theme-create] WARNING: ${uncategorized.length} uncategorized files:`, uncategorized.map(f => f.filename));
      // Push uncategorized into liquid phase to ensure nothing is lost
      liquidFiles.push(...uncategorized);
    }

    await upsertChunked(admin, theme.id, liquidFiles, 'Liquid+Assets');
    await upsertChunked(admin, theme.id, jsonFiles, 'Templates+Config');

    // ── Step 5: Return success with preview/editor links ──────────────────
    const shopRes = await admin.graphql(`query { shop { myshopifyDomain } }`);
    const { data: shopData } = await shopRes.json();
    const domain = shopData.shop.myshopifyDomain;
    const numericId = theme.id.split("/").pop();

    return json({
      success: true,
      templateLabel: tplConfig.label,
      themeName: theme.name,
      themeId: numericId,
      filesUploaded: filesToUpsert.length,
      previewUrl: `https://${domain}/?preview_theme_id=${numericId}`,
      editorUrl:  `https://${domain}/admin/themes/${numericId}/editor`,
      publishUrl: `https://${domain}/admin/themes`,
    });

  } catch (err) {
    console.error("[theme-create] Error:", err);
    return json({ success: false, error: err.message }, { status: 500 });
  }
};

{/* <label>Form field</label> */}
