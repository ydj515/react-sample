import type { ManagedOrder } from "@/features/orders/model/order-schema";
import { Card } from "@/shared/ui/card";
import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { userDetailSearchSchema } from "@/features/users/model";

export function OrderCustomer({ order }: { order: ManagedOrder }) {
  return (
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
  );
}
