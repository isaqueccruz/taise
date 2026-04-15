# 🎂 Taise Sena Confeitaria - Versão Standalone

Site profissional para confeitaria com painel administrativo, gerenciamento de produtos e integração com Supabase.

## ✨ Funcionalidades

- 🏠 **Homepage elegante** com hero section e produtos em destaque
- 📦 **Catálogo de produtos** com filtros por categoria
- 🛒 **Detalhes do produto** com imagens e informações
- 📧 **Formulário de contato** com notificações
- 👤 **Painel administrativo** para gerenciar produtos e categorias
- 🔐 **Autenticação** com login/senha pré-definido
- 📱 **Design responsivo** para mobile e desktop
- 💾 **Banco de dados** Supabase (PostgreSQL)
- 🚀 **Pronto para Vercel** (deploy em nuvem)

## 🛠️ Tecnologias

- **Frontend**: React 19 + Tailwind CSS + TypeScript
- **Backend**: Express.js + tRPC
- **Banco de Dados**: Supabase (PostgreSQL)
- **Build**: Vite
- **Hospedagem**: Vercel

## 📖 Guias

- **[GUIA_SETUP_WINDOWS.md](./GUIA_SETUP_WINDOWS.md)** - Passo a passo completo para Windows 11
- **[.env.example](./.env.example)** - Variáveis de ambiente necessárias

## 🚀 Quick Start

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

### 3. Rodar Localmente
```bash
pnpm dev
```

Acesse: http://localhost:3000

### 4. Login
- **Usuário**: `admin`
- **Senha**: `admin123`

## 📋 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas do site
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── App.tsx        # Rotas principais
│   └── index.html         # HTML principal
├── server/                # Backend Express
│   ├── routers.ts         # Endpoints tRPC
│   ├── db.ts              # Queries do banco de dados
│   └── _core/             # Configurações internas
├── drizzle/               # Schema do banco de dados
│   └── schema.ts          # Definição das tabelas
├── api/                   # Handler para Vercel
│   └── index.ts           # Função serverless
├── .env.example           # Variáveis de exemplo
├── GUIA_SETUP_WINDOWS.md  # Guia em português
└── package.json           # Dependências do projeto
```

## 🔑 Credenciais Padrão

Após criar as tabelas no Supabase, use:
- **Usuário**: `admin`
- **Senha**: `admin123`

⚠️ **Importante**: Mude a senha após o primeiro login!

## 🌐 Deploy na Vercel

1. Faça push do código para GitHub
2. Conecte seu repositório na Vercel
3. Configure a variável `DATABASE_URL` com sua URL do Supabase
4. Clique "Deploy"

Seu site estará online em minutos!

## 📞 Suporte

Para dúvidas sobre:
- **Setup**: Veja [GUIA_SETUP_WINDOWS.md](./GUIA_SETUP_WINDOWS.md)
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **React**: https://react.dev

## 📝 Licença

MIT - Sinta-se livre para usar e modificar!

---

**Desenvolvido para Taise Sena Confeitaria** 🎂✨
