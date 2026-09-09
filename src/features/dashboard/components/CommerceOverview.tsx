import { QueryBoundary } from "@/shared/ui/query-boundary";
import { PageHeader } from "@/shared/ui/page-header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCsv } from "@/features/dashboard/model/commerce-utils";
import type { CommerceDashboard } from "@/features/dashboard/model/commerce-schema";
import { commerceQueryOptions } from "@/features/dashboard/queries/commerce-queries";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { QueryFeedback } from "@/shared/ui/query-feedback";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/ui/dialog";
import {
  CommercePanel,
  MonthlyRevenue,
  VisitorTrend,
  CategoryRevenue,
} from "./CommerceCharts";
import { CommerceOrders } from "./CommerceOrders";
import { downloadCommerceCsv } from "./commerce-download";
import { OrderSearch } from "./OrderSearch";

function summaryCsv(data: CommerceDashboard, title: string) {
  return createCsv([
    ["보고서", title],
    ["샘플 기준일", data.asOf],
    ["지표", "값"],
    ["총 매출(원)", data.revenue],
    ["신규 사용자(명)", data.newUsers],
    ["전환율(%)", data.conversionRate],
    ["활성 세션(개)", data.sessions],
    [],
    ["월", "매출(원)"],
    ...data.monthly.map((item) => [item.label, item.amount]),
    [],
    ["카테고리", "매출(원)"],
    ...data.categories.map((item) => [item.label, item.amount]),
  ]);
}
const reportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "보고서 이름을 입력하세요.")
    .max(80, "80자 이하로 입력하세요."),
});
function NewCommerceReport({ data }: { data: CommerceDashboard }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: "2025년 6월 운영 보고서" },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />새 보고서
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">새 보고서</DialogTitle>
        <DialogDescription className="text-ink-subtle mt-2 text-sm">
          기준일의 KPI, 월별 매출, 카테고리별 매출을 CSV 보고서로 생성합니다.
        </DialogDescription>
        <form
          className="mt-5 grid gap-4"
          onSubmit={handleSubmit(({ title }) =>
            downloadCommerceCsv(
              summaryCsv(data, title),
              `commerce-report-${data.asOf}.csv`,
            ),
          )}
          noValidate
        >
          <label className="grid gap-2 text-sm">
            보고서 이름
            <Input {...register("title")} />
          </label>
          {errors.title ? (
            <p role="alert" className="text-negative text-sm">
              {errors.title.message}
            </p>
          ) : null}
          {isSubmitSuccessful ? (
            <p role="status" className="text-positive text-sm">
              보고서 다운로드를 시작했습니다.
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                닫기
              </Button>
            </DialogClose>
            <Button type="submit">보고서 생성</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function CommerceOverviewContent() {
  const query = useSuspenseQuery(commerceQueryOptions());
  const user = useAuthStore((state) => state.user);
  const name = user?.email.split("@")[0] ?? "사용자";
  const data = query.data;
  const previousRevenue = data?.monthly.at(-2)?.amount ?? 0;
  const revenueChange =
    data && previousRevenue > 0
      ? (data.revenue / previousRevenue - 1) * 100
      : null;
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="종합 대시보드"
        description={<>2025년 6월 30일 — 안녕하세요, {name}님</>}
        actions={
          <>
            <Button
              aria-label="대시보드 새로고침"
              variant="ghost"
              size="icon"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              <RefreshCw className="size-4" aria-hidden />
            </Button>
            <Button
              variant="secondary"
              disabled={!data}
              onClick={() => {
                if (data)
                  downloadCommerceCsv(
                    summaryCsv(data, "대시보드 요약"),
                    `dashboard-${data.asOf}.csv`,
                  );
              }}
            >
              <Download className="size-4" aria-hidden />
              내보내기
            </Button>
            {data ? <NewCommerceReport data={data} /> : null}
          </>
        }
      />
      <QueryFeedback
        pending={false}
        pendingLabel="대시보드 로딩 중"
        error={query.error}
        errorMessage={`대시보드 데이터를 불러오지 못했습니다.${data ? " 마지막으로 불러온 데이터를 표시합니다." : ""}`}
        retrying={query.isFetching}
        onRetry={() => void query.refetch()}
      />
      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "총 매출",
                value: `₩${(data.revenue / 1e6).toFixed(1)}M`,
                change:
                  revenueChange === null
                    ? "전월 실적 없음"
                    : `${revenueChange.toFixed(1)}% 전월 대비`,
                down: revenueChange !== null && revenueChange < 0,
              },
              {
                label: "신규 사용자",
                value: data.newUsers.toLocaleString("ko-KR"),
                change: "8.1% 전월 대비",
                down: false,
              },
              {
                label: "전환율",
                value: `${data.conversionRate}%`,
                change: "0.4%p 전월 대비",
                down: true,
              },
              {
                label: "활성 세션",
                value: data.sessions.toLocaleString("ko-KR"),
                change: "기준일 스냅샷",
                down: false,
              },
            ].map((metric) => (
              <Card key={metric.label} className="compact:p-4 p-5">
                <p className="text-ink-subtle text-sm font-medium">
                  {metric.label}
                </p>
                <p className="mt-2 text-[28px] font-semibold tracking-tight tabular-nums">
                  {metric.value}
                </p>
                <p
                  className={`mt-2 flex items-center gap-1 text-xs ${metric.down ? "text-negative" : "text-positive"}`}
                >
                  {metric.label !== "활성 세션" ? (
                    metric.down ? (
                      <ArrowDownRight className="size-3.5" aria-hidden />
                    ) : (
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    )
                  ) : null}
                  {metric.change}
                </p>
              </Card>
            ))}
          </div>
          <p className="text-ink-subtle text-xs">
            샘플 기준일 {data.asOf} · 매출·사용자 지표는 6월 전체 요약이며, 주문
            목록은 별도의 예시 23건입니다.
          </p>
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <MonthlyRevenue data={data.monthly} />
            <CommercePanel
              title="최근 활동"
              action={
                <span className="text-ink-subtle text-xs">
                  최근 {data.activities.length}건
                </span>
              }
            >
              <ul className="grid gap-5">
                {data.activities.map((activity) => (
                  <li key={activity.text} className="flex gap-3">
                    <span
                      aria-hidden
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${activity.tone === "warning" ? "bg-chart-caution" : activity.tone === "success" ? "bg-chart-positive" : "bg-brand"}`}
                    />
                    <div>
                      <p className="text-sm leading-5">{activity.text}</p>
                      <p className="text-ink-subtle mt-1 text-xs">
                        {activity.time} · 기준일 기준
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CommercePanel>
          </div>
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <VisitorTrend data={data.traffic} />
            <CategoryRevenue data={data.categories} />
          </div>
          <OrderSearch orders={data.orders} asOf={data.asOf} />
          <CommercePanel
            title="최근 주문"
            action={
              <a
                href="#order-search"
                className="text-brand text-xs font-medium"
              >
                전체 보기
              </a>
            }
          >
            <CommerceOrders
              orders={[...data.orders]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5)}
              caption="최근 주문"
            />
          </CommercePanel>
        </>
      ) : null}
    </section>
  );
}

export function CommerceOverview() {
  return (
    <QueryBoundary errorMessage={"대시보드 데이터를 불러오지 못했습니다."}>
      <CommerceOverviewContent />
    </QueryBoundary>
  );
}
