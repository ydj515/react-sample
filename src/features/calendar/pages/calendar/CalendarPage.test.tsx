import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { CalendarPage } from "./CalendarPage";
import { seoulToday } from "@/features/calendar/model/calendar";

beforeEach(() => localStorage.clear());

it("starts weeks on Sunday and highlights today independently of the selected date", async () => {
  const user = userEvent.setup();
  render(<CalendarPage />);
  expect(
    screen.getAllByTestId("calendar-weekday").map((day) => day.textContent),
  ).toEqual(["일", "월", "화", "수", "목", "금", "토"]);
  expect(
    screen.getByRole("button", { name: `${seoulToday()} 09:00 일정 추가` }),
  ).toHaveAttribute("aria-current", "date");
  await user.click(screen.getByRole("button", { name: "다음 기간" }));
  await user.click(screen.getByRole("button", { name: "오늘" }));
  expect(screen.getByLabelText("기준 날짜")).toHaveValue(seoulToday());
  await user.click(screen.getByRole("button", { name: "주" }));
  expect(
    screen
      .getAllByTestId("calendar-weekday")
      .find((day) => day.getAttribute("aria-current") === "date"),
  ).toHaveTextContent(seoulToday().slice(5));
});

it("preserves the original event when a new event conflicts", async () => {
  const user = userEvent.setup();

  const original = [
    {
      id: "existing",
      title: "원래 일정",
      start: "2026-09-14T09:00",
      end: "2026-09-14T10:00",
      description: "",
    },
  ];
  localStorage.setItem("react-sample-calendar-v1", JSON.stringify(original));
  render(<CalendarPage />);
  fireEvent.change(screen.getByLabelText("기준 날짜"), {
    target: { value: "2026-09-14" },
  });
  await user.click(screen.getByRole("button", { name: "일정 추가" }));
  await user.type(screen.getByLabelText("일정 제목"), "겹치는 일정");
  await user.click(screen.getByRole("button", { name: "일정 저장" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "시간이 겹치는 일정: 원래 일정",
  );
  expect(JSON.parse(localStorage.getItem("react-sample-calendar-v1")!)).toEqual(
    original,
  );
});

it("blocks creation when saved data is corrupt", () => {
  localStorage.setItem("react-sample-calendar-v1", "{");
  render(<CalendarPage />);
  expect(screen.getByRole("button", { name: "일정 추가" })).toBeDisabled();
  expect(localStorage.getItem("react-sample-calendar-v1")).toBe("{");
});

it("creates, edits and deletes an event and changes views", async () => {
  const user = userEvent.setup();
  render(<CalendarPage />);
  await user.click(screen.getByRole("button", { name: "일정 추가" }));
  await user.type(screen.getByLabelText("일정 제목"), "테스트 약속");
  await user.click(screen.getByRole("button", { name: "일정 저장" }));
  await user.click(
    screen.getAllByRole("button", { name: /테스트 약속 수정/ })[0]!,
  );
  await user.type(screen.getByLabelText("일정 제목"), " 변경");
  await user.click(screen.getByRole("button", { name: "일정 저장" }));
  await user.click(screen.getByRole("button", { name: "주" }));
  await user.click(screen.getByRole("button", { name: "일" }));
  await user.click(
    screen.getAllByRole("button", { name: /테스트 약속 변경 수정/ })[0]!,
  );
  await user.click(screen.getByRole("button", { name: "일정 삭제" }));
  expect(
    screen.queryByRole("button", { name: /테스트 약속 변경 수정/ }),
  ).not.toBeInTheDocument();
});
