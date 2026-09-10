import { useId } from "react";
import {
  productImages,
  productCategories,
} from "@/features/products/model/product-schema";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { ProductImage } from "./ProductImage";
import { ProductFieldError } from "./ProductFieldError";
import type { useProductImageField } from "./use-product-image-field";

type Props = ReturnType<typeof useProductImageField> & {
  validationError?: string;
};
export function ProductImageField({
  image,
  imageError,
  imageLoading,
  upload,
  select,
  validationError,
}: Props) {
  const errorId = useId();
  const error = imageError ?? validationError;
  const errorProps = {
    "aria-invalid": !!error,
    "aria-describedby": error ? errorId : undefined,
  };
  return (
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
          {...errorProps}
          value={
            (productImages as readonly string[]).includes(image)
              ? image
              : "uploaded"
          }
          onChange={select}
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
          {...errorProps}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="h-auto py-2"
          onChange={upload}
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
      <ProductFieldError id={errorId} message={error} />
    </Card>
  );
}
