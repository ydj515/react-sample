import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSaveProductMutation } from "@/features/products/queries/product-queries";
import {
  productInputSchema,
  productImages,
  type ProductInput,
  type Product,
} from "@/features/products/model/product-schema";
import { DetailTabs } from "@/shared/ui/detail-tabs";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { toast } from "@/stores/toast-store";
import { ProductInsights } from "./ProductInsights";
import { ProductInventory } from "./ProductInventory";
import { ProductBasicFields } from "./ProductBasicFields";
import { ProductImageField } from "./ProductImageField";
import { ProductSummary } from "./ProductSummary";
import { ProductPreviewDialog } from "./ProductPreviewDialog";
import { useProductImageField } from "./use-product-image-field";

export function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product;
  onSaved: (product: Product) => void;
  onCancel: () => void;
}) {
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
  const stock = useWatch({ control: form.control, name: "stock" });
  const variants = useWatch({ control: form.control, name: "variants" }) ?? [];
  const tabs = [
    { value: "basic", label: "기본 정보" },
    { value: "stock", label: "재고 · 옵션" },
    { value: "sales", label: "판매 통계" },
    { value: "reviews", label: `리뷰 (${product?.reviews.length ?? 0})` },
  ];
  const errors = form.formState.errors;
  const imageField = useProductImageField(form);
  const mutation = useSaveProductMutation(product?.id, (saved) => {
    toast.success(product ? "상품을 수정했습니다." : "상품을 등록했습니다.");
    form.reset(saved);
    onSaved(saved);
  });
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
        <fieldset disabled={mutation.isPending} className="grid min-w-0 gap-5">
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
                <div hidden={tab !== "basic"}>
                  <ProductBasicFields form={form} />
                </div>
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
              <ProductImageField
                {...imageField}
                validationError={errors.image?.message}
              />
              <ProductSummary
                product={product}
                stock={stock}
                variants={variants}
                onManageStock={() => setTab("stock")}
              />
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
              disabled={
                mutation.isPending ||
                imageField.imageLoading ||
                !!imageField.imageError
              }
            >
              {mutation.isPending ? "저장 중…" : "상품 저장"}
            </Button>
          </div>
        </fieldset>
      </form>
      <ProductPreviewDialog
        open={preview}
        onOpenChange={setPreview}
        values={form.getValues()}
      />
    </>
  );
}
