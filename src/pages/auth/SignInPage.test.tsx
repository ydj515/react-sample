import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignInPage } from "@/pages/auth/SignInPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";
import { useAuthStore } from "@/stores/auth-store";

const navigateMock = vi.fn();
const searchMock = vi.fn(
  () => ({ redirect: undefined }) as { redirect?: string },
);

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useSearch: () => searchMock(),
}));

describe("SignInPage", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    searchMock.mockReturnValue({ redirect: undefined });
    useAuthStore.getState().signOut();
  });

  it("이메일/비밀번호 입력 폼을 렌더링한다", () => {
    renderWithProviders(<SignInPage />);

    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("빈 값으로 제출하면 validation 메시지를 보여준다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignInPage />);

    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("올바른 이메일을 입력해주세요."),
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("로그인 성공 시 인증 상태를 저장하고 목적지로 이동한다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignInPage />);

    await user.type(screen.getByLabelText("이메일"), "demo@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(useAuthStore.getState().user?.email).toBe("demo@example.com");
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });

  it("redirect 검색 파라미터가 있으면 해당 목적지로 이동한다", async () => {
    searchMock.mockReturnValue({ redirect: "/settings" });
    const user = userEvent.setup();
    renderWithProviders(<SignInPage />);

    await user.type(screen.getByLabelText("이메일"), "demo@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: "/settings" });
    });
  });
});
