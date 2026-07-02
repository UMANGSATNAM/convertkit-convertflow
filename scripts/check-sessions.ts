import { PrismaClient } from "@prisma/client";
import { restRequest } from "../app/services/shopify-api.server";

const prisma = new PrismaClient();

async function testToken(shop: string, token: string, label: string) {
  try {
    console.log(`Testing ${label} token starting with ${token.substring(0, 10)}...`);
    const data = await restRequest(shop, token, "GET", "shop.json");
    console.log(`✅ ${label} token is VALID! Shop name: ${data.shop?.name}`);
    return true;
  } catch (e: any) {
    console.log(`❌ ${label} token is INVALID: ${e.message}`);
    return false;
  }
}

async function main() {
  const session = await prisma.session.findFirst({
    where: { isOnline: false }
  });
  const shop = await prisma.shop.findFirst();

  if (session) {
    await testToken(session.shop, session.accessToken, "Session (offline)");
  }
  if (shop) {
    await testToken(shop.shopDomain, shop.accessToken, "Shop");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
