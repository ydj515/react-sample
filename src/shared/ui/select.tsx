import type { SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
        className,
      )}
      {...props}
    />
  );
}
