import { adminLogSchema } from "@/features/admin-logs/model/admin-log-schema";
import { apiRequest } from "@/shared/api/http-client";

export function getAdminLogs() {
  return apiRequest("/api/admin/logs", { schema: adminLogSchema.array() });
}
