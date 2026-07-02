import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  Outlet: () => <div data-testid="outlet" />,
}));

describe("DashboardLayout", () => {
  it("sidebar navigation과 main 영역을 렌더링한다", () => {
    renderWithProviders(<DashboardLayout />);

    expect(
      screen.getByRole("navigation", { name: "주요 메뉴" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
