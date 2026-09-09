import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

it("숫자 페이지 이동과 조회 범위, 현재 페이지를 표시한다", async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<Pagination page={2} pages={3} total={23} onChange={onChange} />);
  expect(screen.getByText("9–16 / 23건")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "2페이지" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await user.click(screen.getByRole("button", { name: "3페이지" }));
  expect(onChange).toHaveBeenLastCalledWith(3);
  await user.click(screen.getByRole("button", { name: "이전 페이지" }));
  expect(onChange).toHaveBeenLastCalledWith(1);
});
it("페이지가 많아도 숫자 버튼 수를 제한하고 마지막 페이지로 이동한다", async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<Pagination page={99} pages={100} total={800} onChange={onChange} />);
  expect(screen.getAllByRole("button")).toHaveLength(7);
  await user.click(screen.getByRole("button", { name: "다음 페이지" }));
  expect(onChange).toHaveBeenCalledWith(100);
});
it("빈 목록에서도 0건과 비활성화된 이동 버튼을 표시한다", () => {
  render(<Pagination page={1} pages={1} total={0} onChange={vi.fn()} />);
  expect(screen.getByText("0–0 / 0건")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
});
