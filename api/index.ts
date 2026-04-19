import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";
import path from "path";
import fs from "fs";

const app = express();

// Middleware básico
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API - Rota prioritária
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// OAuth callback
app.get("/api/oauth/callback", async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).json({ error: "Missing code or state" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "OAuth callback failed" });
  }
});

// Configuração de arquivos estáticos
const publicPath = path.join(process.cwd(), "dist", "public");

// 1. Primeiro, tenta servir arquivos físicos (assets, imagens, favicon)
app.use(express.static(publicPath, {
  index: false // Impede que ele tente servir o index.html antes da hora
}));

// 2. SPA Fallback: Qualquer rota que não seja /api, entrega o index.html
// Isso permite que o Wouter/React gerencie o /admin que vimos no seu GitHub
app.get(/^(?!\/api).+/, (req: Request, res: Response) => {
  const indexPath = path.join(publicPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Se cair aqui, a pasta dist/public não foi criada no build
    res.status(404).send("Erro: Build do frontend não encontrado. Verifique o comando de build.");
  }
});

// Tratamento de erro global para evitar o erro 500 silencioso
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERRO NO SERVIDOR:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message 
  });
});

export default app;