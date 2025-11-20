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
COPY apps/ppaz-api-gateway ./apps/ppaz-api-gateway

# Build application
RUN npm run build ppaz-api-gateway

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/apps/ppaz-api-gateway/main"]
