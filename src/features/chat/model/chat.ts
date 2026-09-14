import { z } from "zod";

export const participantSchema = z.enum(["mina", "jun"]);

export type Participant = z.infer<typeof participantSchema>;

export const participantNames: Record<Participant, string> = {
  mina: "민아",
  jun: "준",
};

export const messageInputSchema = z.object({
  id: z.string().min(1),
  author: participantSchema,
  text: z
    .string()
    .trim()
    .min(1, "메시지를 입력하세요.")
    .max(2000, "2,000자 이내로 입력하세요."),
});

export const messageSchema = messageInputSchema.extend({
  sentAt: z.iso.datetime(),
});

export type Message = z.infer<typeof messageSchema>;

export type MessageInput = z.infer<typeof messageInputSchema>;

export type PendingMessage = Message & { status: "sending" | "failed" };

export const readStateSchema = z.object({
  mina: z.iso.datetime().nullable(),
  jun: z.iso.datetime().nullable(),
});

export type ReadState = z.infer<typeof readStateSchema>;

export const signalSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("message"), message: messageSchema }),
  z.object({
    type: z.literal("typing"),
    author: participantSchema,
    active: z.boolean(),
  }),
  z.object({
    type: z.literal("read"),
    author: participantSchema,
    through: z.iso.datetime(),
  }),
]);

export type ChatSignal = z.infer<typeof signalSchema>;

export function mergeMessages(current: Message[], incoming: Message[]) {
  return [
    ...new Map(
      [...current, ...incoming].map((message) => [message.id, message]),
    ).values(),
  ].sort(
    (a, b) => a.sentAt.localeCompare(b.sentAt) || a.id.localeCompare(b.id),
  );
}

export function historyPage(messages: Message[], before?: string, size = 20) {
  const end =
    before === undefined
      ? messages.length
      : messages.findIndex((message) => message.id === before);

  const start = Math.max(0, end - size);
  return {
    messages: messages.slice(start, Math.max(0, end)),
    cursor: start > 0 ? messages[start]?.id : undefined,
  };
}
