import { expect, it } from "vitest";
import { initialNotes, newNote, notesSchema } from "./notes";

it("creates a valid initial notebook", () => {
  const notes = initialNotes();
  expect(notes).toHaveLength(1);
  expect(notesSchema.safeParse(notes).success).toBe(true);
  expect(newNote().markdown).toContain("```ts");
});

it("rejects an empty notebook", () =>
  expect(notesSchema.safeParse([]).success).toBe(false));
