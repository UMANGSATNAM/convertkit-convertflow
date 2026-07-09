/**
 * scripts/run-introspection-spike.ts
 * 
 * Live GraphQL Schema Introspection Spike for Shopify Admin GraphQL API (2024-04 / latest).
 * Queries Shopify directly for authoritative schema evidence and logs cost/throttle telemetry.
 *
 * Usage:
 *   npx tsx scripts/run-introspection-spike.ts
 */

import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "";
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

async function executeIntrospectionQuery(shop: string, token: string, label: string, query: string, variables: Record<string, any> = {}) {
  console.log(`\n=============================================================`);
  console.log(`🔬 INTROSPECTION QUERY: ${label}`);
  console.log(`=============================================================`);

  const response = await fetch(`https://${shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json() as any;

  if (json.errors) {
    console.error(`❌ GraphQL Errors for [${label}]:`, JSON.stringify(json.errors, null, 2));
  } else {
    console.log(`✅ Data for [${label}]:`);
    console.log(JSON.stringify(json.data, null, 2));
  }

  // Always display throttle telemetry baseline (extensions.cost)
  if (json.extensions?.cost) {
    console.log(`\n📊 Throttle Telemetry (extensions.cost):`);
    console.log(JSON.stringify(json.extensions.cost, null, 2));
  } else {
    console.log(`\n📊 Throttle Telemetry: No extensions.cost returned.`);
  }

  return json;
}

async function main() {
  console.log(`🚀 Starting Shopify Live Introspection Spike for store: ${STORE_DOMAIN}`);

  // Resolve access token from DB session or env
  let token = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!token) {
    const session = await (prisma as any).session.findFirst({
      where: { shop: STORE_DOMAIN },
    });
    if (session?.accessToken) {
      token = session.accessToken;
      console.log(`🔑 Resolved access token from DB Session (${session.id})`);
    } else {
      const shopRecord = await (prisma as any).shop.findFirst({
        where: { shopDomain: STORE_DOMAIN },
      });
      if (shopRecord?.accessToken) {
        token = shopRecord.accessToken;
        console.log(`🔑 Resolved access token from DB Shop record`);
      }
    }
  }

  if (!token) {
    console.error(`❌ Could not find an access token for ${STORE_DOMAIN}. Please set SHOPIFY_ACCESS_TOKEN in .env or authenticate the store.`);
    return;
  }

  // 1. Introspect OnlineStoreThemeFilesUpsertFileInput
  const query1 = `
    query IntrospectThemeFilesUpsertInput {
      __type(name: "OnlineStoreThemeFilesUpsertFileInput") {
        name
        kind
        description
        inputFields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  `;
  await executeIntrospectionQuery(STORE_DOMAIN, token, "1. OnlineStoreThemeFilesUpsertFileInput", query1);

  // 1b. Fallback check for ThemeFilesUpsertFileInput (to show comparison)
  const query1b = `
    query IntrospectLegacyThemeFilesUpsertInput {
      __type(name: "ThemeFilesUpsertFileInput") {
        name
        kind
        inputFields {
          name
          type { name kind }
        }
      }
    }
  `;
  await executeIntrospectionQuery(STORE_DOMAIN, token, "1b. ThemeFilesUpsertFileInput (Check if exists)", query1b);

  // 2. Introspect ThemeCreateInput
  const query2 = `
    query IntrospectThemeCreateInput {
      __type(name: "ThemeCreateInput") {
        name
        kind
        description
        inputFields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  `;
  await executeIntrospectionQuery(STORE_DOMAIN, token, "2. ThemeCreateInput (Check src vs source & optionality)", query2);

  // 3. Introspect StagedUploadTargetGenerateUploadResource
  const query3 = `
    query IntrospectStagedUploadResourceEnum {
      __type(name: "StagedUploadTargetGenerateUploadResource") {
        name
        kind
        description
        enumValues {
          name
          description
          isDeprecated
        }
      }
    }
  `;
  await executeIntrospectionQuery(STORE_DOMAIN, token, "3. StagedUploadTargetGenerateUploadResource (Check if THEME included)", query3);

  // 4. Introspect Mutation family signatures: themeFilesUpsert, themeCreate, themeDelete, themePublish
  const query4 = `
    query IntrospectThemeMutations {
      __type(name: "Mutation") {
        name
        fields(includeDeprecated: true) {
          name
          description
          args {
            name
            description
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }
  `;
  
  console.log(`\n=============================================================`);
  console.log(`🔬 INTROSPECTION QUERY: 4. Mutation Family Signatures`);
  console.log(`=============================================================`);

  const response4 = await fetch(`https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query4 }),
  });
  const json4 = await response4.json() as any;

  if (json4.errors) {
    console.error(`❌ GraphQL Errors for Mutation Family:`, JSON.stringify(json4.errors, null, 2));
  } else if (json4.data?.__type?.fields) {
    const targetMutations = ["themeFilesUpsert", "themeCreate", "themeDelete", "themePublish"];
    const matchedMutations = json4.data.__type.fields.filter((f: any) => targetMutations.includes(f.name));
    console.log(`✅ Filtered Signatures for Theme Mutation Family (${targetMutations.join(", ")}):`);
    console.log(JSON.stringify(matchedMutations, null, 2));
  }

  if (json4.extensions?.cost) {
    console.log(`\n📊 Throttle Telemetry (extensions.cost):`);
    console.log(JSON.stringify(json4.extensions.cost, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
