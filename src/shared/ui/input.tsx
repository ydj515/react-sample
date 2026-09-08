import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "compact:h-9 compact:px-2.5 compact:text-sm rounded-control border-line-strong bg-surface text-ink placeholder:text-ink-subtle focus:border-brand focus:ring-brand-soft disabled:bg-surface-muted h-10 w-full border px-3 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
