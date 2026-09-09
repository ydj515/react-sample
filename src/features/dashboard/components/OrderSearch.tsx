import { useUrlSearch } from "@/shared/lib/use-url-search";
import { commerceSearchSchema } from "@/features/dashboard/model/order-search";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Download, X } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  orderStatuses,
  type Order,
} from "@/features/dashboard/model/commerce-schema";
import {
  defaultOrderFilters,
  filterOrders,
  orderFiltersSchema,
  ordersCsv,
  type OrderFilters,
  type OrderSort,
} from "@/features/dashboard/model/commerce-utils";
import { Button } from "@/shared/ui/button";
import { Pagination } from "@/shared/ui/pagination";
import { SearchInput } from "@/shared/ui/search-input";
import { FilterField } from "@/shared/ui/filter-bar";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { CommercePanel } from "./CommerceCharts";
import { CommerceOrders } from "./CommerceOrders";
import { downloadCommerceCsv } from "./commerce-download";

const filterLabels: Record<keyof OrderFilters, string> = {
  keyword: "검색어",
  status: "상태",
  from: "시작일",
  to: "종료일",
  min: "최소 금액",
  max: "최대 금액",
  category: "카테고리",
  brands: "브랜드",
  cs: "담당 CS",
};
const pageSize = 8;
export function OrderSearch({
  orders,
  asOf,
}: {
  orders: Order[];
  asOf: string;
}) {
  const [advanced, setAdvanced] = useState(false);
  const [search, change] = useUrlSearch(commerceSearchSchema);
  const applied = search.orderFilters;
  const sort = search.orderSort;
  const setPage = (orderPage: number) => change({ orderPage });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previousOrders, setPreviousOrders] = useState(orders);
  // 스냅샷이 바뀌면 기존 페이지와 선택이 새 주문 목록을 잘못 참조하지 않게 한다.
  if (orders !== previousOrders) {
    setPreviousOrders(orders);
    setSelected(new Set());
  }
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OrderFilters>({
    resolver: zodResolver(orderFiltersSchema),
    values: applied,
  });
  const brands = useWatch({ control, name: "brands" });
  const filtered = filterOrders(orders, applied, sort);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(search.orderPage, pages);
  const selectionKey = JSON.stringify([applied, sort, page]);
  const [previousSelectionKey, setPreviousSelectionKey] =
    useState(selectionKey);
  if (previousSelectionKey !== selectionKey) {
    setPreviousSelectionKey(selectionKey);
    setSelected(new Set());
  }
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const active = (
    Object.entries(applied) as [keyof OrderFilters, string | string[]][]
  ).filter(
    ([key, value]) =>
      value.length > 0 && !(key === "status" && value === "all"),
  );
  const allBrands = Array.from(new Set(orders.map((order) => order.brand)));
  const apply = (filters: OrderFilters) => {
    change({ orderFilters: filters, orderPage: 1 });
    setSelected(new Set());
  };
  const resetAll = () => {
    reset(defaultOrderFilters);
    apply(defaultOrderFilters);
  };
  const exportOrders = selected.size
    ? filtered.filter((order) => selected.has(order.id))
    : filtered;
  return (
    <section id="order-search" className="min-w-0 scroll-mt-24">
      <CommercePanel
        title="주문 검색"
        action={
          <span className="text-ink-subtle text-xs">
            {filtered.length < orders.length
              ? `전체 ${orders.length}건 중 ${filtered.length}건 필터됨`
              : `전체 ${orders.length}건`}
          </span>
        }
      >
        <form
          onSubmit={handleSubmit(
            (filters) => {
              apply(filters);
              setAdvanced(false);
            },
            () => setAdvanced(true),
          )}
          noValidate
        >
          <div className="flex flex-wrap items-end gap-3">
            <FilterField label="주문 검색" grow>
              <SearchInput
                aria-label="주문 검색어"
                placeholder="주문번호, 고객명, 상품명으로 검색…"
                {...register("keyword")}
              />
            </FilterField>
            <FilterField label="주문 상태">
              <Select
                value={applied.status}
                onChange={(event) => {
                  setValue(
                    "status",
                    event.target.value as OrderFilters["status"],
                  );
                  void handleSubmit(apply, () => setAdvanced(true))();
                }}
              >
                <option value="all">전체 상태</option>
                {orderStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </Select>
            </FilterField>
            <Button
              type="button"
              variant="ghost"
              aria-expanded={advanced}
              aria-controls="order-advanced-filters"
              onClick={() => setAdvanced(!advanced)}
            >
              상세 필터
              <ChevronDown
                className={`size-4 ${advanced ? "rotate-180" : ""}`}
                aria-hidden
              />
            </Button>
            <Button type="submit">검색</Button>
          </div>
          <div id="order-advanced-filters" hidden={!advanced}>
            <div className="rounded-panel border-line bg-surface-muted mt-5 grid gap-4 border border-dashed p-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="grid gap-2 text-xs font-medium">
                주문일 시작
                <Input type="date" {...register("from")} />
              </label>
              <label className="grid gap-2 text-xs font-medium">
                주문일 종료
                <Input type="date" {...register("to")} />
              </label>
              <fieldset className="min-w-0">
                <legend className="mb-2 text-xs font-medium">금액 범위</legend>
                <div className="flex items-center gap-2">
                  <Input
                    aria-label="최소 금액"
                    type="number"
                    min="0"
                    placeholder="최소"
                    {...register("min")}
                  />
                  <span>~</span>
                  <Input
                    aria-label="최대 금액"
                    type="number"
                    min="0"
                    placeholder="최대"
                    {...register("max")}
                  />
                </div>
              </fieldset>
              <label className="grid content-start gap-2 text-xs font-medium">
                카테고리
                <Select aria-label="카테고리" {...register("category")}>
                  <option value="">전체 카테고리</option>
                  {Array.from(
                    new Set(orders.map((order) => order.category)),
                  ).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </Select>
              </label>
              <fieldset className="min-w-0 text-xs">
                <legend className="mb-2 font-medium">브랜드</legend>
                <details className="rounded-control border-line bg-surface border p-3">
                  <summary className="cursor-pointer">
                    {brands.length
                      ? `${brands.length}개 브랜드 선택`
                      : "전체 브랜드"}
                  </summary>
                  <div className="text-brand mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("brands", allBrands)}
                    >
                      전체 선택
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("brands", [])}
                    >
                      전체 해제
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2">
                    {allBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex min-h-8 items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={brand}
                          {...register("brands")}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </details>
              </fieldset>
              <label className="grid content-start gap-2 text-xs font-medium">
                담당 CS
                <Select aria-label="담당 CS" {...register("cs")}>
                  <option value="">전체 담당 CS</option>
                  {Array.from(new Set(orders.map((order) => order.cs))).map(
                    (cs) => (
                      <option key={cs}>{cs}</option>
                    ),
                  )}
                </Select>
              </label>
              {Object.values(errors).length ? (
                <ul
                  role="alert"
                  className="text-negative text-xs sm:col-span-2 xl:col-span-3"
                >
                  {Object.entries(errors).map(([key, error]) => (
                    <li key={key}>
                      {filterLabels[key as keyof OrderFilters]}: {error.message}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex justify-end gap-2 sm:col-span-2 xl:col-span-3">
                <Button type="button" variant="ghost" onClick={resetAll}>
                  초기화
                </Button>
                <Button type="submit">필터 적용</Button>
              </div>
            </div>
          </div>
        </form>
        {active.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink-subtle">적용된 필터</span>
            {active.map(([key, value]) => (
              <button
                key={key}
                type="button"
                aria-label={`${filterLabels[key]} 필터 제거`}
                className="bg-brand-soft text-brand flex items-center gap-1 rounded-full px-2.5 py-1.5"
                onClick={() => {
                  const next = { ...applied, [key]: defaultOrderFilters[key] };
                  reset(next);
                  apply(next);
                }}
              >
                {filterLabels[key]}:{" "}
                {Array.isArray(value) ? value.join(", ") : value}
                <X className="size-3" aria-hidden />
              </button>
            ))}
            <button
              type="button"
              className="text-ink-subtle px-2 py-2 underline"
              onClick={resetAll}
            >
              전체 초기화
            </button>
          </div>
        ) : null}
        <div className="border-line mt-5 border-t pt-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm" aria-live="polite">
              총 <strong className="text-brand">{filtered.length}</strong>
              건의 주문
              {selected.size ? (
                <span className="text-ink-subtle ml-2 text-xs">
                  {selected.size}건 선택
                </span>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-2">
              <Select
                className="w-auto"
                aria-label="주문 정렬"
                value={sort}
                onChange={(event) => {
                  change({
                    orderSort: event.target.value as OrderSort,
                    orderPage: 1,
                  });
                  setSelected(new Set());
                }}
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="amount-desc">금액 높은순</option>
                <option value="amount-asc">금액 낮은순</option>
              </Select>
              <Button
                type="button"
                variant="secondary"
                disabled={!exportOrders.length}
                onClick={() =>
                  downloadCommerceCsv(
                    ordersCsv(exportOrders),
                    `orders-${asOf}.csv`,
                  )
                }
              >
                <Download className="size-4" aria-hidden />
                {selected.size ? "선택 주문 내보내기" : "주문 내보내기"}
              </Button>
            </div>
          </div>
          <CommerceOrders
            orders={rows}
            caption="주문 검색 결과"
            selection={{
              ids: selected,
              onSelect: (id) =>
                setSelected((previous) => {
                  const next = new Set(previous);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                }),
              onSelectPage: () =>
                setSelected(
                  rows.every((row) => selected.has(row.id))
                    ? new Set()
                    : new Set(rows.map((row) => row.id)),
                ),
            }}
          />
          <div className="mt-4">
            <Pagination
              page={page}
              pages={pages}
              total={filtered.length}
              pageSize={pageSize}
              onChange={(next) => {
                setPage(next);
                setSelected(new Set());
              }}
            />
          </div>
        </div>
      </CommercePanel>
    </section>
  );
}
