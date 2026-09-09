import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { orderStatuses } from "@/features/orders/model/order-schema";

const meta = {
  title: "Features/Orders/StatusBadge",
  component: OrderStatusBadge,
  tags: ["autodocs"],
  args: { status: "대기" },
} satisfies Meta<typeof OrderStatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const All: Story = {
  render: () => (
    <div className="flex gap-3">
      {orderStatuses.map((status) => (
        <OrderStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
