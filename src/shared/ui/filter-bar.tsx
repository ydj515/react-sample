import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Card } from "./card";

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <Card className="flex min-w-0 flex-wrap items-end gap-3 p-4">
      {children}
    </Card>
  );
}
export function FilterField({
  label,
  children,
  grow = false,
}: {
  label: string;
  children: ReactNode;
  grow?: boolean;
}) {
  return (
    <label
      className={cn(
        "text-ink-subtle grid min-w-0 flex-1 basis-36 gap-2 text-xs font-medium sm:flex-none",
        grow && "basis-full sm:min-w-56 sm:flex-1",
      )}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}
