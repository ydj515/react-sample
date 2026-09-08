import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobalSearch } from "@/layouts/GlobalSearch";
import { withRouter } from "@/shared/lib/storybook/with-router";

const meta = {
  title: "Layouts/GlobalSearch",
  component: GlobalSearch,
  tags: ["autodocs"],
  decorators: [
    withRouter,
    (Story) => (
      <div className="w-full max-w-lg p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof GlobalSearch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
