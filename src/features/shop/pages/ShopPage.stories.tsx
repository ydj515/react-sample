import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { useShopStore } from "@/stores/shop-store";
import { ShopPage } from "./ShopPage";

const meta = {
  title: "Pages/Shop/Catalog",
  component: ShopPage,
  decorators: [withRouter, withManagementApi],
  loaders: [loadManagementApi],
  beforeEach: () => {
    useShopStore.setState({ items: [], favorites: [] });
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ShopPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mobile: Story = {
  parameters: {
    viewport: {
      options: {
        shopMobile: {
          name: "Shop mobile",
          styles: { width: "390px", height: "844px" },
        },
      },
    },
  },
  globals: { viewport: { value: "shopMobile", isRotated: false } },
};
