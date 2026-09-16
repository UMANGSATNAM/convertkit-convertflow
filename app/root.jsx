import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta = () => [
  { title: "ShopForge — Autonomous Shopify Store & CRO Generation OS" },
  { name: "description", content: "Auto-generate complete, premium, CRO-ready Shopify stores on your real catalog in 60 seconds." },
  { name: "robots", content: "noindex, nofollow" },
  { property: "og:title", content: "ShopForge — Autonomous Shopify Store & CRO Generation OS" },
  { property: "og:description", content: "Generate agency-quality Shopify stores with zero design experience on your real products." },
  { property: "og:type", content: "website" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>ShopForge</title>
        <meta name="description" content="Autonomous Shopify Store & CRO Generation OS" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --sf-font: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
          }
          body {
            font-family: var(--sf-font);
            -webkit-font-smoothing: antialiased;
            background-color: #f6f6f7;
            color: #202223;
          }
          .Polaris-Page-Header {
            padding-bottom: 1.25rem !important;
          }
          .Polaris-Card {
            border-radius: 12px !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03) !important;
            border: 1px solid #e1e3e5 !important;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .sf-stat-card:hover {
            box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08) !important;
          }
          .sf-preview-frame {
            border: 1px solid #e1e3e5;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          }
        `}} />
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

