import { useState } from "react";
import type { Product } from "../model/product-schema";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export function ProductInventory({
  variants,
  stock,
  onChange,
}: {
  variants: Product["variants"];
  stock: number;
  onChange: (variants: Product["variants"]) => void;
}) {
  const [color, setColor] = useState("화이트");
  const [size, setSize] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <h2 className="font-semibold">색상 · 사이즈 옵션</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[...new Set(variants.map((item) => item.color))].map((value) => (
            <span
              key={value}
              className="rounded-control bg-brand-soft text-brand border-brand/20 border px-3 py-2 text-sm"
            >
              {value}
            </span>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-ink-subtle grid gap-2 text-xs">
            색상
            <Input
              value={color}
              maxLength={30}
              onChange={(event) => setColor(event.target.value)}
            />
          </label>
          <label className="text-ink-subtle grid gap-2 text-xs">
            사이즈
            <Input
              value={size}
              maxLength={20}
              placeholder="예: 280, XL"
              onChange={(event) => setSize(event.target.value)}
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            className="self-end"
            onClick={() => {
              if (!color.trim() || !size.trim())
                return setError("색상과 사이즈를 입력하세요.");
              if (
                variants.length >= 30 ||
                variants.some(
                  (item) =>
                    item.color.toLowerCase() === color.trim().toLowerCase() &&
                    item.size.toLowerCase() === size.trim().toLowerCase(),
                )
              )
                return setError(
                  "중복 없이 최대 30개 옵션을 등록할 수 있습니다.",
                );
              onChange([
                ...variants,
                {
                  color: color.trim(),
                  size: size.trim(),
                  stock: variants.length ? 0 : stock,
                },
              ]);
              setSize("");
              setError("");
            }}
          >
            옵션 추가
          </Button>
        </div>
        {error ? (
          <p role="alert" className="text-negative mt-3 text-sm">
            {error}
          </p>
        ) : null}
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">사이즈별 재고</h2>
        <p className="text-ink-subtle mt-2 text-xs">
          옵션 재고의 합계가 전체 재고에 반영됩니다.
        </p>
        <div className="mt-5 grid gap-4">
          {variants.map((item, index) => (
            <div
              key={`${item.color}-${item.size}`}
              className="grid grid-cols-[minmax(70px,1fr)_minmax(50px,2fr)_70px] items-center gap-3"
            >
              <div className="text-sm">
                <strong>{item.size}</strong>
                <p className="text-ink-subtle text-xs">{item.color}</p>
              </div>
              <div>
                <div className="bg-surface-muted h-2 overflow-hidden rounded-full">
                  <div
                    className={
                      item.stock < 5
                        ? "bg-caution h-full"
                        : "bg-positive h-full"
                    }
                    style={{
                      width: `${Math.min(100, (Math.max(0, item.stock) / Math.max(25, ...variants.map((v) => v.stock))) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-ink-subtle mt-1 block text-xs">
                  {item.stock === 0 ? "품절" : item.stock < 5 ? "부족" : "정상"}
                </span>
              </div>
              <Input
                aria-label={`${item.color} ${item.size} 재고`}
                type="number"
                min={0}
                step={1}
                value={item.stock}
                onChange={(event) =>
                  onChange(
                    variants.map((value, i) =>
                      index === i
                        ? { ...value, stock: Number(event.target.value) }
                        : value,
                    ),
                  )
                }
              />
            </div>
          ))}
          {!variants.length ? (
            <p className="text-ink-subtle text-sm">
              등록된 옵션이 없습니다. 기본 정보에서 재고를 수정하거나 옵션을
              추가하세요.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
