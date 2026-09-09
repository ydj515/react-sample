import {
  orderQueryOptions,
  ordersQueryOptions,
} from "@/features/orders/queries/order-queries";
import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailPage } from "@/features/orders/pages/OrderDetailPage";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";

export const Route = createFileRoute("/_dashboard/orders/$orderId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(orderQueryOptions(params.orderId)),
      context.queryClient.ensureQueryData(ordersQueryOptions()),
    ]),
  validateSearch: (search) => ordersSearchSchema.parse(search),
  component: function RoutePage() {
    const { orderId } = Route.useParams();
    return <OrderDetailPage orderId={orderId} />;
  },
});
