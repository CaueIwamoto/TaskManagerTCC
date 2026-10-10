import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createUser, findUserByEmail, toPublicUser } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  signSession,
} from "../utils/jwt.js";
import { loginSchema, registerSchema } from "../utils/validation.js";

export const authRouter = Router();

const PASSWORD_SALT_ROUNDS = 10;

const isProduction = process.env.NODE_ENV === "production";

function setSessionCookie(res: import("express").Response, userId: string) {
  const token = signSession({ sub: userId });
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  });
}

// Limita tentativas de login para dificultar força bruta de credenciais.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas de login. Tente novamente em alguns minutos." },
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  const { name, institution, email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Já existe uma conta com este e-mail." });
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  const user = await createUser({ name, institution, email, passwordHash });

  setSessionCookie(res, user.id);
  return res.status(201).json({ user: toPublicUser(user) });
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  // Mensagem genérica — não revela se o e-mail existe ou se a senha está errada.
  const invalidCredentials = () =>
    res.status(401).json({ error: "E-mail ou senha inválidos." });

  if (!user) return invalidCredentials();

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return invalidCredentials();

  setSessionCookie(res, user.id);
  return res.json({ user: toPublicUser(user) });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  return res.status(204).send();
});

authRouter.get("/me", requireAuth, (req, res) => {
  return res.json({ user: toPublicUser(req.user!) });
});
