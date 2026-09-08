import { createFileRoute } from "@tanstack/react-router";
import { ProductEditorPage } from "@/features/products/pages/ProductEditorPage";
import { productsSearchSchema } from "@/features/products/model/product-schema";
export const Route = createFileRoute("/_dashboard/products/$productId/edit")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: function RoutePage() {
    const { productId } = Route.useParams();
    return <ProductEditorPage productId={productId} />;
  },
});
