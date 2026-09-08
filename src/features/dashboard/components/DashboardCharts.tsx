import { useId } from "react";

import type {
  DashboardModel,
  DashboardSearch,
} from "@/features/dashboard/model/dashboard-utils";
import { Card } from "@/shared/ui/card";

export function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="compact:p-4 min-w-0 p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="text-ink-subtle mt-1 text-sm">{description}</p>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export function TrendChart({
  model,
  metric,
}: {
  model: DashboardModel;
  metric: DashboardSearch["metric"];
}) {
  const id = useId();
  const previousKey =
    metric === "hours" ? "previousHours" : "previousCompleted";
  const unit = metric === "hours" ? "h" : "건";
  const maximum = Math.max(
    1,
    ...model.series.flatMap((point) => [point[metric], point[previousKey]]),
  );
  const x = (index: number) =>
    44 + (index / Math.max(1, model.series.length - 1)) * 512;
  const y = (value: number) => 180 - (value / maximum) * 144;
  const points = (previous: boolean) =>
    model.series
      .map(
        (point, index) =>
          `${x(index)},${y(point[previous ? previousKey : metric])}`,
      )
      .join(" ");
  return (
    <div>
      <div className="text-ink-muted mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <span>실선 · 선택 기간</span>
        <span>점선 · 이전 {model.series.length}일</span>
        <span>단위: {unit}</span>
      </div>
      <svg
        role="img"
        aria-labelledby={id}
        viewBox="0 0 580 216"
        className="text-ink-subtle w-full"
      >
        <title id={id}>
          일별 {metric === "hours" ? "완료 작업 공수" : "완료 작업"} 비교. 선택
          기간 {model.current[metric]}
          {unit}, 이전 기간 {model.previous[metric]}
          {unit}. 정확한 값은 아래 데이터 표에서 확인할 수 있습니다.
        </title>
        {[0, 0.5, 1].map((ratio) => (
          <g key={ratio}>
            <line
              x1="44"
              x2="556"
              y1={y(maximum * ratio)}
              y2={y(maximum * ratio)}
              stroke="currentColor"
              strokeOpacity="0.2"
            />
            <text
              x="34"
              y={y(maximum * ratio) + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
            >
              {Number((maximum * ratio).toFixed(1))}
            </text>
          </g>
        ))}
        <polyline
          points={points(true)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <polyline
          points={points(false)}
          fill="none"
          className="stroke-brand"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {[
          0,
          Math.floor((model.series.length - 1) / 2),
          model.series.length - 1,
        ].map((index) => (
          <text
            key={index}
            x={x(index)}
            y="204"
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
          >
            {model.series[index]!.date.slice(5)}
          </text>
        ))}
      </svg>
      <details className="mt-3 text-sm">
        <summary className="focus-visible:outline-brand cursor-pointer rounded py-2 font-medium focus-visible:outline-2">
          일별 데이터 표 보기
        </summary>
        <div
          className="border-line mt-2 max-h-72 overflow-auto rounded border"
          tabIndex={0}
          role="region"
          aria-label="일별 데이터 스크롤"
        >
          <table className="w-full min-w-96 text-left text-xs">
            <caption className="p-3 text-left">
              선택 기간과 이전 기간의 동일 순서 날짜 비교 ({unit})
            </caption>
            <thead>
              <tr>
                {["날짜", "선택 기간", "비교 날짜", "이전 기간"].map(
                  (label) => (
                    <th key={label} className="p-3 font-medium">
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {model.series.map((point) => (
                <tr key={point.date} className="border-line border-t">
                  <td className="p-3">{point.date}</td>
                  <td className="p-3 tabular-nums">{point[metric]}</td>
                  <td className="p-3">{point.previousDate}</td>
                  <td className="p-3 tabular-nums">{point[previousKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export function BarList({
  items,
  unit = "건",
}: {
  items: { label: string; value: number }[];
  unit?: string;
}) {
  const maximum = Math.max(1, ...items.map((item) => item.value));
  return (
    <ul className="grid gap-5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-2 flex justify-between gap-3 text-sm">
            <span className="min-w-0 break-words">{item.label}</span>
            <strong className="shrink-0 tabular-nums">
              {item.value.toLocaleString("ko-KR")}
              {unit}
            </strong>
          </div>
          <div aria-hidden="true" className="bg-surface-muted h-2 rounded-full">
            <div
              className="bg-brand h-full rounded-full"
              style={{ width: `${(item.value / maximum) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
