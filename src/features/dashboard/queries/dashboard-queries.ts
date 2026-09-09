import { queryOptions } from "@tanstack/react-query";

import { getDashboard } from "@/features/dashboard/api/dashboard-api";
import { projectKeys } from "@/features/projects/queries";

export function dashboardQueryOptions() {
  // 프로젝트 생성·상태 변경 시 프로젝트 목록과 집계를 함께 무효화한다.
  return queryOptions({
    queryKey: [...projectKeys.all, "dashboard"],
    queryFn: getDashboard,
  });
}
