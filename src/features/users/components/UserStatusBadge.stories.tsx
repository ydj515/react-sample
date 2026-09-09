import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserStatusBadge } from "./UserStatusBadge";
import { userStatuses } from "@/features/users/model/user-schema";

const meta = {
  title: "Features/Users/StatusBadge",
  component: UserStatusBadge,
  tags: ["autodocs"],
  args: { status: "active" },
} satisfies Meta<typeof UserStatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const All: Story = {
  render: () => (
    <div className="flex gap-3">
      {userStatuses.map((status) => (
        <UserStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
