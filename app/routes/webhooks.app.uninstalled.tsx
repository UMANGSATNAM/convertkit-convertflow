import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop } = await authenticate.webhook(request);

  await prisma.$transaction([
    prisma.shop.update({
      where: { shopifyDomain: shop },
      data: { uninstalledAt: new Date() },
    }),
    prisma.session.deleteMany({ where: { shop } }),
  ]);

  return new Response();
};
