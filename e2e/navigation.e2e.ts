import { expect, test } from "@playwright/test";

import { login } from "./helpers";

test("로그인 후 그룹 메뉴와 검색 단축키로 이동하고 현재 위치를 표시한다", async ({
  page,
}) => {
  await login(page);
  await expect(
    page.getByRole("group", { name: "로그인 사용자" }),
  ).toContainText("demo@example.com");
  await expect(
    page.getByRole("button", { name: /사이드바 (열기|닫기)/ }),
  ).toHaveCount(0);
  const identity = page.getByRole("group", { name: "로그인 사용자" });
  const emailBounds = await identity
    .getByText("demo@example.com", { exact: true })
    .first()
    .boundingBox();
  const logoutBounds = await page
    .getByRole("button", { name: "로그아웃" })
    .boundingBox();
  expect(emailBounds).not.toBeNull();
  expect(logoutBounds).not.toBeNull();
  expect(emailBounds!.x + emailBounds!.width).toBeLessThanOrEqual(
    logoutBounds!.x,
  );
  await page
    .getByRole("banner")
    .screenshot({ path: "/tmp/react-sample-toolbar-final.png" });
  const theme = page.getByRole("button", { name: "다크 모드로 전환" });
  await expect(theme).toHaveAttribute("aria-pressed", "false");
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "라이트 모드로 전환" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  const surfaceColor = await page
    .getByRole("banner")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await expect(page.getByRole("complementary", { name: "사이드바" })).toHaveCSS(
    "background-color",
    surfaceColor,
  );
  const menu = page.getByRole("navigation", { name: "주요 메뉴" });
  await menu.getByRole("button", { name: "워크스페이스" }).click();
  await menu.getByRole("link", { name: "프로젝트", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "현재 위치" }),
  ).toContainText("워크스페이스");
  await expect(
    menu.getByRole("link", { name: "프로젝트", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("ControlOrMeta+k");
  const search = page.getByRole("combobox", { name: "메뉴 및 화면 검색" });
  await expect(search).toBeFocused();
  await search.fill("리포트");
  await expect(
    page.getByRole("dialog", { name: "빠른 이동" }).getByRole("option"),
  ).toHaveCount(1);
  await page.screenshot({
    path: "/tmp/react-sample-shell-search.png",
    animations: "disabled",
  });
  await search.press("Enter");
  await expect(
    page.getByRole("heading", { name: "분석 리포트", exact: true }),
  ).toBeVisible();
  await expect(
    menu.getByRole("button", { name: "대시보드", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  const trigger = page.getByRole("button", { name: "메뉴 및 화면 검색 열기" });
  await trigger.click();
  await search.fill("없는 메뉴");
  await expect(page.getByRole("status")).toContainText(
    "일치하는 화면이 없습니다.",
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("모바일 메뉴는 포커스를 가두고 Escape와 화면 이동 시 닫힌다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  const trigger = page.getByRole("button", { name: "사이드바 열기" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "전체 메뉴" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveCSS("border-radius", "0px");
  await page.screenshot({
    path: "/tmp/react-sample-shell-mobile-menu.png",
    animations: "disabled",
  });
  const close = drawer.getByRole("button", { name: "사이드바 닫기" });
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    drawer.getByRole("button", { name: "환경", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(drawer).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(drawer).toHaveCount(0);
  await trigger.click();
  await drawer.getByRole("link", { name: "프로젝트 운영" }).click();
  await expect(
    page.getByRole("heading", { name: "프로젝트 운영", exact: true }),
  ).toBeVisible();
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "메뉴 및 화면 검색 열기" }).click();
  await page.getByRole("combobox").fill("환경");
  await page.getByRole("option", { name: /설정/ }).click();
  await expect(page).toHaveURL(/\/settings/);
});

test("모바일 하단 메뉴가 현재 화면을 표시하고 마지막 콘텐츠를 가리지 않는다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  const nav = page.getByRole("navigation", { name: "하단 메뉴" });
  await expect(nav.getByRole("link")).toHaveCount(5);
  await expect(
    nav.getByRole("link", { name: "홈", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const contentBottom = await page
    .getByRole("main")
    .locator("section")
    .first()
    .boundingBox();
  const navBounds = await nav.boundingBox();
  expect(contentBottom!.y + contentBottom!.height).toBeLessThanOrEqual(
    navBounds!.y,
  );
  await page.screenshot({
    path: "/tmp/react-sample-mobile-bottom.png",
    animations: "disabled",
  });
  for (const [name, path] of [
    ["운영", "/operations"],
    ["분석", "/reports"],
    ["프로젝트", "/projects"],
    ["설정", "/settings"],
  ]) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe(path);
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
  await page.getByRole("button", { name: "다크 모드로 전환" }).click();
  await page.screenshot({
    path: "/tmp/react-sample-mobile-bottom-dark.png",
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(nav).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("데스크톱 푸터가 짧은 페이지 하단에 놓이고 도움말을 연다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/settings");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toBeVisible();
  const bounds = await footer.boundingBox();
  expect(Math.round(bounds!.y + bounds!.height)).toBe(
    await page.evaluate(() => window.innerHeight),
  );
  await footer.screenshot({ path: "/tmp/react-sample-desktop-footer.png" });
  await footer.getByRole("button", { name: "도움말" }).click();
  const help = page.getByRole("dialog", { name: "ProjectHub 도움말" });
  await expect(help).toBeVisible();
  await expect(help).toHaveCSS("border-radius", "12px");
  await help.getByRole("button", { name: "닫기" }).click();
  await expect(help).toHaveCount(0);
});

test("compact 모드에서도 icon 버튼의 아이콘 크기와 여백을 유지한다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/settings");
  const logout = page.getByRole("button", { name: "로그아웃" });
  await expect(logout).toHaveCSS("width", "40px");
  await expect(logout.locator("svg")).toHaveCSS("width", "16px");
  await page.getByRole("combobox", { name: "밀도" }).selectOption("compact");
  await expect(logout).toHaveCSS("width", "36px");
  await expect(logout).toHaveCSS("height", "36px");
  await expect(logout).toHaveCSS("padding-left", "0px");
  await expect(logout).toHaveCSS("padding-right", "0px");
  await expect(logout.locator("svg")).toHaveCSS("width", "16px");
  await expect(logout.locator("svg")).toHaveCSS("height", "16px");
});
