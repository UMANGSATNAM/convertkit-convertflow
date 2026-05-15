import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import type { Plan } from "@prisma/client";

type SubscriptionPayload = {
  app_subscription: {
    name: string;
    status: string;
  };
};

const VALID_PLANS: ReadonlySet<Plan> = new Set<Plan>([
  "FREE",
  "STARTER",
  "GROWTH",
  "SCALE",
  "AGENCY",
]);

function toPlan(raw: string): Plan {
  const upper = raw.toUpperCase() as Plan;
  return VALID_PLANS.has(upper) ? upper : "FREE";
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload } = await authenticate.webhook(request);
  const data = payload as SubscriptionPayload;
  const sub = data.app_subscription;

  const plan: Plan =
    sub.status === "ACTIVE" ? toPlan(sub.name) : "FREE";

  await prisma.shop.update({
    where: { shopifyDomain: shop },
    data: { plan },
  });

  return new Response();
};
