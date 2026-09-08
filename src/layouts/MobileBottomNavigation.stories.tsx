import type { Meta, StoryObj } from "@storybook/react-vite";
import { MobileBottomNavigation } from "./MobileBottomNavigation";
import { withRouter } from "@/shared/lib/storybook/with-router";

const meta = {
  title: "Layouts/MobileBottomNavigation",
  component: MobileBottomNavigation,
  decorators: [
    withRouter,
    (Story) => (
      <div className="w-[390px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: { className: "relative inset-auto" },
  tags: ["autodocs"],
} satisfies Meta<typeof MobileBottomNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
