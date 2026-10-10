import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { ApiError, api, type ApiUser } from "@/lib/api";

interface LoginProps {
  onLogin: (user: ApiUser) => void;
  onGoToRegister: () => void;
}

export function Login({ onLogin, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await api.login({ email, password });
      onLogin(user);
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
      eyebrow="Bem-vindo de volta"
      title="Entrar na conta"
      subtitle="Acesse o painel do seu grupo de TCC."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-[hsl(var(--brick)/0.3)] bg-[hsl(var(--brick-soft))] px-3 py-2.5 text-sm text-[hsl(var(--brick))]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
            E-mail institucional
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome.sobrenome@instituicao.edu.br"
            className="border-[hsl(var(--line))] bg-[hsl(var(--card))] focus-visible:ring-[hsl(var(--amber))]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[hsl(var(--ink-soft))] text-xs uppercase tracking-wide font-mono-meta">
              Senha
            </Label>
            <button
              type="button"
              className="text-xs text-[hsl(var(--amber))] hover:underline underline-offset-2"
            >
              Esqueci a senha
            </button>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
              Entrar
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-[hsl(var(--ink-soft))] mt-8 text-center">
        Ainda não tem conta?{" "}
        <button
          onClick={onGoToRegister}
          className="text-[hsl(var(--amber))] font-medium hover:underline underline-offset-2"
        >
          Criar conta
        </button>
      </p>
    </AuthShell>
  );
}
