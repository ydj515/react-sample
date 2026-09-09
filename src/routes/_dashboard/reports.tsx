import { dashboardQueryOptions } from "@/features/dashboard/queries";
import { createFileRoute } from "@tanstack/react-router";

import { ReportsPage } from "@/features/dashboard/pages/reports";
import { validateDashboardSearch } from "@/features/dashboard/model";

export const Route = createFileRoute("/_dashboard/reports")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(dashboardQueryOptions())]),
  validateSearch: validateDashboardSearch,
  component: ReportsPage,
});
