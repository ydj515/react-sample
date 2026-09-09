import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowDown, SlidersHorizontal, X } from "lucide-react";
import { productsQueryOptions } from "@/features/products/queries/product-queries";
import { ProductImage } from "@/features/products/components/ProductImage";
import {
  productCategories,
  productImages,
} from "@/features/products/model/product-schema";
import { useShopStore } from "@/stores/shop-store";
import { Button } from "@/shared/ui/button";
import { SearchInput } from "@/shared/ui/search-input";
import { Select } from "@/shared/ui/select";
import { Pagination } from "@/shared/ui/pagination";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/dialog";
import {
  shopSearchSchema,
  selectShopProducts,
  type ShopSearch,
} from "@/features/shop/model/shop";
import { ShopProductCard } from "@/features/shop/components/ShopProductCard";
import { ShopFilters } from "@/features/shop/components/ShopFilters";

function ShopPageContent() {
  const search = shopSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const query = useSuspenseQuery(productsQueryOptions());
  const favorites = useShopStore((s) => s.favorites);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const change = (patch: Partial<ShopSearch>) =>
    void navigate({
      to: "/shop",
      search: { ...search, ...patch, page: 1 },
      replace: true,
      resetScroll: false,
    });
  const result = selectShopProducts(query.data ?? [], search, favorites);
  const brands = [
    ...new Set(
      (query.data ?? [])
        .filter((p) => p.status === "active")
        .map((p) => p.brand),
    ),
  ].sort();
  return (
    <div>
      <section className="bg-brand-soft rounded-panel mb-8 grid overflow-hidden sm:grid-cols-[1.3fr_1fr]">
        <div className="p-7 sm:p-10">
          <p className="text-brand mb-4 text-xs font-bold tracking-[0.2em]">
            THE EVERYDAY COLLECTION
          </p>
          <h1 className="text-ink text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            일상의 다음 한 걸음.
          </h1>
          <p className="text-ink-muted mt-4 max-w-sm text-sm leading-7">
            좋아하는 브랜드, 나에게 맞는 한 켤레.
            <br />
            매일의 움직임을 함께할 아이템을 만나보세요.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <a href="#shop-collection">
              컬렉션 둘러보기
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </Button>
        </div>
        <div className="relative hidden items-center justify-center p-6 sm:flex">
          <div className="bg-surface/60 absolute size-60 rounded-full" />
          <ProductImage
            src={productImages[0]}
            name="슈즈 컬렉션 일러스트"
            className="relative h-60 w-full -rotate-12 bg-transparent object-contain"
          />
        </div>
      </section>
      <nav
        aria-label="상품 카테고리"
        className="border-line mb-8 flex gap-2 overflow-x-auto border-b pb-4"
      >
        {(["all", ...productCategories] as const).map((category) => (
          <Button
            key={category}
            variant={search.category === category ? "primary" : "ghost"}
            className="shrink-0"
            aria-pressed={search.category === category}
            onClick={() => change({ category })}
          >
            {category === "all" ? "전체 상품" : category}
          </Button>
        ))}
      </nav>
      <div
        id="shop-collection"
        className="grid scroll-mt-24 gap-8 lg:grid-cols-[200px_minmax(0,1fr)]"
      >
        <aside className="hidden lg:block">
          <ShopFilters search={search} brands={brands} onChange={change} />
        </aside>
        <section className="min-w-0" aria-label="상품 컬렉션">
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <div className="min-w-44 flex-1">
              <label
                className="text-ink-subtle mb-2 block text-xs"
                htmlFor="shop-search"
              >
                상품 검색
              </label>
              <SearchInput
                id="shop-search"
                type="search"
                value={search.q}
                placeholder="상품명, 브랜드 검색"
                onChange={(e) => change({ q: e.target.value })}
              />
            </div>
            <label className="text-ink-subtle grid gap-2 text-xs">
              상품 정렬
              <Select
                value={search.sort}
                onChange={(e) =>
                  change({ sort: e.target.value as ShopSearch["sort"] })
                }
              >
                <option value="popular">인기순</option>
                <option value="newest">최신순</option>
                <option value="price-asc">낮은 가격순</option>
                <option value="price-desc">높은 가격순</option>
              </Select>
            </label>
            <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DialogTrigger asChild>
                <Button className="lg:hidden" variant="secondary">
                  <SlidersHorizontal aria-hidden className="size-4" />
                  필터 열기
                </Button>
              </DialogTrigger>
              <DialogContent className="top-0 right-0 left-auto h-dvh w-[min(22rem,90vw)] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <DialogTitle className="font-semibold">
                      상품 필터
                    </DialogTitle>
                    <DialogDescription className="text-ink-subtle mt-2 text-xs">
                      조건은 선택 즉시 적용됩니다.
                    </DialogDescription>
                  </div>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" aria-label="필터 닫기">
                      <X className="size-4" />
                    </Button>
                  </DialogClose>
                </div>
                <ShopFilters
                  search={search}
                  brands={brands}
                  onChange={change}
                />
                <DialogClose asChild>
                  <Button className="mt-6 w-full">
                    {result.total}개 상품 보기
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-ink-subtle mb-5 text-xs" role="status">
            {query.data
              ? `${result.total}개의 상품`
              : "컬렉션을 불러오는 중입니다."}
          </p>
          {query.data && (
            <>
              {result.total ? (
                <ul
                  aria-label="쇼핑 상품 목록"
                  className="grid gap-x-5 gap-y-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {result.items.map((product) => (
                    <li key={product.id}>
                      <ShopProductCard
                        product={product}
                        favorite={favorites.includes(product.id)}
                        onFavorite={() => toggleFavorite(product.id)}
                        search={search}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="조건에 맞는 상품이 없습니다."
                  onReset={() => change(shopSearchSchema.parse({}))}
                />
              )}
              <Pagination
                {...result}
                onChange={(page) =>
                  void navigate({
                    to: "/shop",
                    search: { ...search, page },
                    resetScroll: false,
                  })
                }
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export function ShopPage() {
  return (
    <QueryBoundary>
      <ShopPageContent />
    </QueryBoundary>
  );
}
