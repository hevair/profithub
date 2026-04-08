# 🔐 GitHub Secrets Guide

Este guia explica como configurar os secrets necessários para o CI/CD pipeline.

## Secrets Necessários

### 1. Railway (Backend Deploy)

1. Instale Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Gere o token:
   ```bash
   railway token
   ```

4. Adicione no GitHub:
   - Repo → Settings → Secrets → Actions
   - New repository secret
   - Name: `RAILWAY_TOKEN`
   - Value: (token gerado acima)

### 2. Vercel (Frontend Deploy)

1. Crie um token em: https://vercel.com/account/tokens
   - Name: `profithub-deploy`
   - Scope: Full Account

2. Obtenha Organization ID:
   ```bash
   npm i -g vercel
   vercel link
   vercel teams list
   ```

3. Obtenha Project ID:
   ```bash
   vercel project ls
   ```

4. Adicione no GitHub:
   - `VERCEL_TOKEN` = seu token
   - `VERCEL_ORG_ID` = `team_xxx`
   - `VERCEL_PROJECT_ID` = `prj_xxx`

## Como Adicionar Secrets

1. Vá para: `https://github.com/seu-user/profithub/settings/secrets/actions`

2. Clique "New repository secret"

3. Adicione cada um:
   ```
   RAILWAY_TOKEN = rw_xxxxx
   VERCEL_TOKEN = xxxx
   VERCEL_ORG_ID = team_xxxxx
   VERCEL_PROJECT_ID = prj_xxxxx
   ```

## Alternativa: Deploy Manual

Se preferir fazer deploy manual (sem CI/CD):

### Backend (Railway)
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Deploy
railway up
```

### Frontend (Vercel)
```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```
