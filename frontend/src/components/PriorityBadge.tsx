import { ArrowDown, ArrowUp, Equal, Flame } from "lucide-react";
import { TaskPriority, type TaskPriority as TaskPriorityType } from "../types/task";

const PRIORITY_CONFIG: Record<TaskPriorityType, { label: string; className: string; icon: typeof ArrowUp }> = {
  [TaskPriority.LOW]: {
    label: "Baixa",
    className: "bg-sky-50 text-sky-700",
    icon: ArrowDown,
  },
  [TaskPriority.MEDIUM]: {
    label: "Media",
    className: "bg-slate-100 text-slate-700",
    icon: Equal,
  },
  [TaskPriority.HIGH]: {
    label: "Alta",
    className: "bg-orange-50 text-orange-700",
    icon: ArrowUp,
  },
  [TaskPriority.URGENT]: {
    label: "Urgente",
    className: "bg-rose-50 text-rose-700",
    icon: Flame,
  },
};

export function PriorityBadge({ priority }: { priority: TaskPriorityType }) {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {config.label}
    </span>
  );
}
