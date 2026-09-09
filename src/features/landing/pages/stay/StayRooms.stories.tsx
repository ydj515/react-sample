import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { StayRooms } from "./StayRooms";
import "../experience.css";
const meta = {
  title: "Features/Landing/StayRooms",
  component: StayRooms,
  decorators: [
    (Story) => (
      <div className="landing-stay bg-surface text-ink max-w-6xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StayRooms>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Forest: Story = {};
export const Garden: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Garden House" }),
    );
  },
};
