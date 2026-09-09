import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { EventSchedule } from "./EventSchedule";
import "../experience.css";
const meta = {
  title: "Features/Landing/EventSchedule",
  component: EventSchedule,
  decorators: [
    (Story) => (
      <div className="landing-event max-w-5xl p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventSchedule>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", {
        name: "좋은 질문이 제품을 바꾼다 관심 세션",
      }),
    );
    await expect(canvas.getByRole("status")).toHaveTextContent("관심 세션 1개");
  },
};
export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "DAY 2 · 11.13" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Culture" }));
    await expect(
      canvas.getByText("선택한 날짜에 해당 트랙의 세션이 없습니다."),
    ).toBeVisible();
  },
};
