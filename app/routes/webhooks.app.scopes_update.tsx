import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, payload } = await authenticate.webhook(request);

  if (session) {
    const scopes = (payload as { current: string[] | string }).current;
    await prisma.session.update({
      where: { id: session.id },
      data: { scope: Array.isArray(scopes) ? scopes.join(",") : String(scopes) },
    });
  }

  return new Response();
};
