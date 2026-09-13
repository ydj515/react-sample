import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { cn } from "@/shared/lib/cn";
import type {
  KanbanCard,
  KanbanColumn as KanbanColumnType,
} from "@/features/kanban/model/kanban-schema";
import { SortableKanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCard[];
  activeId: string | null;
  activeHeight?: number;
  isTarget: boolean;
  disabled: boolean;
  emptyHint: string;
}

// 미리보기 목록 자체가 자리를 확보하므로 sortable의 추가 밀어내기는 사용하지 않는다.
const previewStrategy = () => null;

export function KanbanColumn({
  column,
  cards,
  activeId,
  activeHeight,
  isTarget,
  disabled,
  emptyHint,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
    disabled,
  });
  return (
    <section
      ref={setNodeRef}
      data-testid={`kanban-column-${column.id}`}
      data-over={isTarget}
      aria-labelledby={`kanban-column-${column.id}-title`}
      className={cn(
        "bg-surface-muted/60 rounded-panel grid w-full min-w-0 content-start gap-3 border p-3 transition-colors motion-reduce:transition-none",
        column.accent,
        isTarget && "bg-brand-soft/30 border-brand/40",
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h3
          id={`kanban-column-${column.id}-title`}
          className="text-sm font-semibold"
        >
          {column.title}
        </h3>
        <span
          className="text-ink-subtle bg-surface rounded-full px-2 py-0.5 text-xs"
          aria-label={`카드 ${cards.length}건`}
        >
          {cards.length}
        </span>
      </header>
      <p className="text-ink-subtle text-xs">{column.description}</p>
      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={previewStrategy}
      >
        <ul
          data-testid={`kanban-column-${column.id}-cards`}
          className="grid min-h-24 content-start gap-2"
        >
          {cards.length === 0 ? (
            <li
              className="text-ink-subtle rounded-control p-4 text-center text-xs"
              data-testid={`kanban-column-${column.id}-empty`}
            >
              {emptyHint}
            </li>
          ) : (
            cards.map((card) => (
              <li key={card.id}>
                <SortableKanbanCard
                  card={card}
                  placeholder={card.id === activeId}
                  height={activeHeight}
                  disabled={disabled}
                />
              </li>
            ))
          )}
        </ul>
      </SortableContext>
    </section>
  );
}
