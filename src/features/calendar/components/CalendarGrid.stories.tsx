import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarGrid } from "./CalendarGrid";

const meta = {
  title: "Features/Calendar/Grid",
  component: CalendarGrid,
  args: {
    date: "2026-09-14",
    view: "month",
    events: [
      {
        id: "review",
        title: "디자인 리뷰",
        start: "2026-09-14T09:00",
        end: "2026-09-14T10:30",
        description: "새 화면 검토",
      },
    ],
    onEdit: () => {},
    onCreate: () => {},
    onMove: () => {},
  },
} satisfies Meta<typeof CalendarGrid>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Month: Story = {};

export const Week: Story = { args: { view: "week" } };

export const Day: Story = { args: { view: "day" } };

export const Empty: Story = { args: { events: [] } };
