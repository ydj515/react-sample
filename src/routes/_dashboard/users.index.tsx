import { usersQueryOptions } from "@/features/users/queries/user-queries";
import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { usersSearchSchema } from "@/features/users/model/user-schema";

export const Route = createFileRoute("/_dashboard/users/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(usersQueryOptions())]),
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: UsersPage,
});
