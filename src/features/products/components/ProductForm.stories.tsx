import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import { withRouter } from "@/shared/lib/storybook/with-router";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { managementFixture } from "@/mocks/data/management";
import { ProductForm } from "./ProductForm";

const meta = {
  title: "Features/Products/Form",
  component: ProductForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "상품 저장과 query 갱신 중에는 입력·탭·옵션 편집을 잠그고, 실패 시 초안을 보존합니다.",
      },
    },
  },
  decorators: [withRouter, withManagementApi],
  loaders: [loadManagementApi],
  args: { onSaved: fn(), onCancel: fn() },
} satisfies Meta<typeof ProductForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Create: Story = {};
export const Edit: Story = { args: { product: managementFixture.products[0] } };
