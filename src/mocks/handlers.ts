import { http, HttpResponse } from "msw";

import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { projectsFixture } from "@/mocks/data/projects";

let projects: Project[] = structuredClone(projectsFixture);

export function resetProjectsMockData() {
  projects = structuredClone(projectsFixture);
}

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    // 데모용 목: 이메일과 비밀번호가 있으면 토큰을 발급한다.
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: `demo-token-${crypto.randomUUID()}`,
      user: { email: body.email },
    });
  }),

  http.get("/api/projects", () => {
    return HttpResponse.json(projects);
  }),

  http.get("/api/projects/:projectId", ({ params }) => {
    const project = projects.find((item) => item.id === params.projectId);

    if (!project) {
      return HttpResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json(project);
  }),

  http.post("/api/projects", async ({ request }) => {
    const body = (await request.json()) as CreateProjectInput;
    const project: Project = {
      ...body,
      id: `project-${crypto.randomUUID()}`,
      updatedAt: new Date().toISOString(),
    };

    projects = [project, ...projects];

    return HttpResponse.json(project, { status: 201 });
  }),

  http.patch("/api/projects/:projectId/status", async ({ params, request }) => {
    const body = (await request.json()) as { status: ProjectStatus };
    const project = projects.find((item) => item.id === params.projectId);

    if (!project) {
      return HttpResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const updated: Project = {
      ...project,
      status: body.status,
      updatedAt: new Date().toISOString(),
    };

    projects = projects.map((item) =>
      item.id === updated.id ? updated : item,
    );

    return HttpResponse.json(updated);
  }),
];
