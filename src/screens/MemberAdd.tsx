import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Check, GraduationCap } from "lucide-react";
import type { Member } from "@/lib/types";
import { searchableStudents } from "@/lib/mockData";

interface MemberAddProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onContinue: () => void;
  isOnboarding: boolean;
}

export function MemberAdd({ members, onAddMember, onContinue, isOnboarding }: MemberAddProps) {
  const [query, setQuery] = useState("");

  const memberIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchableStudents;
    return searchableStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mx-auto max-w-[880px]">
        <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
          {isOnboarding ? "Passo 2 de 2 — Equipe" : "Membros"}
        </p>
        <h1 className="font-display text-[28px] leading-tight text-[hsl(var(--ink))] mt-1">
          Adicionar integrantes ao grupo
        </h1>
        <p className="text-sm text-[hsl(var(--ink-soft))] mt-1.5 max-w-lg">
          Busque colegas cadastrados pelo nome ou e-mail institucional para vincular ao projeto.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--ink-soft))]"
                strokeWidth={1.75}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] pl-9 focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>

            <ul className="mt-4 divide-y divide-[hsl(var(--line))] border-y border-[hsl(var(--line))]">
              {results.length === 0 && (
                <li className="py-8 text-center text-sm text-[hsl(var(--ink-soft))]">
                  Nenhum estudante encontrado para "{query}".
                </li>
              )}
              {results.map((student) => {
                const added = memberIds.has(student.id);
                return (
                  <li key={student.id} className="flex items-center gap-3.5 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--paper-deep))] text-[12px] font-medium text-[hsl(var(--ink))]">
                      {student.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[hsl(var(--ink))]">{student.name}</p>
                      <p className="truncate text-xs text-[hsl(var(--ink-soft))] font-mono-meta">
                        {student.email}
                      </p>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1 text-xs text-[hsl(var(--ink-soft))] sm:flex">
                      <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {student.course}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant={added ? "secondary" : "outline"}
                      disabled={added}
                      onClick={() => onAddMember(student)}
                      className={
                        added
                          ? "border-none bg-[hsl(var(--teal-soft))] text-[hsl(var(--teal))] hover:bg-[hsl(var(--teal-soft))]"
                          : "border-[hsl(var(--line))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--paper-alt))]"
                      }
                    >
                      {added ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" strokeWidth={2} />
                          Adicionado
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5 mr-1" strokeWidth={1.75} />
                          Adicionar
                        </>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="font-mono-meta text-[11px] uppercase tracking-[0.12em] text-[hsl(var(--ink-soft))]">
              Equipe atual · {members.length}
            </p>
            <ul className="mt-3 space-y-2.5">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--navy))] text-[11px] font-medium text-[hsl(var(--amber-soft))]">
                    {m.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[hsl(var(--ink))]">{m.name}</p>
                    <p className="text-[11px] text-[hsl(var(--ink-soft))] font-mono-meta">
                      {m.role === "orientador" ? "Orientador(a)" : "Integrante"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {isOnboarding && (
              <Button
                onClick={onContinue}
                className="mt-7 w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
              >
                Ir para o projeto
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
