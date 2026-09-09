import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/features/products/model/product-schema";
import { useShopStore } from "@/stores/shop-store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { availableStock, shopMoney } from "../model/shop";

export function ProductPurchase({ product }: { product: Product }) {
  const [color, setColor] = useState(product.variants[0]?.color ?? "");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const items = useShopStore((state) => state.items);
  const add = useShopStore((state) => state.add);
  const existing = items.filter((line) => line.productId === product.id);
  const sameQuantity = existing
    .filter((line) => line.color === color && line.size === size)
    .reduce((n, line) => n + line.quantity, 0);
  const remaining = Math.max(
    0,
    Math.min(
      99 - sameQuantity,
      availableStock(product, color, size) - sameQuantity,
      product.stock - existing.reduce((n, line) => n + line.quantity, 0),
    ),
  );
  const valid =
    Number.isInteger(quantity) && quantity > 0 && quantity <= remaining;
  return (
    <div className="space-y-5">
      {!!product.variants.length && (
        <div className="grid grid-cols-2 gap-3">
          <label className="text-ink-muted grid gap-2 text-xs">
            색상
            <Select
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setSize("");
                setMessage("");
              }}
            >
              {[...new Set(product.variants.map((v) => v.color))].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </Select>
          </label>
          <label className="text-ink-muted grid gap-2 text-xs">
            사이즈
            <Select
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setQuantity(1);
                setMessage("");
              }}
            >
              <option value="">사이즈 선택</option>
              {product.variants
                .filter((v) => v.color === color)
                .map((v) => (
                  <option key={v.size} value={v.size} disabled={v.stock === 0}>
                    {v.size}
                    {v.stock === 0 ? " · 품절" : ""}
                  </option>
                ))}
            </Select>
          </label>
        </div>
      )}
      <div className="flex items-end justify-between gap-4">
        <label className="text-ink-muted grid w-24 gap-2 text-xs">
          수량
          <Input
            type="number"
            min={1}
            max={remaining || 1}
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.valueAsNumber || 0);
              setMessage("");
            }}
          />
        </label>
        <p className="text-ink-subtle text-xs">
          {product.variants.length && !size
            ? "옵션을 선택하세요."
            : remaining
              ? `추가 가능 ${remaining}개`
              : "품절 또는 장바구니 수량 한도입니다."}
        </p>
      </div>
      <div className="border-line flex items-center justify-between border-t pt-5">
        <span className="text-ink-muted text-sm">선택 상품 금액</span>
        <strong className="text-xl">
          {shopMoney(product.price * Math.max(0, quantity))}
        </strong>
      </div>
      <Button
        className="w-full"
        size="lg"
        disabled={!valid}
        onClick={() =>
          setMessage(
            add({ productId: product.id, color, size, quantity })
              ? "장바구니에 담았습니다."
              : "장바구니 수량 한도를 확인하세요.",
          )
        }
      >
        {product.stock === 0 ? "품절된 상품입니다" : "장바구니 담기"}
      </Button>
      {message && (
        <div
          role="status"
          className="bg-brand-soft text-brand rounded-control p-3 text-sm"
        >
          {message}
          {message === "장바구니에 담았습니다." && (
            <Link to="/shop/cart" className="ml-2 font-semibold underline">
              장바구니 보기
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
