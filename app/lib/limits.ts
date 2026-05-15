import type { Plan } from "@prisma/client";
import prisma from "../db.server";

export const PLAN_LIMITS: Record<Plan, { pages: number }> = {
  FREE: { pages: 3 },
  STARTER: { pages: 15 },
  GROWTH: { pages: 50 },
  SCALE: { pages: Infinity },
  AGENCY: { pages: Infinity },
};

export async function assertCanCreatePage(shopId: string): Promise<void> {
  const shop = await prisma.shop.findUniqueOrThrow({ where: { id: shopId } });
  const count = await prisma.page.count({
    where: { shopId, deletedAt: null },
  });
  const limit = PLAN_LIMITS[shop.plan].pages;
  if (count >= limit) {
    throw new Response(
      JSON.stringify({
        error: "Plan limit reached",
        limit,
        current: count,
        plan: shop.plan,
      }),
      {
        status: 402,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
