import { adminLogSchema } from "./admin-log-schema";
import type { AdminLog } from "./admin-log-schema";

export type AdminLogCounts = Record<string, number>;

export function countAdminLogsByChannel(
  logs: readonly AdminLog[],
): AdminLogCounts {
  return logs.reduce<AdminLogCounts>((acc, log) => {
    acc[log.channel] = (acc[log.channel] ?? 0) + 1;
    return acc;
  }, {});
}

export function countAdminLogsBySeverity(
  logs: readonly AdminLog[],
): AdminLogCounts {
  return logs.reduce<AdminLogCounts>((acc, log) => {
    acc[log.severity] = (acc[log.severity] ?? 0) + 1;
    return acc;
  }, {});
}

export function validateAdminLogResponse(data: unknown): AdminLog[] {
  return adminLogSchema.array().parse(data);
}
