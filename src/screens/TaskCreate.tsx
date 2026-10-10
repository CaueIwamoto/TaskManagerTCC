import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListPlus } from "lucide-react";
import { FieldError, invalidClass } from "@/components/FieldError";
import { api, ApiError } from "@/lib/api";
import { validateTaskForm, type FieldErrors } from "@/lib/validation";
import type { Member, TaskPriority, TaskStatus } from "@/lib/types";

interface TaskCreateProps {
  projectId: string;
  members: Member[];
  onCreated: () => void;
}

const priorities: { value: TaskPriority; label: string; dot: string }[] = [
  { value: "baixa", label: "Baixa", dot: "bg-[hsl(var(--teal))]" },
  { value: "media", label: "Média", dot: "bg-[hsl(var(--amber))]" },
  { value: "alta", label: "Alta", dot: "bg-[hsl(var(--brick))]" },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "A fazer" },
  { value: "doing", label: "Em andamento" },
  { value: "done", label: "Concluído" },
];

const labelClass =
  "text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta";
const fieldClass =
  "border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]";

export function TaskCreate({ projectId, members, onCreated }: TaskCreateProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [assigneeId, setAssigneeId] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("media");
  const [tag, setTag] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clearError = (field: string) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Campos obrigatórios: título, descrição e prazo (o servidor valida de novo).
    const clientErrors = validateTaskForm({ title, description, dueDate });
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.createTask(projectId, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        status,
        assigneeId: assigneeId === "unassigned" ? null : assigneeId,
        priority,
        tag: tag.trim() || "Geral",
      });
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields);
        setFormError(Object.keys(err.fields).length === 0 ? err.message : "");
      } else {
        setFormError("Não foi possível conectar ao servidor. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mx-auto max-w-[560px]">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[hsl(var(--navy))] text-[hsl(var(--amber-soft))]">
            <ListPlus className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
              Nova tarefa
            </p>
            <h1 className="font-display text-[26px] leading-tight text-[hsl(var(--ink))] mt-1">
              Registrar uma nova atividade
            </h1>
          </div>
        </div>

        <form
          className="mt-8 space-y-5 border-t border-[hsl(var(--line))] pt-7"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <Label htmlFor="title" className={labelClass}>
              Título da tarefa *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
              placeholder="Ex.: Revisar capítulo de metodologia"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={`${fieldClass} ${errors.title ? invalidClass : ""}`}
            />
            <FieldError id="title-error" message={errors.title} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className={labelClass}>
              Descrição *
            </Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              placeholder="Detalhes do que precisa ser feito"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
              className={`${fieldClass} resize-none ${errors.description ? invalidClass : ""}`}
            />
            <FieldError id="description-error" message={errors.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus:ring-[hsl(var(--amber))]">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className={labelClass}>
                Prazo *
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  clearError("dueDate");
                }}
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
                className={`${fieldClass} ${errors.dueDate ? invalidClass : ""}`}
              />
              <FieldError id="dueDate-error" message={errors.dueDate} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className={labelClass}>Responsável</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus:ring-[hsl(var(--amber))]">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Sem responsável</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="assigneeId-error" message={errors.assigneeId} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tag" className={labelClass}>
              Categoria
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Ex.: Backend, Documentação, Design..."
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <Label className={labelClass}>Prioridade</Label>
            <RadioGroup
              value={priority}
              onValueChange={(v) => setPriority(v as TaskPriority)}
              className="flex gap-5"
            >
              {priorities.map((p) => (
                <label
                  key={p.value}
                  htmlFor={`priority-${p.value}`}
                  className="flex cursor-pointer items-center gap-2 text-sm text-[hsl(var(--ink))]"
                >
                  <RadioGroupItem value={p.value} id={`priority-${p.value}`} />
                  <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                  {p.label}
                </label>
              ))}
            </RadioGroup>
          </div>

          {formError && (
            <p role="alert" className="text-sm text-[hsl(var(--brick))]">
              {formError}
            </p>
          )}

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
            >
              {submitting ? "Criando..." : "Criar tarefa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
