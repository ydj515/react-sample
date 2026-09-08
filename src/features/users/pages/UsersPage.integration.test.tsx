import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import { renderManagement } from "@/test/render-management";
import { getUser } from "../api/user-api";
import { server } from "@/mocks/server";

describe("user management", () => {
  it("검색과 필터 변경 시 페이지를 초기화하고 빈 결과를 복구한다", async () => {
    const user = userEvent.setup();
    renderManagement("/users");
    await screen.findByRole("table", { name: "사용자 목록" });
    await user.click(screen.getByRole("button", { name: "다음 페이지" }));
    expect(await screen.findByText("2 / 3 페이지")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "이전 페이지" }));
    await user.click(screen.getByRole("button", { name: "다음 페이지" }));
    await screen.findByText("2 / 3 페이지");
    await user.type(
      screen.getByRole("textbox", { name: "사용자 검색" }),
      "example.com",
    );
    expect(await screen.findByText("1 / 3 페이지")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "사용자 정렬" }),
      "oldest",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "역할" }),
      "manager",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "이용 상태" }),
      "active",
    );
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    await user.type(
      screen.getByRole("textbox", { name: "사용자 검색" }),
      "없는이름",
    );
    expect(
      await screen.findByText("조건에 맞는 사용자가 없습니다."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    await screen.findByRole("table", { name: "사용자 목록" });
    await user.click(screen.getByRole("button", { name: "새로고침" }));
    expect(screen.getByRole("textbox", { name: "사용자 검색" })).toHaveValue(
      "",
    );
  });
  it("상세 탭을 키보드로 전환하고 역할 및 상태 저장 후 이력을 확인한다", async () => {
    const user = userEvent.setup();
    renderManagement("/users/user-1?q=김민준");
    await screen.findByRole("heading", { name: "김민준" });
    await user.click(screen.getByRole("tab", { name: "기본 정보" }));
    await user.keyboard("{End}{ArrowLeft}");
    expect(await screen.findByRole("tabpanel")).toHaveAccessibleName(
      "활동 로그",
    );
    await user.keyboard("{Home}{End}");
    await screen.findByRole("heading", { name: "역할 및 이용 상태" });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "사용자 역할" }),
      "viewer",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "사용자 상태" }),
      "suspended",
    );
    await user.click(screen.getByRole("button", { name: "변경 사항 저장" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "변경 사항 저장" }),
      ).toBeDisabled(),
    );
    await user.click(screen.getByRole("tab", { name: "활동 로그" }));
    expect(
      within(await screen.findByRole("tabpanel")).getByText(
        /조회 전용 · 이용 중지/,
      ),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "← 사용자 목록" }));
    expect(
      await screen.findByRole("textbox", { name: "사용자 검색" }),
    ).toHaveValue("김민준");
    expect(await screen.findByRole("table")).toHaveTextContent("이용 중지");
  });
  it("목록 오류 후 재시도하고 저장 오류는 입력을 보존한다", async () => {
    const user = userEvent.setup();
    server.use(
      http.get("/api/users", () => HttpResponse.json({}, { status: 500 })),
    );
    renderManagement("/users");
    await screen.findByRole("alert");
    server.resetHandlers();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    await screen.findByRole("table");
    await user.type(
      screen.getByRole("textbox", { name: "사용자 검색" }),
      "김민준",
    );
    await user.click(await screen.findByRole("link", { name: "김민준" }));
    await user.click(await screen.findByRole("tab", { name: "권한 설정" }));
    server.use(
      http.patch("/api/users/:id/access", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "사용자 역할" }),
      "manager",
    );
    await user.click(screen.getByRole("button", { name: "변경 사항 저장" }));
    await screen.findByRole("alert");
    expect(screen.getByRole("combobox", { name: "사용자 역할" })).toHaveValue(
      "manager",
    );
  });
  it("회원 정보와 세부 권한을 저장하고 주문 내역으로 이동한다", async () => {
    const user = userEvent.setup();
    renderManagement("/users/user-1");
    const name = await screen.findByRole("textbox", { name: "이름" });
    await user.clear(name);
    await user.type(name, "김민준 수정");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "회원 등급" }),
      "Platinum",
    );
    await user.click(screen.getByRole("button", { name: "회원 정보 저장" }));
    await screen.findByRole("heading", { name: "김민준 수정" });
    await user.click(screen.getByRole("tab", { name: "권한 설정" }));
    const permission = screen.getByRole("switch", { name: "상품 리뷰 작성" });
    const before = (await getUser("user-1")).permissions.reviews;
    await user.click(permission);
    await user.click(screen.getByRole("button", { name: "변경 사항 저장" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "변경 사항 저장" }),
      ).toBeDisabled(),
    );
    expect((await getUser("user-1")).permissions.reviews).toBe(!before);
    await user.click(screen.getByRole("tab", { name: "주문 내역" }));
    const table = await screen.findByRole("table", { name: "회원 주문 내역" });
    await user.click(within(table).getAllByRole("link")[0]!);
    await screen.findByRole("heading", { name: "배송 현황" });
  });
  it("회원 정보 저장 실패와 입력 검증 시 입력을 보존한다", async () => {
    const user = userEvent.setup();
    renderManagement("/users/user-1");
    const name = await screen.findByRole("textbox", { name: "이름" });
    await user.clear(name);
    await user.click(screen.getByRole("button", { name: "회원 정보 저장" }));
    await screen.findByRole("alert");
    await user.type(name, "수정할 이름");
    server.use(
      http.patch("/api/users/:id/profile", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    await user.click(screen.getByRole("button", { name: "회원 정보 저장" }));
    await screen.findByRole("alert");
    expect(name).toHaveValue("수정할 이름");
  });
  it("존재하지 않는 사용자에 오류를 표시한다", async () => {
    renderManagement("/users/missing");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "사용자를 찾을 수 없습니다.",
    );
  });
});
