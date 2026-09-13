import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { describe, expect, it } from "vitest";
import { getKanbanBoard, moveKanbanCard } from "./kanban-api";

describe("kanban API", () => {
  it("보드 응답 컬럼과 카드를 반환한다", async () => {
    const board = await getKanbanBoard();
    expect(board.columns.map((column) => column.id)).toEqual([
      "backlog",
      "in_progress",
      "review",
      "done",
    ]);
    expect(board.cards.length).toBeGreaterThan(0);
  });

  it("같은 컬럼 내 이동은 순서를 재정렬한다", async () => {
    const before = await getKanbanBoard();

    const target = before.cards.find((card) => card.columnId === "backlog")!;

    const moved = await moveKanbanCard({
      cardId: target.id,
      toColumnId: "backlog",
      toIndex: 0,
    });
    expect(moved.columnId).toBe("backlog");
    expect(moved.order).toBe(0);
    const after = await getKanbanBoard();

    const reordered = after.cards
      .filter((card) => card.columnId === "backlog")
      .sort((a, b) => a.order - b.order)
      .map((card) => card.id);
    expect(reordered[0]).toBe(target.id);
  });

  it("다른 컬럼으로 이동하면 order가 0부터 다시 매겨진다", async () => {
    const before = await getKanbanBoard();

    const target = before.cards.find((card) => card.columnId === "backlog")!;
    await moveKanbanCard({
      cardId: target.id,
      toColumnId: "review",
      toIndex: 0,
    });
    const after = await getKanbanBoard();

    const moved = after.cards.find((card) => card.id === target.id)!;
    expect(moved.columnId).toBe("review");
    expect(moved.order).toBe(0);
    const backlog = after.cards
      .filter((card) => card.columnId === "backlog")
      .sort((a, b) => a.order - b.order)
      .map((card) => card.id);
    expect(backlog).not.toContain(target.id);
  });

  it("'테스트 실패' 카드를 이동하면 서버가 409로 거절한다", async () => {
    const before = await getKanbanBoard();

    const target = before.cards.find((card) =>
      card.title.includes("테스트 실패"),
    )!;
    await expect(
      moveKanbanCard({ cardId: target.id, toColumnId: "done", toIndex: 0 }),
    ).rejects.toMatchObject({
      status: 409,
      code: "INVALID_MOVE",
    });
  });

  it("없는 카드 ID는 404를 반환한다", async () => {
    await expect(
      moveKanbanCard({
        cardId: "card-missing",
        toColumnId: "done",
        toIndex: 0,
      }),
    ).rejects.toMatchObject({ status: 404, code: "CARD_NOT_FOUND" });
  });
});

it("스키마 위반 응답은 INVALID_RESPONSE로 거부한다", async () => {
  server.use(
    http.get("/api/kanban", () =>
      HttpResponse.json({ columns: "invalid", cards: [] }),
    ),
  );
  await expect(getKanbanBoard()).rejects.toMatchObject({
    code: "INVALID_RESPONSE",
  });
});
