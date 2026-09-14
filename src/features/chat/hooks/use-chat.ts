import { useCallback, useEffect, useRef, useState } from "react";
import {
  createChatConnection,
  readHistory,
  readReceipts,
} from "@/features/chat/data/chat-repository";
import {
  mergeMessages,
  type Participant,
  type Message,
  type PendingMessage,
  type ReadState,
} from "@/features/chat/model/chat";

export function useChat(author: Participant) {
  const [initial] = useState(() => {
    try {
      return { ...readHistory(), receipts: readReceipts(), error: "" };
    } catch {
      return {
        messages: [] as Message[],
        cursor: undefined,
        receipts: { mina: null, jun: null } as ReadState,
        error:
          "저장된 대화를 읽을 수 없습니다. 원본 보호를 위해 전송을 중단했습니다.",
      };
    }
  });

  const [messages, setMessages] = useState(initial.messages);

  const [cursor, setCursor] = useState(initial.cursor);

  const [receipts, setReceipts] = useState(initial.receipts);

  const [pending, setPending] = useState<PendingMessage[]>([]);

  const [error, setError] = useState(initial.error);

  const [typing, setTyping] = useState(false);

  const connection = useRef<ReturnType<typeof createChatConnection> | null>(
    null,
  );

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const sending = useRef(new Set<string>());
  useEffect(() => {
    const active = createChatConnection(
      (signal) => {
        if (signal.type === "message") {
          setMessages((current) => mergeMessages(current, [signal.message]));
          if (signal.message.author !== author) setTyping(false);
        }
        if (signal.type === "read") {
          setReceipts((current) => ({
            ...current,
            [signal.author]:
              signal.through > (current[signal.author] ?? "")
                ? signal.through
                : current[signal.author],
          }));
        }
        if (signal.type === "typing" && signal.author !== author) {
          clearTimeout(typingTimeout.current);
          setTyping(signal.active);
          if (signal.active) {
            typingTimeout.current = setTimeout(() => setTyping(false), 3000);
          }
        }
      },
      () => setError("대화를 동기화하지 못했습니다. 새로고침 후 확인하세요."),
    );
    connection.current = active;
    return () => {
      active.typing(author, false);
      active.close();
      connection.current = null;
      clearTimeout(typingTimeout.current);
    };
  }, [author]);

  function loadMore() {
    if (!cursor) return false;
    try {
      const page = readHistory(cursor);
      setMessages((current) => mergeMessages(page.messages, current));
      setCursor(page.cursor);
      setError("");
      return true;
    } catch {
      setError("이전 대화를 불러오지 못했습니다. 다시 시도하세요.");
      return false;
    }
  }

  async function transmit(message: PendingMessage, fail: boolean) {
    const active = connection.current;
    if (!active || initial.error || sending.current.has(message.id)) return;
    sending.current.add(message.id);
    setPending((current) => [
      ...current.filter((item) => item.id !== message.id),
      { ...message, status: "sending" },
    ]);
    try {
      const saved = await active.send(message, fail);
      setMessages((current) => mergeMessages(current, [saved]));
      setPending((current) => current.filter((item) => item.id !== saved.id));
    } catch {
      setPending((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, status: "failed" } : item,
        ),
      );
    } finally {
      sending.current.delete(message.id);
    }
  }

  const markRead = useCallback(
    (through: string) => {
      if (initial.error) return;
      try {
        const saved = connection.current?.markRead(author, through);
        if (saved) {
          setReceipts((current) =>
            current[author] === saved
              ? current
              : { ...current, [author]: saved },
          );
        }
      } catch {
        setError("읽음 상태를 저장하지 못했습니다.");
      }
    },
    [author, initial.error],
  );

  return {
    messages,
    pending,
    receipts,
    typing,
    error,
    blocked: !!initial.error,
    hasMore: !!cursor,
    loadMore,
    markRead,
    send(text: string, fail: boolean) {
      const message: PendingMessage = {
        id: crypto.randomUUID(),
        author,
        text,
        sentAt: new Date().toISOString(),
        status: "sending",
      };
      connection.current?.typing(author, false);
      void transmit(message, fail);
    },
    retry(message: PendingMessage) {
      void transmit(message, false);
    },
    notifyTyping(active: boolean) {
      connection.current?.typing(author, active);
    },
  };
}
