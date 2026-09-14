import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  initialEntries,
  summarizeExpenses,
} from "@/features/expenses/model/expenses";
import { ExpenseSummary } from "./ExpenseSummary";

const meta = {
  title: "Features/Expenses/Summary",
  component: ExpenseSummary,
  args: { summary: summarizeExpenses(initialEntries()) },
} satisfies Meta<typeof ExpenseSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { summary: summarizeExpenses([]) } };
