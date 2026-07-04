import { bootstrapApp, enableMocking } from "@/app/bootstrap";
import { env } from "@/shared/config/env";
import "@/app/styles/index.css";

// 환경변수로 MSW 목킹을 켜고 끈다. 실 API를 붙일 때는 VITE_ENABLE_MOCKS=false.
bootstrapApp({
  enableMocking: env.VITE_ENABLE_MOCKS
    ? enableMocking
    : () => Promise.resolve(),
});
