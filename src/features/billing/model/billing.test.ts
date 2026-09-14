import { describe, expect, it } from "vitest";
import { totals, transition, invoiceInputSchema } from "./billing";

describe("invoice rules", () => {
  it("calculates integer KRW amounts and rounded tax", () => {
    expect(
      totals([{ description: "작업", quantity: 3, price: 101 }], 10),
    ).toEqual({ subtotal: 303, tax: 30, total: 333 });
  });
  it("allows only forward invoice transitions", () => {
    expect(transition("draft", "issued")).toBe("issued");
    expect(transition("issued", "paid")).toBe("paid");
    expect(() => transition("paid", "draft")).toThrow();
  });
  it("rejects empty items and negative prices", () => {
    expect(
      invoiceInputSchema.safeParse({
        customer: "고객",
        dueDate: "2026-09-30",
        taxRate: 10,
        items: [],
      }).success,
    ).toBe(false);
    expect(
      invoiceInputSchema.safeParse({
        customer: "고객",
        dueDate: "2026-09-30",
        taxRate: 10,
        items: [{ description: "작업", quantity: 1, price: -1 }],
      }).success,
    ).toBe(false);
  });
});

it("allows cancellation but prevents terminal-state changes", () => {
  expect(transition("draft", "cancelled")).toBe("cancelled");
  expect(transition("issued", "cancelled")).toBe("cancelled");
  expect(() => transition("cancelled", "issued")).toThrow();
  expect(() => transition("draft", "paid")).toThrow();
  expect(totals([], 0)).toEqual({ subtotal: 0, tax: 0, total: 0 });
});
