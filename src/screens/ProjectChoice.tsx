import { ArrowRight, CheckCircle2, DoorOpen, FolderPlus, X } from "lucide-react";

interface ProjectChoiceProps {
  userName: string;
  /** Mensagem de sucesso (ex.: cadastro concluído) exibida no topo. */
  notice?: string | null;
  onDismissNotice?: () => void;
  onCreate: () => void;
  onJoin: () => void;
}

const options = [
  {
    key: "create",
    icon: FolderPlus,
    title: "Criar Projeto",
    description:
      "Comece um novo projeto de TCC: defina nome, descrição e prazo, e receba uma senha para convidar seu grupo.",
  },
  {
    key: "join",
    icon: DoorOpen,
    title: "Entrar no Projeto",
    description:
      "Já tem um grupo? Informe a senha do projeto que um integrante compartilhou com você para participar.",
  },
] as const;

export function ProjectChoice({
  userName,
  notice,
  onDismissNotice,
  onCreate,
  onJoin,
}: ProjectChoiceProps) {
  const firstName = userName.trim().split(/\s+/)[0] || "";
  const handlers = { create: onCreate, join: onJoin };

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mx-auto max-w-[1100px]">
        {notice && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-sm border border-[hsl(var(--teal))] bg-[hsl(var(--teal-soft))] px-4 py-3 text-sm text-[hsl(var(--teal))]"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="flex-1">{notice}</span>
            {onDismissNotice && (
              <button
                type="button"
                onClick={onDismissNotice}
                aria-label="Fechar aviso"
                className="shrink-0 rounded-sm p-0.5 hover:bg-[hsl(var(--teal)/0.12)]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        )}
        <div className="border-b border-[hsl(var(--line))] pb-7">
          <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--amber))]">
            Visão geral
          </p>
          <h1 className="font-display text-[30px] leading-tight text-[hsl(var(--ink))] mt-1">
            {firstName ? `Bem-vindo(a), ${firstName}` : "Bem-vindo(a)"}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-[hsl(var(--ink-soft))]">
            Para começar, crie um projeto novo ou entre em um que já existe.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {options.map(({ key, icon: Icon, title, description }) => (
            <button
              key={key}
              type="button"
              onClick={handlers[key]}
              className="group flex flex-col items-start rounded-sm border border-[hsl(var(--line))] bg-[hsl(var(--card))] p-6 text-left transition-colors hover:border-[hsl(var(--amber))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--amber))]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[hsl(var(--navy))] text-[hsl(var(--amber-soft))]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h2 className="font-display mt-5 text-[22px] leading-tight text-[hsl(var(--ink))]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--ink-soft))]">
                {description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-[hsl(var(--amber))]">
                {title}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
