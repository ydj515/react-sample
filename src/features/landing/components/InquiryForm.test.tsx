import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { InquiryForm } from "./InquiryForm";

it("필수 입력을 검증하고 입력 내용의 외부 전송 없이 데모 결과를 표시한다", async () => {
  const user = userEvent.setup();
  render(<InquiryForm context="브랜딩 프로젝트" />);
  await user.click(screen.getByRole("button", { name: "데모 제출" }));
  expect(await screen.findByText("이름을 입력하세요.")).toBeVisible();
  await user.type(screen.getByRole("textbox", { name: "이름" }), "Sample");
  await user.type(
    screen.getByRole("textbox", { name: "이메일" }),
    "sample@example.com",
  );
  await user.click(screen.getByRole("button", { name: "데모 제출" }));
  expect(await screen.findByRole("status")).toHaveTextContent(
    "브랜딩 프로젝트 체험을 완료했습니다.",
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "외부로 전송하지 않았습니다",
  );
  await user.click(screen.getByRole("button", { name: "다시 작성" }));
  expect(screen.getByRole("textbox", { name: "이름" })).toHaveValue("");
});
