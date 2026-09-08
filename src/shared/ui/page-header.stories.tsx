import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { PageHeader } from "./page-header";

const meta = {
  title: "Shared/UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "종합 대시보드",
    description: "매출과 주요 운영 현황을 한눈에 확인하세요.",
  },
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="secondary">내보내기</Button>
        <Button>새 보고서</Button>
      </>
    ),
  },
};
