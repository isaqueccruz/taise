import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// CORREÇÃO ESM: Uso obrigatório de extensões .js para arquivos locais
import { appRouter } from "../routers.js";
import { createContext } from "./context.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Servir arquivos estáticos do build
// path.resolve garante que a Vercel localize a pasta independente do diretório de execução
const publicPath = path.resolve(__dirname, "../../dist/public");
app.use(express.static(publicPath));

// Servir o index.html para todas as rotas (SPA)
// Tipagem Request e Response explícita para evitar o erro TS7006 visto nos logs
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(publicPath, "index.html");
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Erro ao enviar index.html:", err);
      res.status(500).send("Erro interno: O front-end não foi encontrado no servidor.");
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});