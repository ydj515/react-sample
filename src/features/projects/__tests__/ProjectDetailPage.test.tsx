import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

const routerMockState = vi.hoisted(() => ({
  projectId: "project-design-system",
}));

vi.mock("@tanstack/react-router", () => ({
  useParams: () => ({ projectId: routerMockState.projectId }),
}));

describe("ProjectDetailPage", () => {
  beforeEach(() => {
    routerMockState.projectId = "project-design-system";
  });

  it("프로젝트 조회 실패와 not found 상태를 구분한다", async () => {
    server.use(
      http.get("/api/projects/:projectId", () =>
        HttpResponse.json({ message: "failed" }, { status: 500 }),
      ),
    );

    renderWithProviders(<ProjectDetailPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "프로젝트 정보를 불러오지 못했습니다.",
    );
    expect(
      screen.queryByText("프로젝트를 찾을 수 없습니다."),
    ).not.toBeInTheDocument();
  });
});
