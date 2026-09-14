import {
  money,
  summarizeExpenses,
  type Entry,
} from "@/features/expenses/model/expenses";

export function ExpenseCharts({ entries }: { entries: Entry[] }) {
  const summary = summarizeExpenses(entries);

  const max = Math.max(
    1,
    ...summary.daily.flatMap((day) => [day.income, day.expense]),
  );
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section
        className="border-line bg-surface grid content-start gap-5 rounded-2xl border p-5"
        aria-label="카테고리별 지출"
      >
        <h2 className="text-lg font-semibold">카테고리별 지출</h2>
        {summary.categories.length === 0 && (
          <p className="text-ink-subtle">선택한 조건에 지출이 없습니다.</p>
        )}
        {summary.categories.map((item) => (
          <div key={item.category} className="grid gap-2">
            <div className="flex justify-between gap-2 text-sm">
              <span>{item.category}</span>
              <span>
                {money(item.amount)} ·{" "}
                {Math.round((item.amount / summary.expense) * 100)}%
              </span>
            </div>
            <progress
              className="bg-surface-muted [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:bg-brand h-3 w-full appearance-none overflow-hidden rounded-full"
              aria-label={`${item.category} 지출`}
              max={summary.expense}
              value={item.amount}
            />
          </div>
        ))}
      </section>
      <section
        className="border-line bg-surface grid content-start gap-5 rounded-2xl border p-5"
        aria-label="일별 수입과 지출"
      >
        <h2 className="text-lg font-semibold">일별 수입 / 지출</h2>
        <p className="text-ink-subtle text-sm">
          선택한 조건의 거래일별 합계 · 원
        </p>
        {summary.daily.length === 0 && (
          <p className="text-ink-subtle">표시할 거래가 없습니다.</p>
        )}
        <div className="grid max-h-80 gap-5 overflow-y-auto">
          {summary.daily.map((day) => (
            <div key={day.date} className="grid gap-2">
              <p className="text-sm font-medium">{day.date}</p>
              {(["income", "expense"] as const).map((type) => (
                <div key={type} className="grid gap-1">
                  <div className="flex justify-between text-xs">
                    <span>{type === "income" ? "수입" : "지출"}</span>
                    <span>{money(day[type])}</span>
                  </div>
                  <progress
                    className={
                      type === "income"
                        ? "bg-surface-muted [&::-moz-progress-bar]:bg-positive [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:bg-positive h-2 w-full appearance-none overflow-hidden rounded-full"
                        : "bg-surface-muted [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:bg-brand h-2 w-full appearance-none overflow-hidden rounded-full"
                    }
                    aria-label={`${day.date} ${type === "income" ? "수입" : "지출"}`}
                    max={max}
                    value={day[type]}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
