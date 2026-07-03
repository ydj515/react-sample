import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from "@/features/projects/model/project-types";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(error?.message ?? "요청을 처리하지 못했습니다.");
  }

  return response.json() as Promise<T>;
}

export async function getProjects() {
  const response = await fetch("/api/projects");
  return parseResponse<Project[]>(response);
}

export async function getProject(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}`);
  return parseResponse<Project>(response);
}

export async function createProject(input: CreateProjectInput) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<Project>(response);
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  const response = await fetch(`/api/projects/${projectId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseResponse<Project>(response);
}
