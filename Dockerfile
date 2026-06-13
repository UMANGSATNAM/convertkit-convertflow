# ---------- STAGE 1 : BUILD ----------
FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

RUN rm -rf build/
RUN npm run build
RUN npx prisma generate


# ---------- STAGE 2 : RUN ----------
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app ./app
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/extensions ./extensions

CMD ["sh","-c","npx prisma db push --accept-data-loss && npm start"]