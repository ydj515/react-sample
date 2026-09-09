import {
  productQueryOptions,
  productsQueryOptions,
} from "@/features/products/queries/product-queries";
import { createFileRoute } from "@tanstack/react-router";
import { ShopDetailPage } from "@/features/shop/pages/ShopDetailPage";
import { shopSearchSchema } from "@/features/shop/model/shop";

export const Route = createFileRoute("/shop/$productId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        productQueryOptions(params.productId),
      ),
      context.queryClient.ensureQueryData(productsQueryOptions()),
    ]),
  validateSearch: shopSearchSchema,
  component: function ProductRoute() {
    const { productId } = Route.useParams();
    return <ShopDetailPage key={productId} productId={productId} />;
  },
});
