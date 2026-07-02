import type { Project } from "@/features/projects/model/project-types";

export const projectsFixture: Project[] = [
  {
    id: "project-design-system",
    name: "Design System",
    owner: "Mina",
    status: "active",
    dueDate: "2026-08-01",
    description: "공통 UI 컴포넌트와 토큰을 정리합니다.",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "project-dashboard-refresh",
    name: "Dashboard Refresh",
    owner: "Joon",
    status: "active",
    dueDate: "2026-07-24",
    description: "운영 대시보드의 정보 구조를 개선합니다.",
    updatedAt: "2026-06-28T09:00:00.000Z",
  },
  {
    id: "project-billing-revamp",
    name: "Billing Revamp",
    owner: "Ara",
    status: "paused",
    dueDate: "2026-09-12",
    description: "결제 플로우를 단순화합니다.",
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "project-onboarding",
    name: "Onboarding Flow",
    owner: "Hwan",
    status: "completed",
    dueDate: "2026-06-30",
    description: "신규 사용자 온보딩을 개선합니다.",
    updatedAt: "2026-06-30T09:00:00.000Z",
  },
];
