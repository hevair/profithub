# 🚀 Deploy 100% Gratuito - ProfitHub

## 🎯 Stack Recomendada (Gratuita)

| Serviço | Uso | Free Limit | Por que usar |
|---------|-----|------------|--------------|
| **Supabase** | PostgreSQL | 500 MB, 60k API/mês | Não pausa, Auth built-in |
| **Railway.app** | Backend | 500h/mês trial | Fácil deploy, pool incluso |
| **Vercel.com** | Frontend | 100GB/mês | CDN global, deploy rápido |

**Custo total: R$ 0** (trial + free tiers)

---

## Opção 1: Supabase + Railway + Vercel ⭐ (Recomendado)

### Step 1: Supabase - Banco de Dados

1. **Criar conta**
   ```
   https://supabase.com → Sign up with GitHub
   ```

2. **Criar projeto**
   - Name: `profithub`
   - Region: `sa-east-1` (São Paulo)
   - Password: [senha forte - SALVE!]
   - Pricing: Free

3. **Obter connection string**
   - Settings → Database → Connection string
   - Copiar URI (formato pooling - porta 6543):
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

   ⚠️ **Importante:**
   - Use a porta **6543** (connection pooler)
   - A senha é a definida no passo 2

---

### Step 2: Railway - Backend

1. **Criar conta**
   ```
   https://railway.app → Sign up with GitHub
   ```
   - Você recebe $5 de créditos + 500h trial

2. **Criar projeto**
   - "New Project" → "Deploy from GitHub"
   - Selecionar repo `profithub`
   - Root Directory: `backend`

3. **Configurar variáveis**
   ```
   DATABASE_URL = postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   JWT_SECRET = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   FRONTEND_URL = https://seudominio.vercel.app
   PORT = 4000
   NODE_ENV = production
   ```

4. **Deploy automático**
   - Railway detecta NestJS
   - Aguardar 2-5 min

5. **Testar health check**
   ```
   https://seu-app.up.railway.app/api/health
   ```

---

### Step 3: Vercel - Frontend

1. **Criar conta**
   ```
   https://vercel.com → Sign up with GitHub
   ```

2. **Deploy**
   - "Add New" → "Project"
   - Selecionar repo `profithub`
   - Root Directory: `frontend`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL = https://seu-app.up.railway.app/api
     ```
   - "Deploy"

---

## Opção 2: Neon + Railway + Vercel

Se Supabase não funcionar, use **Neon.tech**:

### Neon Setup

1. **Criar conta**: https://neon.tech

2. **Projeto**:
   - Name: `profithub`
   - Region: `sa-east-1`
   - Compute: Free tier

3. **Connection string**:
   ```
   postgresql://user:pass@ep-xxx.sa-east-1.aws.neon.tech/profithub?sslmode=require
   ```

⚠️ **Limitação:** Neon free **pausa após 5 dias de inatividade**

---

## Opção 3: Render + Vercel (Alternativa)

Se Railway não funcionar:

### Render Setup

1. **Criar conta**: https://render.com

2. **Web Service**:
   - Connect repo `profithub/backend`
   - Build: `npm run build`
   - Start: `node dist/main.js`
   - Instance: Free (dorme após 15min)

---

## Configuração Local (para testes)

### 1. Clone o projeto
```bash
git clone https://github.com/seu-user/profithub.git
cd profithub
```

### 2. Configure .env
```bash
cd backend
cp .env.example .env
# Edite .env com sua connection string do Supabase
```

### 3. Gere JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Cole o resultado como JWT_SECRET
```

### 4. Deploy Schema
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Teste localmente
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev
```

---

## Troubleshooting

### CORS Error
```
✅ FRONTEND_URL deve ter https:// (sem / no final)
✅ Verificar no Railway: Settings → Variables
```

### Database Connection Failed
```
✅ Verificar connection string
✅ Usar porta 6543 (pooled) para Supabase
✅ Verificar se senha está correta
```

### Build Failed
```
✅ Verificar DATABASE_URL configurado
✅ Verificar logs no Railway
✅ Verificar NODE_ENV=production
```

---

## 💰 Custos Reais

### Mês 1 (Trial)
| Serviço | Custo |
|---------|-------|
| Supabase | R$ 0 |
| Railway | R$ 0 (trial) |
| Vercel | R$ 0 |
| **Total** | **R$ 0** |

### Após Trial
| Serviço | Plano | Custo |
|---------|-------|-------|
| Supabase | Free | R$ 0 |
| Railway | Starter | R$ 5/mês |
| Vercel | Hobby | R$ 0 |
| **Total** | | **R$ 5/mês** |

---

## 📊 Comparativo Free Tiers

| Critério | Supabase | Neon | Railway DB |
|----------|----------|------|------------|
| **Storage** | 500 MB | 3 GB | 1 GB |
| **Não pausa** | ✅ | ❌* | ✅ |
| **Connection Pool** | ✅ | ✅ | ✅ |
| **Auth built-in** | ✅ | ❌ | ❌ |
| **Setup** | Fácil | Médio | Fácil |

*Neon pausa após 5 dias de inatividade

---

## 📁 Arquivos Preparados

```
backend/
├── prisma/schema.prisma      ← PostgreSQL (atualizado)
├── .env.production           ← Para Railway
├── .env.example              ← Exemplo
└── railway.json             ← Deploy config

frontend/
├── .env.production          ← Para Vercel
└── vercel.json              ← Deploy config

Raiz:
├── SETUP-SUPABASE.md        ← Guia Supabase
├── DEPLOY-CHECKLIST.md      ← Checklist resumido
└── DEPLOY-FREE.md           ← Este arquivo
```
