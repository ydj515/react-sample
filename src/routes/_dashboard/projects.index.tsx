import { createFileRoute } from "@tanstack/react-router";

import { ProjectListPage } from "@/pages/projects/ProjectListPage";

export const Route = createFileRoute("/_dashboard/projects/")({
  component: ProjectListPage,
});
