import { z } from "zod";

/** Vite가 공개하는 클라이언트 설정만 검증한다. */
const envSchema = z.object({
  VITE_API_BASE_URL: z
    .url({ protocol: /^https?$/ })
    .refine((value) => {
      const url = new URL(value);
      return !url.username && !url.password && !url.search && !url.hash;
    }, "API base URL must not include credentials, a query, or a fragment")
    .default("http://localhost:3000"),
  VITE_ENABLE_MOCKS: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, unknown>): Env {
  return envSchema.parse({
    ...input,
    VITE_ENABLE_MOCKS:
      input.VITE_ENABLE_MOCKS ?? (input.PROD === true ? "false" : "true"),
  });
}

export const env = parseEnv(import.meta.env);
