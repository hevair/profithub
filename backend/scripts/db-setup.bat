@echo off
REM ============================================
REM Database Setup Script for Production (Windows)
REM ============================================

echo 📦 ProfitHub Database Setup
echo ============================
echo.

REM Check if DATABASE_URL is set
if "%DATABASE_URL%"=="" (
    echo ❌ DATABASE_URL not set!
    echo Please set the DATABASE_URL environment variable:
    echo   set DATABASE_URL=postgresql://user:pass@host/db
    exit /b 1
)

echo ✅ DATABASE_URL is set
echo.

REM Generate Prisma Client
echo 🔧 Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)

echo ✅ Prisma Client generated
echo.

REM Push schema to database
echo 🗄️  Pushing schema to database...
call npx prisma db push
if errorlevel 1 (
    echo ❌ Failed to push schema to database
    exit /b 1
)

echo ✅ Schema pushed successfully
echo.
echo ✅ Database setup complete!
echo.
echo Next steps:
echo 1. Verify the schema in your database provider
echo 2. Run: npm run start:prod
