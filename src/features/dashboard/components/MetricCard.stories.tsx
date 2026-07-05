import type { Meta, StoryObj } from "@storybook/react-vite";

import { MetricCard } from "./MetricCard";

const meta = {
  title: "Features/Dashboard/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  args: {
    label: "전체 프로젝트",
    value: 12,
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StringValue: Story = {
  args: { label: "진행률", value: "68%" },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard label="전체 프로젝트" value={12} />
      <MetricCard label="진행 중" value={5} />
      <MetricCard label="일시 중지" value={3} />
      <MetricCard label="완료" value={4} />
    </div>
  ),
};
