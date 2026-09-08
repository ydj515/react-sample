import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "rounded-control border-line-strong bg-surface text-ink placeholder:text-ink-subtle focus:border-brand focus:ring-brand-soft min-h-28 w-full resize-y border px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
