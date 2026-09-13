import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("폴더에 파일을 업로드하고 검색과 텍스트 미리보기를 사용한다", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("button", { name: "워크스페이스", exact: true }).click();
  await page
    .getByRole("link", { name: "파일 관리자", exact: true })
    .first()
    .click();
  await page.getByLabel("새 폴더 이름").fill("브라우저 자료");
  await page.getByRole("button", { name: "폴더 만들기" }).click();
  await page
    .getByRole("button", { name: "브라우저 자료", exact: true })
    .click();
  await page.getByLabel("업로드할 파일").setInputFiles({
    name: "회의록.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("오늘 회의의 결정 사항"),
  });
  await expect(page.getByText("회의록.txt 업로드 완료")).toBeVisible();
  await page.getByRole("button", { name: "회의록.txt 미리보기" }).click();
  await expect(page.getByRole("dialog")).toContainText("오늘 회의의 결정 사항");
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.getByLabel("파일 검색").fill("없는 파일");
  await expect(page.getByText("파일이 없습니다.")).toBeVisible();
  await page.getByRole("button", { name: "필터 초기화" }).click();
  await expect(
    page.getByRole("button", { name: "회의록.txt 미리보기" }),
  ).toBeVisible();
});

test("드래그 업로드와 이미지 미리보기, 지원하지 않는 파일의 오류를 확인한다", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("button", { name: "워크스페이스", exact: true }).click();
  await page
    .getByRole("link", { name: "파일 관리자", exact: true })
    .first()
    .click();
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(
      new File(["drop content"], "drag.txt", { type: "text/plain" }),
    );
    return data;
  });
  await page
    .getByRole("region", { name: "파일 업로드 영역" })
    .dispatchEvent("drop", { dataTransfer: transfer });
  await expect(page.getByText("drag.txt 업로드 완료")).toBeVisible();
  await transfer.dispose();
  await page.getByLabel("업로드할 파일").setInputFiles({
    name: "unsafe.html",
    mimeType: "text/html",
    buffer: Buffer.from("<script>alert(1)</script>"),
  });
  await expect(page.getByRole("alert")).toContainText(
    "파일만 업로드할 수 있습니다.",
  );
  await page.getByLabel("업로드할 파일").setInputFiles({
    name: "pixel.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6YQAAAABJRU5ErkJggg==",
      "base64",
    ),
  });
  await page.getByRole("button", { name: "pixel.png 미리보기" }).click();
  await expect(page.getByRole("img", { name: "pixel.png" })).toBeVisible();
});

for (const path of ["/cms", "/crm", "/files"]) {
  test(`390px에서 ${path} 콘텐츠가 화면을 넘치지 않는다`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
