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
import type { Member, Task, TaskPriority } from "@/lib/types";

interface TaskCreateProps {
  members: Member[];
  onCreate: (task: Omit<Task, "id" | "status">) => void;
}

const priorities: { value: TaskPriority; label: string; dot: string }[] = [
  { value: "baixa", label: "Baixa", dot: "bg-[hsl(var(--teal))]" },
  { value: "media", label: "Média", dot: "bg-[hsl(var(--amber))]" },
  { value: "alta", label: "Alta", dot: "bg-[hsl(var(--brick))]" },
];

export function TaskCreate({ members, onCreate }: TaskCreateProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("media");
  const [tag, setTag] = useState("");

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
          onSubmit={(e) => {
            e.preventDefault();
            if (!title || !dueDate) return;
            onCreate({
              title,
              description,
              assigneeId: assigneeId === "unassigned" ? null : assigneeId,
              dueDate,
              priority,
              tag: tag || "Geral",
            });
            setTitle("");
            setDescription("");
            setAssigneeId("unassigned");
            setDueDate("");
            setPriority("media");
            setTag("");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Título da tarefa
            </Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Revisar capítulo de metodologia"
              className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Descrição
            </Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do que precisa ser feito"
              className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Responsável
              </Label>
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
                Prazo
              </Label>
              <Input
                id="dueDate"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tag" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Categoria
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Ex.: Backend, Documentação, Design..."
              className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Prioridade
            </Label>
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

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              className="bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))]"
            >
              Criar tarefa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
