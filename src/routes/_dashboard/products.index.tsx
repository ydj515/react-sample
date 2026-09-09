import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { productsSearchSchema } from "@/features/products/model/product-schema";

export const Route = createFileRoute("/_dashboard/products/")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: ProductsPage,
});
