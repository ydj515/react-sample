import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { SurveysPage } from "./SurveysPage";

beforeEach(() => localStorage.clear());

it("collects validated answers and closes collection", async () => {
  const user = userEvent.setup();

  const view = render(<SurveysPage />);
  await user.click(screen.getByRole("button", { name: "응답 작성" }));
  await user.click(screen.getByRole("button", { name: "응답 제출" }));
  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  await user.click(screen.getByRole("radio", { name: "노트" }));
  await user.click(screen.getByRole("radio", { name: "5" }));
  await user.type(screen.getByLabelText("개선할 점을 알려주세요."), "좋아요");
  await user.click(screen.getByRole("button", { name: "응답 제출" }));
  expect(await screen.findByText("수집된 응답 1개")).toBeVisible();
  expect(screen.getByText("응답 1개 · 평균 5.0 / 5점")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "수집 마감" }));
  expect(
    screen.queryByRole("button", { name: "응답 작성" }),
  ).not.toBeInTheDocument();
  view.unmount();
  render(<SurveysPage />);
  expect(screen.getByText("좋아요")).toBeVisible();
});

it("builds, reorders, edits and publishes a survey", async () => {
  const user = userEvent.setup();
  render(<SurveysPage />);
  await user.click(screen.getByRole("button", { name: "새 설문" }));
  await user.click(screen.getByRole("button", { name: "초안 저장" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await user.type(screen.getByLabelText("설문 제목"), "팀 설문");
  await user.type(screen.getByLabelText("질문 1 제목"), "선택 질문");
  await user.click(screen.getByRole("button", { name: "질문 추가" }));
  await user.type(screen.getByLabelText("질문 2 제목"), "의견");
  await user.selectOptions(screen.getByLabelText("질문 2 유형"), "text");
  await user.click(screen.getByRole("button", { name: "질문 2 위로" }));
  expect(screen.getByLabelText("질문 1 제목")).toHaveValue("의견");
  await user.click(screen.getByRole("button", { name: "질문 1 아래로" }));
  await user.click(screen.getByRole("button", { name: "질문 2 제거" }));
  await user.click(screen.getByRole("button", { name: "초안 저장" }));
  await user.click(await screen.findByRole("button", { name: "질문 편집" }));
  await user.type(screen.getByLabelText("설문 설명"), "설명");
  await user.click(screen.getByRole("button", { name: "초안 저장" }));
  await user.click(await screen.findByRole("button", { name: "설문 발행" }));
  expect(
    screen.queryByRole("button", { name: "질문 편집" }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "결과 보기" }));
  await user.selectOptions(
    screen.getByLabelText("설문 목록"),
    "survey-welcome",
  );
  await user.click(screen.getByRole("button", { name: "새 설문" }));
  await user.click(screen.getByRole("button", { name: "취소" }));
  expect(
    screen.getByRole("heading", { name: "워크스페이스 만족도" }),
  ).toBeVisible();
});
