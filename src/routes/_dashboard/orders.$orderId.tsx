import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailPage } from "@/features/orders/pages/OrderDetailPage";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";
export const Route = createFileRoute("/_dashboard/orders/$orderId")({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  component: function RoutePage() {
    const { orderId } = Route.useParams();
    return <OrderDetailPage orderId={orderId} />;
  },
});
