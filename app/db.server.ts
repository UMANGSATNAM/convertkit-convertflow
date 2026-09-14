import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV !== "production") {
  if (!(global as any).__prisma) {
    (global as any).__prisma = new PrismaClient();
  }
  prisma = (global as any).__prisma;
} else {
  prisma = new PrismaClient();
}

export async function getOrSyncShop(shopDomain: string, sessionAccessToken?: string) {
  if (!shopDomain) return null;
  let shop = await prisma.shop.findUnique({ where: { shopDomain } });
  if (shop && shop.accessToken) {
    return shop;
  }

  if (sessionAccessToken) {
    return await prisma.shop.upsert({
      where: { shopDomain },
      update: { accessToken: sessionAccessToken },
      create: {
        shopDomain,
        accessToken: sessionAccessToken,
      },
    });
  }

  const offline = await prisma.session.findUnique({
    where: { id: `offline_${shopDomain}` },
  });
  if (offline?.accessToken) {
    return await prisma.shop.upsert({
      where: { shopDomain },
      update: { accessToken: offline.accessToken },
      create: {
        shopDomain,
        accessToken: offline.accessToken,
      },
    });
  }

  const anySession = await prisma.session.findFirst({
    where: { shop: shopDomain },
    orderBy: { expires: "desc" },
  });
  if (anySession?.accessToken) {
    return await prisma.shop.upsert({
      where: { shopDomain },
      update: { accessToken: anySession.accessToken },
      create: {
        shopDomain,
        accessToken: anySession.accessToken,
      },
    });
  }

  return shop;
}

export default prisma;
