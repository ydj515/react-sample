import { createFileRoute } from "@tanstack/react-router";
import { ProductEditorPage } from "@/features/products/pages/product-editor";
import { productsSearchSchema } from "@/features/products/model";

export const Route = createFileRoute("/_dashboard/products/new")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: ProductEditorPage,
});
