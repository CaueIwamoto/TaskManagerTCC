import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

export function Login({ onLogin, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("arthur.rotkis@fei.edu.br");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      eyebrow="Bem-vindo de volta"
      title="Entrar na conta"
      subtitle="Acesse o painel do seu grupo de TCC."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
      >
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
          className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-soft))] text-[hsl(var(--paper))] h-10.5 mt-2"
        >
          Entrar
          <ArrowRight className="h-4 w-4 ml-1.5" />
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
