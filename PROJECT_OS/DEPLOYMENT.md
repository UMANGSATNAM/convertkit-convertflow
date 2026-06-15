# Deployment Guide

This guide outlines the steps required to deploy the AI Agency Operating System MVP into a production environment.

## 1. Hosting Provider (Railway)

Since this is a Remix-based Shopify application, you need a Node.js runtime. We are using **Railway** for hosting.

**Railway Deployment Steps:**
1. Ensure your Railway project is connected to your GitHub repository.
2. Railway will automatically detect the Node.js project or `Dockerfile` and build it.
3. In the Railway Dashboard, go to your project's **Variables** tab to set up the environment variables *before* the first successful deployment.

## 2. Environment Variables

The following environment variables MUST be configured in your production environment before the app can start securely:

```env
# Shopify Configuration
SHOPIFY_API_KEY=your_production_client_id
SHOPIFY_API_SECRET=your_production_client_secret
SCOPES=write_themes,write_products,read_products
SHOPIFY_APP_URL=https://your-production-app.fly.dev

# Database Configuration (Neon, Supabase, RDS)
DATABASE_URL=postgresql://user:password@host:port/db?sslmode=require

# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
```

## 3. Database Provisioning

In production, you cannot rely on SQLite. You must use PostgreSQL.

1. Update `prisma/schema.prisma` to use PostgreSQL if it currently uses SQLite:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Run Prisma migrations against the production database:
   `npx prisma migrate deploy`
3. Seed the production database with the core Fashion MVP components:
   `npx prisma db seed`

## 4. Build and Start

The `package.json` should have the following standard scripts:
- `npm run build`: Compiles the Remix application into the `build/` folder.
- `npm run start`: Starts the production server serving from the `build/` directory.

## 5. Security Checklist
- [ ] Ensure `.env` is inside `.gitignore`.
- [ ] Do not commit database credentials.
- [ ] The `SHOPIFY_API_SECRET` must exactly match your Shopify Partner Dashboard configuration.
- [ ] Ensure Webhooks are securely configured and verified using the HMAC strategy.
