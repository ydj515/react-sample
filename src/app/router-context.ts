import type { useAuthStore } from "@/stores/auth-store";

// 라우터 context로 auth 스토어를 주입해 beforeLoad에서 인증 상태를 읽는다.
export type RouterContext = {
  auth: typeof useAuthStore;
};
