import { z } from "zod";

/**
 * 애플리케이션 환경변수 스키마.
 * Vite는 `VITE_` 접두사가 붙은 값만 클라이언트로 노출하므로 그 값만 검증한다.
 * 잘못된 값이면 부팅 시점에 즉시 실패시켜 런타임 중 조용한 오류를 막는다.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default("http://localhost:3000"),
  // "false" 문자열일 때만 목킹을 끈다(기본값은 켜짐).
  VITE_ENABLE_MOCKS: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(import.meta.env);
