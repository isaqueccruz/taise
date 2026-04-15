// Constantes do aplicativo
export const APP_NAME = "Taise Sena Confeitaria";
export const COOKIE_NAME = "auth_token";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// URLs
export const API_BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

// WhatsApp
export const WHATSAPP_NUMBER = "5571988461789";
export const WHATSAPP_MESSAGE = "Olá! Gostaria de fazer um pedido na Taise Sena Confeitaria.";

// Email
export const ADMIN_EMAIL = "admin@confeitaria.com";

// Rotas
export const ROUTES = {
  HOME: "/",
  CATALOG: "/catalogo",
  PRODUCT: (id: number | string) => `/produto/${id}`,
  ABOUT: "/sobre",
  CONTACT: "/contato",
  LOGIN: "/login",
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/produtos",
  ADMIN_CATEGORIES: "/admin/categorias",
  ADMIN_MESSAGES: "/admin/mensagens",
};

// Função para fazer login (simples)
export const getLoginUrl = () => {
  return "/login";
};
