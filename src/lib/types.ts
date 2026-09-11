export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "baixa" | "media" | "alta";
export type MemberRole = "integrante" | "orientador";

export interface Member {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  role: MemberRole;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
}

export interface ProjectInfo {
  name: string;
  course: string;
  advisor: string;
  theme: string;
  description: string;
  deadline: string;
}

export type Screen =
  | "login"
  | "register"
  | "create-project"
  | "add-members"
  | "create-task"
  | "project-view";
