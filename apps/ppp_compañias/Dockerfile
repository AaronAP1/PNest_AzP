# Build stage
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/ppp_compañias ./apps/ppp_compañias

# Generate Prisma Client
RUN npx prisma generate --schema=./apps/ppp_compañias/prisma/schema.prisma

# Build application
RUN npm run build ppp_compañias

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY apps/ppp_compañias/prisma ./apps/ppp_compañias/prisma

EXPOSE 3003

CMD ["node", "dist/apps/ppp_compañias/main"]
