import type { Meta, StoryObj } from "@storybook/react-vite";
import { DealPipeline } from "./DealPipeline";

const meta = {
  title: "Features/CRM/DealPipeline",
  component: DealPipeline,
  args: { deals: [], contacts: [], pending: false, onMove: () => {} },
} satisfies Meta<typeof DealPipeline>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};

export const WithDeals: Story = {
  args: {
    deals: [
      {
        id: "1",
        title: "브랜드 개편",
        amount: 1000000,
        contactId: "1",
        stage: "proposal",
      },
    ],
  },
};
