import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@taisesena.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx: TrpcContext = {
      user: {
        id: 1, openId: "sample-user", email: "sample@example.com", name: "Sample User",
        loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
  });
});

describe("products router", () => {
  it("admin can access product list procedure", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    // The procedure exists and is callable (DB may not be available in test env)
    await expect(caller.products.list({})).resolves.toBeDefined();
  });

  it("non-admin cannot create product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.products.create({
        name: "Test Cake",
        price: "50.00",
      })
    ).rejects.toThrow();
  });

  it("admin can create product (validates input)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    // Invalid price should throw validation error
    await expect(
      caller.products.create({
        name: "Test",
        price: "invalid-price",
      })
    ).rejects.toThrow();
  });
});

describe("categories router", () => {
  it("public can list categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.categories.list()).resolves.toBeDefined();
  });

  it("non-admin cannot create category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.categories.create({ name: "Test", slug: "test" })
    ).rejects.toThrow();
  });
});

describe("contact router", () => {
  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "A",
        email: "invalid-email",
        message: "Hi",
      })
    ).rejects.toThrow();
  });

  it("non-admin cannot list messages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.contact.listMessages()).rejects.toThrow();
  });
});
