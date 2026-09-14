import { useState } from "react";
import { ExpenseFilters } from "@/features/expenses/components/ExpenseFilters";
import { ExpenseSummary } from "@/features/expenses/components/ExpenseSummary";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { ExpenseCharts } from "@/features/expenses/components/ExpenseCharts";
import {
  entriesSchema,
  initialEntries,
  filterExpenses,
  summarizeExpenses,
  localDate,
  type Entry,
  type EntryInput,
} from "@/features/expenses/model/expenses";
import { useLocalRecords } from "@/shared/lib/use-local-records";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

export function ExpensesPage() {
  const store = useLocalRecords(
    "react-sample-expenses-v1",
    entriesSchema,
    initialEntries,
  );

  const [editing, setEditing] = useState<Entry | "new" | null>(null);

  const [filter, setFilter] = useState({
    month: localDate().slice(0, 7),
    type: "all",
    category: "all",
    query: "",
  });

  const [message, setMessage] = useState("");

  const entries = filterExpenses(store.data, filter);

  const summary = summarizeExpenses(entries);

  function save(input: EntryInput) {
    const next = {
      ...input,
      id: editing && editing !== "new" ? editing.id : crypto.randomUUID(),
    };
    if (
      store.save(
        editing === "new"
          ? [...store.data, next]
          : store.data.map((entry) => (entry.id === next.id ? next : entry)),
      )
    ) {
      setEditing(null);
      setMessage("내역을 저장했습니다.");
      setFilter({
        month: input.date.slice(0, 7),
        type: "all",
        category: "all",
        query: "",
      });
    }
  }
  return (
    <div className="grid gap-6">
      <PageHeader
        title="가계부"
        description="수입과 지출을 기록하고 흐름을 확인하세요. 원화 기준이며 이 브라우저에만 저장됩니다. 초기 내역은 샘플입니다."
        actions={
          <Button
            disabled={store.blocked || store.data.length >= 10000}
            onClick={() => setEditing("new")}
          >
            내역 추가
          </Button>
        }
      />
      {store.error && (
        <p role="alert" className="text-negative">
          {store.error}
        </p>
      )}
      {message && (
        <p role="status" className="text-positive">
          {message}
        </p>
      )}
      {editing && (
        <div className="border-line bg-surface rounded-2xl border p-5 sm:p-8">
          <ExpenseForm
            key={editing === "new" ? "new" : editing.id}
            value={editing === "new" ? undefined : editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
      <ExpenseFilters filter={filter} onChange={setFilter} />
      <ExpenseSummary summary={summary} />
      <p className="text-ink-subtle text-sm">
        아래 차트와 합계는 필터에 일치하는 {entries.length}건을 기준으로 합니다.
      </p>
      <ExpenseCharts entries={entries} />
      <ExpenseList
        entries={entries}
        disabled={store.blocked}
        onEdit={setEditing}
      />
    </div>
  );
}
