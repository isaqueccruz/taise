import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories, contactMessages, products, users } from "../drizzle/schema";

// Conexão correta para PostgreSQL (Supabase)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("[Database] DATABASE_URL não encontrada. O site pode não funcionar corretamente.");
}

const client = connectionString ? postgres(connectionString) : null;
export const db = client ? drizzle(client) : null;

// ─── Usuários (Login Admin) ──────────────────────────────────────────────────
export async function getUserByUsername(username: string) {
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Categorias ──────────────────────────────────────────────────────────────
export async function getAllCategories() {
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryById(id: number) {
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function createCategory(data: any) {
  if (!db) throw new Error("Banco de dados não disponível");
  return db.insert(categories).values(data);
}

// ─── Produtos ─────────────────────────────────────────────────────────────────
export async function getAllProducts(filters?: { categoryId?: number; available?: boolean; featured?: boolean }) {
  if (!db) return [];
  const conditions = [];
  if (filters?.categoryId !== undefined) conditions.push(eq(products.categoryId, filters.categoryId));
  if (filters?.available !== undefined) conditions.push(eq(products.available, filters.available));
  if (filters?.featured !== undefined) conditions.push(eq(products.featured, filters.featured));
  
  if (conditions.length > 0) {
    return db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
  }
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getFeaturedProducts(limit = 6) {
  if (!db) return [];
  return db.select().from(products)
    .where(and(eq(products.featured, true), eq(products.available, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProductById(id: number) {
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(data: any) {
  if (!db) throw new Error("Banco de dados não disponível");
  return db.insert(products).values(data);
}

export async function updateProduct(id: number, data: any) {
  if (!db) throw new Error("Banco de dados não disponível");
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  if (!db) throw new Error("Banco de dados não disponível");
  return db.delete(products).where(eq(products.id, id));
}

// ─── Mensagens de Contato ─────────────────────────────────────────────────────
export async function createContactMessage(data: any) {
  if (!db) throw new Error("Banco de dados não disponível");
  return db.insert(contactMessages).values(data);
}

export async function getAllContactMessages() {
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}