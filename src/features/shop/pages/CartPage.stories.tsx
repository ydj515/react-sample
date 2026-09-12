import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { useShopStore } from "@/features/shop/store/shop-store";
import { CartPage } from "./CartPage";

const meta = {
  title: "Pages/Shop/Cart",
  component: CartPage,
  decorators: [withRouter, withManagementApi],
  loaders: [loadManagementApi],
  beforeEach: () => {
    useShopStore.setState({ items: [], favorites: [] });
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof CartPage>;
export default meta;
type Story = StoryObj<typeof meta>;
const fill = () => {
  useShopStore.setState({
    items: [
      { productId: "product-1", color: "화이트", size: "250", quantity: 1 },
    ],
    favorites: [],
  });
};
export const Empty: Story = {};
export const Filled: Story = { beforeEach: fill };
export const Checkout: Story = { beforeEach: fill, args: { checkout: true } };
