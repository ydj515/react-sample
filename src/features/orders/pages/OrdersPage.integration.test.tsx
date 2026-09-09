import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import { renderManagement } from "@/test/render-management";
import { getOrder } from "@/features/orders/api/order-api";
import { server } from "@/mocks/server";

describe("order management", () => {
  it("정렬과 상태 필터를 조합하고 검색 조건을 초기화한다", async () => {
    const user = userEvent.setup();
    renderManagement("/orders");
    await screen.findByRole("table");
    await user.click(screen.getByRole("button", { name: "다음 페이지" }));
    expect(await screen.findByText("2 / 3 페이지")).toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "주문 정렬" }),
      "amount-desc",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "주문 상태" }),
      "대기",
    );
    await user.type(screen.getByRole("textbox", { name: "주문 검색" }), "없음");
    await screen.findByText("조건에 맞는 주문이 없습니다.");
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    await screen.findByRole("table");
    await user.click(screen.getByRole("button", { name: "새로고침" }));
    await user.click(screen.getByRole("link", { name: "#2046" }));
    expect(
      await screen.findByRole("heading", { name: "주문 #2046" }),
    ).toBeInTheDocument();
  });
  it("배송 완료 처리와 메모 추가 후 상세 이력이 갱신된다", async () => {
    const user = userEvent.setup();
    renderManagement("/orders/%232046");
    await screen.findByRole("heading", { name: "주문 #2046" });
    await user.click(screen.getByRole("button", { name: "상태 변경" }));
    await screen.findByText(/처리가 종료된 주문입니다/);
    await user.click(screen.getByRole("button", { name: "메모 추가" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/메모/);
    await user.type(
      screen.getByRole("textbox", { name: "관리자 메모" }),
      "수령 확인 완료",
    );
    await user.click(screen.getByRole("button", { name: "메모 추가" }));
    expect(await screen.findByText("수령 확인 완료")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "관리자 메모" })).toHaveValue(
        "",
      ),
    );
    await user.click(screen.getByRole("link", { name: "← 주문 목록" }));
    await screen.findByRole("table");
  });
  it("상태 저장 및 메모 저장 실패 시 오류와 기존 입력을 유지한다", async () => {
    const user = userEvent.setup();
    server.use(
      http.patch("/api/orders/:id/status", () =>
        HttpResponse.json({}, { status: 409 }),
      ),
      http.post("/api/orders/:id/notes", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    renderManagement("/orders/%232046");
    await screen.findByRole("heading", { name: "주문 #2046" });
    await user.click(screen.getByRole("button", { name: "상태 변경" }));
    await screen.findByRole("alert");
    await user.type(
      screen.getByRole("textbox", { name: "관리자 메모" }),
      "보존할 메모",
    );
    await user.click(screen.getByRole("button", { name: "메모 추가" }));
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(2));
    expect(screen.getByRole("textbox", { name: "관리자 메모" })).toHaveValue(
      "보존할 메모",
    );
  });
  it("운송장을 검증하고 저장하며 상품과 결제 상세를 표시한다", async () => {
    const user = userEvent.setup();
    renderManagement("/orders/%232046");
    await screen.findByRole("heading", { name: "배송 현황" });
    expect(
      screen.getByRole("heading", { name: "주문 상품" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "결제 정보" }),
    ).toBeInTheDocument();
    const tracking = screen.getByRole("textbox", { name: "운송장 번호" });
    await user.clear(tracking);
    await user.type(tracking, "잘못된 번호");
    await user.click(screen.getByRole("button", { name: "배송 정보 저장" }));
    await screen.findByRole("alert");
    await user.clear(tracking);
    await user.type(tracking, "DEMO-123456");
    await user.click(screen.getByRole("button", { name: "배송 정보 저장" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "배송 정보 저장" }),
      ).toBeDisabled(),
    );
    expect((await getOrder("#2046")).trackingNumber).toBe("DEMO-123456");
  });
  it("없는 주문을 안내한다", async () => {
    renderManagement("/orders/missing");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "주문을 찾을 수 없습니다.",
    );
  });
});
