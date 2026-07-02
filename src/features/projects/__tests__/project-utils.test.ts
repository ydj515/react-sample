import { describe, expect, it } from "vitest";

import type { Project } from "@/features/projects/model/project-types";
import {
  filterProjects,
  getProjectStatusCounts,
  sortProjects,
} from "@/features/projects/model/project-utils";

const projects: Project[] = [
  {
    id: "p-1",
    name: "Design System",
    owner: "Mina",
    status: "active",
    dueDate: "2026-08-01",
    description: "공통 UI 기반",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "p-2",
    name: "Billing Revamp",
    owner: "Joon",
    status: "paused",
    dueDate: "2026-07-20",
    description: "결제 플로우 정리",
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
];

describe("project-utils", () => {
  it("검색어와 상태로 프로젝트를 필터링한다", () => {
    expect(
      filterProjects(projects, { search: "design", status: "active" }),
    ).toHaveLength(1);
  });

  it("마감일 오름차순으로 정렬한다", () => {
    expect(sortProjects(projects, "dueDate")[0]?.id).toBe("p-2");
  });

  it("상태별 개수를 계산한다", () => {
    expect(getProjectStatusCounts(projects)).toEqual({
      active: 1,
      paused: 1,
      completed: 0,
    });
  });
});
