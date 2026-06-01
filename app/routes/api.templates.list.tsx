import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request }: any) {
  try {
    const { session } = await authenticate.admin(request);

    // Get merchant
    const merchant = await prisma.merchant.findUnique({
      where: { shopDomain: session.shop }
    });

    if (!merchant) {
      return json({ success: false, error: "Merchant not found" }, { status: 404 });
    }

    const templates = await prisma.pageTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    const injectedPages = await prisma.injectedPage.findMany({
      where: { merchantId: merchant.id },
      include: { template: true },
      orderBy: { createdAt: 'desc' }
    });

    return json({ success: true, templates, injectedPages });
  } catch (error: any) {
    console.error("API error fetching templates:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
