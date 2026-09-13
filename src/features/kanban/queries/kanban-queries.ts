import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getKanbanBoard,
  moveKanbanCard,
} from "@/features/kanban/api/kanban-api";
import type {
  KanbanBoard,
  KanbanCard,
  KanbanMoveInput,
} from "@/features/kanban/model/kanban-schema";

export const kanbanKeys = {
  all: ["kanban"] as const,
  board: () => [...kanbanKeys.all, "board"] as const,
};

export function kanbanBoardOptions() {
  return queryOptions({
    queryKey: kanbanKeys.board(),
    queryFn: getKanbanBoard,
  });
}

export function useKanbanBoardQuery() {
  return useQuery(kanbanBoardOptions());
}

export function selectCardsByColumn(
  board: KanbanBoard | undefined,
  columnId: KanbanCard["columnId"],
): KanbanCard[] {
  if (!board) return [];
  return board.cards
    .filter((card) => card.columnId === columnId)
    .sort((a, b) => a.order - b.order);
}

interface OptimisticContext {
  previousBoard: KanbanBoard | undefined;
}

export function useMoveKanbanCardMutation() {
  const client = useQueryClient();
  return useMutation<KanbanCard, Error, KanbanMoveInput, OptimisticContext>({
    mutationFn: (input) => moveKanbanCard(input),
    onMutate: async (input) => {
      await client.cancelQueries({ queryKey: kanbanKeys.board() });
      const previousBoard = client.getQueryData<KanbanBoard>(
        kanbanKeys.board(),
      );
      if (previousBoard) {
        client.setQueryData<KanbanBoard>(kanbanKeys.board(), (current) => {
          if (!current) return current;
          return applyMoveLocally(current, input);
        });
      }
      return { previousBoard };
    },
    onError: (_error, _input, context) => {
      if (context?.previousBoard) {
        client.setQueryData(kanbanKeys.board(), context.previousBoard);
      }
    },
    onSettled: () => {
      void client.invalidateQueries({ queryKey: kanbanKeys.board() });
    },
  });
}

export function applyMoveLocally(
  board: KanbanBoard,
  input: KanbanMoveInput,
): KanbanBoard {
  const moving = board.cards.find((card) => card.id === input.cardId);
  if (!moving) return board;
  const cards: KanbanCard[] = board.cards.map((card) =>
    card.id === moving.id
      ? { ...card, columnId: input.toColumnId, order: input.toIndex }
      : { ...card },
  );

  // 같은 컬럼 재배열
  const targetSiblings = cards
    .filter(
      (card) => card.columnId === input.toColumnId && card.id !== moving.id,
    )
    .sort((a, b) => a.order - b.order);

  const insertIndex = Math.max(
    0,
    Math.min(input.toIndex, targetSiblings.length),
  );
  targetSiblings.splice(insertIndex, 0, {
    ...moving,
    columnId: input.toColumnId,
  });
  targetSiblings.forEach((card, index) => {
    card.order = index;
  });
  const rebuilt: KanbanCard[] = [];
  for (const column of board.columns) {
    const inColumn =
      column.id === input.toColumnId
        ? targetSiblings
        : cards
            .filter((card) => card.columnId === column.id)
            .sort((a, b) => a.order - b.order);
    inColumn.forEach((card, index) => {
      card.order = index;
    });
    rebuilt.push(...inColumn);
  }
  return { ...board, cards: rebuilt };
}
