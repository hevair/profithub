# ============================================
# Dockerfile - ProfitHub Backend
# ============================================

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy prisma and generate client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY backend/ ./

# Build
RUN npm run build

# Expose port
EXPOSE 4000

# Start
CMD ["node", "dist/main.js"]
