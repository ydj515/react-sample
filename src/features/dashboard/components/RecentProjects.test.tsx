import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecentProjects } from "@/features/dashboard/components/RecentProjects";
import type { Project } from "@/features/projects/model/project-types";

const projects: Project[] = [
  {
    id: "oldest",
    name: "Oldest",
    owner: "Mina",
    status: "active",
    dueDate: "2026-08-01",
    description: "가장 오래된 프로젝트",
    updatedAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "middle-1",
    name: "Middle 1",
    owner: "Joon",
    status: "paused",
    dueDate: "2026-07-20",
    description: "중간 프로젝트",
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "middle-2",
    name: "Middle 2",
    owner: "Ara",
    status: "completed",
    dueDate: "2026-09-12",
    description: "중간 프로젝트",
    updatedAt: "2026-06-25T09:00:00.000Z",
  },
  {
    id: "newest",
    name: "Newest",
    owner: "Hwan",
    status: "active",
    dueDate: "2026-06-30",
    description: "가장 최근 프로젝트",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
];

describe("RecentProjects", () => {
  it("최근 수정일 기준 최신 프로젝트 3개만 보여준다", () => {
    render(<RecentProjects projects={projects} />);

    expect(screen.getByText("Newest")).toBeInTheDocument();
    expect(screen.getByText("Middle 2")).toBeInTheDocument();
    expect(screen.getByText("Middle 1")).toBeInTheDocument();
    expect(screen.queryByText("Oldest")).not.toBeInTheDocument();
  });
});
