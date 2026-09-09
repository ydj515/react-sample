import { createContext, useContext, useState, type ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

const Content = createContext<ReactNode>(null);

function TestContent() {
  return useContext(Content);
}

export function TestRouter({ children }: { children: ReactNode }) {
  const [router] = useState(() => {
    const root = createRootRoute({ component: TestContent });
    const fallback = createRoute({
      getParentRoute: () => root,
      path: "/$",
      component: () => null,
    });
    return createRouter({
      routeTree: root.addChildren([fallback]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
  });
  return (
    <Content.Provider value={children}>
      <RouterProvider router={router} />
    </Content.Provider>
  );
}
