import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

import { restResources } from "@shopify/shopify-api/rest/admin/2025-10";

export const PLAN_STARTER = 'STARTER';
export const PLAN_PRO = 'Pro - $19/mo';
export const PLAN_ENTERPRISE = 'Enterprise - $49/mo';

const apiKey = (process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_KEY !== "616431d20b1e35e8672963828655d4b1")
  ? process.env.SHOPIFY_API_KEY
  : "3c6ab6e0f48016cb9f04315789387b66";

const apiSecretKey = process.env.SHOPIFY_API_SECRET || "";

const shopify = shopifyApp({
  apiKey,
  apiSecretKey,
  apiVersion: ApiVersion.October25,
  restResources,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  hooks: {
    afterAuth: async ({ session }) => {
      try {
        shopify.registerWebhooks({ session });
      } catch (e) {
        console.error("registerWebhooks error:", e);
      }
      if (session?.shop && session?.accessToken) {
        try {
          await prisma.shop.upsert({
            where: { shopDomain: session.shop },
            update: { accessToken: session.accessToken },
            create: {
              shopDomain: session.shop,
              accessToken: session.accessToken,
            },
          });
          console.log(`[afterAuth] Synced shop: ${session.shop}`);
        } catch (e) {
          console.error(`[afterAuth] DB error for ${session.shop}:`, e);
        }
      }
    },
  },
  billing: {
    [PLAN_STARTER]: {
      amount: 999,
      currencyCode: 'INR',
      interval: BillingInterval.Every30Days,
    },
    [PLAN_PRO]: {
      amount: 19,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
    [PLAN_ENTERPRISE]: {
      amount: 49,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    expiringOfflineAccessTokens: false,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    SHOP_UPDATE: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    THEMES_PUBLISH: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    APP_SUBSCRIPTIONS_UPDATE: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    SHOP_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
  },
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
