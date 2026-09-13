import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("CMS에서 초안을 작성하고 게시하며 목록을 필터링한다", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "워크스페이스", exact: true }).click();
  await page
    .getByRole("link", { name: "블로그 / CMS", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "새 글 작성" }).click();
  await page.getByLabel("제목", { exact: true }).fill("브라우저 게시글");
  await page.getByLabel("태그 (쉼표 구분)").fill("테스트, React");
  await page
    .getByLabel("마크다운 본문")
    .fill("## 미리보기 제목\n\n**중요한 내용**\n\n- 첫째\n- 둘째");
  await expect(
    page.getByRole("heading", { name: "미리보기 제목" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "글 저장" }).click();
  await expect(
    page.getByRole("heading", { name: "브라우저 게시글" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "글 수정" }).click();
  await page.getByLabel("게시 상태").selectOption("published");
  await page.getByRole("button", { name: "글 저장" }).click();
  await expect(
    page.getByRole("heading", { name: "브라우저 게시글" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "글 목록", exact: true }).click();
  await page
    .getByRole("combobox", { name: "태그", exact: true })
    .selectOption("테스트");
  await expect(
    page.getByRole("link", { name: "브라우저 게시글", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/tag=/);
});
