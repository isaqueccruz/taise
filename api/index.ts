import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";
import path from "path";
import fs from "fs";

const app = express();
const publicPath = path.join(process.cwd(), "dist", "public");

app.use(express.json());

// 1. tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// 2. Servir arquivos estáticos (CSS, JS, Favicon)
// Isso resolve o erro 500 do favicon.ico que aparece no seu console
app.use(express.static(publicPath));

// 3. Fallback para rotas do Frontend (Wouter)
app.get("*", (req: any, res: any) => {
  // Se for uma rota de API inexistente, não manda o HTML
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: "API route not found" });
  }

  const indexPath = path.join(publicPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send("Build do frontend não encontrado. Verifique se o diretório dist/public existe.");
  }
});

export default app;