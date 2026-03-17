# ---------- STAGE 1 : BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# copy source
COPY . .

# build app
RUN npm run build

# generate prisma client
RUN npx prisma generate

# remove dev deps
RUN npm prune --omit=dev

# ---------- STAGE 2 : RUN ----------
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# copy runtime files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app ./app
COPY --from=builder /app/storefront ./storefront
COPY --from=builder /app/extensions ./extensions

EXPOSE 3000

CMD sh -c "npx prisma db push && npm start"