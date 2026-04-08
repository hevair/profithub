# ============================================
# Dockerfile - ProfitHub Backend
# ============================================

FROM node:20

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy prisma and generate client (regenerate for Linux)
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY backend/ ./

# Build
RUN npm run build

# Expose port
EXPOSE 4000

# Start
CMD ["node", "dist/src/main.js"]
