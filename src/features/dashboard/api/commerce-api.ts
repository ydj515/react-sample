import { commerceSchema } from "@/features/dashboard/model/commerce-schema";
import { apiRequest } from "@/shared/api/http-client";

export function getCommerceDashboard() {
  return apiRequest("/api/dashboard/commerce", { schema: commerceSchema });
}
