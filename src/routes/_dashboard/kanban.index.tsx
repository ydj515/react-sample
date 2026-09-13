import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { KanbanPage } from "@/features/kanban/pages/kanban";
import { kanbanSearchSchema } from "@/features/kanban/model";
import { kanbanBoardOptions } from "@/features/kanban/queries";

export const Route = createFileRoute("/_dashboard/kanban/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(kanbanBoardOptions()),
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) =>
    kanbanSearchSchema.parse(search),
  component: KanbanPage,
});
