import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import { ProductPreviewDialog } from "./ProductPreviewDialog";

const meta = {
  title: "Features/Products/PreviewDialog",
  component: ProductPreviewDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: fn(),
    values: managementFixture.products[0]!,
  },
} satisfies Meta<typeof ProductPreviewDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Product: Story = {};
export const EmptyContent: Story = {
  args: {
    values: {
      ...managementFixture.products[0]!,
      name: "",
      description: "",
      price: 0,
    },
  },
};
