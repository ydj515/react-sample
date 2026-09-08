import { PageHeader } from "@/shared/ui/page-header";
import { useQuery } from "@tanstack/react-query";

import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectFilters } from "@/features/projects/components/ProjectFilters";
import { useProjectFilters } from "@/features/projects/hooks/use-project-filters";
import { projectsQueryOptions } from "@/features/projects/queries/project-queries";
import { useState } from "react";
import { QueryFeedback } from "@/shared/ui/query-feedback";
import { EmptyState } from "@/shared/ui/empty-state";
import { Pagination } from "@/shared/ui/pagination";
import { paginate } from "@/shared/lib/list-search";

export function ProjectsPage() {
  const query = useQuery(projectsQueryOptions());
  const projects = query.data ?? [];
  const { filters, setFilters, setSortKey, sortKey, visibleProjects } =
    useProjectFilters(projects);

  const [page, setPage] = useState(1);
  const result = paginate(visibleProjects, page);
  const reset = () => {
    setFilters({ search: "", status: "all" });
    setSortKey("dueDate");
    setPage(1);
  };

  return (
    <section className="grid gap-6">
      <PageHeader
        title="프로젝트"
        description="프로젝트 진행 현황을 확인하고 새 프로젝트를 관리하세요."
        actions={<CreateProjectDialog />}
      />
      <ProjectFilters
        filters={filters}
        sortKey={sortKey}
        onFiltersChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onSortKeyChange={(next) => {
          setSortKey(next);
          setPage(1);
        }}
      />
      <QueryFeedback
        pending={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
      {query.data ? (
        <>
          {result.total === 0 ? (
            <EmptyState
              title="조건에 맞는 프로젝트가 없습니다."
              onReset={reset}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {result.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
          <Pagination {...result} onChange={setPage} />
        </>
      ) : null}
    </section>
  );
}
