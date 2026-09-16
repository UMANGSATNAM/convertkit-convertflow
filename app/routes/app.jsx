import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate, currentApiKey } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || currentApiKey };
};

/**
 * Four navigation items, down from fourteen.
 *
 * The old menu listed Generator, AI Builder, Design Studio, Sections, Section
 * Library, Toolkit, Campaigns, Health Monitor, Validation Lab, Tracking,
 * Features, History and Pincode Settings. A merchant opening the app for the
 * first time had fourteen doors and no indication which one builds their store.
 * Several led to the same job by different names.
 *
 * These four follow the actual sequence of work: see where you are, add
 * sections, review what is on your theme, change how it behaves. The other
 * screens still exist and are reachable by URL — they are simply not the first
 * thing a new merchant has to choose between.
 */
export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">Section Store</Link>
        <Link to="/app/conversion">CRO & Boosters</Link>
        <Link to="/app/pagekit">Full Page Kits</Link>
        <Link to="/app/theme">My Added Sections</Link>
        <Link to="/app/settings">Settings</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is401 = error?.status === 401 || (error?.message && String(error.message).includes("401"));

  if (is401) {
    const installUrl = "https://admin.shopify.com/store/peri-beauty-bcuauhsj/oauth/install?client_id=3c6ab6e0f48016cb9f04315789387b66";
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "32px",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'San Francisco', Roboto, Segoe UI, sans-serif"
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "480px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e1e3e5"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#202223", marginBottom: "8px" }}>
            Permissions Updated
          </h2>
          <p style={{ color: "#6d7175", fontSize: "14px", lineHeight: "1.5", marginBottom: "24px" }}>
            The app credentials or required permissions have been updated. Please click below to grant access and open the app.
          </p>
          <a
            href={installUrl}
            target="_top"
            style={{
              display: "inline-block",
              backgroundColor: "#008060",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
            }}
          >
            Reconnect & Open App
          </a>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.top && window.top !== window.self) {
                setTimeout(function() {
                  window.top.location.href = "${installUrl}";
                }, 800);
              }
            `,
          }}
        />
      </div>
    );
  }

  return boundary.error(error);
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
