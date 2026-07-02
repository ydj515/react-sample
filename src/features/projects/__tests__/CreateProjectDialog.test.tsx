import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
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
  });
});
