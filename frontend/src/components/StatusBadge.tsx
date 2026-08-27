import { Circle, CircleCheck, CircleDot } from "lucide-react";
import { TaskStatus, type TaskStatus as TaskStatusType } from "../types/task";

const STATUS_CONFIG: Record<TaskStatusType, { label: string; className: string; icon: typeof Circle }> = {
  [TaskStatus.PENDING]: {
    label: "Pendente",
    className: "bg-slate-100 text-slate-700 ring-slate-300",
    icon: Circle,
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "Em Andamento",
    className: "bg-amber-50 text-amber-700 ring-amber-300",
    icon: CircleDot,
  },
  [TaskStatus.COMPLETED]: {
    label: "Concluida",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-300",
    icon: CircleCheck,
  },
};

export function StatusBadge({ status }: { status: TaskStatusType }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {config.label}
    </span>
  );
}
