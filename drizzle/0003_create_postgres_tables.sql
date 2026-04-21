-- Create role enum type
CREATE TYPE "role" AS ENUM ('user', 'admin');

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  "name" TEXT,
  "email" VARCHAR(320),
  "loginMethod" VARCHAR(64),
  "role" "role" DEFAULT 'user' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "lastSignedIn" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(128) NOT NULL,
  "slug" VARCHAR(128) NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(256) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "imageUrl" TEXT,
  "categoryId" INTEGER REFERENCES "categories"("id"),
  "featured" BOOLEAN DEFAULT FALSE NOT NULL,
  "available" BOOLEAN DEFAULT TRUE NOT NULL,
  "servings" VARCHAR(64),
  "ingredients" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(128) NOT NULL,
  "email" VARCHAR(320) NOT NULL,
  "phone" VARCHAR(32),
  "subject" VARCHAR(256),
  "message" TEXT NOT NULL,
  "productId" INTEGER REFERENCES "products"("id"),
  "read" BOOLEAN DEFAULT FALSE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "users_openId_idx" ON "users"("openId");
CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_featured_idx" ON "products"("featured");
CREATE INDEX IF NOT EXISTS "contact_messages_read_idx" ON "contact_messages"("read");
CREATE INDEX IF NOT EXISTS "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");
