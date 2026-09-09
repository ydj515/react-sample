import { productQueryOptions } from "@/features/products/queries/product-queries";
import { createFileRoute } from "@tanstack/react-router";
import { ProductEditorPage } from "@/features/products/pages/ProductEditorPage";
import { productsSearchSchema } from "@/features/products/model/product-schema";

export const Route = createFileRoute("/_dashboard/products/$productId/edit")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        productQueryOptions(params.productId),
      ),
    ]),
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: function RoutePage() {
    const { productId } = Route.useParams();
    return <ProductEditorPage productId={productId} />;
  },
});
