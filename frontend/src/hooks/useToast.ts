import { useCallback, useRef, useState, useEffect } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

/**
 * Hook simples de gerenciamento de toasts em memoria (sem dependencias
 * externas), com remocao automatica apos alguns segundos.
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);
  // Rastreador de timeouts ativos para evitar vazamento de memória se o componente desmontar
  const timersRef = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    
    // Limpa o timer associado se o item for fechado manualmente antes do tempo
    const timerId = timersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info", durationMs = 4000) => {
      idCounter.current += 1;
      const id = idCounter.current;

      setToasts((current) => [...current, { id, variant, message }]);

      const timeoutId = window.setTimeout(() => {
        dismiss(id);
      }, durationMs);

      timersRef.current.set(id, timeoutId);
    },
    [dismiss]
  );

  // Efeito colateral para garantir que todos os timers sejam limpos se o usuário sair da página repentinamente
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current.clear();
    };
  }, []);

  return {
    toasts,
    success: useCallback((message: string) => show(message, "success"), [show]),
    error: useCallback((message: string) => show(message, "error"), [show]),
    info: useCallback((message: string) => show(message, "info"), [show]),
    dismiss,
  };
}
