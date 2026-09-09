import { http, HttpResponse } from "msw";
import { checkoutSchema, resolveCart } from "@/features/shop/model";
import { managementData } from "@/mocks/data/management";
import { createMockApiError } from "./api-error";

export const shopHandlers = [
  http.post("/api/shop/orders", async ({ request }) => {
    const parsed = checkoutSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return createMockApiError({
        status: 400,
        code: "INVALID_CHECKOUT",
        message: "배송 정보와 장바구니를 확인하세요.",
        path: "/api/shop/orders",
      });
    const cart = resolveCart(parsed.data.items, managementData.products);
    if (!cart.valid)
      return createMockApiError({
        status: 409,
        code: "CART_UNAVAILABLE",
        message:
          "상품 또는 재고가 변경되었습니다. 장바구니를 새로고침해 확인하세요.",
        path: "/api/shop/orders",
      });
    if (parsed.data.expectedTotal !== cart.total)
      return createMockApiError({
        status: 409,
        code: "PRICE_CHANGED",
        message:
          "상품 가격이 변경되었습니다. 갱신된 금액을 확인하고 다시 주문하세요.",
        path: "/api/shop/orders",
      });
    // 결제·재고 차감·관리자 주문 생성 없이 현재 가격으로 모의 영수증만 반환한다.
    return HttpResponse.json(
      {
        id: `DEMO-${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total,
        items: cart.lines.map((line) => ({
          ...line.entry,
          name: line.product!.name,
          unitPrice: line.product!.price,
        })),
      },
      { status: 201 },
    );
  }),
];
