import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { productsSearchSchema } from "@/features/products/model/product-schema";
export const Route = createFileRoute("/_dashboard/products/$productId/")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: function RoutePage() {
    const { productId } = Route.useParams();
    return <ProductDetailPage productId={productId} />;
  },
});
