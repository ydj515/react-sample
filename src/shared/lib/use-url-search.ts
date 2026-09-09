import { useNavigate, useSearch } from "@tanstack/react-router";
import type { z } from "zod";

export function useUrlSearch<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
) {
  const search = schema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const change = (patch: Partial<T>, replace = false) => {
    void navigate({
      to: ".",
      search: (previous) => ({ ...previous, ...patch }),
      hash: true,
      replace,
      resetScroll: false,
    });
  };
  return [search, change] as const;
}
