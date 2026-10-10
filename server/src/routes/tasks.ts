import { Router } from "express";
import { findProjectById, findTaskById, isProjectMember, updateTask } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { sendValidationError } from "../utils/http.js";
import { toPublicTask } from "../utils/serializers.js";
import { updateTaskSchema } from "../utils/validation.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

// PATCH /api/tasks/:id — atualiza campos (ex.: status ao mover no quadro)
tasksRouter.patch("/:id", async (req, res) => {
  const task = await findTaskById(req.params.id);
  const project = task ? await findProjectById(task.projectId) : undefined;
  if (!task || !project || !isProjectMember(project, req.user!.id)) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  const { assigneeId } = parsed.data;
  if (assigneeId && !project.members.some((m) => m.userId === assigneeId)) {
    return res.status(400).json({
      error: "O responsável precisa ser membro do projeto.",
      fields: { assigneeId: "O responsável precisa ser membro do projeto." },
    });
  }

  const updated = await updateTask(task.id, parsed.data);
  return res.json({ task: toPublicTask(updated!) });
});
