import type { SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "compact:h-9 compact:px-2.5 compact:text-sm rounded-control border-line-strong bg-surface text-ink placeholder:text-ink-subtle focus:border-brand focus:ring-brand-soft h-10 border px-3 text-sm transition outline-none focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
