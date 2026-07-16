import { restRequest, graphqlRequest } from './app/shopify-api.server.js';
import prisma from './app/db.server.js';

async function runProbe() {
  const shop = await prisma.shop.findFirst();
  if (!shop) throw new Error('No shop found');

  console.log("1. Creating blank theme via REST API...");
  // Use a fetch directly for REST to ensure 2024-10 version is respected, though restRequest usually handles it
  const createRes = await fetch(`https://${shop.shopDomain}/admin/api/2024-10/themes.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": shop.accessToken,
    },
    body: JSON.stringify({
      theme: {
        name: "Probe Blank Theme",
        role: "unpublished"
      }
    })
  });
  
  const createData = await createRes.json();
  if (createData.errors) {
    console.error("Theme creation failed:", createData.errors);
    process.exit(1);
  }
  
  const themeId = createData.theme.id;
  console.log(`Created Theme ID: ${themeId}`);
  
  // Wait a second just in case Shopify async populates things
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("2. Querying theme files via GraphQL...");
  
  // We need to fetch files. The REST API /admin/api/2024-10/themes/${themeId}/assets.json is easiest to list all files
  const assetsRes = await fetch(`https://${shop.shopDomain}/admin/api/2024-10/themes/${themeId}/assets.json`, {
    headers: {
      "X-Shopify-Access-Token": shop.accessToken,
    }
  });
  const assetsData = await assetsRes.json();
  
  if (assetsData.assets) {
    console.log(`File Count: ${assetsData.assets.length}`);
    if (assetsData.assets.length > 0) {
      console.log("Files found:");
      assetsData.assets.slice(0, 10).forEach((a: any) => console.log(`- ${a.key}`));
    } else {
      console.log("Theme is 100% EMPTY.");
    }
  } else {
    console.log(assetsData);
  }
  
  // Cleanup
  await fetch(`https://${shop.shopDomain}/admin/api/2024-10/themes/${themeId}.json`, {
    method: "DELETE",
    headers: {
      "X-Shopify-Access-Token": shop.accessToken,
    }
  });
  console.log("Deleted probe theme.");
}

runProbe().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
