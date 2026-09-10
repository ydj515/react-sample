import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProjectStatusControl } from "./ProjectStatusControl";
import { projectQueryOptions } from "@/features/projects/queries/project-queries";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import {
  loadManagementApi,
  withManagementApi,
} from "@/mocks/storybook/with-management-api";
import { projectsFixture } from "@/mocks/data/projects";

function CurrentProject() {
  const { data } = useSuspenseQuery(
    projectQueryOptions(projectsFixture[0]!.id),
  );
  return <ProjectStatusControl project={data} />;
}
const meta = {
  title: "Features/Projects/StatusControl",
  component: ProjectStatusControl,
  decorators: [withManagementApi],
  loaders: [loadManagementApi],
  args: { project: projectsFixture[0]! },
  render: () => (
    <QueryBoundary>
      <CurrentProject />
    </QueryBoundary>
  ),
} satisfies Meta<typeof ProjectStatusControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {};
