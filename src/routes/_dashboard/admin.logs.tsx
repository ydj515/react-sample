import { createFileRoute } from "@tanstack/react-router";

import { adminLogsQueryOptions } from "@/features/admin-logs/queries";
import { AdminLogsPage } from "@/features/admin-logs/pages/admin-logs";
import { adminLogsQuerySchema } from "@/features/admin-logs/model";

export const Route = createFileRoute("/_dashboard/admin/logs")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminLogsQueryOptions()),
  validateSearch: (search) => adminLogsQuerySchema.parse(search),
  component: AdminLogsPage,
});
