import { createFileRoute } from "@tanstack/react-router";

import { ProjectDetailPage } from "@/pages/projects/ProjectDetailPage";

export const Route = createFileRoute("/_dashboard/projects/$projectId")({
  component: ProjectDetailPage,
});
