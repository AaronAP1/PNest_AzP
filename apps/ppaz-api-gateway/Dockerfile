# Dockerfile para API Gateway
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY apps/ppaz-api-gateway ./apps/ppaz-api-gateway

# Build
RUN npm run build ppaz-api-gateway

# Producción
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias y build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/ppaz-api-gateway ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
