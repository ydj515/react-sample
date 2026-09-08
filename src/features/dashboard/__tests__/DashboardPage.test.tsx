import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { OperationsPage } from "@/features/dashboard/pages/OperationsPage";
import { ReportsPage } from "@/features/dashboard/pages/ReportsPage";
import { validateDashboardSearch } from "@/features/dashboard/model/dashboard-utils";
import { dashboardAsOf } from "@/mocks/data/dashboard";
import { server } from "@/mocks/server";
import { createTestQueryClient } from "@/shared/lib/test/test-query-client";

function renderDashboard(initial = "/") {
  const root = createRootRoute();
  const routeTree = root.addChildren([
    ...[
      ["/", DashboardPage],
      ["/operations", OperationsPage],
      ["/reports", ReportsPage],
    ].map(([path, component]) =>
      createRoute({
        getParentRoute: () => root,
        path: path as string,
        component: component as typeof DashboardPage,
        validateSearch: validateDashboardSearch,
      }),
    ),
    createRoute({
      getParentRoute: () => root,
      path: "/projects/$projectId",
      component: () => <h1>프로젝트 상세</h1>,
    }),
  ]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initial] }),
    defaultPendingMinMs: 0,
  });
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router };
}

describe("dashboard pages", () => {
  it("매출 KPI와 참조 차트, 활동 및 주문을 표시한다", async () => {
    renderDashboard();
    expect(await screen.findByText("신규 사용자")).toBeInTheDocument();
    for (const name of [
      "월별 매출 추이",
      "최근 활동",
      "일별 방문자 & 전환 추이",
      "카테고리별 매출 비중",
      "주문 검색",
      "최근 주문",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(
      screen.getByRole("table", { name: "주문 검색 결과" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/샘플 기준일 2025-06-30/)).toBeInTheDocument();
  });
  it("실패 후 다시 시도하여 복구한다", async () => {
    server.use(
      http.get("/api/dashboard/commerce", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    const user = userEvent.setup();
    renderDashboard();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "대시보드 데이터를 불러오지 못했습니다.",
    );
    expect(screen.queryByText("신규 사용자")).not.toBeInTheDocument();
    server.resetHandlers();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByText("신규 사용자")).toBeInTheDocument();
  });
  it("필터 변경과 뒤로 가기에서 URL과 화면을 함께 복원한다", async () => {
    const user = userEvent.setup();
    const { router } = renderDashboard("/operations?days=7");
    await screen.findByText("전체 프로젝트");
    await user.selectOptions(screen.getByLabelText("프로젝트 담당자"), "Mina");
    expect(screen.getAllByText("Design System").length).toBeGreaterThan(0);
    expect(screen.queryByText("Billing Revamp")).not.toBeInTheDocument();
    expect(router.state.location.search).toMatchObject({
      days: 7,
      owner: "Mina",
    });
    await act(async () => router.history.back());
    expect(
      (await screen.findAllByText("Billing Revamp")).length,
    ).toBeGreaterThan(0);
    expect(screen.getByLabelText("프로젝트 담당자")).toHaveValue("all");
  });
  it("없는 담당자의 빈 결과에서 필터를 초기화한다", async () => {
    const user = userEvent.setup();
    renderDashboard("/operations?owner=missing");
    expect(
      await screen.findByText("조건에 맞는 프로젝트가 없습니다."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    expect(
      await screen.findByRole("heading", { name: "프로젝트 일정" }),
    ).toBeInTheDocument();
  });
  it("운영 일정과 마감 작업에서 프로젝트 상세로 이동한다", async () => {
    const user = userEvent.setup();
    renderDashboard("/operations?owner=Mina");
    expect(
      await screen.findByRole("heading", { name: "프로젝트 일정" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Design System 진행률" }),
    ).toHaveAttribute("value", "75");
    await user.click(
      screen.getAllByRole("link", { name: "Design System" })[0]!,
    );
    expect(
      await screen.findByRole("heading", { name: "프로젝트 상세" }),
    ).toBeInTheDocument();
  });
  it("리포트 지표 전환과 데이터 표, CSV 다운로드를 제공한다", async () => {
    const user = userEvent.setup();
    const create = vi.fn(() => "blob:report");
    const revoke = vi.fn();
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = create;
        static revokeObjectURL = revoke;
      },
    );
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    try {
      const { router } = renderDashboard("/reports?days=7&owner=Mina");
      await screen.findByText("프로젝트별 집계");
      await user.selectOptions(screen.getByLabelText("분석 지표"), "hours");
      expect(
        await screen.findByRole("heading", { name: "완료 작업 공수 비교" }),
      ).toBeInTheDocument();
      expect(router.state.location.search).toMatchObject({ metric: "hours" });
      await user.click(screen.getByText("일별 데이터 표 보기"));
      expect(screen.getAllByRole("table")).toHaveLength(2);
      const table = screen.getByRole("table", {
        name: /프로젝트 실적/,
      });
      expect(within(table).getByText("Design System")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "CSV 다운로드" }));
      expect(create).toHaveBeenCalledWith(expect.any(Blob));
      expect(click).toHaveBeenCalled();
      await waitFor(() => expect(revoke).toHaveBeenCalledWith("blob:report"), {
        timeout: 2000,
      });
    } finally {
      click.mockRestore();
      vi.unstubAllGlobals();
    }
  });
  it("빈 데이터와 완료 실적 0도 차트에서 안전하게 표시한다", async () => {
    server.use(
      http.get("/api/dashboard", () =>
        HttpResponse.json({ asOf: dashboardAsOf, projects: [], tasks: [] }),
      ),
    );
    renderDashboard("/reports");
    expect(
      await screen.findByText("조건에 맞는 프로젝트가 없습니다."),
    ).toBeInTheDocument();
  });
  it("새로고침 실패 시 기존 데이터를 유지하고 다시 갱신한다", async () => {
    const user = userEvent.setup();
    renderDashboard("/operations");
    await screen.findByText("전체 프로젝트");
    server.use(
      http.get("/api/dashboard", () => HttpResponse.json({}, { status: 500 })),
    );
    await user.click(screen.getByRole("button", { name: "새로고침" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "마지막으로 불러온 데이터를 표시합니다.",
    );
    expect(screen.getByText("전체 프로젝트")).toBeInTheDocument();
  });

  it("공통 상태 선택과 페이지 표시를 사용한다", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByRole("table", { name: "주문 검색 결과" });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "주문 상태" }),
      "완료",
    );
    const table = screen.getByRole("table", { name: "주문 검색 결과" });
    expect(within(table).queryByText("배송중")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
  it("주문 검색, 상세 필터 검증, 초기화와 페이지별 선택을 처리한다", async () => {
    const user = userEvent.setup();
    renderDashboard();
    const table = await screen.findByRole("table", { name: "주문 검색 결과" });
    expect(within(table).getAllByRole("row")).toHaveLength(9);
    await user.click(
      screen.getByRole("checkbox", { name: "현재 페이지 전체 선택" }),
    );
    expect(screen.getByText("8건 선택")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "2페이지" }));
    expect(screen.queryByText("8건 선택")).not.toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "주문 검색어" }),
      "없는 주문",
    );
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "전체 초기화" }));
    await user.click(screen.getByRole("button", { name: "상세 필터" }));
    await user.type(screen.getByLabelText("최소 금액"), "200000");
    await user.type(screen.getByLabelText("최대 금액"), "100000");
    await user.click(screen.getByRole("button", { name: "필터 적용" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "최대 금액은 최소 금액 이상이어야 합니다.",
    );
    await user.click(screen.getByRole("button", { name: "초기화" }));
    await user.selectOptions(screen.getByLabelText("담당 CS"), "김민준");
    await user.click(screen.getByRole("button", { name: "필터 적용" }));
    expect(
      screen.getByRole("button", { name: "담당 CS 필터 제거" }),
    ).toHaveTextContent("김민준");
    await user.click(screen.getByRole("button", { name: "담당 CS 필터 제거" }));
    expect(within(table).getAllByRole("row")).toHaveLength(9);
  });
  it("방문 추이 날짜, 카테고리와 보고서 이름 검증을 키보드로 조작한다", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText("신규 사용자");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "방문 추이 날짜" }),
      "0",
    );
    expect(screen.getByText("3,120명")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /신발.*₩2,184,000/ }));
    expect(screen.getByText("₩2.18M")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "새 보고서" }));
    await user.clear(screen.getByLabelText("보고서 이름"));
    await user.click(screen.getByRole("button", { name: "보고서 생성" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "보고서 이름을 입력하세요.",
    );
  });
});
