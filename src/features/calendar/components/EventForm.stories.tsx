import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventForm } from "./EventForm";

const meta = {
  title: "Features/Calendar/EventForm",
  component: EventForm,
  args: {
    value: {
      title: "디자인 리뷰",
      start: "2026-09-14T09:00",
      end: "2026-09-14T10:00",
      description: "",
    },
    error: "",
    onSave: () => {},
  },
} satisfies Meta<typeof EventForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Conflict: Story = {
  args: { error: "시간이 겹치는 일정: 팀 회의" },
};
