import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import {
  createStaySchema,
  getStayQuote,
  localDateString,
  rooms,
  type StayValues,
} from "../../model/experience";
export function StayPlanner() {
  const id = useId();
  const [quote, setQuote] = useState<{
    values: StayValues;
    nights: number;
    total: number;
  }>();
  const form = useForm<StayValues>({
    resolver: zodResolver(createStaySchema()),
    defaultValues: { arrival: "", departure: "", room: "forest", guests: "2" },
  });
  return (
    <form
      noValidate
      onChange={() => setQuote(undefined)}
      onSubmit={form.handleSubmit((values) =>
        setQuote({ values, ...getStayQuote(values) }),
      )}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {(
          [
            { name: "arrival", label: "체크인" },
            { name: "departure", label: "체크아웃" },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`${id}-${field.name}`}
              className="mb-2 block text-xs"
            >
              {field.label}
            </label>
            <Input
              id={`${id}-${field.name}`}
              type="date"
              min={localDateString()}
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
                className="text-negative mt-2 text-xs leading-6"
                role="alert"
                id={`${id}-${field.name}-error`}
              >
                {form.formState.errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        <div>
          <label htmlFor={`${id}-room`} className="mb-2 block text-xs">
            객실
          </label>
          <Select id={`${id}-room`} {...form.register("room")}>
            <option value="forest">Forest Suite · 최대 2인</option>
            <option value="garden">Garden House · 최대 4인</option>
          </Select>
        </div>
        <div>
          <label htmlFor={`${id}-guests`} className="mb-2 block text-xs">
            인원
          </label>
          <Select
            id={`${id}-guests`}
            {...form.register("guests")}
            aria-invalid={!!form.formState.errors.guests}
            aria-describedby={
              form.formState.errors.guests ? `${id}-guests-error` : undefined
            }
          >
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>
                {value}명
              </option>
            ))}
          </Select>
          {form.formState.errors.guests && (
            <p
              className="text-negative mt-2 text-xs leading-6"
              role="alert"
              id={`${id}-guests-error`}
            >
              {form.formState.errors.guests.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full">
        예상 숙박비 보기
        <ArrowRight className="size-4" aria-hidden />
      </Button>
      {quote && (
        <div
          role="status"
          className="bg-brand-soft text-brand border-line space-y-3 border p-5"
        >
          <p className="font-semibold">
            {rooms[quote.values.room].name} · {quote.nights}박 ·{" "}
            {quote.values.guests}명
          </p>
          <p className="text-2xl font-semibold">
            ₩{quote.total.toLocaleString("ko-KR")}
          </p>
          <p className="text-sm leading-6">
            가상 숙박 요금 합계입니다. 실제 예약 가능 여부를 조회하거나 예약하지
            않습니다.
          </p>
        </div>
      )}
      <p className="text-ink-subtle text-xs leading-6">
        1박 기준 Forest Suite ₩280,000 / Garden House ₩420,000. 별도 추가 요금
        없는 샘플이며 최대 14박까지 계산합니다.
      </p>
    </form>
  );
}
