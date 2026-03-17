# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install ALL dependencies (including devDeps like esbuild/vite)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source and build the app
COPY . .
RUN npm run build

# Generate Prisma Client (build environment must provide DATABASE_URL somehow, or skip)
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


ENV HOST="0.0.0.0"
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run start"]
