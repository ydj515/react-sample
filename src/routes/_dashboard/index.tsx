import { validateSearch } from "@/shared/lib/validate-search";
import { commerceSearchSchema } from "@/features/dashboard/model/order-search";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const Route = createFileRoute("/_dashboard/")({
  validateSearch: validateSearch(commerceSearchSchema),
  component: DashboardPage,
});
