// Validação no cliente: só evita o round-trip óbvio. As mesmas regras (e
// mensagens) são aplicadas de verdade no servidor (server/src/utils/validation.ts).

export type FieldErrors = Record<string, string>;

function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function validateProjectForm(form: {
  name: string;
  description: string;
  deadline: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Informe o nome do projeto";
  if (!form.description.trim()) errors.description = "Informe a descrição do projeto";
  if (!form.deadline.trim()) errors.deadline = "Informe o prazo final do projeto";
  else if (!isRealDate(form.deadline)) errors.deadline = "Data inválida";
  return errors;
}

export function validateTaskForm(form: {
  title: string;
  description: string;
  dueDate: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.title.trim()) errors.title = "Informe o título da tarefa";
  if (!form.description.trim()) errors.description = "Informe a descrição da tarefa";
  if (!form.dueDate.trim()) errors.dueDate = "Informe o prazo da tarefa";
  else if (!isRealDate(form.dueDate)) errors.dueDate = "Data inválida";
  return errors;
}
