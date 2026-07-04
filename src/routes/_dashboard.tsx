import { createFileRoute, redirect } from "@tanstack/react-router";

import { DashboardLayout } from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/_dashboard")({
  // 미인증 상태면 로그인 페이지로 보내고, 원래 목적지를 redirect로 저장한다.
  beforeLoad: ({ context, location }) => {
    if (!context.auth.getState().isAuthenticated) {
      throw redirect({
        to: "/signin",
        search: { redirect: location.href },
      });
    }
  },
  component: DashboardLayout,
});
