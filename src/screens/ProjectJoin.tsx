import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, DoorOpen } from "lucide-react";
import { FieldError, invalidClass } from "@/components/FieldError";
import { api, ApiError } from "@/lib/api";
import type { ProjectInfo } from "@/lib/types";

interface ProjectJoinProps {
  onJoined: (project: ProjectInfo) => void;
  onBack: () => void;
}

export function ProjectJoin({ onJoined, onBack }: ProjectJoinProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Informe a senha do projeto");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const { project } = await api.joinProject(password.trim());
      onJoined(project); // senha correta → Visão geral
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível conectar ao servidor. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mx-auto max-w-[560px]">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--ink-soft))] hover:text-[hsl(var(--ink))]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          Voltar
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[hsl(var(--navy))] text-[hsl(var(--amber-soft))]">
            <DoorOpen className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
              Entrar no projeto
            </p>
            <h1 className="font-display text-[26px] leading-tight text-[hsl(var(--ink))] mt-1">
              Informe a senha do projeto
            </h1>
            <p className="text-sm text-[hsl(var(--ink-soft))] mt-1.5 max-w-md">
              Peça a senha para quem criou o projeto do seu grupo.
            </p>
          </div>
        </div>

        <form
          className="mt-8 space-y-5 border-t border-[hsl(var(--line))] pt-7"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="joinPassword"
              className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta"
            >
              Senha do projeto
            </Label>
            <Input
              id="joinPassword"
              type="text"
              autoComplete="off"
              autoFocus
              spellCheck={false}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              aria-invalid={!!error}
              aria-describedby={error ? "joinPassword-error" : undefined}
              className={`border-[hsl(var(--line))] bg-[hsl(var(--card))] font-mono-meta text-[13px] focus-visible:ring-[hsl(var(--amber))] ${error ? invalidClass : ""}`}
            />
            <FieldError id="joinPassword-error" message={error} />
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
            >
              {submitting ? "Verificando..." : "Entrar no projeto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
