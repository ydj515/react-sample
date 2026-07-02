import { useQuery } from "@tanstack/react-query";

import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { RecentProjects } from "@/features/dashboard/components/RecentProjects";
import { getProjectStatusCounts } from "@/features/projects/model/project-utils";
import { projectsQueryOptions } from "@/features/projects/queries/project-queries";
import { Skeleton } from "@/shared/ui/skeleton";

export function DashboardPage() {
  const query = useQuery(projectsQueryOptions());

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" aria-label="대시보드 로딩 중" />;
  }

  const projects = query.data ?? [];
  const counts = getProjectStatusCounts(projects);

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
        <p className="mt-1 text-sm text-slate-500">
          실무형 React 템플릿의 핵심 흐름을 압축한 화면입니다.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="전체 프로젝트" value={projects.length} />
        <MetricCard label="진행 중" value={counts.active} />
        <MetricCard label="일시 중지" value={counts.paused} />
        <MetricCard label="완료" value={counts.completed} />
      </div>
      <RecentProjects projects={projects} />
    </section>
  );
}
