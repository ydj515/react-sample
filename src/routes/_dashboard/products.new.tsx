import { createFileRoute } from "@tanstack/react-router";
import { ProductEditorPage } from "@/features/products/pages/ProductEditorPage";
import { productsSearchSchema } from "@/features/products/model/product-schema";
export const Route = createFileRoute("/_dashboard/products/new")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: ProductEditorPage,
});
