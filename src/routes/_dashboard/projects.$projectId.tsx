import { projectQueryOptions } from "@/features/projects/queries";
import { validateSearch } from "@/shared/lib/validate-search";
import { projectSearchSchema } from "@/features/projects/model";
import { createFileRoute } from "@tanstack/react-router";

import { ProjectDetailPage } from "@/features/projects/pages/project-detail";

export const Route = createFileRoute("/_dashboard/projects/$projectId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        projectQueryOptions(params.projectId),
      ),
    ]),
  validateSearch: validateSearch(projectSearchSchema),
  component: ProjectDetailPage,
});
