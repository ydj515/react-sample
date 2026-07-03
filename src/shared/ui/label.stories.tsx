import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Shared/UI/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Label",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 실제 폼에서 Input과 함께 쓰이는 형태.
export const WithInput: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="your handle" />
    </div>
  ),
};
