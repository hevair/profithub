#!/bin/bash

# ============================================
# Database Setup Script for Production
# ============================================

echo "📦 ProfitHub Database Setup"
echo "============================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set!"
    echo "Please set the DATABASE_URL environment variable:"
    echo "  export DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"

# Push schema to database
echo ""
echo "🗄️  Pushing schema to database..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push schema to database"
    exit 1
fi

echo "✅ Schema pushed successfully"

# Create initial plans
echo ""
echo "📝 Creating default plans..."
npx prisma db execute --stdin <<EOF
-- Only run if tables don't exist yet
INSERT INTO "PlanConfig" ("id", "name", "price", "maxProducts", "maxOrders", "maxAlerts", "features", "order", "active", "createdAt", "updatedAt")
VALUES 
    (uuid_generate_v4(), 'FREE', 0, 50, 100, 10, '', 0, true, NOW(), NOW()),
    (uuid_generate_v4(), 'PRO', 29, 999999, 999999, 999999, '', 1, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
EOF

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify the schema in your database provider"
echo "2. Run: npm run start:prod"
