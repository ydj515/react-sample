import { expect, it } from "vitest";
import { entrySchema, summarizeExpenses, filterExpenses } from "./expenses";

const entries = [
  {
    id: "1",
    date: "2026-09-01",
    type: "income" as const,
    category: "급여",
    amount: 10000,
    memo: "월급",
  },
  {
    id: "2",
    date: "2026-09-02",
    type: "expense" as const,
    category: "식비",
    amount: 3000,
    memo: "점심",
  },
  {
    id: "3",
    date: "2026-08-31",
    type: "expense" as const,
    category: "교통",
    amount: 1000,
    memo: "버스",
  },
];

it("uses the same filtered entries for totals and category chart", () => {
  const filtered = filterExpenses(entries, {
    month: "2026-09",
    type: "all",
    category: "all",
    query: "",
  });
  expect(summarizeExpenses(filtered)).toMatchObject({
    income: 10000,
    expense: 3000,
    balance: 7000,
    categories: [{ category: "식비", amount: 3000 }],
  });
  expect(
    filterExpenses(entries, {
      month: "",
      type: "expense",
      category: "교통",
      query: "버스",
    }),
  ).toHaveLength(1);
});
it("rejects invalid dates, fractional KRW and mismatched categories", () => {
  expect(
    entrySchema.safeParse({ ...entries[0], date: "2026-02-30" }).success,
  ).toBe(false);
  expect(entrySchema.safeParse({ ...entries[0], amount: 0.5 }).success).toBe(
    false,
  );
  expect(
    entrySchema.safeParse({ ...entries[0], category: "식비" }).success,
  ).toBe(false);
});
