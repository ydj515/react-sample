import { projectsQueryOptions } from "@/features/projects/queries/project-queries";
import { validateSearch } from "@/shared/lib/validate-search";
import { projectSearchSchema } from "@/features/projects/model/project-search";
import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";

export const Route = createFileRoute("/_dashboard/projects/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(projectsQueryOptions())]),
  validateSearch: validateSearch(projectSearchSchema),
  component: ProjectsPage,
});
