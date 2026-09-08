import {
  managedOrderSchema,
  type Order,
  type OrderShipping,
} from "@/features/orders/model/order-schema";
import { apiRequest } from "@/shared/api/http-client";
const headers = { "Content-Type": "application/json" };
export function getOrders() {
  return apiRequest("/api/orders", { schema: managedOrderSchema.array() });
}
export function getOrder(id: string) {
  return apiRequest(`/api/orders/${encodeURIComponent(id)}`, {
    schema: managedOrderSchema,
  });
}
export function updateOrderStatus(id: string, status: Order["status"]) {
  return apiRequest(`/api/orders/${encodeURIComponent(id)}/status`, {
    schema: managedOrderSchema,
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });
}
export function addOrderNote(id: string, text: string) {
  return apiRequest(`/api/orders/${encodeURIComponent(id)}/notes`, {
    schema: managedOrderSchema,
    method: "POST",
    headers,
    body: JSON.stringify({ text }),
  });
}

export function updateOrderShipping(id: string, input: OrderShipping) {
  return apiRequest(`/api/orders/${encodeURIComponent(id)}/shipping`, {
    schema: managedOrderSchema,
    method: "PATCH",
    headers,
    body: JSON.stringify(input),
  });
}
