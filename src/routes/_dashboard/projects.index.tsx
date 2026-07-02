import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";

export const Route = createFileRoute("/_dashboard/projects/")({
  component: ProjectsPage,
});
