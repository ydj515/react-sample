import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFooter } from "./AppFooter";
import { withRouter } from "@/shared/lib/storybook/with-router";

const meta = {
  title: "Layouts/AppFooter",
  component: AppFooter,
  decorators: [withRouter],
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AppFooter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
