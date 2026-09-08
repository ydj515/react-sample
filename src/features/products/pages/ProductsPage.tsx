import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { productsQueryOptions } from "../queries/product-queries";
import {
  productsSearchSchema,
  productStatuses,
  productStatusLabels,
} from "../model/product-schema";
import { selectProducts } from "../model/product-utils";
import { ProductImage } from "../components/ProductImage";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { SearchInput } from "@/shared/ui/search-input";
import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { PageHeader } from "@/shared/ui/page-header";
import { Pagination } from "@/shared/ui/pagination";
import { QueryFeedback } from "@/shared/ui/query-feedback";
import { Select } from "@/shared/ui/select";

export function ProductsPage() {
  const search = productsSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const query = useQuery(productsQueryOptions());
  const products = query.data ?? [];
  const result = selectProducts(products, search);
  const change = (patch: Partial<typeof search>) =>
    void navigate({
      to: "/products",
      search: { ...search, page: 1, ...patch },
      replace: true,
    });
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="상품 관리"
        description="상품 이미지, 판매 정보와 재고를 한곳에서 관리하세요."
        actions={
          <Button asChild>
            <Link to="/products/new" search={search}>
              <Plus className="size-4" aria-hidden />
              상품 등록
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          ["전체 상품", products.length],
          [
            "재고 부족",
            products.filter(
              (product) => product.stock > 0 && product.stock <= 10,
            ).length,
          ],
          ["품절", products.filter((product) => product.stock === 0).length],
        ].map(([label, value]) => (
          <Card className="p-4" key={label}>
            <p className="text-ink-subtle text-xs">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>
      <FilterBar>
        <FilterField label="상품 검색" grow>
          <SearchInput
            value={search.q}
            placeholder="상품명, SKU, 브랜드, 태그 검색"
            onChange={(event) => change({ q: event.target.value })}
          />
        </FilterField>
        <FilterField label="판매 상태">
          <Select
            value={search.status}
            onChange={(event) =>
              change({ status: event.target.value as typeof search.status })
            }
          >
            <option value="all">전체 상태</option>
            {productStatuses.map((status) => (
              <option key={status} value={status}>
                {productStatusLabels[status]}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="재고 조건">
          <Select
            value={search.stock}
            onChange={(event) =>
              change({ stock: event.target.value as typeof search.stock })
            }
          >
            <option value="all">전체 재고</option>
            <option value="low">재고 부족 (1–10개)</option>
            <option value="out">품절 (0개)</option>
          </Select>
        </FilterField>
        <FilterField label="상품 정렬">
          <Select
            value={search.sort}
            onChange={(event) =>
              change({ sort: event.target.value as typeof search.sort })
            }
          >
            <option value="newest">최근 등록순</option>
            <option value="oldest">등록일순</option>
            <option value="name">상품명순</option>
          </Select>
        </FilterField>
        <Button
          type="button"
          variant="secondary"
          onClick={() => change(productsSearchSchema.parse({}))}
        >
          초기화
        </Button>
      </FilterBar>
      <QueryFeedback
        pending={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
      {query.data ? (
        result.total ? (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((product) => (
                <li key={product.id}>
                  <Card className="h-full overflow-hidden">
                    <Link
                      to="/products/$productId"
                      params={{ productId: product.id }}
                      search={search}
                      className="group focus-visible:outline-brand block p-4 focus-visible:outline-2 focus-visible:-outline-offset-2"
                    >
                      <div className="relative">
                        <ProductImage
                          src={product.image}
                          name={product.name}
                          className="h-40 w-full"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              product.status === "active"
                                ? "success"
                                : "neutral"
                            }
                          >
                            {productStatusLabels[product.status]}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-ink-subtle mt-4 text-xs">
                        {product.brand} · {product.sku}
                      </p>
                      <h2 className="group-hover:text-brand mt-1 text-sm font-semibold">
                        {product.name}
                      </h2>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <strong className="tabular-nums">
                          ₩{product.price.toLocaleString("ko-KR")}
                        </strong>
                        <span
                          className={`text-xs ${product.stock <= 10 ? "text-caution" : "text-ink-subtle"}`}
                        >
                          {product.stock === 0
                            ? "품절"
                            : `재고 ${product.stock}개`}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.tags.map((tag) => (
                          <Badge key={tag}>#{tag}</Badge>
                        ))}
                      </div>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
            <Pagination {...result} onChange={(page) => change({ page })} />
          </>
        ) : (
          <>
            <EmptyState
              title="조건에 맞는 상품이 없습니다."
              onReset={() => change(productsSearchSchema.parse({}))}
            />
            <Pagination {...result} onChange={(page) => change({ page })} />
          </>
        )
      ) : null}
    </section>
  );
}
