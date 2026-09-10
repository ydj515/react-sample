import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ProductImageField } from "./ProductImageField";

const meta = {
  title: "Features/Products/ImageField",
  component: ProductImageField,
  tags: ["autodocs"],
  args: {
    image: "/product-images/shoes.svg",
    imageError: null,
    imageLoading: false,
    upload: fn(),
    select: fn(),
  },
} satisfies Meta<typeof ProductImageField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Reading: Story = { args: { imageLoading: true } };
export const InvalidFile: Story = {
  args: { imageError: "PNG, JPEG, WebP 이미지만 업로드할 수 있습니다." },
};
export const InvalidValue: Story = {
  args: { validationError: "기본 이미지 또는 업로드한 이미지를 선택하세요." },
};
