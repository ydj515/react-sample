import { matchesSearch, paginate } from "@/shared/lib/list-search";
import { productsSearchSchema, type Product } from "./product-schema";
export function selectProducts(
  products: Product[],
  search: ReturnType<typeof productsSearchSchema.parse>,
) {
  return paginate(
    products
      .filter(
        (product) =>
          matchesSearch(
            search.q,
            product.name,
            product.sku,
            product.brand,
            ...product.tags,
          ) &&
          (search.status === "all" || product.status === search.status) &&
          (search.stock === "all" ||
            (search.stock === "out"
              ? product.stock === 0
              : product.stock > 0 && product.stock <= 10)),
      )
      .sort((a, b) =>
        search.sort === "name"
          ? a.name.localeCompare(b.name, "ko")
          : search.sort === "oldest"
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt),
      ),
    search.page,
  );
}
