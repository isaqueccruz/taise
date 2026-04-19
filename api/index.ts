import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "path";
import fs from "fs";

// Importações com .js para compatibilidade ESM na Vercel
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";

const app = express();

// Middleware de Log para você ver o erro real no painel da Vercel
app.use((req, res, next) => {
  console.log(`[Request]: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// 1. Rota tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// 2. Resolver o caminho da pasta dist/public de forma segura
const publicPath = path.resolve(process.cwd(), "dist", "public");

// 3. Servir estáticos
app.use(express.static(publicPath));

// 4. Fallback SPA (Onde o /admin morre atualmente)
app.get("*", (req, res) => {
  // Ignorar chamadas de API que deram errado
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: "Not Found" });
  }

  const indexPath = path.join(publicPath, "index.html");

  // Log para sabermos se o arquivo realmente existe no servidor
  if (!fs.existsSync(indexPath)) {
    console.error(`[ERRO]: index.html não encontrado em: ${indexPath}`);
    return res.status(500).send(`Erro Interno: Arquivos do frontend não encontrados no servidor.`);
  }

  res.sendFile(indexPath);
});

export default app;