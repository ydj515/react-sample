import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { RouterContext } from "@/app/router-context";
import { ErrorPage } from "@/pages/errors/ErrorPage";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});
