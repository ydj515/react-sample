import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  invoiceInputSchema,
  totals,
  money,
} from "@/features/billing/model/billing";
import type { Invoice, InvoiceInput } from "@/features/billing/model/billing";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export function InvoiceForm({
  invoice,
  onSave,
  onCancel,
}: {
  invoice?: Invoice;
  onSave: (value: InvoiceInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceInputSchema),
    defaultValues: invoice ?? {
      customer: "",
      dueDate: new Date().toISOString().slice(0, 10),
      taxRate: 10,
      items: [{ description: "", quantity: 1, price: 0 }],
    },
  });

  const rows = useFieldArray({ control: form.control, name: "items" });

  const values = useWatch({ control: form.control });

  const total = totals(
    (values.items ?? []).map((item) => ({
      description: item.description ?? "",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
    })),
    values.taxRate ?? 0,
  );
  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(event) => {
        void form.handleSubmit(onSave)(event);
      }}
    >
      <h2 className="text-xl font-semibold">
        {invoice ? "초안 수정" : "새 송장"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2">
          고객명
          <Input {...form.register("customer")} />
        </label>
        <label className="grid gap-2">
          납부 기한
          <Input type="date" {...form.register("dueDate")} />
        </label>
        <label className="grid gap-2">
          세율 (%)
          <Input
            type="number"
            min={0}
            max={100}
            {...form.register("taxRate", { valueAsNumber: true })}
          />
        </label>
      </div>
      {rows.fields.map((field, index) => (
        <fieldset
          key={field.id}
          className="border-line grid gap-3 rounded-lg border p-4 sm:grid-cols-[minmax(0,1fr)_100px_140px_auto]"
        >
          <legend>항목 {index + 1}</legend>
          <label className="grid gap-2">
            설명
            <Input {...form.register(`items.${index}.description`)} />
          </label>
          <label className="grid gap-2">
            수량
            <Input
              type="number"
              min={1}
              {...form.register(`items.${index}.quantity`, {
                valueAsNumber: true,
              })}
            />
          </label>
          <label className="grid gap-2">
            단가 (원)
            <Input
              type="number"
              min={0}
              {...form.register(`items.${index}.price`, {
                valueAsNumber: true,
              })}
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            className="self-end"
            disabled={rows.fields.length === 1}
            onClick={() => rows.remove(index)}
          >
            항목 {index + 1} 제거
          </Button>
        </fieldset>
      ))}
      <Button
        type="button"
        variant="secondary"
        disabled={rows.fields.length >= 100}
        onClick={() => rows.append({ description: "", quantity: 1, price: 0 })}
      >
        라인 아이템 추가
      </Button>
      <p>예상 합계: {money(total.total)}</p>
      {Object.keys(form.formState.errors).length > 0 && (
        <p role="alert" className="text-negative">
          고객명, 유효한 납부 기한, 항목 설명을 입력하세요. 수량은 1~10,000의
          정수, 단가는 0~100,000,000원의 정수, 세율은 0~100이어야 합니다.
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit">초안 저장</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          돌아가기
        </Button>
      </div>
    </form>
  );
}
