import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  calendarDays,
  eventsForDay,
  seoulToday,
  type CalendarEvent,
  type CalendarView,
} from "@/features/calendar/model/calendar";
import { CalendarEventCard } from "./CalendarEventCard";
import { cn } from "@/shared/lib/cn";

function CalendarCell({
  day,
  time,
  events,
  muted,
  today,
  onEdit,
  onCreate,
}: {
  day: string;
  time?: string;
  events: CalendarEvent[];
  muted: boolean;
  today: string;
  onEdit: (event: CalendarEvent) => void;
  onCreate: (day: string, time?: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${day}T${time ?? "day"}`,
    data: { day, time },
  });
  return (
    <div
      ref={setNodeRef}
      data-testid={`calendar-cell-${day}${time ? `-${time}` : ""}`}
      className={cn(
        "border-line group min-w-0 border-r border-b p-2",
        time ? "min-h-20" : "min-h-28 xl:min-h-32",
        muted && "bg-surface-muted",
        day === today && "bg-brand-soft/30",
        isOver && "bg-brand-soft outline-brand outline-2 -outline-offset-2",
      )}
    >
      <button
        type="button"
        className={cn(
          "mb-2 flex min-h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-medium",
          !time &&
            new Date(`${day}T12:00Z`).getUTCDay() === 0 &&
            "text-negative",
          !time && new Date(`${day}T12:00Z`).getUTCDay() === 6 && "text-info",
          muted && "opacity-45",
          day === today && !time && "bg-brand text-white opacity-100",
          time && "text-ink-subtle",
        )}
        aria-current={day === today && !time ? "date" : undefined}
        aria-label={`${day} ${time ?? "09:00"} 일정 추가`}
        onClick={() => onCreate(day, time)}
      >
        {time ?? Number(day.slice(8))}
      </button>
      <div className="grid gap-1">
        {events.map((event) => (
          <CalendarEventCard
            key={event.id}
            event={event}
            day={day}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

export function CalendarGrid({
  date,
  view,
  events,
  onEdit,
  onCreate,
  onMove,
}: {
  date: string;
  view: CalendarView;
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onCreate: (day: string, time?: string) => void;
  onMove: (event: CalendarEvent, start: string) => void;
}) {
  const [active, setActive] = useState<CalendarEvent | null>(null);

  const days = calendarDays(date, view);

  const today = seoulToday();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) =>
        setActive(event.active.data.current?.event as CalendarEvent)
      }
      onDragCancel={() => setActive(null)}
      onDragEnd={(event) => {
        setActive(null);
        const target = event.over?.data.current as
          { day?: string; time?: string } | undefined;

        const moved = event.active.data.current?.event as
          CalendarEvent | undefined;
        if (moved && target?.day) {
          onMove(
            moved,
            `${target.day}T${target.time ?? moved.start.slice(11)}`,
          );
        }
      }}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Space로 일정을 잡고 방향키로 이동하세요. Space로 놓고 Escape로 취소합니다. 정확한 시간은 일정 수정에서도 변경할 수 있습니다.",
        },
      }}
    >
      <div
        className="border-line bg-surface overflow-x-auto rounded-xl border"
        role="region"
        aria-label="일정 캘린더"
        tabIndex={0}
      >
        <div className={cn(view === "day" ? "min-w-0" : "min-w-[700px]")}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${days.length === 1 ? 1 : 7}, minmax(0, 1fr))`,
            }}
          >
            {(view === "month" ? days.slice(0, 7) : days).map((day) => (
              <div
                key={day}
                data-testid="calendar-weekday"
                aria-current={
                  view !== "month" && day === today ? "date" : undefined
                }
                className={cn(
                  "border-line border-b p-3 text-center text-xs font-medium",
                  new Date(`${day}T12:00Z`).getUTCDay() === 0 &&
                    "text-negative",
                  new Date(`${day}T12:00Z`).getUTCDay() === 6 && "text-info",
                  view !== "month" &&
                    day === today &&
                    "bg-brand-soft text-brand",
                )}
              >
                {view !== "month" && `${day.slice(5)} `}
                {new Intl.DateTimeFormat("ko-KR", {
                  weekday: "short",
                  timeZone: "UTC",
                }).format(new Date(`${day}T12:00Z`))}
              </div>
            ))}
            {view === "month"
              ? days.map((day) => (
                  <CalendarCell
                    key={day}
                    day={day}
                    today={today}
                    muted={day.slice(0, 7) !== date.slice(0, 7)}
                    events={eventsForDay(events, day)}
                    onEdit={onEdit}
                    onCreate={onCreate}
                  />
                ))
              : Array.from({ length: 24 }, (_, hour) =>
                  days.map((day) => (
                    <CalendarCell
                      key={`${day}-${hour}`}
                      day={day}
                      today={today}
                      time={`${String(hour).padStart(2, "0")}:00`}
                      muted={false}
                      events={eventsForDay(events, day).filter(
                        (event) =>
                          (event.start.slice(0, 10) < day
                            ? 0
                            : Number(event.start.slice(11, 13))) === hour,
                      )}
                      onEdit={onEdit}
                      onCreate={onCreate}
                    />
                  )),
                )}
          </div>
        </div>
      </div>
      <DragOverlay>
        {active && (
          <div className="bg-brand rounded-lg p-3 text-sm text-white shadow-lg">
            {active.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
