import { describe, expect, it } from "vitest";

import {
  createProject,
  getProject,
  getProjects,
  updateProjectStatus,
} from "@/features/projects/api/project-api";

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
});
