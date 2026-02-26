ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install

# === dev stage ===
FROM base AS dev
WORKDIR /app
COPY . .
CMD ["npm","run","start:dev"]

# === prod stage ===
FROM base AS prod
WORKDIR /app
COPY . .
RUN npm run build
CMD ["sh","-c","npm run migrate:prod && npm run start:prod"]