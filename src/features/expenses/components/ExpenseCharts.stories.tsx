import type { Meta, StoryObj } from "@storybook/react-vite";
import { initialEntries } from "@/features/expenses/model/expenses";
import { ExpenseCharts } from "./ExpenseCharts";

const meta = {
  title: "Features/Expenses/Charts",
  component: ExpenseCharts,
  args: { entries: initialEntries() },
} satisfies Meta<typeof ExpenseCharts>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Empty: Story = { args: { entries: [] } };
