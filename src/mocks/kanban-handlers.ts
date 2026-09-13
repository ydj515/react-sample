import { http, HttpResponse } from "msw";

import {
  getKanbanBoard,
  moveCard,
  type MoveCardFailure,
} from "@/mocks/data/kanban";
import { createMockApiError } from "./api-error";

export const kanbanHandlers = [
  http.get("/api/kanban", () => HttpResponse.json(getKanbanBoard())),
  http.patch("/api/kanban/cards/:cardId/move", async ({ params, request }) => {
    const body = (await request.json().catch(() => null)) as {
      toColumnId?: string;
      toIndex?: number;
    } | null;
    if (
      !body ||
      typeof body.toColumnId !== "string" ||
      typeof body.toIndex !== "number"
    ) {
      return createMockApiError({
        status: 400,
        code: "INVALID_MOVE_BODY",
        message: "이동 요청 본문이 올바르지 않습니다.",
        path: new URL(request.url).pathname,
      });
    }
    const cardId = String(params.cardId);

    const result = moveCard({
      cardId,
      toColumnId: body.toColumnId as Parameters<
        typeof moveCard
      >[0]["toColumnId"],
      toIndex: body.toIndex,
    });
    if ("status" in result) {
      const failure = result as MoveCardFailure;
      return createMockApiError({
        status: failure.status,
        code: failure.code,
        message: failure.message,
        path: new URL(request.url).pathname,
      });
    }
    return HttpResponse.json(result.card);
  }),
];
