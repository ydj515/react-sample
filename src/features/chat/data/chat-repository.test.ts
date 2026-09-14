import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  createChatConnection,
  readHistory,
  readMessages,
  readReceipts,
} from "./chat-repository";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("persists concurrent sends independently and retries idempotently", async () => {
  const connection = createChatConnection(vi.fn(), vi.fn());
  try {
    const input = { id: "a", author: "mina" as const, text: "hello" };

    const sends = Promise.all([
      connection.send(input),
      connection.send({ ...input, id: "b", author: "jun" }),
    ]);
    await vi.advanceTimersByTimeAsync(600);
    const [first] = await sends;

    const retry = connection.send(input);
    await vi.advanceTimersByTimeAsync(600);
    expect(await retry).toEqual(first);
    expect(readMessages()).toHaveLength(62);
    expect(readHistory().messages).toHaveLength(20);
    connection.markRead("jun", first.sentAt);
    connection.markRead("jun", "2020-01-01T00:00:00.000Z");
    expect(readReceipts().jun).toBe(first.sentAt);
  } finally {
    connection.close();
  }
});

it("does not persist rejected sends and reports malformed storage events", async () => {
  const receive = vi.fn();

  const error = vi.fn();

  const connection = createChatConnection(receive, error);
  try {
    const rejected = expect(
      connection.send({ id: "a", author: "mina", text: "hello" }, true),
    ).rejects.toThrow("Simulated");
    await vi.advanceTimersByTimeAsync(600);
    await rejected;
    expect(readMessages()).toHaveLength(60);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "react-sample-chat-v1:message:broken",
        newValue: "{",
      }),
    );
    expect(error).toHaveBeenCalledOnce();
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "react-sample-chat-v1:read:jun",
        newValue: "2026-09-14T00:00:00.000Z",
      }),
    );
    expect(receive).toHaveBeenCalledWith({
      type: "read",
      author: "jun",
      through: "2026-09-14T00:00:00.000Z",
    });
    localStorage.setItem("react-sample-chat-v1:message:broken", "{");
    expect(() => readMessages()).toThrow();
  } finally {
    connection.close();
  }
});
