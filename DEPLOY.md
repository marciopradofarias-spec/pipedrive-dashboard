# 🚀 Guia de Deploy no Vercel

## Passo 1: Criar Repositório no GitHub

### Opção A: Via GitHub CLI (gh)

```bash
# Autenticar no GitHub (se ainda não estiver)
gh auth login

# Criar repositório
cd /home/ubuntu/pipedrive-dashboard
gh repo create pipedrive-dashboard --public --source=. --remote=origin --push
```

### Opção B: Via Interface Web do GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `pipedrive-dashboard`
3. Descrição: "Dashboard em tempo real do Pipedrive para FiberSchool"
4. Visibilidade: Public ou Private (sua escolha)
5. Clique em "Create repository"

6. No terminal, execute:
```bash
cd /home/ubuntu/pipedrive-dashboard
git remote add origin https://github.com/SEU_USUARIO/pipedrive-dashboard.git
git push -u origin main
```

## Passo 2: Deploy no Vercel

### 1. Acessar Vercel
- Vá para https://vercel.com
- Faça login com sua conta GitHub

### 2. Importar Projeto
- Clique em "Add New..." → "Project"
- Selecione o repositório `pipedrive-dashboard`
- Clique em "Import"

### 3. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

| Nome | Valor |
|------|-------|
| `PIPEDRIVE_API_TOKEN` | `fc293978252e0461bd238084fcaf152bd9d415d3` |
| `PIPEDRIVE_BASE_URL` | `https://fiberschool.pipedrive.com` |
| `TIMEZONE` | `America/Sao_Paulo` |
| `MARCIO_USER_ID` | `14466882` |
| `NEXT_PUBLIC_APP_NAME` | `Pipedrive Dashboard - FiberSchool` |

### 4. Deploy
- Clique em "Deploy"
- Aguarde 2-3 minutos
- Seu dashboard estará disponível em: `https://pipedrive-dashboard-xxx.vercel.app`

## Passo 3: Configurar Domínio Customizado (Opcional)

1. Na dashboard do Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio (ex: `dashboard.fiberschool.com.br`)
3. Configure os DNS conforme instruções do Vercel
4. Aguarde propagação (pode levar até 48h)

## 🔄 Deploy Automático

Após o setup inicial, cada `git push` para a branch `main` fará deploy automático:

```bash
# Fazer alterações
git add .
git commit -m "Descrição das alterações"
git push origin main

# O Vercel detecta automaticamente e faz deploy
```

## 🔍 Verificar Deploy

Após o deploy, teste:
- ✅ Dashboard principal carrega
- ✅ Métricas aparecem corretamente
- ✅ Gráficos são renderizados
- ✅ Navegação entre páginas funciona
- ✅ Dados do Pipedrive são buscados

## 🐛 Troubleshooting

### Dashboard não carrega
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o token da API do Pipedrive é válido
- Veja os logs no Vercel: Settings → Logs

### Erro 500
- Verifique os logs de função no Vercel
- Confirme se a API do Pipedrive está respondendo
- Teste a API manualmente: `https://fiberschool.pipedrive.com/api/v1/deals?api_token=SEU_TOKEN`

### Dados não aparecem
- Aguarde o cache expirar (5 minutos)
- Force refresh: Ctrl+F5 ou Cmd+Shift+R
- Verifique se há negócios no Pipedrive

## 📊 Monitoramento

### Analytics do Vercel
- Acesse "Analytics" no painel do Vercel
- Veja métricas de uso, performance e erros

### Logs
- Acesse "Logs" no painel do Vercel
- Filtre por tipo: Build, Function, Static

## 🔒 Segurança

### Proteger com Senha (Opcional)
1. No Vercel, vá em "Settings" → "Environment Variables"
2. Adicione `VERCEL_PASSWORD=sua_senha_aqui`
3. No código, adicione middleware de autenticação

### Limitar Acesso por IP (Pro)
- Disponível apenas no plano Pro do Vercel
- Settings → Firewall → IP Allowlist

## 📱 Preview Deployments

O Vercel cria previews automáticos para cada Pull Request:
- Crie uma branch: `git checkout -b feature/nova-funcionalidade`
- Faça commit e push: `git push origin feature/nova-funcionalidade`
- Abra PR no GitHub
- Vercel cria preview automático com URL única

## 🎯 Próximos Passos

Após o deploy:
1. ✅ Teste todas as páginas
2. ✅ Configure domínio customizado
3. ✅ Adicione ao favoritos da equipe
4. ✅ Configure notificações de deploy
5. ✅ Monitore uso e performance

---

**Desenvolvido por Manus AI para FiberSchool** 🚀

