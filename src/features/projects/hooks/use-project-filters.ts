import { useMemo, useState } from "react";

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
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "all",
  });
  const [sortKey, setSortKey] = useState<ProjectSortKey>("dueDate");

  const visibleProjects = useMemo(() => {
    return sortProjects(filterProjects(projects, filters), sortKey);
  }, [filters, projects, sortKey]);

  return {
    filters,
    setFilters,
    sortKey,
    setSortKey,
    visibleProjects,
  };
}
