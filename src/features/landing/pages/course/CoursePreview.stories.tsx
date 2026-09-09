import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CoursePreview } from "./CoursePreview";

const meta = {
  title: "Features/Landing/CoursePreview",
  component: CoursePreview,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CoursePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "강의 미리보기 열기" }),
    );
    await expect(
      await within(canvasElement.ownerDocument.body).findByRole("dialog"),
    ).toBeVisible();
  },
};
