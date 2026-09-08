import { dashboardSchema } from "@/features/dashboard/model/dashboard-schema";
import { apiRequest } from "@/shared/api/http-client";

export function getDashboard() {
  return apiRequest("/api/dashboard", { schema: dashboardSchema });
}
