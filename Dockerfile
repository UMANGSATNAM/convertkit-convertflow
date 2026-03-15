# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install ALL dependencies (including devDeps like esbuild/vite)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source and build the app
COPY . .
RUN npm run build

# --- STAGE 2: Production Run ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Only install production dependencies here
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force
# Install Prisma CLI explicitly since it is required for `npm run setup` in production
RUN npm install -g prisma@6.19.2

# Copy only the necessary folders from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app/db.server.js ./app/db.server.js
COPY --from=builder /app/storefront ./storefront
COPY --from=builder /app/extensions ./extensions
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "docker-start"]
