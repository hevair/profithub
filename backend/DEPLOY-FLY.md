# ============================================
# Deploy Backend - Fly.io (100% Grátis)
# ============================================

## 1. Instalar Fly CLI

Windows (com PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

Ou com Docker:
```bash
# Instalar Docker primeiro
docker pull flyio/flyctl
alias fly='docker run --rm -v $HOME/.fly:/app -w /app flyio/flyctl
```

## 2. Login

```bash
fly auth login
```

## 3. Criar App

```bash
cd backend

# Criar app no Fly.io
fly apps create profithub-api

# Configurar secrets
fly secrets set DATABASE_URL="sua-connection-string-supabase"
fly secrets set JWT_SECRET="seu-jwt-secret-64-chars"
fly secrets set FRONTEND_URL="https://seudominio.vercel.app"
fly secrets set NODE_ENV="production"
```

## 4. Deploy

```bash
# Fazer deploy
fly deploy

# Ver logs
fly logs

# Ver status
fly status
```

## 5. Configurar Domínio (opcional)

```bash
fly certs create api.seudominio.com
fly certs show api.seudominio.com
# Adicionar registros DNS mostrados
```

---

## Comandos Úteis

```bash
# Abrir no navegador
fly open

# Restart
fly restart

# Escalar (mudar recursos)
fly scale memory 512

# Ver métricas
fly metrics

# Destruir app
fly destroy profithub-api
```

---

## ⚠️ Primeira Vez

Na primeira vez, o Fly.io vai perguntar:
- Region: Escolha `São Paulo (gru)` ou mais próxima
- Want to deploy now?: `yes`

---

## Custo

| Recurso | Free Limit |
|---------|------------|
| VMs | 3 shared |
| Storage | 10 GB |
| Bandwidth | 160 GB/mês |
| **Total** | **Grátis** |

---

## Solução de Problemas

### "App name already taken"
```bash
# Escolha outro nome
fly apps create profithub-api-xyz
```

### Build failed
```bash
# Ver logs
fly logs

# Rebuild manual
fly deploy --no-cache
```

### Connection string error
```bash
# Ver secrets configurados
fly secrets list

# Remover e adicionar novamente
fly secrets set DATABASE_URL="..."
```
