import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { NotePreview } from "./NotePreview";

it("renders safe text and highlights supported code without executing HTML", () => {
  render(
    <NotePreview
      source={
        '# 제목\n\n[위험](javascript:alert)\n\n```ts\nconst answer = 42;\n// comment\n"hello"\n```\n\n```python\nprint("hello")\n```\n\n<script>bad()</script>'
      }
    />,
  );
  expect(screen.getByRole("heading", { name: "제목" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "위험" })).not.toBeInTheDocument();
  expect(screen.getByText("const")).toHaveClass("text-brand");
  expect(screen.getByText("<script>bad()</script>")).toBeInTheDocument();
});
