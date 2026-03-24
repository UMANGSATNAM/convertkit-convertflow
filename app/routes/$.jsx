import { json } from "@remix-run/node";

// Catch-all route to handle trailing 404 requests gracefully
// e.g. /web-pixels@... or /.well-known/shopify/monorail/... 
// injected by Shopify App Proxies that hit our Remix instance.

export const loader = () => {
  return new Response(null, { status: 404 });
};

export const action = () => {
  return new Response(null, { status: 404 });
};
