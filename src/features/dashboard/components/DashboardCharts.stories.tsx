import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  buildDashboard,
  normalizeDashboardSearch,
} from "@/features/dashboard/model/dashboard-utils";
import { dashboardAsOf, dashboardTasks } from "@/mocks/data/dashboard";
import { projectsFixture } from "@/mocks/data/projects";
import { ChartPanel, TrendChart } from "./DashboardCharts";

const model = buildDashboard(
  { asOf: dashboardAsOf, projects: projectsFixture, tasks: dashboardTasks },
  normalizeDashboardSearch({}),
);
const meta = {
  title: "Features/Dashboard/TrendChart",
  component: TrendChart,
  tags: ["autodocs"],
  args: { model, metric: "completed" },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <ChartPanel
          title="완료 작업 추이"
          description="고정 기준일의 샘플 데이터 · 데이터 표로 정확한 값을 확인할 수 있습니다."
        >
          <Story />
        </ChartPanel>
      </div>
    ),
  ],
} satisfies Meta<typeof TrendChart>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hours: Story = { args: { metric: "hours" } };
export const Empty: Story = {
  args: {
    model: buildDashboard(
      { asOf: dashboardAsOf, projects: [], tasks: [] },
      normalizeDashboardSearch({ days: 7 }),
    ),
  },
};
