import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductImage } from "./ProductImage";
import { productImages, productCategories } from "../model/product-schema";
const meta = {
  title: "Features/Products/Image",
  component: ProductImage,
  tags: ["autodocs"],
  args: {
    src: productImages[0],
    name: "신발 예시",
    className: "w-48 rounded-panel",
  },
} satisfies Meta<typeof ProductImage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const All: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {productImages.map((src, index) => (
        <ProductImage
          key={src}
          src={src}
          name={productCategories[index]!}
          className="rounded-panel w-40"
        />
      ))}
    </div>
  ),
};
