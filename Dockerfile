# ---------- STAGE 1 : BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy full source
COPY . .

# Build the application
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate


# ---------- STAGE 2 : RUN ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Install required system dependency for Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy runtime files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app ./app
COPY --from=builder /app/storefront ./storefront
COPY --from=builder /app/extensions ./extensions

# Expose port for Railway
EXPOSE 3000

# Start application
CMD ["sh","-c","npx prisma db push && npm start"]