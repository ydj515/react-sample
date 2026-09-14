import {
  expenseCategories,
  incomeCategories,
  type ExpenseFilter,
} from "@/features/expenses/model/expenses";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

export function ExpenseFilters({
  filter,
  onChange,
}: {
  filter: ExpenseFilter;
  onChange: (filter: ExpenseFilter) => void;
}) {
  return (
    <section
      className="border-line bg-surface grid gap-4 rounded-2xl border p-5 sm:grid-cols-2 xl:grid-cols-5"
      aria-label="내역 필터"
    >
      <label className="grid gap-2 text-sm">
        조회 월
        <Input
          type="month"
          value={filter.month}
          onChange={(event) =>
            onChange({ ...filter, month: event.target.value })
          }
        />
      </label>
      <label className="grid gap-2 text-sm">
        유형 필터
        <Select
          value={filter.type}
          onChange={(event) =>
            onChange({
              ...filter,
              type: event.target.value,
              category: "all",
            })
          }
        >
          <option value="all">전체 유형</option>
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        카테고리 필터
        <Select
          value={filter.category}
          onChange={(event) =>
            onChange({ ...filter, category: event.target.value })
          }
        >
          <option value="all">전체 카테고리</option>
          {(filter.type === "income"
            ? incomeCategories
            : filter.type === "expense"
              ? expenseCategories
              : [...incomeCategories, ...expenseCategories]
          ).map((category) => (
            <option key={category}>{category}</option>
          ))}
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        내역 검색
        <Input
          placeholder="메모 또는 카테고리"
          value={filter.query}
          onChange={(event) =>
            onChange({ ...filter, query: event.target.value })
          }
        />
      </label>
      <Button
        variant="secondary"
        className="self-end"
        onClick={() =>
          onChange({ month: "", type: "all", category: "all", query: "" })
        }
      >
        전체 내역 보기
      </Button>
    </section>
  );
}
