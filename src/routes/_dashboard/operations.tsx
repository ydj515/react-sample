import { createFileRoute } from "@tanstack/react-router";

import { OperationsPage } from "@/features/dashboard/pages/OperationsPage";
import { validateDashboardSearch } from "@/features/dashboard/model/dashboard-utils";

export const Route = createFileRoute("/_dashboard/operations")({
  validateSearch: validateDashboardSearch,
  component: OperationsPage,
});
