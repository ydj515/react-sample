import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useParams,
} from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createTestQueryClient } from "@/shared/lib/test/test-query-client";
import { ShopLayout } from "@/features/shop/components/ShopLayout";
import { ShopPage } from "@/features/shop/pages/ShopPage";
import { ShopDetailPage } from "@/features/shop/pages/ShopDetailPage";
import { CartPage } from "@/features/shop/pages/CartPage";
import { shopSearchSchema } from "@/features/shop/model/shop";

export function renderShop(path = "/shop") {
  const root = createRootRoute();
  const shop = createRoute({
    getParentRoute: () => root,
    path: "/shop",
    component: ShopLayout,
  });
  const routes = [
    createRoute({
      getParentRoute: () => shop,
      path: "/",
      component: ShopPage,
      validateSearch: shopSearchSchema,
    }),
    createRoute({
      getParentRoute: () => shop,
      path: "$productId",
      component: function ProductTestRoute() {
        const { productId } = useParams({ strict: false });
        return <ShopDetailPage key={productId} productId={productId!} />;
      },
      validateSearch: shopSearchSchema,
    }),
    createRoute({
      getParentRoute: () => shop,
      path: "cart",
      component: CartPage,
    }),
    createRoute({
      getParentRoute: () => shop,
      path: "checkout",
      component: () => <CartPage checkout />,
    }),
  ];
  const router = createRouter({
    routeTree: root.addChildren([shop.addChildren(routes)]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
