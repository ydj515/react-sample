import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useUpdateOrderStatusMutation,
  useAddOrderNoteMutation,
} from "@/features/orders/queries/order-queries";
import {
  orderTransitions,
  orderStatusInputSchema,
  orderNoteInputSchema,
  type ManagedOrder,
  type Order,
} from "@/features/orders/model/order-schema";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/stores/toast-store";

export function OrderStatusForm({ order }: { order: ManagedOrder }) {
  const choices = orderTransitions[order.status];
  const form = useForm<{ status: Order["status"] }>({
    resolver: zodResolver(orderStatusInputSchema),
    defaultValues: { status: choices[0] ?? order.status },
  });
  const mutation = useUpdateOrderStatusMutation(order.id, () =>
    toast.success("주문 상태를 변경했습니다."),
  );
  if (!choices.length)
    return (
      <p className="text-ink-subtle text-sm">
        처리가 종료된 주문입니다. 상태를 변경할 수 없습니다.
      </p>
    );
  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values.status))}
    >
      <label className="grid gap-2 text-sm">
        변경할 주문 상태
        <Select {...form.register("status")}>
          {choices.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
      </label>
      <p className="text-ink-subtle text-xs">
        완료·취소 상태로 처리한 주문은 이전 상태로 되돌릴 수 없습니다.
      </p>
      {mutation.error ? (
        <p role="alert" className="text-negative text-sm">
          {mutation.error.message}
        </p>
      ) : null}
      <Button disabled={mutation.isPending} type="submit">
        {mutation.isPending ? "변경 중…" : "상태 변경"}
      </Button>
    </form>
  );
}
export function OrderNoteForm({ orderId }: { orderId: string }) {
  const form = useForm<{ text: string }>({
    resolver: zodResolver(orderNoteInputSchema),
    defaultValues: { text: "" },
  });
  const mutation = useAddOrderNoteMutation(orderId, () => {
    form.reset();
    toast.success("관리자 메모를 추가했습니다.");
  });
  return (
    <form
      className="grid gap-3"
      noValidate
      onSubmit={form.handleSubmit((values) => mutation.mutate(values.text))}
    >
      <label className="grid gap-2 text-sm">
        관리자 메모
        <Textarea
          disabled={mutation.isPending}
          {...form.register("text")}
          placeholder="처리 과정에서 확인한 내용을 기록하세요."
          maxLength={1000}
          aria-invalid={!!form.formState.errors.text}
          aria-describedby={
            form.formState.errors.text ? "note-error" : undefined
          }
        />
      </label>
      {form.formState.errors.text ? (
        <p id="note-error" role="alert" className="text-negative text-sm">
          {form.formState.errors.text.message}
        </p>
      ) : null}
      {mutation.error ? (
        <p role="alert" className="text-negative text-sm">
          {mutation.error.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "저장 중…" : "메모 추가"}
        </Button>
      </div>
    </form>
  );
}
