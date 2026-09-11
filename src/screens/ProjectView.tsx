import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  GraduationCap,
  Users,
  Plus,
  ArrowRight,
  Circle,
} from "lucide-react";
import type { Member, ProjectInfo, Task, TaskStatus } from "@/lib/types";

interface ProjectViewProps {
  project: ProjectInfo;
  members: Member[];
  tasks: Task[];
  onAdvanceTask: (taskId: string) => void;
  onAddMembers: () => void;
  onCreateTask: () => void;
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "A fazer" },
  { status: "doing", label: "Em andamento" },
  { status: "done", label: "Concluído" },
];

const priorityDot: Record<Task["priority"], string> = {
  baixa: "bg-[hsl(var(--teal))]",
  media: "bg-[hsl(var(--amber))]",
  alta: "bg-[hsl(var(--brick))]",
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function ProjectView({
  project,
  members,
  tasks,
  onAdvanceTask,
  onAddMembers,
  onCreateTask,
}: ProjectViewProps) {
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const membersById = useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mx-auto max-w-[1100px]">
        {/* Cabeçalho do projeto */}
        <div className="flex flex-col gap-6 border-b border-[hsl(var(--line))] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
              Visão geral do projeto
            </p>
            <h1 className="font-display text-[30px] leading-tight text-[hsl(var(--ink))] mt-1">
              {project.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[hsl(var(--ink-soft))]">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
                {project.course}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                Entrega em {formatDate(project.deadline)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" strokeWidth={1.75} />
                {members.length} integrantes
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Button
              variant="outline"
              onClick={onAddMembers}
              className="border-[hsl(var(--line))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--paper-alt))]"
            >
              <Users className="h-4 w-4 mr-1.5" strokeWidth={1.75} />
              Membros
            </Button>
            <Button
              onClick={onCreateTask}
              className="bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
            >
              <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.75} />
              Nova tarefa
            </Button>
          </div>
        </div>

        {/* Progresso */}
        <div className="mt-6 flex items-center gap-4">
          <Progress value={progress} className="h-1.5 flex-1 bg-[hsl(var(--paper-deep))]" />
          <span className="font-mono-meta text-xs text-[hsl(var(--ink-soft))] shrink-0">
            {doneCount}/{tasks.length} tarefas concluídas · {progress}%
          </span>
        </div>

        {/* Quadro de tarefas */}
        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status}>
                <div className="flex items-center justify-between border-b border-[hsl(var(--line))] pb-2.5">
                  <span className="text-sm font-medium text-[hsl(var(--ink))]">{col.label}</span>
                  <span className="font-mono-meta text-xs text-[hsl(var(--ink-soft))]">
                    {colTasks.length}
                  </span>
                </div>

                <ul className="mt-3.5 space-y-2.5">
                  {colTasks.length === 0 && (
                    <li className="rounded-sm border border-dashed border-[hsl(var(--line))] px-3 py-5 text-center text-xs text-[hsl(var(--ink-soft))]">
                      Nenhuma tarefa aqui
                    </li>
                  )}
                  {colTasks.map((task) => {
                    const assignee = task.assigneeId ? membersById.get(task.assigneeId) : null;
                    return (
                      <li
                        key={task.id}
                        className="group rounded-sm border border-[hsl(var(--line))] bg-[hsl(var(--card))] px-3.5 py-3"
                        style={{
                          borderLeftWidth: "3px",
                          borderLeftColor: `hsl(var(${
                            task.priority === "alta"
                              ? "--brick"
                              : task.priority === "media"
                              ? "--amber"
                              : "--teal"
                          }))`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm leading-snug text-[hsl(var(--ink))]">{task.title}</p>
                          <Circle
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${priorityDot[task.priority]} border-0`}
                            fill="currentColor"
                          />
                        </div>
                        {task.description && (
                          <p className="mt-1 text-xs text-[hsl(var(--ink-soft))] line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="rounded-sm bg-[hsl(var(--paper-alt))] px-1.5 py-0.5 font-mono-meta text-[10px] text-[hsl(var(--ink-soft))]">
                              {task.tag}
                            </span>
                            <span className="font-mono-meta text-[10px] text-[hsl(var(--ink-soft))]">
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                          {assignee ? (
                            <div
                              title={assignee.name}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--navy))] text-[9px] font-medium text-[hsl(var(--amber-soft))]"
                            >
                              {assignee.initials}
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-dashed border-[hsl(var(--line))]" />
                          )}
                        </div>

                        {col.status !== "done" && (
                          <button
                            onClick={() => onAdvanceTask(task.id)}
                            className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-[hsl(var(--amber))] opacity-0 transition-opacity hover:underline group-hover:opacity-100"
                          >
                            Mover para {col.status === "todo" ? "em andamento" : "concluído"}
                            <ArrowRight className="h-3 w-3" strokeWidth={2} />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
