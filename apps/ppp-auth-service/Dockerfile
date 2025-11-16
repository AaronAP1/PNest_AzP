FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY apps/ppp-auth-service ./apps/ppp-auth-service

RUN npx prisma generate --schema=./apps/ppp-auth-service/prisma/schema.prisma

CMD ["npm", "run", "start:dev", "ppp-auth-service"]

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY apps/ppp-auth-service ./apps/ppp-auth-service

RUN npx prisma generate --schema=./apps/ppp-auth-service/prisma/schema.prisma
RUN npm run build ppp-auth-service

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY apps/ppp-auth-service/prisma ./apps/ppp-auth-service/prisma

CMD ["node", "dist/apps/ppp-auth-service/main"]
