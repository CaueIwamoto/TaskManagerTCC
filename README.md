# TCC+ — Front-end + Backend (auth, projetos, membros e tarefas)

Protótipo de front-end (React) para o app TCC+ (gestão de projetos de TCC em grupo),
agora com um backend real para cadastro, login e sessão.

## Estrutura

```
tcc-plus/
├── src/            # front-end (React + Vite + Tailwind + shadcn/ui)
└── server/         # backend (Express + TypeScript)
```

## Telas do front-end

- `src/screens/Login.tsx` — login (integrado ao backend)
- `src/screens/Register.tsx` — cadastro (integrado ao backend)
- `src/screens/ProjectCreate.tsx` — criação de projeto
- `src/screens/MemberAdd.tsx` — busca/adicionar membro
- `src/screens/TaskCreate.tsx` — criação de tarefa
- `src/screens/ProjectView.tsx` — visualização do projeto (dashboard + quadro por status)

Projetos, membros e tarefas agora vêm do backend (o antigo `mockData.ts` foi
removido). A navegação entre telas está em `src/App.tsx`.

- **Após o cadastro:** tela "Visão geral" com dois botões — *Criar Projeto* (formulário
  com o campo **Senha do projeto**, um GUID gerado pelo sistema, visível e não editável)
  e *Entrar no Projeto* (pede a senha; correta → Visão geral, errada → "Senha incorreta.").
- **Criar projeto:** nome, descrição e prazo são obrigatórios; curso, orientador(a)
  e área/tema são opcionais.
- **Membros:** a busca consulta usuários reais cadastrados (`GET /api/users/search`)
  e "Adicionar" vincula o usuário ao projeto.
- **Criar tarefa:** título, descrição e prazo obrigatórios; status (padrão "A fazer"),
  responsável, categoria e prioridade opcionais. Erros aparecem por campo.
- **Acompanhar projeto:** o quadro consulta as tarefas no backend, com estados de
  carregando/erro/tentar novamente; mover de coluna grava o status (com rollback
  se o servidor recusar).

## Backend (`server/`)

API de autenticação em Express + TypeScript:

- `POST /api/auth/register` — cria o usuário (bcrypt no hash da senha) e já
  abre sessão
- `POST /api/auth/login` — valida e-mail/senha e abre sessão
- `POST /api/auth/logout` — encerra a sessão
- `GET  /api/auth/me` — retorna o usuário da sessão atual (usado pelo
  front-end para manter o login entre recarregamentos de página)

### Projetos, membros e tarefas (requerem sessão)

| Método | Rota | O que faz |
| --- | --- | --- |
| `GET` | `/api/projects/new-password` | Gera o GUID mostrado (somente leitura) no formulário "Criar projeto" |
| `POST` | `/api/projects/join` | Entra em um projeto pela senha (`password`); senha errada → `403 "Senha incorreta."` (máx. 20 tentativas/15 min) |
| `POST` | `/api/projects` | Cria projeto (`name`, `description`, `deadline` obrigatórios); o criador vira membro |
| `GET` | `/api/projects` | Lista os projetos do usuário logado |
| `GET` | `/api/projects/:id` | Detalhe do projeto com membros |
| `POST` | `/api/projects/:id/members` | Adiciona usuário ao projeto (`userId`, `role` opcional) |
| `GET` | `/api/users/search?q=` | Busca usuários por nome/e-mail (exclui você mesmo) |
| `GET` | `/api/projects/:id/tasks?status=` | Consulta tarefas do projeto (filtro opcional por status) |
| `POST` | `/api/projects/:id/tasks` | Cria tarefa (`title`, `description`, `dueDate` obrigatórios; `status` padrão `todo`) |
| `PATCH` | `/api/tasks/:id` | Atualiza campos da tarefa (ex.: `status`) |

Regras: só membros do projeto enxergam/alteram suas tarefas (quem não é membro
recebe 404, sem revelar que o projeto existe); o responsável da tarefa precisa
ser membro; datas são `AAAA-MM-DD` e precisam existir de verdade; status ∈
`todo | doing | done`; prioridade ∈ `baixa | media | alta`. Erros de validação
voltam como `400 { error, fields }`, onde `fields` mapeia cada campo à sua mensagem.

**Sessão:** JWT assinado em cookie `httpOnly` (7 dias), então não fica
acessível via JavaScript no navegador — mitiga XSS roubando token.
**Senhas:** hash com bcrypt, nunca armazenadas em texto puro.
**Validação:** schemas Zod no backend (nome, instituição, e-mail, senha ≥ 8
caracteres) — a validação de verdade vive no servidor, o front-end só evita
o round-trip óbvio.
**Rate limit:** 10 tentativas de login a cada 15 min por IP.
**Dados:** arquivo JSON local (`server/data/db.json`, via `lowdb`) — zero
dependência nativa para compilar, fácil de rodar em qualquer máquina. Para
produção de verdade, troque `server/src/db.ts` por Prisma + Postgres (ou
outro banco) — é a única "fronteira" de acesso a dados usada pelas rotas.

## Como rodar

Em dois terminais:

```bash
# Terminal 1 — backend
cd server
cp .env.example .env
npm install
npm run dev        # http://localhost:4000

# Terminal 2 — frontend
npm install
npm run dev         # http://localhost:5173
```

O Vite já está configurado para redirecionar `/api/*` para `localhost:4000`
em desenvolvimento (`vite.config.ts`), então o front-end não precisa saber
a porta do backend nem lidar com CORS — tudo parece same-origin do ponto de
vista do navegador.

### Build de produção

```bash
cd server && npm run build && npm start   # API compilada em dist/
npm run build                              # front-end estático em dist/
```

Em produção, sirva o front-end estático separadamente do backend e defina:
- `VITE_API_URL` no build do front-end (ex.: `https://api.seudominio.com/api`)
- `CLIENT_ORIGIN` no backend (origem do front-end, para o CORS)
- `JWT_SECRET` forte e `NODE_ENV=production` (ativa o cookie `secure`,
  exigindo HTTPS)

## Stack

- Front-end: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + lucide-react
- Backend: Express + TypeScript + bcryptjs + jsonwebtoken + zod + lowdb
