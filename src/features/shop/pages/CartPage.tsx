import { PageMetadata } from "@/shared/ui/page-metadata";
import type { ComponentProps } from "react";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2, Check } from "lucide-react";
import { productsQueryOptions } from "@/features/products/queries";
import { ProductImage } from "@/features/products/components";
import { useShopStore } from "@/stores/shop-store";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { QueryFeedback } from "@/shared/ui/query-feedback";
import {
  resolveCart,
  shopMoney,
  shopSearchSchema,
  type Receipt,
} from "@/features/shop/model/shop";
import { CartSummary } from "@/features/shop/components/CartSummary";
import { CheckoutForm } from "@/features/shop/components/CheckoutForm";
import { useShopOrderMutation } from "@/features/shop/queries/shop-queries";

function CartPageContent({ checkout = false }: { checkout?: boolean }) {
  const items = useShopStore((s) => s.items);
  const setQuantity = useShopStore((s) => s.quantity);
  const remove = useShopStore((s) => s.remove);
  const clear = useShopStore((s) => s.clear);
  const query = useSuspenseQuery(productsQueryOptions());
  const mutation = useShopOrderMutation();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const cart = resolveCart(items, query.data ?? []);
  if (receipt)
    return (
      <>
        <PageMetadata
          title="주문 완료"
          description="주문이 완료되었습니다. 주문 번호와 구매 내역을 확인하세요."
        />
        <div className="mx-auto max-w-2xl py-8">
          <span className="bg-positive-soft text-positive mb-5 grid size-12 place-items-center rounded-full">
            <Check className="size-6" aria-hidden />
          </span>
          <h1 className="text-3xl font-bold">모의 주문이 완료되었습니다</h1>
          <p className="text-ink-muted mt-4 text-sm leading-7">
            실제 결제·배송·재고 차감은 발생하지 않습니다.
          </p>
          <p className="text-ink-subtle mt-2 text-xs break-all">
            주문 번호: {receipt.id}
          </p>
          <Card className="my-8 p-6">
            <ul className="border-line mb-6 space-y-4 border-b pb-6">
              {receipt.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-3 text-sm">
                  <span>
                    {item.name}
                    <span className="text-ink-subtle block text-xs">
                      {item.color} {item.size} · {item.quantity}개
                    </span>
                  </span>
                  <span>{shopMoney(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <CartSummary {...receipt} />
          </Card>
          <Button asChild>
            <Link to="/shop" search={shopSearchSchema.parse({})}>
              쇼핑 계속하기
            </Link>
          </Button>
        </div>
      </>
    );
  return (
    <>
      <PageMetadata title={checkout ? "주문서" : "장바구니"} />
      <div>
        <Link
          to={checkout ? "/shop/cart" : "/shop"}
          search={checkout ? {} : shopSearchSchema.parse({})}
          className="text-ink-subtle hover:text-brand mb-6 inline-block text-sm"
        >
          ← {checkout ? "장바구니" : "쇼핑 계속하기"}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {checkout ? "주문서 작성" : "장바구니"}
        </h1>
        <p className="text-ink-subtle mt-3 mb-8 text-sm">
          {checkout
            ? "배송 정보와 최종 금액을 확인하세요."
            : `${items.length}개 옵션 · 나의 선택을 한 번 더 확인하세요.`}
        </p>
        {!items.length ? (
          <Card className="py-16 text-center">
            <h2 className="text-lg font-semibold">장바구니가 비어있습니다.</h2>
            <p className="text-ink-subtle mt-3 mb-6 text-sm">
              컬렉션에서 마음에 드는 상품을 찾아보세요.
            </p>
            <Button asChild>
              <Link to="/shop" search={shopSearchSchema.parse({})}>
                상품 둘러보기
              </Link>
            </Button>
          </Card>
        ) : (
          <>
            <QueryFeedback
              pending={false}
              error={query.error}
              onRetry={() => void query.refetch()}
            />
            {query.data && (
              <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
                <section aria-label="장바구니 상품">
                  <ul className="divide-line divide-y">
                    {cart.lines.map((line) => (
                      <li key={line.key} className="flex gap-4 py-6 first:pt-0">
                        <div className="w-20 shrink-0 sm:w-28">
                          {line.product && (
                            <ProductImage
                              src={line.product.image}
                              name={line.product.name}
                              className="w-full"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              {line.product ? (
                                <Link
                                  to="/shop/$productId"
                                  params={{ productId: line.product.id }}
                                  search={shopSearchSchema.parse({})}
                                  className="hover:text-brand text-sm font-semibold"
                                >
                                  {line.product.name}
                                </Link>
                              ) : (
                                <p className="text-sm font-semibold">
                                  삭제된 상품
                                </p>
                              )}
                              <p className="text-ink-subtle mt-2 text-xs">
                                {line.entry.color || "기본"} /{" "}
                                {line.entry.size || "단일 옵션"}
                              </p>
                            </div>
                            {!checkout && (
                              <Button
                                aria-label={`${line.product?.name ?? "삭제된 상품"} 삭제`}
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(line.key)}
                              >
                                <Trash2 aria-hidden className="size-4" />
                              </Button>
                            )}
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            {checkout ? (
                              <span className="text-ink-muted text-sm">
                                수량 {line.entry.quantity}개
                              </span>
                            ) : (
                              <div className="border-line rounded-control flex items-center border">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label={`${line.product?.name ?? "상품"} 수량 줄이기`}
                                  disabled={line.entry.quantity <= 1}
                                  onClick={() =>
                                    setQuantity(
                                      line.key,
                                      line.entry.quantity - 1,
                                    )
                                  }
                                >
                                  <Minus aria-hidden className="size-3" />
                                </Button>
                                <span
                                  className="min-w-6 text-center text-sm"
                                  aria-label="수량"
                                >
                                  {line.entry.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label={`${line.product?.name ?? "상품"} 수량 늘리기`}
                                  disabled={
                                    line.entry.quantity >= line.available ||
                                    !!line.error
                                  }
                                  onClick={() =>
                                    setQuantity(
                                      line.key,
                                      line.entry.quantity + 1,
                                    )
                                  }
                                >
                                  <Plus aria-hidden className="size-3" />
                                </Button>
                              </div>
                            )}
                            <strong className="text-sm">
                              {shopMoney(line.amount)}
                            </strong>
                          </div>
                          {line.error && (
                            <p
                              role="alert"
                              className="text-negative mt-3 text-xs"
                            >
                              {line.error} 수량을 조정하거나 상품을 삭제하세요.
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
                <Card className="p-5 sm:p-6">
                  <h2 className="mb-6 font-semibold">주문 요약</h2>
                  <CartSummary {...cart} />
                  <p className="text-ink-subtle mt-4 text-xs">
                    10만 원 이상 주문 시 무료 배송
                  </p>
                  {checkout ? (
                    <CheckoutForm
                      pending={mutation.isPending}
                      disabled={
                        !cart.valid || !!query.error || query.isFetching
                      }
                      error={mutation.error?.message}
                      onSubmit={(recipient) =>
                        mutation.mutate(
                          { recipient, items, expectedTotal: cart.total },
                          {
                            onSuccess: (saved) => {
                              setReceipt(saved);
                              clear();
                            },
                            onError: () => {
                              void query.refetch();
                            },
                          },
                        )
                      }
                    />
                  ) : (
                    <Button
                      asChild={cart.valid && !query.error}
                      disabled={!cart.valid || !!query.error}
                      className="mt-6 w-full"
                    >
                      {cart.valid && !query.error ? (
                        <Link to="/shop/checkout">주문서 작성</Link>
                      ) : (
                        "상품 상태를 확인하세요"
                      )}
                    </Button>
                  )}
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export function CartPage(props: ComponentProps<typeof CartPageContent>) {
  return (
    <QueryBoundary key={JSON.stringify(props)}>
      <CartPageContent {...props} />
    </QueryBoundary>
  );
}
