import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { SignInPage } from "@/pages/auth/SignInPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("SignInPage", () => {
  it("로그인 입력과 대시보드 복귀 링크를 렌더링한다", () => {
    renderWithProviders(<SignInPage />);

    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "대시보드로 돌아가기" }),
    ).toHaveAttribute("href", "/");
  });
});
