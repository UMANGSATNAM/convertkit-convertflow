import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * API Route: /api/convertflow/install-ready-theme
 *
 * Flow:
 *   1. Read the zip file from disk (public/themes/)
 *   2. Ask Shopify for a staged upload URL via stagedUploadsCreate
 *   3. PUT the zip bytes to that GCS/S3 URL
 *   4. Call themeCreate with the Shopify CDN resource URL
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const themePath = formData.get("themePath"); // e.g. /themes/luxe-fashion-theme-v2.zip
  const themeName = formData.get("themeName");

  if (!themePath || !themeName) {
    return json({ error: "Missing theme path or name" }, { status: 400 });
  }

  // Resolve the zip file from the project's public directory
  const zipFileName = path.basename(themePath);
  const zipFilePath = path.join(__dirname, "..", "..", "public", "themes", zipFileName);

  if (!fs.existsSync(zipFilePath)) {
    return json({ error: `Theme file not found: ${zipFileName}` }, { status: 404 });
  }

  const zipBuffer = fs.readFileSync(zipFilePath);
  const zipSize = zipBuffer.length;

  try {
    // ── Step 1: Request a staged upload URL from Shopify ──────────────────────
    const STAGED_UPLOAD_MUTATION = `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const stagedRes = await admin.graphql(STAGED_UPLOAD_MUTATION, {
      variables: {
        input: [
          {
            filename: zipFileName,
            mimeType: "application/zip",
            resource: "FILE",
            fileSize: String(zipSize),
            httpMethod: "PUT",
          },
        ],
      },
    });

    const stagedBody = await stagedRes.json();
    const stagedErrors = stagedBody.data?.stagedUploadsCreate?.userErrors;
    if (stagedErrors?.length > 0) {
      return json({ error: stagedErrors[0].message }, { status: 400 });
    }

    const target = stagedBody.data?.stagedUploadsCreate?.stagedTargets?.[0];
    if (!target) {
      return json({ error: "Failed to get staged upload target from Shopify" }, { status: 500 });
    }

    const { url: uploadUrl, resourceUrl } = target;
    console.log("[THEME INSTALL] Staged upload URL:", uploadUrl);
    console.log("[THEME INSTALL] Resource URL:", resourceUrl);

    // ── Step 2: Upload the zip to Shopify's GCS/S3 ───────────────────────────
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(zipSize),
      },
      body: zipBuffer,
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      console.error("[THEME INSTALL] Upload failed:", errText);
      return json({ error: `Upload to Shopify failed: ${uploadResponse.status}` }, { status: 500 });
    }

    console.log("[THEME INSTALL] Upload succeeded, creating theme...");

    // ── Step 3: Create the theme using the CDN resource URL ───────────────────
    const CREATE_THEME_MUTATION = `
      mutation themeCreate($source: URL!, $name: String!, $role: ThemeRole!) {
        themeCreate(source: $source, name: $name, role: $role) {
          theme {
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
    `;

    const createRes = await admin.graphql(CREATE_THEME_MUTATION, {
      variables: {
        source: resourceUrl,
        name: themeName,
        role: "UNPUBLISHED",
      },
    });

    const createBody = await createRes.json();
    const createErrors = createBody.data?.themeCreate?.userErrors;
    if (createErrors?.length > 0) {
      return json({ error: createErrors[0].message }, { status: 400 });
    }

    if (!createBody.data?.themeCreate?.theme) {
      return json({ error: "Failed to create theme via GraphQL" }, { status: 400 });
    }

    return json({ success: true, theme: createBody.data.themeCreate.theme });
  } catch (error) {
    console.error("[THEME INSTALL] Error:", error.message);
    return json({ error: `Failed to install theme: ${error.message}` }, { status: 500 });
  }
};
