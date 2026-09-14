import { z } from "zod";

export const incomeCategories = ["급여", "부수입", "기타 수입"];

export const expenseCategories = [
  "식비",
  "교통",
  "주거",
  "쇼핑",
  "여가",
  "기타 지출",
];

export const entryInputSchema = z
  .object({
    date: z.iso.date("올바른 날짜를 입력하세요."),
    type: z.enum(["income", "expense"]),
    category: z.string(),
    amount: z
      .number()
      .int("원 단위 정수를 입력하세요.")
      .min(1, "1원 이상 입력하세요.")
      .max(1000000000, "10억 원 이하로 입력하세요."),
    memo: z.string().trim().max(200),
  })
  .refine(
    (entry) =>
      (entry.type === "income" ? incomeCategories : expenseCategories).includes(
        entry.category,
      ),
    { path: ["category"], message: "유형에 맞는 카테고리를 선택하세요." },
  );

export const entrySchema = entryInputSchema.extend({ id: z.string().min(1) });

export const entriesSchema = z.array(entrySchema).max(10000);

export type EntryInput = z.infer<typeof entryInputSchema>;

export type Entry = z.infer<typeof entrySchema>;

export type ExpenseFilter = {
  month: string;
  type: string;
  category: string;
  query: string;
};

export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function filterExpenses(entries: Entry[], filter: ExpenseFilter) {
  return entries
    .filter(
      (entry) =>
        (!filter.month || entry.date.startsWith(filter.month)) &&
        (filter.type === "all" || entry.type === filter.type) &&
        (filter.category === "all" || entry.category === filter.category) &&
        `${entry.memo} ${entry.category}`
          .toLowerCase()
          .includes(filter.query.trim().toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function summarizeExpenses(entries: Entry[]) {
  let income = 0;

  let expense = 0;

  const byCategory = new Map<string, number>();

  const byDate = new Map<
    string,
    { date: string; income: number; expense: number }
  >();
  for (const entry of entries) {
    if (entry.type === "income") income += entry.amount;
    else {
      expense += entry.amount;
      byCategory.set(
        entry.category,
        (byCategory.get(entry.category) ?? 0) + entry.amount,
      );
    }
    const day = byDate.get(entry.date) ?? {
      date: entry.date,
      income: 0,
      expense: 0,
    };
    day[entry.type] += entry.amount;
    byDate.set(entry.date, day);
  }
  return {
    income,
    expense,
    balance: income - expense,
    categories: [...byCategory]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    daily: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export const money = (amount: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    amount,
  );

export function initialEntries(): Entry[] {
  const month = localDate().slice(0, 7);
  return [
    {
      id: "entry-salary",
      date: `${month}-01`,
      type: "income",
      category: "급여",
      amount: 3200000,
      memo: "월급 (샘플)",
    },
    {
      id: "entry-food",
      date: `${month}-02`,
      type: "expense",
      category: "식비",
      amount: 32000,
      memo: "장보기 (샘플)",
    },
    {
      id: "entry-home",
      date: `${month}-03`,
      type: "expense",
      category: "주거",
      amount: 700000,
      memo: "월세 (샘플)",
    },
    {
      id: "entry-transit",
      date: `${month}-04`,
      type: "expense",
      category: "교통",
      amount: 65000,
      memo: "교통비 (샘플)",
    },
  ];
}
