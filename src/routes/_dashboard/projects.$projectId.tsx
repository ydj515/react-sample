import { createFileRoute } from "@tanstack/react-router";

import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";

export const Route = createFileRoute("/_dashboard/projects/$projectId")({
  component: ProjectDetailPage,
});
