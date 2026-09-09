import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fireEvent } from "storybook/test";
import { StayPlanner } from "./StayPlanner";
import "../experience.css";
const meta = {
  title: "Features/Landing/StayPlanner",
  component: StayPlanner,
  decorators: [
    (Story) => (
      <div className="landing-stay bg-surface text-ink w-full max-w-xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StayPlanner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "예상 숙박비 보기" }),
    );
    await expect((await canvas.findAllByRole("alert"))[0]).toBeVisible();
  },
};
export const Quote: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.change(canvas.getByLabelText("체크인"), {
      target: { value: "2099-10-01" },
    });
    fireEvent.change(canvas.getByLabelText("체크아웃"), {
      target: { value: "2099-10-03" },
    });
    await userEvent.click(
      canvas.getByRole("button", { name: "예상 숙박비 보기" }),
    );
    await expect(await canvas.findByRole("status")).toHaveTextContent(
      "₩560,000",
    );
  },
};
