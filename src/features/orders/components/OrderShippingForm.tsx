import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  orderShippingSchema,
  type OrderShipping,
  type ManagedOrder,
} from "@/features/orders/model/order-schema";
import { useUpdateOrderShippingMutation } from "@/features/orders/queries/order-queries";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { toast } from "@/stores/toast-store";

export function OrderShippingForm({ order }: { order: ManagedOrder }) {
  const form = useForm<OrderShipping>({
    resolver: zodResolver(orderShippingSchema),
    defaultValues: {
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
    },
  });
  const mutation = useUpdateOrderShippingMutation(order.id, (saved) => {
    form.reset(orderShippingSchema.parse(saved));
    toast.success("배송 정보를 저장했습니다.");
  });
  return (
    <form
      noValidate
      className="border-line grid gap-4 border-t pt-5"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <fieldset disabled={mutation.isPending} className="grid min-w-0 gap-4">
        {(
          [
            { name: "carrier", label: "택배사" },
            { name: "trackingNumber", label: "운송장 번호" },
          ] as const
        ).map((field) => (
          <label key={field.name} className="grid gap-2 text-sm">
            {field.label}
            <Input
              {...form.register(field.name)}
              aria-label={field.label}
              aria-invalid={!!form.formState.errors[field.name]}
              maxLength={40}
            />
            {form.formState.errors[field.name] ? (
              <span role="alert" className="text-negative text-xs">
                {form.formState.errors[field.name]?.message}
              </span>
            ) : null}
          </label>
        ))}
        {mutation.error ? (
          <p role="alert" className="text-negative text-sm">
            {mutation.error.message}
          </p>
        ) : null}
        <Button
          type="submit"
          variant="secondary"
          disabled={mutation.isPending || !form.formState.isDirty}
        >
          {mutation.isPending ? "저장 중…" : "배송 정보 저장"}
        </Button>
      </fieldset>
    </form>
  );
}
