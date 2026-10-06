FROM node:22-bookworm-slim

WORKDIR /app

RUN chown -R node:node /app

COPY package.json package-lock.json ./
COPY services/api/package.json ./services/api/

RUN npm ci --include=dev

EXPOSE 3001
