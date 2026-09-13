import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("CRM 연락처와 딜 및 활동 내역을 연결한다", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "워크스페이스", exact: true }).click();
  await page.getByRole("link", { name: "CRM", exact: true }).first().click();
  await page.getByLabel("담당자 이름").fill("장유진");
  await page.getByLabel("이메일", { exact: true }).fill("yujin@example.com");
  await page.getByRole("button", { name: "연락처 저장" }).click();
  await expect(
    page.getByRole("link", { name: "장유진", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("연결 연락처")
    .selectOption({ label: "장유진 · 노스스타 스튜디오" });
  await page.getByLabel("딜 이름").fill("새 CRM 계약");
  await page.getByLabel("금액 (원)").fill("4500000");
  await page.getByRole("button", { name: "딜 저장" }).click();
  await page.getByLabel("새 CRM 계약 단계").selectOption("won");
  await expect(page.getByLabel("새 CRM 계약 단계")).toHaveValue("won");
  await page.getByRole("link", { name: "장유진", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "장유진" })).toBeVisible();
  await page.getByLabel("활동 메모").fill("계약서 확인 완료");
  await page.getByRole("button", { name: "메모 저장" }).click();
  await expect(
    page.getByText("계약서 확인 완료", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("새 CRM 계약: lead → won")).toBeVisible();
});
