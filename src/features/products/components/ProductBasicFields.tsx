import { useId, useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import {
  productInputSchema,
  productCategories,
  productStatuses,
  productStatusLabels,
  type ProductInput,
} from "@/features/products/model/product-schema";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { ProductFieldError } from "./ProductFieldError";

export function ProductBasicFields({
  form,
}: {
  form: UseFormReturn<ProductInput>;
}) {
  const [tag, setTag] = useState("");
  const panelId = useId();
  const errors = form.formState.errors;
  const errorId = (name: keyof ProductInput) => `${panelId}-${name}-error`;
  const errorProps = (name: keyof ProductInput) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? errorId(name) : undefined,
  });
  const tags = useWatch({ control: form.control, name: "tags" });
  const variants = useWatch({ control: form.control, name: "variants" }) ?? [];
  const addTag = () => {
    const value = tag.trim();
    if (!value) return;
    const next = [...tags, value];
    const parsed = productInputSchema.shape.tags.safeParse(next);
    if (!parsed.success) {
      form.setError("tags", { message: parsed.error.issues[0]?.message });
      return;
    }
    form.setValue("tags", next, { shouldDirty: true, shouldValidate: true });
    setTag("");
  };
  return (
    <Card className="p-5">
      <h2 className="mb-5 font-semibold">기본 정보</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-ink-subtle grid gap-2 text-xs sm:col-span-2">
          상품명
          <Input
            {...form.register("name")}
            {...errorProps("name")}
            aria-label="상품명"
            maxLength={80}
          />
          <ProductFieldError
            id={errorId("name")}
            message={errors.name?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs">
          판매 가격 (원)
          <Input
            type="number"
            min={0}
            {...form.register("price", { valueAsNumber: true })}
            {...errorProps("price")}
            aria-label="판매 가격 (원)"
          />
          <ProductFieldError
            id={errorId("price")}
            message={errors.price?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs">
          정가 (원)
          <Input
            type="number"
            min={0}
            {...form.register("listPrice", { valueAsNumber: true })}
            {...errorProps("listPrice")}
            aria-label="정가 (원)"
          />
          <ProductFieldError
            id={errorId("listPrice")}
            message={errors.listPrice?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs">
          카테고리
          <Select {...form.register("category")} {...errorProps("category")}>
            {productCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Select>
          <ProductFieldError
            id={errorId("category")}
            message={errors.category?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs">
          브랜드
          <Input
            {...form.register("brand")}
            {...errorProps("brand")}
            aria-label="브랜드"
          />
          <ProductFieldError
            id={errorId("brand")}
            message={errors.brand?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs">
          SKU
          <Input
            {...form.register("sku")}
            {...errorProps("sku")}
            aria-label="SKU"
          />
          <ProductFieldError
            id={errorId("sku")}
            message={errors.sku?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs">
          판매 상태
          <Select {...form.register("status")} {...errorProps("status")}>
            {productStatuses.map((status) => (
              <option key={status} value={status}>
                {productStatusLabels[status]}
              </option>
            ))}
          </Select>
          <ProductFieldError
            id={errorId("status")}
            message={errors.status?.message}
          />
        </label>
        <label className="text-ink-subtle grid gap-2 text-xs sm:col-span-2">
          상품 설명
          <Textarea
            {...form.register("description")}
            {...errorProps("description")}
            aria-label="상품 설명"
            maxLength={1000}
          />
          <ProductFieldError
            id={errorId("description")}
            message={errors.description?.message}
          />
        </label>
        <div className="grid gap-2 sm:col-span-2">
          <label htmlFor={`${panelId}-tag`} className="text-ink-subtle text-xs">
            검색 태그
          </label>
          <div className="flex gap-2">
            <Input
              id={`${panelId}-tag`}
              {...errorProps("tags")}
              aria-label="태그"
              value={tag}
              maxLength={20}
              placeholder="최대 8개, 각 20자"
              onChange={(event) => setTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={addTag}
            >
              태그 추가
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((value, i) => (
              <Badge key={value}>
                #{value}
                <button
                  type="button"
                  aria-label={`${value} 태그 삭제`}
                  className="ml-2 p-1"
                  onClick={() =>
                    form.setValue(
                      "tags",
                      tags.filter((_, index) => i !== index),
                      { shouldDirty: true, shouldValidate: true },
                    )
                  }
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <ProductFieldError
            id={errorId("tags")}
            message={errors.tags?.message}
          />
        </div>
        {variants.length === 0 ? (
          <label className="text-ink-subtle grid gap-2 text-xs">
            재고 수량
            <Input
              type="number"
              min={0}
              {...form.register("stock", { valueAsNumber: true })}
              {...errorProps("stock")}
              aria-label="재고 수량"
            />
            <ProductFieldError
              id={errorId("stock")}
              message={errors.stock?.message}
            />
          </label>
        ) : null}
      </div>
    </Card>
  );
}
