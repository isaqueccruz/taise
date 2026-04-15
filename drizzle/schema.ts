import { pgTable, serial, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";

/**
 * Schema para Supabase (PostgreSQL)
 * Adaptado para autenticação simples com username/password
 */

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // Hash bcrypt
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name"),
  role: varchar("role", { length: 50 }).default("user").notNull(), // "admin" ou "user"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Preço em centavos
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").default(false).notNull(),
  available: boolean("available").default(true).notNull(),
  servings: varchar("servings", { length: 64 }),
  ingredients: text("ingredients"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ─── Contact Messages ─────────────────────────────────────────────────────────
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: varchar("subject", { length: 256 }),
  message: text("message").notNull(),
  productId: integer("product_id"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
