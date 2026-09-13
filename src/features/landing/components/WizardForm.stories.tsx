import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, within } from "storybook/test";
import { WizardForm, WIZARD_DRAFT_STORAGE_KEY } from "./WizardForm";
import "@/features/landing/pages/experience.css";

const meta = {
  title: "Features/Landing/WizardForm",
  component: WizardForm,
  decorators: [
    (Story) => (
      <div className="landing-wizard bg-surface text-ink w-full max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(WIZARD_DRAFT_STORAGE_KEY);
    }
  },
} satisfies Meta<typeof WizardForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ValidationErrorOnNext: Story = {
  name: "다음 버튼 누르면 현재 단계 검증",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    await expect(await canvas.findByText("이름을 입력하세요.")).toBeVisible();
    await expect(await canvas.findByText("이메일을 입력하세요.")).toBeVisible();
  },
};

export const AdvancesAfterFillingBasics: Story = {
  name: "기본 정보를 채우면 다음 단계로 이동",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("이름"), "샘플 의뢰자");
    await userEvent.type(canvas.getByLabelText("이메일"), "sample@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    await expect(
      await canvas.findByRole("heading", { name: "어떤 프로젝트인가요?" }),
    ).toBeVisible();
  },
};

export const ConditionalFieldsByProjectType: Story = {
  name: "프로젝트 종류에 따라 조건부 필드가 바뀜",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("이름"), "샘플");
    await userEvent.type(canvas.getByLabelText("이메일"), "sample@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    const typeSelect = await canvas.findByLabelText("프로젝트 종류");
    await userEvent.selectOptions(typeSelect, "development");
    await expect(
      await canvas.findByLabelText("사용할 기술 스택"),
    ).toBeVisible();
    await userEvent.selectOptions(typeSelect, "consulting");
    await expect(await canvas.findByLabelText("상담 주제")).toBeVisible();
    await userEvent.selectOptions(typeSelect, "design");
    await expect(
      await canvas.findByText("선호하는 디자인 스타일"),
    ).toBeVisible();
  },
};

export const DraftAutoSavedAndRestored: Story = {
  name: "초안 자동 저장과 복원",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("이름"), "초안 사용자");
    await userEvent.type(canvas.getByLabelText("이메일"), "draft@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    const raw = window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY);
    await expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    await expect(parsed.values.name).toBe("초안 사용자");
    await expect(parsed.values.email).toBe("draft@example.com");
    await expect(parsed.step).toBe("project");
  },
};

export const FlexibleTimelineRevealsNote: Story = {
  name: "유연한 일정에서 메모 필드가 나타남",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fireEvent.change(canvas.getByLabelText("이름"), {
      target: { value: "샘플" },
    });
    await fireEvent.change(canvas.getByLabelText("이메일"), {
      target: { value: "sample@example.com" },
    });
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    const timeline = await canvas.findByLabelText("희망 일정");
    await userEvent.selectOptions(timeline, "flexible");
    await expect(
      await canvas.findByLabelText("유연한 일정의 의미"),
    ).toBeVisible();
  },
};
