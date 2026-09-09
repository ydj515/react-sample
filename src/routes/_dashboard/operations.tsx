import { dashboardQueryOptions } from "@/features/dashboard/queries/dashboard-queries";
import { createFileRoute } from "@tanstack/react-router";

import { OperationsPage } from "@/features/dashboard/pages/OperationsPage";
import { validateDashboardSearch } from "@/features/dashboard/model/dashboard-utils";

export const Route = createFileRoute("/_dashboard/operations")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(dashboardQueryOptions())]),
  validateSearch: validateDashboardSearch,
  component: OperationsPage,
});
