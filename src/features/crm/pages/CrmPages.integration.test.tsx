import { CrmPage } from "./CrmPage";
import { ContactPage } from "./ContactPage";
import { crmSearchSchema } from "@/features/crm/model/crm-schema";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderBusiness as renderRoutes } from "@/test/render-business";

function renderBusiness(initial: string) {
  return renderRoutes(initial, [
    {
      path: "/crm",
      component: CrmPage,
      validateSearch: (search) => crmSearchSchema.parse(search),
    },
    { path: "/crm/contacts/$contactId", component: ContactPage },
  ]);
}
describe("CRM workspace", () => {
  it("filters companies and resets empty searches", async () => {
    const user = userEvent.setup();
    renderBusiness("/crm");
    await user.selectOptions(
      await screen.findByLabelText("회사 필터"),
      "company-1",
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("link", { name: "이준호" }),
      ).not.toBeInTheDocument(),
    );
    await user.type(screen.getByLabelText("연락처 검색"), "없는 사람");
    expect(await screen.findByText("연락처가 없습니다.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    expect(
      await screen.findAllByRole("link", { name: "이준호" }),
    ).not.toHaveLength(0);
  });
  it("creates a related contact and deal and changes its stage", async () => {
    const user = userEvent.setup();
    renderBusiness("/crm");
    await user.click(
      await screen.findByRole("button", { name: "연락처 저장" }),
    );
    expect(await screen.findByText("이름을 입력하세요.")).toBeVisible();
    await user.type(screen.getByLabelText("담당자 이름"), "박민지");
    await user.type(screen.getByLabelText("이메일"), "minji@example.com");
    await user.click(screen.getByRole("button", { name: "연락처 저장" }));
    await screen.findByRole("link", { name: "박민지" });
    const select = screen.getByLabelText("연결 연락처");

    const option = screen.getByRole("option", {
      name: "박민지 · 노스스타 스튜디오",
    });
    await user.selectOptions(select, option);
    await user.type(screen.getByLabelText("딜 이름"), "새 기회");
    await user.clear(screen.getByLabelText("금액 (원)"));
    await user.type(screen.getByLabelText("금액 (원)"), "20000");
    await user.click(screen.getByRole("button", { name: "딜 저장" }));
    await user.selectOptions(
      await screen.findByLabelText("새 기회 단계"),
      "won",
    );
    await waitFor(() =>
      expect(screen.getByLabelText("새 기회 단계")).toHaveValue("won"),
    );
  });
  it("shows related deals and records contact notes", async () => {
    const user = userEvent.setup();
    renderBusiness("/crm/contacts/contact-1");
    expect(
      await screen.findByRole("heading", { name: "김서연" }),
    ).toBeVisible();
    expect(screen.getByText("브랜드 사이트 개편")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "메모 저장" }));
    expect(await screen.findByText("메모를 입력하세요.")).toBeVisible();
    await user.type(screen.getByLabelText("활동 메모"), "계약서 전달 완료");
    await user.click(screen.getByRole("button", { name: "메모 저장" }));
    expect(await screen.findByText("계약서 전달 완료")).toBeVisible();
  });
  it("handles unknown contacts", async () => {
    renderBusiness("/crm/contacts/missing");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "연락처를 찾을 수 없습니다.",
    );
  });
});
