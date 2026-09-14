import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpenseFilters } from "./ExpenseFilters";

const meta = {
  title: "Features/Expenses/Filters",
  component: ExpenseFilters,
  args: {
    filter: { month: "2026-09", type: "all", category: "all", query: "" },
    onChange: () => {},
  },
} satisfies Meta<typeof ExpenseFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Income: Story = {
  args: {
    filter: { month: "2026-09", type: "income", category: "급여", query: "" },
  },
};
