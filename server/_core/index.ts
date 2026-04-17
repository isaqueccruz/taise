import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers.js";
import { createContext } from "./context.js";
import fs from "fs"; // Adicione este import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

// Tenta encontrar a pasta dist/public em diferentes níveis (local vs Vercel)
const getPublicPath = () => {
  const paths = [
    path.join(process.cwd(), "dist", "public"),
    path.join(__dirname, "..", "..", "dist", "public"),
    path.join(__dirname, "dist", "public")
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return paths[0]; // Fallback
};

const publicPath = getPublicPath();
app.use(express.static(publicPath));

app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`Arquivo index.html não encontrado em: ${publicPath}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});