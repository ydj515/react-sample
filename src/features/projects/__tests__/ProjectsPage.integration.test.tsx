import { TestRouter } from "@/shared/lib/test/TestRouter";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("ProjectsPage", () => {
  it("프로젝트 목록을 가져와 렌더링한다", async () => {
    renderWithProviders(
      <TestRouter>
        <ProjectsPage />
      </TestRouter>,
    );

    expect(await screen.findByText("Design System")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Refresh")).toBeInTheDocument();
  });

  it("공통 빈 상태와 페이지 표시에서 필터를 초기화한다", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestRouter>
        <ProjectsPage />
      </TestRouter>,
    );
    await screen.findByText("Design System");
    await user.type(screen.getByLabelText("검색"), "없는 프로젝트");
    expect(screen.getByRole("status")).toHaveTextContent(
      "조건에 맞는 프로젝트가 없습니다.",
    );
    expect(screen.getByText("0–0 / 0건")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    expect(screen.getByLabelText("검색")).toHaveValue("");
    expect(screen.getByText("Design System")).toBeInTheDocument();
  });

  it("사용자 입력으로 프로젝트를 생성하고 목록에 반영한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TestRouter>
        <ProjectsPage />
      </TestRouter>,
    );
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
