import "dotenv/config";
import express, { Request, Response } from "express"; // Importamos os tipos
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js"; // Adicionado .js
import { createContext } from "../server/_core/context.js"; // Adicionado .js
import path from "path";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TRPC routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// OAuth callback - Tipagem explícita (Request, Response) para matar o erro TS7006
app.get("/api/oauth/callback", async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }
    // OAuth logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "OAuth callback failed" });
  }
});

// Serve static files
const publicPath = path.join(process.cwd(), "dist/public");
app.use(express.static(publicPath));

// SPA fallback - Tipagem explícita aqui também
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;