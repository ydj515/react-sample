import { productsQueryOptions } from "@/features/products/queries/product-queries";
import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/features/shop/pages/CartPage";

export const Route = createFileRoute("/shop/cart")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(productsQueryOptions()),
  component: CartPage,
});
