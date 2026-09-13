import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderManagement } from "@/test/render-management";
import {
  getKanbanBoard,
  moveKanbanCard,
} from "@/features/kanban/api/kanban-api";

describe("kanban page", () => {
  it("4개 컬럼과 카드를 모두 렌더한다", async () => {
    renderManagement("/kanban");
    const board = await getKanbanBoard();
    expect(
      await screen.findByRole("heading", { level: 1, name: "칸반 보드" }),
    ).toBeInTheDocument();
    for (const column of board.columns) {
      expect(
        await screen.findByTestId(`kanban-column-${column.id}`),
      ).toBeInTheDocument();
    }
    expect(
      screen.getAllByTestId(/^kanban-card-/).length,
    ).toBeGreaterThanOrEqual(board.cards.length);
  });

  it("컬럼 필터는 다른 컬럼 카드를 숨긴다", async () => {
    const user = userEvent.setup();
    renderManagement("/kanban");
    await screen.findByTestId("kanban-column-backlog");
    const initialCards = screen.getAllByTestId(/^kanban-card-/).length;
    await user.selectOptions(
      screen.getByRole("combobox", { name: "칸반 컬럼 필터" }),
      "done",
    );
    await waitFor(() => {
      const remaining = screen.getAllByTestId(/^kanban-card-/).length;
      expect(remaining).toBeLessThan(initialCards);
    });
  });

  it("초기화 버튼이 모든 필터를 해제한다", async () => {
    const user = userEvent.setup();
    renderManagement("/kanban?column=done");
    await screen.findByTestId("kanban-column-backlog");
    const initialCards = screen.getAllByTestId(/^kanban-card-/).length;
    await user.click(screen.getByRole("button", { name: "초기화" }));
    await waitFor(() => {
      const after = screen.getAllByTestId(/^kanban-card-/).length;
      expect(after).toBeGreaterThan(initialCards);
    });
  });

  it("우선순위 필터가 결과 카드를 좁힌다", async () => {
    const user = userEvent.setup();
    renderManagement("/kanban");
    await screen.findByTestId("kanban-column-backlog");
    const initialCards = screen.getAllByTestId(/^kanban-card-/).length;
    await user.selectOptions(
      screen.getByRole("combobox", { name: "칸반 우선순위 필터" }),
      "urgent",
    );
    await waitFor(() => {
      const after = screen.getAllByTestId(/^kanban-card-/).length;
      expect(after).toBeLessThan(initialCards);
    });
  });
});

describe("kanban move mutation rollback", () => {
  it("서버가 거절하면 카드가 이전 위치로 유지된다", async () => {
    const before = await getKanbanBoard();

    const target = before.cards.find((card) =>
      card.title.includes("테스트 실패"),
    )!;
    await expect(
      moveKanbanCard({
        cardId: target.id,
        toColumnId: "done",
        toIndex: 0,
      }),
    ).rejects.toMatchObject({ status: 409 });
    const after = await getKanbanBoard();

    const moved = after.cards.find((card) => card.id === target.id);
    expect(moved?.columnId).toBe(target.columnId);
    expect(moved?.order).toBe(target.order);
  });
});
