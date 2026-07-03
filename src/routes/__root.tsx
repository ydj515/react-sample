import { Outlet, createRootRoute } from "@tanstack/react-router";

import { NotFoundPage } from "@/pages/errors/NotFoundPage";

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});
