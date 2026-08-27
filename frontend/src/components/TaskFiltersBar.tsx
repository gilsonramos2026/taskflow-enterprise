import { Plus, Search } from "lucide-react";
import type { ChangeEvent } from "react";
import { TaskPriority, TaskStatus, type TaskFilters } from "../types/task";

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (updater: (previous: TaskFilters) => TaskFilters) => void;
  onCreateClick: () => void;
}

export function TaskFiltersBar({ filters, onChange, onCreateClick }: TaskFiltersBarProps) {
  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    onChange((previous) => ({ ...previous, search: value, page: 0 }));
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as TaskFilters["status"];
    onChange((previous) => ({ ...previous, status: value, page: 0 }));
  }

  function handlePriorityChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as TaskFilters["priority"];
    onChange((previous) => ({ ...previous, priority: value, page: 0 }));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Buscar por titulo ou descricao..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="ALL">Todos os status</option>
          <option value={TaskStatus.PENDING}>Pendente</option>
          <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
          <option value={TaskStatus.COMPLETED}>Concluida</option>
        </select>

        <select
          value={filters.priority}
          onChange={handlePriorityChange}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="ALL">Todas as prioridades</option>
          <option value={TaskPriority.LOW}>Baixa</option>
          <option value={TaskPriority.MEDIUM}>Media</option>
          <option value={TaskPriority.HIGH}>Alta</option>
          <option value={TaskPriority.URGENT}>Urgente</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Nova Tarefa
      </button>
    </div>
  );
}
