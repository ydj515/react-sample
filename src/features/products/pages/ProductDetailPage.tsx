import { ProductEditorPage } from "./ProductEditorPage";

export function ProductDetailPage({ productId }: { productId: string }) {
  return <ProductEditorPage productId={productId} detail />;
}
