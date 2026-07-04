import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

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

// 인터랙션 테스트: 입력한 값이 반영되는지 검증한다.
export const Typing: Story = {
  args: { placeholder: "Type here" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Type here");
    await userEvent.type(input, "hello");
    await expect(input).toHaveValue("hello");
  },
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
