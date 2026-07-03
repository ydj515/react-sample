import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";

const meta = {
  title: "Shared/UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80 p-6">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        기본 카드 컨테이너입니다. 내부 콘텐츠는 자유롭게 구성합니다.
      </p>
    </Card>
  ),
};

// 실제 대시보드에서 쓰일 법한 조합 예시.
export const ProjectSummary: Story = {
  render: () => (
    <Card className="w-80 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            Acme Redesign
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            12 tasks remaining
          </p>
        </div>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost">
          Archive
        </Button>
      </div>
    </Card>
  ),
};
