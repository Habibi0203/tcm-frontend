"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }]);
      const timer = setTimeout(() => remove(id), duration);
      timers.current.set(id, timer);
    },
    [remove]
  );

  // Cleanup on unmount
  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={18} className="shrink-0 text-primary" />,
    error:   <XCircle      size={18} className="shrink-0 text-red-500" />,
    warning: <AlertTriangle size={18} className="shrink-0 text-amber-tcm" />,
    info:    <Info          size={18} className="shrink-0 text-blue-500" />,
  };

  const borders: Record<ToastType, string> = {
    success: "border-primary/40",
    error:   "border-red-200",
    warning: "border-amber-200",
    info:    "border-blue-200",
  };

  return (
    <div
      className={`flex w-80 items-start gap-3 rounded-xl border ${borders[toast.type]} bg-white p-4 shadow-lg`}
      role="alert"
    >
      {icons[toast.type]}
      <span className="flex-1 text-sm text-text-main">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto shrink-0 text-muted hover:text-text-main"
        aria-label="Tutup notifikasi"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
