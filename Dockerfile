FROM node:18-alpine AS base

RUN npm i -g @nestjs/cli typescript ts-node



FROM base AS build

ENV CI=true
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM base AS prod

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

COPY package*.json ./
RUN npm prune --omit=dev --force

ENTRYPOINT [ "node" ]
CMD [ "dist/main.js" ]
