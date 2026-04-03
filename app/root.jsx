import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta = () => [
  { title: "PageCraft AI — Shopify Page Builder" },
  { name: "description", content: "Build high-converting Shopify pages in 60 seconds. AI-powered page builder with sections, themes, urgency tools, and conversion scoring." },
  { name: "robots", content: "noindex, nofollow" },
  { property: "og:title", content: "PageCraft AI — Shopify Page Builder" },
  { property: "og:description", content: "AI page builder that helps Shopify merchants create stunning store pages with zero design experience." },
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
