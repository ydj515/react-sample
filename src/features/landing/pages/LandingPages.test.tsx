import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { LandingIndexPage } from "./LandingIndexPage";
import { SaasLandingPage } from "./saas/SaasLandingPage";
import { CourseLandingPage } from "./course/CourseLandingPage";
import { AgencyLandingPage } from "./agency/AgencyLandingPage";
function renderLanding(path = "/landing") {
  const root = createRootRoute();
  const routes = [
    { path: "/landing", component: LandingIndexPage },
    { path: "/landing/saas", component: SaasLandingPage },
    { path: "/landing/course", component: CourseLandingPage },
    { path: "/landing/agency", component: AgencyLandingPage },
  ].map((route) => createRoute({ getParentRoute: () => root, ...route }));
  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(<RouterProvider router={router} />);
}
it("컬렉션에서 SaaS로 이동하고 요금 주기와 신청 내용을 연결한다", async () => {
  const user = userEvent.setup();
  renderLanding();
  await user.click(
    await screen.findByRole("link", { name: /함께 일하는 새로운 방식/ }),
  );
  await screen.findByRole("heading", { name: /좋은 아이디어가/ });
  expect(document.title).toContain("Nexus");
  await user.click(screen.getByRole("button", { name: "연간 · 20% 할인" }));
  const pro = within(screen.getByRole("article", { name: "Pro 요금제" }));
  expect(pro.getByText("연간 합계 ₩374,400")).toBeVisible();
  await user.click(pro.getByRole("button", { name: "Pro 체험하기" }));
  expect(screen.getByRole("dialog")).toHaveTextContent(
    "연간 플랜 · 합계 ₩374,400",
  );
  await user.keyboard("{Escape}");
  expect(pro.getByRole("button", { name: "Pro 체험하기" })).toHaveFocus();
  await user.click(screen.getByRole("button", { name: "월간" }));
  expect(pro.getByText("₩39,000")).toBeInTheDocument();
});
it("강의 미리보기와 커리큘럼, 선택한 수강권 내용을 제공한다", async () => {
  const user = userEvent.setup();
  renderLanding("/landing/course");
  await user.click(
    await screen.findByRole("button", { name: "강의 미리보기 열기" }),
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("생각해 볼 질문");
  await user.click(screen.getByRole("button", { name: "미리보기 닫기" }));
  await user.click(screen.getByText("상태 관리 아키텍처", { exact: true }));
  expect(screen.getByText("실습: 장바구니 설계")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Pro 수강 신청" }));
  expect(screen.getByRole("dialog")).toHaveTextContent(
    "선택한 수강권: Pro · ₩159,000",
  );
});
it("작업 분야로 필터하고 사례의 문제와 접근 방식을 열어본다", async () => {
  const user = userEvent.setup();
  renderLanding("/landing/agency");
  await user.click(await screen.findByRole("button", { name: "브랜딩" }));
  expect(screen.getByRole("status")).toHaveTextContent("1개의 콘셉트 프로젝트");
  expect(
    screen.queryByRole("button", { name: "Mono Finance 작업 보기" }),
  ).not.toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Still & Slow 작업 보기" }),
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("문제 정의");
  expect(screen.getByRole("dialog")).toHaveTextContent("접근 방식");
  await user.click(screen.getByRole("button", { name: "작업 상세 닫기" }));
  await user.click(screen.getByRole("button", { name: "전체" }));
  expect(screen.getByRole("status")).toHaveTextContent("4개의 콘셉트 프로젝트");
});
it("모바일 메뉴를 닫으면 트리거로 포커스를 돌리고 섹션 선택 시 메뉴를 닫는다", async () => {
  const user = userEvent.setup();
  renderLanding("/landing/saas");
  const trigger = await screen.findByRole("button", { name: "랜딩 메뉴 열기" });
  await user.click(trigger);
  await user.keyboard("{Escape}");
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  const link = within(screen.getByRole("dialog")).getByRole("link", {
    name: "요금제",
  });
  expect(link).toHaveAttribute("href", "#pricing");
  await user.click(link);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
