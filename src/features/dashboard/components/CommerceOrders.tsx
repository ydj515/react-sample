import { Link } from "@tanstack/react-router";
import { ordersSearchSchema } from "@/features/orders/model";
import type { Order } from "@/features/dashboard/model/commerce-schema";
import { formatWon } from "@/features/dashboard/model/commerce-utils";

import { CollectionTable } from "@/shared/ui/collection-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { OrderStatusBadge } from "@/features/orders/components";

export function CommerceOrders({
  orders,
  caption,
  selection,
}: {
  orders: Order[];
  caption: string;
  selection?: {
    ids: Set<string>;
    onSelect: (id: string) => void;
    onSelectPage: () => void;
  };
}) {
  const count = orders.filter((order) => selection?.ids.has(order.id)).length;
  return (
    <>
      <CollectionTable label={caption}>
        <thead>
          <tr>
            {selection ? (
              <th className="w-10">
                <input
                  type="checkbox"
                  aria-label="현재 페이지 전체 선택"
                  checked={orders.length > 0 && count === orders.length}
                  ref={(input) => {
                    if (input)
                      input.indeterminate = count > 0 && count < orders.length;
                  }}
                  onChange={selection.onSelectPage}
                  disabled={!orders.length}
                />
              </th>
            ) : null}
            {[
              "주문번호",
              "고객",
              "상품",
              "브랜드",
              "금액",
              "상태",
              "주문일",
            ].map((label) => (
              <th
                className="font-medium whitespace-nowrap"
                scope="col"
                key={label}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              {selection ? (
                <td>
                  <input
                    type="checkbox"
                    aria-label={`${order.id} 선택`}
                    checked={selection.ids.has(order.id)}
                    onChange={() => selection.onSelect(order.id)}
                  />
                </td>
              ) : null}
              <th scope="row" className="text-brand font-semibold">
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: order.id }}
                  search={ordersSearchSchema.parse({})}
                  className="hover:underline"
                >
                  {order.id}
                </Link>
              </th>
              <td className="whitespace-nowrap">{order.customer}</td>
              <td>{order.product}</td>
              <td className="whitespace-nowrap">{order.brand}</td>
              <td className="font-semibold tabular-nums">
                {formatWon(order.amount)}
              </td>
              <td>
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="text-ink-subtle whitespace-nowrap">
                {order.date}
              </td>
            </tr>
          ))}
        </tbody>
      </CollectionTable>
      {!orders.length ? <EmptyState title="검색 결과가 없습니다." /> : null}
    </>
  );
}
