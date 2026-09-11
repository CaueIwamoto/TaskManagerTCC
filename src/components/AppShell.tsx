import type { ReactNode } from "react";
import {
  BookOpenCheck,
  LayoutDashboard,
  Users,
  ListPlus,
  LogOut,
} from "lucide-react";
import type { Screen } from "@/lib/types";

interface AppShellProps {
  active: Screen;
  projectName: string;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  children: ReactNode;
}

const navItems: { screen: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { screen: "project-view", label: "Visão geral", icon: LayoutDashboard },
  { screen: "add-members", label: "Membros", icon: Users },
  { screen: "create-task", label: "Nova tarefa", icon: ListPlus },
];

export function AppShell({ active, projectName, onNavigate, onLogout, children }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-[hsl(var(--paper))] lg:flex">
      <aside className="flex lg:w-[248px] shrink-0 flex-col justify-between bg-[hsl(var(--navy))] px-5 py-6">
        <div>
          <div className="flex items-center gap-2.5 px-1.5">
            <BookOpenCheck className="h-5 w-5 text-[hsl(var(--amber-soft))]" strokeWidth={1.75} />
            <span className="font-display text-lg tracking-tight text-[hsl(var(--paper))]">
              TCC+
            </span>
          </div>

          <div className="mt-7 mb-1 px-1.5">
            <p className="font-mono-meta text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--paper)/0.4)]">
              Projeto atual
            </p>
            <p className="text-sm text-[hsl(var(--paper)/0.92)] mt-1 leading-snug line-clamp-2">
              {projectName}
            </p>
          </div>

          <nav className="mt-6 space-y-0.5">
            {navItems.map(({ screen, label, icon: Icon }) => {
              const isActive = active === screen;
              return (
                <button
                  key={screen}
                  onClick={() => onNavigate(screen)}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-[hsl(var(--paper)/0.1)] text-[hsl(var(--paper))]"
                      : "text-[hsl(var(--paper)/0.62)] hover:bg-[hsl(var(--paper)/0.06)] hover:text-[hsl(var(--paper)/0.9)]"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  {label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(var(--amber))]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="h-px bg-[hsl(var(--paper)/0.1)]" />
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--amber-soft))] text-[11px] font-medium text-[hsl(var(--navy))]">
              AR
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-[hsl(var(--paper)/0.9)]">Arthur Rotkis</p>
              <p className="truncate text-[11px] text-[hsl(var(--paper)/0.45)]">7º semestre</p>
            </div>
            <button
              onClick={onLogout}
              aria-label="Sair da conta"
              className="ml-auto rounded-sm p-1.5 text-[hsl(var(--paper)/0.45)] hover:bg-[hsl(var(--paper)/0.08)] hover:text-[hsl(var(--paper)/0.85)]"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
