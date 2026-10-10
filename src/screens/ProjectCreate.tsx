import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenCheck, ArrowRight, ArrowLeft, Check, Copy, FolderPlus } from "lucide-react";
import { FieldError, invalidClass } from "@/components/FieldError";
import { api, ApiError } from "@/lib/api";
import { validateProjectForm, type FieldErrors } from "@/lib/validation";
import type { ProjectInfo } from "@/lib/types";

interface ProjectCreateProps {
  onCreate: (project: ProjectInfo) => void;
  onBack?: () => void;
}

const emptyForm = {
  name: "",
  description: "",
  deadline: "",
  course: "",
  advisor: "",
  theme: "",
};

export function ProjectCreate({ onCreate, onBack }: ProjectCreateProps) {
  const [form, setForm] = useState(emptyForm);
  // Senha (GUID) gerada pelo sistema: exibida sem censura e não editável.
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadPassword = useCallback(async () => {
    setPasswordError("");
    try {
      const { password } = await api.newProjectPassword();
      setPassword(password);
    } catch {
      setPasswordError("Não foi possível gerar a senha do projeto.");
    }
  }, []);

  useEffect(() => {
    loadPassword();
  }, [loadPassword]);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sem permissão de área de transferência: a senha continua visível para copiar à mão.
    }
  };
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      // Limpa o erro do campo assim que a pessoa volta a editá-lo.
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const { [field]: _removed, ...rest } = prev;
        return rest;
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!password) {
      setFormError("Aguarde a senha do projeto ser gerada.");
      return;
    }

    const clientErrors = validateProjectForm(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { project } = await api.createProject({
        password,
        name: form.name.trim(),
        description: form.description.trim(),
        deadline: form.deadline,
        course: form.course.trim(),
        advisor: form.advisor.trim(),
        theme: form.theme.trim(),
      });
      onCreate(project);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields);
        setFormError(Object.keys(err.fields).length === 0 ? err.message : "");
        if (err.status === 409) loadPassword();
      } else {
        setFormError("Não foi possível conectar ao servidor. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[hsl(var(--paper))] px-6 py-12">
      <div className="mx-auto max-w-[560px]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--ink-soft))] hover:text-[hsl(var(--ink))]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Voltar
          </button>
        )}
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
              Novo projeto
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
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Nome do projeto *
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Ex.: Sistema de Apoio a Bancas de TCC"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))] ${errors.name ? invalidClass : ""}`}
            />
            <FieldError id="name-error" message={errors.name} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Curso (opcional)
              </Label>
              <Input
                id="course"
                value={form.course}
                onChange={update("course")}
                placeholder="Ciência da Computação"
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Prazo final *
              </Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={update("deadline")}
                aria-invalid={!!errors.deadline}
                aria-describedby={errors.deadline ? "deadline-error" : undefined}
                className={`border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))] ${errors.deadline ? invalidClass : ""}`}
              />
              <FieldError id="deadline-error" message={errors.deadline} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="advisor" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Orientador(a) (opcional)
              </Label>
              <Input
                id="advisor"
                value={form.advisor}
                onChange={update("advisor")}
                placeholder="Prof. Dr. ..."
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="theme" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Área/tema (opcional)
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
            <Label htmlFor="projectPassword" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Senha do projeto
            </Label>
            <div className="flex gap-2">
              <Input
                id="projectPassword"
                type="text"
                readOnly
                value={password || "Gerando..."}
                aria-describedby="projectPassword-help"
                className="border-[hsl(var(--line))] bg-[hsl(var(--paper-alt))] font-mono-meta text-[13px] text-[hsl(var(--ink))] focus-visible:ring-[hsl(var(--amber))]"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copyPassword}
                disabled={!password}
                aria-label="Copiar senha do projeto"
                className="shrink-0 border-[hsl(var(--line))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--paper-alt))]"
              >
                {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.75} />}
              </Button>
            </div>
            <p id="projectPassword-help" className="text-xs text-[hsl(var(--ink-soft))]">
              Gerada pelo sistema e não pode ser editada. Compartilhe com o grupo para que entrem no projeto.
            </p>
            {passwordError && (
              <p role="alert" className="text-xs text-[hsl(var(--brick))]">
                {passwordError}{" "}
                <button type="button" onClick={loadPassword} className="underline">
                  Tentar novamente
                </button>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Descrição *
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={update("description")}
              placeholder="Em poucas linhas, qual problema o projeto resolve?"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
              className={`border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))] resize-none ${errors.description ? invalidClass : ""}`}
            />
            <FieldError id="description-error" message={errors.description} />
          </div>

          {formError && (
            <p role="alert" className="text-sm text-[hsl(var(--brick))]">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-between pt-3">
            <p className="text-xs text-[hsl(var(--ink-soft))] font-mono-meta">
              Depois de criar, compartilhe a senha com o grupo
            </p>
            <Button
              type="submit"
              disabled={submitting || !password}
              className="bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
            >
              {submitting ? "Criando..." : "Criar projeto"}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
