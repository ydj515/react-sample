import type { Meta, StoryObj } from "@storybook/react-vite";
import { commerceFixture } from "@/mocks/data/commerce";
import {
  MonthlyRevenue,
  VisitorTrend,
  CategoryRevenue,
} from "./CommerceCharts";
const meta = {
  title: "Features/Dashboard/CommerceCharts",
  component: MonthlyRevenue,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
  args: { data: commerceFixture.monthly },
} satisfies Meta<typeof MonthlyRevenue>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Monthly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "막대 호버, Tab 포커스 또는 터치로 월별 금액을 조회합니다. Escape로 툴팁을 닫을 수 있습니다.",
      },
    },
  },
};
export const ZeroRevenue: Story = {
  args: {
    data: commerceFixture.monthly.map((item) => ({ ...item, amount: 0 })),
  },
};
export const Visitors: Story = {
  render: () => <VisitorTrend data={commerceFixture.traffic} />,
};
export const Categories: Story = {
  render: () => <CategoryRevenue data={commerceFixture.categories} />,
};
export const EmptyCategories: Story = {
  render: () => <CategoryRevenue data={[]} />,
};
