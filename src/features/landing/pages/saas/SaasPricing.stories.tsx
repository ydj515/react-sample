import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SaasPricing } from "./SaasPricing";
const meta = {
  title: "Features/Landing/SaasPricing",
  component: SaasPricing,
  decorators: [
    (Story) => (
      <div className="max-w-6xl p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SaasPricing>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Monthly: Story = {};
export const Yearly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "연간 · 20% 할인" }),
    );
    await expect(canvas.getByText("연간 합계 ₩374,400")).toBeVisible();
  },
};
