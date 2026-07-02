import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";
import { useUiStore } from "@/stores/ui-store";

const routerMockState = vi.hoisted(() => ({
  links: [] as Array<{ activeOptions?: unknown; to: string }>,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    activeProps,
    activeOptions,
    children,
    onClick,
    to,
    ...props
  }: {
    activeOptions?: unknown;
    activeProps?: unknown;
    children: ReactNode;
    onClick?: () => void;
    to: string;
  }) => {
    void activeProps;
    routerMockState.links.push({ activeOptions, to });

    return (
      <a
        href={to}
        {...props}
        onClick={(event) => {
          event.preventDefault();
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  },
  Outlet: () => <div data-testid="outlet" />,
}));

function mockDesktopViewport() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function mockMobileViewport() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query === "(max-width: 1023px)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe("DashboardLayout", () => {
  beforeEach(() => {
    routerMockState.links = [];
    mockDesktopViewport();
    useUiStore.setState({
      density: "comfortable",
      sidebarOpen: true,
      theme: "light",
    });
  });

  it("sidebar navigation과 main 영역을 렌더링한다", () => {
    renderWithProviders(<DashboardLayout />);

    expect(
      screen.getByRole("navigation", { name: "주요 메뉴" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("햄버거 버튼으로 데스크톱 사이드바와 본문 여백을 접는다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DashboardLayout />);

    const sidebar = screen.getByRole("complementary", { name: "사이드바" });
    const contentShell = screen.getByTestId("dashboard-content-shell");

    expect(sidebar).toHaveClass("translate-x-0");
    expect(contentShell).toHaveClass("lg:pl-64");

    const headerToggle = screen
      .getAllByRole("button", { name: "사이드바 닫기" })
      .find(
        (button) =>
          button.getAttribute("aria-controls") === "dashboard-sidebar",
      );

    expect(headerToggle).toBeDefined();
    await user.click(headerToggle!);

    expect(sidebar).toHaveClass("-translate-x-full");
    expect(sidebar).not.toHaveClass("lg:translate-x-0");
    expect(contentShell).toHaveClass("lg:pl-0");
  });

  it("우측 상단 테마 토글로 라이트/다크 테마를 전환한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DashboardLayout />);

    await user.click(screen.getByRole("button", { name: "다크 모드로 전환" }));

    expect(useUiStore.getState().theme).toBe("dark");
    expect(
      screen.getByRole("button", { name: "라이트 모드로 전환" }),
    ).toBeInTheDocument();
  });

  it("compact 밀도를 shell과 주요 레이아웃 간격에 반영한다", () => {
    useUiStore.setState({ density: "compact" });

    renderWithProviders(<DashboardLayout />);

    expect(screen.getByTestId("dashboard-shell")).toHaveAttribute(
      "data-density",
      "compact",
    );
    expect(screen.getByRole("complementary", { name: "사이드바" })).toHaveClass(
      "p-3",
    );
    expect(screen.getByRole("banner")).toHaveClass("h-14");
    expect(screen.getByRole("main")).toHaveClass("py-4");
  });

  it("대시보드 링크는 정확히 현재 경로일 때만 active 상태가 된다", () => {
    renderWithProviders(<DashboardLayout />);

    expect(
      routerMockState.links.find((item) => item.to === "/")?.activeOptions,
    ).toEqual({ exact: true });
  });

  it("모바일 배경 클릭으로 열린 사이드바를 닫는다", async () => {
    const user = userEvent.setup();
    mockMobileViewport();

    renderWithProviders(<DashboardLayout />);

    await user.click(
      screen.getByRole("button", { name: "사이드바 배경 닫기" }),
    );

    expect(useUiStore.getState().sidebarOpen).toBe(false);
    expect(screen.getByRole("complementary", { name: "사이드바" })).toHaveClass(
      "-translate-x-full",
    );
  });

  it("모바일에서 메뉴 이동 시 사이드바를 닫는다", async () => {
    const user = userEvent.setup();
    mockMobileViewport();

    renderWithProviders(<DashboardLayout />);

    await user.click(screen.getByRole("link", { name: "프로젝트" }));

    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });
});
