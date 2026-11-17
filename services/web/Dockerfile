# For dev-container use only, this is not the Dockerfile that gets deployed
FROM node:22-bookworm-slim

WORKDIR /app

RUN chown -R node:node /app

COPY package.json package-lock.json ./
COPY services/web/package.json ./services/web/

RUN npm ci --include=dev

EXPOSE 3000
