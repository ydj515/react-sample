import type { ProductInput } from "@/features/products/model/product-schema";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { ProductImage } from "./ProductImage";

export function ProductPreviewDialog({
  open,
  onOpenChange,
  values,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: ProductInput;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>상품 미리보기</DialogTitle>
        <DialogDescription>현재 입력한 상품 정보입니다.</DialogDescription>
        <ProductImage
          src={values.image}
          name="상품 미리보기"
          className="rounded-panel mx-auto max-h-56 w-full"
        />
        <h2 className="text-xl font-bold">{values.name || "상품명"}</h2>
        <p className="text-brand text-lg font-semibold">
          ₩{Number(values.price || 0).toLocaleString("ko-KR")}
        </p>
        <p className="text-ink-subtle text-sm whitespace-pre-wrap">
          {values.description || "등록된 설명이 없습니다."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
