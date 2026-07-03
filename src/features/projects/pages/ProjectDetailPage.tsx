import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { projectQueryOptions } from "@/features/projects/queries/project-queries";
import { formatDate } from "@/shared/lib/format-date";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/_dashboard/projects/$projectId" });
  const query = useQuery(projectQueryOptions(projectId));

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" aria-label="프로젝트 로딩 중" />;
  }

  if (query.isError) {
    return (
      <Card className="p-6 text-red-700 dark:text-red-400" role="alert">
        프로젝트 정보를 불러오지 못했습니다.
      </Card>
    );
  }

  if (!query.data) {
    return (
      <Card className="p-6 text-red-700 dark:text-red-400">
        프로젝트를 찾을 수 없습니다.
      </Card>
    );
  }

  const project = query.data;

  return (
    <section className="grid gap-6">
      <div>
        <div className="mb-3">
          <ProjectStatusBadge status={project.status} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {project.name}
        </h1>
        <p className="mt-2 text-slate-500">{project.description}</p>
      </div>
      <Card className="p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-slate-500">담당자</dt>
            <dd className="mt-1 font-medium">{project.owner}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">마감일</dt>
            <dd className="mt-1 font-medium">{formatDate(project.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">최근 수정</dt>
            <dd className="mt-1 font-medium">
              {formatDate(project.updatedAt.slice(0, 10))}
            </dd>
          </div>
        </dl>
      </Card>
    </section>
  );
}
