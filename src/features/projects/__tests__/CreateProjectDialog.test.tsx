import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("CreateProjectDialog", () => {
  it("필수 입력이 없으면 validation message를 보여준다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateProjectDialog />);
    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(
      screen.getByText("프로젝트 이름은 2자 이상이어야 합니다."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("프로젝트 이름")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("프로젝트 이름")).toHaveAttribute(
      "aria-describedby",
      "name-error",
    );
  });

  it("취소로 닫은 뒤 다시 열면 입력값과 validation 상태를 초기화한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateProjectDialog />);
    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));
    await user.type(screen.getByLabelText("프로젝트 이름"), "임시 프로젝트");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(screen.getByText("담당자를 입력해주세요.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "취소" }));
    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));

    expect(screen.getByLabelText("프로젝트 이름")).toHaveValue("");
    expect(
      screen.queryByText("담당자를 입력해주세요."),
    ).not.toBeInTheDocument();
  });

  it("생성 요청 실패 시 다이얼로그를 유지하고 오류 메시지를 보여준다", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/projects", () =>
        HttpResponse.json({ message: "failed" }, { status: 500 }),
      ),
    );

    renderWithProviders(<CreateProjectDialog />);
    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));
    await user.type(screen.getByLabelText("프로젝트 이름"), "신규 프로젝트");
    await user.type(screen.getByLabelText("담당자"), "Mina");
    await user.type(screen.getByLabelText("마감일"), "2026-08-15");
    await user.type(screen.getByLabelText("설명"), "실패 케이스 검증");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(
      await screen.findByText("프로젝트를 생성하지 못했습니다."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("프로젝트 이름")).toHaveValue("신규 프로젝트");
  });
});
