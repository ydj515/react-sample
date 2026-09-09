import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useId } from "react";
import { productsQueryOptions } from "@/features/products/queries/product-queries";
import { productsSearchSchema } from "@/features/products/model/product-schema";
import { ProductInsights } from "./ProductInsights";
import { ProductInventory } from "./ProductInventory";
import { DetailTabs } from "@/shared/ui/detail-tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSaveProductMutation } from "@/features/products/queries/product-queries";
import {
  productInputSchema,
  productImages,
  productCategories,
  productStatuses,
  productStatusLabels,
  type ProductInput,
  type Product,
} from "@/features/products/model/product-schema";
import { readProductImage } from "@/features/products/model/product-image";
import { ProductImage } from "./ProductImage";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/stores/toast-store";

function FieldError({ message, id }: { message?: string; id?: string }) {
  return message ? (
    <span id={id} className="text-negative text-xs" role="alert">
      {message}
    </span>
  ) : null;
}
export function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product;
  onSaved: (product: Product) => void;
  onCancel: () => void;
}) {
  const [tag, setTag] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const imageRequest = useRef(0);
  useEffect(
    () => () => {
      imageRequest.current += 1;
    },
    [],
  );
  const form = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: product ?? {
      name: "",
      sku: "",
      brand: "",
      category: "신발",
      price: 0,
      stock: 0,
      listPrice: 0,
      variants: [],
      status: "draft",
      image: productImages[0],
      tags: [],
      description: "",
    },
  });
  const [tab, setTab] = useState("basic");
  const [preview, setPreview] = useState(false);
  const panelId = useId();
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
  const stock = useWatch({ control: form.control, name: "stock" });
  const variants = useWatch({ control: form.control, name: "variants" }) ?? [];
  const tabs = [
    { value: "basic", label: "기본 정보" },
    { value: "stock", label: "재고 · 옵션" },
    { value: "sales", label: "판매 통계" },
    { value: "reviews", label: `리뷰 (${product?.reviews.length ?? 0})` },
  ];
  const errors = form.formState.errors;
  const tags = useWatch({ control: form.control, name: "tags" });
  const image = useWatch({ control: form.control, name: "image" });
  const mutation = useSaveProductMutation(product?.id, (saved) => {
    toast.success(product ? "상품을 수정했습니다." : "상품을 등록했습니다.");
    form.reset(saved);
    onSaved(saved);
  });
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
    <>
      <form
        id="product-editor-form"
        className="grid gap-5"
        noValidate
        onSubmit={form.handleSubmit(
          (values) => mutation.mutate(values),
          (invalid) =>
            setTab(
              invalid.variants || (invalid.stock && variants.length)
                ? "stock"
                : "basic",
            ),
        )}
      >
        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid min-w-0 gap-5">
            <DetailTabs
              tabs={tabs}
              value={tab}
              onChange={setTab}
              panelId={panelId}
              label="상품 상세"
            />
            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={`${panelId}-${tab}`}
              tabIndex={0}
            >
              <Card hidden={tab !== "basic"} className="p-5">
                <h2 className="mb-5 font-semibold">기본 정보</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-ink-subtle grid gap-2 text-xs sm:col-span-2">
                    상품명
                    <Input
                      {...form.register("name")}
                      aria-label="상품명"
                      aria-invalid={!!errors.name}
                      maxLength={80}
                    />
                    <FieldError message={errors.name?.message} />
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs">
                    판매 가격 (원)
                    <Input
                      type="number"
                      min={0}
                      {...form.register("price", { valueAsNumber: true })}
                      aria-label="판매 가격 (원)"
                      aria-invalid={!!errors.price}
                    />
                    <FieldError message={errors.price?.message} />
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs">
                    정가 (원)
                    <Input
                      type="number"
                      min={0}
                      {...form.register("listPrice", { valueAsNumber: true })}
                      aria-label="정가 (원)"
                    />
                    <FieldError message={errors.listPrice?.message} />
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs">
                    카테고리
                    <Select {...form.register("category")}>
                      {productCategories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </Select>
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs">
                    브랜드
                    <Input {...form.register("brand")} aria-label="브랜드" />
                    <FieldError message={errors.brand?.message} />
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs">
                    SKU
                    <Input {...form.register("sku")} aria-label="SKU" />
                    <FieldError message={errors.sku?.message} />
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs">
                    판매 상태
                    <Select {...form.register("status")}>
                      {productStatuses.map((status) => (
                        <option key={status} value={status}>
                          {productStatusLabels[status]}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="text-ink-subtle grid gap-2 text-xs sm:col-span-2">
                    상품 설명
                    <Textarea
                      {...form.register("description")}
                      aria-label="상품 설명"
                      maxLength={1000}
                    />
                    <FieldError message={errors.description?.message} />
                  </label>
                  <div className="grid gap-2 sm:col-span-2">
                    <label
                      htmlFor={`${panelId}-tag`}
                      className="text-ink-subtle text-xs"
                    >
                      검색 태그
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id={`${panelId}-tag`}
                        aria-label="태그"
                        value={tag}
                        maxLength={20}
                        placeholder="최대 8개, 각 20자"
                        onChange={(event) => setTag(event.target.value)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.nativeEvent.isComposing
                          ) {
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
                    <FieldError message={errors.tags?.message} />
                  </div>
                  {variants.length === 0 ? (
                    <label className="text-ink-subtle grid gap-2 text-xs">
                      재고 수량
                      <Input
                        type="number"
                        min={0}
                        {...form.register("stock", { valueAsNumber: true })}
                        aria-label="재고 수량"
                      />
                      <FieldError message={errors.stock?.message} />
                    </label>
                  ) : null}
                </div>
              </Card>
              <div hidden={tab !== "stock"}>
                <ProductInventory
                  variants={variants}
                  stock={stock}
                  onChange={(next) => {
                    form.setValue("variants", next, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    form.setValue(
                      "stock",
                      next.reduce((sum, item) => sum + item.stock, 0),
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }}
                />
                {errors.variants || errors.stock ? (
                  <p role="alert" className="text-negative mt-3 text-sm">
                    재고 수량은 0 이상의 정수로 입력하세요.
                  </p>
                ) : null}
              </div>
              {tab === "sales" || tab === "reviews" ? (
                <ProductInsights product={product} view={tab} />
              ) : null}
            </div>
          </div>
          <aside className="grid min-w-0 gap-4" aria-label="상품 요약">
            <Card className="grid gap-4 p-5">
              <h2 className="text-sm font-semibold">대표 이미지</h2>
              <ProductImage
                src={image}
                name="상품 이미지 미리보기"
                className="w-full"
              />
              <label className="grid gap-2 text-sm">
                기본 이미지
                <Select
                  value={
                    (productImages as readonly string[]).includes(image)
                      ? image
                      : "uploaded"
                  }
                  onChange={(event) => {
                    imageRequest.current += 1;
                    setImageLoading(false);
                    setImageError(null);
                    form.setValue("image", event.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  {!(productImages as readonly string[]).includes(image) ? (
                    <option value="uploaded" disabled>
                      업로드한 이미지
                    </option>
                  ) : null}
                  {productImages.map((src, i) => (
                    <option key={src} value={src}>
                      {productCategories[i]}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                이미지 업로드
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="h-auto py-2"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (!file) return;
                    const request = ++imageRequest.current;
                    setImageLoading(true);
                    setImageError(null);
                    try {
                      const result = await readProductImage(file);
                      if (request === imageRequest.current)
                        form.setValue("image", result, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                    } catch (error) {
                      if (request === imageRequest.current)
                        setImageError(
                          error instanceof Error
                            ? error.message
                            : "이미지 업로드에 실패했습니다.",
                        );
                    } finally {
                      if (request === imageRequest.current)
                        setImageLoading(false);
                    }
                  }}
                />
              </label>
              <p className="text-ink-subtle text-xs">
                PNG·JPEG·WebP, 최대 2MB. 기본 이미지는 상품을 설명하는 예시
                일러스트입니다.
              </p>
              {imageLoading ? (
                <p role="status" className="text-brand text-sm">
                  이미지를 읽는 중입니다.
                </p>
              ) : null}
              <FieldError message={imageError ?? errors.image?.message} />
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold">재고 요약</h2>
              <div className="border-line mt-4 flex justify-between border-b pb-3 text-sm">
                <span className="text-ink-subtle">전체 재고</span>
                <strong className="text-brand">
                  {Number.isFinite(stock) ? stock.toLocaleString("ko-KR") : "—"}
                  개
                </strong>
              </div>
              <ul className="mt-3 grid gap-3">
                {variants.map((item) => (
                  <li
                    key={`${item.color}-${item.size}`}
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
                onClick={() => setTab("stock")}
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
                    <p className="text-ink-subtle text-sm">
                      연관 상품이 없습니다.
                    </p>
                  ) : null}
                </div>
              </Card>
            ) : null}
          </aside>
        </div>
        {mutation.error ? (
          <Card role="alert" className="text-negative p-4 text-sm">
            {mutation.error.message}
          </Card>
        ) : null}
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPreview(true)}
          >
            미리보기
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={mutation.isPending}
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending || imageLoading || !!imageError}
          >
            {mutation.isPending ? "저장 중…" : "상품 저장"}
          </Button>
        </div>
      </form>
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent>
          <DialogTitle>상품 미리보기</DialogTitle>
          <DialogDescription>현재 입력한 상품 정보입니다.</DialogDescription>
          <ProductImage
            src={image}
            name="상품 미리보기"
            className="rounded-panel mx-auto max-h-56 w-full"
          />
          <h2 className="text-xl font-bold">
            {form.getValues("name") || "상품명"}
          </h2>
          <p className="text-brand text-lg font-semibold">
            ₩{Number(form.getValues("price") || 0).toLocaleString("ko-KR")}
          </p>
          <p className="text-ink-subtle text-sm whitespace-pre-wrap">
            {form.getValues("description") || "등록된 설명이 없습니다."}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
