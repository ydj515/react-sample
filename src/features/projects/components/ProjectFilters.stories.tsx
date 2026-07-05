import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type {
  ProjectFilters as ProjectFiltersValue,
  ProjectSortKey,
} from "@/features/projects/model/project-types";

import { ProjectFilters } from "./ProjectFilters";

// 제어 컴포넌트라 상태를 가진 래퍼에서 실제 상호작용을 보여준다.
function ProjectFiltersDemo() {
  const [filters, setFilters] = useState<ProjectFiltersValue>({
    search: "",
    status: "all",
  });
  const [sortKey, setSortKey] = useState<ProjectSortKey>("dueDate");

  return (
    <ProjectFilters
      filters={filters}
      sortKey={sortKey}
      onFiltersChange={setFilters}
      onSortKeyChange={setSortKey}
    />
  );
}

const meta = {
  title: "Features/Projects/ProjectFilters",
  component: ProjectFilters,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    filters: { search: "", status: "all" },
    sortKey: "dueDate",
    onFiltersChange: () => {},
    onSortKeyChange: () => {},
  },
} satisfies Meta<typeof ProjectFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProjectFiltersDemo />,
};
