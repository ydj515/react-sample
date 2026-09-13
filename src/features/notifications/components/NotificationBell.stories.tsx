import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { NotificationBell } from "./NotificationBell";

const meta = {
  title: "Features/Notifications/Bell",
  component: NotificationBell,
  args: {
    unreadCount: 0,
    onClick: () => undefined,
  },
} satisfies Meta<typeof NotificationBell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { unreadCount: 0 },
};

export const FewUnread: Story = {
  args: { unreadCount: 3 },
};

export const ManyUnread: Story = {
  args: { unreadCount: 128 },
};

function OpenDemo() {
  const [open, setOpen] = useState(true);
  return (
    <NotificationBell
      unreadCount={3}
      open={open}
      onClick={() => setOpen((value) => !value)}
    />
  );
}

export const Open: Story = {
  render: () => <OpenDemo />,
};
