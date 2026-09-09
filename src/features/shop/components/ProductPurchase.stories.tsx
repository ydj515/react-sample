import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { managementFixture } from "@/mocks/data/management";
import { useShopStore } from "@/stores/shop-store";
import { ProductPurchase } from "./ProductPurchase";

const meta = {
  title: "Features/Shop/ProductPurchase",
  component: ProductPurchase,
  decorators: [
    withRouter,
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useShopStore.setState({ items: [], favorites: [] });
  },
  args: { product: managementFixture.products[0]! },
} satisfies Meta<typeof ProductPurchase>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SelectOptions: Story = {};
export const Added: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(
      canvas.getByRole("combobox", { name: "사이즈" }),
      "250",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "장바구니 담기" }),
    );
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "장바구니에 담았습니다.",
    );
  },
};
export const SoldOut: Story = {
  args: { product: managementFixture.products[2]! },
};
