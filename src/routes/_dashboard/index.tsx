import { commerceQueryOptions } from "@/features/dashboard/queries";
import { validateSearch } from "@/shared/lib/validate-search";
import { commerceSearchSchema } from "@/features/dashboard/model";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/dashboard/pages/dashboard";

export const Route = createFileRoute("/_dashboard/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(commerceQueryOptions())]),
  validateSearch: validateSearch(commerceSearchSchema),
  component: DashboardPage,
});
