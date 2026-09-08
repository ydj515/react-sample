import { createFileRoute } from "@tanstack/react-router";

import { ReportsPage } from "@/features/dashboard/pages/ReportsPage";
import { validateDashboardSearch } from "@/features/dashboard/model/dashboard-utils";

export const Route = createFileRoute("/_dashboard/reports")({
  validateSearch: validateDashboardSearch,
  component: ReportsPage,
});
