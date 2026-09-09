import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { InquiryDialog } from "../../components/InquiryDialog";
import { getPlanPrice, type BillingCycle } from "../../model/landing";
export function SaasPricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  return (
    <>
      <div
        className="mt-7 flex justify-center gap-2"
        role="group"
        aria-label="결제 주기"
      >
        {(
          [
            { value: "monthly", label: "월간" },
            { value: "yearly", label: "연간 · 20% 할인" },
          ] as const
        ).map((item) => (
          <Button
            key={item.value}
            variant={cycle === item.value ? "primary" : "secondary"}
            aria-pressed={cycle === item.value}
            onClick={() => setCycle(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          {
            name: "Starter",
            price: 0,
            description: "작게 시작하는 팀을 위해",
            benefits: [
              "최대 3명과 함께 작업",
              "프로젝트 3개",
              "기본 보드와 팀 문서",
            ],
          },
          {
            name: "Pro",
            price: 39000,
            description: "몰입하는 팀의 다음 단계",
            benefits: [
              "최대 10명과 함께 작업",
              "무제한 프로젝트",
              "작업 자동화와 팀 인사이트",
            ],
          },
          {
            name: "Team",
            price: 99000,
            description: "팀의 가능성을 더 넓게",
            benefits: [
              "팀원 수 제한 없음",
              "Pro의 모든 기능",
              "역할별 접근 권한과 감사 기록",
            ],
          },
        ].map((plan) => {
          const price = getPlanPrice(plan.price, cycle);
          return (
            <article
              key={plan.name}
              aria-label={`${plan.name} 요금제`}
              className={`bg-surface rounded-panel border p-7 ${plan.name === "Pro" ? "border-brand ring-brand ring-1" : "border-line"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                {plan.name === "Pro" && (
                  <span className="bg-brand-soft text-brand rounded-control px-2 py-1 text-xs">
                    추천 플랜
                  </span>
                )}
              </div>
              <p className="text-ink-muted mt-3 text-sm">{plan.description}</p>
              <p className="mt-7 text-4xl font-semibold tracking-tight">
                ₩{price.monthly.toLocaleString("ko-KR")}
                <span className="text-ink-subtle text-sm font-normal">
                  {" "}
                  / 월
                </span>
              </p>
              <p className="text-ink-subtle mt-2 text-xs">
                {cycle === "yearly"
                  ? `연간 합계 ₩${price.total.toLocaleString("ko-KR")}`
                  : "월 단위 결제 예시"}
              </p>
              <ul className="my-7 space-y-4 text-sm">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <Check aria-hidden className="text-brand size-4 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <InquiryDialog
                label={`${plan.name} 체험하기`}
                context={`${plan.name} 데모 신청`}
                description={`${cycle === "yearly" ? "연간" : "월간"} 플랜 · 합계 ₩${price.total.toLocaleString("ko-KR")}. 실제 구독은 생성하지 않습니다.`}
                variant={plan.name === "Pro" ? "primary" : "secondary"}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}
