import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEME_BASE_DIR = path.resolve(__dirname, "../../theme-base");
const THEME_NICHES_DIR = path.resolve(__dirname, "../../theme-niches");

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
      results.push({ full, rel: path.relative(base, full).replace(/\\/g, '/') });
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

    // ── Step 1: Create a brand-new UNPUBLISHED theme from blank ZIP ────────
    const themeName = `CF – ${tplConfig.label}`;
    // Blank ZIP is served as a static asset from this Remix app on Railway
    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST || '';
    const blankZipUrl = `${appUrl}/blank-theme.zip`;
    const createRes = await admin.graphql(`
      mutation ThemeCreate($name: String!, $source: URL!) {
        themeCreate(name: $name, source: $source) {
          theme { id name role }
          userErrors { field message }
        }
      }
    `, { variables: { name: themeName, source: blankZipUrl } });

    const { data: createData } = await createRes.json();
    const createErrors = createData?.themeCreate?.userErrors ?? [];
    if (createErrors.length > 0) {
      return json({ success: false, error: createErrors.map(e => e.message).join(', ') }, { status: 400 });
    }
    const theme = createData.themeCreate.theme;
    console.log(`[theme-create] Created theme: ${theme.name} (${theme.id})`);

    // ── Step 2: Collect base theme files ──────────────────────────────────
    const baseFiles = walkDir(THEME_BASE_DIR);
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
      themeName,
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
