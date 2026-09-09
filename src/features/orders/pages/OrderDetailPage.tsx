import type { ComponentProps } from "react";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import {
  Check,
  CreditCard,
  PackageCheck,
  Truck,
  UserRound,
} from "lucide-react";
import {
  orderQueryOptions,
  ordersQueryOptions,
} from "@/features/orders/queries/order-queries";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import {
  OrderNoteForm,
  OrderStatusForm,
} from "@/features/orders/components/OrderActions";
import { OrderShippingForm } from "@/features/orders/components/OrderShippingForm";
import { ProductImage } from "@/features/products/components/ProductImage";
import { productsSearchSchema } from "@/features/products/model/product-schema";
import { userDetailSearchSchema } from "@/features/users/model/user-schema";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { Badge } from "@/shared/ui/badge";

const money = (value: number) => `₩${value.toLocaleString("ko-KR")}`;
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
  const stage =
    order?.status === "완료" ? 3 : order?.status === "배송중" ? 2 : 1;
  const steps = [
    { label: "주문 접수", icon: CreditCard },
    { label: "배송 준비", icon: PackageCheck },
    { label: "배송 중", icon: Truck },
    { label: "배송 완료", icon: Check },
  ];
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
              <Card className="p-5">
                <h2 className="font-semibold">배송 현황</h2>
                {order.status === "취소" ? (
                  <p className="bg-negative-soft text-negative rounded-control mt-5 p-4 text-sm">
                    취소된 주문입니다. 배송을 진행하지 않습니다.
                  </p>
                ) : (
                  <ol
                    aria-label="배송 진행 단계"
                    className="mt-6 grid grid-cols-4 gap-1 sm:gap-3"
                  >
                    {steps.map(({ label, icon: Icon }, index) => (
                      <li
                        key={label}
                        aria-current={index === stage ? "step" : undefined}
                        className="relative text-center"
                      >
                        <span
                          className={`absolute top-5 left-1/2 h-0.5 w-full ${index === steps.length - 1 ? "hidden" : index < stage ? "bg-brand" : "bg-line"}`}
                        />
                        <span
                          className={`relative mx-auto grid size-10 place-items-center rounded-full ${index <= stage ? "bg-brand text-on-brand" : "bg-surface-muted text-ink-subtle"}`}
                        >
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <p
                          className={`mt-3 text-xs font-medium ${index <= stage ? "text-brand" : "text-ink-subtle"}`}
                        >
                          {label}
                        </p>
                        <p className="text-ink-subtle mt-1 text-[10px]">
                          {index < stage
                            ? "완료"
                            : index === stage
                              ? order.status === "완료"
                                ? "완료"
                                : "진행 중"
                              : "예정"}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
                <details className="border-line mt-6 border-t pt-4">
                  <summary className="text-ink-subtle cursor-pointer text-xs font-medium">
                    처리 타임라인 ({order.timeline.length}건)
                  </summary>
                  <ol className="mt-4 grid gap-4">
                    {order.timeline.map((event) => (
                      <li
                        key={event.id}
                        className="border-brand border-l-2 pl-3"
                      >
                        <p className="text-sm">{event.text}</p>
                        <time
                          className="text-ink-subtle text-xs"
                          dateTime={event.at}
                        >
                          {new Date(event.at).toLocaleString("ko-KR")}
                        </time>
                      </li>
                    ))}
                  </ol>
                </details>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">주문 상품</h2>
                  <Badge variant="neutral">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    개
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
              <Card className="p-5">
                <div className="flex items-center gap-2">
                  <UserRound className="text-brand size-4" aria-hidden />
                  <h2 className="font-semibold">고객 정보</h2>
                  <Link
                    to="/users/$userId"
                    params={{ userId: order.customerId }}
                    search={userDetailSearchSchema.parse({})}
                    className="text-brand ml-auto text-xs hover:underline"
                  >
                    회원 상세 보기
                  </Link>
                </div>
                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                  {[
                    ["이름", order.customer],
                    ["회원 등급", order.grade],
                    ["이메일", order.email],
                    ["연락처", order.phone],
                    ["배송 주소", order.address],
                    ["배송 요청사항", order.deliveryRequest || "요청사항 없음"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-ink-subtle text-xs">{label}</dt>
                      <dd className="mt-1 text-sm break-words">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
              <Card className="grid gap-5 p-5">
                <h2 className="text-sm font-semibold">관리자 메모</h2>
                <OrderNoteForm orderId={order.id} />
                {order.notes.length ? (
                  <ul className="grid gap-3">
                    {order.notes.map((note) => (
                      <li
                        key={note.id}
                        className="rounded-control bg-surface-muted p-4"
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {note.text}
                        </p>
                        <p className="text-ink-subtle mt-2 text-xs">
                          {note.author} ·{" "}
                          {new Date(note.at).toLocaleString("ko-KR")}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink-subtle text-sm">
                    아직 등록된 메모가 없습니다.
                  </p>
                )}
              </Card>
            </div>
            <aside className="grid min-w-0 gap-5" aria-label="주문 요약">
              <Card className="grid gap-5 p-5">
                <h2 className="font-semibold">상태 관리</h2>
                <OrderStatusForm key={order.status} order={order} />
                <OrderShippingForm key={order.id} order={order} />
              </Card>
              <Card className="p-5">
                <h2 className="font-semibold">결제 정보</h2>
                <dl className="mt-5 grid gap-3 text-sm">
                  {[
                    [
                      "상품 금액",
                      money(
                        order.items.reduce(
                          (sum, item) => sum + item.unitPrice * item.quantity,
                          0,
                        ),
                      ),
                    ],
                    ["할인 금액", `−${money(order.discount)}`],
                    ["배송비", money(order.shippingFee)],
                    ["포인트 사용", `−${money(order.pointsUsed)}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3">
                      <dt className="text-ink-subtle">{label}</dt>
                      <dd className="tabular-nums">{value}</dd>
                    </div>
                  ))}
                  <div className="border-line mt-1 flex items-center justify-between gap-3 border-t pt-4">
                    <dt className="font-semibold">최종 결제 금액</dt>
                    <dd className="text-brand text-xl font-bold tabular-nums">
                      {money(order.amount)}
                    </dd>
                  </div>
                </dl>
                <dl className="border-line mt-5 grid gap-3 border-t pt-4 text-xs">
                  {[
                    ["결제 수단", order.paymentMethod],
                    [
                      "결제 일시",
                      new Date(order.paidAt).toLocaleString("ko-KR"),
                    ],
                    ["승인 번호", order.approvalNumber],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3">
                      <dt className="text-ink-subtle shrink-0">{label}</dt>
                      <dd className="text-right break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
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
                  {orders.data && !recent.length ? (
                    <p className="text-ink-subtle text-sm">
                      다른 주문 내역이 없습니다.
                    </p>
                  ) : null}
                </div>
              </Card>
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
