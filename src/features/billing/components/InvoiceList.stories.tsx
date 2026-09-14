import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { InvoiceList } from "./InvoiceList";

const meta = {
  title: "Features/Billing/InvoiceList",
  component: InvoiceList,
  decorators: [withRouter],
  args: {
    invoices: [
      {
        id: "INV-001",
        customer: "샘플 스튜디오",
        dueDate: "2026-09-30",
        taxRate: 10,
        status: "draft",
        items: [{ description: "웹사이트 디자인", quantity: 1, price: 500000 }],
      },
      {
        id: "INV-002",
        customer: "프로젝트 랩",
        dueDate: "2026-10-15",
        taxRate: 10,
        status: "issued",
        items: [{ description: "개발", quantity: 2, price: 800000 }],
      },
      {
        id: "INV-003",
        customer: "디자인 파트너",
        dueDate: "2026-09-20",
        taxRate: 10,
        status: "paid",
        items: [{ description: "유지보수", quantity: 1, price: 300000 }],
      },
    ],
  },
} satisfies Meta<typeof InvoiceList>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};

export const Empty: Story = { args: { invoices: [] } };
