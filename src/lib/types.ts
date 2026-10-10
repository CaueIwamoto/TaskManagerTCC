export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "baixa" | "media" | "alta";
export type MemberRole = "integrante" | "orientador";

export interface Member {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: MemberRole;
  initials: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string | null;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  course: string;
  advisor: string;
  theme: string;
  ownerId: string;
  /** GUID de acesso ao projeto, gerado pelo sistema. */
  password: string;
  members: Member[];
}

export type Screen =
  | "login"
  | "register"
  | "project-choice"
  | "join-project"
  | "create-project"
  | "add-members"
  | "create-task"
  | "project-view";
