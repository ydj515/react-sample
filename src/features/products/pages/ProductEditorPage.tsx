import type { Product } from "@/features/products/model/product-schema";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { productQueryOptions } from "@/features/products/queries/product-queries";
import { productsSearchSchema } from "@/features/products/model/product-schema";
import { ProductForm } from "@/features/products/components/ProductForm";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

function ProductEditorContent({
  productId,
  detail = false,
  product,
}: {
  productId?: string;
  detail?: boolean;
  product?: Product;
}) {
  const search = productsSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const back = () =>
    productId && !detail
      ? void navigate({
          to: "/products/$productId",
          params: { productId },
          search,
        })
      : void navigate({ to: "/products", search });
  return (
    <section className="grid gap-6">
      <Link
        to="/products"
        search={search}
        className="text-brand w-fit text-sm hover:underline"
      >
        ← 상품 목록
      </Link>
      <PageHeader
        title={
          detail
            ? (product?.name ?? "상품 상세")
            : productId
              ? "상품 수정"
              : "상품 등록"
        }
        description={
          product
            ? `SKU: ${product.sku} · ${product.brand} · ${product.category}`
            : "이미지와 판매 정보를 확인한 뒤 저장하세요."
        }
        actions={
          detail && productId ? (
            <Button asChild>
              <Link
                to="/products/$productId/edit"
                params={{ productId }}
                search={search}
              >
                상품 수정
              </Link>
            </Button>
          ) : undefined
        }
      />
      {!productId || product ? (
        <ProductForm
          key={product?.id ?? "new"}
          product={product}
          onCancel={back}
          onSaved={(saved) =>
            void navigate({
              to: "/products/$productId",
              params: { productId: saved.id },
              search,
            })
          }
        />
      ) : null}
    </section>
  );
}

function ExistingProductEditor({
  productId,
  detail,
}: {
  productId: string;
  detail?: boolean;
}) {
  const { data } = useSuspenseQuery(productQueryOptions(productId));
  return (
    <ProductEditorContent
      productId={productId}
      detail={detail}
      product={data}
    />
  );
}

export function ProductEditorPage({
  productId,
  detail,
}: {
  productId?: string;
  detail?: boolean;
}) {
  return (
    <QueryBoundary key={productId ?? "new"}>
      {productId ? (
        <ExistingProductEditor productId={productId} detail={detail} />
      ) : (
        <ProductEditorContent />
      )}
    </QueryBoundary>
  );
}
