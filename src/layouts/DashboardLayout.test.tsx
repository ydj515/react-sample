import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

function viewport(mobile = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      matches: mobile && media === "(max-width: 1023px)",
      media,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}
function renderShell(path = "/") {
  const root = createRootRoute({ component: DashboardLayout });
  const routeTree = root.addChildren(
    [
      "/",
      "/operations",
      "/reports",
      "/projects",
      "/projects/$projectId",
      "/settings",
      "/signin",
    ].map((path) =>
      createRoute({
        getParentRoute: () => root,
        path,
        component: () => <div>페이지 본문</div>,
      }),
    ),
  );
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(<RouterProvider router={router} />);
  return { router };
}

describe("authenticated application shell", () => {
  beforeEach(() => {
    viewport();
    vi.stubGlobal("scrollTo", vi.fn());
    useUiStore.setState({
      density: "comfortable",
      theme: "light",
    });
    useAuthStore.setState({
      user: { email: "mina@example.com" },
      isAuthenticated: true,
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("데스크톱 푸터에서 도움말을 열고 닫는다", async () => {
    const user = userEvent.setup();
    renderShell();
    const footer = await screen.findByRole("contentinfo");
    expect(footer).toHaveTextContent("ProjectHub");
    await user.click(within(footer).getByRole("button", { name: "도움말" }));
    const dialog = screen.getByRole("dialog", { name: "ProjectHub 도움말" });
    expect(dialog).toHaveTextContent("메뉴 검색");
    await user.click(within(dialog).getByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("모바일 하단 메뉴로 이동하고 프로젝트 상세의 현재 탭을 표시한다", async () => {
    viewport(true);
    const user = userEvent.setup();
    const { router } = renderShell("/projects/project-design-system");
    const nav = await screen.findByRole("navigation", { name: "하단 메뉴" });
    expect(within(nav).getByRole("link", { name: "프로젝트" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    await user.click(within(nav).getByRole("link", { name: "운영" }));
    expect(router.state.location.pathname).toBe("/operations");
    expect(within(nav).getByRole("link", { name: "운영" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
  it("그룹 메뉴, 중앙 검색, 사용자 정보, 현재 위치를 표시한다", async () => {
    renderShell("/reports?days=7");
    const nav = await screen.findByRole("navigation", { name: "주요 메뉴" });
    expect(
      within(nav).getByRole("button", { name: "대시보드" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      within(nav).getByRole("link", { name: "분석 리포트" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("button", { name: "메뉴 및 화면 검색 열기" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "로그인 사용자" }),
    ).toHaveTextContent("mina@example.com");
    expect(
      screen.getByRole("navigation", { name: "현재 위치" }),
    ).toHaveTextContent("분석 리포트");
  });
  it("그룹을 펼쳐 이동하면 현재 위치와 활성 메뉴가 갱신된다", async () => {
    const user = userEvent.setup();
    renderShell();
    const nav = await screen.findByRole("navigation", { name: "주요 메뉴" });
    await user.click(within(nav).getByRole("button", { name: "워크스페이스" }));
    await user.click(within(nav).getByRole("link", { name: "프로젝트" }));
    expect(
      within(screen.getByRole("navigation", { name: "주요 메뉴" })).getByRole(
        "link",
        { name: "프로젝트" },
      ),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("navigation", { name: "현재 위치" }),
    ).toHaveTextContent("워크스페이스");
  });
  it("프로젝트 상세에서 상위 목록 링크와 상세 위치를 제공한다", async () => {
    renderShell("/projects/project-design-system");
    const breadcrumb = await screen.findByRole("navigation", {
      name: "현재 위치",
    });
    expect(
      within(breadcrumb).getByRole("link", { name: "프로젝트" }),
    ).toHaveAttribute("href", "/projects");
    expect(breadcrumb).toHaveTextContent("프로젝트 상세");
  });
  it("검색 단축키와 방향키·Enter로 화면을 이동한다", async () => {
    const user = userEvent.setup();
    const { router } = renderShell();
    await screen.findByRole("main");
    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox", {
      name: "메뉴 및 화면 검색",
    });
    await user.type(input, "프로젝트");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(router.state.location.pathname).toBe("/projects");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("검색 빈 결과와 Escape 종료, 검색창 포커스 복원을 제공한다", async () => {
    const user = userEvent.setup();
    renderShell();
    const trigger = await screen.findByRole("button", {
      name: "메뉴 및 화면 검색 열기",
    });
    await user.click(trigger);
    await user.type(screen.getByRole("combobox"), "없는메뉴");
    expect(screen.getByRole("status")).toHaveTextContent(
      "일치하는 화면이 없습니다.",
    );
    await user.keyboard("{ArrowUp}{Enter}{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("모바일 메뉴는 처음에 닫혀 있고 이동 후 닫히며 열기 버튼으로 포커스가 돌아온다", async () => {
    viewport(true);
    const user = userEvent.setup();
    renderShell();
    const trigger = await screen.findByRole("button", {
      name: "사이드바 열기",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(trigger);
    const drawer = await screen.findByRole("dialog", { name: "전체 메뉴" });
    await user.click(within(drawer).getByRole("link", { name: "분석 리포트" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("데스크톱은 고정 메뉴를 표시하고 테마, 밀도와 로그아웃을 유지한다", async () => {
    useUiStore.setState({ density: "compact" });
    const user = userEvent.setup();
    const { router } = renderShell();
    await screen.findByRole("main");
    expect(
      screen.queryByRole("button", { name: /사이드바 (열기|닫기)/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "사이드바" }),
    ).toBeVisible();
    expect(screen.getByTestId("dashboard-content-shell")).toHaveClass(
      "lg:pl-64",
    );
    expect(screen.getByRole("banner")).toHaveClass("h-14");
    const themeToggle = screen.getByRole("button", {
      name: "다크 모드로 전환",
    });
    expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    expect(themeToggle).toHaveAttribute("title", "다크 모드로 전환");
    await user.click(themeToggle);
    expect(
      screen.getByRole("button", { name: "라이트 모드로 전환" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(useUiStore.getState().theme).toBe("dark");
    await user.click(screen.getByRole("button", { name: "로그아웃" }));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(router.state.location.pathname).toBe("/signin");
  });
});
