import {
  productSchema,
  type ProductInput,
} from "@/features/products/model/product-schema";
import { apiRequest } from "@/shared/api/http-client";

const headers = { "Content-Type": "application/json" };
export function getProducts() {
  return apiRequest("/api/products", { schema: productSchema.array() });
}
export function getProduct(id: string) {
  return apiRequest(`/api/products/${encodeURIComponent(id)}`, {
    schema: productSchema,
  });
}
export function createProduct(input: ProductInput) {
  return apiRequest("/api/products", {
    schema: productSchema,
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
}
export function updateProduct(id: string, input: ProductInput) {
  return apiRequest(`/api/products/${encodeURIComponent(id)}`, {
    schema: productSchema,
    method: "PUT",
    headers,
    body: JSON.stringify(input),
  });
}
