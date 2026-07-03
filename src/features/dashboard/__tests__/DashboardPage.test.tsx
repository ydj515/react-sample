import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("DashboardPage", () => {
  it("프로젝트 지표와 최근 프로젝트를 렌더링한다", async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText("전체 프로젝트")).toBeInTheDocument();
    expect(screen.getByText("최근 프로젝트")).toBeInTheDocument();
    expect(screen.getByText("Design System")).toBeInTheDocument();
  });

  it("프로젝트 조회 실패 시 오류 상태를 렌더링한다", async () => {
    server.use(
      http.get("/api/projects", () =>
        HttpResponse.json({ message: "failed" }, { status: 500 }),
      ),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "대시보드 데이터를 불러오지 못했습니다.",
    );
    expect(screen.queryByText("전체 프로젝트")).not.toBeInTheDocument();
  });
});
