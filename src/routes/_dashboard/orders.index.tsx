import { ordersQueryOptions } from "@/features/orders/queries";
import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/features/orders/pages/orders";
import { ordersSearchSchema } from "@/features/orders/model";

export const Route = createFileRoute("/_dashboard/orders/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(ordersQueryOptions())]),
  validateSearch: (search) => ordersSearchSchema.parse(search),
  component: OrdersPage,
});
