# 05 TECH STACK — RAILWAY + MYSQL

## 5.1 — Railway Architecture
- **Railway Project**: ConvertKit Pro
- **App URL**: `shopifyapp.up.railway.app`
- **Database**: MySQL 8.0 (`mysql-production-0f47.up.railway.app`)
- **Queue/Cache**: Railway Redis service (BullMQ, sessions, cache)
- **File Storage**: Cloudflare R2 (Review images, GST invoice PDFs, template preview images)

### Full Stack Reference
- **Framework**: Remix (React) + TypeScript. Shopify's official recommended framework. Handles OAuth, session, routing.
- **Database**: MySQL 8.0 via Railway. Prisma ORM with `provider='mysql'`.
- **ORM**: Prisma. Type-safe DB queries. MySQL schema migrations.
- **Queue**: BullMQ + Railway Redis. Async jobs: WhatsApp messages, email sequences, Facebook sync, abandoned cart.
- **Cache**: Redis. Session cache, rate limiting, pincode serviceability cache (24hr TTL).
- **Storefront**: Vanilla JS + Theme App Extension. Single <50KB bundle. All 9 app blocks per feature pillar.
- **UI**: Shopify Polaris (React). Native Shopify admin feel.
- **Hosting**: Railway (auto-deploy from GitHub).

## 5.2 — Key Prisma Schema Changes (PostgreSQL → MySQL)
- **Provider**: `provider = "mysql"`
- **JSON columns**: `@db.Json`
- **Long text**: `@db.LongText` for review bodies, descriptions
- **UUID default**: `@default(uuid())`

## Required Shopify Permissions (`shopify.app.toml`)
`write_products`, `read_products`, `write_orders`, `read_orders`, `write_discounts`, `read_discounts`, `read_customers`, `write_themes`, `read_themes` (page injection), `write_pages`, `read_pages` (page injection), `write_script_tags`, `read_analytics`
