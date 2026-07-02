/**
 * check-token-fresh.ts
 * Checks the DB sessions and tests the token directly via REST
 */
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Fetching sessions from DB...\n");

  const sessions = await (prisma as any).session.findMany({
    where: {
      shop: "uwyhex-nb.myshopify.com",
    },
    take: 5,
  });

  if (sessions.length === 0) {
    console.log("❌ No sessions found for uwyhex-nb.myshopify.com");
    return;
  }

  for (const s of sessions) {
    console.log(`📋 Session ID: ${s.id}`);
    console.log(`   Shop: ${s.shop}`);
    console.log(`   Online: ${s.isOnline}`);
    console.log(`   Token prefix: ${s.accessToken?.slice(0, 12)}...`);
    console.log(`   Updated: ${s.updatedAt}`);
    console.log(`   Expires: ${s.expires ?? "never (offline)"}`);

    // Test the token
    console.log(`   Testing token...`);
    try {
      const res = await fetch(
        `https://${s.shop}/admin/api/2024-04/shop.json`,
        {
          headers: {
            "X-Shopify-Access-Token": s.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json() as any;
        console.log(`   ✅ Token VALID! Shop name: ${data.shop?.name}`);
      } else {
        const text = await res.text();
        console.log(`   ❌ Token INVALID: ${res.status} ${text.slice(0, 100)}`);
      }
    } catch (err: any) {
      console.log(`   ❌ Network error: ${err.message}`);
    }
    console.log();
  }

  // Also check Shop table
  console.log("🏪 Checking Shop table...");
  try {
    const shops = await (prisma as any).shop.findMany({
      where: { shopDomain: { contains: "uwyhex" } },
      take: 3,
    });
    for (const shop of shops) {
      console.log(`   Shop: ${shop.shopDomain}`);
      console.log(`   Token prefix: ${shop.accessToken?.slice(0, 12)}...`);
      console.log(`   Plan: ${shop.plan}`);
      console.log(`   Uninstalled: ${shop.uninstalledAt}`);
      console.log(`   Created: ${shop.createdAt}`);
      // Test shop token too
      try {
        const res = await fetch(
          `https://${shop.shopDomain}/admin/api/2024-04/shop.json`,
          {
            headers: {
              "X-Shopify-Access-Token": shop.accessToken,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json() as any;
          console.log(`   ✅ Shop token VALID! Shop: ${data.shop?.name}`);
        } else {
          console.log(`   ❌ Shop token INVALID: ${res.status}`);
        }
      } catch (err: any) {
        console.log(`   ❌ Shop token network error: ${err.message}`);
      }
    }
  } catch (err: any) {
    console.log(`   Shop table query error: ${err.message}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
