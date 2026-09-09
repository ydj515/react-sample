import { createFileRoute } from "@tanstack/react-router";
import { ShopDetailPage } from "@/features/shop/pages/ShopDetailPage";
import { shopSearchSchema } from "@/features/shop/model/shop";

export const Route = createFileRoute("/shop/$productId")({
  validateSearch: shopSearchSchema,
  component: function ProductRoute() {
    const { productId } = Route.useParams();
    return <ShopDetailPage key={productId} productId={productId} />;
  },
});
