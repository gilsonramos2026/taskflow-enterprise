import { AlertTriangle, ClipboardList, Loader2 } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task } from "../types/task";

interface TaskGridProps {
  tasks: Task[];
  isLoading: boolean;
  errorMessage: string | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="h-3 w-2/3 rounded bg-slate-100" />
      <div className="h-6 w-24 rounded-full bg-slate-100" />
      <div className="h-8 w-full rounded bg-slate-100" />
    </div>
  );
}

export function TaskGrid({ tasks, isLoading, errorMessage, onEdit, onDelete, onStatusChange }: TaskGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50 px-6 py-16 text-center">
        <AlertTriangle className="h-10 w-10 text-rose-400" />
        <p className="font-medium text-rose-700">Nao foi possivel carregar as tarefas</p>
        <p className="max-w-sm text-sm text-rose-500">{errorMessage}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <ClipboardList className="h-10 w-10 text-slate-300" />
        <p className="font-medium text-slate-600">Nenhuma tarefa encontrada</p>
        <p className="max-w-sm text-sm text-slate-400">
          Ajuste os filtros ou crie uma nova tarefa para comecar a organizar seu projeto.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}

export function LoadingSpinnerInline() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
