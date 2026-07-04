import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  title: string;
  variant: ToastVariant;
};

type ToastState = {
  toasts: Toast[];
  add: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

// 컴포넌트 밖(mutation onSuccess 등)에서도 호출할 수 있는 헬퍼.
// 자동 제거 타이머는 Toaster의 각 항목이 소유한다.
function push(variant: ToastVariant, title: string): string {
  return useToastStore.getState().add({ title, variant });
}

export const toast = {
  success: (title: string) => push("success", title),
  error: (title: string) => push("error", title),
  info: (title: string) => push("info", title),
};
