// Cliente HTTP para a API do backend (server/): autenticação, projetos,
// membros e tarefas.
// Em dev, "/api" é redirecionado para o Express via proxy do Vite
// (vite.config.ts). Em produção, defina VITE_API_URL se o front-end
// e o backend forem servidos de origens diferentes.

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export interface ApiUser {
  id: string;
  name: string;
  institution: string;
  email: string;
  createdAt: string;
}

import type { ProjectInfo, Task, TaskPriority, TaskStatus } from "./types";

export class ApiError extends Error {
  status: number;
  /** Erros por campo vindos da validação do servidor (ex.: { title: "..." }). */
  fields: Record<string, string>;
  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // envia/recebe o cookie httpOnly de sessão
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      typeof data.error === "string" ? data.error : "Algo deu errado. Tente novamente.",
      res.status,
      data.fields && typeof data.fields === "object" ? data.fields : {}
    );
  }

  return data as T;
}

export const api = {
  register(input: { name: string; institution: string; email: string; password: string }) {
    return request<{ user: ApiUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  login(input: { email: string; password: string }) {
    return request<{ user: ApiUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  logout() {
    return request<void>("/auth/logout", { method: "POST" });
  },
  me() {
    return request<{ user: ApiUser }>("/auth/me");
  },
  // --- Projetos -----------------------------------------------------------
  listProjects() {
    return request<{ projects: ProjectInfo[] }>("/projects");
  },
  newProjectPassword() {
    return request<{ password: string }>("/projects/new-password");
  },
  joinProject(password: string) {
    return request<{ project: ProjectInfo }>("/projects/join", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
  createProject(input: {
    password?: string;
    name: string;
    description: string;
    deadline: string;
    course?: string;
    advisor?: string;
    theme?: string;
  }) {
    return request<{ project: ProjectInfo }>("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  // --- Tarefas ------------------------------------------------------------
  listTasks(projectId: string) {
    return request<{ tasks: Task[] }>(`/projects/${projectId}/tasks`);
  },
  createTask(
    projectId: string,
    input: {
      title: string;
      description: string;
      dueDate: string;
      status: TaskStatus;
      assigneeId: string | null;
      priority: TaskPriority;
      tag: string;
    }
  ) {
    return request<{ task: Task }>(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updateTask(taskId: string, patch: Partial<Pick<Task, "title" | "description" | "dueDate" | "status" | "assigneeId" | "priority" | "tag">>) {
    return request<{ task: Task }>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },
};
