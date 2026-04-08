# 🚀 Setup Supabase - ProfitHub

## Passo 1: Criar Conta Supabase

1. Acesse: https://supabase.com
2. Clique **"Start your project"**
3. Login com **GitHub** (recomendado)
4. Não precisa de cartão de crédito!

---

## Passo 2: Criar Novo Projeto

1. Dashboard → **"New Project"**

2. Preencha:
   ```
   Name: profithub
   Database Password: [gerar senha forte - SALVE!]
   Region: São Paulo (sa-east-1) - mais perto de você
   Pricing: Free
   ```

3. Clique **"Create new project"**
4. Aguarde ~2 min para criar

---

## Passo 3: Obter Connection String

1. Vá em: **Settings** → **Database**

2. Role até **"Connection string"**

3. Copie o **URI** (formato PostgreSQL):
   ```
   postgresql://postgres.[your-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

   ⚠️ **Importante:**
   - Use a porta **6543** (pooler) ao invés de 5432
   - A senha é a que você definiu no passo 2

---

## Passo 4: Configurar no Backend

### 4.1 Variáveis de Ambiente (Local)

Crie arquivo `.env` na pasta `backend`:

```bash
# DATABASE - Cole sua connection string do Supabase
DATABASE_URL="postgresql://postgres.xxxxxx:senha@aws-0-xxxx.pooler.supabase.com:6543/postgres"

# JWT - Gere um token seguro
JWT_SECRET="cole-aqui-64-caracteres-aleatorios"

# FRONTEND - URL do frontend
FRONTEND_URL="http://localhost:3000"

# SERVER
PORT=4000
NODE_ENV=development
```

### 4.2 Gerar JWT_SECRET

```bash
# No terminal (pasta backend):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole como `JWT_SECRET`.

---

## Passo 5: Push Schema para Supabase

```bash
cd backend

# Gerar Prisma Client
npx prisma generate

# Criar tabelas no Supabase
npx prisma db push

# Verificar se funcionou
npx prisma studio
```

Se abriu o Prisma Studio com as tabelas, funcionou!

---

## Passo 6: Testar Localmente

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Teste: http://localhost:3000

---

## Passo 7: Criar Plano Inicial

Opcionalmente, você pode criar os planos padrão:

1. Supabase Dashboard → **SQL Editor**

2. Execute:
```sql
INSERT INTO "PlanConfig" (id, name, price, "maxProducts", "maxOrders", "maxAlerts", features, "order", active, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'FREE', 0, 50, 100, 10, '', 0, true, NOW(), NOW()),
  (gen_random_uuid(), 'PRO', 29, 999999, 999999, 999999, '', 1, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
```

---

## Passo 8: Configurar para Deploy

### Railway
```
DATABASE_URL = sua-connection-string-do-supabase
JWT_SECRET = seu-jwt-secret
FRONTEND_URL = https://seu-projeto.vercel.app
PORT = 4000
NODE_ENV = production
```

### Vercel
```
NEXT_PUBLIC_API_URL = https://seu-backend.railway.app/api
```

---

## 📊 Connection String Format

Supabase oferece 2 formatos:

### 1. Direct (sem pool - melhor para local)
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 2. Pooled (com pool - melhor para produção)
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Recomendado para produção:** Pooled (porta 6543)

---

## 🔧 Troubleshooting

### "Password authentication failed"

1. Verifique se a senha está correta
2. Em Supabase → Settings → Database → Reset password

### "Connection refused"

1. Verifique se o projeto está ativo
2. Supabase Dashboard → Settings → Health

### "Relation does not exist"

1. Execute: `npx prisma db push` novamente
2. Verifique se DATABASE_URL está correta

### "SSL connection required"

Adicione `?sslmode=require` no final da connection string:
```
...?sslmode=require
```

---

## ✅ Checklist

- [ ] Conta Supabase criada
- [ ] Projeto "profithub" criado
- [ ] Connection string copiada
- [ ] .env configurado
- [ ] Schema push executado
- [ ] Backend testado localmente
- [ ] Planos criados (opcional)

---

## 💰 Custos

| Recurso | Free Limit | Custo Extra |
|---------|------------|-------------|
| Database | 500 MB | $5/500 MB |
| API Requests | 60k/month | $25/milhão |
| Realtime | 100 concurrent | $100/500 concurrent |
| Storage | 1 GB | $1/GB |

**Para MVP:** 100% gratuito

---

## 📁 Arquivos Atualizados

```
backend/
├── prisma/schema.prisma    ← PostgreSQL (não SQLite)
├── .env                    ← Configurar com Supabase
└── .env.production         ← Para deploy
```

---

## Próximo Passo

Deploy backend no Railway:
```
railway.app → New Project → Deploy from GitHub
```
