import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const session = await prisma.session.findFirst();
  console.log("Using session:", session.shop, session.accessToken);
  
  const res = await fetch(`https://${session.shop}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": session.accessToken
    },
    body: JSON.stringify({
      query: `
        query GetShop {
          shop {
            id
            myshopifyDomain
            currencyCode
            billingAddress { country }
          }
        }
      `
    })
  });
  
  const data = await res.json();
  console.log("Response:", JSON.stringify(data, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
