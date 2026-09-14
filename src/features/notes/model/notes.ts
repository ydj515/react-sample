import { z } from "zod";

export const notesSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string().max(100),
      markdown: z.string().max(100000),
      tags: z.string().max(300),
    }),
  )
  .min(1)
  .max(100);

export type Note = z.infer<typeof notesSchema>[number];

export function newNote(): Note {
  return {
    id: crypto.randomUUID(),
    title: "새 노트",
    markdown:
      '# 나의 노트\n\n아이디어를 기록하세요.\n\n```ts\nconst message = "Hello";\n```',
    tags: "아이디어",
  };
}

export function initialNotes(): Note[] {
  return [newNote()];
}
