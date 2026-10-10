import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { ApiError, api, type ApiUser } from "@/lib/api";

interface RegisterProps {
  onRegister: (user: ApiUser) => void;
  onGoToLogin: () => void;
}

export function Register({ onRegister, onGoToLogin }: RegisterProps) {
  const [form, setForm] = useState({
    name: "",
    institution: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await api.register(form);
      onRegister(user);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível conectar ao servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Comece agora"
      title="Criar conta"
      subtitle="Cadastre-se para organizar o TCC do seu grupo."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-[hsl(var(--brick)/0.3)] bg-[hsl(var(--brick-soft))] px-3 py-2.5 text-sm text-[hsl(var(--brick))]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
            Nome completo
          </Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Como você quer ser chamado no grupo"
            className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="institution" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
            Instituição de ensino
          </Label>
          <Input
            id="institution"
            required
            value={form.institution}
            onChange={update("institution")}
            placeholder="Ex.: Centro Universitário FEI"
            className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
            E-mail institucional
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="nome.sobrenome@instituicao.edu.br"
            className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            placeholder="Mínimo 8 caracteres"
            className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))] h-10.5 mt-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Criar conta
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-[hsl(var(--ink-soft))] mt-8 text-center">
        Já tem uma conta?{" "}
        <button
          onClick={onGoToLogin}
          className="text-[hsl(var(--amber))] font-medium hover:underline underline-offset-2"
        >
          Entrar
        </button>
      </p>
    </AuthShell>
  );
}
