import { forwardRef, useLayoutEffect, useRef, type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CalendarDays, GripVertical } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";
import type { KanbanCard } from "@/features/kanban/model/kanban-schema";
import {
  kanbanPriorityLabels,
  kanbanPriorityAccents,
} from "@/features/kanban/model/kanban-schema";
import { KanbanDropIndicator } from "./KanbanDropIndicator";

export interface KanbanCardViewProps {
  handle?: ReactNode;
  card: KanbanCard;
  dragging?: boolean;
  overlay?: boolean;
  onClick?: (card: KanbanCard) => void;
}

function formatDueDate(iso: string | null) {
  if (!iso) return null;
  const today = new Date("2026-09-13");

  const target = new Date(iso);

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays === 0) return "오늘 마감";
  if (diffDays > 0) return `${diffDays}일 남음`;
  return `${Math.abs(diffDays)}일 지연`;
}

export const KanbanCardView = forwardRef<HTMLDivElement, KanbanCardViewProps>(
  function KanbanCardView(
    { card, dragging = false, overlay = false, onClick, handle },
    ref,
  ) {
    const due = formatDueDate(card.dueDate);

    const overdue = due?.includes("지연");
    return (
      <div
        ref={ref}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        data-testid={overlay ? undefined : `kanban-card-${card.id}`}
        aria-hidden={overlay || undefined}
        onClick={() => onClick?.(card)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.(card);
          }
        }}
        className={cn(
          "group bg-surface text-ink rounded-control border-line focus-visible:outline-brand relative grid gap-2 border p-3 text-left shadow-sm transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
          dragging && "opacity-60",
          overlay && "cursor-grabbing shadow-lg",
        )}
      >
        <div className="flex items-start gap-2">
          {handle ?? (
            <span
              aria-hidden
              className="text-ink-subtle mt-0.5 grid h-5 w-5 place-items-center"
            >
              <GripVertical className="size-3.5" />
            </span>
          )}
          <p className="text-sm leading-snug font-semibold">{card.title}</p>
        </div>
        <p className="text-ink-subtle text-xs leading-relaxed">
          {card.description}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              kanbanPriorityAccents[card.priority],
            )}
          >
            {kanbanPriorityLabels[card.priority]}
          </span>
          {card.tags.map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-ink-subtle flex items-center justify-between text-xs">
          <span
            aria-label={`담당자 ${card.assignee.name}`}
            className="bg-brand-soft text-brand grid size-6 place-items-center rounded-full text-[11px] font-semibold"
          >
            {card.assignee.initials}
          </span>
          {due ? (
            <span
              className={cn(
                "flex items-center gap-1",
                overdue ? "text-negative" : "text-ink-subtle",
              )}
            >
              <CalendarDays className="size-3.5" aria-hidden /> {due}
            </span>
          ) : (
            <span className="text-ink-subtle">마감일 없음</span>
          )}
        </div>
      </div>
    );
  },
);

export function SortableKanbanCard({
  card,
  placeholder,
  height = 140,
  disabled = false,
}: {
  card: KanbanCard;
  placeholder: boolean;
  height?: number;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef } =
    useSortable({
      id: card.id,
      data: { type: "card", card },
      disabled,
    });

  const node = useRef<HTMLDivElement | null>(null);

  const content = useRef<HTMLDivElement | null>(null);

  const previousRect = useRef<DOMRect | null>(null);
  useLayoutEffect(() => {
    const rect = node.current?.getBoundingClientRect();

    const previous = previousRect.current;
    previousRect.current = rect ?? null;
    if (
      !rect ||
      !previous ||
      placeholder ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const x = previous.left - rect.left;

    const y = previous.top - rect.top;
    if (x || y) {
      content.current
        ?.getAnimations()
        .forEach((animation) => animation.cancel());
      content.current?.animate(
        [
          { transform: `translate(${x}px, ${y}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: 160, easing: "ease-out" },
      );
    }
  });
  return (
    <div
      ref={(element) => {
        node.current = element;
        setNodeRef(element);
      }}
      onPointerDown={(event) => listeners?.onPointerDown?.(event)}
      className={cn(
        "relative",
        !disabled && "cursor-grab",
        placeholder && "cursor-grabbing",
      )}
      data-dragging={placeholder}
    >
      {placeholder ? <KanbanDropIndicator height={height} /> : null}
      <div
        ref={content}
        className={
          placeholder
            ? "pointer-events-none absolute inset-0 opacity-0"
            : undefined
        }
      >
        <KanbanCardView
          card={card}
          handle={
            <button
              type="button"
              ref={setActivatorNodeRef}
              {...attributes}
              onKeyDown={(event) => listeners?.onKeyDown?.(event)}
              aria-disabled={disabled}
              aria-label={`${card.title} 이동`}
              data-card-handle={card.id}
              className="text-ink-subtle focus-visible:outline-brand -m-1 mt-0 grid size-7 shrink-0 cursor-grab touch-none place-items-center rounded focus-visible:outline-2 disabled:cursor-wait"
            >
              <GripVertical className="size-3.5" aria-hidden="true" />
            </button>
          }
        />
      </div>
    </div>
  );
}
