import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { productsQueryOptions } from "@/features/products/queries/product-queries";
import {
  productsSearchSchema,
  type Product,
  type ProductInput,
} from "@/features/products/model/product-schema";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ProductImage } from "./ProductImage";

export function ProductSummary({
  product,
  stock,
  variants,
  onManageStock,
}: {
  product?: Product;
  stock: number;
  variants: NonNullable<ProductInput["variants"]>;
  onManageStock: () => void;
}) {
  const relatedQuery = useQuery({
    ...productsQueryOptions(),
    enabled: !!product,
  });
  const related =
    relatedQuery.data
      ?.filter(
        (item) =>
          item.id !== product?.id &&
          (item.brand === product?.brand ||
            item.category === product?.category),
      )
      .slice(0, 3) ?? [];
  return (
    <>
      <Card className="p-5">
        <h2 className="font-semibold">재고 요약</h2>
        <div className="border-line mt-4 flex justify-between border-b pb-3 text-sm">
          <span className="text-ink-subtle">전체 재고</span>
          <strong className="text-brand">
            {Number.isFinite(stock) ? stock.toLocaleString("ko-KR") : "—"}개
          </strong>
        </div>
        <ul className="mt-3 grid gap-3">
          {variants.map((item) => (
            <li
              key={JSON.stringify([item.color, item.size])}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="text-ink-subtle">
                {item.color} · {item.size}
              </span>
              <span
                className={
                  item.stock === 0
                    ? "text-negative"
                    : item.stock < 5
                      ? "text-caution"
                      : "text-positive"
                }
              >
                {item.stock}개
              </span>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 w-full"
          onClick={onManageStock}
        >
          재고 · 옵션 관리
        </Button>
      </Card>
      {product ? (
        <Card className="p-5">
          <h2 className="font-semibold">연관 상품</h2>
          <div className="mt-4 grid gap-2">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/products/$productId"
                params={{ productId: item.id }}
                search={productsSearchSchema.parse({})}
                className="bg-surface-muted hover:bg-brand-soft rounded-control flex min-w-0 items-center gap-3 p-3"
              >
                <ProductImage
                  src={item.image}
                  name={item.name}
                  className="size-10 shrink-0 rounded"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {item.name}
                  </span>
                  <span className="text-ink-subtle text-xs">
                    ₩{item.price.toLocaleString("ko-KR")}
                  </span>
                </span>
              </Link>
            ))}
            {!related.length ? (
              <p className="text-ink-subtle text-sm">연관 상품이 없습니다.</p>
            ) : null}
          </div>
        </Card>
      ) : null}
    </>
  );
}
