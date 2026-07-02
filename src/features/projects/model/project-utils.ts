import type {
  Project,
  ProjectFilters,
  ProjectSortKey,
  ProjectStatus,
} from "@/features/projects/model/project-types";

export function filterProjects(projects: Project[], filters: ProjectFilters) {
  const search = filters.search.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesSearch =
      search.length === 0 ||
      project.name.toLowerCase().includes(search) ||
      project.owner.toLowerCase().includes(search);
    const matchesStatus =
      filters.status === "all" || project.status === filters.status;

    return matchesSearch && matchesStatus;
  });
}

export function sortProjects(projects: Project[], sortKey: ProjectSortKey) {
  return [...projects].sort((a, b) => {
    if (sortKey === "name") {
      return a.name.localeCompare(b.name);
    }

    return a[sortKey].localeCompare(b[sortKey]);
  });
}

export function getProjectStatusCounts(projects: Project[]) {
  const initial: Record<ProjectStatus, number> = {
    active: 0,
    paused: 0,
    completed: 0,
  };

  return projects.reduce((counts, project) => {
    counts[project.status] += 1;
    return counts;
  }, initial);
}
