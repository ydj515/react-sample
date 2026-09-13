import type { Meta, StoryObj } from "@storybook/react-vite";

import type { Notification } from "@/features/notifications/model/notification-schema";
import { NotificationItem } from "./NotificationItem";

const sample: Notification = {
  id: "ntf-story",
  category: "order",
  severity: "warning",
  title: "주문 #2047 배송이 지연되고 있습니다",
  body: "CJ대한통운 010-1234-5678 운송장이 48시간 동안 업데이트되지 않았습니다.",
  createdAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  read: false,
  actor: { id: "user-1", name: "김민준" },
  link: { to: "/orders/%232047", label: "주문 상세 열기" },
};

const meta = {
  title: "Features/Notifications/Item",
  component: NotificationItem,
  args: {
    notification: sample,
    onMarkRead: () => undefined,
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unread: Story = {};

export const Read: Story = {
  args: {
    notification: { ...sample, read: true },
  },
};

export const WithoutActions: Story = {
  args: {
    notification: {
      ...sample,
      actor: null,
      link: null,
    },
  },
};

export const StableReadStates: Story = {
  render: (args) => (
    <ul className="max-w-2xl">
      <NotificationItem {...args} notification={{ ...sample, id: "unread" }} />
      <NotificationItem
        {...args}
        notification={{ ...sample, id: "read", read: true }}
      />
    </ul>
  ),
};

export const Compact: Story = {
  args: { variant: "compact" },
};
