import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageList } from "./MessageList";

const meta = {
  title: "Features/Chat/Messages",
  component: MessageList,
  decorators: [
    (Story) => (
      <div className="flex h-[500px] flex-col">
        <Story />
      </div>
    ),
  ],
  args: {
    author: "mina",
    receipts: { mina: null, jun: "2026-09-14T09:10:00.000Z" },
    messages: [
      {
        id: "one",
        author: "jun",
        text: "새 화면 검토 부탁드려요.",
        sentAt: "2026-09-14T09:00:00.000Z",
      },
      {
        id: "two",
        author: "mina",
        text: "확인했습니다.",
        sentAt: "2026-09-14T09:01:00.000Z",
      },
    ],
    pending: [],
    hasMore: false,
    onMore: () => false,
    onRead: () => {},
    onRetry: () => {},
  },
} satisfies Meta<typeof MessageList>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Read: Story = {};

export const Failed: Story = {
  args: {
    pending: [
      {
        id: "failed",
        author: "mina",
        text: "재시도할 메시지",
        sentAt: "2026-09-14T09:02:00.000Z",
        status: "failed",
      },
    ],
  },
};

export const Sending: Story = {
  args: {
    pending: [
      {
        id: "sending",
        author: "mina",
        text: "전송 중인 메시지",
        sentAt: "2026-09-14T09:02:00.000Z",
        status: "sending",
      },
    ],
  },
};
