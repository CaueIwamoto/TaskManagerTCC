import type { ReactNode } from "react";
import { BookOpenCheck } from "lucide-react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-[hsl(var(--paper))] lg:flex">
      {/* Painel esquerdo — identidade */}
      <div className="relative hidden lg:flex lg:w-[42%] flex-col justify-between bg-[hsl(var(--navy))] text-[hsl(var(--paper))] px-12 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 27px, hsl(var(--paper)) 28px)",
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <BookOpenCheck className="h-5 w-5 text-[hsl(var(--amber-soft))]" strokeWidth={1.75} />
          <span className="font-display text-lg tracking-tight">TCC+</span>
        </div>

        <div className="relative max-w-sm">
          <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber-soft))]">
            Caderno de projeto — 2026
          </p>
          <p className="font-display text-[28px] leading-[1.25] mt-4 text-[hsl(var(--paper))]">
            "Um TCC bem organizado não termina no susto da entrega — termina na apresentação."
          </p>
          <p className="text-sm text-[hsl(var(--paper)/0.6)] mt-5">
            Planejamento, tarefas e prazos do grupo em um só lugar, do projeto de pesquisa à banca final.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-[11px] font-mono-meta text-[hsl(var(--paper)/0.45)] uppercase tracking-[0.1em]">
          <span>Cronograma</span>
          <span>Responsáveis</span>
          <span>Entregas</span>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-2 flex items-center gap-2.5 lg:hidden">
            <BookOpenCheck className="h-5 w-5 text-[hsl(var(--amber))]" strokeWidth={1.75} />
            <span className="font-display text-lg tracking-tight text-[hsl(var(--ink))]">TCC+</span>
          </div>
          <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))] mt-8 lg:mt-0">
            {eyebrow}
          </p>
          <h1 className="font-display text-[32px] leading-tight text-[hsl(var(--ink))] mt-2">
            {title}
          </h1>
          <p className="text-sm text-[hsl(var(--ink-soft))] mt-2 mb-9">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
