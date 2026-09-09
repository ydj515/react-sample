import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Pagination } from "./pagination";

const meta = {
  title: "Shared/UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { page: 1, pages: 3, total: 23, onChange: fn() },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function PaginationDemo(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
};
export const Empty: Story = { args: { total: 0, pages: 1 } };

export const ManyPages: Story = {
  ...Default,
  args: { page: 50, pages: 100, total: 800 },
};
export const Mobile: Story = {
  ...Default,
  decorators: [
    (Story) => (
      <div className="max-w-[288px]">
        <Story />
      </div>
    ),
  ],
};
