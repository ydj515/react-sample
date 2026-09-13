import { CmsListPage } from "./CmsListPage";
import { CmsEditorPage } from "./CmsEditorPage";
import { CmsDetailPage } from "./CmsDetailPage";
import { cmsSearchSchema } from "@/features/cms/model/cms-schema";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { renderBusiness as renderRoutes } from "@/test/render-business";

function renderBusiness(initial: string) {
  return renderRoutes(initial, [
    {
      path: "/cms",
      component: CmsListPage,
      validateSearch: (search) => cmsSearchSchema.parse(search),
    },
    { path: "/cms/new", component: CmsEditorPage },
    { path: "/cms/$postId", component: CmsDetailPage },
    { path: "/cms/$postId/edit", component: CmsEditorPage },
  ]);
}
describe("CMS workspace", () => {
  it("filters categories, tags, state and search, then resets an empty list", async () => {
    const user = userEvent.setup();
    renderBusiness("/cms");
    await screen.findByRole("heading", { name: "블로그 / CMS" });
    await user.selectOptions(screen.getByLabelText("카테고리"), "디자인");
    expect(
      await screen.findByRole("link", { name: "디자인 시스템 작업 노트" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(
        screen.queryByRole("link", { name: "React 상태 관리 가이드" }),
      ).not.toBeInTheDocument(),
    );
    await user.selectOptions(screen.getByLabelText("태그"), "React");
    expect(await screen.findByText("조건에 맞는 글이 없습니다.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    await user.selectOptions(screen.getByLabelText("게시 상태"), "published");
    await user.type(screen.getByLabelText("글 검색"), "없는 글");
    expect(await screen.findByText("조건에 맞는 글이 없습니다.")).toBeVisible();
  });
  it("validates, previews, creates and edits a post", async () => {
    const user = userEvent.setup();
    renderBusiness("/cms/new");
    await user.click(await screen.findByRole("button", { name: "글 저장" }));
    expect(await screen.findByText("제목을 입력하세요.")).toBeVisible();
    await user.type(screen.getByLabelText("제목"), "팀 소식");
    await user.type(screen.getByLabelText("태그 (쉼표 구분)"), "소식, React");
    await user.type(
      screen.getByLabelText("마크다운 본문"),
      "## 새로운 시작\n**환영합니다**",
    );
    expect(screen.getByRole("heading", { name: "새로운 시작" })).toBeVisible();
    await user.selectOptions(screen.getByLabelText("게시 상태"), "published");
    await user.click(screen.getByRole("button", { name: "글 저장" }));
    expect(
      await screen.findByRole("heading", { name: "팀 소식" }),
    ).toBeVisible();
    await user.click(screen.getByRole("link", { name: "글 수정" }));
    const title = await screen.findByLabelText("제목");
    await user.clear(title);
    await user.type(title, "수정 소식");
    await user.click(screen.getByRole("button", { name: "글 저장" }));
    expect(
      await screen.findByRole("heading", { name: "수정 소식" }),
    ).toBeVisible();
  });
  it("preserves an editor draft when saving fails", async () => {
    server.use(
      http.post("/api/cms/posts", () =>
        HttpResponse.json({ message: "저장 실패" }, { status: 503 }),
      ),
    );
    const user = userEvent.setup();
    renderBusiness("/cms/new");
    await user.type(await screen.findByLabelText("제목"), "보존할 글");
    await user.type(screen.getByLabelText("마크다운 본문"), "본문");
    await user.click(screen.getByRole("button", { name: "글 저장" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("저장 실패");
    expect(screen.getByLabelText("제목")).toHaveValue("보존할 글");
  });
});
