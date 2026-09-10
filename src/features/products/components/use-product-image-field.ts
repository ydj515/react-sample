import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import type { ProductInput } from "@/features/products/model/product-schema";
import { readProductImage } from "@/features/products/model/product-image";

export function useProductImageField(form: UseFormReturn<ProductInput>) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const imageRequest = useRef(0);
  useEffect(
    () => () => {
      imageRequest.current += 1;
    },
    [],
  );
  const image = useWatch({ control: form.control, name: "image" });
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
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
      if (request === imageRequest.current) setImageLoading(false);
    }
  };
  const select = (event: ChangeEvent<HTMLSelectElement>) => {
    imageRequest.current += 1;
    setImageLoading(false);
    setImageError(null);
    form.setValue("image", event.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return { image, imageError, imageLoading, upload, select };
}
