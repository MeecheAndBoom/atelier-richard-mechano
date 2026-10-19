"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
  timeout?: number;
};

type ToastContextValue = {
  show: (message: string, opts?: Partial<Omit<Toast, "id" | "message">>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  function show(message: string, opts: Partial<Omit<Toast, "id" | "message">> = {}) {
    const id = String(++idRef.current);
    const toast: Toast = {
      id,
      message,
      type: opts.type ?? "success",
      timeout: opts.timeout ?? 3000,
    };
    setToasts((prev) => [...prev, toast]);
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timeout = toast.timeout ?? 3000;
    if (timeout > 0) {
      const id = setTimeout(onDismiss, timeout);
      return () => clearTimeout(id);
    }
  }, [toast.timeout, onDismiss]);

  return (
    <div className="pointer-events-auto rounded-card border border-line-soft bg-white/95 px-4 py-2.5 text-[13.5px] text-ink shadow-[0_12px_40px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {toast.message}
    </div>
  );
}
