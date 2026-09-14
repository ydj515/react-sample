import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvoiceForm } from "./InvoiceForm";

const meta = {
  title: "Features/Billing/InvoiceForm",
  component: InvoiceForm,
  args: { onSave: () => {}, onCancel: () => {} },
} satisfies Meta<typeof InvoiceForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const NewInvoice: Story = {};
