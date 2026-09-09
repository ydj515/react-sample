import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { AgencyWork } from "./AgencyWork";

const meta = {
  title: "Features/Landing/AgencyWork",
  component: AgencyWork,
  decorators: [
    (Story) => (
      <div className="max-w-5xl p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgencyWork>;
export default meta;
type Story = StoryObj<typeof meta>;
export const All: Story = {};
export const Branding: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "브랜딩" }));
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "1개의 콘셉트 프로젝트",
    );
  },
};
