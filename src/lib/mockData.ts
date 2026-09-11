import type { Member, ProjectInfo, Task } from "./types";

export const initialProject: ProjectInfo = {
  name: "Sistema de Apoio a Bancas de TCC",
  course: "Ciência da Computação",
  advisor: "Profa. Dra. Renata Aoki",
  theme: "Gestão acadêmica",
  description:
    "Plataforma web para automatizar o agendamento de bancas, distribuição de avaliadores e consolidação de notas do TCC.",
  deadline: "2026-12-04",
};

export const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Arthur Rotkis",
    email: "arthur.rotkis@fei.edu.br",
    course: "Ciência da Computação",
    semester: "7º semestre",
    role: "integrante",
    initials: "AR",
  },
  {
    id: "m2",
    name: "Renata Aoki",
    email: "renata.aoki@fei.edu.br",
    course: "Orientadora",
    semester: "Docente",
    role: "orientador",
    initials: "RA",
  },
];

// Candidatos disponíveis na busca da tela "Adicionar membro"
export const searchableStudents: Member[] = [
  {
    id: "s1",
    name: "Beatriz Nogueira",
    email: "beatriz.nogueira@fei.edu.br",
    course: "Ciência da Computação",
    semester: "7º semestre",
    role: "integrante",
    initials: "BN",
  },
  {
    id: "s2",
    name: "Caio Mendonça",
    email: "caio.mendonca@fei.edu.br",
    course: "Engenharia da Computação",
    semester: "8º semestre",
    role: "integrante",
    initials: "CM",
  },
  {
    id: "s3",
    name: "Julia Prado",
    email: "julia.prado@fei.edu.br",
    course: "Ciência da Computação",
    semester: "7º semestre",
    role: "integrante",
    initials: "JP",
  },
  {
    id: "s4",
    name: "Lucas Tanaka",
    email: "lucas.tanaka@fei.edu.br",
    course: "Sistemas de Informação",
    semester: "6º semestre",
    role: "integrante",
    initials: "LT",
  },
  {
    id: "s5",
    name: "Marina Castro",
    email: "marina.castro@fei.edu.br",
    course: "Ciência da Computação",
    semester: "7º semestre",
    role: "integrante",
    initials: "MC",
  },
  {
    id: "s6",
    name: "Pedro Villela",
    email: "pedro.villela@fei.edu.br",
    course: "Engenharia da Computação",
    semester: "8º semestre",
    role: "integrante",
    initials: "PV",
  },
];

export const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Levantar requisitos com orientadora",
    description: "Reunião para alinhar escopo do MVP e critérios de avaliação da banca.",
    assigneeId: "m1",
    dueDate: "2026-09-18",
    priority: "alta",
    status: "done",
    tag: "Planejamento",
  },
  {
    id: "t2",
    title: "Modelar banco de dados",
    description: "Definir entidades de projeto, tarefa, membro e cronograma.",
    assigneeId: "m1",
    dueDate: "2026-09-25",
    priority: "alta",
    status: "doing",
    tag: "Backend",
  },
  {
    id: "t3",
    title: "Protótipo de telas no Figma",
    description: "Wireframes de login, dashboard e criação de tarefas.",
    assigneeId: null,
    dueDate: "2026-09-30",
    priority: "media",
    status: "doing",
    tag: "Design",
  },
  {
    id: "t4",
    title: "Redigir capítulo de fundamentação teórica",
    description: "Revisão bibliográfica sobre gestão de projetos acadêmicos.",
    assigneeId: null,
    dueDate: "2026-10-10",
    priority: "media",
    status: "todo",
    tag: "Documentação",
  },
  {
    id: "t5",
    title: "Configurar ambiente de testes",
    description: "Pipeline de CI com testes automatizados no backend.",
    assigneeId: null,
    dueDate: "2026-10-15",
    priority: "baixa",
    status: "todo",
    tag: "Infra",
  },
];
