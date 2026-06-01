# 04 PROFIT CALCULATOR — LIVE INTEGRATIONS

The profit calculator is the most technically differentiated feature. It pulls LIVE data from all connected services to show merchants their actual per-order profitability — not estimates.

## Data Sources
- **Shopify (native)**: Selling price, COGS from product metafields (Admin API — Orders + Products). Fallback: Always available.
- **Razorpay**: Actual PG fee per transaction (Razorpay Settlements API). Fallback: Manual % input.
- **Facebook Ads**: Campaign spend, CAC per product, ROAS (Facebook Marketing API v20+). Fallback: Manual CAC input.
- **Shiprocket**: Actual shipping cost per order (Shiprocket Orders API). Fallback: Manual flat amount.
- **Manual Inputs**: Packaging cost, RTO buffer % (App settings MySQL). Fallback: Always available.

## Facebook Ads OAuth Flow
1. Merchant clicks 'Connect Facebook Ads' in Integrations dashboard
2. OAuth redirect to Facebook — scopes: `ads_read`, `business_management`
3. Merchant selects which Ad Account to link
4. App pulls campaigns + conversion events via Marketing API v20+
5. Merchant maps Facebook conversion events to Shopify products/collections
6. Dashboard auto-pulls CAC per product daily — shown in profit calculator

## Key Formulas
- **Net Profit / Order**: Selling Price - COGS - Shipping - Packaging - PG Fee - Ad Spend (CAC) - RTO Buffer
- **Net Margin %**: (Net Profit / Selling Price) x 100
- **ROAS**: Selling Price / Ad Spend per Order
- **Break-even Price**: Total Costs excluding Ad Spend
- **Monthly Projection**: Net Profit x Average Orders per Day x 30
- **3-Order LTV Profit**: Net Profit x 3
