import { expect, it } from "vitest";
import { messageInputSchema, mergeMessages, historyPage } from "./chat";

it("validates messages and deduplicates acknowledged optimistic sends", () => {
  expect(
    messageInputSchema.safeParse({ id: "m", author: "mina", text: "  " })
      .success,
  ).toBe(false);
  const message = {
    id: "m",
    author: "mina" as const,
    text: "안녕",
    sentAt: "2026-09-14T10:00:00.000Z",
  };
  expect(mergeMessages([message], [message])).toHaveLength(1);
});

it("pages backwards without skipping a message", () => {
  const messages = Array.from({ length: 45 }, (_, index) => ({
    id: String(index),
    author: "mina" as const,
    text: String(index),
    sentAt: new Date(index * 1000).toISOString(),
  }));

  const latest = historyPage(messages, undefined, 20);
  expect(latest.messages[0]?.id).toBe("25");
  expect(historyPage(messages, latest.cursor, 20).messages.at(-1)?.id).toBe(
    "24",
  );
});
