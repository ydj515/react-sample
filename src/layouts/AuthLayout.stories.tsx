import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { AuthLayout } from "./AuthLayout";

const meta = {
  title: "Layouts/AuthLayout",
  component: AuthLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// children을 넘기면 Outlet 대신 해당 콘텐츠를 중앙에 배치한다.
export const Default: Story = {
  render: () => (
    <AuthLayout>
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold">로그인</h1>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button>로그인</Button>
        </div>
      </Card>
    </AuthLayout>
  ),
};
