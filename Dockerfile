# ---------- STAGE 1 : BUILD ----------
FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates unzip

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

RUN rm -rf build/
RUN npm run build
RUN npx prisma generate


# ---------- STAGE 2 : RUN ----------
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates unzip

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app ./app
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/extensions ./extensions
# Demo catalogues read at runtime by importCatalog(). Committed to the repo and
# present in the builder stage, but never copied here, so production failed with
# ENOENT on /app/themes/ethnic-wear/catalog.json and imported an empty product
# list — which is what put "Jewelry Item 1 @ $199" style placeholders on a
# generated store.
COPY --from=builder /app/themes ./themes

CMD ["sh","-c","npm run docker-start"]