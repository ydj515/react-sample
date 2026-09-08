import type { Product, ProductInput } from "../model/product-schema";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
} from "@/features/products/api/product-api";
export const productKeys = {
  all: ["products"] as const,
  list: ["products", "list"] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};
export const productsQueryOptions = () =>
  queryOptions({ queryKey: productKeys.list, queryFn: getProducts });
export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
  });

export function useSaveProductMutation(
  productId: string | undefined,
  onSaved: (product: Product) => void,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) =>
      productId ? updateProduct(productId, input) : createProduct(input),
    onSuccess: async (saved) => {
      client.setQueryData(productKeys.detail(saved.id), saved);
      await client.invalidateQueries({ queryKey: productKeys.all });
      onSaved(saved);
    },
  });
}
