import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createCategory, createContactMessage, createProduct,
  deleteCategory, deleteContactMessage, deleteProduct,
  getAllCategories, getAllContactMessages, getAllProducts,
  getCategoryById, getFeaturedProducts, getProductById,
  getUnreadMessageCount, markMessageRead, updateCategory, updateProduct
} from "./db";
import { notifyOwner } from "./_core/notification";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});

// ─── Categories Router ────────────────────────────────────────────────────────
const categoriesRouter = router({
  list: publicProcedure.query(() => getAllCategories()),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(128),
      slug: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await createCategory(input);
      return { success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(128).optional(),
      slug: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCategory(id, data);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCategory(input.id);
      return { success: true };
    }),
});

// ─── Products Router ──────────────────────────────────────────────────────────
const productsRouter = router({
  list: publicProcedure
    .input(z.object({
      categoryId: z.number().optional(),
      available: z.boolean().optional(),
      featured: z.boolean().optional(),
    }).optional())
    .query(({ input }) => getAllProducts(input)),

  featured: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(({ input }) => getFeaturedProducts(input?.limit)),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado." });
      return product;
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(256),
      description: z.string().optional(),
      price: z.string().regex(/^\d+(\.\d{1,2})?$/),
      imageUrl: z.string().url().optional(),
      categoryId: z.number().optional(),
      featured: z.boolean().optional(),
      available: z.boolean().optional(),
      servings: z.string().optional(),
      ingredients: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await createProduct(input);
      return { success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(256).optional(),
      description: z.string().optional(),
      price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
      imageUrl: z.string().url().optional().nullable(),
      categoryId: z.number().optional().nullable(),
      featured: z.boolean().optional(),
      available: z.boolean().optional(),
      servings: z.string().optional(),
      ingredients: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const cleanData: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) cleanData[k] = v;
      }
      await updateProduct(id, cleanData as Parameters<typeof updateProduct>[1]);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteProduct(input.id);
      return { success: true };
    }),

  uploadImage: adminProcedure
    .input(z.object({
      fileName: z.string(),
      fileBase64: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileBase64, "base64");
      const ext = input.fileName.split(".").pop() ?? "jpg";
      const key = `products/${nanoid()}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      return { url };
    }),
});

// ─── Contact Router ───────────────────────────────────────────────────────────
const contactRouter = router({
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(128),
      email: z.string().email(),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(5),
      productId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      await createContactMessage(input);
      // Notify owner
      const productInfo = input.productId ? ` (Produto ID: ${input.productId})` : "";
      await notifyOwner({
        title: `Nova mensagem de ${input.name}`,
        content: `**De:** ${input.name} <${input.email}>\n**Telefone:** ${input.phone ?? "—"}\n**Assunto:** ${input.subject ?? "—"}${productInfo}\n\n${input.message}`,
      });
      return { success: true };
    }),

  listMessages: adminProcedure.query(() => getAllContactMessages()),

  markRead: adminProcedure
    .input(z.object({ id: z.number(), read: z.boolean() }))
    .mutation(async ({ input }) => {
      await markMessageRead(input.id, input.read);
      return { success: true };
    }),

  deleteMessage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteContactMessage(input.id);
      return { success: true };
    }),

  unreadCount: adminProcedure.query(() => getUnreadMessageCount()),
});

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  categories: categoriesRouter,
  products: productsRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
