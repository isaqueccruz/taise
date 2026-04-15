import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";

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
const publicPath = path.join(__dirname, "../../dist/public");
app.use(express.static(publicPath));

// Servir o index.html para todas as rotas (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
