import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, it } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";
import { UserProfileForm } from "./UserProfileForm";
import { UserAccessForm } from "./UserAccessForm";

it.each(["profile", "access"] as const)(
  "%s 저장 중 입력을 잠그고 서버 응답으로 초기화한다",
  async (kind) => {
    const member = managementFixture.users[0]!;
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let submitted: unknown;
    server.use(
      http.patch(`/api/users/:id/${kind}`, async ({ request }) => {
        submitted = await request.json();
        await gate;
        return HttpResponse.json({
          ...member,
          name: "서버 정규화 이름",
          role: "manager",
        });
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(
      kind === "profile" ? (
        <UserProfileForm user={member} />
      ) : (
        <UserAccessForm user={member} />
      ),
    );
    const field =
      kind === "profile"
        ? screen.getByRole("textbox", { name: /^이름$/ })
        : screen.getByRole("combobox", { name: "사용자 역할" });
    if (kind === "profile") {
      await user.clear(field);
      await user.type(field, "입력 이름");
    } else await user.selectOptions(field, "viewer");
    const label = kind === "profile" ? "회원 정보 저장" : "변경 사항 저장";
    await user.click(screen.getByRole("button", { name: label }));
    try {
      await waitFor(() => expect(submitted).toBeDefined());
      for (const role of ["textbox", "combobox", "switch"] as const) {
        for (const input of screen.queryAllByRole(role))
          expect(input).toBeDisabled();
      }
    } finally {
      release();
    }
    await waitFor(() =>
      expect(field).toHaveValue(
        kind === "profile" ? "서버 정규화 이름" : "manager",
      ),
    );
    expect(field).toBeEnabled();
    expect(screen.getByRole("button", { name: label })).toBeDisabled();
  },
);
