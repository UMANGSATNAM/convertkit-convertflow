FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps && npm cache clean --force

COPY . .

RUN npm run build

ENV NODE_ENV=production

# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/cli --legacy-peer-deps

# Remove dev dependencies to keep the image small
RUN npm prune --omit=dev --legacy-peer-deps && npm cache clean --force

CMD ["npm", "run", "docker-start"]
