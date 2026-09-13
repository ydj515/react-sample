import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderTree } from "./FolderTree";

const meta = {
  title: "Features/Media/FolderTree",
  component: FolderTree,
  args: {
    folders: [
      { id: "1", name: "프로젝트", parentId: null },
      { id: "2", name: "브랜드", parentId: "1" },
    ],
    selected: "2",
    onSelect: () => {},
  },
} satisfies Meta<typeof FolderTree>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Nested: Story = {};
