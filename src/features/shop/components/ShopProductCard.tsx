import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { ProductImage } from "@/features/products/components/ProductImage";
import type { Product } from "@/features/products/model/product-schema";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { shopMoney, shopSearchSchema, type ShopSearch } from "../model/shop";
export function ShopProductCard({
  product,
  favorite,
  onFavorite,
  search = shopSearchSchema.parse({}),
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  search?: ShopSearch;
}) {
  const rating = product.reviews.length
    ? product.reviews.reduce((n, r) => n + r.rating, 0) / product.reviews.length
    : 0;
  return (
    <article className="group min-w-0">
      <div className="bg-surface-muted rounded-panel relative overflow-hidden">
        <Link
          to="/shop/$productId"
          params={{ productId: product.id }}
          search={search}
          aria-label={`${product.name} 상세 보기`}
          className="focus-visible:outline-brand block p-5"
        >
          <ProductImage
            src={product.image}
            name={product.name}
            className="aspect-[4/3] w-full motion-safe:transition-transform motion-safe:group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3">
          {product.stock === 0 ? (
            <Badge variant="neutral">품절</Badge>
          ) : product.tags.includes("인기") ? (
            <Badge variant="info">인기 상품</Badge>
          ) : null}
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 rounded-full"
          aria-label={`${product.name} 찜`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Heart
            aria-hidden
            className={
              favorite ? "text-negative size-4 fill-current" : "size-4"
            }
          />
        </Button>
      </div>
      <div className="py-4">
        <p className="text-ink-subtle mb-1.5 text-xs">
          {product.brand} · {product.category}
        </p>
        <Link
          to="/shop/$productId"
          params={{ productId: product.id }}
          search={search}
          className="hover:text-brand focus-visible:outline-brand text-sm leading-6 font-semibold"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-ink text-base font-bold">
            {shopMoney(product.price)}
          </span>
          {product.listPrice > product.price && (
            <del className="text-ink-subtle text-xs">
              {shopMoney(product.listPrice)}
            </del>
          )}
        </div>
        <p className="text-ink-subtle mt-2 flex items-center gap-1 text-xs">
          <Star className="text-caution size-3 fill-current" aria-hidden />
          {rating ? rating.toFixed(1) : "리뷰 없음"}
          <span className="ml-1">({product.reviews.length})</span>
        </p>
      </div>
    </article>
  );
}
