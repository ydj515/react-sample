import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    params,
    to,
    ...props
  }: {
    children: ReactNode;
    params?: { projectId?: string };
    to: string;
  }) => (
    <a href={to.replace("$projectId", params?.projectId ?? "")} {...props}>
      {children}
    </a>
  ),
}));

describe("ProjectsPage", () => {
  it("프로젝트 목록을 가져와 렌더링한다", async () => {
    renderWithProviders(<ProjectsPage />);

    expect(await screen.findByText("Design System")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Refresh")).toBeInTheDocument();
  });

  it("사용자 입력으로 프로젝트를 생성하고 목록에 반영한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ProjectsPage />);
    await screen.findByText("Design System");

    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));
    await user.type(
      screen.getByLabelText("프로젝트 이름"),
      "Search Experience",
    );
    await user.type(screen.getByLabelText("담당자"), "Nari");
    await user.selectOptions(screen.getByLabelText("상태"), "active");
    await user.type(screen.getByLabelText("마감일"), "2026-10-01");
    await user.type(screen.getByLabelText("설명"), "검색 경험을 개선합니다.");
    await user.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(screen.getByText("Search Experience")).toBeInTheDocument();
    });
  });
});
