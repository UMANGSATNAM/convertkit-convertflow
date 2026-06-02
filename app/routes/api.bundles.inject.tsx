import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { injectNicheBundle } from "../services/theme-injector.server";

export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    
    const formData = await request.json();
    const { nicheName } = formData;

    if (!nicheName) {
      return json({ success: false, error: "Niche name is required" }, { status: 400 });
    }

    const result = await injectNicheBundle(admin, session, nicheName);

    return json({ success: true, themeId: result.themeId });
  } catch (error) {
    console.error("Bundle injection error:", error);
    return json({ success: false, error: error.message || "Failed to inject bundle" }, { status: 500 });
  }
};
