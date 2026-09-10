import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { ProjectStatusControl } from "@/features/projects/components/ProjectStatusControl";
import { projectQueryOptions } from "@/features/projects/queries/project-queries";
import { formatDate } from "@/shared/lib/format-date";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

function ProjectDetailPageContent() {
  const { projectId } = useParams({ from: "/_dashboard/projects/$projectId" });
  const query = useSuspenseQuery(projectQueryOptions(projectId));

  if (!query.data) {
    return (
      <Card className="text-negative p-6">프로젝트를 찾을 수 없습니다.</Card>
    );
  }

  const project = query.data;

  return (
    <section className="grid gap-6">
      <PageHeader
        title={project.name}
        description={project.description}
        actions={<ProjectStatusControl project={project} />}
      />
      <Card className="p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-ink-subtle text-sm">담당자</dt>
            <dd className="mt-1 font-medium">{project.owner}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle text-sm">마감일</dt>
            <dd className="mt-1 font-medium">{formatDate(project.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle text-sm">최근 수정</dt>
            <dd className="mt-1 font-medium">
              {formatDate(project.updatedAt.slice(0, 10))}
            </dd>
          </div>
        </dl>
      </Card>
    </section>
  );
}

export function ProjectDetailPage() {
  return (
    <QueryBoundary errorMessage={"프로젝트 정보를 불러오지 못했습니다."}>
      <ProjectDetailPageContent />
    </QueryBoundary>
  );
}
