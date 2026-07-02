import { PrismaClient } from '@prisma/client';
import { restRequest } from '../app/services/shopify-api.server';

const prisma = new PrismaClient();

async function main() {
  const session = await prisma.session.findFirst({
    where: { isOnline: false }
  });

  if (!session) {
    console.error("❌ No offline session found in the database.");
    return;
  }

  console.log(`Checking session for shop: ${session.shop}`);
  console.log(`Access token prefix: ${session.accessToken.substring(0, 10)}...`);

  try {
    const shopData = await restRequest(session.shop, session.accessToken, "GET", "shop.json");
    console.log("✅ Session token is VALID!");
    console.log("Shop Info:", {
      name: shopData.shop?.name,
      domain: shopData.shop?.domain,
      iana_timezone: shopData.shop?.iana_timezone,
      currency: shopData.shop?.currency
    });
  } catch (error: any) {
    console.error("❌ Session token is INVALID or expired.");
    console.error("Error details:", error.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
