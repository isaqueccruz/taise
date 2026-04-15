import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { categories, contactMessages, InsertUser, products, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return result;
}

export async function updateCategory(id: number, data: { name?: string; slug?: string; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(categories).where(eq(categories.id, id));
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function getAllProducts(filters?: { categoryId?: number; available?: boolean; featured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.categoryId !== undefined) conditions.push(eq(products.categoryId, filters.categoryId));
  if (filters?.available !== undefined) conditions.push(eq(products.available, filters.available));
  if (filters?.featured !== undefined) conditions.push(eq(products.featured, filters.featured));
  const query = conditions.length > 0
    ? db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt))
    : db.select().from(products).orderBy(desc(products.createdAt));
  return query;
}

export async function getFeaturedProducts(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(and(eq(products.featured, true), eq(products.available, true))).orderBy(desc(products.createdAt)).limit(limit);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(data: {
  name: string; description?: string; price: string; imageUrl?: string;
  categoryId?: number; featured?: boolean; available?: boolean; servings?: string; ingredients?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: {
  name?: string; description?: string; price?: string; imageUrl?: string;
  categoryId?: number; featured?: boolean; available?: boolean; servings?: string; ingredients?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(products).where(eq(products.id, id));
}

// ─── Contact Messages ─────────────────────────────────────────────────────────
export async function createContactMessage(data: {
  name: string; email: string; phone?: string; subject?: string; message: string; productId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(contactMessages).values(data);
}

export async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markMessageRead(id: number, read: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(contactMessages).where(eq(contactMessages.id, id));
}

export async function getUnreadMessageCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(contactMessages).where(eq(contactMessages.read, false));
  return result.length;
}
