import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { ExpensesPage } from "./ExpensesPage";

beforeEach(() => localStorage.clear());

it("adds, filters and edits entries with matching totals", async () => {
  const user = userEvent.setup();

  const view = render(<ExpensesPage />);
  await user.click(screen.getByRole("button", { name: "내역 추가" }));
  await user.click(screen.getByRole("button", { name: "내역 저장" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await user.clear(screen.getByLabelText("금액 (원)"));
  await user.type(screen.getByLabelText("금액 (원)"), "12000");
  await user.type(screen.getByLabelText("메모"), "테스트 점심");
  await user.click(screen.getByRole("button", { name: "내역 저장" }));
  await user.type(screen.getByLabelText("내역 검색"), "테스트 점심");
  expect(screen.getByText("거래 내역 1건")).toBeVisible();
  expect(
    within(screen.getByRole("region", { name: "카테고리별 지출" })).getByRole(
      "progressbar",
    ),
  ).toHaveAttribute("value", "12000");
  await user.click(screen.getByRole("button", { name: "테스트 점심 수정" }));
  await user.selectOptions(screen.getByLabelText("수입 / 지출"), "income");
  expect(screen.getByLabelText("거래 카테고리")).toHaveValue("급여");
  await user.click(screen.getByRole("button", { name: "내역 저장" }));
  await user.selectOptions(screen.getByLabelText("유형 필터"), "expense");
  await user.selectOptions(screen.getByLabelText("카테고리 필터"), "여가");
  expect(screen.getByText(/조건에 맞는 내역이 없습니다/)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "전체 내역 보기" }));
  expect(screen.getByText("거래 내역 5건")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "내역 추가" }));
  await user.click(screen.getByRole("button", { name: "취소" }));
  view.unmount();
  render(<ExpensesPage />);
  expect(screen.getByText("테스트 점심")).toBeVisible();
});
