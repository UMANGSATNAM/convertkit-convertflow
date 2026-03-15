# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install ALL dependencies (including devDeps like esbuild/vite)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source and build the app
COPY . .
RUN npm run build

# Generate Prisma Client while dev tools and binary targets are available
ENV DATABASE_URL="mysql://u352022980_umangp1199:Umangsatnam4456@srv1872.hstgr.io:3306/u352022980_conv?connection_limit=2&pool_timeout=20"
RUN npx prisma generate

# Remove all dev dependencies to prepare node_modules for production
RUN npm prune --omit=dev --legacy-peer-deps && npm cache clean --force

# --- STAGE 2: Production Run ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Copy the bare minimum required to run the app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app/db.server.js ./app/db.server.js
COPY --from=builder /app/storefront ./storefront
COPY --from=builder /app/extensions ./extensions
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

ENV HOST="0.0.0.0"
CMD ["npm", "run", "docker-start"]
