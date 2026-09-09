import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import { ProductInventory } from "./ProductInventory";

const meta = {
  title: "Features/Products/Inventory",
  component: ProductInventory,
  tags: ["autodocs"],
  args: {
    variants: managementFixture.products[0]!.variants,
    stock: 42,
    onChange: fn(),
  },
} satisfies Meta<typeof ProductInventory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function InventoryDemo(args) {
    const [variants, setVariants] = useState(args.variants);
    return (
      <ProductInventory {...args} variants={variants} onChange={setVariants} />
    );
  },
};
export const Empty: Story = { ...Default, args: { variants: [] } };
