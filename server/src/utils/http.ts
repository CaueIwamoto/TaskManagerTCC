import type { Response } from "express";
import type { ZodError } from "zod";

/**
 * Responde 400 com a primeira mensagem (campo `error`, compatível com o
 * cliente atual) e um mapa `fields` para o front-end marcar cada campo.
 */
export function sendValidationError(res: Response, error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return res
    .status(400)
    .json({ error: error.issues[0]?.message ?? "Dados inválidos.", fields });
}
