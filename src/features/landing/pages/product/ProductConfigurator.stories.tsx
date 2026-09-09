import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ProductConfigurator } from "./ProductConfigurator";
import "@/features/landing/pages/experience.css";

const meta = {
  title: "Features/Landing/ProductConfigurator",
  component: ProductConfigurator,
  decorators: [
    (Story) => (
      <div className="landing-product w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductConfigurator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Solo: Story = {};
export const StudioBundle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Studio set" }));
    await userEvent.selectOptions(
      canvas.getByRole("combobox", { name: "수량" }),
      "2",
    );
    await expect(canvas.getByRole("status")).toHaveTextContent("₩578,000");
  },
};
