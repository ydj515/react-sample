import { Link } from "@tanstack/react-router";

import type { DashboardModel } from "@/features/dashboard/model/dashboard-utils";
import { BarList, ChartPanel } from "./DashboardCharts";
import { ProjectTimeline } from "./ProjectTimeline";
import { ProjectStatusBadge } from "@/features/projects/components";

export function OperationsPanels({ model }: { model: DashboardModel }) {
  return (
    <>
      <ProjectTimeline model={model} />
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <ChartPanel
          title="담당자별 남은 작업"
          description="프로젝트 담당자 기준 미완료 작업 수 · 현재 상태"
        >
          <BarList items={model.owners} />
        </ChartPanel>
        <ChartPanel
          title="마감 점검"
          description="지연 작업과 기준일부터 7일 이내 마감 작업을 표시합니다."
        >
          {model.overdue.length + model.upcoming.length ? (
            <ul className="max-h-80 space-y-3 overflow-auto">
              {[...model.overdue, ...model.upcoming].map((task) => (
                <li
                  key={task.id}
                  className="rounded-control border-line border p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm">{task.title}</strong>
                    <span
                      className={`text-xs ${task.dueDate < model.end ? "text-caution" : "text-ink-subtle"}`}
                    >
                      {task.dueDate < model.end ? "지연" : "마감 예정"} ·{" "}
                      {task.dueDate}
                    </span>
                  </div>
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: task.projectId }}
                    className="text-brand mt-1 inline-block text-xs hover:underline"
                  >
                    {
                      model.rows.find(
                        (row) => row.project.id === task.projectId,
                      )?.project.name
                    }
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-subtle text-sm">
              확인할 마감 작업이 없습니다.
            </p>
          )}
        </ChartPanel>
      </div>
      <ChartPanel
        title="프로젝트 진행 현황"
        description="진행률은 전체 등록 작업 기준이며, 완료 실적은 선택한 집계 기간 기준입니다."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {model.rows.map((row) => (
            <div
              key={row.project.id}
              className="rounded-panel border-line border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  className="font-medium hover:underline"
                  to="/projects/$projectId"
                  params={{ projectId: row.project.id }}
                >
                  {row.project.name}
                </Link>
                <ProjectStatusBadge status={row.project.status} />
              </div>
              <p className="text-ink-subtle mt-1 text-xs">
                {row.project.owner} · 마감 {row.project.dueDate}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <progress
                  className="progress-meter w-full"
                  aria-label={`${row.project.name} 진행률`}
                  value={row.progress ?? 0}
                  max={100}
                />
                <span className="text-sm tabular-nums">
                  {row.progress === null ? "—" : `${row.progress}%`}
                </span>
              </div>
              <p className="text-ink-subtle mt-2 text-xs">
                기간 내 완료 {row.completed}건 · {row.hours}h / 현재 남은 작업{" "}
                {row.remaining}건
              </p>
            </div>
          ))}
        </div>
      </ChartPanel>
    </>
  );
}
