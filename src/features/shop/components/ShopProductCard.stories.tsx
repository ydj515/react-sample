import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { managementFixture } from "@/mocks/data/management";
import { ShopProductCard } from "./ShopProductCard";

const meta = {
  title: "Features/Shop/ProductCard",
  component: ShopProductCard,
  tags: ["autodocs"],
  decorators: [
    withRouter,
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: {
    product: managementFixture.products[0]!,
    favorite: false,
    onFavorite: fn(),
  },
} satisfies Meta<typeof ShopProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Favorite: Story = { args: { favorite: true } };
export const SoldOut: Story = {
  args: { product: managementFixture.products[2]! },
};
