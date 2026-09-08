import { PageHeader } from "@/shared/ui/page-header";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import {
  buildDashboard,
  comparisonText,
  normalizeDashboardSearch,
  type DashboardSearch,
} from "@/features/dashboard/model/dashboard-utils";
import { dashboardQueryOptions } from "@/features/dashboard/queries/dashboard-queries";
import { EmptyState } from "@/shared/ui/empty-state";
import { QueryFeedback } from "@/shared/ui/query-feedback";
import { DashboardFilters } from "./DashboardFilters";
import { MetricCard } from "./MetricCard";
import { OperationsPanels } from "./OperationsPanels";
import { ReportPanels } from "./ReportPanels";

const views = {
  overview: {
    title: "종합 대시보드",
    description: "프로젝트 실적과 지금 확인할 업무를 한눈에 살펴보세요.",
    to: "/",
  },
  operations: {
    title: "프로젝트 운영",
    description: "프로젝트 일정, 담당자별 업무량과 마감 현황을 확인하세요.",
    to: "/operations",
  },
  reports: {
    title: "분석 리포트",
    description: "기간별 작업 실적을 비교하고 프로젝트별 집계를 내려받으세요.",
    to: "/reports",
  },
} as const;

export function DashboardWorkspace({
  view,
}: {
  view: "operations" | "reports";
}) {
  const rawSearch = useSearch({ strict: false });
  const filters = useMemo(
    () => normalizeDashboardSearch(rawSearch),
    [rawSearch],
  );
  const navigate = useNavigate();
  const query = useQuery(dashboardQueryOptions());
  const model = useMemo(
    () => (query.data ? buildDashboard(query.data, filters) : null),
    [query.data, filters],
  );
  const onChange = (search: DashboardSearch) => {
    void navigate({ to: views[view].to, search });
  };
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title={views[view].title}
        description={views[view].description}
      />
      <nav
        aria-label="대시보드 화면"
        className="border-line flex flex-wrap gap-2 border-b pb-3"
      >
        {Object.entries(views).map(([key, item]) => (
          <Link
            key={key}
            to={item.to}
            search={item.to === "/" ? undefined : filters}
            aria-current={key === view ? "page" : undefined}
            className={`rounded-control px-3 py-2 text-sm font-medium ${key === view ? "bg-brand-soft text-brand" : "text-ink-muted hover:bg-surface-muted"}`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <DashboardFilters
        filters={filters}
        owners={Array.from(
          new Set(query.data?.projects.map((project) => project.owner) ?? []),
        ).sort()}
        onChange={onChange}
        onRefresh={() => void query.refetch()}
        refreshing={query.isFetching}
      />
      <QueryFeedback
        pending={query.isPending}
        pendingLabel="대시보드 로딩 중"
        error={query.error}
        errorMessage={`대시보드 데이터를 불러오지 못했습니다.${model ? " 마지막으로 불러온 데이터를 표시합니다." : ""}`}
        retrying={query.isFetching}
        onRetry={() => void query.refetch()}
      />
      {model ? (
        <>
          <p className="text-ink-subtle text-xs leading-relaxed">
            샘플 기준일 {model.end} · 집계 {model.start} ~ {model.end} ·
            프로젝트 상태·일정·남은 작업은 기준일 현재 값입니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="전체 프로젝트"
              value={model.rows.length}
              note="선택 조건에 해당하는 현재 프로젝트"
            />
            <MetricCard
              label="기간 내 완료 작업"
              value={`${model.current.completed}건`}
              note={comparisonText(
                model.current.completed,
                model.previous.completed,
              )}
            />
            <MetricCard
              label="완료 작업 공수"
              value={`${model.current.hours}h`}
              note={comparisonText(model.current.hours, model.previous.hours)}
            />
            <MetricCard
              label="마감 지연 작업"
              value={`${model.overdue.length}건`}
              note="기준일 이전 마감 · 미완료 작업"
            />
          </div>
          {!model.rows.length ? (
            <EmptyState
              title="조건에 맞는 프로젝트가 없습니다."
              onReset={() => onChange(normalizeDashboardSearch({}))}
            />
          ) : (
            <>
              {view === "operations" ? (
                <OperationsPanels model={model} />
              ) : null}
              {view === "reports" ? (
                <ReportPanels
                  model={model}
                  filters={filters}
                  onChange={onChange}
                />
              ) : null}
            </>
          )}
        </>
      ) : null}
    </section>
  );
}
