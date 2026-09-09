import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useParams,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { createTestQueryClient } from "@/shared/lib/test/test-query-client";
import { UsersPage } from "@/features/users/pages/users";
import { UserDetailPage } from "@/features/users/pages/user-detail";
import {
  usersSearchSchema,
  userDetailSearchSchema,
} from "@/features/users/model";
import { OrdersPage } from "@/features/orders/pages/orders";
import { OrderDetailPage } from "@/features/orders/pages/order-detail";
import { ordersSearchSchema } from "@/features/orders/model";
import { ProductsPage } from "@/features/products/pages/products";
import { ProductDetailPage } from "@/features/products/pages/product-detail";
import { ProductEditorPage } from "@/features/products/pages/product-editor";
import { productsSearchSchema } from "@/features/products/model";

export function renderManagement(initial: string) {
  const root = createRootRoute();
  const routeTree = root.addChildren([
    createRoute({
      getParentRoute: () => root,
      path: "/users",
      component: UsersPage,
      validateSearch: usersSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/users/$userId",
      component: function TestUserDetailPage() {
        return <UserDetailPage userId={useParams({ strict: false }).userId!} />;
      },
      validateSearch: userDetailSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/orders",
      component: OrdersPage,
      validateSearch: ordersSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/orders/$orderId",
      component: function TestOrderDetailPage() {
        return (
          <OrderDetailPage orderId={useParams({ strict: false }).orderId!} />
        );
      },
      validateSearch: ordersSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/products",
      component: ProductsPage,
      validateSearch: productsSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/products/new",
      component: ProductEditorPage,
      validateSearch: productsSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/products/$productId",
      component: function TestProductDetailPage() {
        return (
          <ProductDetailPage
            productId={useParams({ strict: false }).productId!}
          />
        );
      },
      validateSearch: productsSearchSchema,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/products/$productId/edit",
      component: function TestProductEditorPage() {
        return (
          <ProductEditorPage
            productId={useParams({ strict: false }).productId!}
          />
        );
      },
      validateSearch: productsSearchSchema,
    }),
  ]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initial] }),
    defaultPendingMinMs: 0,
  });
  const client = createTestQueryClient();
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
