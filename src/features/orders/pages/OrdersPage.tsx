import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ordersQueryOptions } from "@/features/orders/queries/order-queries";
import {
  ordersSearchSchema,
  orderStatuses,
} from "@/features/orders/model/order-schema";
import { selectOrders } from "@/features/orders/model/order-utils";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { CollectionTable } from "@/shared/ui/collection-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { SearchInput } from "@/shared/ui/search-input";
import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { PageHeader } from "@/shared/ui/page-header";
import { Pagination } from "@/shared/ui/pagination";
import { Select } from "@/shared/ui/select";

function OrdersPageContent() {
  const search = ordersSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const query = useSuspenseQuery(ordersQueryOptions());
  const orders = query.data ?? [];
  const result = selectOrders(orders, search);
  const change = (patch: Partial<typeof search>) =>
    void navigate({
      to: "/orders",
      search: { ...search, page: 1, ...patch },
      replace: true,
    });
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="주문 관리"
        description="주문을 조회하고 배송 상태와 처리 메모를 관리하세요."
        actions={
          <Button
            variant="secondary"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            새로고침
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {orderStatuses.map((status) => (
          <Card key={status} className="p-4">
            <OrderStatusBadge status={status} />
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {orders.filter((order) => order.status === status).length}
              <span className="text-ink-subtle ml-1 text-xs font-normal">
                건
              </span>
            </p>
          </Card>
        ))}
      </div>
      <FilterBar>
        <FilterField label="주문 검색" grow>
          <SearchInput
            value={search.q}
            placeholder="주문번호, 고객, 상품 검색"
            onChange={(event) => change({ q: event.target.value })}
          />
        </FilterField>
        <FilterField label="주문 상태">
          <Select
            value={search.status}
            onChange={(event) =>
              change({ status: event.target.value as typeof search.status })
            }
          >
            <option value="all">전체 상태</option>
            {orderStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="주문 정렬">
          <Select
            value={search.sort}
            onChange={(event) =>
              change({ sort: event.target.value as typeof search.sort })
            }
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="amount-desc">금액 높은순</option>
            <option value="amount-asc">금액 낮은순</option>
          </Select>
        </FilterField>
        <Button
          type="button"
          variant="secondary"
          onClick={() => change(ordersSearchSchema.parse({}))}
        >
          초기화
        </Button>
      </FilterBar>
      {query.data ? (
        result.total ? (
          <>
            <CollectionTable label="주문 관리 목록">
              <thead>
                <tr>
                  {[
                    "주문번호",
                    "고객",
                    "주문 상품",
                    "금액",
                    "상태",
                    "주문일",
                  ].map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.items.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        to="/orders/$orderId"
                        params={{ orderId: order.id }}
                        search={search}
                        className="text-brand font-semibold hover:underline"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap">{order.customer}</td>
                    <td>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-ink-subtle mt-1 text-xs">
                        {order.brand}
                      </p>
                    </td>
                    <td className="font-semibold whitespace-nowrap tabular-nums">
                      ₩{order.amount.toLocaleString("ko-KR")}
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
            <Pagination {...result} onChange={(page) => change({ page })} />
          </>
        ) : (
          <>
            <EmptyState
              title="조건에 맞는 주문이 없습니다."
              onReset={() => change(ordersSearchSchema.parse({}))}
            />
            <Pagination {...result} onChange={(page) => change({ page })} />
          </>
        )
      ) : null}
    </section>
  );
}

export function OrdersPage() {
  return (
    <QueryBoundary>
      <OrdersPageContent />
    </QueryBoundary>
  );
}
