import type { SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "compact:h-9 compact:px-2.5 compact:text-xs h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-700",
        className,
      )}
      {...props}
    />
  );
}
