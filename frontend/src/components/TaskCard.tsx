import { Pencil, Trash2 } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { TaskStatus, type Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
}

const STATUS_OPTIONS: { value: Task["status"]; label: string }[] = [
  { value: TaskStatus.PENDING, label: "Pendente" },
  { value: TaskStatus.IN_PROGRESS, label: "Em Andamento" },
  { value: TaskStatus.COMPLETED, label: "Concluida" },
];

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 font-semibold text-slate-800">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="line-clamp-2 text-sm text-slate-500">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <StatusBadge status={task.status} />
        <span className="text-xs text-slate-400">Atualizado em {formatDate(task.updatedAt)}</span>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value as Task["status"])}
          className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          aria-label={`Alterar status da tarefa ${task.title}`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:text-brand-600"
          aria-label={`Editar tarefa ${task.title}`}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
          aria-label={`Excluir tarefa ${task.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
