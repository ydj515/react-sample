import { apiRequest } from "@/shared/api/http-client";
import { receiptSchema, type CheckoutInput } from "../model/shop";

export function createShopOrder(input: CheckoutInput) {
  return apiRequest("/api/shop/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    schema: receiptSchema,
  });
}
