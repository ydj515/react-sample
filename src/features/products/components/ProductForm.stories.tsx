import { withRouter } from "@/shared/lib/storybook/with-router";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  withManagementApi,
  loadManagementApi,
} from "@/mocks/storybook/with-management-api";
import { managementFixture } from "@/mocks/data/management";
import { ProductForm } from "./ProductForm";
const meta = {
  title: "Features/Products/Form",
  component: ProductForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [withRouter, withManagementApi],
  loaders: [loadManagementApi],
  args: { onSaved: fn(), onCancel: fn() },
} satisfies Meta<typeof ProductForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Create: Story = {};
export const Edit: Story = { args: { product: managementFixture.products[0] } };
