import { ActionFunctionArgs, json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getActiveTheme, backupTheme, uploadAsset } from "../services/theme.server";
import fs from "fs/promises";
import path from "path";
import prisma from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const templateId = formData.get("templateId") as string;

  if (!templateId) {
    return json({ error: "No template ID provided" }, { status: 400 });
  }

  try {
    // 1. Fetch live theme
    const activeTheme = await getActiveTheme(admin);
    if (!activeTheme) {
      return json({ error: "Could not find an active theme" }, { status: 404 });
    }

    // 2. Backup Theme
    const backupName = `Backup of ${activeTheme.name} - ${new Date().toISOString().split('T')[0]}`;
    const backup = await backupTheme(admin, activeTheme.id.toString(), backupName);
    
    // Save backup to DB
    const merchant = await prisma.merchant.findUnique({
      where: { shopDomain: session.shop }
    });

    if (merchant) {
      await prisma.themeBackup.create({
        data: {
          merchantId: merchant.id,
          shopifyThemeId: backup.id.toString(),
          backupName: backupName
        }
      });
    }

    // 3. Fetch Merchant Inventory for Dynamic Mapping
    const inventoryRes = await admin.graphql(`
      query {
        collections(first: 5, sortKey: UPDATED_AT, reverse: true) { nodes { handle } }
        products(first: 5, sortKey: UPDATED_AT, reverse: true) { nodes { handle } }
      }
    `);
    const invData = await inventoryRes.json();
    const collections = invData?.data?.collections?.nodes || [];
    const products = invData?.data?.products?.nodes || [];

    // 4. Inject Sections
    const templateDir = path.join(process.cwd(), "app", "data", "templates", templateId);
    const sectionsDir = path.join(templateDir, "sections");
    const templatesDir = path.join(templateDir, "templates");

    const sectionFiles = await fs.readdir(sectionsDir);
    for (const file of sectionFiles) {
      if (file.endsWith(".liquid") || file.endsWith(".json")) {
        const content = await fs.readFile(path.join(sectionsDir, file), "utf8");
        await uploadAsset(admin, activeTheme.id.toString(), {
          key: `sections/${file}`,
          value: content
        });
      }
    }

    // 5. Overwrite Templates with Dynamic Mapping
    const templateFiles = await fs.readdir(templatesDir);
    for (const file of templateFiles) {
      if (file.endsWith(".json")) {
        let content = await fs.readFile(path.join(templatesDir, file), "utf8");
        
        // Dynamically map merchant collections/products into the homepage
        if (file === "index.json") {
          try {
            let parsed = JSON.parse(content);
            if (parsed.sections) {
              for (const key of Object.keys(parsed.sections)) {
                const section = parsed.sections[key];
                
                // Map Featured Collections blocks (prefix-agnostic)
                if (section.type?.endsWith("-featured-collections") && collections.length >= 3) {
                  if (section.blocks?.col_1) section.blocks.col_1.settings.collection = collections[0].handle;
                  if (section.blocks?.col_2) section.blocks.col_2.settings.collection = collections[1].handle;
                  if (section.blocks?.col_3) section.blocks.col_3.settings.collection = collections[2].handle;
                }
                
                // Map Product Highlights (Grid) (prefix-agnostic)
                if (section.type?.endsWith("-product-highlights") && collections.length >= 1) {
                  section.settings.collection = collections[0].handle;
                }
                
                // Map Hero Buttons (prefix-agnostic)
                if (section.type?.endsWith("-hero") && collections.length >= 1) {
                  section.settings.btn_link = `shopify://collections/${collections[0].handle}`;
                }
              }
            }
            content = JSON.stringify(parsed, null, 2);
          } catch (e) {
            console.error("Failed to parse index.json for dynamic mapping", e);
          }
        }

        await uploadAsset(admin, activeTheme.id.toString(), {
          key: `templates/${file}`,
          value: content
        });
      }
    }

    return json({ success: true, message: "Template successfully injected!" });
  } catch (error: any) {
    console.error("Injection error:", error);
    return json({ error: error.message || "Failed to inject template" }, { status: 500 });
  }
};
