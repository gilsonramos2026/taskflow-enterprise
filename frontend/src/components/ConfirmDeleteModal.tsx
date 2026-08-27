import { Loader2, TriangleAlert } from "lucide-react";
import type { Task } from "../types/task";

interface ConfirmDeleteModalProps {
  task: Task | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ task, isDeleting, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  if (!task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50">
            <TriangleAlert className="h-5 w-5 text-rose-500" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-800">Excluir tarefa</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tem certeza que deseja excluir <span className="font-medium text-slate-700">"{task.title}"</span>?
              Essa acao nao pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
