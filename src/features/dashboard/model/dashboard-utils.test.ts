import { describe, expect, it } from "vitest";

import {
  buildDashboard,
  normalizeDashboardSearch,
  toReportCsv,
} from "./dashboard-utils";
import type { DashboardSnapshot } from "./dashboard-schema";

const snapshot: DashboardSnapshot = {
  asOf: "2026-07-15",
  projects: [
    {
      id: "a",
      name: "Alpha",
      owner: "Mina",
      status: "active",
      dueDate: "2026-07-20",
      description: "",
      updatedAt: "2026-07-15T00:00:00Z",
    },
    {
      id: "b",
      name: "Beta",
      owner: "Joon",
      status: "paused",
      dueDate: "2026-07-10",
      description: "",
      updatedAt: "2026-07-15T00:00:00Z",
    },
  ],
  tasks: [
    {
      id: "t1",
      projectId: "a",
      title: "현재 기간 시작",
      startDate: "2026-07-01",
      dueDate: "2026-07-09",
      completedAt: "2026-07-09",
      hours: 4,
    },
    {
      id: "t2",
      projectId: "a",
      title: "현재 기간 끝",
      startDate: "2026-07-01",
      dueDate: "2026-07-15",
      completedAt: "2026-07-15",
      hours: 6,
    },
    {
      id: "t3",
      projectId: "b",
      title: "이전 기간 끝",
      startDate: "2026-07-01",
      dueDate: "2026-07-08",
      completedAt: "2026-07-08",
      hours: 3,
    },
    {
      id: "t4",
      projectId: "a",
      title: "지연",
      startDate: "2026-07-01",
      dueDate: "2026-07-14",
      completedAt: null,
      hours: 2,
    },
    {
      id: "t5",
      projectId: "a",
      title: "오늘 마감",
      startDate: "2026-07-01",
      dueDate: "2026-07-15",
      completedAt: null,
      hours: 2,
    },
  ],
};

describe("dashboard aggregation", () => {
  it("기간 양 끝을 포함하고 직전 동일 길이 기간과 중복 없이 비교한다", () => {
    const result = buildDashboard(snapshot, {
      days: 7,
      owner: "all",
      status: "all",
      metric: "completed",
    });
    expect(result.current).toEqual({ completed: 2, hours: 10 });
    expect(result.previous).toEqual({ completed: 1, hours: 3 });
    expect(result.series).toHaveLength(7);
    expect(result.series[0]).toMatchObject({
      date: "2026-07-09",
      completed: 1,
    });
    expect(result.series[6]).toMatchObject({
      date: "2026-07-15",
      completed: 1,
    });
    expect(result.overdue).toHaveLength(1);
    expect(result.rows.find((row) => row.project.id === "a")?.progress).toBe(
      50,
    );
  });
  it("담당자와 상태 필터를 모든 집계에 동일하게 적용한다", () => {
    const result = buildDashboard(snapshot, {
      days: 7,
      owner: "Joon",
      status: "paused",
      metric: "hours",
    });
    expect(result.rows.map((row) => row.project.id)).toEqual(["b"]);
    expect(result.current.completed).toBe(0);
    expect(result.previous.hours).toBe(3);
    expect(result.overdue).toEqual([]);
  });
  it("없는 담당자 및 빈 데이터는 0으로 집계한다", () => {
    const result = buildDashboard(
      { ...snapshot, tasks: [] },
      { days: 30, owner: "nobody", status: "all", metric: "completed" },
    );
    expect(result.rows).toEqual([]);
    expect(result.current.completed).toBe(0);
    expect(result.series.every((point) => point.completed === 0)).toBe(true);
  });
  it("작업이 없는 신규 프로젝트는 진행률을 알 수 없음으로 표시한다", () => {
    const result = buildDashboard(
      { ...snapshot, tasks: [] },
      normalizeDashboardSearch({}),
    );
    expect(result.rows[0].progress).toBeNull();
  });
  it("잘못된 URL 값을 기본값으로 정규화한다", () => {
    expect(
      normalizeDashboardSearch({
        days: "7",
        owner: "Mina",
        status: "paused",
        metric: "hours",
      }),
    ).toEqual({ days: 7, owner: "Mina", status: "paused", metric: "hours" });
    expect(
      normalizeDashboardSearch({
        days: 999,
        owner: [],
        status: "bad",
        metric: "bad",
      }),
    ).toEqual({ days: 30, owner: "all", status: "all", metric: "completed" });
  });
  it("CSV는 선택된 집계와 일치하고 수식과 구분 문자를 안전하게 이스케이프한다", () => {
    const data = {
      ...snapshot,
      projects: [{ ...snapshot.projects[0], name: '=SUM(1,2)"' }],
    };
    const result = buildDashboard(data, {
      days: 7,
      owner: "all",
      status: "all",
      metric: "completed",
    });
    const csv = toReportCsv(result);
    expect(csv).toContain("2026-07-09");
    expect(csv).toContain('"\'=SUM(1,2)"""');
    expect(csv).toContain('"2","10"');
  });
});
