import type { ProjectRecord, TaskRecord, UserRecord } from "../db.js";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function toPublicMember(user: UserRecord, role: "integrante" | "orientador" = "integrante") {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    institution: user.institution,
    role,
    initials: getInitials(user.name),
  };
}

export function toPublicProject(project: ProjectRecord, usersById: Map<string, UserRecord>) {
  const members = project.members
    .map((m) => {
      const user = usersById.get(m.userId);
      return user ? toPublicMember(user, m.role) : null;
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    deadline: project.deadline,
    course: project.course,
    advisor: project.advisor,
    theme: project.theme,
    ownerId: project.ownerId,
    // Visível só para membros (todas as rotas de projeto exigem ser membro).
    password: project.password,
    createdAt: project.createdAt,
    members,
  };
}

export function toPublicTask(task: TaskRecord) {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    assigneeId: task.assigneeId,
    priority: task.priority,
    tag: task.tag,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
