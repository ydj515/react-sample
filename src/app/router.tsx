import { queryClient } from "./query-client";
import { QueryPending } from "@/shared/ui/query-boundary";
import { QueryRouteError } from "@/shared/ui/query-route-error";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";
import { useAuthStore } from "@/stores/auth-store";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: QueryPending,
  defaultErrorComponent: QueryRouteError,
  defaultPreloadStaleTime: 0,
  defaultRemountDeps: ({ params }) => params,
  scrollRestoration: true,
  context: {
    queryClient,
    auth: useAuthStore,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
