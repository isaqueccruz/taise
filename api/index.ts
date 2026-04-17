import "dotenv/config";
import express, { Request, Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";
import path from "path";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tRPC routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// OAuth callback - CORREÇÃO: Adicionada tipagem explícita para req e res
app.get("/api/oauth/callback", async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "OAuth callback failed" });
  }
});

// Serve static files e SPA
const publicPath = path.join(process.cwd(), "dist/public");
app.use(express.static(publicPath));

// SPA fallback - CORREÇÃO: Adicionada tipagem explícita para req e res
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;