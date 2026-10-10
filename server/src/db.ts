import { JSONFilePreset } from "lowdb/node";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Garante que a pasta data/ exista antes do lowdb tentar escrever o arquivo.
fs.mkdirSync(DATA_DIR, { recursive: true });

export interface UserRecord {
  id: string;
  name: string;
  institution: string;
  email: string; // sempre armazenado em lowercase
  passwordHash: string;
  createdAt: string;
}

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "baixa" | "media" | "alta";
export type MemberRole = "integrante" | "orientador";

export interface ProjectMember {
  userId: string;
  role: MemberRole;
  joinedAt: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  course: string;
  advisor: string;
  theme: string;
  ownerId: string;
  /** GUID (minúsculo) que dá acesso ao projeto — gerado pelo sistema. */
  password: string;
  members: ProjectMember[];
  createdAt: string;
}

export interface TaskRecord {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  assigneeId: string | null;
  priority: TaskPriority;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

interface DbSchema {
  users: UserRecord[];
  projects: ProjectRecord[];
  tasks: TaskRecord[];
}

const defaultData: DbSchema = { users: [], projects: [], tasks: [] };

// Instância única do "banco" (arquivo JSON). Troque por Prisma/Postgres
// facilmente mais tarde — as funções abaixo são a única fronteira de acesso
// a dados usada pelas rotas, então a troca fica isolada aqui.
const db = await JSONFilePreset<DbSchema>(DB_FILE, defaultData);

// Bancos criados antes de projetos/tarefas existirem não têm essas coleções.
db.data.projects ??= [];
db.data.tasks ??= [];

// Projetos criados antes da "senha do projeto" existir ganham uma agora.
{
  let migrated = false;
  for (const project of db.data.projects) {
    if (!project.password) {
      project.password = crypto.randomUUID();
      migrated = true;
    }
  }
  if (migrated) await db.write();
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  return db.data.users.find((u) => u.email === email.toLowerCase());
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  return db.data.users.find((u) => u.id === id);
}

export async function createUser(input: {
  name: string;
  institution: string;
  email: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const user: UserRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    institution: input.institution,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  db.data.users.push(user);
  await db.write();
  return user;
}

export function toPublicUser(user: UserRecord) {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

// ---------------------------------------------------------------------------
// Projetos
// ---------------------------------------------------------------------------

export async function createProject(input: {
  name: string;
  description: string;
  deadline: string;
  course: string;
  advisor: string;
  theme: string;
  ownerId: string;
  password?: string;
}): Promise<ProjectRecord> {
  const now = new Date().toISOString();
  const project: ProjectRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    deadline: input.deadline,
    course: input.course,
    advisor: input.advisor,
    theme: input.theme,
    ownerId: input.ownerId,
    password: input.password ?? crypto.randomUUID(),
    members: [{ userId: input.ownerId, role: "integrante", joinedAt: now }],
    createdAt: now,
  };
  db.data.projects.push(project);
  await db.write();
  return project;
}

export async function findProjectById(id: string): Promise<ProjectRecord | undefined> {
  return db.data.projects.find((p) => p.id === id);
}

export async function listProjectsForUser(userId: string): Promise<ProjectRecord[]> {
  return db.data.projects
    .filter((p) => p.members.some((m) => m.userId === userId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function isProjectMember(project: ProjectRecord, userId: string): boolean {
  return project.members.some((m) => m.userId === userId);
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: MemberRole
): Promise<ProjectRecord | undefined> {
  const project = db.data.projects.find((p) => p.id === projectId);
  if (!project) return undefined;
  if (!isProjectMember(project, userId)) {
    project.members.push({ userId, role, joinedAt: new Date().toISOString() });
    await db.write();
  }
  return project;
}

// ---------------------------------------------------------------------------
// Tarefas
// ---------------------------------------------------------------------------

export async function listTasksByProject(projectId: string): Promise<TaskRecord[]> {
  return db.data.tasks
    .filter((t) => t.projectId === projectId)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.createdAt.localeCompare(b.createdAt));
}

export async function findTaskById(id: string): Promise<TaskRecord | undefined> {
  return db.data.tasks.find((t) => t.id === id);
}

export async function createTask(
  input: Omit<TaskRecord, "id" | "createdAt" | "updatedAt">
): Promise<TaskRecord> {
  const now = new Date().toISOString();
  const task: TaskRecord = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  db.data.tasks.push(task);
  await db.write();
  return task;
}

export async function updateTask(
  id: string,
  patch: Partial<Omit<TaskRecord, "id" | "projectId" | "createdAt" | "updatedAt">>
): Promise<TaskRecord | undefined> {
  const task = db.data.tasks.find((t) => t.id === id);
  if (!task) return undefined;
  Object.assign(task, patch, { updatedAt: new Date().toISOString() });
  await db.write();
  return task;
}

export async function findUsersByIds(ids: string[]): Promise<Map<string, UserRecord>> {
  const wanted = new Set(ids);
  return new Map(db.data.users.filter((u) => wanted.has(u.id)).map((u) => [u.id, u]));
}

export async function findProjectByPassword(password: string): Promise<ProjectRecord | undefined> {
  const wanted = password.trim().toLowerCase();
  return db.data.projects.find((p) => p.password === wanted);
}
