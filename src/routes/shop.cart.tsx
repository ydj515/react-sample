import { productsQueryOptions } from "@/features/products/queries";
import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/features/shop/pages/cart";

export const Route = createFileRoute("/shop/cart")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(productsQueryOptions()),
  component: CartPage,
});
