// server/_core/index.ts
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";

// server/db.ts
import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { pgTable, serial, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  // Hash bcrypt
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name"),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  // "admin" ou "user"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  // Preço em centavos
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").default(false).notNull(),
  available: boolean("available").default(true).notNull(),
  servings: varchar("servings", { length: 64 }),
  ingredients: text("ingredients"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: varchar("subject", { length: 256 }),
  message: text("message").notNull(),
  productId: integer("product_id"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}
async function createCategory(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return result;
}
async function updateCategory(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(categories).set(data).where(eq(categories.id, id));
}
async function deleteCategory(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(categories).where(eq(categories.id, id));
}
async function getAllProducts(filters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.categoryId !== void 0) conditions.push(eq(products.categoryId, filters.categoryId));
  if (filters?.available !== void 0) conditions.push(eq(products.available, filters.available));
  if (filters?.featured !== void 0) conditions.push(eq(products.featured, filters.featured));
  const query = conditions.length > 0 ? db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt)) : db.select().from(products).orderBy(desc(products.createdAt));
  return query;
}
async function getFeaturedProducts(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(and(eq(products.featured, true), eq(products.available, true))).orderBy(desc(products.createdAt)).limit(limit);
}
async function getProductById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}
async function createProduct(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}
async function updateProduct(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(data).where(eq(products.id, id));
}
async function deleteProduct(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(products).where(eq(products.id, id));
}
async function createContactMessage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(contactMessages).values(data);
}
async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
async function markMessageRead(id, read) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
}
async function deleteContactMessage(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(contactMessages).where(eq(contactMessages.id, id));
}
async function getUnreadMessageCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(contactMessages).where(eq(contactMessages.read, false));
  return result.length;
}

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/storage.ts
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
import { nanoid } from "nanoid";
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});
var categoriesRouter = router({
  list: publicProcedure.query(() => getAllCategories()),
  create: adminProcedure2.input(z2.object({
    name: z2.string().min(1).max(128),
    slug: z2.string().min(1).max(128).regex(/^[a-z0-9-]+$/),
    description: z2.string().optional()
  })).mutation(async ({ input }) => {
    await createCategory(input);
    return { success: true };
  }),
  update: adminProcedure2.input(z2.object({
    id: z2.number(),
    name: z2.string().min(1).max(128).optional(),
    slug: z2.string().min(1).max(128).regex(/^[a-z0-9-]+$/).optional(),
    description: z2.string().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateCategory(id, data);
    return { success: true };
  }),
  delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    await deleteCategory(input.id);
    return { success: true };
  })
});
var productsRouter = router({
  list: publicProcedure.input(z2.object({
    categoryId: z2.number().optional(),
    available: z2.boolean().optional(),
    featured: z2.boolean().optional()
  }).optional()).query(({ input }) => getAllProducts(input)),
  featured: publicProcedure.input(z2.object({ limit: z2.number().optional() }).optional()).query(({ input }) => getFeaturedProducts(input?.limit)),
  getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
    const product = await getProductById(input.id);
    if (!product) throw new TRPCError3({ code: "NOT_FOUND", message: "Produto n\xE3o encontrado." });
    return product;
  }),
  create: adminProcedure2.input(z2.object({
    name: z2.string().min(1).max(256),
    description: z2.string().optional(),
    price: z2.string().regex(/^\d+(\.\d{1,2})?$/),
    imageUrl: z2.string().url().optional(),
    categoryId: z2.number().optional(),
    featured: z2.boolean().optional(),
    available: z2.boolean().optional(),
    servings: z2.string().optional(),
    ingredients: z2.string().optional()
  })).mutation(async ({ input }) => {
    await createProduct(input);
    return { success: true };
  }),
  update: adminProcedure2.input(z2.object({
    id: z2.number(),
    name: z2.string().min(1).max(256).optional(),
    description: z2.string().optional(),
    price: z2.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    imageUrl: z2.string().url().optional().nullable(),
    categoryId: z2.number().optional().nullable(),
    featured: z2.boolean().optional(),
    available: z2.boolean().optional(),
    servings: z2.string().optional(),
    ingredients: z2.string().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const cleanData = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== void 0) cleanData[k] = v;
    }
    await updateProduct(id, cleanData);
    return { success: true };
  }),
  delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    await deleteProduct(input.id);
    return { success: true };
  }),
  uploadImage: adminProcedure2.input(z2.object({
    fileName: z2.string(),
    fileBase64: z2.string(),
    mimeType: z2.string()
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.fileBase64, "base64");
    const ext = input.fileName.split(".").pop() ?? "jpg";
    const key = `products/${nanoid()}.${ext}`;
    const { url } = await storagePut(key, buffer, input.mimeType);
    return { url };
  })
});
var contactRouter = router({
  submit: publicProcedure.input(z2.object({
    name: z2.string().min(1).max(128),
    email: z2.string().email(),
    phone: z2.string().optional(),
    subject: z2.string().optional(),
    message: z2.string().min(5),
    productId: z2.number().optional()
  })).mutation(async ({ input }) => {
    await createContactMessage(input);
    const productInfo = input.productId ? ` (Produto ID: ${input.productId})` : "";
    await notifyOwner({
      title: `Nova mensagem de ${input.name}`,
      content: `**De:** ${input.name} <${input.email}>
**Telefone:** ${input.phone ?? "\u2014"}
**Assunto:** ${input.subject ?? "\u2014"}${productInfo}

${input.message}`
    });
    return { success: true };
  }),
  listMessages: adminProcedure2.query(() => getAllContactMessages()),
  markRead: adminProcedure2.input(z2.object({ id: z2.number(), read: z2.boolean() })).mutation(async ({ input }) => {
    await markMessageRead(input.id, input.read);
    return { success: true };
  }),
  deleteMessage: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    await deleteContactMessage(input.id);
    return { success: true };
  }),
  unreadCount: adminProcedure2.query(() => getUnreadMessageCount())
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  categories: categoriesRouter,
  products: productsRouter,
  contact: contactRouter
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var SDKServer = class {
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      return null;
    }
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var publicPath = path.join(__dirname, "../../dist/public");
app.use(express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
