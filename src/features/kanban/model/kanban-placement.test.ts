import { describe, expect, it } from "vitest";

import { resolveMoveIndex } from "./kanban-placement";

describe("filtered kanban placement", () => {
  it("maps a visible slot to the full list without moving hidden cards", () => {
    expect(
      resolveMoveIndex(["hidden", "a", "hidden-2", "b"], ["a", "b"], 1),
    ).toBe(3);
  });
  it("places a card after the last visible card, before hidden trailing cards", () => {
    expect(resolveMoveIndex(["a", "hidden"], ["a"], 1)).toBe(1);
  });
  it("appends when the filtered column has no visible cards", () => {
    expect(resolveMoveIndex(["hidden"], [], 0)).toBe(1);
  });
  it("allows moving down exactly one position", () => {
    expect(resolveMoveIndex(["b", "c"], ["b", "c"], 1)).toBe(1);
  });
});
