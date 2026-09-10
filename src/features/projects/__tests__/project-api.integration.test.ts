import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import {
  createProject,
  getProject,
  getProjects,
  updateProjectStatus,
} from "@/features/projects/api/project-api";
import { projectsFixture } from "@/mocks/data/projects";
import { server } from "@/mocks/server";

describe("project-api", () => {
  it("프로젝트 목록을 HTTP boundary를 통해 가져온다", async () => {
    const projects = await getProjects();

    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("id");
  });

  it("프로젝트를 생성하고 상세 조회를 할 수 있다", async () => {
    const created = await createProject({
      name: "Search Experience",
      owner: "Nari",
      status: "active",
      dueDate: "2026-10-01",
      description: "검색 경험을 개선합니다.",
    });

    const detail = await getProject(created.id);

    expect(detail.name).toBe("Search Experience");
  });

  it("프로젝트 상태를 변경한다", async () => {
    const updated = await updateProjectStatus(
      "project-design-system",
      "paused",
    );

    expect(updated.status).toBe("paused");
  });

  it("런타임 스키마를 위반한 프로젝트 응답을 거부한다", async () => {
    server.use(
      http.get("/api/projects", () =>
        HttpResponse.json([{ id: "project-without-required-fields" }]),
      ),
    );

    await expect(getProjects()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });

  it("mock 오류 본문과 헤더에 같은 trace ID를 반환한다", async () => {
    const response = await fetch("/api/projects/missing-project");
    const body = (await response.json()) as {
      code: string;
      traceId: string;
    };

    expect(response.status).toBe(404);
    expect(body.code).toBe("PROJECT_NOT_FOUND");
    expect(response.headers.get("X-Trace-Id")).toBe(body.traceId);
  });
});

it("encodes special characters as one project ID segment for reads and updates", async () => {
  const id = "project/한글?#%";
  server.use(
    http.get("/api/projects/:id", ({ params }) => {
      expect(params.id).toBe(id);
      return HttpResponse.json({ ...projectsFixture[0], id });
    }),
    http.patch("/api/projects/:id/status", async ({ params, request }) => {
      expect(params.id).toBe(id);
      expect(await request.json()).toEqual({ status: "paused" });
      return HttpResponse.json({ ...projectsFixture[0], id, status: "paused" });
    }),
  );
  await expect(getProject(id)).resolves.toMatchObject({ id });
  await expect(updateProjectStatus(id, "paused")).resolves.toMatchObject({
    id,
    status: "paused",
  });
});
