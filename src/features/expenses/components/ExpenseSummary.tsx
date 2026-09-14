import {
  money,
  type summarizeExpenses,
} from "@/features/expenses/model/expenses";

export function ExpenseSummary({
  summary,
}: {
  summary: ReturnType<typeof summarizeExpenses>;
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {(
        [
          ["수입 합계", summary.income],
          ["지출 합계", summary.expense],
          ["수지 차액", summary.balance],
        ] as const
      ).map(([label, amount]) => (
        <div
          key={label}
          className="border-line bg-surface rounded-2xl border p-5"
        >
          <dt className="text-ink-subtle text-sm">{label}</dt>
          <dd className="mt-3 text-2xl font-semibold break-words">
            {money(amount)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
