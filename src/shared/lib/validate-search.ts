import type { SearchSchemaInput } from "@tanstack/react-router";
import type { z } from "zod";

export function validateSearch<T>(schema: z.ZodType<T>) {
  return (search: Record<string, unknown> & SearchSchemaInput) =>
    schema.parse(search);
}
