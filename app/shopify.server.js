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

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  restResources,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
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
    expiringOfflineAccessTokens: true,
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
