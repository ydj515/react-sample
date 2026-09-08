import { queryOptions } from "@tanstack/react-query";
import { getCommerceDashboard } from "@/features/dashboard/api/commerce-api";
export const commerceKeys = { all: ["commerce-dashboard"] as const };
export const commerceQueryOptions = () =>
  queryOptions({
    queryKey: commerceKeys.all,
    queryFn: getCommerceDashboard,
  });
