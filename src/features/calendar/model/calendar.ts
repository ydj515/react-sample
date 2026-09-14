import { z } from "zod";

const minute = 60_000;

const civilTime = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(`${value}Z`)) &&
      new Date(`${value}Z`).toISOString().slice(0, 16) === value,
    "올바른 날짜와 시간을 입력하세요.",
  );

export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1, "제목을 입력하세요.").max(100),
    start: civilTime,
    end: civilTime,
    description: z.string().trim().max(1000),
  })
  .refine((value) => value.end > value.start, {
    path: ["end"],
    message: "종료는 시작 이후여야 합니다.",
  });

export const eventSchema = eventInputSchema.extend({ id: z.string().min(1) });

export const eventsSchema = z.array(eventSchema).max(1000);

export type CalendarEvent = z.infer<typeof eventSchema>;

export type EventInput = z.infer<typeof eventInputSchema>;

export type CalendarView = "month" | "week" | "day";

export function seoulToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function navigateDate(
  date: string,
  view: CalendarView,
  direction: number,
) {
  if (view !== "month") {
    return shiftDate(date, direction * (view === "week" ? 7 : 1));
  }
  const value = new Date(`${date.slice(0, 7)}-01T12:00:00Z`);
  value.setUTCMonth(value.getUTCMonth() + direction);
  return value.toISOString().slice(0, 10);
}

export function calendarDays(date: string, view: CalendarView) {
  if (view === "day") return [date];
  const anchor = view === "month" ? `${date.slice(0, 7)}-01` : date;

  const weekday = new Date(`${anchor}T12:00:00Z`).getUTCDay();

  const first = shiftDate(anchor, -weekday);
  return Array.from({ length: view === "month" ? 42 : 7 }, (_, index) =>
    shiftDate(first, index),
  );
}

export function conflicts(
  candidate: EventInput & { id?: string },
  events: CalendarEvent[],
) {
  return events.filter(
    (event) =>
      event.id !== candidate.id &&
      candidate.start < event.end &&
      event.start < candidate.end,
  );
}

export function moveEvent(event: CalendarEvent, start: string): CalendarEvent {
  const duration = Date.parse(`${event.end}Z`) - Date.parse(`${event.start}Z`);
  return {
    ...event,
    start,
    end: new Date(Date.parse(`${start}Z`) + duration)
      .toISOString()
      .slice(0, 16),
  };
}

export function eventsForDay(events: CalendarEvent[], day: string) {
  return events
    .filter(
      (event) =>
        event.start < `${shiftDate(day, 1)}T00:00` &&
        event.end > `${day}T00:00`,
    )
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function timeRange(event: CalendarEvent) {
  return `${event.start.replace("T", " ")} – ${event.end.replace("T", " ")}`;
}

export function newEventInput(day: string, hour = "09:00"): EventInput {
  const start = `${day}T${hour}`;
  return {
    title: "",
    start,
    end: new Date(Date.parse(`${start}Z`) + 60 * minute)
      .toISOString()
      .slice(0, 16),
    description: "",
  };
}
