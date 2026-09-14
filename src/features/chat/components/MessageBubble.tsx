import {
  participantNames,
  type Message,
  type PendingMessage,
} from "@/features/chat/model/chat";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

export function MessageBubble({
  message,
  own,
  grouped,
  pending,
  read,
  onRetry,
}: {
  message: Message;
  own: boolean;
  grouped: boolean;
  pending?: PendingMessage;
  read: boolean;
  onRetry: (message: PendingMessage) => void;
}) {
  return (
    <div className={cn("flex items-start gap-2", own && "justify-end")}>
      {!own && (
        <div
          aria-hidden
          className={cn(
            "bg-surface text-brand border-line grid size-8 shrink-0 place-items-center rounded-xl border text-xs font-semibold",
            grouped && "invisible",
          )}
        >
          {participantNames[message.author].slice(0, 1)}
        </div>
      )}
      <div className="max-w-[85%] min-w-0 sm:max-w-[75%]">
        {!own && !grouped && (
          <p className="text-ink-subtle mb-1.5 text-xs">
            {participantNames[message.author]}
          </p>
        )}
        <div
          className={cn("flex items-end gap-1.5", own && "flex-row-reverse")}
        >
          <div
            className={cn(
              "min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
              own
                ? "bg-brand rounded-tr-sm text-white"
                : "bg-surface text-ink border-line rounded-tl-sm border",
            )}
          >
            <p className="[overflow-wrap:anywhere] break-words whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
          <div
            className={cn(
              "text-ink-subtle flex shrink-0 flex-col gap-0.5 pb-0.5 text-[10px]",
              own ? "items-end" : "items-start",
            )}
          >
            {own && (
              <span
                className={cn(
                  read && "text-brand",
                  pending?.status === "failed" && "text-negative",
                )}
              >
                {pending
                  ? pending.status === "sending"
                    ? "전송 중"
                    : "전송 실패"
                  : read
                    ? "읽음"
                    : "전송됨"}
              </span>
            )}
            <time dateTime={message.sentAt}>
              {new Intl.DateTimeFormat("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(message.sentAt))}
            </time>
          </div>
        </div>
        {pending?.status === "failed" && (
          <div className="mt-2 text-right">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onRetry(pending)}
            >
              전송 재시도
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
