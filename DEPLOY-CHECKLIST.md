# 🚀 Deploy ProfitHub - 100% Gratuito

## Stack

| Serviço | Uso | Custo |
|---------|-----|-------|
| **Supabase** | PostgreSQL | Grátis |
| **Render** | Backend NestJS | Grátis |
| **Vercel** | Frontend Next.js | Grátis |

---

## Fase 1: Supabase (já feito ✅)

---

## Fase 2: Render Backend

### 2.1 Criar conta
```
https://render.com → GitHub
```

### 2.2 Novo Web Service
```
Dashboard → New → Web Service
→ Connect repo profithub
→ Root Directory: backend
```

### 2.3 Configurar
```
Build Command: npm install && npm run build
Start Command: node dist/main.js
Plan: Free
```

### 2.4 Variáveis
```
DATABASE_URL = sua-uri-supabase
JWT_SECRET = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
FRONTEND_URL = https://xxx.vercel.app
NODE_ENV = production
PORT = 4000
```

### 2.5 Deploy
```
Create Web Service → Aguardar ~5 min
Testar: https://xxx.onrender.com/api/health
```

---

## Fase 3: Vercel Frontend

### 3.1 Criar conta
```
https://vercel.com → GitHub
```

### 3.2 Deploy
```
New Project → Import profithub
Root Directory: frontend
```

### 3.3 Variáveis
```
NEXT_PUBLIC_API_URL = https://xxx.onrender.com/api
```

### 3.4 Deploy
```
Deploy → Aguardar ~2 min
```

---

## ✅ Testar

```
□ https://xxx.vercel.app (frontend)
□ https://xxx.onrender.com/api/health (backend)
□ Login funciona
□ Criar produto funciona
□ Registrar pedido funciona
```

---

## 💰 Custo Total

| Mês | Total |
|-----|-------|
| 1 | R$ 0 |
| 2+ | R$ 0 |
