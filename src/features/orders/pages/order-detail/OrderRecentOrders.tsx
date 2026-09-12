import type { ManagedOrder } from "@/features/orders/model/order-schema";
import { Card } from "@/shared/ui/card";
import { Link } from "@tanstack/react-router";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { money } from "./order-detail-format";

export function OrderRecentOrders({ recent }: { recent: ManagedOrder[] }) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold">이 고객의 최근 주문</h2>
      <div className="mt-4 grid gap-3">
        {recent.map((item) => (
          <Link
            key={item.id}
            to="/orders/$orderId"
            params={{ orderId: item.id }}
            search={ordersSearchSchema.parse({})}
            className="bg-surface-muted hover:bg-brand-soft rounded-control grid gap-2 p-3"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-brand text-sm font-semibold">
                {item.id}
              </span>
              <OrderStatusBadge status={item.status} />
            </span>
            <span className="text-ink-subtle flex justify-between gap-2 text-xs">
              <span>{item.date}</span>
              <span>{money(item.amount)}</span>
            </span>
          </Link>
        ))}
        {!recent.length ? (
          <p className="text-ink-subtle text-sm">다른 주문 내역이 없습니다.</p>
        ) : null}
      </div>
    </Card>
  );
}
