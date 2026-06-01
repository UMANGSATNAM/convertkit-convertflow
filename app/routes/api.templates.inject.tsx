import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { injectPageTemplate } from "../lib/page-injector.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const contentType = request.headers.get("content-type") || "";
    let templateId, customTitle;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      templateId = body.templateId;
      customTitle = body.customTitle;
    } else {
      const formData = await request.formData();
      templateId = formData.get("templateId") as string;
      customTitle = formData.get("customTitle") as string;
    }

    if (!templateId || !customTitle) {
      return json({ success: false, error: "Missing templateId or customTitle" }, { status: 400 });
    }

    // Get merchant from DB
    const merchant = await prisma.merchant.findUnique({
      where: { shopDomain: session.shop }
    });

    if (!merchant) {
      return json({ success: false, error: "Merchant not found" }, { status: 404 });
    }

    // Run injection
    const result = await injectPageTemplate({
      merchantId: merchant.id,
      templateId,
      customTitle,
      shopify: admin,
      session,
    });

    return json({ success: result.success, liveUrl: result.liveUrl, pageId: result.pageId, editUrl: result.editUrl, error: result.error });
  } catch (error: any) {
    console.error("API error during injection:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
