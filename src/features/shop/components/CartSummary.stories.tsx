import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartSummary } from "./CartSummary";

const meta = {
  title: "Features/Shop/CartSummary",
  component: CartSummary,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: { subtotal: 189000, shipping: 0, total: 189000 },
} satisfies Meta<typeof CartSummary>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FreeShipping: Story = {};
export const ShippingFee: Story = {
  args: { subtotal: 49000, shipping: 3000, total: 52000 },
};
