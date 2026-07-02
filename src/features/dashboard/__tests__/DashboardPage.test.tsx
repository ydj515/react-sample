import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("DashboardPage", () => {
  it("프로젝트 지표와 최근 프로젝트를 렌더링한다", async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText("전체 프로젝트")).toBeInTheDocument();
    expect(screen.getByText("최근 프로젝트")).toBeInTheDocument();
    expect(screen.getByText("Design System")).toBeInTheDocument();
  });
});
