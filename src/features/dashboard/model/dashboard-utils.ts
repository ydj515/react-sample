import type { SearchSchemaInput } from "@tanstack/react-router";
import {
  dashboardSearchSchema,
  type DashboardSearch,
  type DashboardSnapshot,
} from "./dashboard-schema";

export type { DashboardSearch } from "./dashboard-schema";

export function normalizeDashboardSearch(
  search: Record<string, unknown>,
): DashboardSearch {
  return dashboardSearchSchema.parse(search);
}

export function shiftDate(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

export function buildDashboard(
  snapshot: DashboardSnapshot,
  filters: DashboardSearch,
) {
  const end = snapshot.asOf;
  const start = shiftDate(end, 1 - filters.days);
  const previousStart = shiftDate(start, -filters.days);
  const previousEnd = shiftDate(start, -1);
  const projects = snapshot.projects.filter(
    (project) =>
      (filters.owner === "all" || project.owner === filters.owner) &&
      (filters.status === "all" || project.status === filters.status),
  );
  const selectedIds = new Set(projects.map((project) => project.id));
  const tasks = snapshot.tasks.filter((task) =>
    selectedIds.has(task.projectId),
  );
  const daily = new Map<string, { completed: number; hours: number }>();
  const byProject = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const group = byProject.get(task.projectId) ?? [];
    group.push(task);
    byProject.set(task.projectId, group);
    if (task.completedAt) {
      const bucket = daily.get(task.completedAt) ?? { completed: 0, hours: 0 };
      bucket.completed += 1;
      bucket.hours += task.hours;
      daily.set(task.completedAt, bucket);
    }
  }
  const series = Array.from({ length: filters.days }, (_, index) => {
    const date = shiftDate(start, index);
    const previousDate = shiftDate(previousStart, index);
    return {
      date,
      previousDate,
      ...(daily.get(date) ?? { completed: 0, hours: 0 }),
      previousCompleted: daily.get(previousDate)?.completed ?? 0,
      previousHours: daily.get(previousDate)?.hours ?? 0,
    };
  });
  const current = { completed: 0, hours: 0 };
  const previous = { completed: 0, hours: 0 };
  for (const point of series) {
    current.completed += point.completed;
    current.hours += point.hours;
    previous.completed += point.previousCompleted;
    previous.hours += point.previousHours;
  }
  const rows = projects.map((project) => {
    const projectTasks = byProject.get(project.id) ?? [];
    const done = projectTasks.filter((task) => task.completedAt !== null);
    const periodDone = done.filter(
      (task) => task.completedAt! >= start && task.completedAt! <= end,
    );
    return {
      project,
      tasks: projectTasks,
      progress: projectTasks.length
        ? Math.round((done.length / projectTasks.length) * 100)
        : null,
      remaining: projectTasks.length - done.length,
      completed: periodDone.length,
      hours: periodDone.reduce((sum, task) => sum + task.hours, 0),
      startDate: projectTasks.length
        ? projectTasks.reduce(
            (date, task) => (task.startDate < date ? task.startDate : date),
            projectTasks[0]!.startDate,
          )
        : null,
    };
  });
  const overdue = tasks
    .filter((task) => !task.completedAt && task.dueDate < end)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcoming = tasks
    .filter(
      (task) =>
        !task.completedAt &&
        task.dueDate >= end &&
        task.dueDate <= shiftDate(end, 7),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const activity = tasks
    .filter(
      (task) =>
        task.completedAt &&
        task.completedAt >= start &&
        task.completedAt <= end,
    )
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!))
    .slice(0, 5);
  const owners = Array.from(
    new Set(projects.map((project) => project.owner)),
  ).map((owner) => ({
    label: owner,
    value: rows
      .filter((row) => row.project.owner === owner)
      .reduce((sum, row) => sum + row.remaining, 0),
  }));
  return {
    start,
    end,
    previousStart,
    previousEnd,
    current,
    previous,
    series,
    rows,
    overdue,
    upcoming,
    activity,
    owners,
  };
}

export type DashboardModel = ReturnType<typeof buildDashboard>;

export function comparisonText(current: number, previous: number) {
  if (previous === 0)
    return current === 0 ? "이전 기간과 동일" : "이전 기간 실적 없음";
  const percent = Math.round(((current - previous) / previous) * 100);
  return `이전 기간 대비 ${percent > 0 ? "+" : ""}${percent}%`;
}

function csvCell(value: string | number) {
  const text = String(value);
  const safe = /^[\s]*[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function toReportCsv(model: DashboardModel) {
  const rows = [
    [
      "시작일",
      "종료일",
      "프로젝트",
      "담당자",
      "완료 작업",
      "완료 작업 공수(h)",
    ],
    ...model.rows.map((row) => [
      model.start,
      model.end,
      row.project.name,
      row.project.owner,
      row.completed,
      row.hours,
    ]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function validateDashboardSearch(
  search: Record<string, unknown> & SearchSchemaInput,
) {
  return normalizeDashboardSearch(search);
}
