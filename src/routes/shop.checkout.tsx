import { productsQueryOptions } from "@/features/products/queries/product-queries";
import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/features/shop/pages/CartPage";

export const Route = createFileRoute("/shop/checkout")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(productsQueryOptions())]),
  component: () => <CartPage checkout />,
});
