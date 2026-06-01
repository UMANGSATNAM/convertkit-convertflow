import prisma from "../db.server";
import { buildTemplateJSON } from "./template-builder.server";
import { detectIsStore20 } from "./theme-detector.server";

interface InjectPageParams {
  merchantId: string;
  templateId: string;
  customTitle: string;
  shopify: any;
  session: any;
}

export async function injectPageTemplate({
  merchantId,
  templateId,
  customTitle,
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

    // 2. Fetch merchant's active theme ID
    const themesResponse = await shopify.rest.resources.Theme.all({ session });
    const activeTheme = themesResponse.data.find((t: any) => t.role === 'main');

    if (!activeTheme) {
      throw new Error("Active theme not found");
    }

    // 3. Generate page handle
    const handle = customTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if OS 2.0 theme
    const isOs20 = await detectIsStore20(shopify, session, activeTheme.id);
    let templateFileName = null;

    if (isOs20) {
      // 4. Build the JSON template file content
      templateFileName = `page.${handle}.json`;
      const templateContent = buildTemplateJSON(template.sectionsConfig);

      // 5. Inject JSON template into active theme via Assets API
      const asset = new shopify.rest.resources.Asset({ session });
      asset.theme_id = activeTheme.id;
      asset.key = `templates/${templateFileName}`;
      asset.value = JSON.stringify(templateContent, null, 2);
      await asset.save({ update: true });
    }

    // 6. Create the Shopify Page with this template
    const page = new shopify.rest.resources.Page({ session });
    page.title = customTitle;
    page.handle = handle;
    page.published = true;
    
    if (isOs20) {
      page.body_html = '';
      page.template_suffix = handle;
    } else {
      // Legacy theme fallback: Just insert a placeholder or basic html
      page.body_html = `<div class="convertkit-legacy-wrapper"><h1>${customTitle}</h1><p>This template requires an Online Store 2.0 theme to render its sections natively. Please upgrade your theme.</p></div>`;
    }

    await page.save({ update: true });

    // 7. Save injection record to DB
    await prisma.injectedPage.create({
      data: {
        merchantId,
        templateId,
        shopifyPageId: BigInt(page.id as string),
        shopifyPageHandle: handle,
        shopifyTemplateFile: templateFileName,
        pageTitle: customTitle,
        status: 'published',
        injectedAt: new Date()
      }
    });

    // 8. Return live URL
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    
    if (!merchant) {
      throw new Error("Merchant not found");
    }

    return {
      success: true,
      liveUrl: `https://${merchant.shopDomain}/pages/${handle}`,
      pageId: page.id,
      editUrl: `https://${merchant.shopDomain}/admin/pages/${page.id}`
    };
  } catch (error: any) {
    console.error("Injection failed:", error);
    return { success: false, error: error.message };
  }
}
