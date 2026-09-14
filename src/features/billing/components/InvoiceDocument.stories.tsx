import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvoiceDocument } from "./InvoiceDocument";

const meta = {
  title: "Features/Billing/InvoiceDocument",
  component: InvoiceDocument,
  args: {
    invoice: {
      id: "INV-DEMO-001",
      customer: "샘플 스튜디오",
      dueDate: "2026-09-30",
      taxRate: 10,
      status: "draft",
      items: [{ description: "웹사이트 디자인", quantity: 1, price: 500000 }],
    },
  },
} satisfies Meta<typeof InvoiceDocument>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Draft: Story = {};

export const Paid: Story = {
  args: { invoice: { ...meta.args.invoice, status: "paid" } },
};
