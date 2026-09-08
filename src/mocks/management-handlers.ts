import { http, HttpResponse } from "msw";
import {
  userAccessSchema,
  userProfileSchema,
  roleLabels,
  userStatusLabels,
} from "@/features/users/model/user-schema";
import {
  orderNoteInputSchema,
  orderStatusInputSchema,
  orderTransitions,
  orderShippingSchema,
} from "@/features/orders/model/order-schema";
import { productInputSchema } from "@/features/products/model/product-schema";
import { createMockApiError } from "./api-error";
import { managementData as data } from "./data/management";

function error(
  request: Request,
  status: number,
  code: string,
  message: string,
) {
  return createMockApiError({
    status,
    code,
    message,
    path: new URL(request.url).pathname,
  });
}
export const managementHandlers = [
  http.patch("/api/users/:id/profile", async ({ request, params }) => {
    const user = data.users.find((item) => item.id === params.id);
    if (!user)
      return error(
        request,
        404,
        "USER_NOT_FOUND",
        "사용자를 찾을 수 없습니다.",
      );
    const parsed = userProfileSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_USER_PROFILE",
        "회원 정보를 확인하세요.",
      );
    Object.assign(user, parsed.data);
    user.activity.unshift({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      text: "회원 정보가 수정되었습니다.",
    });
    return HttpResponse.json(user);
  }),
  http.patch("/api/orders/:id/shipping", async ({ request, params }) => {
    const order = data.orders.find((item) => item.id === params.id);
    if (!order)
      return error(request, 404, "ORDER_NOT_FOUND", "주문을 찾을 수 없습니다.");
    const parsed = orderShippingSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_SHIPPING",
        "택배사와 운송장을 확인하세요.",
      );
    Object.assign(order, parsed.data);
    return HttpResponse.json(order);
  }),
  http.get("/api/users", () => HttpResponse.json(data.users)),
  http.get("/api/users/:id", ({ request, params }) => {
    const user = data.users.find((item) => item.id === params.id);
    return user
      ? HttpResponse.json(user)
      : error(request, 404, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다.");
  }),
  http.patch("/api/users/:id/access", async ({ request, params }) => {
    const user = data.users.find((item) => item.id === params.id);
    if (!user)
      return error(
        request,
        404,
        "USER_NOT_FOUND",
        "사용자를 찾을 수 없습니다.",
      );
    const parsed = userAccessSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_USER_ACCESS",
        "역할과 상태를 확인하세요.",
      );
    if (
      parsed.data.role !== user.role ||
      parsed.data.status !== user.status ||
      (parsed.data.permissions &&
        JSON.stringify(parsed.data.permissions) !==
          JSON.stringify(user.permissions))
    ) {
      user.activity.unshift({
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        text: `권한 설정: ${roleLabels[user.role]} · ${userStatusLabels[user.status]} → ${roleLabels[parsed.data.role]} · ${userStatusLabels[parsed.data.status]}(으)로 변경되었습니다.`,
      });
      Object.assign(user, parsed.data);
    }
    return HttpResponse.json(user);
  }),
  http.get("/api/orders", () => HttpResponse.json(data.orders)),
  http.get("/api/orders/:id", ({ request, params }) => {
    const order = data.orders.find((item) => item.id === params.id);
    return order
      ? HttpResponse.json(order)
      : error(request, 404, "ORDER_NOT_FOUND", "주문을 찾을 수 없습니다.");
  }),
  http.patch("/api/orders/:id/status", async ({ request, params }) => {
    const order = data.orders.find((item) => item.id === params.id);
    if (!order)
      return error(request, 404, "ORDER_NOT_FOUND", "주문을 찾을 수 없습니다.");
    const parsed = orderStatusInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_ORDER_STATUS",
        "주문 상태를 확인하세요.",
      );
    if (parsed.data.status === order.status) return HttpResponse.json(order);
    if (!orderTransitions[order.status].includes(parsed.data.status))
      return error(
        request,
        409,
        "INVALID_ORDER_TRANSITION",
        "현재 상태에서는 선택한 상태로 변경할 수 없습니다. 새로고침 후 확인하세요.",
      );
    order.status = parsed.data.status;
    order.timeline.push({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      status: order.status,
      text: `관리자가 주문을 ${order.status}(으)로 변경했습니다.`,
    });
    return HttpResponse.json(order);
  }),
  http.post("/api/orders/:id/notes", async ({ request, params }) => {
    const order = data.orders.find((item) => item.id === params.id);
    if (!order)
      return error(request, 404, "ORDER_NOT_FOUND", "주문을 찾을 수 없습니다.");
    const parsed = orderNoteInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_ORDER_NOTE",
        "메모는 1자 이상 1,000자 이하로 입력하세요.",
      );
    order.notes.unshift({
      id: crypto.randomUUID(),
      text: parsed.data.text,
      author: "운영 관리자",
      at: new Date().toISOString(),
    });
    return HttpResponse.json(order);
  }),
  http.get("/api/products", () => HttpResponse.json(data.products)),
  http.get("/api/products/:id", ({ request, params }) => {
    const product = data.products.find((item) => item.id === params.id);
    return product
      ? HttpResponse.json(product)
      : error(request, 404, "PRODUCT_NOT_FOUND", "상품을 찾을 수 없습니다.");
  }),
  http.post("/api/products", async ({ request }) => {
    const parsed = productInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_PRODUCT",
        parsed.error.issues[0]?.message ?? "상품 정보를 확인하세요.",
      );
    if (data.products.some((item) => item.sku === parsed.data.sku))
      return error(request, 409, "DUPLICATE_SKU", "이미 사용 중인 SKU입니다.");
    const now = new Date().toISOString();
    const product = {
      ...parsed.data,
      listPrice: parsed.data.listPrice ?? parsed.data.price,
      variants: parsed.data.variants ?? [],
      sales: [],
      reviews: [],
      id: `product-${crypto.randomUUID()}`,
      createdAt: now,
      updatedAt: now,
    };
    data.products.unshift(product);
    return HttpResponse.json(product, { status: 201 });
  }),
  http.put("/api/products/:id", async ({ request, params }) => {
    const product = data.products.find((item) => item.id === params.id);
    if (!product)
      return error(
        request,
        404,
        "PRODUCT_NOT_FOUND",
        "상품을 찾을 수 없습니다.",
      );
    const body: unknown = await request.json().catch(() => null);
    const parsed = productInputSchema.safeParse(
      body && typeof body === "object" && !Array.isArray(body)
        ? { ...product, ...body }
        : body,
    );
    if (!parsed.success)
      return error(
        request,
        400,
        "INVALID_PRODUCT",
        parsed.error.issues[0]?.message ?? "상품 정보를 확인하세요.",
      );
    if (
      data.products.some(
        (item) => item.sku === parsed.data.sku && item.id !== product.id,
      )
    )
      return error(request, 409, "DUPLICATE_SKU", "이미 사용 중인 SKU입니다.");
    Object.assign(product, parsed.data, {
      updatedAt: new Date().toISOString(),
    });
    return HttpResponse.json(product);
  }),
];
