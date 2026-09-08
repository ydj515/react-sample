import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";
export const Route = createFileRoute("/_dashboard/orders/")({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  component: OrdersPage,
});
