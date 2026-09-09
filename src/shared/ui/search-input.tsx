import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/shared/lib/cn";

export function SearchInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <span className="relative block w-full min-w-0">
      <Search
        aria-hidden
        className="text-ink-subtle pointer-events-none absolute top-3 left-3 size-4"
      />
      <Input {...props} className={cn("pl-9", className)} />
    </span>
  );
}
