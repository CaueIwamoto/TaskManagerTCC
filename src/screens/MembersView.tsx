import { GraduationCap } from "lucide-react";
import type { ProjectInfo } from "@/lib/types";

interface MembersViewProps {
  project: ProjectInfo;
}

export function MembersView({ project }: MembersViewProps) {
  const members = project.members;

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mx-auto max-w-[880px]">
        <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
          Membros
        </p>
        <h1 className="font-display text-[28px] leading-tight text-[hsl(var(--ink))] mt-1">
          Visualizar membros
        </h1>
        <p className="text-sm text-[hsl(var(--ink-soft))] mt-1.5 max-w-lg">
          Integrantes vinculados ao projeto {project.name}.
        </p>

        <p className="mt-8 font-mono-meta text-[11px] uppercase tracking-[0.12em] text-[hsl(var(--ink-soft))]">
          Equipe atual · {members.length}
        </p>

        <ul className="mt-3 divide-y divide-[hsl(var(--line))] border-y border-[hsl(var(--line))]">
          {members.length === 0 && (
            <li className="py-8 text-center text-sm text-[hsl(var(--ink-soft))]">
              Nenhum membro neste projeto.
            </li>
          )}
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3.5 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--navy))] text-[12px] font-medium text-[hsl(var(--amber-soft))]">
                {m.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[hsl(var(--ink))]">{m.name}</p>
                <p className="truncate text-xs text-[hsl(var(--ink-soft))] font-mono-meta">
                  {m.email}
                </p>
              </div>
              {m.institution && (
                <span className="hidden shrink-0 items-center gap-1 text-xs text-[hsl(var(--ink-soft))] sm:flex">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {m.institution}
                </span>
              )}
              <span className="shrink-0 rounded-sm bg-[hsl(var(--paper-alt))] px-1.5 py-0.5 font-mono-meta text-[10px] text-[hsl(var(--ink-soft))]">
                {m.role === "orientador" ? "Orientador(a)" : "Integrante"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
