import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  entryInputSchema,
  expenseCategories,
  incomeCategories,
  localDate,
  type EntryInput,
} from "@/features/expenses/model/expenses";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

export function ExpenseForm({
  value,
  onSave,
  onCancel,
}: {
  value?: EntryInput;
  onSave: (value: EntryInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<EntryInput>({
    resolver: zodResolver(entryInputSchema),
    defaultValues: value ?? {
      date: localDate(),
      type: "expense",
      category: "식비",
      amount: 0,
      memo: "",
    },
  });

  const type = useWatch({ control: form.control, name: "type" });
  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit(onSave)(event);
      }}
    >
      <h2 className="text-xl font-semibold">
        {value ? "내역 수정" : "내역 추가"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          거래 날짜
          <Input type="date" {...form.register("date")} />
        </label>
        <label className="grid gap-2">
          수입 / 지출
          <Select
            {...form.register("type", {
              onChange: (event: { target: { value: string } }) => {
                form.setValue(
                  "category",
                  event.target.value === "income" ? "급여" : "식비",
                );
              },
            })}
          >
            <option value="expense">지출</option>
            <option value="income">수입</option>
          </Select>
        </label>
        <label className="grid gap-2">
          거래 카테고리
          <Select {...form.register("category")}>
            {(type === "income" ? incomeCategories : expenseCategories).map(
              (category) => (
                <option key={category}>{category}</option>
              ),
            )}
          </Select>
        </label>
        <label className="grid gap-2">
          금액 (원)
          <Input
            type="number"
            min={1}
            max={1000000000}
            step={1}
            {...form.register("amount", { valueAsNumber: true })}
          />
        </label>
      </div>
      <label className="grid gap-2">
        메모
        <Input maxLength={200} {...form.register("memo")} />
      </label>
      {Object.keys(form.formState.errors).length > 0 && (
        <p role="alert" className="text-negative">
          날짜와 카테고리를 확인하고 1~1,000,000,000원의 정수 금액을 입력하세요.
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit">내역 저장</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
