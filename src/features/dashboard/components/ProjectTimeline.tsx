import { Link } from "@tanstack/react-router";

import type { DashboardModel } from "@/features/dashboard/model/dashboard-utils";
import { ChartPanel } from "./DashboardCharts";

export function ProjectTimeline({ model }: { model: DashboardModel }) {
  const dates = model.rows.flatMap((row) => [
    row.startDate ?? model.end,
    row.project.dueDate,
  ]);
  const first = [model.end, ...dates].sort()[0]!;
  const last = [model.end, ...dates].sort().at(-1)!;
  const span = Math.max(86_400_000, Date.parse(last) - Date.parse(first));
  const position = (date: string) =>
    ((Date.parse(date) - Date.parse(first)) / span) * 100;
  return (
    <ChartPanel
      title="프로젝트 일정"
      description="작업 시작부터 프로젝트 마감까지 · 세로선은 샘플 기준일입니다."
    >
      <div className="text-ink-subtle mb-4 flex justify-between text-xs">
        <span>{first}</span>
        <span>{last}</span>
      </div>
      <ul className="grid gap-5">
        {model.rows.map((row) => (
          <li key={row.project.id}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <Link
                to="/projects/$projectId"
                params={{ projectId: row.project.id }}
                className="font-medium hover:underline"
              >
                {row.project.name}
              </Link>
              <span className="text-ink-subtle text-xs">
                {row.startDate ?? "시작일 미등록"} → {row.project.dueDate}
              </span>
            </div>
            <div
              className="bg-surface-muted relative h-7 overflow-hidden rounded"
              aria-hidden="true"
            >
              {row.startDate && row.startDate <= row.project.dueDate ? (
                <div
                  className="bg-brand-soft absolute top-1 h-5 rounded"
                  style={{
                    left: `${position(row.startDate)}%`,
                    width: `${position(row.project.dueDate) - position(row.startDate)}%`,
                  }}
                >
                  <div
                    className="bg-brand h-full rounded"
                    style={{ width: `${row.progress ?? 0}%` }}
                  />
                </div>
              ) : null}
              <div
                className="border-line-strong absolute inset-y-0 border-l-2 border-dashed"
                style={{ left: `${Math.min(99.5, position(model.end))}%` }}
              />
            </div>
            <p className="text-ink-subtle mt-1 text-xs">
              {row.progress === null
                ? "작업 미등록 · 진행률 없음"
                : `전체 작업 ${row.tasks.length}개 중 ${row.tasks.length - row.remaining}개 완료 · ${row.progress}%`}{" "}
              · {row.project.owner}
            </p>
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}
