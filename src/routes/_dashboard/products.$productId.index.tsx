import { productQueryOptions } from "@/features/products/queries/product-queries";
import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { productsSearchSchema } from "@/features/products/model/product-schema";

export const Route = createFileRoute("/_dashboard/products/$productId/")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        productQueryOptions(params.productId),
      ),
    ]),
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: function RoutePage() {
    const { productId } = Route.useParams();
    return <ProductDetailPage productId={productId} />;
  },
});
