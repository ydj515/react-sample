import type { ManagedOrder } from "@/features/orders/model/order-schema";
import { Card } from "@/shared/ui/card";
import { Check, CreditCard, PackageCheck, Truck } from "lucide-react";

export function OrderShippingProgress({ order }: { order: ManagedOrder }) {
  const stage =
    order?.status === "완료" ? 3 : order?.status === "배송중" ? 2 : 1;
  const steps = [
    { label: "주문 접수", icon: CreditCard },
    { label: "배송 준비", icon: PackageCheck },
    { label: "배송 중", icon: Truck },
    { label: "배송 완료", icon: Check },
  ];
  return (
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
            <li key={event.id} className="border-brand border-l-2 pl-3">
              <p className="text-sm">{event.text}</p>
              <time className="text-ink-subtle text-xs" dateTime={event.at}>
                {new Date(event.at).toLocaleString("ko-KR")}
              </time>
            </li>
          ))}
        </ol>
      </details>
    </Card>
  );
}
