# ============================================
# Dockerfile - ProfitHub Backend
# ============================================

FROM node:20

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY backend/prisma ./prisma

# Clean and regenerate Prisma client for Linux
RUN rm -rf node_modules/.prisma && npx prisma generate

# Copy source code
COPY backend/ ./

# Build
RUN npm run build

# Expose port
EXPOSE 4000

# Start
CMD ["node", "dist/src/main.js"]
