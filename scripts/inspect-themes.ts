import { PrismaClient } from '@prisma/client';
import { restRequest } from '../app/services/shopify-api.server';

const prisma = new PrismaClient();

async function main() {
  const session = await prisma.session.findFirst({
    where: { isOnline: false }
  });

  if (!session) {
    console.error("No session found.");
    return;
  }

  try {
    const data = await restRequest(session.shop, session.accessToken, "GET", "themes.json");
    console.log("Current themes in shop:", data.themes.map((t: any) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      created_at: t.created_at,
      updated_at: t.updated_at
    })));
  } catch (error: any) {
    console.error("Failed to fetch themes:", error.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
