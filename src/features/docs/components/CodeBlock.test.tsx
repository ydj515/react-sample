import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";

it("표시한 코드 원문을 복사하고 결과를 알린다", async () => {
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  render(<CodeBlock code={'const value = "sample";'} language="tsx" />);
  await user.click(screen.getByRole("button", { name: "코드 복사" }));
  expect(write).toHaveBeenCalledWith('const value = "sample";');
  expect(screen.getByRole("status")).toHaveTextContent("복사했습니다.");
  write.mockRestore();
});

it("복사 실패 시 코드를 유지하고 직접 복사를 안내한다", async () => {
  const user = userEvent.setup();
  const write = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockRejectedValue(new Error("denied"));
  render(<CodeBlock code="pnpm dev" language="bash" />);
  await user.click(screen.getByRole("button", { name: "코드 복사" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "코드를 선택해 직접 복사하세요.",
  );
  expect(screen.getByText("pnpm dev")).toBeInTheDocument();
  write.mockRestore();
});
