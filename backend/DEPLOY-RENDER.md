# ============================================
# Deploy Backend - Render (100% Grátis)
# ============================================

## Passo 1: Criar Conta

1. Acesse: https://render.com
2. "Sign up" → GitHub
3. Não precisa de cartão de crédito!

---

## Passo 2: Novo Web Service

1. Dashboard → "New +" → "Web Service"
2. Connect seu repositório GitHub
3. Configure:

```
Root Directory: backend

Build Command: npm install && npm run build
Start Command: node dist/main.js

Environment: Node
Plan: Free
```

---

## Passo 3: Variáveis de Ambiente

Adicione em "Environment":

```
DATABASE_URL = postgresql://postgres.xxx@aws-0.pooler.supabase.com:6543/postgres
JWT_SECRET = (gere abaixo)
FRONTEND_URL = https://seudominio.vercel.app
NODE_ENV = production
PORT = 4000
```

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Passo 4: Deploy

1. "Create Web Service"
2. Aguardar build (~3-5 min)
3. Verificar em Logs

---

## Passo 5: Testar

```
https://seudominio.onrender.com/api/health
```

---

## Comandos Úteis

```bash
# Deploy manual
git push origin main

# Ver logs
Dashboard → Your Service → Logs

# Restart
Dashboard → Your Service → ... → Manual Deploy → Clear cache and deploy
```

---

## ⚠️ Limitação Free

```
⚠️ App dorme após 15 min inativo
⚠️ Próximo acesso: ~30-60s para acordar
⚠️ 750 horas/mês total

💡 Solução: Manter ativo com uptime monitoring
→ uptime.com ou similar
```

---

## Custos

| Plano | Custo |
|-------|-------|
| Free | R$ 0 |
| Starter | $7/mês |

---

## Troubleshooting

### Build Failed
```
✅ Verificar build command
✅ Verificar package.json scripts
✅ Verificar NODE_ENV=production
```

### "Connection refused"
```
✅ DATABASE_URL correto?
✅ Supabase está ativo?
```

### App não inicia
```
✅ Verificar Start Command: node dist/main.js
✅ Verificar PORT configurado
✅ Verificar logs
```
