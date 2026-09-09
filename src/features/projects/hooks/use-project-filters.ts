import { useUrlSearch } from "@/shared/lib/use-url-search";
import { projectSearchSchema } from "@/features/projects/model/project-search";
import { useMemo } from "react";

import type {
  Project,
  ProjectFilters,
  ProjectSortKey,
} from "@/features/projects/model/project-types";
import {
  filterProjects,
  sortProjects,
} from "@/features/projects/model/project-utils";

export function useProjectFilters(projects: Project[]) {
  const [search, change] = useUrlSearch(projectSearchSchema);
  const filters = useMemo(
    () => ({ search: search.q, status: search.status }),
    [search.q, search.status],
  );
  const sortKey = search.sort;
  const setFilters = (next: ProjectFilters) =>
    change(
      { q: next.search, status: next.status, page: 1 },
      next.search !== search.q,
    );
  const setSortKey = (sort: ProjectSortKey) => change({ sort, page: 1 });
  const setPage = (page: number) => change({ page });
  const reset = () =>
    change({ q: "", status: "all", sort: "dueDate", page: 1 });

  const visibleProjects = useMemo(() => {
    return sortProjects(filterProjects(projects, filters), sortKey);
  }, [filters, projects, sortKey]);

  return {
    page: search.page,
    setPage,
    reset,
    filters,
    setFilters,
    sortKey,
    setSortKey,
    visibleProjects,
  };
}
