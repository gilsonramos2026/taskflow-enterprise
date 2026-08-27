import { Loader2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { TaskPriority, TaskStatus, type Task } from "../types/task";

export interface TaskFormValues {
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
}

interface TaskFormModalProps {
  isOpen: boolean;
  task: Task | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

const EMPTY_FORM: TaskFormValues = {
  title: "",
  description: "",
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
};

type FormErrors = Partial<Record<keyof TaskFormValues, string>>;

function validate(values: TaskFormValues): FormErrors {
  const errors: FormErrors = {};

  const trimmedTitle = values.title.trim();
  if (trimmedTitle.length === 0) {
    errors.title = "O titulo e obrigatorio.";
  } else if (trimmedTitle.length < 3) {
    errors.title = "O titulo deve ter pelo menos 3 caracteres.";
  } else if (trimmedTitle.length > 150) {
    errors.title = "O titulo deve ter no maximo 150 caracteres.";
  }

  if (values.description.length > 2000) {
    errors.description = "A descricao deve ter no maximo 2000 caracteres.";
  }

  return errors;
}

export function TaskFormModal({ isOpen, task, isSubmitting, onClose, onSubmit }: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setValues(
        task
          ? {
              title: task.title,
              description: task.description ?? "",
              status: task.status,
              priority: task.priority,
            }
          : EMPTY_FORM,
      );
      setErrors({});
    }
  }, [isOpen, task]);

  if (!isOpen) {
    return null;
  }

  const isEditMode = task !== null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              Titulo
            </label>
            <input
              id="title"
              type="text"
              value={values.title}
              onChange={(event) => setValues((previous) => ({ ...previous, title: event.target.value }))}
              className={`rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                errors.title
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                  : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
              }`}
              placeholder="Ex: Implementar autenticacao JWT"
            />
            {errors.title && <span className="text-xs text-rose-600">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Descricao
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(event) => setValues((previous) => ({ ...previous, description: event.target.value }))}
              rows={3}
              className={`resize-none rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                errors.description
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                  : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
              }`}
              placeholder="Detalhes adicionais sobre a tarefa (opcional)"
            />
            {errors.description && <span className="text-xs text-rose-600">{errors.description}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-sm font-medium text-slate-700">
                Prioridade
              </label>
              <select
                id="priority"
                value={values.priority}
                onChange={(event) =>
                  setValues((previous) => ({ ...previous, priority: event.target.value as Task["priority"] }))
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value={TaskPriority.LOW}>Baixa</option>
                <option value={TaskPriority.MEDIUM}>Media</option>
                <option value={TaskPriority.HIGH}>Alta</option>
                <option value={TaskPriority.URGENT}>Urgente</option>
              </select>
            </div>

            {isEditMode && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  id="status"
                  value={values.status}
                  onChange={(event) =>
                    setValues((previous) => ({ ...previous, status: event.target.value as Task["status"] }))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value={TaskStatus.PENDING}>Pendente</option>
                  <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
                  <option value={TaskStatus.COMPLETED}>Concluida</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? "Salvar Alteracoes" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
