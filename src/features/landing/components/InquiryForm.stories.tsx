import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { InquiryForm } from "./InquiryForm";
const meta = {
  title: "Features/Landing/InquiryForm",
  component: InquiryForm,
  args: { context: "프로젝트 문의" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InquiryForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "데모 제출" }));
    await expect(await canvas.findByText("이름을 입력하세요.")).toBeVisible();
  },
};
export const Complete: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "이름" }), "샘플");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "이메일" }),
      "sample@example.com",
    );
    await userEvent.click(canvas.getByRole("button", { name: "데모 제출" }));
    await expect(await canvas.findByRole("status")).toHaveTextContent(
      "체험을 완료했습니다",
    );
  },
};
