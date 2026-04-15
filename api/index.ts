import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

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

// OAuth callback
app.get("/api/oauth/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }
    // OAuth logic would go here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "OAuth callback failed" });
  }
});

// Serve static files and SPA
app.use(express.static("dist/public"));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile("dist/public/index.html", { root: process.cwd() });
});

export default app;
