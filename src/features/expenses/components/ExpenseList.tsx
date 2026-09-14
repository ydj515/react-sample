import { money, type Entry } from "@/features/expenses/model/expenses";
import { Button } from "@/shared/ui/button";

export function ExpenseList({
  entries,
  disabled,
  onEdit,
}: {
  entries: Entry[];
  disabled: boolean;
  onEdit: (entry: Entry) => void;
}) {
  return (
    <section
      className="border-line bg-surface rounded-2xl border p-5"
      aria-label="거래 내역"
    >
      <h2 className="mb-5 text-lg font-semibold">
        거래 내역 {entries.length}건
      </h2>
      {entries.length === 0 ? (
        <p className="text-ink-subtle py-8 text-center">
          조건에 맞는 내역이 없습니다. 필터를 변경하거나 내역을 추가하세요.
        </p>
      ) : (
        <ul className="divide-line divide-y">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium break-words">
                  {entry.memo || entry.category}
                </p>
                <p className="text-ink-subtle mt-1 text-sm">
                  {entry.date} · {entry.category} ·{" "}
                  {entry.type === "income" ? "수입" : "지출"}
                </p>
              </div>
              <span className="font-semibold tabular-nums">
                {entry.type === "income" ? "+" : "−"}
                {money(entry.amount)}
              </span>
              <Button
                variant="secondary"
                disabled={disabled}
                onClick={() => onEdit(entry)}
                aria-label={`${entry.memo || entry.category} 수정`}
              >
                수정
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
