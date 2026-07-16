import { graphqlRequest } from './app/shopify.server.js';
import prisma from './app/db.server.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';

async function runIntrospection() {
  const shop = await prisma.shop.findFirst();
  if (!shop) throw new Error('No shop found');
  
  const query = `
    query introspection {
      __type1: __type(name: "ThemeCreateInput") {
        name
        inputFields {
          name
          type {
            name
            kind
            ofType { name kind }
          }
        }
      }
      __type2: __type(name: "OnlineStoreThemeFilesUpsertFileInput") {
        name
        inputFields {
          name
          type {
            name
            kind
            ofType { name kind }
          }
        }
      }
      __type3: __type(name: "StagedUploadTargetGenerateUploadResource") {
        name
        kind
        enumValues {
          name
        }
      }
      mutationType: __schema {
        mutationType {
          fields {
            name
            args {
              name
              type {
                name
                kind
                ofType { name kind }
              }
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch(`https://${shop.shopDomain}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shop.accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    // Filter the mutation fields to just the ones we care about
    if (data.data && data.data.mutationType && data.data.mutationType.fields) {
      data.data.mutationType.fields = data.data.mutationType.fields.filter(
        (f: any) => ['themeCreate', 'themeFilesUpsert', 'stagedUploadsCreate'].includes(f.name)
      );
    }
    
    await fs.writeFile('tmp-introspection.json', JSON.stringify(data, null, 2), 'utf8');
    console.log("Saved to tmp-introspection.json");
  } catch (err: any) {
    console.error("Introspection Error:", err);
  }
}

runIntrospection().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
