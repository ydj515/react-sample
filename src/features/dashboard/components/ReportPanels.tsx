import { Link } from "@tanstack/react-router";

import {
  toReportCsv,
  type DashboardModel,
  type DashboardSearch,
} from "@/features/dashboard/model/dashboard-utils";
import { CollectionTable } from "@/shared/ui/collection-table";
import { FilterField } from "@/shared/ui/filter-bar";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { BarList, ChartPanel, TrendChart } from "./DashboardCharts";

export function ReportPanels({
  model,
  filters,
  onChange,
}: {
  model: DashboardModel;
  filters: DashboardSearch;
  onChange: (filters: DashboardSearch) => void;
}) {
  const isHours = filters.metric === "hours";
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([toReportCsv(model)], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `project-report-${model.start}-${model.end}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <FilterField label="분석 지표">
          <Select
            value={filters.metric}
            onChange={(event) =>
              onChange({
                ...filters,
                metric: event.target.value as DashboardSearch["metric"],
              })
            }
          >
            <option value="completed">완료 작업 수</option>
            <option value="hours">완료 작업 공수</option>
          </Select>
        </FilterField>
        <Button variant="secondary" onClick={download}>
          CSV 다운로드
        </Button>
      </div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ChartPanel
          title={isHours ? "완료 작업 공수 비교" : "완료 작업 수 비교"}
          description={`${model.start} ~ ${model.end} / 비교 ${model.previousStart} ~ ${model.previousEnd}`}
        >
          <TrendChart model={model} metric={filters.metric} />
        </ChartPanel>
        <ChartPanel
          title="프로젝트별 실적"
          description={`선택 기간의 ${isHours ? "완료 작업 공수" : "완료 작업 수"}`}
        >
          <BarList
            items={model.rows.map((row) => ({
              label: row.project.name,
              value: row[filters.metric],
            }))}
            unit={isHours ? "h" : "건"}
          />
        </ChartPanel>
      </div>
      <ChartPanel
        title="프로젝트별 집계"
        description="CSV에는 아래 표의 필터 결과와 집계 기간이 포함됩니다. 공수는 완료된 작업에 기록된 시간을 합산합니다."
      >
        <CollectionTable
          label={`${model.start}부터 ${model.end}까지 프로젝트 실적`}
          scrollLabel="프로젝트 집계 표 스크롤"
          minWidth={520}
        >
          <thead>
            <tr>
              {["프로젝트", "담당자", "완료 작업", "완료 공수"].map((label) => (
                <th scope="col" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.rows.map((row) => (
              <tr key={row.project.id}>
                <td>
                  <Link
                    className="text-brand font-medium hover:underline"
                    to="/projects/$projectId"
                    params={{ projectId: row.project.id }}
                  >
                    {row.project.name}
                  </Link>
                </td>
                <td>{row.project.owner}</td>
                <td className="tabular-nums">{row.completed}건</td>
                <td className="tabular-nums">{row.hours}h</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={2}>합계</td>
              <td>{model.current.completed}건</td>
              <td>{model.current.hours}h</td>
            </tr>
          </tfoot>
        </CollectionTable>
      </ChartPanel>
    </>
  );
}
