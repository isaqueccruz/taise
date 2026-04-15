# ✅ Checklist Rápido - Taise Sena Confeitaria

Use este checklist para não esquecer nenhuma etapa!

## 📥 Fase 1: Download e Preparação

- [ ] Baixei o arquivo `taise-confeitaria-standalone.zip`
- [ ] Extraí a pasta em `C:\Projetos\taise-confeitaria`
- [ ] Instalei Node.js (versão LTS)
- [ ] Instalei Git
- [ ] Instalei pnpm (`npm install -g pnpm`)

## 🗄️ Fase 2: Supabase

- [ ] Criei conta no Supabase (https://supabase.com)
- [ ] Criei novo projeto chamado `taise-confeitaria`
- [ ] Copiei a Connection String (URL do banco de dados)
- [ ] Criei as tabelas (SQL no Supabase)
- [ ] Inseri o usuário admin padrão

## 💻 Fase 3: Configuração Local

- [ ] Abri PowerShell na pasta do projeto
- [ ] Executei `pnpm install`
- [ ] Criei arquivo `.env` na raiz do projeto
- [ ] Colei a URL do Supabase no `.env`
- [ ] Salvei o arquivo `.env`

## 🚀 Fase 4: Teste Local

- [ ] Executei `pnpm dev`
- [ ] Acessei `http://localhost:3000` no navegador
- [ ] Fiz login com `admin` / `admin123`
- [ ] Testei adicionar um produto
- [ ] Testei o formulário de contato
- [ ] Parei o servidor (Ctrl + C)

## 🌐 Fase 5: GitHub

- [ ] Criei repositório no GitHub chamado `taise-confeitaria`
- [ ] Executei `git init` na pasta do projeto
- [ ] Executei `git add .`
- [ ] Executei `git commit -m "Primeiro commit"`
- [ ] Executei `git push` para enviar ao GitHub

## 🚀 Fase 6: Vercel

- [ ] Acessei https://vercel.com
- [ ] Cliquei "New Project"
- [ ] Selecionei meu repositório GitHub
- [ ] Configurei a variável `DATABASE_URL`
- [ ] Cliquei "Deploy"
- [ ] Aguardei o deploy terminar
- [ ] Acessei o link do site online

## 🎉 Pronto!

Seu site está funcionando em:
- ✅ Local: `http://localhost:3000`
- ✅ Online: `https://seu-projeto.vercel.app`

---

## 🆘 Se Algo Deu Errado

1. **Erro ao instalar**: Execute `pnpm install` novamente
2. **Porta 3000 em uso**: Feche outros programas ou use outra porta
3. **Erro de banco de dados**: Verifique a URL do Supabase no `.env`
4. **Erro no deploy**: Verifique as variáveis de ambiente na Vercel

Consulte **GUIA_SETUP_WINDOWS.md** para mais detalhes!

---

**Parabéns! Você conseguiu! 🎂✨**
