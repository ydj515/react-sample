import { createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";
import { useAuthStore } from "@/stores/auth-store";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    auth: useAuthStore,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
