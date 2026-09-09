import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipientSchema, type Recipient } from "@/features/shop/model/shop";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function CheckoutForm({
  pending,
  disabled,
  error,
  onSubmit,
}: {
  pending: boolean;
  disabled: boolean;
  error?: string;
  onSubmit: (recipient: Recipient) => void;
}) {
  const form = useForm<Recipient>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: "샘플 고객",
      phone: "010-0000-0000",
      address: "서울특별시 샘플로 10 (예시 주소)",
    },
  });
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-7 space-y-5"
    >
      <h2 className="font-semibold">배송 정보</h2>
      <p className="text-ink-subtle text-xs leading-6">
        예시 정보로 체험할 수 있습니다. 실제 결제나 배송은 진행하지 않습니다.
      </p>
      <fieldset disabled={pending} className="space-y-4">
        {(
          [
            { name: "name", label: "받는 분" },
            { name: "phone", label: "연락처" },
            { name: "address", label: "배송 주소" },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`checkout-${field.name}`}
              className="text-ink-subtle mb-2 block text-xs"
            >
              {field.label}
            </label>
            <Input
              id={`checkout-${field.name}`}
              {...form.register(field.name)}
              aria-invalid={!!form.formState.errors[field.name]}
              aria-describedby={
                form.formState.errors[field.name]
                  ? `error-${field.name}`
                  : undefined
              }
            />
            {form.formState.errors[field.name] && (
              <p
                id={`error-${field.name}`}
                role="alert"
                className="text-negative mt-2 text-xs"
              >
                {form.formState.errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>
      {error && (
        <p role="alert" className="text-negative text-sm leading-6">
          {error}
        </p>
      )}
      <Button className="w-full" type="submit" disabled={disabled || pending}>
        {pending ? "주문 확인 중…" : "모의 주문 완료하기"}
      </Button>
    </form>
  );
}
