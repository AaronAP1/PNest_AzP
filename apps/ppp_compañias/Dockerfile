# Dockerfile para ppp_compañías
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar Prisma schema primero
COPY apps/ppp_compañias/prisma ./apps/ppp_compañias/prisma

# Generar Prisma Client
RUN npx prisma generate --schema=./apps/ppp_compañias/prisma/schema.prisma

# Copiar todo el código fuente de apps
COPY apps ./apps

# Build
RUN npm run build ppp_compañias

# Producción
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias y build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/ppp_compañias ./dist
COPY --from=builder /app/apps/ppp_compañias/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Generar Prisma Client en producción
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3002

CMD ["node", "dist/main.js"]
