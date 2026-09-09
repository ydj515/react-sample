import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "../model/product-schema";
import { Card } from "@/shared/ui/card";

export function ProductInsights({
  product,
  view,
}: {
  product?: Product;
  view: "sales" | "reviews";
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const sales = product?.sales ?? [];
  const reviews = product?.reviews ?? [];
  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "—";
  if (view === "reviews")
    return (
      <Card className="p-5">
        <h2 className="font-semibold">리뷰 목록 ({reviews.length}건)</h2>
        <div className="divide-line mt-2 divide-y">
          {reviews.map((review) => (
            <article key={review.id} className="py-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-brand-soft text-brand grid size-9 place-items-center rounded-full text-sm font-semibold">
                  {review.author.slice(-2)}
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{review.author}</h3>
                  <time className="text-ink-subtle text-xs">{review.date}</time>
                </div>
                <span
                  className="text-caution ml-auto flex"
                  aria-label={`5점 만점에 ${review.rating}점`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className="size-4"
                      fill={index < review.rating ? "currentColor" : "none"}
                      aria-hidden
                    />
                  ))}
                </span>
              </div>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {review.text}
              </p>
            </article>
          ))}
        </div>
        {!reviews.length ? (
          <p className="text-ink-subtle py-8 text-center text-sm">
            등록된 리뷰가 없습니다.
          </p>
        ) : null}
      </Card>
    );
  return (
    <Card className="p-5">
      <div className="grid grid-cols-3 gap-2">
        {[
          [
            "총 판매량",
            `${sales.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("ko-KR")}개`,
          ],
          [
            "총 매출",
            `₩${(sales.reduce((sum, item) => sum + item.revenue, 0) / 1000000).toFixed(1)}M`,
          ],
          ["평균 평점", average],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-panel bg-surface-muted p-3 text-center"
          >
            <p className="text-lg font-bold sm:text-2xl">{value}</p>
            <p className="text-ink-subtle mt-1 text-xs">{label}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-6 font-semibold">월별 판매량</h2>
      <p className="text-ink-subtle mt-1 text-xs">2025년 상반기 판매 스냅샷</p>
      {sales.length ? (
        <div
          className="mt-8 flex h-48 items-end gap-2"
          aria-label="월별 판매량 차트"
        >
          {sales.map((item, index) => (
            <div
              key={item.month}
              className="relative flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
            >
              <button
                type="button"
                className="bg-brand/75 hover:bg-brand focus-visible:bg-brand focus-visible:outline-brand relative w-full rounded-t-sm focus-visible:outline-2"
                style={{
                  height: `${Math.max(4, (item.quantity / Math.max(1, ...sales.map((value) => value.quantity))) * 150)}px`,
                }}
                aria-label={`${item.month} ${item.quantity}개`}
                onMouseEnter={() => setSelected(index)}
                onMouseLeave={() => setSelected(null)}
                onFocus={() => setSelected(index)}
                onBlur={() => setSelected(null)}
                onClick={() => setSelected(index)}
              >
                {selected === index ? (
                  <span
                    role="tooltip"
                    className="bg-ink text-surface absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap"
                  >
                    {item.quantity}개
                  </span>
                ) : null}
              </button>
              <span className="text-ink-subtle text-center text-xs">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ink-subtle py-10 text-center text-sm">
          아직 판매 내역이 없습니다.
        </p>
      )}
    </Card>
  );
}
