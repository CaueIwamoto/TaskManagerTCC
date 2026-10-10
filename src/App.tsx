import { useEffect, useState } from "react";
import { Login } from "@/screens/Login";
import { Register } from "@/screens/Register";
import { ProjectChoice } from "@/screens/ProjectChoice";
import { ProjectJoin } from "@/screens/ProjectJoin";
import { ProjectCreate } from "@/screens/ProjectCreate";
import { MemberAdd } from "@/screens/MemberAdd";
import { TaskCreate } from "@/screens/TaskCreate";
import { ProjectView } from "@/screens/ProjectView";
import { AppShell } from "@/components/AppShell";
import { api, type ApiUser } from "@/lib/api";
import type { ProjectInfo, Screen } from "@/lib/types";
import { BookOpenCheck } from "lucide-react";

export default function App() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [onboarding, setOnboarding] = useState(false);
  const [project, setProject] = useState<ProjectInfo | null>(null);

  // Depois de autenticar, busca os projetos da pessoa. Se ela já participa de
  // algum, abre o mais recente; senão, mostra a escolha criar/entrar.
  const enterApp = async (user: ApiUser) => {
    setCurrentUser(user);
    try {
      const { projects } = await api.listProjects();
      if (projects.length > 0) {
        setProject(projects[0]);
        setOnboarding(false);
        setScreen("project-view");
        return;
      }
    } catch {
      // Se a consulta falhar, cai na escolha criar/entrar.
    }
    setProject(null);
    setOnboarding(false);
    setScreen("project-choice");
  };

  // Ao carregar o app, verifica se já existe uma sessão válida (cookie
  // httpOnly emitido pelo backend) antes de decidir a tela inicial.
  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then(async ({ user }) => {
        if (cancelled) return;
        await enterApp(user);
      })
      .catch(() => {
        // Sem sessão ativa — permanece na tela de login.
      })
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = (s: Screen) => setScreen(s);

  const handleRegister = (user: ApiUser) => {
    setCurrentUser(user);
    setProject(null);
    setOnboarding(false);
    setScreen("project-choice");
  };

  const handleCreateProject = (p: ProjectInfo) => {
    setProject(p);
    setOnboarding(true);
    setScreen("add-members");
  };

  const handleJoinProject = (p: ProjectInfo) => {
    setProject(p);
    setOnboarding(false);
    setScreen("project-view");
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Mesmo que a chamada falhe, derruba a sessão localmente.
    }
    setCurrentUser(null);
    setProject(null);
    setOnboarding(false);
    setScreen("login");
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[hsl(var(--paper))]">
        <BookOpenCheck
          className="h-6 w-6 animate-pulse text-[hsl(var(--amber))]"
          strokeWidth={1.75}
        />
      </div>
    );
  }

  if (screen === "login") {
    return <Login onLogin={enterApp} onGoToRegister={() => goTo("register")} />;
  }

  if (screen === "register") {
    return <Register onRegister={handleRegister} onGoToLogin={() => goTo("login")} />;
  }

  if (screen === "create-project") {
    return (
      <ProjectCreate
        onCreate={handleCreateProject}
        onBack={project ? undefined : () => goTo("project-choice")}
      />
    );
  }

  // Sem projeto: escolha entre criar ou entrar (mesmo layout da visão geral).
  if (!project) {
    return (
      <AppShell
        active={screen}
        projectName={null}
        userName={currentUser?.name ?? "Convidado"}
        userSubtitle={currentUser?.institution ?? ""}
        onNavigate={goTo}
        onLogout={handleLogout}
      >
        {screen === "join-project" ? (
          <ProjectJoin onJoined={handleJoinProject} onBack={() => goTo("project-choice")} />
        ) : (
          <ProjectChoice
            userName={currentUser?.name ?? ""}
            onCreate={() => goTo("create-project")}
            onJoin={() => goTo("join-project")}
          />
        )}
      </AppShell>
    );
  }

  const internalScreen = () => {
    switch (screen) {
      case "add-members":
        return (
          <MemberAdd
            project={project}
            onProjectChange={setProject}
            onContinue={() => {
              setOnboarding(false);
              setScreen("project-view");
            }}
            isOnboarding={onboarding}
          />
        );
      case "create-task":
        return (
          <TaskCreate
            projectId={project.id}
            members={project.members}
            onCreated={() => setScreen("project-view")}
          />
        );
      case "project-view":
      default:
        return (
          <ProjectView
            project={project}
            onAddMembers={() => goTo("add-members")}
            onCreateTask={() => goTo("create-task")}
          />
        );
    }
  };

  return (
    <AppShell
      active={screen}
      projectName={project.name}
      userName={currentUser?.name ?? "Convidado"}
      userSubtitle={currentUser?.institution ?? ""}
      onNavigate={goTo}
      onLogout={handleLogout}
    >
      {internalScreen()}
    </AppShell>
  );
}
