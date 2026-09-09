import { productsQueryOptions } from "@/features/products/queries";
import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/features/shop/pages/shop";
import { shopSearchSchema } from "@/features/shop/model";

export const Route = createFileRoute("/shop/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(productsQueryOptions())]),
  component: ShopPage,
  validateSearch: shopSearchSchema,
});
