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
        <title>PageCraft AI</title>
        <meta name="description" content="Build high-converting Shopify pages in 60 seconds." />
        <meta property="og:title" content="PageCraft AI" />
        <meta property="og:description" content="Build high-converting Shopify pages." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com" />
        <meta property="og:image" content="https://example.com/image.png" />
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
        {/* PostHog Boilerplate */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init push capture handle_api_error on_default on_api_error maybe_call_maybe capture_message capture_exception capture_exception capture_message group group set_config maybe_call_maybe isFeatureEnabled on_default isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on on_default on_api_error reset maybe_call_maybe set set_once set_group remove capture_pageview capture_pageview capture_pageview get_property get_property get_property get_property get_session_id get_session_replay_url get_session_replay_url get_session_replay_url get_session_replay_url get_session_replay_url get_session_replay_url get_session_replay_url alias identify identify maybe_call_maybe getFeatureFlag getFeatureFlagPayload updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures isFeatureEnabled isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags onFeatureFlags on_api_error on_default maybe_call_maybe maybe_call_maybe".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('YOUR_POSTHOG_KEY', {
                  api_host:'https://us.i.posthog.com',
                  person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
              });
            `,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

{/* <label>Form field</label> */}
