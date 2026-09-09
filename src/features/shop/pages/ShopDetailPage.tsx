import type { ComponentProps } from "react";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { Heart, Expand, Truck, RotateCcw, X, Star } from "lucide-react";
import {
  productQueryOptions,
  productsQueryOptions,
} from "@/features/products/queries";
import { ProductImage } from "@/features/products/components";
import { useShopStore } from "@/stores/shop-store";
import { Button } from "@/shared/ui/button";
import { DetailTabs } from "@/shared/ui/detail-tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/dialog";
import { shopMoney, shopSearchSchema } from "@/features/shop/model/shop";
import { ProductPurchase } from "@/features/shop/components/ProductPurchase";
import { ShopProductCard } from "@/features/shop/components/ShopProductCard";

function ShopDetailPageContent({ productId }: { productId: string }) {
  const query = useSuspenseQuery(productQueryOptions(productId));
  const catalog = useSuspenseQuery(productsQueryOptions());
  const search = shopSearchSchema.parse(useSearch({ strict: false }));
  const favorites = useShopStore((s) => s.favorites);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const product = query.data;
  return (
    <div className="min-w-0">
      <Link
        to="/shop"
        search={search}
        className="text-ink-subtle hover:text-brand mb-8 inline-block text-sm"
      >
        ← 상품 목록
      </Link>
      {product && product.status !== "active" && (
        <div className="py-20">
          <h1 className="text-2xl font-semibold">판매하지 않는 상품입니다.</h1>
          <p className="text-ink-muted mt-3">
            다른 컬렉션에서 원하는 상품을 찾아보세요.
          </p>
        </div>
      )}
      {product?.status === "active" && (
        <>
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="상품 이미지 확대"
                  className="bg-surface-muted focus-visible:outline-brand rounded-panel relative w-full overflow-hidden p-5 sm:p-10"
                >
                  <ProductImage
                    src={product.image}
                    name={product.name}
                    className="w-full"
                  />
                  <span className="bg-surface text-ink-subtle absolute right-4 bottom-4 flex items-center gap-2 rounded-full px-3 py-2 text-xs">
                    <Expand aria-hidden className="size-4" />
                    크게 보기
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <DialogTitle className="font-semibold">
                      {product.name}
                    </DialogTitle>
                    <DialogDescription className="text-ink-subtle mt-1 text-xs">
                      상품 이미지 확대 보기
                    </DialogDescription>
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="이미지 닫기"
                    >
                      <X className="size-4" />
                    </Button>
                  </DialogClose>
                </div>
                <ProductImage
                  src={product.image}
                  name={`${product.name} 확대`}
                  className="mt-4 w-full"
                />
              </DialogContent>
            </Dialog>
            <section className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-brand text-xs font-semibold tracking-wider">
                  {product.brand} / {product.category}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="상품 찜"
                  aria-pressed={favorites.includes(product.id)}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    aria-hidden
                    className={
                      favorites.includes(product.id)
                        ? "text-negative size-5 fill-current"
                        : "size-5"
                    }
                  />
                </Button>
              </div>
              <h1 className="mt-1 text-3xl leading-tight font-bold tracking-tight">
                {product.name}
              </h1>
              <p className="text-ink-subtle mt-3 flex items-center gap-2 text-xs">
                <Star aria-hidden className="text-caution size-4" />
                리뷰 {product.reviews.length}개 · {product.sku}
              </p>
              <div className="my-6 flex flex-wrap items-baseline gap-3">
                <strong className="text-3xl">{shopMoney(product.price)}</strong>
                {product.listPrice > product.price && (
                  <>
                    <del className="text-ink-subtle text-sm">
                      {shopMoney(product.listPrice)}
                    </del>
                    <span className="text-negative text-sm font-semibold">
                      {Math.round(
                        (1 - product.price / product.listPrice) * 100,
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-ink-muted mb-7 text-sm leading-7">
                {product.description}
              </p>
              <ProductPurchase key={product.id} product={product} />
              <div className="border-line text-ink-subtle mt-7 space-y-3 border-t pt-5 text-xs">
                <p className="flex items-center gap-2">
                  <Truck aria-hidden className="size-4" />
                  10만 원 이상 무료 배송 · 기본 배송비 3,000원
                </p>
                <p className="flex items-center gap-2">
                  <RotateCcw aria-hidden className="size-4" />
                  실제 배송 없이 주문 흐름을 체험하는 샘플
                </p>
              </div>
            </section>
          </div>
          <section className="mt-12">
            <DetailTabs
              tabs={[
                { value: "description", label: "상품 정보" },
                { value: "reviews", label: `리뷰 (${product.reviews.length})` },
              ]}
              value={tab}
              onChange={setTab}
              panelId="shop-product-panel"
              label="상품 상세 정보"
            />
            <div
              id="shop-product-panel"
              role="tabpanel"
              aria-labelledby={`shop-product-panel-${tab}`}
              className="py-7"
            >
              {tab === "description" ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h2 className="font-semibold">일상에 어울리는 선택</h2>
                    <p className="text-ink-muted mt-3 text-sm leading-7">
                      {product.description} 사이즈와 색상별 재고를 확인하고
                      나에게 맞는 옵션을 선택하세요.
                    </p>
                  </div>
                  <dl className="text-sm">
                    <div className="border-line flex justify-between border-b py-3">
                      <dt className="text-ink-subtle">브랜드</dt>
                      <dd>{product.brand}</dd>
                    </div>
                    <div className="border-line flex justify-between border-b py-3">
                      <dt className="text-ink-subtle">카테고리</dt>
                      <dd>{product.category}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-ink-subtle">전체 재고</dt>
                      <dd>{product.stock}개</dd>
                    </div>
                  </dl>
                </div>
              ) : product.reviews.length ? (
                <ul className="divide-line divide-y">
                  {product.reviews.map((review) => (
                    <li key={review.id} className="py-5">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <strong>{review.author}</strong>
                        <span
                          className="text-caution"
                          aria-label={`5점 중 ${review.rating}점`}
                        >
                          {"★".repeat(review.rating)}
                        </span>
                        <time className="text-ink-subtle text-xs">
                          {review.date}
                        </time>
                      </div>
                      <p className="text-ink-muted mt-3 text-sm leading-7">
                        {review.text}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ink-subtle text-sm">
                  아직 등록된 리뷰가 없습니다.
                </p>
              )}
            </div>
          </section>
          {!!catalog.data?.some(
            (p) =>
              p.id !== product.id &&
              p.status === "active" &&
              p.category === product.category,
          ) && (
            <section className="border-line mt-8 border-t pt-8">
              <h2 className="mb-6 text-xl font-semibold">
                함께 보면 좋은 상품
              </h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {catalog.data
                  .filter(
                    (p) =>
                      p.id !== product.id &&
                      p.status === "active" &&
                      p.category === product.category,
                  )
                  .slice(0, 3)
                  .map((p) => (
                    <ShopProductCard
                      key={p.id}
                      product={p}
                      favorite={favorites.includes(p.id)}
                      onFavorite={() => toggleFavorite(p.id)}
                      search={search}
                    />
                  ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export function ShopDetailPage(
  props: ComponentProps<typeof ShopDetailPageContent>,
) {
  return (
    <QueryBoundary key={JSON.stringify(props)}>
      <ShopDetailPageContent {...props} />
    </QueryBoundary>
  );
}
