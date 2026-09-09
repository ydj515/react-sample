import { productsQueryOptions } from "@/features/products/queries";
import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/features/products/pages/products";
import { productsSearchSchema } from "@/features/products/model";

export const Route = createFileRoute("/_dashboard/products/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(productsQueryOptions())]),
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: ProductsPage,
});
