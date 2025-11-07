# Dockerfile para ppp_core
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY prisma ./prisma
COPY apps/ppp_core ./apps/ppp_core

# Generar Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build
RUN npm run build ppp_core

# Producción
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias y build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/ppp_core ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Generar Prisma Client en producción
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
