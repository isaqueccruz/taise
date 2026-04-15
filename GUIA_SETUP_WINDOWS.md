# 🎂 Guia Completo: Taise Sena Confeitaria - Setup no Windows 11

## Bem-vindo! 👋

Este guia vai te ensinar, passo a passo, como colocar o site da confeitaria funcionando no seu computador e depois na Vercel. **Não precisa saber programação!**

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Passo 1: Instalar Ferramentas](#passo-1-instalar-ferramentas)
3. [Passo 2: Configurar Supabase](#passo-2-configurar-supabase)
4. [Passo 3: Preparar o Projeto](#passo-3-preparar-o-projeto)
5. [Passo 4: Rodar Localmente](#passo-4-rodar-localmente)
6. [Passo 5: Deploy na Vercel](#passo-5-deploy-na-vercel)

---

## Pré-requisitos

Você vai precisar de:
- ✅ Windows 11
- ✅ Conta no Supabase (grátis) - https://supabase.com
- ✅ Conta na Vercel (grátis) - https://vercel.com
- ✅ Conta no GitHub (grátis) - https://github.com

---

## Passo 1: Instalar Ferramentas

### 1.1 Instalar Node.js

1. Acesse: https://nodejs.org
2. Clique em "LTS" (versão recomendada)
3. Baixe o instalador para Windows
4. Execute o instalador e siga as instruções (clique "Next" em tudo)
5. Abra o **PowerShell** (pesquise "PowerShell" no Windows)
6. Digite:
   ```
   node --version
   npm --version
   ```
   Se aparecer números de versão, está instalado! ✅

### 1.2 Instalar Git

1. Acesse: https://git-scm.com/download/win
2. Baixe o instalador
3. Execute e siga as instruções (clique "Next" em tudo)
4. No PowerShell, digite:
   ```
   git --version
   ```
   Se aparecer a versão, está instalado! ✅

### 1.3 Instalar pnpm (gerenciador de pacotes)

No PowerShell, digite:
```
npm install -g pnpm
```

Depois verifique:
```
pnpm --version
```

---

## Passo 2: Configurar Supabase

### 2.1 Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em "Sign Up" e crie sua conta (ou faça login se já tiver)
3. Clique em "New Project"
4. Preencha:
   - **Project name**: `taise-confeitaria`
   - **Database password**: Crie uma senha forte (ex: `Abc123!@#Senha`)
   - **Region**: Escolha `South America (São Paulo)` se possível
5. Clique "Create new project" e aguarde (pode levar alguns minutos)

### 2.2 Pegar a Connection String

1. No Supabase, vá para **Settings** → **Database**
2. Procure por "Connection string" e copie a URL que começa com `postgresql://`
3. **Substitua** `[YOUR-PASSWORD]` pela senha que você criou no passo anterior
4. **Guarde essa URL** - você vai precisar dela!

Exemplo (não é real):
```
postgresql://postgres:Abc123!@#Senha@db.supabaseproject.com:5432/postgres
```

### 2.3 Criar as Tabelas

1. No Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Cole este código:

```sql
-- Criar tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(320) UNIQUE NOT NULL,
  name TEXT,
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de categorias
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  slug VARCHAR(128) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category_id INTEGER NOT NULL,
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  servings VARCHAR(64),
  ingredients TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de mensagens de contato
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(32),
  subject VARCHAR(256),
  message TEXT NOT NULL,
  product_id INTEGER,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário admin padrão (username: admin, password: admin123)
INSERT INTO users (username, password, email, name, role) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin@confeitaria.com', 'Administrador', 'admin');

-- Inserir categorias de exemplo
INSERT INTO categories (name, slug, description) VALUES
('Bolos', 'bolos', 'Bolos artesanais deliciosos'),
('Cupcakes', 'cupcakes', 'Cupcakes personalizados'),
('Docinhos', 'docinhos', 'Docinhos finos para eventos'),
('Tortas', 'tortas', 'Tortas especiais'),
('Brigadeiros', 'brigadeiros', 'Brigadeiros gourmet');
```

4. Clique em "Run" (ou Ctrl+Enter)
5. Pronto! As tabelas foram criadas! ✅

---

## Passo 3: Preparar o Projeto

### 3.1 Baixar os Arquivos

1. Crie uma pasta no seu computador: `C:\Projetos\taise-confeitaria`
2. Coloque todos os arquivos do projeto nessa pasta

### 3.2 Abrir PowerShell na Pasta

1. Abra a pasta `C:\Projetos\taise-confeitaria`
2. Clique na barra de endereço (onde escreve o caminho)
3. Escreva `powershell` e pressione Enter
4. Uma janela preta (PowerShell) vai abrir

### 3.3 Instalar Dependências

No PowerShell, digite:
```
pnpm install
```

Isso vai baixar todos os pacotes necessários (pode levar alguns minutos).

### 3.4 Criar Arquivo .env

1. Na pasta do projeto, crie um arquivo chamado `.env`
2. Abra com o Bloco de Notas
3. Cole isto:

```
DATABASE_URL=postgresql://seu_usuario:sua_senha@db.supabaseproject.com:5432/postgres
NODE_ENV=development
PORT=3000
```

**Substitua** `postgresql://seu_usuario:sua_senha@...` pela URL que você copiou do Supabase!

4. Salve o arquivo

---

## Passo 4: Rodar Localmente

### 4.1 Iniciar o Servidor

No PowerShell (na pasta do projeto), digite:
```
pnpm dev
```

Você vai ver algo como:
```
Server running on http://localhost:3000/
```

### 4.2 Acessar o Site

1. Abra seu navegador (Chrome, Edge, Firefox, etc.)
2. Vá para: `http://localhost:3000`
3. Você deve ver o site da confeitaria! 🎉

### 4.3 Fazer Login

1. Clique em "Admin" ou "Login"
2. Use:
   - **Usuário**: `admin`
   - **Senha**: `admin123`
3. Pronto! Você está logado! ✅

### 4.4 Parar o Servidor

No PowerShell, pressione `Ctrl + C` para parar o servidor.

---

## Passo 5: Deploy na Vercel

### 5.1 Enviar para GitHub

1. Abra PowerShell na pasta do projeto
2. Digite:
   ```
   git init
   git add .
   git commit -m "Primeiro commit"
   git branch -M main
   ```

3. Acesse: https://github.com/new
4. Crie um novo repositório chamado `taise-confeitaria`
5. **NÃO** marque "Initialize with README"
6. Clique "Create repository"

7. Copie os comandos que aparecem (seção "push an existing repository from the command line")
8. Cole no PowerShell

Exemplo:
```
git remote add origin https://github.com/seu-usuario/taise-confeitaria.git
git push -u origin main
```

### 5.2 Conectar Vercel

1. Acesse: https://vercel.com
2. Clique "New Project"
3. Selecione "Import Git Repository"
4. Escolha seu repositório `taise-confeitaria`
5. Clique "Import"

### 5.3 Configurar Variáveis de Ambiente

1. Na página do projeto na Vercel, vá para **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `DATABASE_URL`
   - **Value**: Cole a URL do Supabase que você copiou
3. Clique "Add"
4. Clique "Deploy"

### 5.4 Aguardar Deploy

Espere alguns minutos. Quando terminar, você verá um link como:
```
https://taise-confeitaria.vercel.app
```

Clique nele e seu site estará online! 🚀

---

## 🎉 Pronto!

Seu site está funcionando! Agora você pode:

- ✅ Acessar em `http://localhost:3000` (local)
- ✅ Acessar online em `https://taise-confeitaria.vercel.app`
- ✅ Fazer login com `admin` / `admin123`
- ✅ Adicionar produtos no painel admin
- ✅ Receber mensagens de contato

---

## 🆘 Problemas Comuns

### "Erro: DATABASE_URL não encontrado"
- Verifique se o arquivo `.env` está na pasta raiz do projeto
- Verifique se a URL do Supabase está correta

### "Erro: Porta 3000 já está em uso"
- Abra PowerShell e digite: `netstat -ano | findstr :3000`
- Anote o PID (número)
- Digite: `taskkill /PID XXXXX /F` (substitua XXXXX pelo número)

### "Erro ao fazer login"
- Verifique se as tabelas foram criadas no Supabase
- Verifique se o usuário `admin` foi inserido

### "Site não aparece após deploy"
- Aguarde alguns minutos (Vercel pode levar tempo)
- Verifique se as variáveis de ambiente estão configuradas
- Clique em "Redeploy" no painel da Vercel

---

## 📞 Suporte

Se tiver dúvidas, consulte:
- Documentação Supabase: https://supabase.com/docs
- Documentação Vercel: https://vercel.com/docs
- Documentação Node.js: https://nodejs.org/docs

---

**Parabéns! Você conseguiu! 🎂✨**
