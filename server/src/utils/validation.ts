import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  institution: z.string().trim().min(2, "Informe a instituição de ensino"),
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Projetos e tarefas
// ---------------------------------------------------------------------------

// Aceita apenas datas reais no formato YYYY-MM-DD (rejeita 2026-02-31, etc.).
const isoDate = (requiredMessage: string) =>
  z
    .string({ required_error: requiredMessage, invalid_type_error: requiredMessage })
    .trim()
    .min(1, requiredMessage)
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Data inválida. Use o formato AAAA-MM-DD")
    .refine((v) => {
      const d = new Date(`${v}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Data inexistente");

// Texto obrigatório: ausente, null ou só espaços vira erro com a mensagem dada.
const requiredText = (message: string, max: number) =>
  z
    .string({ required_error: message, invalid_type_error: message })
    .trim()
    .min(1, message)
    .max(max, `Use no máximo ${max} caracteres`);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Use no máximo ${max} caracteres`).optional().default("");

const projectPassword = z
  .string({ invalid_type_error: "Senha do projeto inválida" })
  .trim()
  .uuid("Senha do projeto inválida")
  .transform((v) => v.toLowerCase());

export const createProjectSchema = z.object({
  // Normalmente é a senha pré-gerada por GET /projects/new-password (mostrada
  // no formulário). Se não vier, o servidor gera uma.
  password: projectPassword.optional(),
  name: requiredText("Informe o nome do projeto", 120),
  description: requiredText("Informe a descrição do projeto", 2000),
  deadline: isoDate("Informe o prazo final do projeto"),
  course: optionalText(120),
  advisor: optionalText(120),
  theme: optionalText(120),
});

export const joinProjectSchema = z.object({
  password: z
    .string({ required_error: "Informe a senha do projeto", invalid_type_error: "Informe a senha do projeto" })
    .trim()
    .min(1, "Informe a senha do projeto"),
});

export const addMemberSchema = z.object({
  userId: z
    .string({ required_error: "Informe o usuário a adicionar", invalid_type_error: "Usuário inválido" })
    .trim()
    .min(1, "Informe o usuário a adicionar"),
  role: z.enum(["integrante", "orientador"]).optional().default("integrante"),
});

export const taskStatusSchema = z.enum(["todo", "doing", "done"], {
  errorMap: () => ({ message: "Status inválido. Use todo, doing ou done" }),
});

export const taskPrioritySchema = z.enum(["baixa", "media", "alta"], {
  errorMap: () => ({ message: "Prioridade inválida. Use baixa, media ou alta" }),
});

export const createTaskSchema = z.object({
  title: requiredText("Informe o título da tarefa", 160),
  description: requiredText("Informe a descrição da tarefa", 2000),
  dueDate: isoDate("Informe o prazo da tarefa"),
  status: taskStatusSchema.optional().default("todo"),
  assigneeId: z.string().trim().min(1).nullable().optional().default(null),
  priority: taskPrioritySchema.optional().default("media"),
  tag: optionalText(40),
});

// PATCH: todos os campos opcionais, mas os que vierem seguem as mesmas regras
// (um título enviado vazio continua sendo erro, não "limpa" o campo).
export const updateTaskSchema = z
  .object({
    title: requiredText("O título da tarefa não pode ficar vazio", 160),
    description: requiredText("A descrição da tarefa não pode ficar vazia", 2000),
    dueDate: isoDate("O prazo da tarefa não pode ficar vazio"),
    status: taskStatusSchema,
    assigneeId: z.string().trim().min(1).nullable(),
    priority: taskPrioritySchema,
    tag: optionalText(40),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, "Envie ao menos um campo para atualizar");

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
