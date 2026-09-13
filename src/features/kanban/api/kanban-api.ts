import { apiRequest } from "@/shared/api/http-client";
import {
  kanbanBoardSchema,
  kanbanCardSchema,
  type KanbanMoveInput,
} from "@/features/kanban/model/kanban-schema";

const headers = { "Content-Type": "application/json" };

export function getKanbanBoard() {
  return apiRequest("/api/kanban", { schema: kanbanBoardSchema });
}

export function moveKanbanCard(input: KanbanMoveInput) {
  return apiRequest(
    `/api/kanban/cards/${encodeURIComponent(input.cardId)}/move`,
    {
      schema: kanbanCardSchema,
      method: "PATCH",
      headers,
      body: JSON.stringify({
        toColumnId: input.toColumnId,
        toIndex: input.toIndex,
      }),
    },
  );
}
