import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { History, ShoppingBag, UserRound } from "lucide-react";
import { userQueryOptions } from "@/features/users/queries/user-queries";
import {
  userDetailSearchSchema,
  usersSearchSchema,
} from "@/features/users/model/user-schema";
import { UserStatusBadge } from "@/features/users/components/UserStatusBadge";
import { UserAccessForm } from "@/features/users/components/UserAccessForm";
import { UserProfileForm } from "@/features/users/components/UserProfileForm";
import { ordersQueryOptions } from "@/features/orders/queries/order-queries";
import { ordersSearchSchema } from "@/features/orders/model/order-schema";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { CollectionTable } from "@/shared/ui/collection-table";
import { DetailTabs } from "@/shared/ui/detail-tabs";
import { QueryFeedback } from "@/shared/ui/query-feedback";

export function UserDetailPage({ userId }: { userId: string }) {
  const search = userDetailSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const query = useQuery(userQueryOptions(userId));
  const orderQuery = useQuery(ordersQueryOptions());
  const user = query.data;
  const orders = orderQuery.data?.filter(
    (order) => order.customerId === userId,
  );
  const tabs = [
    { value: "profile", label: "기본 정보" },
    { value: "orders", label: "주문 내역" },
    { value: "activity", label: "활동 로그" },
    { value: "access", label: "권한 설정" },
  ] as const;
  const changeTab = (tab: typeof search.tab) =>
    void navigate({
      to: "/users/$userId",
      params: { userId },
      search: { ...search, tab },
      replace: true,
    });
  return (
    <section className="grid min-w-0 gap-5">
      <Link
        to="/users"
        search={usersSearchSchema.parse(search)}
        className="text-brand w-fit text-sm hover:underline"
      >
        ← 사용자 목록
      </Link>
      <QueryFeedback
        pending={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
      {user ? (
        <>
          <Card className="overflow-hidden">
            <div className="from-brand h-24 bg-linear-to-r to-indigo-400" />
            <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-end gap-4 px-5 pb-6 sm:flex sm:flex-wrap sm:px-6">
              <div
                className="border-surface bg-brand-soft text-brand -mt-10 grid size-20 shrink-0 place-items-center self-start rounded-full border-4 text-2xl font-bold sm:self-auto"
                aria-hidden
              >
                {user.name.slice(-2)}
              </div>
              <div className="min-w-0 flex-1 pt-4">
                <h1 className="text-xl font-bold">{user.name}</h1>
                <div className="text-ink-subtle mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="break-all">{user.email}</span>
                  <Badge variant="warning">{user.grade} 회원</Badge>
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
              <div className="col-span-2 flex gap-2 pt-4 sm:ml-auto">
                <Button variant="secondary" onClick={() => changeTab("access")}>
                  계정 관리
                </Button>
                {search.tab === "profile" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("user-name")?.focus()
                    }
                  >
                    정보 편집
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [
                "총 주문",
                orders ? `${orders.length}건` : "—",
                "등록된 주문 기준",
              ],
              [
                "총 구매액",
                orders
                  ? `₩${orders
                      .filter((o) => o.status !== "취소")
                      .reduce((sum, o) => sum + o.amount, 0)
                      .toLocaleString("ko-KR")}`
                  : "—",
                "취소 주문 제외",
              ],
              [
                "보유 포인트",
                `${user.points.toLocaleString("ko-KR")}P`,
                "사용 가능한 포인트",
              ],
              ["가입일", user.joinedAt.slice(0, 10), user.department],
            ].map(([label, value, hint]) => (
              <Card key={label} className="min-w-0 p-4">
                <p className="text-ink-subtle text-xs font-medium">{label}</p>
                <p className="mt-2 text-lg font-bold break-words tabular-nums sm:text-xl">
                  {value}
                </p>
                <p className="text-ink-subtle mt-1 text-xs">{hint}</p>
              </Card>
            ))}
          </div>
          <DetailTabs
            tabs={tabs}
            value={search.tab}
            onChange={changeTab}
            panelId="user-detail-panel"
            label="사용자 상세"
          />
          <div
            role="tabpanel"
            id="user-detail-panel"
            aria-labelledby={`user-detail-panel-${search.tab}`}
            tabIndex={0}
          >
            {search.tab === "profile" ? (
              <UserProfileForm key={user.id} user={user} />
            ) : null}
            {search.tab === "access" ? (
              <Card className="p-5 sm:p-6">
                <UserAccessForm
                  key={`${user.role}-${user.status}`}
                  user={user}
                />
              </Card>
            ) : null}
            {search.tab === "orders" ? (
              <Card className="grid gap-4 p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <ShoppingBag className="text-brand size-4" />
                  주문 내역 {orders ? `(${orders.length}건)` : ""}
                </h2>
                <QueryFeedback
                  pending={orderQuery.isPending}
                  error={orderQuery.error}
                  onRetry={() => void orderQuery.refetch()}
                />
                {orders?.length ? (
                  <CollectionTable label="회원 주문 내역">
                    <thead>
                      <tr>
                        {["주문번호", "상품", "금액", "상태", "날짜"].map(
                          (label) => (
                            <th key={label} scope="col">
                              {label}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <Link
                              className="text-brand font-semibold hover:underline"
                              to="/orders/$orderId"
                              params={{ orderId: order.id }}
                              search={ordersSearchSchema.parse({})}
                            >
                              {order.id}
                            </Link>
                          </td>
                          <td>{order.product}</td>
                          <td className="whitespace-nowrap">
                            ₩{order.amount.toLocaleString("ko-KR")}
                          </td>
                          <td>
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td>{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </CollectionTable>
                ) : orders ? (
                  <p className="text-ink-subtle py-8 text-center text-sm">
                    아직 주문 내역이 없습니다.
                  </p>
                ) : null}
              </Card>
            ) : null}
            {search.tab === "activity" ? (
              <Card className="p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <History className="text-brand size-4" />
                  최근 활동
                </h2>
                <ol className="divide-line mt-4 divide-y">
                  {user.activity.map((event) => (
                    <li key={event.id} className="flex gap-3 py-4">
                      <span className="bg-brand-soft text-brand rounded-control grid size-9 shrink-0 place-items-center">
                        <UserRound className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm">{event.text}</p>
                        <time
                          className="text-ink-subtle mt-1 block text-xs"
                          dateTime={event.at}
                        >
                          {new Date(event.at).toLocaleString("ko-KR")}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
