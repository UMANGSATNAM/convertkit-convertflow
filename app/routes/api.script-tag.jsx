import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * API Route: /api/script-tag
 * Manages the ConvertKit storefront widget script tag.
 *
 * GET  → List current ConvertKit script tags
 * POST → Create the widget script tag
 * DELETE (via POST with _method=delete) → Remove the widget script tag
 */

const SCRIPT_TAG_SRC_SUFFIX = "/convertkit-widget.min.js";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      scriptTags(first: 10) {
        edges {
          node {
            id
            src
            displayScope
            createdAt
          }
        }
      }
    }
  `);

  const data = await response.json();
  const allTags = data.data?.scriptTags?.edges || [];
  const ckTags = allTags.filter((edge) =>
    edge.node.src.includes(SCRIPT_TAG_SRC_SUFFIX)
  );

  return json({
    scriptTags: ckTags.map((edge) => edge.node),
    isActive: ckTags.length > 0,
  });
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const method = formData.get("_method") || "POST";

  if (method === "delete" || method === "DELETE") {
    // ── Remove Script Tag ──
    const scriptTagId = formData.get("scriptTagId");
    if (!scriptTagId) {
      return json({ error: "Missing scriptTagId" }, { status: 400 });
    }

    const response = await admin.graphql(`
      mutation scriptTagDelete($id: ID!) {
        scriptTagDelete(id: $id) {
          deletedScriptTagId
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: { id: scriptTagId },
    });

    const result = await response.json();
    const errors = result.data?.scriptTagDelete?.userErrors || [];

    if (errors.length > 0) {
      return json({ error: errors[0].message }, { status: 422 });
    }

    return json({ success: true, deleted: true });
  }

  // ── Create Script Tag ──
  const appUrl = process.env.SHOPIFY_APP_URL || "";
  const scriptSrc = `${appUrl}${SCRIPT_TAG_SRC_SUFFIX}`;

  // Check if already exists
  const checkResponse = await admin.graphql(`
    query {
      scriptTags(first: 10) {
        edges {
          node {
            id
            src
          }
        }
      }
    }
  `);
  const checkData = await checkResponse.json();
  const existing = (checkData.data?.scriptTags?.edges || []).find((edge) =>
    edge.node.src.includes(SCRIPT_TAG_SRC_SUFFIX)
  );

  if (existing) {
    return json({ success: true, alreadyExists: true, scriptTag: existing.node });
  }

  const response = await admin.graphql(`
    mutation scriptTagCreate($input: ScriptTagInput!) {
      scriptTagCreate(input: $input) {
        scriptTag {
          id
          src
          displayScope
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      input: {
        src: scriptSrc,
        displayScope: "ALL",
      },
    },
  });

  const result = await response.json();
  const errors = result.data?.scriptTagCreate?.userErrors || [];

  if (errors.length > 0) {
    return json({ error: errors[0].message }, { status: 422 });
  }

  return json({
    success: true,
    scriptTag: result.data?.scriptTagCreate?.scriptTag,
  });
};
