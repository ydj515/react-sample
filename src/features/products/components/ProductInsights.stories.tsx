import type { Meta, StoryObj } from "@storybook/react-vite";
import { managementFixture } from "@/mocks/data/management";
import { ProductInsights } from "./ProductInsights";

const meta = {
  title: "Features/Products/Insights",
  component: ProductInsights,
  tags: ["autodocs"],
  args: { product: managementFixture.products[0], view: "sales" },
} satisfies Meta<typeof ProductInsights>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Sales: Story = {};
export const Reviews: Story = { args: { view: "reviews" } };
export const Empty: Story = { args: { product: undefined } };
