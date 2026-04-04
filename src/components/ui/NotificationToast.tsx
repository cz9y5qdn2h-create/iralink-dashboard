"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, Sparkles, X, Info } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "info" | "ai";
  title: string;
  message: string;
}

const icons = {
  success: { icon: CheckCircle, color: "text-gold" },
  error: { icon: AlertCircle, color: "text-red-400" },
  info: { icon: Info, color: "text-grey" },
  ai: { icon: Sparkles, color: "text-gold" },
};

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}) {
  const config = icons[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="bg-grey-light border border-border-dim p-4 flex items-start gap-3 animate-slide-in shadow-lg shadow-black/50 max-w-sm">
      <Icon className={`w-4 h-4 ${config.color} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="text-small text-white leading-tight">{toast.title}</p>
        <p className="text-[11px] text-grey mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-grey hover:text-white transition-colors p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-20 right-8 z-[70] space-y-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
