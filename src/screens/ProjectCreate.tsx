import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenCheck, ArrowRight, FolderPlus } from "lucide-react";
import type { ProjectInfo } from "@/lib/types";

interface ProjectCreateProps {
  onCreate: (project: ProjectInfo) => void;
}

export function ProjectCreate({ onCreate }: ProjectCreateProps) {
  const [form, setForm] = useState<ProjectInfo>({
    name: "",
    course: "",
    advisor: "",
    theme: "",
    description: "",
    deadline: "",
  });

  const update =
    (field: keyof ProjectInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen w-full bg-[hsl(var(--paper))] px-6 py-12">
      <div className="mx-auto max-w-[560px]">
        <div className="flex items-center gap-2.5 text-[hsl(var(--ink))]">
          <BookOpenCheck className="h-5 w-5 text-[hsl(var(--amber))]" strokeWidth={1.75} />
          <span className="font-display text-lg tracking-tight">TCC+</span>
        </div>

        <div className="mt-9 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[hsl(var(--navy))] text-[hsl(var(--amber-soft))]">
            <FolderPlus className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
              Passo 1 de 2 — Projeto
            </p>
            <h1 className="font-display text-[28px] leading-tight text-[hsl(var(--ink))] mt-1">
              Configure o projeto do seu TCC
            </h1>
            <p className="text-sm text-[hsl(var(--ink-soft))] mt-1.5 max-w-md">
              Essas informações aparecem no painel do grupo e ajudam a orientadora a acompanhar o andamento.
            </p>
          </div>
        </div>

        <form
          className="mt-9 space-y-5 border-t border-[hsl(var(--line))] pt-8"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(form);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Nome do projeto
            </Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Ex.: Sistema de Apoio a Bancas de TCC"
              className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Curso
              </Label>
              <Input
                id="course"
                required
                value={form.course}
                onChange={update("course")}
                placeholder="Ciência da Computação"
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Prazo final
              </Label>
              <Input
                id="deadline"
                type="date"
                required
                value={form.deadline}
                onChange={update("deadline")}
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="advisor" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Orientador(a)
              </Label>
              <Input
                id="advisor"
                required
                value={form.advisor}
                onChange={update("advisor")}
                placeholder="Prof. Dr. ..."
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="theme" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Área/tema
              </Label>
              <Input
                id="theme"
                value={form.theme}
                onChange={update("theme")}
                placeholder="Ex.: Gestão acadêmica"
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Descrição resumida
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={update("description")}
              placeholder="Em poucas linhas, qual problema o projeto resolve?"
              className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <p className="text-xs text-[hsl(var(--ink-soft))] font-mono-meta">
              Próximo: adicionar integrantes ao grupo
            </p>
            <Button
              type="submit"
              className="bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
            >
              Criar projeto
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
