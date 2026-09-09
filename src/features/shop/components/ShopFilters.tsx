import { productCategories } from "@/features/products/model";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { FilterField } from "@/shared/ui/filter-bar";
import { shopSearchSchema, type ShopSearch } from "@/features/shop/model/shop";

export function ShopFilters({
  search,
  brands,
  onChange,
}: {
  search: ShopSearch;
  brands: string[];
  onChange: (patch: Partial<ShopSearch>) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">필터</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onChange(shopSearchSchema.parse({}))}
        >
          초기화
        </Button>
      </div>
      <FilterField label="카테고리">
        <Select
          aria-label="카테고리"
          value={search.category}
          onChange={(e) =>
            onChange({ category: e.target.value as ShopSearch["category"] })
          }
        >
          <option value="all">전체 카테고리</option>
          {productCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="브랜드">
        <Select
          aria-label="브랜드"
          value={search.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
        >
          <option value="all">전체 브랜드</option>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="가격대">
        <Select
          aria-label="가격대"
          value={search.price}
          onChange={(e) =>
            onChange({ price: e.target.value as ShopSearch["price"] })
          }
        >
          <option value="all">전체 가격</option>
          <option value="under100">10만 원 미만</option>
          <option value="100to200">10만–20만 원 미만</option>
          <option value="over200">20만 원 이상</option>
        </Select>
      </FilterField>
      <label className="flex min-h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={search.inStock}
          onChange={(e) => onChange({ inStock: e.target.checked })}
        />
        구매 가능한 상품만
      </label>
      <label className="flex min-h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={search.favorites}
          onChange={(e) => onChange({ favorites: e.target.checked })}
        />
        찜한 상품만
      </label>
    </div>
  );
}
