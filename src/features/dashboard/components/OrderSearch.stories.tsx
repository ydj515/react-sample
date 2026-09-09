import type { Meta, StoryObj } from "@storybook/react-vite";
import { commerceFixture } from "@/mocks/data/commerce";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { OrderSearch } from "./OrderSearch";

const meta = {
  title: "Features/Dashboard/OrderSearch",
  component: OrderSearch,
  decorators: [withRouter],
  tags: ["autodocs"],
  args: { orders: commerceFixture.orders, asOf: commerceFixture.asOf },
} satisfies Meta<typeof OrderSearch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { orders: [] } };
