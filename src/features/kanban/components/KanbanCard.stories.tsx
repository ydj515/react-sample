import type { Meta, StoryObj } from "@storybook/react-vite";

import type { KanbanCard } from "@/features/kanban/model/kanban-schema";
import { KanbanCardView } from "./KanbanCard";
import { KanbanDropIndicator } from "./KanbanDropIndicator";

const sample: KanbanCard = {
  id: "card-1",
  columnId: "backlog",
  order: 0,
  title: "결제 실패 토스트 개선",
  description: "재시도 버튼과 함께 어떤 단계에서 실패했는지 안내",
  priority: "medium",
  assignee: { id: "user-1", name: "김민준", initials: "김" },
  tags: ["결제", "UX"],
  dueDate: "2026-09-20",
};

const meta = {
  title: "Features/Kanban/Card",
  component: KanbanCardView,
  args: {
    card: sample,
  },
} satisfies Meta<typeof KanbanCardView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Urgent: Story = {
  args: {
    card: { ...sample, priority: "urgent", tags: ["QA", "긴급"] },
  },
};

export const NoDueDate: Story = {
  args: {
    card: { ...sample, dueDate: null },
  },
};

export const Dragging: Story = {
  args: {
    card: sample,
    dragging: true,
  },
};

export const Overlay: Story = {
  args: {
    card: sample,
    overlay: true,
  },
};

export const DropPlaceholder: Story = {
  render: () => <KanbanDropIndicator height={140} />,
};
