import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProjectStatusBadge } from "./ProjectStatusBadge";

const meta = {
  title: "Features/Projects/ProjectStatusBadge",
  component: ProjectStatusBadge,
  tags: ["autodocs"],
  args: { status: "active" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["active", "paused", "completed"],
    },
  },
} satisfies Meta<typeof ProjectStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { status: "active" } };
export const Paused: Story = { args: { status: "paused" } };
export const Completed: Story = { args: { status: "completed" } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ProjectStatusBadge status="active" />
      <ProjectStatusBadge status="paused" />
      <ProjectStatusBadge status="completed" />
    </div>
  ),
};
