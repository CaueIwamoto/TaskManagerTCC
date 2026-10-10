import type { NextFunction, Request, Response } from "express";
import { findUserById } from "../db.js";
import { SESSION_COOKIE_NAME, verifySession } from "../utils/jwt.js";

/**
 * Exige uma sessão válida (cookie httpOnly assinado). Em caso de sucesso,
 * popula req.user com o registro completo do usuário autenticado.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  const payload = verifySession(token);
  if (!payload) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }

  req.user = user;
  next();
}
