import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type { RouteComponent } from "@tanstack/react-router";
import { createTestQueryClient } from "@/shared/lib/test/test-query-client";

type TestRoute = {
  path: string;
  component: RouteComponent;
  validateSearch?: (search: Record<string, unknown>) => Record<string, unknown>;
};

export function renderBusiness(initial: string, routes: TestRoute[]) {
  const client = createTestQueryClient();

  const root = createRootRoute();

  const routeTree = root.addChildren(
    routes.map((route) =>
      createRoute({ getParentRoute: () => root, ...route }),
    ),
  );

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initial] }),
  });
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router, client };
}
