import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventInputSchema,
  type EventInput,
} from "@/features/calendar/model/calendar";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

export function EventForm({
  value,
  onSave,
  onDelete,
  error,
}: {
  value: EventInput;
  onSave: (input: EventInput) => void;
  onDelete?: () => void;
  error: string;
}) {
  const form = useForm<EventInput>({
    resolver: zodResolver(eventInputSchema),
    defaultValues: value,
  });
  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit(onSave)(event);
      }}
    >
      <label className="grid gap-2 text-sm">
        일정 제목
        <Input {...form.register("title")} maxLength={100} />
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        시작 (서울)
        <Input
          className="min-w-0"
          type="datetime-local"
          {...form.register("start")}
        />
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        종료 (서울)
        <Input
          className="min-w-0"
          type="datetime-local"
          {...form.register("end")}
        />
      </label>
      <label className="grid gap-2 text-sm">
        일정 설명
        <Textarea {...form.register("description")} maxLength={1000} />
      </label>
      {Object.keys(form.formState.errors).length > 0 && (
        <p role="alert" className="text-negative text-sm">
          제목과 유효한 시작·종료 시간을 확인하세요. 종료는 시작 이후여야
          합니다.
        </p>
      )}
      {error && (
        <p role="alert" className="text-negative text-sm">
          {error}
        </p>
      )}
      <div className="flex justify-between gap-3">
        <Button type="submit">일정 저장</Button>
        {onDelete && (
          <Button type="button" variant="danger" onClick={onDelete}>
            일정 삭제
          </Button>
        )}
      </div>
    </form>
  );
}
