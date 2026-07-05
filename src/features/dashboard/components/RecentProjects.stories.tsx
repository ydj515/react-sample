import type { Meta, StoryObj } from "@storybook/react-vite";

import { projectsFixture } from "@/mocks/data/projects";

import { RecentProjects } from "./RecentProjects";

const meta = {
  title: "Features/Dashboard/RecentProjects",
  component: RecentProjects,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    projects: projectsFixture,
  },
} satisfies Meta<typeof RecentProjects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { projects: [] },
};
