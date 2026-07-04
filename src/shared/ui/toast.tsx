import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/shared/lib/cn";
import { useToastStore, type Toast } from "@/stores/toast-store";

const AUTO_DISMISS_MS = 4000;

const variantStyles: Record<Toast["variant"], string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  info: "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-md border px-4 py-3 text-sm shadow-lg",
        variantStyles[toast.variant],
      )}
    >
      <span className="flex-1">{toast.title}</span>
      <button
        type="button"
        aria-label="알림 닫기"
        className="rounded p-0.5 opacity-70 transition hover:opacity-100"
        onClick={() => dismiss(toast.id)}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * 전역 토스트 렌더러. AppProviders에 한 번 마운트하고,
 * toast.success/error/info 헬퍼로 어디서든 알림을 띄운다.
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
