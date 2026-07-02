import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
  getProject,
  getProjects,
  updateProjectStatus,
} from "@/features/projects/api/project-api";
import type {
  CreateProjectInput,
  ProjectStatus,
} from "@/features/projects/model/project-types";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  detail: (projectId: string) =>
    [...projectKeys.all, "detail", projectId] as const,
};

export function projectsQueryOptions() {
  return queryOptions({
    queryKey: projectKeys.lists(),
    queryFn: getProjects,
  });
}

export function projectQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProject(projectId),
  });
}

export function useProjectsQuery() {
  return useQuery(projectsQueryOptions());
}

export function useProjectQuery(projectId: string) {
  return useQuery(projectQueryOptions(projectId));
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProjectStatusMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ProjectStatus) =>
      updateProjectStatus(projectId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
