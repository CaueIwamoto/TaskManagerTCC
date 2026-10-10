import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  addProjectMember,
  createProject,
  createTask,
  findProjectById,
  findProjectByPassword,
  findUserById,
  findUsersByIds,
  isProjectMember,
  listProjectsForUser,
  listTasksByProject,
  type ProjectRecord,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { sendValidationError } from "../utils/http.js";
import { toPublicProject, toPublicTask } from "../utils/serializers.js";
import {
  addMemberSchema,
  createProjectSchema,
  createTaskSchema,
  joinProjectSchema,
  taskStatusSchema,
} from "../utils/validation.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

async function presentProject(project: ProjectRecord) {
  const users = await findUsersByIds(project.members.map((m) => m.userId));
  return toPublicProject(project, users);
}

/**
 * Carrega o projeto e garante que o usuário logado é membro dele. Responde
 * 404 tanto para "não existe" quanto para "não é seu" — assim a API não
 * revela a existência de projetos de terceiros.
 */
async function loadAccessibleProject(
  req: import("express").Request,
  res: import("express").Response
): Promise<ProjectRecord | null> {
  const project = await findProjectById(String(req.params.projectId ?? req.params.id));
  if (!project || !isProjectMember(project, req.user!.id)) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return null;
  }
  return project;
}

// Limita tentativas de senha para dificultar adivinhação por força bruta.
const joinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

// GET /api/projects/new-password — GUID gerado pelo sistema para o formulário
// "Criar projeto" exibir (somente leitura) antes do envio.
projectsRouter.get("/new-password", (_req, res) => {
  return res.json({ password: crypto.randomUUID() });
});

// POST /api/projects/join — Entrar em um projeto existente pela senha
projectsRouter.post("/join", joinLimiter, async (req, res) => {
  const parsed = joinProjectSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  const project = await findProjectByPassword(parsed.data.password);
  if (!project) {
    return res.status(403).json({
      error: "Senha incorreta.",
      fields: { password: "Senha incorreta." },
    });
  }

  // Já é membro? Apenas devolve o projeto (entrar de novo é inofensivo).
  const updated = isProjectMember(project, req.user!.id)
    ? project
    : await addProjectMember(project.id, req.user!.id, "integrante");
  return res.json({ project: await presentProject(updated!) });
});

// POST /api/projects — Criar projeto (nome, descrição e prazo obrigatórios)
projectsRouter.post("/", async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  if (parsed.data.password && (await findProjectByPassword(parsed.data.password))) {
    return res.status(409).json({
      error: "Esta senha já está em uso. Recarregue a página para gerar outra.",
    });
  }

  const project = await createProject({ ...parsed.data, ownerId: req.user!.id });
  return res.status(201).json({ project: await presentProject(project) });
});

// GET /api/projects — projetos dos quais o usuário participa
projectsRouter.get("/", async (req, res) => {
  const projects = await listProjectsForUser(req.user!.id);
  return res.json({
    projects: await Promise.all(projects.map((p) => presentProject(p))),
  });
});

// GET /api/projects/:id
projectsRouter.get("/:id", async (req, res) => {
  const project = await loadAccessibleProject(req, res);
  if (!project) return;
  return res.json({ project: await presentProject(project) });
});

// POST /api/projects/:id/members — Adicionar usuário ao projeto
projectsRouter.post("/:id/members", async (req, res) => {
  const project = await loadAccessibleProject(req, res);
  if (!project) return;

  const parsed = addMemberSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  const user = await findUserById(parsed.data.userId);
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }
  if (isProjectMember(project, user.id)) {
    return res.status(409).json({ error: "Este usuário já faz parte do projeto." });
  }

  const updated = await addProjectMember(project.id, user.id, parsed.data.role);
  return res.status(201).json({ project: await presentProject(updated!) });
});

// GET /api/projects/:projectId/tasks?status=todo|doing|done — Consultar tarefas
projectsRouter.get("/:projectId/tasks", async (req, res) => {
  const project = await loadAccessibleProject(req, res);
  if (!project) return;

  let tasks = await listTasksByProject(project.id);

  if (req.query.status !== undefined) {
    const status = taskStatusSchema.safeParse(req.query.status);
    if (!status.success) return sendValidationError(res, status.error);
    tasks = tasks.filter((t) => t.status === status.data);
  }

  return res.json({ tasks: tasks.map(toPublicTask) });
});

// POST /api/projects/:projectId/tasks — Criar tarefa
projectsRouter.post("/:projectId/tasks", async (req, res) => {
  const project = await loadAccessibleProject(req, res);
  if (!project) return;

  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  const { assigneeId } = parsed.data;
  if (assigneeId && !project.members.some((m) => m.userId === assigneeId)) {
    return res.status(400).json({
      error: "O responsável precisa ser membro do projeto.",
      fields: { assigneeId: "O responsável precisa ser membro do projeto." },
    });
  }

  const task = await createTask({ ...parsed.data, projectId: project.id });
  return res.status(201).json({ task: toPublicTask(task) });
});
