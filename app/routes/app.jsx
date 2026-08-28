import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
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
        <Link to="/app" rel="home">Home</Link>
        <Link to="/app/homepages">All Homepages</Link>
        <Link to="/app/pagekit">Build your store</Link>
        <Link to="/app/sections">Add sections</Link>
        <Link to="/app/theme">My theme</Link>
        <Link to="/app/youtube">YouTube Shorts</Link>
        <Link to="/app/settings">Settings</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
