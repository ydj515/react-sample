import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  buildDashboard,
  normalizeDashboardSearch,
} from "@/features/dashboard/model/dashboard-utils";
import { dashboardAsOf, dashboardTasks } from "@/mocks/data/dashboard";
import { projectsFixture } from "@/mocks/data/projects";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { ProjectTimeline } from "./ProjectTimeline";

const meta = {
  title: "Features/Dashboard/ProjectTimeline",
  component: ProjectTimeline,
  tags: ["autodocs"],
  decorators: [withRouter],
  args: {
    model: buildDashboard(
      { asOf: dashboardAsOf, projects: projectsFixture, tasks: dashboardTasks },
      normalizeDashboardSearch({}),
    ),
  },
} satisfies Meta<typeof ProjectTimeline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const NoTasks: Story = {
  args: {
    model: buildDashboard(
      { asOf: dashboardAsOf, projects: projectsFixture, tasks: [] },
      normalizeDashboardSearch({}),
    ),
  },
};
