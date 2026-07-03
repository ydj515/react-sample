import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { Select } from "./select";

const meta = {
  title: "Shared/UI/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args} className="w-56">
      <option value="active">Active</option>
      <option value="paused">Paused</option>
      <option value="archived">Archived</option>
    </Select>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Select {...args} className="w-56">
      <option>Unavailable</option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-1.5">
      <Label htmlFor="status">Status</Label>
      <Select id="status">
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="archived">Archived</option>
      </Select>
    </div>
  ),
};
