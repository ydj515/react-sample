import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { managementFixture } from "@/mocks/data/management";
import type { ProductInput } from "@/features/products/model/product-schema";
import { ProductBasicFields } from "./ProductBasicFields";

function FieldsExample({ variants }: { variants: boolean }) {
  const product = managementFixture.products[0]!;
  const form = useForm<ProductInput>({
    defaultValues: { ...product, variants: variants ? product.variants : [] },
  });
  return <ProductBasicFields form={form} />;
}
const meta = {
  title: "Features/Products/BasicFields",
  component: FieldsExample,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { variants: false },
} satisfies Meta<typeof FieldsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SimpleStock: Story = {};
export const VariantStock: Story = { args: { variants: true } };
