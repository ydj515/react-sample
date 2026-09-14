import { z } from "zod";
import {
  historyPage,
  mergeMessages,
  messageSchema,
  messageInputSchema,
  readStateSchema,
  signalSchema,
  type Message,
  type MessageInput,
  type Participant,
  type ChatSignal,
} from "@/features/chat/model/chat";

const prefix = "react-sample-chat-v1:";

const seed = (): Message[] =>
  Array.from({ length: 60 }, (_, index) => ({
    id: `history-${String(index).padStart(3, "0")}`,
    author: index % 2 ? "mina" : "jun",
    text: `${index + 1}번째 프로젝트 대화입니다. 위로 스크롤하면 이전 메시지를 불러옵니다.`,
    sentAt: new Date(Date.UTC(2026, 8, 1, 9, index)).toISOString(),
  }));

export function readMessages() {
  const messages: Message[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (key?.startsWith(`${prefix}message:`)) {
      messages.push(
        messageSchema.parse(JSON.parse(localStorage.getItem(key) ?? "null")),
      );
    }
  }
  return mergeMessages(seed(), messages);
}

export function readHistory(before?: string) {
  return historyPage(readMessages(), before);
}

export function readReceipts() {
  return readStateSchema.parse(
    Object.fromEntries(
      (["mina", "jun"] as const).map((author) => [
        author,
        localStorage.getItem(`${prefix}read:${author}`),
      ]),
    ),
  );
}

export function createChatConnection(
  onSignal: (signal: ChatSignal) => void,
  onError: () => void,
) {
  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("react-sample-chat")
      : null;

  let closed = false;

  function receive(value: unknown) {
    const parsed = signalSchema.safeParse(value);
    if (parsed.success) onSignal(parsed.data);
  }
  if (channel) channel.onmessage = (event) => receive(event.data);
  function storage(event: StorageEvent) {
    if (!event.newValue || !event.key?.startsWith(prefix)) return;
    try {
      if (event.key.startsWith(`${prefix}message:`)) {
        receive({ type: "message", message: JSON.parse(event.newValue) });
      }
      if (event.key.startsWith(`${prefix}read:`)) {
        receive({
          type: "read",
          author: event.key.slice(`${prefix}read:`.length),
          through: event.newValue,
        });
      }
    } catch {
      onError();
    }
  }
  window.addEventListener("storage", storage);
  function broadcast(signal: ChatSignal) {
    if (!closed) channel?.postMessage(signal);
  }
  return {
    realtime: !!channel,
    async send(input: MessageInput, simulateFailure = false) {
      const validated = messageInputSchema.parse(input);
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      if (simulateFailure) throw new Error("Simulated send failure");
      const key = `${prefix}message:${validated.id}`;

      const existing = localStorage.getItem(key);

      const message = existing
        ? messageSchema.parse(JSON.parse(existing))
        : { ...validated, sentAt: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(message));
      broadcast({ type: "message", message });
      return message;
    },
    typing(author: Participant, active: boolean) {
      broadcast({ type: "typing", author, active });
    },
    markRead(author: Participant, through: string) {
      z.iso.datetime().parse(through);
      const key = `${prefix}read:${author}`;

      const previous = localStorage.getItem(key);
      if (previous && previous >= through) return previous;
      localStorage.setItem(key, through);
      broadcast({ type: "read", author, through });
      return through;
    },
    close() {
      closed = true;
      channel?.close();
      window.removeEventListener("storage", storage);
    },
  };
}
