import { describe, expect, it } from "vitest";
import { applyMoveLocally } from "./kanban-queries";
import type {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
} from "@/features/kanban/model/kanban-schema";

function column(
  id: KanbanColumn["id"],
  cards: KanbanCard[],
): { columns: KanbanColumn[]; cards: KanbanCard[] } {
  return {
    columns: [
      { id: "backlog", title: "백로그", accent: "a", description: "d" },
      { id: "in_progress", title: "진행", accent: "a", description: "d" },
      { id: "review", title: "리뷰", accent: "a", description: "d" },
      { id: "done", title: "완료", accent: "a", description: "d" },
    ],
    cards,
  };
}

function card(
  id: string,
  columnId: KanbanCard["columnId"],
  order: number,
): KanbanCard {
  return {
    id,
    columnId,
    order,
    title: id.toUpperCase(),
    description: id,
    priority: "low",
    assignee: { id: "u", name: "u", initials: "u" },
    tags: [],
    dueDate: null,
  };
}

function idsByColumn(board: KanbanBoard, columnId: KanbanCard["columnId"]) {
  return board.cards
    .filter((c) => c.columnId === columnId)
    .sort((a, b) => a.order - b.order)
    .map((c) => c.id);
}

describe("applyMoveLocally - 인덱스 일관성", () => {
  it("같은 컬럼에서 특정 카드의 위에 삽입한다", () => {
    const initial: KanbanBoard = {
      ...column("backlog", [
        card("a", "backlog", 0),
        card("b", "backlog", 1),
        card("c", "backlog", 2),
        card("d", "backlog", 3),
      ]),
    };

    // a 를 c 위에 (c의 위치 = index 1, b 제외 후)
    const updated = applyMoveLocally(initial, {
      cardId: "a",
      toColumnId: "backlog",
      toIndex: 1,
    });
    expect(idsByColumn(updated, "backlog")).toEqual(["b", "a", "c", "d"]);
  });

  it("같은 컬럼에서 끝으로 이동하면 가장 뒤에 붙는다", () => {
    const initial: KanbanBoard = {
      ...column("backlog", [
        card("a", "backlog", 0),
        card("b", "backlog", 1),
        card("c", "backlog", 2),
      ]),
    };

    const updated = applyMoveLocally(initial, {
      cardId: "a",
      toColumnId: "backlog",
      toIndex: 2,
    });
    expect(idsByColumn(updated, "backlog")).toEqual(["b", "c", "a"]);
  });

  it("다른 컬럼의 카드 사이에 정확히 삽입한다", () => {
    const initial: KanbanBoard = {
      ...column("review", [card("x", "review", 0), card("y", "review", 1)]),
    };

    // 인덱스 1 = x 다음, y 이전 위치로 삽입
    const updated = applyMoveLocally(initial, {
      cardId: "x",
      toColumnId: "review",
      toIndex: 1,
    });
    expect(idsByColumn(updated, "review")).toEqual(["y", "x"]);
  });

  it("다른 컬럼으로 이동하면 두 컬럼 모두 order가 0부터 매겨진다", () => {
    const initial: KanbanBoard = {
      ...column("in_progress", [
        card("p", "in_progress", 0),
        card("q", "in_progress", 1),
        card("r", "in_progress", 2),
      ]),
    };

    const updated = applyMoveLocally(initial, {
      cardId: "p",
      toColumnId: "done",
      toIndex: 0,
    });
    expect(idsByColumn(updated, "in_progress")).toEqual(["q", "r"]);
    expect(idsByColumn(updated, "done")).toEqual(["p"]);
  });

  it("범위를 벗어나는 인덱스는 끝으로 보정된다", () => {
    const initial: KanbanBoard = {
      ...column("backlog", [card("a", "backlog", 0), card("b", "backlog", 1)]),
    };

    const updated = applyMoveLocally(initial, {
      cardId: "a",
      toColumnId: "backlog",
      toIndex: 99,
    });
    expect(idsByColumn(updated, "backlog")).toEqual(["b", "a"]);
  });
});

it("롤백을 위해 원본 카드의 순서를 변경하지 않는다", () => {
  const initial = column("backlog", [
    card("a", "backlog", 0),
    card("b", "backlog", 1),
  ]);

  const snapshot = structuredClone(initial);
  applyMoveLocally(initial, { cardId: "a", toColumnId: "backlog", toIndex: 1 });
  expect(initial).toEqual(snapshot);
});
