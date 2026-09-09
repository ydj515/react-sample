import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { inquirySchema, type Inquiry } from "../model/landing";

export function InquiryForm({ context }: { context: string }) {
  const id = useId();
  const [complete, setComplete] = useState(false);
  const form = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  if (complete)
    return (
      <div className="space-y-5 py-6">
        <div
          role="status"
          className="bg-positive-soft text-positive rounded-panel space-y-3 p-5"
        >
          <CheckCircle2 aria-hidden />
          <p className="font-semibold">{context} 체험을 완료했습니다.</p>
          <p className="text-sm leading-6">
            입력 내용은 외부로 전송하지 않았습니다. 실제 신청이나 결제는
            발생하지 않습니다.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            form.reset();
            setComplete(false);
          }}
        >
          다시 작성
        </Button>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(() => setComplete(true))}
      className="space-y-5"
    >
      <p className="text-ink-subtle text-sm leading-6">
        샘플 폼입니다. 예시 정보를 사용하세요. 입력은 저장하거나 전송하지
        않습니다.
      </p>
      {(
        [
          {
            name: "name",
            label: "이름",
            type: "text",
            placeholder: "샘플 사용자",
          },
          {
            name: "email",
            label: "이메일",
            type: "email",
            placeholder: "sample@example.com",
          },
        ] as const
      ).map((field) => (
        <div key={field.name}>
          <label
            className="mb-2 block text-sm font-medium"
            htmlFor={`${id}-${field.name}`}
          >
            {field.label}
          </label>
          <Input
            id={`${id}-${field.name}`}
            type={field.type}
            placeholder={field.placeholder}
            {...form.register(field.name)}
            aria-invalid={!!form.formState.errors[field.name]}
            aria-describedby={
              form.formState.errors[field.name]
                ? `${id}-${field.name}-error`
                : undefined
            }
          />
          {form.formState.errors[field.name] && (
            <p
              className="text-negative mt-2 text-sm"
              role="alert"
              id={`${id}-${field.name}-error`}
            >
              {form.formState.errors[field.name]?.message}
            </p>
          )}
        </div>
      ))}
      <div>
        <label
          htmlFor={`${id}-message`}
          className="mb-2 block text-sm font-medium"
        >
          문의 내용 (선택)
        </label>
        <Textarea
          id={`${id}-message`}
          rows={3}
          maxLength={1000}
          {...form.register("message")}
          aria-invalid={!!form.formState.errors.message}
          aria-describedby={
            form.formState.errors.message ? `${id}-message-error` : undefined
          }
        />
        {form.formState.errors.message && (
          <p
            id={`${id}-message-error`}
            role="alert"
            className="text-negative mt-2 text-sm"
          >
            {form.formState.errors.message.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full">
        데모 제출
      </Button>
    </form>
  );
}
