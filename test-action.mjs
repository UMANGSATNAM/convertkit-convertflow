import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const shopDomain = 'peril-jewellery.myshopify.com';
  
  let merchant = await prisma.merchant.findUnique({
    where: { shopDomain: shopDomain }
  });
  
  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: {
        shopDomain: shopDomain,
        accessToken: "dummy",
      }
    });
  }

  await prisma.$transaction([
      prisma.merchant.update({
        where: { shopDomain: shopDomain },
        data: {
          niche: "clothing",
          averageOrderValue: 100,
          razorpayKeyId: "",
          shiprocketEmail: "",
          shiprocketPassword: "",
          onboardingStep: 5,
          onboardingCompleted: true,
          themePrimaryColor: "#000",
          themeSecondaryColor: "#FFF",
        },
      }),
      prisma.featureConfig.upsert({
        where: { merchantId_featureKey: { merchantId: merchant.id, featureKey: "countdown_timer" } },
        update: { enabled: true },
        create: { merchantId: merchant.id, featureKey: "countdown_timer", enabled: true, config: {} }
      }),
  ]);
  
  console.log("Success");
}

main().catch(console.error);
