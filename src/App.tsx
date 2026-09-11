import { useState } from "react";
import { Login } from "@/screens/Login";
import { Register } from "@/screens/Register";
import { ProjectCreate } from "@/screens/ProjectCreate";
import { MemberAdd } from "@/screens/MemberAdd";
import { TaskCreate } from "@/screens/TaskCreate";
import { ProjectView } from "@/screens/ProjectView";
import { AppShell } from "@/components/AppShell";
import { initialMembers, initialProject, initialTasks } from "@/lib/mockData";
import type { Member, ProjectInfo, Screen, Task } from "@/lib/types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [onboarding, setOnboarding] = useState(false);

  const [project, setProject] = useState<ProjectInfo>(initialProject);
  const [members, setMembers] = useState<Member[]>(initialMembers.slice(0, 1));
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const goTo = (s: Screen) => setScreen(s);

  const handleLogin = () => {
    setMembers(initialMembers);
    setScreen("project-view");
  };

  const handleRegister = () => {
    setOnboarding(true);
    setMembers([initialMembers[0]]);
    setScreen("create-project");
  };

  const handleCreateProject = (p: ProjectInfo) => {
    setProject(p);
    setTasks([]);
    setScreen("add-members");
  };

  const handleAddMember = (member: Member) => {
    setMembers((prev) => (prev.some((m) => m.id === member.id) ? prev : [...prev, member]));
  };

  const handleCreateTask = (task: Omit<Task, "id" | "status">) => {
    const newTask: Task = { ...task, id: `t${Date.now()}`, status: "todo" };
    setTasks((prev) => [newTask, ...prev]);
    setScreen("project-view");
  };

  const handleAdvanceTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = t.status === "todo" ? "doing" : t.status === "doing" ? "done" : "done";
        return { ...t, status: next };
      })
    );
  };

  const handleLogout = () => {
    setOnboarding(false);
    setScreen("login");
  };

  if (screen === "login") {
    return <Login onLogin={handleLogin} onGoToRegister={() => goTo("register")} />;
  }

  if (screen === "register") {
    return <Register onRegister={handleRegister} onGoToLogin={() => goTo("login")} />;
  }

  if (screen === "create-project") {
    return <ProjectCreate onCreate={handleCreateProject} />;
  }

  const internalScreen = () => {
    switch (screen) {
      case "add-members":
        return (
          <MemberAdd
            members={members}
            onAddMember={handleAddMember}
            onContinue={() => {
              setOnboarding(false);
              setScreen("project-view");
            }}
            isOnboarding={onboarding}
          />
        );
      case "create-task":
        return <TaskCreate members={members} onCreate={handleCreateTask} />;
      case "project-view":
      default:
        return (
          <ProjectView
            project={project}
            members={members}
            tasks={tasks}
            onAdvanceTask={handleAdvanceTask}
            onAddMembers={() => goTo("add-members")}
            onCreateTask={() => goTo("create-task")}
          />
        );
    }
  };

  return (
    <AppShell active={screen} projectName={project.name} onNavigate={goTo} onLogout={handleLogout}>
      {internalScreen()}
    </AppShell>
  );
}
