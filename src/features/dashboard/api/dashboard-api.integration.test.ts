import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { getDashboard } from "./dashboard-api";
import { dashboardSchema } from "@/features/dashboard/model/dashboard-schema";
import { createProject, updateProjectStatus } from "@/features/projects/api";
import { server } from "@/mocks/server";

describe("dashboard API", () => {
  it("프로젝트 생성과 상태 변경이 대시보드에 반영된다", async () => {
    const initial = await getDashboard();
    expect(initial.tasks.length).toBe(96);
    const created = await createProject({
      name: "New Sample",
      owner: "Soo",
      status: "active",
      dueDate: "2026-08-20",
      description: "새 프로젝트",
    });
    await updateProjectStatus("project-design-system", "paused");
    const updated = await getDashboard();
    expect(updated.projects).toHaveLength(initial.projects.length + 1);
    expect(
      updated.projects.find((project) => project.id === created.id)?.name,
    ).toBe("New Sample");
    expect(
      updated.projects.find((project) => project.id === "project-design-system")
        ?.status,
    ).toBe("paused");
  });
  it("알 수 없는 프로젝트를 참조하는 응답을 거부한다", async () => {
    const snapshot = await getDashboard();
    server.use(
      http.get("/api/dashboard", () =>
        HttpResponse.json({
          ...snapshot,
          tasks: [{ ...snapshot.tasks[0], projectId: "missing" }],
        }),
      ),
    );
    await expect(getDashboard()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
  it("날짜 역전, 미래 완료일, 음수 공수, 중복 작업 ID를 거부한다", async () => {
    const snapshot = await getDashboard();
    for (const changes of [
      { startDate: "2099-01-01" },
      { completedAt: "2099-01-01" },
      { hours: -1 },
    ]) {
      expect(
        dashboardSchema.safeParse({
          ...snapshot,
          tasks: [{ ...snapshot.tasks[0], ...changes }],
        }).success,
      ).toBe(false);
    }
    expect(
      dashboardSchema.safeParse({
        ...snapshot,
        tasks: [snapshot.tasks[0], snapshot.tasks[0]],
      }).success,
    ).toBe(false);
  });
});
