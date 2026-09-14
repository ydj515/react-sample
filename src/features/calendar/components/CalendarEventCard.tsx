import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import {
  timeRange,
  type CalendarEvent,
} from "@/features/calendar/model/calendar";
import { cn } from "@/shared/lib/cn";

export function CalendarEventCard({
  event,
  day,
  onEdit,
}: {
  event: CalendarEvent;
  day: string;
  onEdit: (event: CalendarEvent) => void;
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `${day}:${event.id}`,
    data: { event },
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-brand-soft text-brand flex min-w-0 items-start gap-1 rounded-lg border border-transparent p-2 text-xs",
        isDragging && "opacity-40",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${event.title} 이동`}
        className="focus-visible:outline-brand shrink-0 touch-none rounded p-1"
      >
        <GripVertical className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onEdit(event)}
        aria-label={`${event.title} 수정 · ${timeRange(event)}`}
        className="focus-visible:outline-brand min-w-0 flex-1 rounded text-left"
      >
        <span className="block font-semibold break-words">{event.title}</span>
        <span className="mt-1 block">
          {event.start.slice(11)}–{event.end.slice(11)}
          {event.start.slice(0, 10) !== event.end.slice(0, 10) && " · 여러 날"}
        </span>
      </button>
    </div>
  );
}
