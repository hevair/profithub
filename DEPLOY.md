# ============================================
# PROFITHUB - PRODUCTION DEPLOYMENT GUIDE
# ============================================

## Overview

This guide will help you deploy ProfitHub to production using free/cheap hosting platforms.

### Recommended Stack for MVP (Low Cost)

| Service | Purpose | Cost | URL |
|---------|---------|------|-----|
| Vercel | Frontend (Next.js) | Free | vercel.com |
| Railway | Backend (NestJS) | $5-20/mo | railway.app |
| Neon | PostgreSQL Database | Free tier | neon.tech |
| Namecheap/Cloudflare | Domain | ~$10/year | namecheap.com |

---

## Step 1: Database Setup (Neon - Free PostgreSQL)

### 1.1 Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project:
   - Project name: `profithub`
   - Region: Choose closest to your users (São Paulo for BR)
   - Compute: Free tier (0.5 GB RAM, 0.25 vCPU)

### 1.2 Get Connection String
After creating project, you'll see:
```
postgresql://username:password@ep-xxx-xxx-12345.us-east-2.aws.neon.tech/profithub
```

SAVE THIS - you'll need it for environment variables.

### 1.3 Update Prisma Schema (Already Compatible)
The current schema works with both SQLite and PostgreSQL. No changes needed.

---

## Step 2: Backend Deployment (Railway)

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"

### 2.2 Configure Railway

1. **Connect Repository**: Select your `profithub` repo
2. **Root Directory**: Set to `backend`
3. **Build Command**: Leave empty (Railway auto-detects NestJS)
4. **Start Command**: `node dist/main.js`

### 2.3 Environment Variables (Railway Dashboard)

Add these variables in Railway → Project → Variables:

```
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=generate-a-very-long-random-string-here
FRONTEND_URL=https://your-domain.com
PORT=4000
```

**Generate JWT_SECRET:**
```bash
# Run this in terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Custom Domain (Optional)
1. Railway → Project → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Add CNAME record in your DNS provider

---

## Step 3: Frontend Deployment (Vercel - Free)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"

### 3.2 Import Project
1. Select your `profithub` GitHub repo
2. Framework: Next.js (auto-detected)
3. Root Directory: `frontend`
4. Build Command: `npm run build` (default)
5. Output Directory: `.next` (default)

### 3.3 Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 3.4 Deploy
Click "Deploy" - Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Deploy to CDN
- Provide a `.vercel.app` subdomain

### 3.5 Custom Domain
1. Vercel → Project → Settings → Domains
2. Add `www.yourdomain.com` and `yourdomain.com`
3. Add DNS records as instructed by Vercel

---

## Step 4: Domain & DNS Configuration

### 4.1 Buy Domain
Recommended registrars:
- Namecheap (~$10/year for .com.br)
- Cloudflare Registrar (~$10/year)

### 4.2 DNS Settings

Point your domain to Vercel and Railway:

```
Type    Name    Value
------  ------  ----------------------------------
A       @       76.76.21.21 (Vercel)
CNAME   www     cname.vercel-dns.com
CNAME   api     your-app.railway.app
TXT     @       vercel verification code
```

---

## Step 5: Stripe Setup (For Payments)

### 5.1 Create Stripe Account
1. Go to https://stripe.com
2. Enable test mode first

### 5.2 Get API Keys
Stripe Dashboard → Developers → API keys:
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 5.3 Add to Railway
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 5.4 Setup Webhook (Railway)
1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://api.yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

---

## Quick Reference: All Environment Variables

### Backend (Railway)
```
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=<64-char-random-string>
FRONTEND_URL=https://yourdomain.com
PORT=4000
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

---

## Local Development with Production DB

To test production configuration locally:

```bash
# 1. Copy env file
cd backend
cp .env .env.local

# 2. Edit .env.local with production values

# 3. Push schema to production DB
npx prisma db push

# 4. Run migrations (if any)
npx prisma migrate deploy

# 5. Start backend
npm run start:dev

# 6. Start frontend (separate terminal)
cd ../frontend
npm run dev
```

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Railway matches your Vercel domain exactly
- Include protocol (`https://`) and no trailing slash

### Database Connection Failed
- Check Neon connection string format
- Whitelist Railway's IPs (or use connection pooling)
- Ensure Neon project is not paused

### Build Failed on Vercel
- Check build logs in Vercel dashboard
- Ensure `frontend` directory has its own `package.json`
- Verify `NEXT_PUBLIC_API_URL` is set

### 502 Bad Gateway (Railway)
- Backend crashed - check Railway logs
- Usually means `DATABASE_URL` or `JWT_SECRET` is missing
- Application might need more memory (upgrade plan)

---

## Monitoring & Maintenance

### Health Check Endpoint
Your backend should respond at: `https://api.yourdomain.com/api/health`

### Useful Commands
```bash
# Check backend logs on Railway
railway logs -p <project-id>

# Connect to production DB (Neon)
psql "postgresql://user:pass@host/dbname"

# Reset migrations (DANGER!)
npx prisma migrate reset
```

### Uptime Monitoring (Free)
- Use https://uptimerobot.com
- Monitor both frontend and backend endpoints
- Set up alerts for downtime

---

## Cost Summary (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Railway | Starter | $5 |
| Neon | Free | $0 |
| Domain | .com | $1 |
| **Total** | | **$6/month** |
