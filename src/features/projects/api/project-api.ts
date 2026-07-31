import type {
  CreateProjectInput,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { projectSchema } from "@/features/projects/model/project-schema";
import { apiRequest } from "@/shared/api/http-client";

export async function getProjects() {
  return apiRequest("/api/projects", { schema: projectSchema.array() });
}

export async function getProject(projectId: string) {
  return apiRequest(`/api/projects/${projectId}`, { schema: projectSchema });
}

export async function createProject(input: CreateProjectInput) {
  return apiRequest("/api/projects", {
    schema: projectSchema,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  return apiRequest(`/api/projects/${projectId}/status`, {
    schema: projectSchema,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}
