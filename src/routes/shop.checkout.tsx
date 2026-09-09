import { productsQueryOptions } from "@/features/products/queries";
import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/features/shop/pages/cart";

export const Route = createFileRoute("/shop/checkout")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(productsQueryOptions())]),
  component: () => <CartPage checkout />,
});
