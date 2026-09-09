import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { LandingFaq } from "./LandingFaq";

const meta = {
  title: "Features/Landing/FAQ",
  component: LandingFaq,
  args: {
    items: [
      {
        question: "실제로 신청되나요?",
        answer:
          "입력 검증과 완료 안내를 체험하는 샘플입니다. 실제 신청은 생성하지 않습니다.",
      },
      {
        question: "다른 샘플도 볼 수 있나요?",
        answer:
          "헤더의 브랜드 링크나 푸터에서 전체 랜딩 컬렉션으로 이동하세요.",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingFaq>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByText("실제로 신청되나요?"),
    );
  },
};
