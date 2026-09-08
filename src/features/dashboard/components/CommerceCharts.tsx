import { useId, useState, type ReactNode } from "react";
import type { CommerceDashboard } from "@/features/dashboard/model/commerce-schema";
import { formatWon } from "@/features/dashboard/model/commerce-utils";
import { Card } from "@/shared/ui/card";
import { Select } from "@/shared/ui/select";

export function CommercePanel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="compact:p-4 min-w-0 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}
const captionClass = "mb-3 text-xs text-ink-subtle";
const cellClass = "border-t border-line p-2 text-left";
export function MonthlyRevenue({
  data,
}: {
  data: CommerceDashboard["monthly"];
}) {
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(1, ...data.map((item) => item.amount));
  const slot = 510 / Math.max(1, data.length);
  return (
    <CommercePanel title="월별 매출 추이">
      <p className={captionClass}>2024년 12월 ~ 2025년 6월 · 단위: 백만 원</p>
      <div className="pt-6" role="group" aria-label="월별 매출 금액 조회">
        <div className="relative">
          <svg
            viewBox="0 0 560 230"
            role="img"
            aria-labelledby={id}
            className="text-ink-subtle block w-full"
          >
            <title id={id}>
              월별 매출.{" "}
              {data
                .map((item) => `${item.label} ${formatWon(item.amount)}`)
                .join(", ")}
            </title>
            <rect
              x="40"
              y="24"
              width="510"
              height="170"
              rx="8"
              className="fill-canvas"
            />
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <g key={ratio}>
                <line
                  x1="40"
                  x2="550"
                  y1={194 - ratio * 150}
                  y2={194 - ratio * 150}
                  className="stroke-line"
                  strokeWidth="0.5"
                />
                <text
                  x="32"
                  y={198 - ratio * 150}
                  textAnchor="end"
                  fill="currentColor"
                  fontSize="10"
                >
                  {((max * ratio) / 1e6).toFixed(1)}
                </text>
              </g>
            ))}
            {data.map((item, index) => (
              <g key={item.label}>
                <rect
                  x={40 + index * slot + 6}
                  y={194 - (item.amount / max) * 150}
                  width={Math.max(1, slot - 12)}
                  height={(item.amount / max) * 150}
                  rx="4"
                  className={
                    active === item.label || index === data.length - 1
                      ? "fill-brand stroke-brand"
                      : "fill-brand/5 stroke-brand/60"
                  }
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={40 + (index + 0.5) * slot}
                  y={184 - (item.amount / max) * 150}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  opacity={active === item.label ? 0 : 1}
                >
                  {(item.amount / 1e6).toFixed(1)}
                </text>
                <text
                  x={40 + (index + 0.5) * slot}
                  y="218"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                >
                  {item.label}
                </text>
              </g>
            ))}
          </svg>
          {data.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-label={`${item.label} 매출 ${formatWon(item.amount)}`}
              aria-describedby={
                active === item.label ? `${id}-tooltip-${index}` : undefined
              }
              className="focus-visible:outline-brand absolute cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                left: `${((40 + index * slot) / 560) * 100}%`,
                width: `${(slot / 560) * 100}%`,
                top: `${(44 / 230) * 100}%`,
                height: `${(150 / 230) * 100}%`,
              }}
              onPointerEnter={() => setActive(item.label)}
              onPointerLeave={(event) => {
                if (event.currentTarget !== document.activeElement)
                  setActive(null);
              }}
              onFocus={() => setActive(item.label)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(item.label)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setActive(null);
                }
              }}
            >
              {active === item.label ? (
                <span
                  role="tooltip"
                  id={`${id}-tooltip-${index}`}
                  className={`bg-ink text-surface absolute z-10 mb-2 rounded px-2 py-1 text-xs whitespace-nowrap shadow-sm ${index === 0 ? "left-0" : index === data.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                  style={{ bottom: `${(item.amount / max) * 100}%` }}
                >
                  <span className="block font-semibold">
                    {item.label}: ₩{(item.amount / 1e6).toFixed(1)}M
                  </span>
                  <span className="block text-[11px]">
                    {formatWon(item.amount)}
                  </span>
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <details className="mt-2 text-xs">
        <summary className="text-brand cursor-pointer py-2 font-medium">
          월별 매출 전체 보기
        </summary>
        <table className="w-full">
          <caption className="sr-only">월별 매출 데이터</caption>
          <thead>
            <tr>
              <th className={cellClass}>월</th>
              <th className={cellClass}>매출(원)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.label}>
                <td className={cellClass}>{item.label}</td>
                <td className={cellClass}>{formatWon(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </CommercePanel>
  );
}
export function VisitorTrend({ data }: { data: CommerceDashboard["traffic"] }) {
  const id = useId();
  const [selected, setSelected] = useState(data.length - 1);
  const selectedIndex = Math.min(selected, data.length - 1);
  const active = data[selectedIndex]!;
  const max =
    Math.ceil(Math.max(...data.map((item) => item.visitors), 1) / 1000) * 1000;
  const x = (index: number) => 42 + (index / (data.length - 1)) * 496;
  const y = (value: number) => 190 - (value / max) * 155;
  const points = (key: "visitors" | "converted") =>
    data.map((item, i) => `${x(i)},${y(item[key])}`).join(" ");
  return (
    <CommercePanel title="일별 방문자 & 전환 추이">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-ink-subtle">최근 14일 · 단위: 명</p>
        <div className="flex gap-4">
          <span className="text-brand">━ 방문자</span>
          <span className="text-positive">┄ 전환</span>
        </div>
      </div>
      <svg
        viewBox="0 0 560 220"
        role="img"
        aria-labelledby={id}
        className="text-ink-subtle w-full"
      >
        <title id={id}>
          일별 방문자와 전환 수 비교. 정확한 수치는 날짜 선택과 데이터 표에서
          확인할 수 있습니다.
        </title>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <g key={ratio}>
            <line
              x1="42"
              x2="538"
              y1={y(max * ratio)}
              y2={y(max * ratio)}
              stroke="currentColor"
              strokeOpacity=".2"
              strokeDasharray="3 3"
            />
            <text
              x="34"
              y={y(max * ratio) + 4}
              textAnchor="end"
              fill="currentColor"
              fontSize="10"
            >
              {((max * ratio) / 1000).toFixed(1)}k
            </text>
          </g>
        ))}
        <polygon
          points={`42,190 ${points("visitors")} 538,190`}
          className="fill-brand/5"
        />
        <polyline
          points={points("visitors")}
          fill="none"
          className="stroke-brand"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polyline
          points={points("converted")}
          fill="none"
          className="stroke-chart-positive"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
        <line
          x1={x(selectedIndex)}
          x2={x(selectedIndex)}
          y1="30"
          y2="190"
          stroke="currentColor"
          strokeDasharray="3 3"
        />
        <circle
          cx={x(selectedIndex)}
          cy={y(active.visitors)}
          r="4"
          className="fill-brand"
        />
        {data.map((item, index) => (
          <g key={item.date}>
            <rect
              x={x(index) - 16}
              y="20"
              width="32"
              height="170"
              fill="transparent"
              onPointerEnter={() => setSelected(index)}
              onClick={() => setSelected(index)}
            />
            {[0, 4, 8, 13].includes(index) ? (
              <text
                x={x(index)}
                y="212"
                textAnchor="middle"
                fill="currentColor"
                fontSize="11"
              >
                {item.date.slice(5).replace("-", "/")}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <div className="rounded-panel bg-surface-muted mt-2 flex flex-wrap items-center gap-3 p-3 text-xs">
        <Select
          aria-label="방문 추이 날짜"
          className="w-auto"
          value={selectedIndex}
          onChange={(event) => setSelected(Number(event.target.value))}
        >
          {data.map((point, i) => (
            <option key={point.date} value={i}>
              {point.date.slice(5)}
            </option>
          ))}
        </Select>
        <p aria-live="polite">
          방문자 <strong>{active.visitors.toLocaleString("ko-KR")}명</strong> ·
          전환 <strong>{active.converted}명</strong>
        </p>
      </div>
      <details className="mt-2 text-xs">
        <summary className="text-brand cursor-pointer py-2 font-medium">
          방문·전환 데이터 표 보기
        </summary>
        <div className="max-h-64 overflow-auto">
          <table className="w-full">
            <caption className="sr-only">일별 방문 및 전환 데이터</caption>
            <thead>
              <tr>
                {["날짜", "방문자(명)", "전환(명)"].map((label) => (
                  <th key={label} className={cellClass}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.date}>
                  <td className={cellClass}>{item.date}</td>
                  <td className={cellClass}>
                    {item.visitors.toLocaleString("ko-KR")}
                  </td>
                  <td className={cellClass}>{item.converted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </CommercePanel>
  );
}
const categoryColors = [
  "var(--ui-brand)",
  "var(--ui-chart-positive)",
  "var(--ui-chart-caution)",
  "var(--ui-ink-subtle)",
];
export function CategoryRevenue({
  data,
}: {
  data: CommerceDashboard["categories"];
}) {
  const [active, setActive] = useState<number | null>(null);
  const id = useId();
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const segments = data.map((item, i) => ({
    ...item,
    percent: total ? (item.amount / total) * 100 : 0,
    offset: total
      ? (data.slice(0, i).reduce((sum, previous) => sum + previous.amount, 0) /
          total) *
        100
      : 0,
  }));
  const selected = active === null ? null : data[active];
  return (
    <CommercePanel title="카테고리별 매출 비중">
      <p className={captionClass}>2025년 6월 · 총 매출 {formatWon(total)}</p>
      <div className="relative mx-auto my-5 size-44">
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-labelledby={id}
          className="size-full -rotate-90"
        >
          <title id={id}>
            {segments
              .map((item) => `${item.label} ${item.percent.toFixed(0)}%`)
              .join(", ")}
          </title>
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            className="stroke-line"
            strokeWidth="18"
          />
          {segments.map((item, index) => (
            <circle
              key={item.label}
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke={categoryColors[index % categoryColors.length]}
              strokeWidth="18"
              pathLength="100"
              strokeDasharray={`${item.percent} ${100 - item.percent}`}
              strokeDashoffset={-item.offset}
              opacity={active === null || active === index ? 1 : 0.25}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <strong className="text-xl">
            ₩{((selected?.amount ?? total) / 1e6).toFixed(selected ? 2 : 1)}M
          </strong>
          <span className="text-ink-subtle mt-1 text-xs">
            {selected?.label ?? "총 매출"}
          </span>
        </div>
      </div>
      <ul className="grid gap-1">
        {segments.map((item, index) => (
          <li key={item.label}>
            <button
              type="button"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(index)}
              className="rounded-control hover:bg-surface-muted focus-visible:outline-brand flex min-h-11 w-full items-center gap-2 px-2 text-left text-xs focus-visible:outline-2"
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  background: categoryColors[index % categoryColors.length],
                }}
              />
              <span className="flex-1">{item.label}</span>
              <strong>{formatWon(item.amount)}</strong>
              <span className="text-ink-subtle w-9 text-right">
                {item.percent.toFixed(0)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </CommercePanel>
  );
}
