import { userQueryOptions } from "@/features/users/queries";
import { ordersQueryOptions } from "@/features/orders/queries";
import { createFileRoute } from "@tanstack/react-router";
import { UserDetailPage } from "@/features/users/pages/user-detail";
import { userDetailSearchSchema } from "@/features/users/model";

export const Route = createFileRoute("/_dashboard/users/$userId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(userQueryOptions(params.userId)),
      context.queryClient.ensureQueryData(ordersQueryOptions()),
    ]),
  validateSearch: (search) => userDetailSearchSchema.parse(search),
  component: function RoutePage() {
    const { userId } = Route.useParams();
    return <UserDetailPage userId={userId} />;
  },
});
