import { validateSearch } from "@/shared/lib/validate-search";
import { projectSearchSchema } from "@/features/projects/model/project-search";
import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";

export const Route = createFileRoute("/_dashboard/projects/")({
  validateSearch: validateSearch(projectSearchSchema),
  component: ProjectsPage,
});
