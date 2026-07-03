import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Shared/UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter text...",
  },
  argTypes: {
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, value: "Disabled" },
};

export const WithLabel: Story = {
  args: {
    placeholder: "11231231",
    disabled: true,
    type: "email",
  },

  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...args} placeholder="you@example.com" />
    </div>
  ),
};
