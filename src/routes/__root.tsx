import { Outlet, createRootRoute } from "@tanstack/react-router";

import { ErrorPage } from "@/pages/errors/ErrorPage";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";

export const Route = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});
