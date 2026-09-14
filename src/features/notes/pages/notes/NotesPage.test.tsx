import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import { NotesPage } from "./NotesPage";

beforeEach(() => localStorage.clear());
it("previews markdown and restores saved notes", async () => {
  const view = render(<NotesPage />);
  fireEvent.change(screen.getByLabelText("노트 제목"), {
    target: { value: "회의" },
  });
  fireEvent.change(screen.getByLabelText("마크다운 본문"), {
    target: { value: "# 결정 사항" },
  });
  expect(
    screen.getByRole("heading", { name: "결정 사항" }),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("저장 완료"),
  );
  view.unmount();
  render(<NotesPage />);
  expect(screen.getByLabelText("노트 제목")).toHaveValue("회의");
});
