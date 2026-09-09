import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useParams,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { DocsPage } from "./DocsPage";

function renderDocs(slug = "getting-started") {
  const root = createRootRoute();
  const route = createRoute({
    getParentRoute: () => root,
    path: "/docs/$slug",
    component: function DocumentTestRoute() {
      return <DocsPage slug={useParams({ strict: false }).slug!} />;
    },
  });
  const router = createRouter({
    routeTree: root.addChildren([route]),
    history: createMemoryHistory({ initialEntries: [`/docs/${slug}`] }),
  });
  render(<RouterProvider router={router} />);
}
it("본문 검색 결과에서 문서를 열고 다음 문서를 탐색한다", async () => {
  const user = userEvent.setup();
  renderDocs();
  await screen.findByRole("heading", { name: "React Sample 시작하기" });
  await user.type(screen.getByRole("searchbox", { name: "문서 검색" }), "캐시");
  const result = within(screen.getByRole("list", { name: "문서 검색 결과" }));
  await user.click(
    result.getByRole("link", { name: /서버 상태와 데이터 흐름/ }),
  );
  await screen.findByRole("heading", { name: "서버 상태와 데이터 흐름" });
  expect(screen.getByRole("searchbox")).toHaveValue("");
  await user.click(
    within(
      screen.getByRole("navigation", { name: "이전 및 다음 문서" }),
    ).getByRole("link", { name: /다음 문서/ }),
  );
  await screen.findByRole("heading", { name: "입력과 폼 검증" });
});
it("빈 검색 결과를 표시하고 Escape와 닫기로 초기화한다", async () => {
  const user = userEvent.setup();
  renderDocs();
  const search = await screen.findByRole("searchbox");
  await user.type(search, "없는문서xyz");
  expect(screen.getByRole("status")).toHaveTextContent("검색 결과 0개");
  await user.keyboard("{Escape}");
  expect(search).toHaveValue("");
  await user.type(search, "키보드");
  expect(
    screen.getByRole("list", { name: "문서 검색 결과" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "닫기" }));
  expect(search).toHaveValue("");
});
it("문서 메뉴로 이동하면 다이얼로그를 닫는다", async () => {
  const user = userEvent.setup();
  renderDocs();
  await user.click(
    await screen.findByRole("button", { name: "문서 메뉴 열기" }),
  );
  const dialog = screen.getByRole("dialog", { name: "문서 메뉴" });
  await user.click(within(dialog).getByRole("link", { name: "테스트와 검증" }));
  await screen.findByRole("heading", { name: "테스트와 검증" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    within(
      screen.getByRole("navigation", { name: "이전 및 다음 문서" }),
    ).queryByRole("link", { name: /다음 문서/ }),
  ).not.toBeInTheDocument();
});
it("알 수 없는 문서에서 시작 문서로 복구한다", async () => {
  const user = userEvent.setup();
  renderDocs("missing");
  await screen.findByRole("heading", { name: "문서를 찾을 수 없습니다" });
  await user.click(screen.getByRole("link", { name: "시작 문서로 이동" }));
  await screen.findByRole("heading", { name: "React Sample 시작하기" });
});
