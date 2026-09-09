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
import { EventLandingPage } from "@/features/landing/pages/event/EventLandingPage";
import { StayLandingPage } from "@/features/landing/pages/stay/StayLandingPage";
import { ProductLandingPage } from "@/features/landing/pages/product/ProductLandingPage";

function renderExperience(path: string) {
  const root = createRootRoute();
  const routes = [
    { path: "/landing/event", component: EventLandingPage },
    { path: "/landing/stay", component: StayLandingPage },
    { path: "/landing/product", component: ProductLandingPage },
  ].map((route) => createRoute({ getParentRoute: () => root, ...route }));
  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(<RouterProvider router={router} />);
}
it("날짜와 트랙의 빈 결과를 복구하고 관심 세션을 날짜 간 유지한다", async () => {
  const user = userEvent.setup();
  renderExperience("/landing/event");
  await user.click(
    await screen.findByRole("button", {
      name: "좋은 질문이 제품을 바꾼다 관심 세션",
    }),
  );
  expect(screen.getByRole("status")).toHaveTextContent("관심 세션 1개");
  await user.click(screen.getByRole("button", { name: "DAY 2 · 11.13" }));
  await user.click(screen.getByRole("button", { name: "Culture" }));
  expect(
    screen.getByText("선택한 날짜에 해당 트랙의 세션이 없습니다."),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "모든 트랙 보기" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "2개 세션 · 관심 세션 1개",
  );
  await user.click(screen.getByRole("button", { name: "DAY 1 · 11.12" }));
  await user.click(
    screen.getByRole("button", { name: "좋은 질문이 제품을 바꾼다 관심 세션" }),
  );
  expect(screen.getByRole("status")).toHaveTextContent("관심 세션 0개");
  await user.click(screen.getByRole("button", { name: "참가 신청 체험" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("2일 참가권 · ₩120,000");
});
it("객실 정보를 전환하고 날짜와 정원을 검증하며 입력 변경 시 이전 견적을 지운다", async () => {
  const user = userEvent.setup();
  renderExperience("/landing/stay");
  await user.click(await screen.findByRole("button", { name: "Garden House" }));
  expect(screen.getByText("68 m²")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "예상 숙박비 보기" }));
  expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  await user.type(screen.getByLabelText("체크인"), "2099-10-01");
  await user.type(screen.getByLabelText("체크아웃"), "2099-10-03");
  await user.selectOptions(screen.getByRole("combobox", { name: "인원" }), "4");
  await user.click(screen.getByRole("button", { name: "예상 숙박비 보기" }));
  expect(
    await screen.findByText("이 객실은 최대 2명까지 이용할 수 있습니다."),
  ).toBeVisible();
  await user.selectOptions(
    screen.getByRole("combobox", { name: "객실" }),
    "garden",
  );
  await user.click(screen.getByRole("button", { name: "예상 숙박비 보기" }));
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Garden House · 2박 · 4명",
  );
  expect(screen.getByRole("status")).toHaveTextContent("₩840,000");
  await user.selectOptions(screen.getByRole("combobox", { name: "인원" }), "3");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
it("제품 특징과 패키지 수량을 바꾸고 신청 창에서 같은 구성과 금액을 확인한다", async () => {
  const user = userEvent.setup();
  renderExperience("/landing/product");
  await user.click(await screen.findByRole("button", { name: "사운드" }));
  expect(
    screen.getByRole("heading", { name: "작은 소리에도, 깊은 공간." }),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "컨트롤" }));
  expect(screen.getByText("01 dial")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Studio set" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "수량" }), "2");
  expect(screen.getByRole("status")).toHaveTextContent("₩578,000");
  await user.click(screen.getByRole("button", { name: "선택한 구성 체험" }));
  const dialog = screen.getByRole("dialog");
  expect(dialog).toHaveTextContent("Studio set · Ivory · 2개 · ₩578,000");
  await user.click(
    within(dialog).getByRole("button", { name: "신청 창 닫기" }),
  );
  expect(
    screen.getByRole("button", { name: "선택한 구성 체험" }),
  ).toHaveFocus();
});
