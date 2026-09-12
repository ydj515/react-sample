import type { ManagedOrder } from "@/features/orders/model/order-schema";
import { Card } from "@/shared/ui/card";
import { Link } from "@tanstack/react-router";
import { ProductImage } from "@/features/products/components";
import { productsSearchSchema } from "@/features/products/model";
import { Badge } from "@/shared/ui/badge";
import { money } from "./order-detail-format";

export function OrderItems({ order }: { order: ManagedOrder }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">주문 상품</h2>
        <Badge variant="neutral">
          {order.items.reduce((sum, item) => sum + item.quantity, 0)}개
        </Badge>
      </div>
      <ul className="divide-line mt-4 divide-y">
        {order.items.map((item) => (
          <li
            key={`${item.productId}-${item.color}-${item.size}`}
            className="flex flex-wrap items-center gap-4 py-4"
          >
            <ProductImage
              src={item.image}
              name={item.name}
              className="rounded-control size-16 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <Link
                to="/products/$productId"
                params={{ productId: item.productId }}
                search={productsSearchSchema.parse({})}
                className="hover:text-brand text-sm font-semibold"
              >
                {item.name}
              </Link>
              <p className="text-ink-subtle mt-1 text-xs">
                {item.color} · {item.size} · 수량 {item.quantity}
              </p>
              <p className="text-ink-subtle mt-1 text-xs">
                {money(item.unitPrice)} / 개
              </p>
            </div>
            <strong className="ml-auto text-sm tabular-nums">
              {money(item.unitPrice * item.quantity)}
            </strong>
          </li>
        ))}
      </ul>
    </Card>
  );
}
