import type { Meta, StoryObj } from "@storybook/react-vite";
import { initialEntries } from "@/features/expenses/model/expenses";
import { ExpenseList } from "./ExpenseList";

const meta = {
  title: "Features/Expenses/List",
  component: ExpenseList,
  args: { entries: initialEntries(), disabled: false, onEdit: () => {} },
} satisfies Meta<typeof ExpenseList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { entries: [] } };

export const Disabled: Story = { args: { disabled: true } };
