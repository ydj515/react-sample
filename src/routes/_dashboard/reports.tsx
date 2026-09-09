import { dashboardQueryOptions } from "@/features/dashboard/queries/dashboard-queries";
import { createFileRoute } from "@tanstack/react-router";

import { ReportsPage } from "@/features/dashboard/pages/ReportsPage";
import { validateDashboardSearch } from "@/features/dashboard/model/dashboard-utils";

export const Route = createFileRoute("/_dashboard/reports")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(dashboardQueryOptions())]),
  validateSearch: validateDashboardSearch,
  component: ReportsPage,
});
