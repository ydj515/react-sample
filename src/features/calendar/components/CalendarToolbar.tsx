import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  calendarDays,
  type CalendarView,
} from "@/features/calendar/model/calendar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function CalendarToolbar({
  date,
  view,
  onDate,
  onView,
  onNavigate,
  onToday,
}: {
  date: string;
  view: CalendarView;
  onDate: (date: string) => void;
  onView: (view: CalendarView) => void;
  onNavigate: (direction: number) => void;
  onToday: () => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4"
      aria-label="캘린더 도구 모음"
      role="group"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight"
            aria-live="polite"
          >
            {new Intl.DateTimeFormat("ko-KR", {
              year: "numeric",
              month: "long",
              ...(view === "day"
                ? ({ day: "numeric", weekday: "short" } as const)
                : {}),
              timeZone: "UTC",
            }).format(new Date(`${date}T12:00Z`))}
          </h2>
          {view === "week" && (
            <p className="text-ink-subtle mt-1 text-xs">
              {calendarDays(date, view)[0]} – {calendarDays(date, view).at(-1)}
            </p>
          )}
        </div>
        <label className="text-ink-subtle grid gap-1 text-xs">
          <span className="sr-only">기준 날짜</span>
          <Input
            type="date"
            className="w-36 text-xs"
            value={date}
            onChange={(event) => {
              if (event.target.value) onDate(event.target.value);
            }}
          />
        </label>
      </div>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
        <div
          className="bg-surface-muted flex gap-1 rounded-lg p-1"
          role="group"
          aria-label="캘린더 보기"
        >
          {(["month", "week", "day"] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={view === mode ? "secondary" : "ghost"}
              aria-pressed={view === mode}
              onClick={() => onView(mode)}
            >
              {{ month: "월", week: "주", day: "일" }[mode]}
            </Button>
          ))}
        </div>
        <div
          className="border-line flex items-center rounded-lg border"
          role="group"
          aria-label="날짜 이동"
        >
          <Button
            variant="secondary"
            className="rounded-r-none border-0"
            size="icon"
            aria-label="이전 기간"
            onClick={() => onNavigate(-1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button variant="ghost" className="rounded-none" onClick={onToday}>
            오늘
          </Button>
          <Button
            variant="secondary"
            className="rounded-l-none border-0"
            size="icon"
            aria-label="다음 기간"
            onClick={() => onNavigate(1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
