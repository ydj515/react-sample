import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageInputSchema } from "@/features/chat/model/chat";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { SendHorizontal } from "lucide-react";

const composeSchema = messageInputSchema.pick({ text: true });

export function ChatComposer({
  disabled,
  onSend,
  onTyping,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
  onTyping: (active: boolean) => void;
}) {
  const form = useForm<{ text: string }>({
    resolver: zodResolver(composeSchema),
    defaultValues: { text: "" },
  });
  return (
    <form
      className="border-line bg-surface shrink-0 border-t p-3 sm:p-4"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit((value) => {
          onSend(value.text);
          form.reset();
          onTyping(false);
        })(event);
      }}
    >
      <div className="border-line focus-within:border-brand rounded-xl border p-2.5">
        <label className="block text-sm">
          <span className="sr-only">메시지</span>
          <Textarea
            className="max-h-36 min-h-14 resize-none border-0 bg-transparent px-1 py-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
            placeholder="메시지를 입력하세요"
            rows={2}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                event.nativeEvent.keyCode !== 229
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={disabled}
            maxLength={2000}
            {...form.register("text", {
              onChange: (event) => onTyping(Boolean(event.target.value)),
              onBlur: () => onTyping(false),
            })}
          />
        </label>
        {form.formState.errors.text && (
          <p role="alert" className="text-negative text-sm">
            {form.formState.errors.text.message}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-ink-subtle text-[11px]">
            Enter 전송 · Shift + Enter 줄바꿈
          </span>
          <Button type="submit" size="sm" disabled={disabled}>
            <SendHorizontal className="size-3.5" aria-hidden />
            전송
          </Button>
        </div>
      </div>
    </form>
  );
}
