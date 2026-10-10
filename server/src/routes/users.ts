import { Router } from "express";
import { searchUsers } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { toPublicMember } from "../utils/serializers.js";

export const usersRouter = Router();

// GET /api/users/search?q=texto — usado na tela "Adicionar membro".
// Nunca devolve o próprio usuário nem o hash de senha.
usersRouter.get("/search", requireAuth, async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const users = (await searchUsers(q)).filter((u) => u.id !== req.user!.id);
  return res.json({ users: users.map((u) => toPublicMember(u)) });
});
