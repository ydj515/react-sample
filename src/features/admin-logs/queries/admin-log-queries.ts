import { queryOptions } from "@tanstack/react-query";

import { getAdminLogs } from "@/features/admin-logs/api/admin-log-api";

export const adminLogKeys = {
  all: ["admin-logs"] as const,
  list: ["admin-logs", "list"] as const,
};

export const adminLogsQueryOptions = () =>
  queryOptions({ queryKey: adminLogKeys.list, queryFn: getAdminLogs });
