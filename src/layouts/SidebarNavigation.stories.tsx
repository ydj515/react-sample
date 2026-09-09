import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarBrand, SidebarNavigation } from "./SidebarNavigation";
import { withRouter } from "@/shared/lib/storybook/with-router";

const meta = {
  title: "Layouts/SidebarNavigation",
  component: SidebarNavigation,
  tags: ["autodocs"],
  decorators: [
    withRouter,
    (Story) => (
      <div className="border-line bg-surface text-ink flex h-[600px] w-64 flex-col border">
        <div className="border-line border-b px-5 py-3">
          <SidebarBrand />
        </div>
        <Story />
      </div>
    ),
  ],
  args: { activeGroup: "대시보드", compact: false },
} satisfies Meta<typeof SidebarNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
export const Workspace: Story = { args: { activeGroup: "워크스페이스" } };
