# Pipedrive Dashboard - FiberSchool

Dashboard em tempo real para análise de vendas, pipeline e performance da equipe comercial da FiberSchool, integrado com a API do Pipedrive.

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- Cards de métricas principais (Novos negócios, Ganhos, Perdidos, Reuniões)
- Performance mensal com estatísticas detalhadas por vendedor e pipeline
- Gráficos interativos (Vendas por Vendedor, Vendas por Pipeline)
- Pipeline de fechamento com oportunidades ativas

### 💰 Vendas
- Lista detalhada de negócios com filtros por status e período
- Métricas de valor total e ticket médio
- Tabela interativa com todos os negócios

### 📈 Pipeline
- Funil de vendas visual
- Análise detalhada por etapa do pipeline
- Métricas de oportunidades ativas

### 📅 Reuniões
- Total de reuniões agendadas (histórico e recentes)
- Reuniões criadas e atualizadas no mês
- Métricas de no-show e reuniões realizadas com sucesso

### 👥 Vendedores
- Ranking mensal com pódio (🥇🥈🥉)
- Gráficos de performance individual
- Estatísticas detalhadas por vendedor

## 🛠️ Tecnologias

- **Framework:** Next.js 15 com TypeScript
- **UI:** Material-UI (MUI)
- **Gráficos:** Recharts
- **API:** Pipedrive REST API
- **Deploy:** Vercel

## 📦 Instalação Local

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Editar .env.local com suas credenciais

# Iniciar servidor de desenvolvimento
pnpm dev
```

## 🌐 Deploy no Vercel

### 1. Criar Repositório no GitHub

```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit: Pipedrive Dashboard"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU_USUARIO/pipedrive-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:
   - `PIPEDRIVE_API_TOKEN`: fc293978252e0461bd238084fcaf152bd9d415d3
   - `PIPEDRIVE_BASE_URL`: https://fiberschool.pipedrive.com
   - `TIMEZONE`: America/Sao_Paulo
   - `MARCIO_USER_ID`: 14466882

5. Clique em "Deploy"

### 3. Deploy Automático

Após o setup inicial, cada push para a branch `main` fará deploy automático no Vercel.

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Pipedrive API Configuration
PIPEDRIVE_API_TOKEN=fc293978252e0461bd238084fcaf152bd9d415d3
PIPEDRIVE_BASE_URL=https://fiberschool.pipedrive.com
NEXT_PUBLIC_APP_NAME=Pipedrive Dashboard - FiberSchool

# Timezone
TIMEZONE=America/Sao_Paulo

# Marcio User ID (to exclude from reports)
MARCIO_USER_ID=14466882
```

## ⚡ Performance

- **Cache:** Os dados são cacheados por 5 minutos para melhor performance
- **Atualização Automática:** O dashboard se atualiza automaticamente a cada 5 minutos
- **Loading States:** Indicadores de carregamento em todas as páginas

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 👨‍💻 Desenvolvido por

Manus AI - Dashboard criado para FiberSchool

