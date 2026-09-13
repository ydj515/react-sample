import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { NotificationsPage } from "@/features/notifications/pages/notifications";
import { notificationListSearchSchema } from "@/features/notifications/model";
import {
  notificationUnreadOptions,
  notificationsInfiniteOptions,
} from "@/features/notifications/queries";

export const Route = createFileRoute("/_dashboard/notifications/")({
  loaderDeps: ({ search }) => ({
    search: notificationListSearchSchema.parse(search),
  }),
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(notificationUnreadOptions()),
      context.queryClient.ensureInfiniteQueryData(
        notificationsInfiniteOptions(deps.search),
      ),
    ]),
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) =>
    notificationListSearchSchema.parse(search),
  component: NotificationsPage,
});
