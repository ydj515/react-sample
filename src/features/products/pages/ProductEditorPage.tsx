import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { productQueryOptions } from "../queries/product-queries";
import { productsSearchSchema } from "../model/product-schema";
import { ProductForm } from "../components/ProductForm";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryFeedback } from "@/shared/ui/query-feedback";

export function ProductEditorPage({
  productId,
  detail = false,
}: {
  productId?: string;
  detail?: boolean;
}) {
  const search = productsSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const query = useQuery({
    ...productQueryOptions(productId ?? "new"),
    enabled: !!productId,
  });
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
            ? (query.data?.name ?? "상품 상세")
            : productId
              ? "상품 수정"
              : "상품 등록"
        }
        description={
          query.data
            ? `SKU: ${query.data.sku} · ${query.data.brand} · ${query.data.category}`
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
      {productId ? (
        <QueryFeedback
          pending={query.isPending}
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}
      {!productId || query.data ? (
        <ProductForm
          key={query.data?.id ?? "new"}
          product={query.data}
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
