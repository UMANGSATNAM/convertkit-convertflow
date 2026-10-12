import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { installSectionToTheme } from "../lib/sections/installer.server";
import { CONVERTFLOW_SECTIONS } from "../lib/sections/registry";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const actionType = formData.get("actionType")?.toString() || "installOne";
    const sectionId = formData.get("sectionId")?.toString();

    if (actionType === "installAll") {
      const results = [];
      for (const section of CONVERTFLOW_SECTIONS) {
        try {
          const res = await installSectionToTheme(admin, session, section.id);
          results.push(res);
        } catch (err: any) {
          results.push({
            success: false,
            sectionId: section.id,
            filename: section.filename,
            message: err.message,
          });
        }
      }

      const allSuccess = results.every((r) => r.success);
      return json({
        success: allSuccess,
        results,
        message: allSuccess
          ? "All 5 ConvertFlow High-Converting Sections successfully installed into your theme!"
          : "Some sections could not be installed. Check details.",
      });
    }

    if (!sectionId) {
      return json({ success: false, error: "Missing sectionId parameter" }, { status: 400 });
    }

    const result = await installSectionToTheme(admin, session, sectionId);
    return json(result);
  } catch (error: any) {
    console.error("[ConvertFlow] API Installation error:", error);
    return json(
      {
        success: false,
        error: error.message || "Failed to install section to theme.",
      },
      { status: 500 }
    );
  }
};
