import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { InquiryDialog } from "../../components/InquiryDialog";
import { productBundles, getProductTotal } from "../../model/experience";
export function ProductConfigurator() {
  const [bundle, setBundle] = useState<keyof typeof productBundles>("solo");
  const [quantity, setQuantity] = useState(1);
  const selected = productBundles[bundle];
  const total = getProductTotal(bundle, quantity);
  return (
    <div className="border-line border p-6 sm:p-9">
      <p className="text-ink-subtle font-mono text-xs">
        YOUR EVERYDAY SOUND / IVORY
      </p>
      <h3 className="mt-5 text-3xl font-semibold">FORMA One</h3>
      <p className="text-ink-muted mt-3 text-sm">
        일상의 리듬에 맞는 구성을 선택하세요.
      </p>
      <div
        role="group"
        aria-label="제품 구성"
        className="mt-7 grid grid-cols-2 gap-3"
      >
        {(Object.keys(productBundles) as (keyof typeof productBundles)[]).map(
          (value) => (
            <Button
              key={value}
              variant={bundle === value ? "primary" : "secondary"}
              aria-pressed={bundle === value}
              onClick={() => setBundle(value)}
            >
              {productBundles[value].name}
            </Button>
          ),
        )}
      </div>
      <p
        className="text-ink-muted mt-5 min-h-12 text-sm leading-7"
        aria-live="polite"
      >
        {selected.includes}
      </p>
      <label
        htmlFor="forma-quantity"
        className="text-ink-subtle mt-5 mb-2 block text-xs"
      >
        수량
      </label>
      <Select
        id="forma-quantity"
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      >
        {[1, 2, 3].map((value) => (
          <option key={value} value={value}>
            {value}개
          </option>
        ))}
      </Select>
      <div className="border-line my-7 flex items-end justify-between border-t pt-7">
        <span className="text-ink-muted text-sm">구성 합계</span>
        <p role="status" className="text-3xl font-semibold">
          ₩{total.toLocaleString("ko-KR")}
        </p>
      </div>
      <InquiryDialog
        label="선택한 구성 체험"
        context="FORMA 구성 확인"
        description={`${selected.name} · Ivory · ${quantity}개 · ₩${total.toLocaleString("ko-KR")}. 실제 주문이나 결제는 진행하지 않습니다.`}
      />
      <p className="text-ink-subtle mt-5 flex items-center gap-2 text-xs">
        <Check className="size-3 shrink-0" aria-hidden />
        계정 없이 둘러보는 가상 제품
      </p>
    </div>
  );
}
