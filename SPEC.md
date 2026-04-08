# SPEC.md — SaaS de Gestão de Lucro para Marketplace

> **Nome do Projeto:** ProfitHub (nome sugerido)
> **Versão:** 1.0.0
> **Data:** 07/04/2026
> **Status:** Draft

---

## 1. Visão Geral

**Problema:** Vendedores online e de estabelecimento físico não sabem o lucro real de suas vendas, pois não consideram taxas, frete e outros custos.

**Solução:** SaaS multi-tenant que calcula automaticamente o lucro de cada venda, controla estoque e envia alertas inteligentes.

**Público-alvo:** Vendedores iniciantes e intermediários que vendem online (e-commerce, redes sociais) ou em estabelecimento físico.

---

## 2. Arquitetura

### 2.1 Modelo Multi-Tenant

- **Tipo:** Tenant ID (mais simples e barato)
- **Estrutura:** 1 banco de dados, todos os dados filtrados por `tenant_id`

### 2.2 Diagrama de Entidades

```
User ─────┬───── belongs to ────► Tenant
          │
          └───── owns ───────────► Products
          │                        │
          │                        └──► Orders
          │
          └───── receives ────────► Alerts
```

### 2.3 Segurança

**OBRIGATÓRIO:** Toda query SQL deve conter `WHERE tenant_id = user.tenant_id`

---

## 3. Stack Tecnológica

### 3.1 Front-end

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| App Web | React + Next.js | SSR, SEO, performance |
| Mobile | Flutter (futuro) | Mobile-first |
| Estilização | Tailwind CSS | Produtividade |
| Estado | React Context / Zustand | Simplicidade |

### 3.2 Back-end

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| API | Node.js + NestJS | Estrutura profissional |
| Autenticação | JWT | Padrão industry |
| Validação | class-validator | Type safety |

### 3.3 Banco de Dados

| Tipo | Tecnologia |
|------|------------|
| Relational | PostgreSQL |
| ORM | Prisma |

---

## 4. Modelo de Dados

### 4.1 Schema do Banco

```prisma
model Tenant {
  id        String   @id @default(uuid())
  name      String
  plan      Plan     @default(FREE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users     User[]
  products  Product[]
  orders    Order[]
  alerts    Alert[]
}

enum Plan {
  FREE
  PRO
}

model User {
  id           String   @id @default(uuid())
  tenantId     String
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  tenant Tenant @relation(fields: [tenantId], references: [id])
}

model Product {
  id              String   @id @default(uuid())
  tenantId        String
  name            String
  costPrice       Decimal  @db.Decimal(10, 2)
  suggestedPrice  Decimal? @db.Decimal(10, 2)
  stock           Int      @default(0)
  lowStockAlert   Int      @default(5)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  tenant Tenant  @relation(fields: [tenantId], references: [id])
  orders  Order[]
}

model Order {
  id           String       @id @default(uuid())
  tenantId     String
  productId    String
  platform     Platform
  salePrice    Decimal      @db.Decimal(10, 2)
  shippingCost Decimal      @default(0) @db.Decimal(10, 2)
  fee          Decimal      @default(0) @db.Decimal(10, 2)
  profit       Decimal      @db.Decimal(10, 2)
  createdAt    DateTime     @default(now())
  
  tenant  Tenant  @relation(fields: [tenantId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

enum Platform {
  ONLINE
  ESTABLISHMENT
}

model Alert {
  id        String   @id @default(uuid())
  tenantId  String
  type      AlertType
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  tenant Tenant @relation(fields: [tenantId], references: [id])
}

enum AlertType {
  LOW_STOCK
  LOW_MARGIN
  NO_STOCK
}
```

---

## 5. Regras de Negócio

### 5.1 Cálculo de Lucro

```
profit = sale_price - (cost_price + fee + shipping_cost)
```

### 5.2 Baixa de Estoque

Ao criar um pedido: `stock = stock - 1`

### 5.3 Alertas Automáticos

| Condição | Tipo de Alerta | Mensagem |
|----------|----------------|----------|
| `stock < 5` | LOW_STOCK | "Produto {nome} com estoque baixo: {stock} unidades" |
| `profit < 0` | LOW_MARGIN | "Produto {nome} está dando prejuízo de R$ {valor}" |

### 5.4 Plano Free vs Pro

| Recurso | Free | Pro |
|---------|------|-----|
| Produtos | 50 | Ilimitado |
| Pedidos/mês | 100 | Ilimitado |
| Alertas | 10/mês | Ilimitado |
| Relatórios | Básico | Completo |

---

## 6. API Endpoints

### 6.1 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Cadastro de usuário + tenant |
| POST | `/auth/login` | Login, retorna JWT |

**POST /auth/register**
```json
Request:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "tenantName": "string"
}

Response:
{
  "accessToken": "string",
  "user": { "id": "string", "email": "string", "name": "string" }
}
```

**POST /auth/login**
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "accessToken": "string",
  "user": { "id": "string", "email": "string", "name": "string" }
}
```

### 6.2 Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Listar produtos |
| GET | `/products/:id` | Detalhe do produto |
| POST | `/products` | Criar produto |
| PUT | `/products/:id` | Atualizar produto |
| DELETE | `/products/:id` | Deletar produto |

**POST /products**
```json
Request:
{
  "name": "string",
  "costPrice": 25.00,
  "suggestedPrice": 49.90,
  "stock": 100,
  "lowStockAlert": 5
}
```

### 6.3 Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/orders` | Listar pedidos |
| POST | `/orders` | Criar pedido |

**POST /orders**
```json
Request:
{
  "productId": "string",
  "platform": "ONLINE" | "ESTABLISHMENT",
  "salePrice": 59.90,
  "shippingCost": 8.50,
  "fee": 8.00
}

Response:
{
  "id": "string",
  "product": { "id": "string", "name": "string" },
  "platform": "ONLINE",
  "salePrice": 59.90,
  "shippingCost": 8.50,
  "fee": 8.00,
  "profit": 18.40,
  "createdAt": "2026-04-07T00:00:00Z"
}
```

> **Efeito colateral:** Ao criar pedido, decrementa `stock` do produto em 1.

### 6.4 Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/reports/dashboard` | KPIs principais |
| GET | `/reports/profit` | Lucro por período |
| GET | `/reports/products` | Ranking de produtos |

**GET /reports/dashboard**
```json
Response:
{
  "monthlyRevenue": 12500.00,
  "monthlyProfit": 3200.00,
  "totalOrders": 145,
  "lowStockProducts": 3,
  "recentOrders": [...],
  "recentAlerts": [...]
}
```

### 6.5 Alertas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/alerts` | Listar alertas |
| PUT | `/alerts/:id/read` | Marcar como lido |
| DELETE | `/alerts/:id` | Deletar alerta |

### 6.6 Configurações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/settings` | Ver configurações |
| PUT | `/settings` | Atualizar configurações |

---

## 7. Telas do App

### 7.1 Fluxo de Navegação

```
Login/Cadastro
    │
    ▼
Dashboard ◄──────────────────┐
    │                         │
    ├── Produtos ─────────────┼──► CRUD Produtos
    │                         │
    ├── Pedidos ──────────────┼──► Novo Pedido
    │                         │
    ├── Relatórios ──────────┼──► Gráficos/Lista
    │                         │
    ├── Alertas ─────────────┤
    │                         │
    └── Configurações ────────┘
```

### 7.2 Tela: Login/Cadastro

**Campos:**
- Email (obrigatório)
- Senha (mínimo 6 caracteres)
- Nome (opcional no cadastro)
- Nome da loja (no cadastro)

**Botão:** "Entrar" / "Criar conta"

**Link:** "Esqueci minha senha"

### 7.3 Tela: Dashboard

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Olá, {Nome}                    [Sair]     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Faturam. │ │  Lucro   │ │ Pedidos  │   │
│  │  R$ 12.5k│ │  R$ 3.2k │ │   145    │   │
│  │  Este mês│ │  Este mês│ │  Hoje: 5 │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Pedidos Recentes                   │   │
│  │  ├─ Camisa X - Online - R$ +18,40  │   │
│  │  ├─ Bermuda Y - Estabelecimento - R$ +12,30 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Alertas                            │   │
│  │  ⚠️ Camisa X com estoque baixo (3)  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 7.4 Tela: Produtos

**Lista:**
- Card com: Nome, Preço custo, Preço sugerido, Estoque
- Indicador visual de estoque baixo
- Botão: "+ Novo Produto"

**Formulário (Modal):**
```
Nome do produto: [____________]
Preço de custo:  [R$ _____,__]
Preço sugerido:   [R$ _____,__] (opcional)
Estoque atual:   [____]
Alertar quando estoque < [____]
                [Cancelar] [Salvar]
```

### 7.5 Tela: Pedidos

**Lista:**
- Filtro por período e plataforma
- Card com: Produto, Plataforma, Venda, Lucro (verde/vermelho)

**Formulário (Modal):**
```
Novo Pedido
─────────────────────────────────
Produto:      [Selecione ▼]
Plataforma:   [Online] [Estabelecimento]
Valor venda:  [R$ _____,__]
Frete:        [R$ _____,__]
Taxa:         [R$ _____,__]

         Lucro calculado: R$ +18,40
                [Cancelar] [Registrar]
```

### 7.6 Tela: Relatórios

**Abas:**
1. **Geral** - Faturamento, lucro, pedidos
2. **Por Produto** - Ranking de lucro/prejuízo
3. **Gráfico** - Evolução mensal

**Cards:**
- "Top 3 produtos mais lucrativos"
- "Produtos no vermelho" (se houver)

### 7.7 Tela: Alertas

**Lista:**
- Ícone + mensagem + data
- Botão: "Marcar como lido"
- Badge: "Novo" para não lidos

### 7.8 Tela: Configurações

**Seções:**
1. **Conta** - Nome, email
2. **Loja** - Nome da loja, plano
3. **Preferências** - Notificações

---

## 8. Landing Page

### 8.1 Estrutura

```
1. Hero
   ├─ Headline: "Descubra seu lucro real vendendo online ou em loja"
   ├─ Subheadline: "Controle suas vendas, calcule seu lucro e nunca mais trabalhe de graça"
   └─ CTA: "Testar grátis" → /register

2. Problema
   ├─ "Você vende, mas não sabe quanto ganha"
   ├─ "As taxas comem seu lucro sem você perceber"
   └─ "Você acha que lucra, mas na verdade empobrece"

3. Solução
   ├─ "Cálculo automático de lucro"
   ├─ "Controle de estoque simples"
   └─ "Alertas quando algo der errado"

4. Demonstração
   └─ GIF/vídeo do app (30-60s)

5. Como funciona (3 passos)
   ├─ 1. Cadastre seus produtos
   ├─ 2. Registre suas vendas
   └─ 3. Veja seu lucro real

6. Preços
   ├─ Free: R$ 0/mês
   │  └─ 50 produtos, 100 pedidos/mês
   └─ Pro: R$ 29/mês
      └─ Tudo ilimitado + relatórios avançados

7. FAQ (futuro)

8. CTA Final
   └─ "Comece agora. É grátis."
```

### 8.2 SEO

**Meta tags:**
```html
<title>ProfitHub - Descubra seu lucro real em vendas online e em estabelecimento</title>
<meta name="description" content="Controle suas vendas, calcule seu lucro e nunca mais trabalhe de graça vendendo online ou em loja física.">
```

**Keywords:** calculadora lucro vendas, controle vendas online, gestão financeira loja, controle estoque

---

## 9. UX/UI Guidelines

### 9.1 Princípios

- **Simplicidade:** Linguagem do usuário, não técnica
- **Visibilidade:** Resultados em destaque (não escondidos)
- **Feedback:** Confirmação visual de cada ação
- **Acessibilidade:** Contraste, fontes legíveis, touch-friendly

### 9.2 Linguagem

| ❌ Evitar | ✅ Usar |
|-----------|---------|
| "Custo unitário" | "Quanto você paga pelo produto" |
| "Margem de lucro" | "Quanto você ganha" |
| "Fee" | "Taxa da plataforma" |
| "Dashboard" | "Resumo" ou "Visão geral" |

### 9.3 Cores

| Uso | Cor | Hex |
|-----|-----|-----|
| Primária | Azul | #2563EB |
| Lucro positivo | Verde | #22C55E |
| Lucro negativo | Vermelho | #EF4444 |
| Alerta | Amarelo | #F59E0B |
| Fundo | Cinza claro | #F9FAFB |

### 9.4 Botões

- **Primário:** Fundo azul, texto branco, altura 48px mínimo
- **Secundário:** Borda azul, fundo transparente
- **Perigo:** Fundo vermelho (excluir, cancelar)

### 9.5 Formulários

- Labels acima dos inputs
- Placeholder com exemplo
- Erro em vermelho abaixo do campo
- Loading state no botão ao submeter

---

## 10. Roteiros de Divulgação

### 10.1 TikTok/Reels - Formato DOR

**Roteiro 1 - Choque:**
```
🎬 INÍCIO (Hook - 3s)
"Você acha que ganha R$20 vendendo por R$50... mas na real ganha R$5."

📱 MOSTRA TELA (10s)
Câmera no app mostrando cálculo real com taxas e frete.

🎤 ENCERRAMENTO (3s)
"Esse app calcula tudo pra você. Link na bio."
```

**Roteiro 2 - Problema:**
```
🎬 INÍCIO
"Se você vende online ou em loja e não sabe seu lucro real, você pode estar trabalhando de graça."

📱 MOSTRA
- "Taxas que você paga"
- "Frete que você paga"
- "Preço do produto"

🎤 CTA
"Baixa lá, é grátis."
```

**Roteiro 3 - Solução:**
```
🎬 INÍCIO
"Criei um app que resolve isso em 2 cliques."

📱 MOSTRA
- Cadastrar produto (3s)
- Registrar venda (3s)
- Ver lucro (3s)

🎤 CTA
"Testa aí, o link tá na bio."
```

### 10.2 YouTube Shorts

**Roteiro 4 - Educacional:**
```
🎬 "3 erros que fazem você PERDER dinheiro nas suas vendas:

1. Não calcular as taxas
2. Ignorar o custo do frete
3. Vender sem saber o preço certo

Neste vídeo eu te mostro como resolver..."
```

### 10.3 Instagram Carrossel

**Slide 1:** "Você sabe quanto ganha vendendo online ou na loja?"
**Slide 2:** "Olha só o que acontece com R$50 de venda:"
**Slide 3:** "- Taxas: -R$10"
**Slide 4:** "- Frete: -R$8"
**Slide 5:** "- Custo produto: -R$25"
**Slide 6:** "= Lucro: R$7 (não R$25!)"
**Slide 7:** "Link na bio para calcular seu lucro real"

---

## 11. Roadmap de Implementação

### Fase 1: MVP (2-3 semanas)
- [ ] Autenticação (registro/login)
- [ ] CRUD de produtos
- [ ] CRUD de pedidos com cálculo de lucro
- [ ] Dashboard básico
- [ ] Landing page simples

### Fase 2: Alerts (1 semana)
- [ ] Sistema de alertas automáticos
- [ ] Tela de alertas
- [ ] Marcar como lido

### Fase 3: Relatórios (1 semana)
- [ ] Dashboard com gráficos
- [ ] Relatório de lucro por produto
- [ ] Ranking

### Fase 4: Polish (1 semana)
- [ ] UX refinamentos
- [ ] Mobile responsive
- [ ] Otimização de performance
- [ ] SEO landing page

### Fase 5: Monetização (1 semana)
- [ ] Plano Free/Pro
- [ ] Limites de uso
- [ ] Checkout (Stripe/PicPay)

---

## 12. Glossário

| Termo | Definição |
|-------|-----------|
| Tenant | Empresa/loja que usa o sistema |
| Lucro | `sale_price - (cost + fee + shipping)` |
| Fee | Taxa cobrada pela plataforma (Online) ou custo operacional (Estabelecimento) |
| SKU | Código identificador do produto |
| Margem | Porcentagem do lucro sobre a venda |

---

## 13. Contato Suporte

- Email: suporte@profithub.com (placeholder)
- Horário: Seg-Sex 9h-18h (placeholder)

---

*Documento criado em 07/04/2026 - Versão 1.0*
