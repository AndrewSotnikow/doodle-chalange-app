# Build stage
FROM node:22.16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22.16-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force && \
    chown -R node:node .
USER node
EXPOSE 3000
COPY --from=builder /app/dist ./dist
CMD ["npm", "start"]
