import { useQuery } from "@tanstack/react-query";

import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectFilters } from "@/features/projects/components/ProjectFilters";
import { useProjectFilters } from "@/features/projects/hooks/use-project-filters";
import { projectsQueryOptions } from "@/features/projects/queries/project-queries";
import { Skeleton } from "@/shared/ui/skeleton";

export function ProjectsPage() {
  const query = useQuery(projectsQueryOptions());
  const projects = query.data ?? [];
  const { filters, setFilters, setSortKey, sortKey, visibleProjects } =
    useProjectFilters(projects);

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" aria-label="프로젝트 로딩 중" />;
  }

  if (query.isError) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        프로젝트 목록을 불러오지 못했습니다.
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">프로젝트</h1>
          <p className="mt-1 text-sm text-slate-500">
            서버 상태, 필터링, mutation 흐름을 확인하는 예제입니다.
          </p>
        </div>
        <CreateProjectDialog />
      </div>
      <ProjectFilters
        filters={filters}
        sortKey={sortKey}
        onFiltersChange={setFilters}
        onSortKeyChange={setSortKey}
      />
      {visibleProjects.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          조건에 맞는 프로젝트가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
