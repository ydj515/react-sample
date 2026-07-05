import type { Decorator } from "@storybook/react-vite";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useState, type ComponentType } from "react";

// 앱에서 <Link>가 참조하는 경로들. 이 경로가 라우트 트리에 있어야
// Storybook에서 Link가 에러 없이 href를 만든다.
const linkedPaths = [
  "/projects",
  "/projects/$projectId",
  "/settings",
  "/signin",
];

function RouterStory({ Story }: { Story: ComponentType }) {
  const [router] = useState(() => {
    const rootRoute = createRootRoute({ component: Outlet });
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <Story />,
    });
    const stubRoutes = linkedPaths.map((path) =>
      createRoute({
        getParentRoute: () => rootRoute,
        path,
        component: () => null,
      }),
    );

    return createRouter({
      routeTree: rootRoute.addChildren([indexRoute, ...stubRoutes]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
  });

  return <RouterProvider router={router} />;
}

/**
 * TanStack Router <Link>를 쓰는 컴포넌트를 Storybook에서 렌더하기 위한 데코레이터.
 * 메모리 히스토리 기반 최소 라우터를 만들어 스토리를 "/"에 렌더한다.
 */
export const withRouter: Decorator = (Story) => <RouterStory Story={Story} />;
