import fs from 'fs';
import Database from 'better-sqlite3';

async function runProbe() {
  const db = new Database('./prisma/dev.sqlite');
  const shop = db.prepare('SELECT * FROM Session LIMIT 1').get();
  
  if (!shop) throw new Error('No shop found');

  // 1. Create blank theme
  const createRes = await fetch(`https://${shop.shop}/admin/api/2024-10/themes.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": shop.accessToken,
    },
    body: JSON.stringify({ theme: { name: "Probe Limits", role: "unpublished" } })
  });
  
  const createData = await createRes.json();
  const themeId = createData.theme.id;
  const themeGid = `gid://shopify/Theme/${themeId}`;

  // 2. Generate 51 fake files
  const files = [];
  for(let i=0; i<51; i++) {
    files.push({
      filename: `templates/page.fake${i}.liquid`,
      body: { type: "TEXT", value: "test" }
    });
  }

  // 3. Upsert
  console.log("Sending 51 files to themeFilesUpsert...");
  const query = `
    mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $themeId, files: $files) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${shop.shop}/admin/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shop.accessToken,
      },
      body: JSON.stringify({ query, variables: { themeId: themeGid, files } })
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error("Caught error:", e.message);
  }

  // 4. Cleanup
  await fetch(`https://${shop.shop}/admin/api/2024-10/themes/${themeId}.json`, {
    method: "DELETE",
    headers: { "X-Shopify-Access-Token": shop.accessToken }
  });
}

runProbe().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
