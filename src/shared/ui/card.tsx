import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-panel border-line bg-surface text-ink shadow-panel border",
        className,
      )}
      {...props}
    />
  );
}
