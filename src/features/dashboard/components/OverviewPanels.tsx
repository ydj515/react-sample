import { Link } from "@tanstack/react-router";

import type {
  DashboardModel,
  DashboardSearch,
} from "@/features/dashboard/model/dashboard-utils";
import { RecentProjects } from "./RecentProjects";
import { BarList, ChartPanel, TrendChart } from "./DashboardCharts";

export function OverviewPanels({
  model,
  filters,
}: {
  model: DashboardModel;
  filters: DashboardSearch;
}) {
  return (
    <>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ChartPanel
          title="완료 작업 추이"
          description={`${model.start} ~ ${model.end} · 이전 동일 길이 기간과 비교`}
        >
          <TrendChart model={model} metric="completed" />
        </ChartPanel>
        <ChartPanel
          title="프로젝트 상태 분포"
          description="선택된 담당자·상태에 해당하는 현재 프로젝트 수"
        >
          <BarList
            items={[
              {
                label: "진행 중",
                value: model.rows.filter(
                  (row) => row.project.status === "active",
                ).length,
              },
              {
                label: "일시 중지",
                value: model.rows.filter(
                  (row) => row.project.status === "paused",
                ).length,
              },
              {
                label: "완료",
                value: model.rows.filter(
                  (row) => row.project.status === "completed",
                ).length,
              },
            ]}
          />
        </ChartPanel>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <ChartPanel
          title="확인할 업무"
          description={`기준일 ${model.end} · 집계 기간과 무관한 미완료 작업`}
        >
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/operations"
              search={filters}
              className="rounded-panel border-caution-soft bg-caution-soft text-caution border p-4"
            >
              <span className="block text-sm">마감 지연</span>
              <strong className="mt-2 block text-2xl">
                {model.overdue.length}건
              </strong>
            </Link>
            <Link
              to="/operations"
              search={filters}
              className="rounded-panel border-line border p-4"
            >
              <span className="block text-sm">7일 내 마감</span>
              <strong className="mt-2 block text-2xl">
                {model.upcoming.length}건
              </strong>
            </Link>
          </div>
          <Link
            to="/reports"
            search={filters}
            className="text-brand mt-5 inline-block text-sm font-medium hover:underline"
          >
            분석 리포트에서 기간별 실적 보기 →
          </Link>
        </ChartPanel>
        <ChartPanel
          title="최근 완료 활동"
          description="집계 기간 내 최근 5개 작업"
        >
          {model.activity.length ? (
            <ul className="grid gap-4">
              {model.activity.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{task.title}</p>
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: task.projectId }}
                      className="text-brand text-xs hover:underline"
                    >
                      {
                        model.rows.find(
                          (row) => row.project.id === task.projectId,
                        )?.project.name
                      }
                    </Link>
                  </div>
                  <time
                    className="text-ink-subtle shrink-0 text-xs"
                    dateTime={task.completedAt!}
                  >
                    {task.completedAt}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-subtle text-sm">
              이 기간에 완료된 작업이 없습니다.
            </p>
          )}
        </ChartPanel>
      </div>
      <RecentProjects projects={model.rows.map((row) => row.project)} />
    </>
  );
}
