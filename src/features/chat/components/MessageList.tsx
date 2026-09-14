import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  mergeMessages,
  type Message,
  type Participant,
  type PendingMessage,
  type ReadState,
} from "@/features/chat/model/chat";
import { Button } from "@/shared/ui/button";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/shared/lib/cn";

export function MessageList({
  messages,
  pending,
  author,
  receipts,
  hasMore,
  onMore,
  onRetry,
  onRead,
}: {
  messages: Message[];
  pending: PendingMessage[];
  author: Participant;
  receipts: ReadState;
  hasMore: boolean;
  onMore: () => boolean;
  onRetry: (message: PendingMessage) => void;
  onRead: (through: string) => void;
}) {
  const scroll = useRef<HTMLDivElement>(null);

  const anchor = useRef<{ height: number; top: number } | null>(null);

  const atBottom = useRef(true);

  const [away, setAway] = useState(false);

  const peer = author === "mina" ? "jun" : "mina";

  const visible = mergeMessages(
    messages,
    pending.filter((item) => !messages.some((saved) => saved.id === item.id)),
  );

  const newest = messages.at(-1)?.sentAt;

  function more() {
    if (!hasMore || anchor.current || !scroll.current) return;
    anchor.current = {
      height: scroll.current.scrollHeight,
      top: scroll.current.scrollTop,
    };
    if (!onMore()) anchor.current = null;
  }
  useLayoutEffect(() => {
    const node = scroll.current;
    if (!node) return;
    if (anchor.current) {
      node.scrollTop =
        anchor.current.top + node.scrollHeight - anchor.current.height;
      anchor.current = null;
    } else if (atBottom.current) node.scrollTop = node.scrollHeight;
  }, [messages, pending]);
  useEffect(() => {
    function read() {
      if (
        !away &&
        document.visibilityState === "visible" &&
        document.hasFocus() &&
        newest
      ) {
        onRead(newest);
      }
    }

    const initialRead = window.setTimeout(read, 0);
    window.addEventListener("focus", read);
    document.addEventListener("visibilitychange", read);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("focus", read);
      document.removeEventListener("visibilitychange", read);
    };
  }, [away, newest, onRead]);
  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scroll}
        className="bg-surface-muted/70 h-full min-h-0 overflow-y-auto overscroll-contain p-3 [overflow-anchor:none] sm:p-5"
        aria-label="메시지 기록"
        role="region"
        tabIndex={0}
        onScroll={() => {
          const node = scroll.current;
          if (!node) return;
          atBottom.current =
            node.scrollHeight - node.scrollTop - node.clientHeight < 40;
          setAway(!atBottom.current);
          if (node.scrollTop < 40) more();
        }}
      >
        {hasMore ? (
          <Button
            variant="secondary"
            size="sm"
            className="mx-auto mb-5 flex rounded-full"
            onClick={more}
          >
            이전 메시지 더 보기
          </Button>
        ) : (
          <p className="text-ink-subtle mb-5 text-center text-xs">
            대화의 시작입니다.
          </p>
        )}
        <ol className="grid gap-2">
          {visible.map((message, index) => {
            const previous = visible[index - 1];

            const date = new Date(message.sentAt).toLocaleDateString("ko-KR");

            const newDay =
              !previous ||
              new Date(previous.sentAt).toLocaleDateString("ko-KR") !== date;

            const grouped =
              !newDay &&
              previous?.author === message.author &&
              Date.parse(message.sentAt) - Date.parse(previous.sentAt) <
                300_000;

            const optimistic = pending.find(
              (item) =>
                item.id === message.id &&
                !messages.some((saved) => saved.id === item.id),
            );
            return (
              <li
                key={message.id}
                data-message-id={message.id}
                className={cn(!grouped && !newDay && "mt-3")}
              >
                {newDay && (
                  <div className="my-5 flex justify-center">
                    <span className="bg-surface border-line text-ink-subtle rounded-full border px-3 py-1 text-[11px]">
                      {new Intl.DateTimeFormat("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "short",
                      }).format(new Date(message.sentAt))}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  own={message.author === author}
                  grouped={grouped}
                  pending={optimistic}
                  read={!!receipts[peer] && receipts[peer] >= message.sentAt}
                  onRetry={onRetry}
                />
              </li>
            );
          })}
        </ol>
      </div>
      {away && (
        <Button
          variant="secondary"
          className="absolute right-4 bottom-3 shadow-md"
          onClick={() => {
            atBottom.current = true;
            setAway(false);
            scroll.current?.scrollTo({ top: scroll.current.scrollHeight });
          }}
        >
          최신 메시지로
        </Button>
      )}
    </div>
  );
}
