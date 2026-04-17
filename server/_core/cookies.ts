import type { CookieOptions } from "express";

// Mudamos para 'any' para evitar que o TS trave o build na Vercel
function isSecureRequest(req: any) {
  // Verifica o protocolo direto
  if (req.protocol === "https") return true;

  // Verifica o header de encaminhamento (comum na Vercel/Proxy)
  const forwardedProto = req.headers ? req.headers["x-forwarded-proto"] : null;
  
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some((proto: any) => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: any
): CookieOptions {
  return {
    httpOnly: true,
    path: "/",
    // 'lax' é mais seguro para a maioria dos sites, 
    // mas se o admin estiver em subdomínios diferentes, 'none' exige 'secure: true'
    sameSite: "none", 
    secure: isSecureRequest(req),
  };
}