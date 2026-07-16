import prisma from "./app/db.server.js";

async function check() {
  const session = await prisma.session.findFirst({
    where: { shop: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  console.log("Session scopes:", session?.scope);
}

check().catch(console.error);
