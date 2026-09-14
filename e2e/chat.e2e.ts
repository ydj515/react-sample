import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("채팅 두 탭의 입력 상태, 낙관적 전송, 읽음과 답장", async ({
  page,
  context,
}) => {
  await login(page);
  await page.goto("/chat");
  const peer = await context.newPage();
  await peer.goto("/chat");
  await peer.getByLabel("참여자").selectOption("jun");
  await page.bringToFront();
  await page.getByLabel("메시지", { exact: true }).fill("새 실시간 대화");
  await expect(
    peer.getByRole("status").filter({ hasText: "민아님이 입력 중" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "전송", exact: true }).click();
  await expect(page.getByText("전송 중", { exact: true })).toBeVisible();
  await expect(
    peer
      .getByRole("region", { name: "메시지 기록" })
      .getByText("새 실시간 대화", { exact: true }),
  ).toBeVisible();
  await peer.bringToFront();
  await expect(
    page.getByRole("listitem").filter({ hasText: "새 실시간 대화" }),
  ).toContainText("읽음");
  await peer.getByLabel("메시지", { exact: true }).fill("답장입니다");
  await peer.getByRole("button", { name: "전송", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "메시지 기록" })
      .getByText("답장입니다", { exact: true }),
  ).toBeVisible();
  await peer.close();
  await page.reload();
  await expect(
    page
      .getByRole("region", { name: "메시지 기록" })
      .getByText("답장입니다", { exact: true }),
  ).toBeVisible();
});

test("채팅 상향 페이지 추가와 실패 재시도", async ({ page }) => {
  await login(page);
  await page.goto("/chat");
  const history = page.getByRole("region", { name: "메시지 기록" });
  await history.evaluate((node) => {
    node.scrollTop = 0;
  });
  await expect(page.getByText(/^21번째 프로젝트/)).toBeAttached();
  expect(await history.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "최신 메시지로" }).click();
  await page.getByRole("button", { name: "데모 설정" }).click();
  await page.getByLabel("다음 전송 실패 체험").check();
  await page.getByRole("button", { name: "설정 완료" }).click();
  await page.getByLabel("메시지", { exact: true }).fill("실패 후 복구");
  await page.getByRole("button", { name: "전송", exact: true }).click();
  await page.getByRole("button", { name: "전송 재시도" }).click();
  const sent = page.getByRole("listitem").filter({ hasText: "실패 후 복구" });
  await expect(sent).toContainText("전송됨");
  await expect(sent).toHaveCount(1);
});

for (const path of ["/chat"]) {
  test(`${path} 모바일 레이아웃`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
