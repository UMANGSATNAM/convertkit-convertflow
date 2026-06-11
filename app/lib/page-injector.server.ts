import fs from "fs";
import path from "path";
import prisma from "../db.server";
import { buildTemplateJSON } from "./template-builder.server";
import { detectIsStore20 } from "./theme-detector.server";

interface InjectPageParams {
  merchantId: string;
  templateId: string;
  customTitle?: string;
  targetThemeId: string;
  targetPageType: string;
  shopify: any;
  session: any;
}

export async function injectPageTemplate({
  merchantId,
  templateId,
  customTitle,
  targetThemeId,
  targetPageType,
  shopify,
  session,
}: InjectPageParams) {
  try {
    // 1. Fetch template from DB
    const template = await prisma.pageTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error("Template not found");
    }

    // 2. Validate target theme
    const themesResponse = await shopify.rest.resources.Theme.all({ session });
    const theme = themesResponse.data.find((t: any) => t.id.toString() === targetThemeId.toString());

    if (!theme) {
      throw new Error("Target theme not found");
    }

    // Check if OS 2.0 theme
    const isOs20 = await detectIsStore20(shopify, session, theme.id);
    if (!isOs20) {
      throw new Error("Target theme must be Online Store 2.0 to support template injection");
    }

    // 3. Determine target filename and handle
    let templateFileName = "";
    let handle = "";
    
    if (targetPageType === "custom") {
      handle = (customTitle || template.templateName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      templateFileName = `page.${handle}.json`;
    } else {
      // index, product, collection
      templateFileName = `${targetPageType}.json`;
      handle = targetPageType;
    }

    // 4. Backup existing template if it exists
    const asset = new shopify.rest.resources.Asset({ session });
    asset.theme_id = theme.id;
    asset.asset = { key: `templates/${templateFileName}` };
    
    try {
      const existingAsset = await shopify.rest.resources.Asset.all({
        session: session,
        theme_id: theme.id,
        asset: { key: `templates/${templateFileName}` },
      });
      
      // If found, let's create a backup
      if (existingAsset && existingAsset.data && existingAsset.data.length > 0) {
        const backupAsset = new shopify.rest.resources.Asset({ session });
        backupAsset.theme_id = theme.id;
        backupAsset.key = `templates/${templateFileName.replace('.json', '.backup.json')}`;
        backupAsset.value = existingAsset.data[0].value;
        await backupAsset.save({ update: true });
        console.log(`Backed up existing ${templateFileName} to .backup.json`);
      }
    } catch (err) {
      console.log(`No existing ${templateFileName} found to backup, or error occurred:`, err);
    }

    // 5. Build the JSON template file content
    const templateContent = buildTemplateJSON(template.sectionsConfig as any);

    // 6. Inject JSON template into selected theme via Assets API
    const newAsset = new shopify.rest.resources.Asset({ session });
    newAsset.theme_id = theme.id;
    newAsset.key = `templates/${templateFileName}`;
    newAsset.value = JSON.stringify(templateContent, null, 2);
    await newAsset.save({ update: true });

    // 7. Inject associated Liquid sections
    // Attempt to find any required sections for this template niche in our local codebase
    try {
      const sectionsConfig = template.sectionsConfig as any;
      if (sectionsConfig && sectionsConfig.sections) {
        for (const sectionData of Object.values(sectionsConfig.sections)) {
          const type = (sectionData as any).type;
          if (!type) continue;
          
          // Try to find the local liquid file for this section type
          // Assuming files are named like `convertkit-hero.liquid` and match the type name
          // First check in `app/data/bundles/[niche]/sections/`
          const nicheDir = template.niche.toLowerCase();
          const potentialPaths = [
            path.resolve(process.cwd(), `app/data/bundles/${nicheDir}/sections/${type}.liquid`),
            path.resolve(process.cwd(), `app/data/bundles/beauty/sections/${type}.liquid`), // fallback to beauty for testing
          ];
          
          let liquidContent = "";
          for (const p of potentialPaths) {
            if (fs.existsSync(p)) {
              liquidContent = fs.readFileSync(p, "utf-8");
              break;
            }
          }
          
          if (liquidContent) {
            const liquidAsset = new shopify.rest.resources.Asset({ session });
            liquidAsset.theme_id = theme.id;
            liquidAsset.key = `sections/${type}.liquid`;
            liquidAsset.value = liquidContent;
            await liquidAsset.save({ update: true });
            console.log(`Injected section ${type}.liquid`);
          }
        }
      }
    } catch (err) {
      console.log("Error injecting liquid sections:", err);
    }

    // 8. Create or Update the Shopify Page (if custom page type)
    let pageId = null;
    let liveUrl = "";
    let editUrl = "";
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) throw new Error("Merchant not found");

    if (targetPageType === "custom") {
      const page = new shopify.rest.resources.Page({ session });
      page.title = customTitle || template.templateName;
      page.handle = handle;
      page.published = true;
      page.body_html = '';
      page.template_suffix = handle;
      
      await page.save({ update: true });
      pageId = page.id;
      liveUrl = `https://${merchant.shopDomain}/pages/${handle}`;
      editUrl = `https://${merchant.shopDomain}/admin/pages/${page.id}`;
    } else {
      // If it's index, product, or collection, liveUrl is standard
      liveUrl = `https://${merchant.shopDomain}/`;
      editUrl = `https://${merchant.shopDomain}/admin/themes/${theme.id}/editor`;
    }

    // 9. Save injection record to DB
    await prisma.injectedPage.create({
      data: {
        merchantId,
        templateId,
        shopifyPageId: pageId ? BigInt(pageId as string) : null,
        shopifyPageHandle: handle,
        shopifyTemplateFile: templateFileName,
        pageTitle: customTitle || `${template.templateName} (${targetPageType})`,
        status: 'published',
        injectedAt: new Date()
      }
    });

    return {
      success: true,
      liveUrl,
      pageId,
      editUrl
    };
  } catch (error: any) {
    console.error("Injection failed:", error);
    return { success: false, error: error.message };
  }
}
