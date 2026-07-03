import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./card";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Shared/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="size-12 rounded-full" />,
};

// 카드 로딩 상태를 표현한 조합 예시.
export const CardPlaceholder: Story = {
  render: () => (
    <Card className="flex w-80 flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </Card>
  ),
};
