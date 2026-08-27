import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { ToastItem } from "../hooks/useToast";

const VARIANT_STYLES: Record<ToastItem["variant"], { container: string; icon: typeof CheckCircle2 }> = {
  success: {
    container: "bg-emerald-600 text-white",
    icon: CheckCircle2,
  },
  error: {
    container: "bg-rose-600 text-white",
    icon: XCircle,
  },
  info: {
    container: "bg-slate-800 text-white",
    icon: Info,
  },
};

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const { container, icon: Icon } = VARIANT_STYLES[toast.variant];
        return (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg ring-1 ring-black/5 ${container} animate-in fade-in slide-in-from-bottom-2`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded p-0.5 opacity-80 transition hover:opacity-100"
              aria-label="Fechar notificacao"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
