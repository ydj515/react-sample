import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ChatPage } from "./ChatPage";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

it("marks the initially visible conversation as read in a focused tab", async () => {
  vi.spyOn(document, "hasFocus").mockReturnValue(true);
  render(<ChatPage />);
  await waitFor(() =>
    expect(
      localStorage.getItem("react-sample-chat-v1:read:mina"),
    ).not.toBeNull(),
  );
});

it("protects unreadable saved messages by blocking sends", () => {
  localStorage.setItem("react-sample-chat-v1:message:broken", "{");
  render(<ChatPage />);
  expect(screen.getByRole("alert")).toHaveTextContent("원본 보호");
  expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
  expect(localStorage.getItem("react-sample-chat-v1:message:broken")).toBe("{");
});

it("loads history and retries an optimistic message without duplicates", async () => {
  const user = userEvent.setup();
  render(<ChatPage />);
  await user.click(screen.getByRole("button", { name: "이전 메시지 더 보기" }));
  expect(screen.getByText(/^21번째 프로젝트/)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "데모 설정" }));
  await user.click(screen.getByLabelText("다음 전송 실패 체험"));
  await user.click(screen.getByRole("button", { name: "설정 완료" }));
  await user.type(screen.getByLabelText("메시지"), "다시 보낼 대화");
  await user.click(screen.getByRole("button", { name: "전송" }));
  expect(screen.getByText("전송 중")).toBeVisible();
  await user.click(await screen.findByRole("button", { name: "전송 재시도" }));
  await waitFor(() =>
    expect(screen.queryByText("전송 중")).not.toBeInTheDocument(),
  );
  expect(screen.queryByText("전송 실패")).not.toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "메시지 기록" })).getAllByText(
      "다시 보낼 대화",
    ),
  ).toHaveLength(1);
});
