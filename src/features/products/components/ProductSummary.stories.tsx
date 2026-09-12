import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { ProductSummary } from "./ProductSummary";

const product = managementFixture.products[0]!;
const meta = {
  title: "Features/Products/Summary",
  component: ProductSummary,
  tags: ["autodocs"],
  decorators: [withRouter, withManagementApi],
  loaders: [loadManagementApi],
  args: {
    product,
    stock: product.stock,
    variants: product.variants,
    onManageStock: fn(),
  },
} satisfies Meta<typeof ProductSummary>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ExistingProduct: Story = {};
export const NewProduct: Story = {
  args: { product: undefined, stock: 0, variants: [] },
};
export const StockLevels: Story = {
  args: {
    stock: 14,
    variants: [
      { color: "화이트", size: "250", stock: 0 },
      { color: "화이트", size: "260", stock: 4 },
      { color: "화이트", size: "270", stock: 10 },
    ],
  },
};

export const DelimitedOptions: Story = {
  args: {
    stock: 8,
    variants: [
      { color: "A-B", size: "C", stock: 4 },
      { color: "A", size: "B-C", stock: 4 },
    ],
  },
};
