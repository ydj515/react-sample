import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  MeasuringStrategy,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragStartEvent,
  type DragMoveEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import type {
  KanbanBoard,
  KanbanCard,
  KanbanColumnId,
  KanbanSearch,
  KanbanMoveInput,
} from "@/features/kanban/model/kanban-schema";
import { resolveMoveIndex } from "@/features/kanban/model/kanban-placement";
import { selectCardsByColumn } from "@/features/kanban/queries/kanban-queries";
import { KanbanCardView } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  board: KanbanBoard;
  search: KanbanSearch;
  isPending?: boolean;
  pendingCardId?: string | null;
  onMove: (input: KanbanMoveInput) => void;
}
interface DragState {
  activeId: string;
  columnId: KanbanColumnId;
  index: number;
  height: number;
}

function matchesSearch(card: KanbanCard, search: KanbanSearch): boolean {
  if (search.priority !== "all" && card.priority !== search.priority) {
    return false;
  }
  if (search.assignee !== "all" && card.assignee.id !== search.assignee) {
    return false;
  }
  if (search.column !== "all" && card.columnId !== search.column) {
    return false;
  }
  if (search.q.trim().length > 0) {
    const needle = search.q.trim().toLowerCase();

    const haystack = [
      card.title,
      card.description,
      card.assignee.name,
      ...card.tags,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function KanbanBoardView({
  board,
  search,
  isPending = false,
  pendingCardId = null,
  onMove,
}: KanbanBoardProps) {
  const [drag, setDrag] = useState<DragState | null>(null);

  const dragRef = useRef<DragState | null>(null);

  const pointer = useRef<{ x: number; y: number } | null>(null);

  const root = useRef<HTMLDivElement>(null);

  const restoreFocus = useRef<string | null>(null);
  useEffect(() => {
    if (!isPending && restoreFocus.current) {
      root.current
        ?.querySelector<HTMLButtonElement>(
          `[data-card-handle="${restoreFocus.current}"]`,
        )
        ?.focus({ preventScroll: true });
      restoreFocus.current = null;
    }
  }, [board, isPending]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredCards = useMemo(
    () => board.cards.filter((card) => matchesSearch(card, search)),
    [board.cards, search],
  );

  const activeCard = board.cards.find((card) => card.id === drag?.activeId);

  const columns = board.columns.map((column) => {
    const cards = selectCardsByColumn(
      { ...board, cards: filteredCards },
      column.id,
    ).filter((card) => card.id !== drag?.activeId);
    if (drag && activeCard && drag.columnId === column.id) {
      cards.splice(drag.index, 0, activeCard);
    }
    return { column, cards };
  });

  function updateDrag(next: DragState | null) {
    dragRef.current = next;
    setDrag(next);
  }

  const collisionDetection: CollisionDetection = (args) => {
    pointer.current = args.pointerCoordinates;
    if (!args.pointerCoordinates) return closestCorners(args);
    const hits = pointerWithin(args);

    // 카드 안에서는 컬럼 전체보다 카드를 우선하고, 빈자리에서는 현재 위치를 유지한다.
    const cards = hits.filter(
      (hit) =>
        args.droppableContainers.find((container) => container.id === hit.id)
          ?.data.current?.type === "card",
    );
    return cards.length ? cards : hits;
  };

  function handleDragStart(event: DragStartEvent) {
    const card = board.cards.find((item) => item.id === event.active.id);
    if (!card) return;
    updateDrag({
      activeId: card.id,
      columnId: card.columnId,
      index: selectCardsByColumn(
        { ...board, cards: filteredCards },
        card.columnId,
      ).findIndex((item) => item.id === card.id),
      height: event.active.rect.current.initial?.height ?? 140,
    });
  }

  function handleDragMove(event: DragMoveEvent) {
    const current = dragRef.current;

    const over = event.over;
    if (!current || !over || over.id === current.activeId) return;
    const destination = columns.find(
      ({ column, cards }) =>
        column.id === over.id || cards.some((card) => card.id === over.id),
    );
    if (!destination) return;
    const remaining = destination.cards.filter(
      (card) => card.id !== current.activeId,
    );

    let index = remaining.length;
    if (over.data.current?.type === "card") {
      const overIndex = remaining.findIndex((card) => card.id === over.id);

      const after = pointer.current
        ? pointer.current.y > over.rect.top + over.rect.height / 2
        : current.columnId === destination.column.id &&
          destination.cards.findIndex((card) => card.id === over.id) >
            current.index;
      index = overIndex + (after ? 1 : 0);
    } else if (pointer.current) {
      // 컬럼의 카드 사이 간격이나 헤더도 가까운 삽입 위치로 해석한다.
      index = remaining.findIndex((card) => {
        const node = root.current?.querySelector(
          `[data-testid="kanban-card-${card.id}"]`,
        );

        const rect = node?.getBoundingClientRect();
        return rect && pointer.current!.y < rect.top + rect.height / 2;
      });
      if (index < 0) index = remaining.length;
    }
    if (current.columnId !== destination.column.id || current.index !== index) {
      updateDrag({ ...current, columnId: destination.column.id, index });
    }
  }

  function finishDrag(event?: DragEndEvent) {
    const current = dragRef.current;
    updateDrag(null);
    if (!current) return;
    requestAnimationFrame(() => {
      root.current
        ?.querySelector<HTMLButtonElement>(
          `[data-card-handle="${current.activeId}"]`,
        )
        ?.focus({ preventScroll: true });
    });
    if (!event?.over) return;
    const source = board.cards.find((card) => card.id === current.activeId);
    if (!source) return;
    const originalVisibleIndex = selectCardsByColumn(
      { ...board, cards: filteredCards },
      source.columnId,
    ).findIndex((card) => card.id === source.id);
    // 제자리 드롭은 필터 뒤에 숨은 카드와의 상대 순서까지 보존한다.
    if (
      source.columnId === current.columnId &&
      originalVisibleIndex === current.index
    ) {
      return;
    }
    const remaining = selectCardsByColumn(board, current.columnId).filter(
      (card) => card.id !== current.activeId,
    );

    const visible = remaining.filter((card) => matchesSearch(card, search));

    const toIndex = resolveMoveIndex(
      remaining.map((card) => card.id),
      visible.map((card) => card.id),
      current.index,
    );

    const oldIndex = selectCardsByColumn(board, source.columnId).findIndex(
      (card) => card.id === source.id,
    );
    if (source.columnId === current.columnId && oldIndex === toIndex) return;
    restoreFocus.current = source.id;
    onMove({ cardId: source.id, toColumnId: current.columnId, toIndex });
  }

  const positionMessage = drag
    ? `${board.columns.find((column) => column.id === drag.columnId)?.title}, ${drag.index + 1}번째 위치`
    : "";
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragOver={handleDragMove}
      onDragMove={(event) => {
        if (pointer.current) handleDragMove(event);
      }}
      onDragEnd={finishDrag}
      onDragCancel={() => finishDrag()}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "이동 버튼에서 Space 또는 Enter로 카드를 잡고 방향키로 이동하세요. 다시 누르면 놓고 Escape로 취소합니다.",
        },
        announcements: {
          onDragStart: () => "카드를 잡았습니다. 방향키로 이동하세요.",
          onDragOver: () => undefined,
          onDragEnd: ({ over }) =>
            over ? "카드를 놓았습니다." : "이동을 취소했습니다.",
          onDragCancel: () => "이동을 취소했습니다.",
        },
      }}
    >
      <div
        ref={root}
        className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-4"
        aria-busy={isPending}
      >
        {columns.map(({ column, cards }) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={cards}
            activeId={drag?.activeId ?? null}
            activeHeight={drag?.height}
            isTarget={drag?.columnId === column.id}
            disabled={isPending}
            emptyHint="카드가 없습니다."
          />
        ))}
      </div>
      <p role="status" className="sr-only">
        {positionMessage}
      </p>
      <DragOverlay dropAnimation={null}>
        {activeCard ? <KanbanCardView card={activeCard} overlay /> : null}
      </DragOverlay>
      {isPending ? (
        <p
          role="status"
          className="text-ink-subtle mt-4 flex items-center gap-2 text-xs"
        >
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          {pendingCardId
            ? "카드 위치를 서버에 저장하는 중입니다."
            : "보드를 동기화하는 중입니다."}
        </p>
      ) : null}
      <p className="text-ink-subtle mt-4 text-xs">
        보드에는 총 {board.cards.length.toLocaleString("ko-KR")}건의 카드가
        있습니다. 현재 화면에 표시되는 카드는{" "}
        <span
          className={cn(
            "font-medium",
            filteredCards.length === 0 ? "text-negative" : "text-ink",
          )}
        >
          {filteredCards.length.toLocaleString("ko-KR")}건
        </span>
        입니다.
      </p>
    </DndContext>
  );
}
