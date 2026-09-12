import type { ComponentProps } from "react";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import {
  orderQueryOptions,
  ordersQueryOptions,
} from "@/features/orders/queries/order-queries";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { OrderStatusForm } from "@/features/orders/components/OrderActions";
import { OrderShippingForm } from "@/features/orders/components/OrderShippingForm";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

import { OrderShippingProgress } from "@/features/orders/pages/order-detail/OrderShippingProgress";
import { OrderItems } from "@/features/orders/pages/order-detail/OrderItems";
import { OrderCustomer } from "@/features/orders/pages/order-detail/OrderCustomer";
import { OrderNotes } from "@/features/orders/pages/order-detail/OrderNotes";
import { OrderPayment } from "@/features/orders/pages/order-detail/OrderPayment";
import { OrderRecentOrders } from "@/features/orders/pages/order-detail/OrderRecentOrders";

function OrderDetailPageContent({ orderId }: { orderId: string }) {
  const search = ordersSearchSchema.parse(useSearch({ strict: false }));
  const query = useSuspenseQuery(orderQueryOptions(orderId));
  const orders = useSuspenseQuery(ordersQueryOptions());
  const order = query.data;
  const recent =
    orders.data
      ?.filter(
        (item) => item.customerId === order?.customerId && item.id !== orderId,
      )
      .slice(0, 3) ?? [];
  return (
    <section className="grid gap-6">
      <Link
        to="/orders"
        search={search}
        className="text-brand w-fit text-sm hover:underline"
      >
        ← 주문 목록
      </Link>
      {order ? (
        <>
          <PageHeader
            title={`주문 ${order.id}`}
            description={`${order.date} 주문 · ${order.customer}`}
            actions={<OrderStatusBadge status={order.status} />}
          />
          <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="grid min-w-0 gap-5">
              <OrderShippingProgress order={order} />
              <OrderItems order={order} />
              <OrderCustomer order={order} />
              <OrderNotes order={order} />
            </div>
            <aside className="grid min-w-0 gap-5" aria-label="주문 요약">
              <Card className="grid gap-5 p-5">
                <h2 className="font-semibold">상태 관리</h2>
                <OrderStatusForm key={order.status} order={order} />
                <OrderShippingForm key={order.id} order={order} />
              </Card>
              <OrderPayment order={order} />
              <OrderRecentOrders recent={recent} />
            </aside>
          </div>
        </>
      ) : null}
    </section>
  );
}

export function OrderDetailPage(
  props: ComponentProps<typeof OrderDetailPageContent>,
) {
  return (
    <QueryBoundary key={JSON.stringify(props)}>
      <OrderDetailPageContent {...props} />
    </QueryBoundary>
  );
}
