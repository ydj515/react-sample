import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { ProductDetails } from "./ProductDetails";
import "@/features/landing/pages/experience.css";

const meta = {
  title: "Features/Landing/ProductDetails",
  component: ProductDetails,
  decorators: [
    (Story) => (
      <div className="landing-product max-w-6xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductDetails>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Design: Story = {};
export const Controls: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "컨트롤" }),
    );
  },
};
