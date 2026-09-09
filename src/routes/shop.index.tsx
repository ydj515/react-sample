import { productsQueryOptions } from "@/features/products/queries/product-queries";
import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/features/shop/pages/ShopPage";
import { shopSearchSchema } from "@/features/shop/model/shop";

export const Route = createFileRoute("/shop/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(productsQueryOptions())]),
  component: ShopPage,
  validateSearch: shopSearchSchema,
});
