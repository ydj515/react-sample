import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it } from "vitest";
import { WIZARD_DRAFT_STORAGE_KEY, WizardForm } from "./WizardForm";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

it("다음 버튼을 누르면 현재 단계 필드만 검증한다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  expect(await screen.findByText("이름을 입력하세요.")).toBeVisible();
  expect(await screen.findByText("이메일을 입력하세요.")).toBeVisible();
});

it("기본 정보를 채우면 다음 단계의 제목이 나타난다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "샘플");
  await user.type(screen.getByLabelText("이메일"), "sample@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  expect(await screen.findByText("어떤 프로젝트인가요?")).toBeVisible();
});

it("디자인 종류에서는 선호 스타일, 개발에서는 기술 스택, 컨설팅에서는 주제가 나타난다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "샘플");
  await user.type(screen.getByLabelText("이메일"), "sample@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));

  const typeSelect = await screen.findByLabelText("프로젝트 종류");
  await user.selectOptions(typeSelect, "design");
  expect(screen.getByText("선호하는 디자인 스타일")).toBeVisible();

  await user.selectOptions(typeSelect, "development");
  expect(screen.getByLabelText("사용할 기술 스택")).toBeInTheDocument();

  await user.selectOptions(typeSelect, "consulting");
  expect(screen.getByLabelText("상담 주제")).toBeInTheDocument();
});

it("디자인을 골랐지만 스타일을 선택하지 않으면 다음 단계로 갈 수 없다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "샘플");
  await user.type(screen.getByLabelText("이메일"), "sample@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  await screen.findByLabelText("프로젝트 종류");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  expect(
    await screen.findByText("선호 스타일을 최소 1개 선택하세요."),
  ).toBeVisible();
});

it("초안을 입력하면 localStorage에 저장되고 새로 마운트하면 복원된다", async () => {
  const user = userEvent.setup();

  const view = render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "초안 사용자");
  await user.type(screen.getByLabelText("이메일"), "draft@example.com");
  await user.click(screen.getByRole("button", { name: "초안 저장" }));
  await waitFor(() => {
    const raw = window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.values.name).toBe("초안 사용자");
    expect(parsed.step).toBe("basics");
  });
  view.unmount();

  render(<WizardForm />);
  const nameInput = await screen.findByLabelText("이름");
  await waitFor(() => {
    expect(nameInput).toHaveValue("초안 사용자");
  });
  expect(screen.getByLabelText("이메일")).toHaveValue("draft@example.com");
  expect(await screen.findByText("기본 정보를 알려 주세요")).toBeVisible();
});

it("다음 단계로 이동한 뒤에도 마지막 저장된 단계가 복원된다", async () => {
  const user = userEvent.setup();

  const view = render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "이동 사용자");
  await user.type(screen.getByLabelText("이메일"), "go@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  await waitFor(() => {
    const raw = window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY);

    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.step).toBe("project");
  });
  view.unmount();

  render(<WizardForm />);
  expect(await screen.findByText("어떤 프로젝트인가요?")).toBeVisible();
});

it("유연한 일정으로 바꾸면 메모 필드가 나타나고 비우면 다음 단계가 막힌다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "샘플");
  await user.type(screen.getByLabelText("이메일"), "sample@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  const typeSelect = await screen.findByLabelText("프로젝트 종류");
  await user.selectOptions(typeSelect, "design");
  await user.click(screen.getByRole("button", { name: "미니멀" }));
  await user.click(screen.getByRole("button", { name: "다음 단계" }));

  const timeline = await screen.findByLabelText("희망 일정");
  await user.selectOptions(timeline, "flexible");
  expect(screen.getByLabelText("유연한 일정의 의미")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  expect(
    await screen.findByText("유연한 일정의 의미를 한 줄로 적어 주세요."),
  ).toBeVisible();
});

it("처음부터 다시 작성하면 localStorage의 초안도 함께 비운다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "초안");
  await user.click(screen.getByRole("button", { name: "초안 저장" }));
  expect(window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY)).not.toBeNull();
  await user.click(screen.getByRole("button", { name: "처음부터 다시 작성" }));
  expect(window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY)).toBeNull();
  expect(screen.getByLabelText("이름")).toHaveValue("");
});

it("4단계까지 완료하고 제출하면 완료 안내와 함께 초안을 비운다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "완료 사용자");
  await user.type(screen.getByLabelText("이메일"), "done@example.com");
  await user.type(screen.getByLabelText("소속 (선택)"), "React Sample");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));

  const typeSelect = await screen.findByLabelText("프로젝트 종류");
  await user.selectOptions(typeSelect, "design");
  await user.click(screen.getByRole("button", { name: "미니멀" }));
  await user.click(screen.getByRole("button", { name: "에디토리얼" }));
  await user.click(screen.getByRole("button", { name: "다음 단계" }));

  await user.type(
    screen.getByLabelText("프로젝트 설명"),
    "열 줄 이상의 메시지를 작성해서 의뢰 내용을 충분히 전달합니다.",
  );
  await user.click(screen.getByRole("button", { name: "다음 단계" }));

  expect(await screen.findByText("입력 내용 검토")).toBeVisible();
  expect(screen.getByText("완료 사용자")).toBeVisible();
  expect(screen.getByText("미니멀, 에디토리얼")).toBeVisible();

  await user.click(screen.getByRole("button", { name: "신청 내용 제출" }));

  expect(await screen.findByText("신청 내용을 받았습니다.")).toBeVisible();
  expect(window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY)).toBeNull();
});

it("완료 화면에서 새 신청 작성을 누르면 폼이 초기화된다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "재시작");
  await user.type(screen.getByLabelText("이메일"), "restart@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  const typeSelect = await screen.findByLabelText("프로젝트 종류");
  await user.selectOptions(typeSelect, "design");
  await user.click(screen.getByRole("button", { name: "미니멀" }));
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  await user.type(
    screen.getByLabelText("프로젝트 설명"),
    "열 줄 이상의 메시지를 작성해서 의뢰 내용을 충분히 전달합니다.",
  );
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  await user.click(screen.getByRole("button", { name: "신청 내용 제출" }));
  await user.click(await screen.findByRole("button", { name: "새 신청 작성" }));
  expect(screen.getByLabelText("이름")).toHaveValue("");
  expect(screen.getByLabelText("이메일")).toHaveValue("");
});

it("단계 표시기를 클릭하면 이미 방문한 단계로 이동할 수 있다", async () => {
  const user = userEvent.setup();
  render(<WizardForm />);
  await user.type(screen.getByLabelText("이름"), "탐색");
  await user.type(screen.getByLabelText("이메일"), "nav@example.com");
  await user.click(screen.getByRole("button", { name: "다음 단계" }));
  expect(await screen.findByText("어떤 프로젝트인가요?")).toBeVisible();
  await user.click(screen.getByRole("button", { name: /기본 정보/ }));
  expect(await screen.findByText("기본 정보를 알려 주세요")).toBeVisible();
});
