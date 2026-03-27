import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta = () => [
  { title: "ConvertFlow — Conversion Toolkit for Shopify" },
  { name: "description", content: "All-in-one conversion toolkit: urgency tools, AI reviews, upsells, themes, and 30+ high-converting sections for Shopify stores." },
  { name: "robots", content: "noindex, nofollow" },
  { property: "og:title", content: "ConvertFlow — Conversion Toolkit for Shopify" },
  { property: "og:description", content: "Increase revenue with urgency tools, AI review writing, upsell popups, and premium themes." },
  { property: "og:type", content: "website" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
