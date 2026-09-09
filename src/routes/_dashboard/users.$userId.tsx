import { createFileRoute } from "@tanstack/react-router";
import { UserDetailPage } from "@/features/users/pages/UserDetailPage";
import { userDetailSearchSchema } from "@/features/users/model/user-schema";

export const Route = createFileRoute("/_dashboard/users/$userId")({
  validateSearch: (search) => userDetailSearchSchema.parse(search),
  component: function RoutePage() {
    const { userId } = Route.useParams();
    return <UserDetailPage userId={userId} />;
  },
});
