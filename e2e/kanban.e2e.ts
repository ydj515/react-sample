import { expect, test } from "@playwright/test";

import { login } from "./helpers";

test.describe("칸반 보드", () => {
  test("컬럼 필터와 초기화가 URL과 결과에 반영된다", async ({ page }) => {
    await login(page);
    await page.goto("/kanban");
    await expect(
      page.getByRole("heading", { level: 1, name: "칸반 보드" }),
    ).toBeVisible();

    const initialCount = await page
      .locator('[data-testid^="kanban-card-"]')
      .count();
    expect(initialCount).toBeGreaterThan(0);

    await page
      .getByRole("combobox", { name: "칸반 컬럼 필터" })
      .selectOption("done");
    await expect(page).toHaveURL(/column=done/);
    const filtered = await page
      .locator('[data-testid^="kanban-card-"]')
      .count();
    expect(filtered).toBeLessThan(initialCount);

    await page.getByRole("button", { name: "초기화" }).click();
    await expect(page).toHaveURL(/\/kanban/);
    const restored = await page
      .locator('[data-testid^="kanban-card-"]')
      .count();
    expect(restored).toBe(initialCount);
  });

  test("카드와 컬럼 헤더의 카운트가 보인다", async ({ page }) => {
    await login(page);
    await page.goto("/kanban");
    const card = page.locator('[data-testid^="kanban-card-"]').first();
    await expect(card).toBeVisible();
    const targetColumn = page.locator(
      '[data-testid="kanban-column-in_progress"]',
    );

    const initialCountText = await targetColumn
      .locator("header span")
      .last()
      .innerText();
    expect(initialCountText).toMatch(/^\d+$/);
  });
});

test("키보드로 한 칸 아래 이동하고 취소할 수 있다", async ({ page }) => {
  await login(page);
  await page.goto("/kanban");
  const column = page.getByTestId("kanban-column-backlog-cards");

  const cards = column.locator('[data-testid^="kanban-card-"]');
  await expect(cards.first()).toBeVisible();
  const original = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-testid")),
  );

  const handle = page.getByRole("button", {
    name: "결제 실패 토스트 개선 이동",
    exact: true,
  });
  await handle.focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("status").filter({ hasText: "백로그, 2번째 위치" }),
  ).toBeAttached();
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(0);
  expect(
    await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-testid")),
    ),
  ).toEqual(original);
  await handle.focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("status").filter({ hasText: "백로그, 2번째 위치" }),
  ).toBeAttached();
  await page.keyboard.press("Space");
  await expect(cards.nth(1)).toHaveAttribute("data-testid", original[0]!);
  await expect(cards.first()).toHaveAttribute("data-testid", original[1]!);
});

test("포인터 미리보기와 다른 컬럼 저장 위치가 일치한다", async ({ page }) => {
  await login(page);
  await page.goto("/kanban");
  const source = page.getByTestId("kanban-card-card-1");

  const target = page.getByTestId("kanban-card-card-6");
  await expect(target).toBeVisible();
  const start = (await source.boundingBox())!;

  const end = (await target.boundingBox())!;
  await page.mouse.move(start.x + 50, start.y + 20);
  await page.mouse.down();
  await page.mouse.move(start.x + 65, start.y + 20, { steps: 3 });
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.mouse.move(end.x + end.width / 2, end.y + end.height * 0.8, {
    steps: 15,
  });
  const destination = page.getByTestId("kanban-column-in_progress-cards");
  await expect(destination.getByTestId("kanban-drop-placeholder")).toHaveCount(
    1,
  );
  const preview = await destination
    .locator('[data-testid^="kanban-card-"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-testid")),
    );
  await page.mouse.up();
  await expect(
    page.getByText("카드 위치를 저장했습니다.", { exact: true }),
  ).toBeVisible();
  expect(
    await destination
      .locator('[data-testid^="kanban-card-"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-testid")),
      ),
  ).toEqual(preview);
  expect(preview.indexOf("kanban-card-card-1")).toBe(1);
});

test("거절된 드래그는 원래 컬럼과 순서로 복원된다", async ({ page }) => {
  await login(page);
  await page.goto("/kanban");
  const handle = page.getByRole("button", {
    name: "테스트 실패: 강제 시뮬레이션 이동",
    exact: true,
  });
  await expect(handle).toBeVisible();
  const cards = page
    .getByTestId("kanban-column-backlog-cards")
    .locator('[data-testid^="kanban-card-"]');

  const original = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-testid")),
  );
  await handle.focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.keyboard.press("ArrowUp");
  await expect(
    page.getByRole("status").filter({ hasText: "백로그, 4번째 위치" }),
  ).toBeAttached();
  await page.keyboard.press("Space");
  await expect(
    page.getByText(
      "서버가 이동 요청을 거절했습니다. 잠시 후 다시 시도해 주세요.",
      { exact: true },
    ),
  ).toBeVisible();
  expect(
    await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-testid")),
    ),
  ).toEqual(original);
});

test("필터로 비어 보이는 컬럼에는 미리보기를 하나만 표시한다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/kanban");
  await page
    .getByRole("textbox", { name: "검색", exact: true })
    .fill("결제 실패 토스트");
  const source = page.getByTestId("kanban-card-card-1");

  const destination = page.getByTestId("kanban-column-in_progress");
  await expect(
    destination.getByTestId("kanban-column-in_progress-empty"),
  ).toBeVisible();
  const start = (await source.boundingBox())!;

  const target = (await destination.boundingBox())!;
  await page.mouse.move(start.x + 50, start.y + 20);
  await page.mouse.down();
  await page.mouse.move(start.x + 65, start.y + 20, { steps: 3 });
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.mouse.move(
    target.x + target.width / 2,
    target.y + target.height - 30,
    { steps: 15 },
  );
  await expect(destination.getByTestId("kanban-drop-placeholder")).toHaveCount(
    1,
  );
  await expect(
    destination.getByTestId("kanban-column-in_progress-empty"),
  ).toHaveCount(0);
  await page.mouse.up();
  await expect(
    page.getByText("카드 위치를 저장했습니다.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "검색", exact: true }).fill("");
  await expect(
    destination.locator('[data-testid^="kanban-card-"]'),
  ).toHaveCount(5);
  await expect(
    destination.locator('[data-testid^="kanban-card-"]').last(),
  ).toHaveAttribute("data-testid", "kanban-card-card-1");
});

test("보드 밖에 놓으면 이동을 저장하지 않는다", async ({ page }) => {
  await login(page);
  await page.goto("/kanban");
  const source = page.getByTestId("kanban-card-card-1");
  await expect(source).toBeVisible();
  const start = (await source.boundingBox())!;
  await page.mouse.move(start.x + 50, start.y + 20);
  await page.mouse.down();
  await page.mouse.move(start.x + 65, start.y + 20, { steps: 3 });
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.mouse.move(10, 10, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(0);
  await expect(
    page
      .getByTestId("kanban-column-backlog-cards")
      .locator('[data-testid^="kanban-card-"]')
      .first(),
  ).toHaveAttribute("data-testid", "kanban-card-card-1");
  await expect(
    page.getByText("카드 위치를 저장했습니다.", { exact: true }),
  ).toHaveCount(0);
});

test("필터된 카드를 제자리에 놓으면 숨긴 카드의 순서를 바꾸지 않는다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/kanban");
  await page
    .getByRole("textbox", { name: "검색", exact: true })
    .fill("결제 실패 토스트");
  await expect(page.locator('[data-testid^="kanban-card-card-"]')).toHaveCount(
    1,
  );
  const handle = page.getByRole("button", {
    name: "결제 실패 토스트 개선 이동",
    exact: true,
  });
  await handle.focus();
  // dnd-kit은 시작 직후 타이머로 종료 키 리스너를 등록한다.
  await page.keyboard.press("Space", { delay: 50 });
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(1);
  await page.keyboard.press("Space");
  await expect(page.getByTestId("kanban-drop-placeholder")).toHaveCount(0);
  await page.getByRole("textbox", { name: "검색", exact: true }).fill("");
  await expect(
    page
      .getByTestId("kanban-column-backlog-cards")
      .locator('[data-testid^="kanban-card-"]')
      .first(),
  ).toHaveAttribute("data-testid", "kanban-card-card-1");
});
